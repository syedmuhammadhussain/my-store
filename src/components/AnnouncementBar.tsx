// src/components/AnnouncementBar.tsx
"use client";

import Marquee from "react-fast-marquee";

interface AnnouncementBarProps {
  messages: string[];
}

export function AnnouncementBar({ messages }: AnnouncementBarProps) {
  return (
    <div className="bg-[#bdb4ff] py-2">
      <Marquee pauseOnHover gradient={false} speed={50}>
        {messages.map((msg, i) => (
          <span key={i} className="mx-8 text-sm md:text-base">
            {msg}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
