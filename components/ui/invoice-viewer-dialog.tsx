"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, Loader2, AlertTriangle } from "lucide-react";
import {
  closeInvoiceViewer,
  subscribeInvoiceViewer,
  type InvoiceViewerState,
} from "@/lib/invoice-viewer";

/**
 * Reusable in-app invoice viewer. Opened via openInvoicePreview — it receives
 * the PDF (signed storage URL, http(s) URL or data: PDF), fetches it into a
 * blob and shows it inside a popup with Print / Download actions. It never
 * opens a new tab.
 */
export function InvoiceViewerDialog() {
  const [viewer, setViewer] = useState<InvoiceViewerState>({ open: false });
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => subscribeInvoiceViewer(setViewer), []);

  const url = viewer.url;

  useEffect(() => {
    if (!viewer.open || !url) return;

    let cancelled = false;
    let createdUrl: string | null = null;

    const load = async () => {
      if (url.startsWith("data:") || url.startsWith("blob:")) {
        setObjectUrl(url);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to load the invoice (HTTP ${res.status}).`);
        }
        const blob = await res.blob();
        if (cancelled) return;
        createdUrl = URL.createObjectURL(blob);
        setObjectUrl(createdUrl);
        setLoading(false);
      } catch (err: unknown) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load the invoice.",
        );
        setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [viewer.open, url]);

  const handlePrint = () => {
    const frame = iframeRef.current;
    if (frame?.contentWindow) {
      frame.contentWindow.focus();
      frame.contentWindow.print();
    }
  };

  const handleDownload = () => {
    if (!objectUrl) return;
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = viewer.fileName || "invoice.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Dialog
      open={viewer.open}
      onOpenChange={(open) => {
        if (!open) closeInvoiceViewer();
      }}
    >
      {/* Must sit above the billing preview sheet (portal z-[88]) so the PDF
          popup always renders on top of the side preview pane. */}
      <DialogContent
        className="sm:max-w-4xl z-[100]"
        overlayClassName="z-[100]"
      >
        <DialogHeader>
          <DialogTitle>Invoice</DialogTitle>
          <DialogDescription>
            {viewer.fileName || "Billing invoice"}
          </DialogDescription>
        </DialogHeader>

        <div className="h-[70vh] overflow-hidden rounded-md border border-border bg-muted/30">
          {loading ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading invoice…
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          ) : objectUrl ? (
            <iframe
              ref={iframeRef}
              src={objectUrl}
              title="Invoice PDF"
              className="h-full w-full"
            />
          ) : null}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!objectUrl}
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download
          </Button>
          <Button onClick={handlePrint} disabled={!objectUrl}>
            <Printer className="h-4 w-4 mr-1.5" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
