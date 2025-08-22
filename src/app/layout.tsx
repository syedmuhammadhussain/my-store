// src/app/layout.tsx
import Header from "@/components/Header";
import { DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import NextAuthSessionProvider from "@/components/providers/session-provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-dm-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} antialiased bg-white font-sans`}>
        <NextAuthSessionProvider>
        <Header />
        {children}
        <Toaster />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
