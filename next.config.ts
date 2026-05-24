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
    return {
      beforeFiles: [
        { source: "/cipher", destination: "https://cipher-demo-chi.vercel.app/cipher" },
        { source: "/cipher/:path*", destination: "https://cipher-demo-chi.vercel.app/cipher/:path*" },
        { source: "/comps", destination: "https://cipher-demo-chi.vercel.app/cipher/comps" },
        { source: "/comps/:path*", destination: "https://cipher-demo-chi.vercel.app/cipher/comps/:path*" },
      ],
    };
  },
  async redirects() {
    return [
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
