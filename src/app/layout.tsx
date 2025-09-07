// src/app/layout.tsx
import { DM_Sans } from "next/font/google";
import { getServerSession } from "next-auth";
import NextTopLoader from "nextjs-toploader";

import { authOptions } from "@/lib/auth";
import Header from "@/components/main/Header";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

import "./globals.css";
import { CartHydration } from "@/components/cart/CartHydration";

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
  const showSpinner = false;
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${dmSans.variable} antialiased bg-white font-sans`}>
        <CartHydration />
        <NextTopLoader
          // color="#2b7fff"
          initialPosition={0.3}
          crawlSpeed={200}
          height={4}
          showSpinner={showSpinner}
          easing="ease"
          speed={200}
          zIndex={999999999999}
        />
        <Providers session={session}>
          <Header />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
