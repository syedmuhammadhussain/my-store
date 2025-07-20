"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Care Plans", href: "/care-plans" },
  { label: "Learn", href: "/learn" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  return (
    <header className="flex items-center justify-between py-6 px-8 bg-transparent">
      <div className="flex items-center space-x-20">
        <Link href="/">
          <img src="/logo.svg" alt="Nietzsche" className="h-8 w-auto" />
        </Link>
        <nav className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-gray-800 font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <Button size="lg" variant="blue3d">
        Start Now
      </Button>
    </header>
  );
}
