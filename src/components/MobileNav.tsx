"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu as MenuIcon,
  Plus,
  Minus,
  Home,
  FileText,
  BookOpen,
  Info,
  PhoneCall,
} from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import UserProfileDropDown from "./UserProfileDropDown";

const mobileMenu = [
  { label: "Home", href: "/", Icon: Home },
  {
    label: "Care Plans",
    href: "/care-plans",
    Icon: FileText,
    subItems: [
      { label: "Plan A", href: "/care-plans/plan-a" },
      { label: "Plan B", href: "/care-plans/plan-b" },
    ],
  },
  {
    label: "Learn",
    href: "/learn",
    Icon: BookOpen,
    subItems: [
      { label: "Article 1", href: "/learn/article-1" },
      { label: "Article 2", href: "/learn/article-2" },
    ],
  },
  { label: "About", href: "/about", Icon: Info },
  { label: "Contact", href: "/contact", Icon: PhoneCall },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [user] = useState<{ avatarUrl: string | null }>({ avatarUrl: null });

  const toggleSubMenu = (label: string) => {
    setOpenMenu((curr) => (curr === label ? null : label));
  };

  return (
    <div className="md:hidden relative w-full flex items-center justify-center px-4 py-3 bg-white shadow-sm z-10">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border-0"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-3/4 max-w-xs">
          <SheetHeader className="border-b pb-4">
            <SheetTitle>
              <Image src="/logo.svg" alt="Logo" width={120} height={32} />
            </SheetTitle>
          </SheetHeader>

          <nav className="mt-6 flex flex-col space-y-4">
            {mobileMenu.map((item) => {
              const hasSub = !!item.subItems;
              const isOpen = openMenu === item.label;

              return (
                <div key={item.label} className="space-y-1">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() =>
                      hasSub ? toggleSubMenu(item.label) : setOpen(false)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <item.Icon className="h-4 w-4" />
                      {hasSub ? (
                        <span className="text-md font-medium">
                          {item.label}
                        </span>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-md font-medium"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>

                    {hasSub && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubMenu(item.label);
                        }}
                        className="p-1"
                        aria-label={isOpen ? "Collapse" : "Expand"}
                      >
                        {isOpen ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {hasSub && (
                    <div
                      className={`
                        ml-8 overflow-hidden transform transition-all duration-300 ease-out
                        ${
                          isOpen
                            ? "max-h-64 opacity-100 translate-x-0"
                            : "max-h-0 opacity-0 -translate-x-4"
                        }
                      `}
                    >
                      {item.subItems!.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="flex items-center space-x-2 text-md py-1"
                          onClick={() => setOpen(false)}
                        >
                          <span className="inline-block w-4 text-center">
                            –
                          </span>
                          <span>{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <Link href="/" className="mx-auto">
        <Image src="/logo.svg" alt="Logo" width={120} height={32} />
      </Link>

      <Link
        href={user.avatarUrl ? "/profile" : "/login"}
        className="absolute right-4 top-1/2 -translate-y-1/2"
      >
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full border-2 border-gray-200"
          />
        ) : (
          <UserProfileDropDown />
        )}
      </Link>
    </div>
  );
}
