/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // Firebase compatibility
  experimental: {
    esmExternals: false,
  },
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Build optimizations
  swcMinify: true,
  compress: true,
}

module.exports = nextConfig
