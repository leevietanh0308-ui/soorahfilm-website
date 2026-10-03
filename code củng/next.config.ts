import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isGitHubPages && {
    output: "export",
    ...(basePath ? { basePath } : {}),
    trailingSlash: true,
    images: {
      loader: "custom",
      loaderFile: "./lib/image-loader.ts",
    },
  }),
};

export default nextConfig;
