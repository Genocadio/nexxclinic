declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      API_BASE_URL: string
      SUPABASE_URL: string
      SUPABASE_ANON_KEY: string
    }
  }
}

export function getRuntimeConfig() {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) {
    return window.__RUNTIME_CONFIG__
  }
  return {
    API_BASE_URL: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '',
    SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  }
}
