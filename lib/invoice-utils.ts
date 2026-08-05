import { getRuntimeConfig } from "@/lib/runtime-config";
import { formatRWF } from "@/lib/utils";

export type InvoiceMutationResult =
  | {
      status?: string;
      message?: string;
      messages?: Array<{ text?: string }>;
      data?: { signedUrl?: string | null } | null;
    }
  | undefined;

export function getInvoiceErrorMessage(
  response: InvoiceMutationResult,
  fallback = "Failed to generate invoice",
): string {
  if (response?.message) return response.message;
  const fromMessages = response?.messages
    ?.map((m) => m.text)
    .filter(Boolean)
    .join(", ");
  return fromMessages || fallback;
}

function buildFullUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  // Signed storage URLs returned by the backend must be served through the
  // frontend proxy route so the browser never talks to the backend or storage
  // directly. The rewrite maps /storage/sign/:path* onto
  // ${SUPABASE_INTERNAL_URL}/storage/v1/object/sign/:path*.
  if (path.startsWith("/storage/v1/object/sign/")) {
    return path.replace(/^\/storage\/v1\/object\/sign\//, "/storage/sign/");
  }
  if (path.startsWith("/storage/sign/")) {
    return path; // already proxied
  }
  if (path.startsWith("/storage/v1/object/public/")) {
    return `/supa/${path.slice("/storage/v1/object/public/".length)}`;
  }
  if (path.startsWith("/supa/")) {
    return path; // already proxied public file
  }

  // Any other root-relative path is already frontend-relative.
  if (path.startsWith("/")) {
    return path;
  }

  const base = getRuntimeConfig().API_BASE_URL || "";
  const separator = base.endsWith("/") ? "" : "/";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${separator}${cleanPath}`;
}

/** Always generate (or retrieve) invoice via backend generateInvoice — never getInvoice first. */
export async function resolveInvoiceUrl(
  billId: string,
  generateInvoice: (billId: string) => Promise<InvoiceMutationResult>,
): Promise<string> {
  const response = await generateInvoice(billId);
  const signedUrl = response?.data?.signedUrl;
  if (response?.status === "SUCCESS" && signedUrl) {
    return buildFullUrl(signedUrl);
  }
  throw new Error(getInvoiceErrorMessage(response));
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  totalDue: number;
  paid: number;
  balance: number;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

/**
 * Builds the standalone printable invoice HTML document. Extracted from
 * BillingPageContent.handlePrintBillingInvoice so the page stays lean.
 */
export function buildInvoiceHtml(options: {
  invoiceNumber: string;
  invoiceDate: string;
  patientName?: string;
  patientId?: string;
  paymentMethod?: string;
  visitDate?: string;
  items: InvoiceLineItem[];
  totals: InvoiceTotals;
}): string {
  const {
    invoiceNumber,
    invoiceDate,
    patientName,
    patientId,
    paymentMethod,
    visitDate,
    items,
    totals,
  } = options;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice ${escapeHtml(invoiceNumber)}</title>
    <style>
      @page { size: A4; margin: 16mm; }
      body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; margin: 0; }
      .invoice { width: 100%; }
      .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111827; padding-bottom: 12px; margin-bottom: 18px; }
      .title { font-size: 24px; font-weight: 700; margin: 0; letter-spacing: .3px; }
      .muted { color: #6b7280; font-size: 12px; margin: 2px 0; }
      .section { margin-bottom: 16px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; }
      th, td { border: 1px solid #e5e7eb; padding: 8px; font-size: 12px; }
      th { background: #f3f4f6; text-align: left; }
      .right { text-align: right; }
      .totals { width: 320px; margin-left: auto; margin-top: 14px; }
      .totals td { border: none; padding: 4px 0; }
      .grand td { border-top: 1px solid #d1d5db; font-weight: 700; padding-top: 8px; }
      .footer { margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 10px; font-size: 11px; color: #6b7280; }
    </style>
  </head>
  <body>
    <div class="invoice">
      <div class="header">
        <div>
          <h1 class="title">med Invoice</h1>
          <p class="muted">Formal Billing Statement</p>
        </div>
        <div>
          <p class="muted"><strong>Invoice #:</strong> ${escapeHtml(invoiceNumber)}</p>
          <p class="muted"><strong>Date:</strong> ${new Date(invoiceDate).toLocaleString()}</p>
        </div>
      </div>

      <div class="section grid">
        <div class="box">
          <p class="muted"><strong>Patient</strong></p>
          <p>${escapeHtml(patientName || "N/A")}</p>
          <p class="muted">Patient ID: ${escapeHtml(patientId || "N/A")}</p>
        </div>
        <div class="box">
          <p class="muted"><strong>Payment</strong></p>
          <p class="muted">Method: ${escapeHtml((paymentMethod || "MOBILE_MONEY").toUpperCase())}</p>
          <p class="muted">Visit Date: ${visitDate ? new Date(visitDate).toLocaleDateString() : ""}</p>
        </div>
      </div>

      <div class="section">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="right">Qty</th>
              <th class="right">Unit Price</th>
              <th class="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item) => `<tr>
                  <td>${escapeHtml(item.description || "Item")}</td>
                  <td class="right">${item.quantity}</td>
                  <td class="right">${formatRWF(item.unitPrice || 0)}</td>
                  <td class="right">${formatRWF(item.lineTotal || 0)}</td>
                </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <table class="totals">
        <tr><td>Subtotal</td><td class="right">${formatRWF(totals.subtotal || 0)}</td></tr>
        <tr><td>Discount</td><td class="right">-${formatRWF(totals.discount || 0)}</td></tr>
        <tr class="grand"><td>Total Due</td><td class="right">${formatRWF(totals.totalDue || 0)}</td></tr>
        <tr><td>Paid</td><td class="right">${formatRWF(totals.paid || 0)}</td></tr>
        <tr><td>Balance</td><td class="right">${formatRWF(totals.balance || 0)}</td></tr>
      </table>

      <div class="footer">
        Generated by med Billing Module.
      </div>
    </div>
  </body>
</html>`;
}

export function openInvoicePreview(urlOrBase64: string) {
  const fullUrl = buildFullUrl(urlOrBase64);

  // Signed/public storage URLs are proxied through the frontend (e.g.
  // /storage/sign/... or /supa/...). Open them directly — they are same-origin
  // relative paths, never base64.
  if (
    fullUrl.startsWith("http://") ||
    fullUrl.startsWith("https://") ||
    fullUrl.startsWith("/")
  ) {
    const previewWindow = window.open(fullUrl, "_blank");
    if (!previewWindow) {
      throw new Error(
        "Unable to open invoice preview window. Please allow pop-ups.",
      );
    }
    return;
  }

  // Only a data: PDF is decoded from base64. Anything else (raw base64 or an
  // unknown scheme) would blow up atob with "invalid characters".
  if (!fullUrl.startsWith("data:")) {
    throw new Error(
      "Unable to open invoice preview: unrecognized invoice URL.",
    );
  }

  const base64Data = urlOrBase64.replace(/^data:application\/pdf;base64,/, "");
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  const previewWindow = window.open(blobUrl, "_blank");
  if (!previewWindow) {
    URL.revokeObjectURL(blobUrl);
    throw new Error(
      "Unable to open invoice preview window. Please allow pop-ups.",
    );
  }
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
}
