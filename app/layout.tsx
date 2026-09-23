import type { Metadata } from "next";
import { Geist_Mono, Inter, Pixelify_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Col — Collection of Libraries",
  description: "Browse UI libraries by category, stack, and use case.",
  icons: { icon: "/brand/col-mark.png" },
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
        <script dangerouslySetInnerHTML={{ __html: `let t;try{t=localStorage.getItem('col:theme')}catch{}const l=t==='light'||(t!=='dark'&&matchMedia('(prefers-color-scheme: light)').matches);document.documentElement.classList.toggle('light',l);document.documentElement.classList.toggle('dark',!l)` }} />
      </head>
      <body
        className={`${inter.variable} ${pixelifySans.variable} ${geistMono.variable} min-h-screen font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
