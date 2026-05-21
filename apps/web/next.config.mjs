import { fileURLToPath } from "node:url";

const distDir = process.env.NEXT_DIST_DIR;

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(distDir ? { distDir } : {}),
  output: "standalone",
  outputFileTracingRoot: fileURLToPath(new URL("../..", import.meta.url))
};

export default nextConfig;
