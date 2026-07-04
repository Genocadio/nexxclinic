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
    return [
      {
        source: '/graphql',
        destination: `${API_BASE_URL}/graphql`,
      },
    ]
  },
}

export default nextConfig
