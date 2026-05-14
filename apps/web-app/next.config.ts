import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@aurik/database", "@aurik/zod"],
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.t3.tigrisfiles.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
