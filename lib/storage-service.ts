export interface UploadResult {
  path: string;
  url: string;
  name: string;
}

/**
 * Uploads a file to the backend via the GraphQL uploadFile mutation.
 * Uses raw fetch with multipart/form-data (GraphQL multipart request spec).
 */
export async function uploadFile(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  onProgress?.(20);

  const query = `
    mutation UploadFile($file: Upload!) {
      uploadFile(file: $file) {
        status
        message
        data {
          id
          url
        }
      }
    }
  `;

  const formData = new FormData();
  const operations = JSON.stringify({ query, variables: { file: null } });
  const map = JSON.stringify({ '0': ['variables.file'] });
  formData.append('operations', operations);
  formData.append('map', map);
  formData.append('0', file);

  const uri =
    typeof window !== 'undefined'
      ? '/graphql'
      : `${process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || ''}/graphql`;

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

  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'Upload failed');
  }

  onProgress?.(100);

  const uploadData = result.data?.uploadFile?.data;
  return {
    path: uploadData?.id || file.name,
    url: uploadData?.url || '',
    name: file.name,
  };
}
