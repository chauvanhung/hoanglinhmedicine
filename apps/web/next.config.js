/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  images: {
    unoptimized: true,
  },
  // Disable server-side image optimization for static export
  trailingSlash: true,
  // Enable static export
  distDir: 'dist',
}

module.exports = nextConfig
