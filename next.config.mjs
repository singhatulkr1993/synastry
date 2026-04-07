/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure consistent caching behavior
  poweredByHeader: false,
  reactStrictMode: true,

  // Optimize for production builds
  swcMinify: true,

  // Add cache control for better development experience
  async headers() {
    // Only disable caching in development
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, must-revalidate, max-age=0',
            },
          ],
        },
      ];
    }

    // In production, allow proper caching
    return [];
  },
};

export default nextConfig;
