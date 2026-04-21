import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./components/Toast";
import PwaRegister from "./components/PwaRegister";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Axios AI Recruitment",
  description: "AI-powered talent screening platform.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: '/icon-192.svg',
    apple: '/icon-192.svg',
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen flex bg-white text-[#09090b]`}>
        <ToastProvider>
          <PwaRegister />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
