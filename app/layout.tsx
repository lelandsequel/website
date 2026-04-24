import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://jourdanlabs.com"),
  title: {
    default: "JourdanLabs — Deterministic AI for Regulated Decisions",
    template: "%s | JourdanLabs",
  },
  description:
    "No LLM calls at runtime. Sealed corpora. Reproducible outputs. The opposite of black-box generative AI. Seven-benchmark validation program, publicly reproducible.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jourdanlabs.com",
    siteName: "JourdanLabs",
    title: "JourdanLabs — Deterministic AI for Regulated Decisions",
    description:
      "No LLM calls at runtime. Sealed corpora. Reproducible outputs. Seven-benchmark validation program.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JourdanLabs — Deterministic AI for Regulated Decisions",
    description: "Seven benchmarks. One architecture. COSMIC at the core.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Nav />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
