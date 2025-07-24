// src/app/(public)/layout.tsx
import Header from "@/components/Header";
import "./../globals.css";

export const metadata = {
  title: "My Store",
  description: "Your one-stop shop for everything.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
