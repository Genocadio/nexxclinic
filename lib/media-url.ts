export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return ''

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }

  if (url.startsWith('/supa/')) {
    return url
  }

  if (url.startsWith('/') && !url.startsWith('/storage/')) {
    return url
  }

  const prefix = '/storage/v1/object/public/'
  if (url.startsWith(prefix)) {
    return `/supa/${url.slice(prefix.length)}`
  }

  return `/supa/${url}`
}
