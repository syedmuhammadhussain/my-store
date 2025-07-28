"use client";

import React, { useState } from "react";

interface Props {
  subCategories: string[];
  name: string;
}

export default function CategoryButton({ subCategories, name }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="p-3 text-left justify-center md:my-6">
      <h3 className="font-medium mb-5 text-xl md:text-3xl">{name}</h3>
      <div className="flex flex-wrap gap-2">
        {subCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`
              text-xs md:text-sm uppercase cursor-pointer flex-1 min-w-[120px] max-w-full
              px-3 py-2 font-medium text-center border-2 border-gray-600 shadow-none rounded-md
              transition-colors duration-200
              ${
                selected === cat
                  ? "bg-black text-white border-black"
                  : "text-black hover:bg-gray-100"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
