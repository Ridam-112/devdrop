"use client";

import React, { useEffect, useRef, useState } from "react";

// Generic Adsterra Iframe Banner component
interface AdsterraIframeProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

export const AdsterraIframeBanner: React.FC<AdsterraIframeProps> = ({
  adKey,
  width,
  height,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy-load banner only when scrolled into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: "200px" }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = "";

    const loadIframe = () => {
      try {
        const iframe = document.createElement("iframe");
        iframe.width = `${width}`;
        iframe.height = `${height}`;
        iframe.style.border = "none";
        iframe.style.overflow = "hidden";
        iframe.scrolling = "no";
        iframe.title = "Sponsored Advertisement";

        el.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <base target="_blank">
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: transparent;
                  }
                </style>
              </head>
              <body>
                <script type="text/javascript">
                  atOptions = {
                    'key' : '${adKey}',
                    'format' : 'iframe',
                    'height' : ${height},
                    'width' : ${width},
                    'params' : {}
                  };
                </script>
                <script type="text/javascript" src="https://bauval.org/22/${adKey}"></script>
              </body>
            </html>
          `);
          doc.close();
        }
      } catch (err) {
        console.warn(`Adsterra banner (${width}x${height}) init note:`, err);
      }
    };

    if ("requestIdleCallback" in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(loadIframe);
    } else {
      setTimeout(loadIframe, 500);
    }
  }, [isVisible, adKey, width, height]);

  return (
    <div
      ref={containerRef}
      style={{ minHeight: `${height}px`, minWidth: `${Math.min(width, 280)}px` }}
      className={`flex justify-center items-center overflow-x-auto overflow-y-hidden max-w-full ${className}`}
    />
  );
};

// 468x60 Banner (Desktop / Tablet)
export const AdsterraBanner468x60: React.FC = () => (
  <AdsterraIframeBanner
    adKey="78ad68ffa16b9dd6ea75e8ddcc2c0a84"
    width={468}
    height={60}
  />
);

// 320x50 Banner (Mobile standard)
export const AdsterraBanner320x50: React.FC = () => (
  <AdsterraIframeBanner
    adKey="25e4b7a687ebb6cca3b287b9b31b1091"
    width={320}
    height={50}
  />
);

// 160x300 Vertical Banner
export const AdsterraBanner160x300: React.FC = () => (
  <AdsterraIframeBanner
    adKey="d36713b0622a14d0f7c813eeef0ba3c3"
    width={160}
    height={300}
  />
);

// 160x600 Skyscraper Sidebar Banner
export const AdsterraBanner160x600: React.FC = () => (
  <AdsterraIframeBanner
    adKey="d71d068f03039eea4cf854034ee08268"
    width={160}
    height={600}
  />
);

// Responsive Horizontal Banner: 468x60 on sm/md/lg, 320x50 on mobile
export const AdsterraResponsiveBanner: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center min-h-[60px]">
      <div className="hidden sm:flex justify-center">
        <AdsterraBanner468x60 />
      </div>
      <div className="flex sm:hidden justify-center">
        <AdsterraBanner320x50 />
      </div>
    </div>
  );
};

// Native Ad Container
export const AdsterraNativeBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const loadScript = () => {
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = "https://bauval.org/21/e3fd0062bd8745fa6fca6aa87545b640";
      document.body.appendChild(script);
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if ("requestIdleCallback" in window) {
              (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(loadScript);
            } else {
              setTimeout(loadScript, 500);
            }
            observer.disconnect();
          }
        },
        { rootMargin: "200px" }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      setTimeout(loadScript, 1000);
    }
  }, []);

  return (
    <div className="w-full my-3 flex justify-center items-center overflow-hidden min-h-[90px]">
      <div
        id="container-e3fd0062bd8745fa6fca6aa87545b640"
        ref={containerRef}
        className="w-full max-w-4xl min-h-[90px]"
      />
    </div>
  );
};

interface AdvertisementSlotProps {
  slotId?: string;
  format?: "banner" | "rectangle" | "horizontal" | "sidebar" | "mobile" | "native" | "smartlink";
  className?: string;
}

export const AdvertisementSlot: React.FC<AdvertisementSlotProps> = ({
  slotId = "ad-slot-default",
  format = "horizontal",
  className = "",
}) => {
  const getMinHeightClass = () => {
    switch (format) {
      case "sidebar":
        return "min-h-[610px]";
      case "rectangle":
        return "min-h-[310px]";
      case "mobile":
        return "min-h-[60px]";
      case "banner":
        return "min-h-[70px]";
      case "smartlink":
      case "horizontal":
      case "native":
      default:
        return "min-h-[90px]";
    }
  };

  const renderAdFormat = () => {
    switch (format) {
      case "horizontal":
      case "native":
        return <AdsterraNativeBanner />;
      case "banner":
        return <AdsterraResponsiveBanner />;
      case "sidebar":
        return <AdsterraBanner160x600 />;
      case "rectangle":
        return <AdsterraBanner160x300 />;
      case "mobile":
        return <AdsterraBanner320x50 />;
      case "smartlink":
        return <AdsterraResponsiveBanner />;
      default:
        return <AdsterraResponsiveBanner />;
    }
  };

  return (
    <aside
      className={`mx-auto w-full my-6 flex flex-col items-center justify-center ${getMinHeightClass()} ${className}`}
      aria-label="Advertisement"
    >
      <div className="w-full flex items-center justify-between mb-1.5 px-2 opacity-70">
        <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
          Advertisement
        </span>
      </div>

      <div
        id={slotId}
        className={`w-full flex justify-center items-center py-2 px-1 border border-neutral-800/60 rounded-xl bg-neutral-900/60 transition-colors duration-200 hover:border-cyan-500/20 ${getMinHeightClass()}`}
      >
        {renderAdFormat()}
      </div>
    </aside>
  );
};
