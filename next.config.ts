/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.com',
      },
      {
        protocol: 'https',
        hostname: 'pbcdn.com',
      },
      {
        protocol: 'https',
        hostname: '*.replicate.delivery',
      },
      {
        // Groq image generation returns images via this CDN
        protocol: 'https',
        hostname: 'image.groq.com',
      },
      {
        // Picsum for demo images
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default nextConfig;
