export type InvoiceViewerState = {
  open: boolean;
  url?: string;
  fileName?: string;
};

let state: InvoiceViewerState = { open: false };
const listeners = new Set<(state: InvoiceViewerState) => void>();

function emit() {
  for (const listener of listeners) listener(state);
}

export function openInvoiceViewer(url: string, fileName?: string) {
  state = { open: true, url, fileName };
  emit();
}

export function closeInvoiceViewer() {
  state = { open: false };
  emit();
}

export function subscribeInvoiceViewer(
  listener: (state: InvoiceViewerState) => void,
): () => void {
  listeners.add(listener);
  listener(state);
  return () => {
    listeners.delete(listener);
  };
}
