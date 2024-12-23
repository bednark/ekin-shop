import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: process.env.BLOB_URL ? (process.env.BLOB_URL.split("://")[0] as "http" | "https") : 'http',
        hostname: process.env.BLOB_URL ? process.env.BLOB_URL.split("://")[1] : 'localhost'
      }
    ]
  }
};

export default nextConfig;
