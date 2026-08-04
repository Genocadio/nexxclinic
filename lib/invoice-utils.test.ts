import { describe, expect, it } from "vitest";
import {
  buildInvoiceHtml,
  getInvoiceErrorMessage,
  resolveInvoiceUrl,
} from "@/lib/invoice-utils";

describe("getInvoiceErrorMessage", () => {
  it("prefers the top-level message", () => {
    expect(
      getInvoiceErrorMessage({ status: "ERROR", message: "Billing failed" }),
    ).toBe("Billing failed");
  });

  it("joins field messages", () => {
    expect(
      getInvoiceErrorMessage({
        messages: [{ text: "Line A" }, { text: "Line B" }],
      }),
    ).toBe("Line A, Line B");
  });

  it("falls back when nothing is present", () => {
    expect(getInvoiceErrorMessage(undefined)).toBe("Failed to generate invoice");
    expect(getInvoiceErrorMessage({ status: "ERROR" }, "Custom fallback")).toBe(
      "Custom fallback",
    );
  });
});

describe("resolveInvoiceUrl", () => {
  it("returns absolute signed urls as-is", async () => {
    const generateInvoice = async () => ({
      status: "SUCCESS",
      data: { signedUrl: "https://cdn.example.com/invoice.pdf" },
    });
    await expect(resolveInvoiceUrl("bill-1", generateInvoice)).resolves.toBe(
      "https://cdn.example.com/invoice.pdf",
    );
  });

  it("throws the backend message on failure", async () => {
    const generateInvoice = async () => ({
      status: "ERROR",
      message: "Invoices can only be generated for the latest billing version.",
    });
    await expect(resolveInvoiceUrl("bill-1", generateInvoice)).rejects.toThrow(
      "Invoices can only be generated for the latest billing version.",
    );
  });

  it("throws the fallback when status is missing", async () => {
    const generateInvoice = async () => ({ data: { signedUrl: null } });
    await expect(resolveInvoiceUrl("bill-1", generateInvoice)).rejects.toThrow(
      "Failed to generate invoice",
    );
  });
});

describe("buildInvoiceHtml", () => {
  const base = {
    invoiceNumber: "INV-2026-001",
    invoiceDate: "2026-08-04T10:00:00Z",
    patientName: "Jane Doe",
    patientId: "P-1",
    items: [{ description: "Panadol", quantity: 2, unitPrice: 5000, lineTotal: 10000 }],
    totals: { subtotal: 10000, discount: 0, totalDue: 10000, paid: 5000, balance: 5000 },
  };

  it("embeds the invoice number, items and totals", () => {
    const html = buildInvoiceHtml(base);
    expect(html).toContain("INV-2026-001");
    expect(html).toContain("Panadol");
    expect(html).toContain("10,000 RWF");
    expect(html).toContain("5,000 RWF");
  });

  it("escapes HTML in user-provided text", () => {
    const html = buildInvoiceHtml({
      ...base,
      patientName: "<script>alert('x')</script>",
      items: [
        {
          description: "<img src=x onerror=alert(1)>",
          quantity: 1,
          unitPrice: 1,
          lineTotal: 1,
        },
      ],
    });
    expect(html).not.toContain("<script>alert");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
  });
});
