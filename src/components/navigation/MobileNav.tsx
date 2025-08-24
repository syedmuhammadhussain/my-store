"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu as MenuIcon,
  Plus,
  Minus,
  X,
  BadgeCheck,
  LogOut,
  User2,
} from "lucide-react";

import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetOverlay,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Description, DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { CategoryAttributes } from "@/types/category";

type Props = { categories: CategoryAttributes[] };

export default function MobileNav({ categories }: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { data: session } = useSession();
  const userImage = (session?.user as any)?.image;
  const username = session?.user?.name || session?.user?.username || "Account";
  const email = session?.user?.email || "test@test.com";
  const router = useRouter();

  const navItems = categories.map((c) => ({
    label: c.name ?? c.slug,
    href: `/category/${c.slug}`,
    children:
      Array.isArray(c.sub_categories) && c.sub_categories.length > 0
        ? c.sub_categories.map((s: any) => ({
            label: s.name ?? s.slug,
            href: `/category/${c.slug}/${s.slug ?? ""}`,
          }))
        : undefined,
  }));

  const handleLoginClick = () => {
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
  };

  const toggleSub = (label: string) =>
    setOpenMenu((curr) => (curr === label ? null : label));

  return (
    <div className="lg:hidden relative w-full flex items-center justify-between px-4 py-2 md:py-3 bg-white shadow-sm z-40">
      <Sheet>
        <DialogTitle hidden></DialogTitle>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Open menu"
            className="bg-transparent"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>

        <SheetOverlay className="fixed inset-0 bg-black/40" />

        <SheetContent
          side="left"
          className="
            fixed left-0 top-0 h-full w-3/4 max-w-xs bg-white shadow-xl
            transform transition-transform duration-300 ease-out
            data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full
            "
        >
          <Description></Description>
          {/* header */}
          <div className="flex items-center justify-between border-b pb-5">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                sizes="40px"
                className="w-10 h-auto"
                priority
              />
            </Link>
            <SheetTrigger asChild nonce="">
              <Button variant="outline" size="icon" aria-label="Close menu">
                <X />
              </Button>
            </SheetTrigger>
          </div>

          {/* nav */}
          <nav className="pt-4 overflow-auto h-[calc(100%-112px)]">
            {" "}
            <ul className="space-y-2">
              {navItems.map((it) => {
                const hasSub = !!it.children && it.children.length > 0;
                const isOpen = openMenu === it.label;
                return (
                  <li key={it.label} className="space-y-1">
                    <div
                      className="flex items-center justify-between"
                      // onClick={() => (hasSub ? toggleSub(it.label) : null)}
                    >
                      <SheetClose asChild>
                        <Link
                          href={it.href ?? "#"}
                          className="text-md font-medium"
                        >
                          {it.label}
                        </Link>
                      </SheetClose>

                      {hasSub && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSub(it.label);
                          }}
                          aria-label={isOpen ? "Collapse" : "Expand"}
                          className="p-1 cursor-pointer"
                        >
                          {isOpen ? (
                            <Minus className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {hasSub && (
                      <div
                        className={`ml-5 overflow-hidden transition-[max-height,opacity,transform] duration-250 ease-out
                          ${
                            isOpen
                              ? "max-h-56 opacity-100 translate-x-0"
                              : "max-h-0 opacity-0 -translate-x-3"
                          }`}
                        aria-hidden={!isOpen}
                      >
                        <ul className="py-1 space-y-1">
                          {it.children!.map((sub) => (
                            <li key={sub.href}>
                              <SheetClose asChild>
                                <Link
                                  href={sub.href}
                                  className="block py-1 text-sm"
                                >
                                  {sub.label}
                                </Link>
                              </SheetClose>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {session && (
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="size-8 rounded-lg">
                <AvatarImage
                  src={userImage ?? "/user-icon.svg"}
                  alt={username}
                  width={20}
                  height={20}
                  sizes=""
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
          )}

          {/* <div className="p-4 border-t">
            <Link href="/account" className="text-sm block">
              Account
            </Link>
          </div> */}
        </SheetContent>
      </Sheet>

      <div>
        <Link href="/" className="inline-block">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-10 h-auto"
            priority
          />
        </Link>
      </div>

      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 text-left text-sm">
              <Button variant="outline" size="icon" className="bg-transparent">
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
                    sizes=""
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
        <Button
          variant="outline"
          size="icon"
          className="bg-transparent"
          onClick={handleLoginClick}
        >
          <User2 />
        </Button>
      )}
    </div>
  );
}
