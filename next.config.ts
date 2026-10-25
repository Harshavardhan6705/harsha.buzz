import type { NextConfig } from "next";

// Framer runtime modules and project images are edited in place under the same
// file names, so browsers must never reuse an old copy: they keep the file but
// re-check it on every visit (a cheap 304 when unchanged). The previous
// `max-age=600, stale-while-revalidate=86400` kept serving old code for up to
// a day after an edit (owner's request to always show the latest version).
const shortLivedAsset = "public, max-age=0, must-revalidate";

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
