"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu as MenuIcon, Plus, Minus, X } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetOverlay,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { CategoryAttributes } from "@/types/category";
import { Description, DialogTitle } from "@radix-ui/react-dialog";

type Props = { categories: CategoryAttributes[] };

import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User2 } from "lucide-react";

export default function MobileNav({ categories }: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { data: session } = useSession();
  const userImage = (session?.user as any)?.image;
  const username = session?.user?.name || session?.user?.username || "Account";

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

  const toggleSub = (label: string) =>
    setOpenMenu((curr) => (curr === label ? null : label));

  const redirect = (link: string) => {};

  return (
    <div className="md:hidden relative w-full flex items-center justify-center px-4 py-3 bg-white shadow-sm z-40">
      <Sheet>
        <DialogTitle></DialogTitle>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Open menu"
            className="absolute left-4 top-1/2 -translate-y-1/2"
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
          <div className="flex items-center justify-between pb-4 border-b">
            <Image
              src="/logo.png"
              alt="Logo"
              width={0}
              height={0}
              sizes="40px"
              className="w-10 h-auto"
              priority
            />
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
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => (hasSub ? toggleSub(it.label) : null)}
                    >
                      <div>
                        <Link
                          href={it.href ?? "#"}
                          className="text-md font-medium"
                        >
                          {it.label}
                        </Link>
                      </div>

                      {hasSub && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSub(it.label);
                          }}
                          aria-label={isOpen ? "Collapse" : "Expand"}
                          className="p-1"
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
                              <Link
                                href={sub.href}
                                className="block py-1 text-sm"
                              >
                                {sub.label}
                              </Link>
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

          <div className="p-4 border-t">
            <Link href="/account" className="text-sm block">
              Account
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center justify-between pb-4 border-b">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="w-10 h-auto"
          priority
        />
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full overflow-hidden"
              >
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={username}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User2 />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/account">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="outline" size="icon">
              <User2 />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
