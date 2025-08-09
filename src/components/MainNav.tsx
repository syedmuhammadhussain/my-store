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
import { cn } from "@/lib/utils"; // Make sure you have this utility

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
                <NavigationMenuItem key={item.href}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger className="[&>svg]:hidden group">
                        <Link href={item.href} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={cn(
                              navigationMenuTriggerStyle(),
                              "bg-transparent hover:bg-transparent"
                            )}
                          >
                            {item.label}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-4 p-4">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.href}
                                  className="hover:text-primary"
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
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-transparent [&>svg]:hidden"
                      )}
                    >
                      <Link href={item.href} passHref>
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
      <div>
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
