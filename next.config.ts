import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pins the workspace root explicitly: an unrelated package-lock.json in a
  // parent directory (outside this repo) otherwise makes Turbopack guess.
  turbopack: {
    root: import.meta.dirname,
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
