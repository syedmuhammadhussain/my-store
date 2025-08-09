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
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { navItems } from "@/store/data";
import { cn } from "@/lib/utils";

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

        <nav className="flex md:space-x-4 lg:space-x-8">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href || item.label}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "relative flex items-center justify-between bg-transparent hover:bg-transparent group"
                        )}
                      >
                        <span className="flex items-center space-x-2">
                          <Link
                            href={item.href}
                            className="block w-full font-normal"
                          >
                            {item.label}
                          </Link>
                        </span>
                      </NavigationMenuTrigger>

                      <NavigationMenuContent className="p-0">
                        <ul className="grid">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.href}
                                  className="hover:text-primary text-nowrap block w-full px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100"
                                >
                                  {child.label}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent hover:bg-transparent font-normal"
                        )}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="relative border-0">
          <Search />
        </Button>
        <Button variant="outline" size="icon" className="relative border-0">
          <ShoppingCart />
        </Button>
      </div>
    </header>
  );
}
