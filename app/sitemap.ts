import type { MetadataRoute } from "next";

const BASE = "https://jourdanlabs.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { url: BASE, priority: 1.0 },
    { url: `${BASE}/cosmic`, priority: 0.9 },
    { url: `${BASE}/divisions`, priority: 0.9 },
    { url: `${BASE}/divisions/atlas`, priority: 0.8 },
    { url: `${BASE}/divisions/bacchus`, priority: 0.8 },
    { url: `${BASE}/divisions/helix`, priority: 0.8 },
    { url: `${BASE}/divisions/heimdall`, priority: 0.8 },
    { url: `${BASE}/crucible`, priority: 0.9 },
    { url: `${BASE}/crucible/vantage`, priority: 0.85 },
    { url: `${BASE}/crucible/benchmarks`, priority: 0.85 },
    { url: `${BASE}/crucible/benchmarks/signal`, priority: 0.8 },
    { url: `${BASE}/crucible/benchmarks/citadel`, priority: 0.8 },
    { url: `${BASE}/crucible/benchmarks/sentinel`, priority: 0.8 },
    { url: `${BASE}/crucible/benchmarks/oracle`, priority: 0.8 },
    { url: `${BASE}/crucible/benchmarks/lens`, priority: 0.8 },
    { url: `${BASE}/crucible/benchmarks/compass`, priority: 0.8 },
    { url: `${BASE}/crucible/methodology`, priority: 0.85 },
    { url: `${BASE}/crucible/reproducibility`, priority: 0.8 },
    { url: `${BASE}/crucible/raven`, priority: 0.5 },
    { url: `${BASE}/applications`, priority: 0.75 },
    { url: `${BASE}/contact`, priority: 0.6 },
  ];

  return routes.map(({ url, priority }) => ({
    url,
    lastModified: new Date("2026-04-23"),
    changeFrequency: "monthly" as const,
    priority,
  }));
}
