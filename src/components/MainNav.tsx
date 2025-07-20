"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Care Plans", href: "/care-plans" },
  { label: "Learn", href: "/learn" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function MainNav() {
  return (
    <header className="hidden md:flex items-center justify-between py-6 px-15 pb-0 bg-transparent">
      <div className="flex items-center md:space-x-8 lg:space-x-12">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Your Logo"
            width={120}
            height={32}
            className="mx-auto"
          />
        </Link>
        <nav className="flex md: space-x-4 lg:space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-gray-700 font-medium"
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
