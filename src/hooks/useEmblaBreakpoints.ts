// hooks/useEmblaBreakpoints.ts
import { useMedia } from "react-use";

type SlidesToScrollMap = {
  mobile?: number;
  tabletPortrait?: number;
  desktop?: number;
  wideDesktop?: number;
};

type Props = {
  alwaysOne?: boolean;
  slidesToScroll?: SlidesToScrollMap; // NEW: per-breakpoint override
  align?: "start" | "center" | "end";
  containScroll?: "trimSnaps" | "keepSnaps";
  loop?: boolean;
  dragFree?: boolean;
};

export function useEmblaBreakpoints({
  alwaysOne,
  slidesToScroll,
  align = "start",
  containScroll = "trimSnaps",
  loop = false,
  dragFree,
}: Props) {
  // SSR-safe media queries
  const isMobile = useMedia("(max-width: 767px)", false);
  const isTabletPortrait = useMedia(
    "(max-width: 1023px) and (orientation: portrait)",
    false
  );
  const isDesktop = useMedia("(min-width: 1024px)", false);
  const isWideDesktop = useMedia("(min-width: 1440px)", false);

  const defaults = {
    mobile: alwaysOne ? 1 : 2,
    tabletPortrait: alwaysOne ? 1 : 2,
    desktop: alwaysOne ? 1 : 3,
    wideDesktop: alwaysOne ? 1 : 4,
  };

  const s2s = {
    mobile: slidesToScroll?.mobile ?? defaults.mobile,
    tabletPortrait: slidesToScroll?.tabletPortrait ?? defaults.tabletPortrait,
    desktop: slidesToScroll?.desktop ?? defaults.desktop,
    wideDesktop: slidesToScroll?.wideDesktop ?? defaults.wideDesktop,
  };

  const base = {
    align,
    containScroll,
    loop,
    ...(dragFree !== undefined ? { dragFree } : {}),
  } as const;

  const configMap = {
    mobile: { ...base, slidesToScroll: s2s.mobile },
    tabletPortrait: { ...base, slidesToScroll: s2s.tabletPortrait },
    desktop: { ...base, slidesToScroll: s2s.desktop },
    wideDesktop: { ...base, slidesToScroll: s2s.wideDesktop },
  } as const;

  if (isMobile) return configMap.mobile;
  if (isTabletPortrait) return configMap.tabletPortrait;
  if (isWideDesktop) return configMap.wideDesktop;
  if (isDesktop) return configMap.desktop;

  return configMap.desktop;
}
