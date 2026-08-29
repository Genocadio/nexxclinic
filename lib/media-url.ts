/**
 * Resolves a stored media URL into a fetchable browser URL.
 *
 * Two storage modes:
 * - **LOCAL** (supabase.storage-type=LOCAL): the backend stores files on disk and
 *   serves them at /api/media/{bucket}/{path}. The upload service returns URLs like
 *   "/api/media/uploads-public/uuid.png", which are served directly by the backend.
 * - **SUPABASE** (supabase.storage-type=SUPABASE): files are uploaded to Supabase
 *   Storage and returned as "/storage/v1/object/public/{bucket}/{path}". The Next.js
 *   proxy rewrites these to /supa/storage/v1/object/public/{bucket}/{path} which
 *   hits the self-hosted Supabase instance.
 */
export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return ''

  // file:// URLs are not fetchable in the browser — strip the protocol
  // and treat as a local backend media path to prevent SecurityError.
  if (url.startsWith('file:///')) {
    const localPath = url.replace('file://', '')
    return localPath.startsWith('/') ? `/api/media${localPath}` : `/api/media/${localPath}`
  }

  // Absolute URLs — pass through as-is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }

  // Already a local backend URL — pass through
  if (url.startsWith('/api/media/')) {
    return url
  }

  // Already a Supabase proxy URL — pass through
  if (url.startsWith('/supa/')) {
    return url
  }

  // Relative paths that aren't storage-related — pass through (e.g. /dashboard)
  if (url.startsWith('/') && !url.startsWith('/storage/')) {
    return url
  }

  // Supabase storage URLs: /storage/v1/object/public/{bucket}/{path}
  // Rewrite to /supa/storage/v1/object/public/{bucket}/{path} for the Next.js proxy
  const supabasePrefix = '/storage/v1/object/public/'
  if (url.startsWith(supabasePrefix)) {
    return `/supa/${url.slice(supabasePrefix.length)}`
  }

  // Signed Supabase URLs: /storage/v1/object/sign/{bucket}/{path}?token=...
  // These are returned by the backend's signedUrl() method
  const signedPrefix = '/storage/v1/object/sign/'
  if (url.startsWith(signedPrefix)) {
    return `/storage/sign/${url.slice(signedPrefix.length)}`
  }

  // Fallback: treat as relative Supabase path
  return `/supa/${url}`
}
