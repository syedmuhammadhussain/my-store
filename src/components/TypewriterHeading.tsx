// components/TypewriterHeading.tsx
"use client";

import { useTypewriter, Cursor } from "react-simple-typewriter";

interface Props {
  words: string[];
}

export function TypewriterHeading({ words }: Props) {
  const [text] = useTypewriter({
    words,
    loop: true, // infinite loop
    delaySpeed: 2000, // pause before deleting
    typeSpeed: 100, // typing speed
    deleteSpeed: 50, // deleting speed
  });

  return (
    <span className="text-blue-500">
      {text}
      <Cursor cursorStyle="|" />
    </span>
  );
}
