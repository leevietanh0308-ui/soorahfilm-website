import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isGitHubPages && {
    output: "export",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/soorahfilm-website",
    trailingSlash: true,
    images: {
      loader: "custom",
      loaderFile: "./lib/image-loader.ts",
    },
  }),
};

export default nextConfig;
