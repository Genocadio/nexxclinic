import { getRuntimeConfig } from "@/lib/runtime-config"

type InvoiceMutationResult =
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
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
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

export function openInvoicePreview(urlOrBase64: string) {
  const fullUrl = buildFullUrl(urlOrBase64);

  if (fullUrl.startsWith("http://") || fullUrl.startsWith("https://")) {
    const previewWindow = window.open(fullUrl, "_blank");
    if (!previewWindow) {
      throw new Error(
        "Unable to open invoice preview window. Please allow pop-ups.",
      );
    }
    return;
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
