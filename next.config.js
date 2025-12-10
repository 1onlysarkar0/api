/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    "*.replit.dev",
    "*.repl.co", 
    "*.pike.replit.dev",
    "8a992453-90db-4812-8e0a-5b37a6db3343-00-1bymoidf0ir6h.pike.replit.dev"
  ],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
