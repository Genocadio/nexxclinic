import { getMediaUrl } from "@/lib/media-url";

export interface UploadResult {
  path: string;
  url: string;
  name: string;
}

/**
 * Uploads a file via the REST API POST /api/uploads.
 * All uploads are PUBLIC by default.
 */
export async function uploadFile(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  onProgress?.(20);

  const formData = new FormData();
  formData.append('file', file); // visibility defaults to PUBLIC on the backend

  const uri =
    typeof window !== 'undefined'
      ? '/api/uploads'
      : `${process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/uploads`;

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const headers: Record<string, string> = {};
  if (token) headers['authorization'] = `Bearer ${token}`;

  const response = await fetch(uri, {
    method: 'POST',
    headers,
    body: formData,
  });

  const result = await response.json();

  if (result.status !== 'SUCCESS') {
    throw new Error(result.message || 'Upload failed');
  }

  onProgress?.(100);

  return {
    path: result.data?.id || file.name,
    url: getMediaUrl(result.data?.url) || '',
    name: file.name,
  };
}
