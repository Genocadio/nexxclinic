import { createClient } from "@supabase/supabase-js";
import { getRuntimeConfig } from "@/lib/runtime-config";

let _client: ReturnType<typeof createClient> | null = null;
export function getSupabaseClient() {
  if (!_client) {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = getRuntimeConfig();
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _client;
}
