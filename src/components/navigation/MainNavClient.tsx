"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BadgeCheck, LogOut, Search, ShoppingCart, User2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CategoryAttributes } from "@/types/category";

function MainNavClientInner({
  categories,
}: {
  categories: CategoryAttributes[];
}) {
  // const { data: session, update } = useSession();
  const { data: session } = useSession();
  const userImage = (session?.user as any)?.image;
  const username = session?.user?.name || session?.user?.username || "Account";
  const email = session?.user?.email || "test@test.com";
  const router = useRouter();

  const handleLoginClick = () => {
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
  };

  return (
    <header className="hidden lg:flex items-center justify-between py-3 px-12 sticky top-0 bg-white z-50 shadow">
      <div className="flex items-center md:space-x-8 lg:space-x-12">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Digo Fashion's Logo" width={45} height={32} priority />
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
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Button
                  variant="outline"
                  size="icon"
                  className="relative border-0 bg-transparent"
                >
                  <Avatar className="size-5 rounded-lg">
                    <AvatarImage
                      src={userImage ?? "/user-icon.svg"}
                      alt={username}
                      width={20}
                      height={20}
                    />
                    <AvatarFallback className="rounded-lg">
                      {username}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage
                      src={userImage ?? "/user-icon.svg"}
                      alt={username}
                      width={20}
                      height={20}
                    />
                    <AvatarFallback className="rounded-lg">
                      {username}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{username}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log("Account")}>
                <BadgeCheck className="w-3 h-3 text-black" />
                Account
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/", redirect: false })}
                className={cn("text-red-600 focus:text-red-600")}
              >
                <LogOut className="w-3 h-3 text-red-600" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button
              variant="outline"
              size="icon"
              className="relative border-0 bg-transparent"
              onClick={handleLoginClick}
            >
              <User2 />
            </Button>
          </Link>
        )}
        <Button
          variant="outline"
          size="icon"
          className="relative border-0 bg-transparent"
        >
          <Search />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="relative border-0 bg-transparent"
        >
          <ShoppingCart />
        </Button>
      </div>
    </header>
  );
}

export default React.memo(MainNavClientInner);
