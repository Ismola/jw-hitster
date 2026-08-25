import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["test.ismola.dev"],
  // Serve both `/es` and `/es/` (and their English equivalents) directly.
  // This avoids a redirect loop when an upstream proxy or a browser-cached
  // redirect normalizes locale roots in the opposite direction.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
