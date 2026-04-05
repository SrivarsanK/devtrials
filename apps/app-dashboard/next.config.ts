import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3005');
    
    // If we're in production and apiBase is empty, we don't rewrite to localhost
    // This prevents 500 errors on Vercel when the backend URL is not set.
    if (!apiBase && process.env.NODE_ENV === 'production') {
      return [];
    }

    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
  experimental: {
    // Optimize performance by only importing used parts of heavy libraries
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "d3",
      "@react-three/fiber",
      "@react-three/drei",
      "three",
      "animejs",
      "leaflet",
      "react-leaflet"
    ],
  },
  // In dev mode, reducing the number of pages/components kept in memory can help with memory issues
  onDemandEntries: {
    // Period (in ms) that the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously in the buffer
    pagesBufferLength: 2,
  },
  // Enable modern compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
