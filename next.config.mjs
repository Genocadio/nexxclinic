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
    const SUPABASE_URL = process.env.SUPABASE_URL || 'http://host.docker.internal:55321'
    return [
      {
        source: '/graphql',
        destination: `${API_BASE_URL}/graphql`,
      },
      {
        source: '/supabase/:path*',
        destination: `${SUPABASE_URL}/:path*`,
      },
    ]
  },
}

export default nextConfig
