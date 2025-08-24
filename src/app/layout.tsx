// src/app/layout.tsx
import { DM_Sans } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-dm-sans",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${dmSans.variable} antialiased bg-white font-sans`}>
        <Providers session={session}>
          <Header />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
