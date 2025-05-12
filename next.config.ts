import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "@chakra-ui/react",
      "@chakra-ui/theme",
      "@emotion/react",
      "@aws-sdk/client-s3",
      "@aws-sdk/s3-presigned-post",
      "@aws-sdk/s3-request-presigner",
      "pdf-lib",
      "@auth0/nextjs-auth0"
    ]
  }
};

export default nextConfig;
