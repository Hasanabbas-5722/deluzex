import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["ik.imagekit.io"],
  },
};

export default nextConfig;
