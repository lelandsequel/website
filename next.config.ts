import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
    ],
  },
  async rewrites() {
    const cipherOrigin =
      process.env.CIPHER_WEB_ORIGIN ||
      (process.env.VERCEL ? "https://cipher-demo-chi.vercel.app" : "http://127.0.0.1:3001");

    return {
      beforeFiles: [
        { source: "/alchemist/cipher", destination: `${cipherOrigin}/cipher` },
        { source: "/alchemist/cipher/:path*", destination: `${cipherOrigin}/cipher/:path*` },
        { source: "/alchemist/comps", destination: `${cipherOrigin}/cipher/comps` },
        { source: "/alchemist/comps/:path*", destination: `${cipherOrigin}/cipher/comps/:path*` },
        { source: "/alchemist/precedents", destination: `${cipherOrigin}/cipher/precedents` },
        { source: "/alchemist/precedents/:path*", destination: `${cipherOrigin}/cipher/precedents/:path*` },
        { source: "/alchemist/models", destination: `${cipherOrigin}/cipher/models` },
        { source: "/alchemist/models/:path*", destination: `${cipherOrigin}/cipher/models/:path*` },
        { source: "/cipher", destination: `${cipherOrigin}/cipher` },
        { source: "/cipher/:path*", destination: `${cipherOrigin}/cipher/:path*` },
        { source: "/comps", destination: `${cipherOrigin}/cipher/comps` },
        { source: "/comps/:path*", destination: `${cipherOrigin}/cipher/comps/:path*` },
        { source: "/precedents", destination: `${cipherOrigin}/cipher/precedents` },
        { source: "/precedents/:path*", destination: `${cipherOrigin}/cipher/precedents/:path*` },
        { source: "/models", destination: `${cipherOrigin}/cipher/models` },
        { source: "/models/:path*", destination: `${cipherOrigin}/cipher/models/:path*` },
      ],
    };
  },
  async redirects() {
    return [
      { source: "/alchemy", destination: "/alchemist", permanent: true },
      { source: "/alchemist/cipher-demo", destination: "/alchemist/cipher", permanent: true },
      { source: "/research", destination: "/crucible/benchmarks", permanent: true },
      { source: "/research/signal", destination: "/crucible/benchmarks/signal", permanent: true },
      { source: "/research/citadel", destination: "/crucible/benchmarks/citadel", permanent: true },
      { source: "/research/sentinel", destination: "/crucible/benchmarks/sentinel", permanent: true },
      { source: "/research/oracle", destination: "/crucible/benchmarks/oracle", permanent: true },
      { source: "/research/lens", destination: "/crucible/benchmarks/lens", permanent: true },
      { source: "/research/compass", destination: "/crucible/benchmarks/compass", permanent: true },
      { source: "/research/vantage", destination: "/crucible/vantage", permanent: true },
      { source: "/methodology", destination: "/crucible/methodology", permanent: true },
      { source: "/reproducibility", destination: "/crucible/reproducibility", permanent: true },
      { source: "/systems", destination: "/cosmic", permanent: true },
      { source: "/raven", destination: "/crucible/raven", permanent: true },
      { source: "/muninn", destination: "/benchmarks/muninn", permanent: true },
    ];
  },
};

export default nextConfig;
