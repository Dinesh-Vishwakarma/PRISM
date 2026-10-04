import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PRISM Dashboard",
  description: "Threat Actor Attribution Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col md:flex-row bg-midnight text-platinum font-sans">
        <Sidebar />
        <main className="flex-1 p-3 md:p-6 overflow-y-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
