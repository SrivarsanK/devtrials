import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@repo/ui"],
  // ESLint is managed by ESLint separately from Next.js in v16+
  experimental: {
  },
};

export default nextConfig;
