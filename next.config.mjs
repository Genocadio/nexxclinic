/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const API_BASE_URL = process.env.API_BASE_URL || 'http://backend:8080'
    const SUPABASE_INTERNAL_URL = process.env.SUPABASE_INTERNAL_URL || 'http://host.docker.internal:55321'

    return [
      // Your existing backend proxy
      {
        source: '/graphql',
        destination: `${API_BASE_URL}/graphql`,
      },
      {
        source: '/api/:path*',
        destination: `${API_BASE_URL}/api/:path*`,
      },
      // Supabase storage proxy for PUBLIC files (existing - keep as is)
      {
        source: '/supa/:path*',
        destination: `${SUPABASE_INTERNAL_URL}/storage/v1/object/public/:path*`,
      },
      // Supabase storage proxy for SIGNED files (NEW RULE)
      {
        source: '/supa-signed/:path*',
        destination: `${SUPABASE_INTERNAL_URL}/storage/v1/object/sign/:path*`,
      },
    ]
  },
}

export default nextConfig