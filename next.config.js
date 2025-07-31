/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output for faster builds
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  // Optimize build performance
  swcMinify: true,
}

module.exports = nextConfig 