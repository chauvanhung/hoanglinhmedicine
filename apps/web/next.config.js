/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove problematic configurations that can cause Firebase module resolution issues
  images: {
    unoptimized: true,
  },
  // Keep only essential configurations
}

module.exports = nextConfig
