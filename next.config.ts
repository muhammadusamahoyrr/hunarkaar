import { fileURLToPath } from "node:url";
import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory makes Turbopack infer the
  // workspace root as C:\Users\<user>, which 404s every route. Pin it here.
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
  images: {
    // Default is ['image/webp'] only. AVIF is ~30% smaller again and the
    // source PNGs here are multi-megabyte, so the extra encode cost pays off.
    formats: ["image/avif", "image/webp"],
    // Next 16 requires quality values to be allowlisted before they can be used.
    qualities: [75, 85],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "media.istockphoto.com" },
    ],
    minimumCacheTTL: 2678400, // 31d — product/hero art is effectively static
  },
};

export default nextConfig;
