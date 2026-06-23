import { getSupabaseClient } from "@/lib/supabase-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UploadResult {
  path: string;
  url: string;
  name: string;
}

export interface StoredFile {
  path: string;
  url: string;
  name: string;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

/**
 * Uploads a single file to Supabase Storage.
 *
 * Progress is simulated in three steps (20 → 80 → 100) because the Supabase
 * JS SDK does not expose upload-progress events.
 */
export async function uploadFile(
  bucket: "form" | "main",
  storagePath: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  const supabase = getSupabaseClient();

  onProgress?.(20);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, { upsert: true });

  if (error) throw new Error(error.message);

  onProgress?.(80);

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);

  onProgress?.(100);

  return { path: storagePath, url: data.publicUrl, name: file.name };
}

// ─── List ─────────────────────────────────────────────────────────────────────

/**
 * Returns all files stored under `folder` in the given bucket.
 * Empty-folder placeholder objects are filtered out automatically.
 */
export async function listFiles(
  bucket: "form" | "main",
  folder: string,
): Promise<StoredFile[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data
    .filter((item) => item.name !== ".emptyFolderPlaceholder")
    .map((item) => {
      const path = folder ? `${folder}/${item.name}` : item.name;
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      return { path, url: urlData.publicUrl, name: item.name };
    });
}
