"use client";

import { ShieldCheck, Handshake, LockKeyhole } from "lucide-react";

export default function TrustBadges() {
  return (
    <div className="mt-6 space-y-3">
      <p className="flex items-center gap-2 text-md font-semibold">
        <ShieldCheck size={20} /> Exceptional Customer Service
      </p>
      <p className="flex items-center gap-2 text-md font-semibold">
        <Handshake size={20} /> Easy Exchange
      </p>
      <p className="flex items-center gap-2 text-md font-semibold">
        <LockKeyhole size={20} /> Secure Payment
      </p>
    </div>
  );
}
