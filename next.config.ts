import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "won-q-order-merchant.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
