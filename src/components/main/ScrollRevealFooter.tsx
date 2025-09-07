// components/ScrollRevealFooter.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  // Pinterest,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

type Props = {
  logoSrc?: string;
  logoAlt?: string;
  whatsappHref?: string;
  rewardsHref?: string;
};

export function ScrollRevealFooter({
  logoSrc = "/logo-snoozzfit.svg",
  logoAlt = "Snoozzfit",
  whatsappHref = "https://wa.me/0000000000",
  rewardsHref = "/rewards",
}: Props) {
  // Sticky-reveal runway: as you approach the footer, it pins and subtly translates into place.
  const spacerRef = React.useRef<HTMLDivElement | null>(null);
  const footerRef = React.useRef<HTMLElement | null>(null);
  const [reveal, setReveal] = React.useState(0); // 0..1 translate/opacity

  React.useEffect(() => {
    let ticking = false;

    const compute = () => {
      ticking = false;
      const spacer = spacerRef.current;
      const footer = footerRef.current;
      if (!spacer || !footer) return;

      const spacerRect = spacer.getBoundingClientRect();
      const h = Math.max(1, spacerRect.height); // prevent divide-by-zero
      // When spacer bottom nears the viewport bottom, increase reveal.
      const progress = 1 - Math.min(1, Math.max(0, spacerRect.bottom / h));
      // Ease a bit for a softer feel
      const eased = Math.min(1, Math.max(0, easeOutCubic(progress)));
      setReveal(eased);
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };

    compute();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return (
    <section aria-label="Footer reveal region" className="relative">
      {/* Runway that creates the “pinning” feel. Increase to pin longer. */}
      <div ref={spacerRef} className="h-[48vh] md:h-[60vh]" aria-hidden="true" />

      <footer
        ref={footerRef}
        className={clsx(
          "sticky bottom-0 z-40 w-full bg-black text-white",
          "will-change-transform"
        )}
        // Subtle translate/opacity as you approach bottom
        style={{
          transform: `translateY(${(1 - reveal) * 16}px)`,
          opacity: 0.75 + 0.25 * reveal,
          transition: "opacity 200ms linear",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          {/* Top grid */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {/* Logo + Vision */}
            <div className="md:col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                {/* Logo (image or text fallback) */}
                {logoSrc ? (
                  <Image
                    src={logoSrc}
                    alt={logoAlt}
                    width={140}
                    height={36}
                    className="h-9 w-auto"
                    priority
                  />
                ) : (
                  <span className="text-xl font-semibold">Snoozzfit</span>
                )}
              </div>
              <div className="space-y-3">
                <h3 className="text-base font-semibold tracking-tight">Our Vision</h3>
                <p className="max-w-prose text-sm leading-relaxed text-neutral-300">
                  We’re committed to premium, chic loungewear aligned with comfort, sustainability, and
                  conscious living. Using eco‑friendly materials and refined design, we create pieces
                  that feel good and look effortless for everyday wear.
                </p>
              </div>
            </div>

            {/* About Us */}
            <nav className="space-y-3">
              <p className="text-sm font-semibold">About Us</p>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li>
                  <Link href="/our-story" className="hover:text-white">Our Story</Link>
                </li>
                <li>
                  <Link href="/our-impact" className="hover:text-white">Our Impact</Link>
                </li>
                <li>
                  <Link href="/blogs" className="hover:text-white">Blogs</Link>
                </li>
                <li>
                  <Link href="/why-snoozzfit" className="hover:text-white">Why Snoozzfit</Link>
                </li>
                <li>
                  <Link href="/contact-us" className="hover:text-white">Contact Us</Link>
                </li>
              </ul>
            </nav>

            {/* Info */}
            <nav className="space-y-3">
              <p className="text-sm font-semibold">Info</p>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li>
                  <Link href="/faqs" className="hover:text-white">FAQs</Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="hover:text-white">Shipping Policy</Link>
                </li>
                <li>
                  <Link href="/refund-and-exchange" className="hover:text-white">Refund & Exchange</Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="hover:text-white">Terms & Conditions</Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Divider */}
          <div className="my-8 h-px w-full bg-neutral-800" />

          {/* Bottom bar */}
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
            {/* Socials */}
            <div className="flex items-center gap-3">
              <SocialIcon href="https://instagram.com" label="Instagram">
                <Instagram className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="https://facebook.com" label="Facebook">
                <Facebook className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="https://youtube.com" label="YouTube">
                <Youtube className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="https://linkedin.com" label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </SocialIcon>
              {/* <SocialIcon href="https://pinterest.com" label="Pinterest">
                <Pinterest className="h-4 w-4" />
              </SocialIcon> */}
            </div>

            {/* Copyright */}
            <div className="text-xs text-neutral-400">
              © 2023, Snoozzfit | Managed by apternn
            </div>

            {/* Actions: WhatsApp + Rewards */}
            <div className="flex items-center gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp support"
                className="inline-flex items-center gap-2 rounded-full bg-green-500 px-3 py-2 text-sm font-medium text-white shadow-md transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <MessageCircle className="h-4 w-4" />
                Support
              </a>
              <Link href={rewardsHref} aria-label="Rewards">
                <Button
                  variant="secondary"
                  className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20"
                >
                  Rewards
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}

// Small easing helper
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#001e30] text-neutral-200 transition hover:bg-neutral-800 hover:text-white"
    >
      {children}
    </a>
  );
}
