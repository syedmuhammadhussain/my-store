import { useEffect, useState } from "react";

/**
 * Toggle `play` to restart CSS animations when deps change.
 * Use small deps array like [itemsKey, category, filtersKey]
 */
export function useRestartAnimation(deps: unknown[]) {
  const [play, setPlay] = useState(true);

  useEffect(() => {
    // briefly turn off then on so CSS animation restarts
    setPlay(false);
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPlay(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return play;
}
