// src/components/navigation/MainNavClient.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CategoryAttributes } from "@/types/category";

function MainNavClientInner({
  categories,
}: {
  categories: CategoryAttributes[];
}) {
  useEffect(() => {
    // client-only mount log — runs once per mount in dev (may still double-mount in Strict Mode dev)
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("MainNavClient mounted");
    }
  }, []);

  return (
    <header className="hidden md:flex items-center justify-between py-3 px-12 bg-white sticky top-0 z-99">
      <div className="flex items-center md:space-x-8 lg:space-x-12">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={45} height={32} />
        </Link>

        <nav className="flex md:space-x-4 lg:space-x-8">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              {categories.map((cat) => {
                const hasChildren =
                  Array.isArray(cat.sub_categories) &&
                  cat.sub_categories.length > 0;
                return (
                  <NavigationMenuItem key={cat.slug || cat.id}>
                    {hasChildren ? (
                      <>
                        <NavigationMenuTrigger
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "relative flex items-center gap-2 bg-transparent hover:bg-transparent"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/category/${cat.slug}`}
                              className="text-md font-semibold"
                            >
                              {cat.name}
                            </Link>
                            {/* <ChevronDown className="w-4 h-4 text-gray-500" /> */}
                          </div>
                        </NavigationMenuTrigger>

                        <NavigationMenuContent className="p-0">
                          <ul className="grid bg-white border rounded-md shadow-sm min-w-[200px]">
                            {cat.sub_categories!.map((sub) => (
                              <li key={sub.slug}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={`/sub_category/${sub.slug}`}
                                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    {sub.name}
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
                          href={`/category/${cat.slug}`}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "text-md font-semibold bg-transparent"
                          )}
                        >
                          {cat.name}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="relative border-0 bg-transparent">
          <Search />
        </Button>
        <Button variant="outline" size="icon" className="relative border-0 bg-transparent">
          <ShoppingCart />
        </Button>
      </div>
    </header>
  );
}

// export memoized to avoid re-render when parent re-renders but props same
export default React.memo(MainNavClientInner);
