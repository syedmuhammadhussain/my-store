// src/components/AnnouncementBar.tsx
"use client";

import { cn } from "@/lib/utils";
import Marquee from "react-fast-marquee";

interface AnnouncementBarProps {
  messages: string[];
  direction?: "left" | "right" | "up" | "down" | undefined;
  height?: number | string;
  bgColorClass?: string;
  speed?: number
}

export function AnnouncementBar({
  messages,
  direction,
  height,
  bgColorClass,
  speed
}: AnnouncementBarProps) {
  return (
    <div className={cn("bg-[#bdb4ff] py-2", bgColorClass, height)}>
      <Marquee
        pauseOnHover
        gradient={false}
        speed={speed ?? 50}
        direction={direction ?? "left"}
      >
        {messages.map((msg, i) => (
          <span key={i} className="mx-8 text-sm md:text-base">
            {msg}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
