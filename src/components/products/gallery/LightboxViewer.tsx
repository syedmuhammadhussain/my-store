interface LightboxViewerProps {
  open: boolean;
  index: number;
  onClose: () => void;
  slides: any[];
  plugins: any[];
  LightboxComp: React.ComponentType<any>;
}

export function LightboxViewer({
  open,
  index,
  onClose,
  slides,
  plugins,
  LightboxComp,
}: LightboxViewerProps) {
  return (
    <LightboxComp
      open={open}
      index={index}
      close={onClose}
      slides={slides}
      plugins={plugins}
      styles={{
        container: { backgroundColor: "white" },
        toolbar: { background: "transparent" },
      }}
      carousel={{ finite: false }}
      zoom={{ enabled: true, maxZoomPixelRatio: 2 }}
    />
  );
}
