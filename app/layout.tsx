import type { Metadata } from "next";
import { Geist_Mono, Geist_Pixel, Inter, Pixelify_Sans } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

const geistPixel = Geist_Pixel({
  variable: "--font-geist-pixel",
  subsets: ["latin"],
  axes: ["ELSH"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Col — Collection of Libraries",
  description: "We curate all the best libraries, so you don't have to.",
  icons: { icon: "/brand/col-mark.png" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Col",
    images: [{ url: "/col-social-preview.jpg", width: 1200, height: 630, type: "image/jpeg", alt: "Col: UI libraries. All in one place." }],
  },
  twitter: { card: "summary_large_image", images: ["/col-social-preview.jpg"] },
  keywords: [
    "ui libraries",
    "component library",
    "react components",
    "tailwind",
    "design system",
    "frontend",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{const t=localStorage.getItem('col:theme');const l=t==='light'||(!t&&matchMedia('(prefers-color-scheme: light)').matches);document.documentElement.classList.toggle('light',l);document.documentElement.classList.toggle('dark',!l)}catch{}` }} />
      </head>
      <body
        className={`${inter.variable} ${pixelifySans.variable} ${geistPixel.variable} ${geistMono.variable} min-h-screen font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
