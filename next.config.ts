import type { NextConfig } from "next";

// Framer runtime modules and project images are served from public/ with
// `max-age=0` by default, so every page change re-validated ~30 modules and
// the images. Cache them briefly and refresh in the background instead. Not
// `immutable`: some /_fr files and /assets images are edited in place under
// the same name, and such edits must still reach returning visitors.
const shortLivedAsset = "public, max-age=600, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  // The routes serve the original Framer-export documents; the Framer runtime
  // mutates the DOM at load time, so React strict-mode double rendering must
  // not interfere with it.
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/_fr/:path*",
        headers: [{ key: "Cache-Control", value: shortLivedAsset }],
      },
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: shortLivedAsset }],
      },
    ];
  },
};

export default nextConfig;
