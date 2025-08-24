"use client";

import { useCallback, useState } from "react";

export function useLightbox() {
  const [LightboxComp, setLightboxComp] = useState<React.ComponentType<any> | null>(null);
  const [plugins, setPlugins] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadLightbox = useCallback(async () => {
    if (loaded) return;
    const [{ default: Lightbox }, Zoom] = await Promise.all([
      import("yet-another-react-lightbox"),
      import("yet-another-react-lightbox/plugins/zoom"),
      import("yet-another-react-lightbox/styles.css"),
    ]);
    setLightboxComp(() => Lightbox);
    setPlugins([Zoom.default || Zoom]);
    setLoaded(true);
  }, [loaded]);

  return { LightboxComp, plugins, loadLightbox, loaded };
}
