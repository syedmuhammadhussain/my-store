"use client";

import { useEffect, useState } from "react";

export default function PageLoader({ active }: { active: boolean }) {
  const [show, setShow] = useState(active);

  // small delay to avoid flashing on super-fast responses
  useEffect(() => {
    let t: number | undefined;
    if (active) setShow(true);
    else t = window.setTimeout(() => setShow(false), 150); // graceful fade-out
    return () => clearTimeout(t);
  }, [active]);

  if (!show) return null;

  return (
    <div
      aria-hidden={!active}
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-white transition-opacity duration-200 ${
        active ? "opacity-60" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        {/* <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
        <span className="text-sm text-gray-600">Updating products…</span> */}
      </div>
    </div>
  );
}
