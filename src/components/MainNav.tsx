"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Search, ShoppingCart } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navItems } from "@/store/data";

export default function MainNav() {
  return (
    <header className="hidden md:flex items-center justify-between py-3 px-15 bg-transparent">
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
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="#">Components</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#">Documentation</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#">Blocks</Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>
      <div>
        <Button variant="outline" size="icon" className="relative border-0">
          <Search />
        </Button>
        <Button variant="outline" size="icon" className="relative border-0">
          <ShoppingCart />
        </Button>
      </div>
      {/* <Button size="lg" variant="blue3d">
        Start Now
      </Button> */}
    </header>
  );
}
