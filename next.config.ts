import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pins the workspace root explicitly: an unrelated package-lock.json in a
  // parent directory (outside this repo) otherwise makes Turbopack guess.
  turbopack: {
    root: import.meta.dirname,
  },
  // Security headers, site-wide (CF-177, OD-38). Values are fixed there; the
  // full script and connect allow-list is deferred by the same OD.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=86400" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-src https://www.youtube.com https://vercel.live",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/ar",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
