// components/Footer.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Youtube,
  Mail,
} from "lucide-react";
import clsx from "clsx";

export function Footer() {
  // In-view toggle for subtle translate-on-enter
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setInView(true);
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // Wrapper creates a scroll context so the sticky footer "reveals" as you approach it
    <section
      aria-label="Footer reveal region"
      className="relative bg-transparent"
    >
      {/* Spacer provides runway for the sticky pinning; tweak as desired */}
      {/* <div className="h-[40vh] md:h-[55vh]" /> */}

      <div ref={ref} className="relative">
        <footer
          className={clsx(
            "sticky bottom-0 z-40 w-full bg-black text-white",
            "transition-all duration-700 ease-out",
            "will-change-transform",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
              {/* Mission */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold">Our mission</h3>
                <p className="text-sm text-neutral-300">
                  Our mission is to create thoughtfully designed pieces that
                  blend effortless style with eco-friendly materials, ensuring
                  that our customers feel both comfortable and stylish in their
                  everyday wear.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <Mail
                    className="h-4 w-4 text-neutral-300"
                    aria-hidden="true"
                  />
                  <a
                    href="mailto:hello@azfashionapparel.com"
                    className="text-sm text-neutral-200 hover:text-white"
                  >
                    hello@azfashionapparel.com
                  </a>
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">Explore</p>
                <ul className="space-y-2 text-sm text-neutral-300">
                  <li>
                    <Link href="/blog" className="hover:text-white">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Policies */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">Support</p>
                <ul className="space-y-2 text-sm text-neutral-300">
                  <li>
                    <Link
                      href="/refund-and-exchange-policy"
                      className="hover:text-white"
                    >
                      Refund & Exchange Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-and-conditions"
                      className="hover:text-white"
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 h-px w-full bg-neutral-800" />

            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="text-xs text-neutral-400">
                © {new Date().getFullYear()} Snoozzoff. All rights reserved.
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://wa.me/0000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="rounded-full bg-neutral-900 p-2 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="rounded-full bg-neutral-900 p-2 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="rounded-full bg-neutral-900 p-2 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="rounded-full bg-neutral-900 p-2 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
              <div className="text-xs text-neutral-400">Managed by Boro</div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
