// src/app/(public)/layout.tsx
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
  return <>{children}</>;
}
