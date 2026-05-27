import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/alchemy", destination: "/alchemist", permanent: true },
      { source: "/alchemist/cipher-demo", destination: "/alchemist/cipher", permanent: true },
      { source: "/alchemist/models", destination: "/alchemist/banking", permanent: true },
      { source: "/models", destination: "/alchemist/banking", permanent: true },
      { source: "/models/:path*", destination: "/alchemist/banking", permanent: true },
      { source: "/precedents", destination: "/alchemist/banking", permanent: true },
      { source: "/precedents/:path*", destination: "/alchemist/banking", permanent: true },
      { source: "/alchemist/precedents", destination: "/alchemist/banking", permanent: true },
      { source: "/alchemist/precedents/:path*", destination: "/alchemist/banking", permanent: true },
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
