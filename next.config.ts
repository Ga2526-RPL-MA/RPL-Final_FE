/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    return [
      {
        source: "/api/:path*",
        destination: `${baseUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
