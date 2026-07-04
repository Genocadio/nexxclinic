import { createClient } from "@supabase/supabase-js";
import { getRuntimeConfig } from "@/lib/runtime-config";

function getSupabaseUrl() {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/supabase`
  }
  const { SUPABASE_URL } = getRuntimeConfig()
  return SUPABASE_URL || ''
}

let _client: ReturnType<typeof createClient> | null = null;
export function getSupabaseClient() {
  if (!_client) {
    const { SUPABASE_ANON_KEY } = getRuntimeConfig();
    _client = createClient(getSupabaseUrl(), SUPABASE_ANON_KEY);
  }
  return _client;
}
