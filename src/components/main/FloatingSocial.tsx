// components/FloatingSocial.tsx
"use client";

import { MessageCircle } from "lucide-react";

export function FloatingSocial() {
  return (
    <div
      aria-label="Floating social links"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 md:gap-4"
    >
      {/* WhatsApp (primary) */}
      <a
        href="https://wa.me/0000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
        aria-label="WhatsApp chat"
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
        <span className="sr-only">Chat on WhatsApp</span>
      </a>

      {/* Secondary socials */}
      {/* <div className="flex flex-col items-center gap-2">
        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/90 text-white backdrop-blur hover:bg-black"
          aria-label="Instagram"
        >
          <Instagram className="h-5 w-5" />
        </a>
      </div> */}
    </div>
  );
}
