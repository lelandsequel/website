import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://jourdanlabs.com"),
  title: {
    default: "JourdanLabs — We ship no bullshit.",
    template: "%s | JourdanLabs",
  },
  description:
    "An AI research lab building deterministic reasoning systems, validated on sealed public benchmarks.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jourdanlabs.com",
    siteName: "JourdanLabs",
    title: "JourdanLabs — We ship no bullshit.",
    description:
      "An AI research lab building deterministic reasoning systems, validated on sealed public benchmarks.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JourdanLabs — We ship no bullshit.",
    description: "Six benchmarks. One reasoning substrate. COSMIC at the core.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#F0E7D5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Nav />
        <main style={{ flex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
