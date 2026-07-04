declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      API_BASE_URL: string
    }
  }
}

export function getRuntimeConfig() {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) {
    return window.__RUNTIME_CONFIG__
  }
  return {
    API_BASE_URL: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '',
  }
}
