import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: '/:locale(es|en)/', destination: '/:locale' },
    ];
  },
};

export default nextConfig;
