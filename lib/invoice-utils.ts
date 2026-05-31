type InvoiceMutationResult = {
  status?: string
  message?: string
  messages?: Array<{ text?: string }>
  data?: { invoiceUrl?: string | null } | null
} | undefined

export function getInvoiceErrorMessage(
  response: InvoiceMutationResult,
  fallback = 'Failed to generate invoice',
): string {
  if (response?.message) return response.message
  const fromMessages = response?.messages?.map((m) => m.text).filter(Boolean).join(', ')
  return fromMessages || fallback
}

/** Always generate (or retrieve) invoice via backend generateInvoice — never getInvoice first. */
export async function resolveInvoiceUrl(
  billId: string,
  generateInvoice: (billId: string) => Promise<InvoiceMutationResult>,
): Promise<string> {
  const response = await generateInvoice(billId)
  const invoiceUrl = response?.data?.invoiceUrl
  if (response?.status === 'SUCCESS' && invoiceUrl) {
    return invoiceUrl
  }
  throw new Error(getInvoiceErrorMessage(response))
}

export function openInvoicePreview(urlOrBase64: string) {
  if (urlOrBase64.startsWith('http://') || urlOrBase64.startsWith('https://') || urlOrBase64.startsWith('/')) {
    const previewWindow = window.open(urlOrBase64, '_blank')
    if (!previewWindow) {
      throw new Error('Unable to open invoice preview window. Please allow pop-ups.')
    }
    return
  }

  const base64Data = urlOrBase64.replace(/^data:application\/pdf;base64,/, '')
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: 'application/pdf' })
  const blobUrl = URL.createObjectURL(blob)
  const previewWindow = window.open(blobUrl, '_blank')
  if (!previewWindow) {
    URL.revokeObjectURL(blobUrl)
    throw new Error('Unable to open invoice preview window. Please allow pop-ups.')
  }
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
}
