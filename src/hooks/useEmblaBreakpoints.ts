// hooks/useEmblaBreakpoints.ts
import { useMedia } from "react-use";

type Props = {
  alwaysOne?: boolean;
};

export function useEmblaBreakpoints({ alwaysOne }: Props) {
  // SSR-safe media queries
  const isMobile = useMedia("(max-width: 767px)", false);
  const isTabletPortrait = useMedia(
    "(max-width: 1023px) and (orientation: portrait)",
    false
  );
  const isDesktop = useMedia("(min-width: 1024px)", false);
  const isWideDesktop = useMedia("(min-width: 1440px)", false);

  // Config map
  const configMap = {
    mobile: {
      slidesToScroll: alwaysOne ? 1 : 2,
      align: "start" as const,
      containScroll: "trimSnaps" as const,
      loop: false,
    },
    tabletPortrait: {
      slidesToScroll: alwaysOne ? 1 : 2,
      align: "start" as const,
      containScroll: "trimSnaps" as const,
      loop: false,
    },
    desktop: {
      slidesToScroll: alwaysOne ? 1 : 3,
      align: "start" as const,
      containScroll: "trimSnaps" as const,
      loop: false,
    },
    wideDesktop: {
      slidesToScroll: alwaysOne ? 1 : 4,
      align: "start" as const,
      containScroll: "trimSnaps" as const,
      loop: false,
      dragFree: true,
    },
  } as const;

  // Priority logic
  if (isMobile) return configMap.mobile;
  if (isTabletPortrait) return configMap.tabletPortrait;
  if (isWideDesktop) return configMap.wideDesktop;
  if (isDesktop) return configMap.desktop;

  // Fallback
  return configMap.desktop;
}
