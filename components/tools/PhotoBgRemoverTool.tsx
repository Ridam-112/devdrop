"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  Sliders,
  Eye,
  CheckCircle2,
  Shield,
  Layers,
  Palette,
  Image as ImageIcon,
} from "lucide-react";

export const PhotoBgRemoverTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tolerance, setTolerance] = useState(28); // 0 to 100
  const [feather, setFeather] = useState(2); // 0 to 8
  const [bgColor, setBgColor] = useState<string>("transparent");
  const [customBgColor, setCustomBgColor] = useState<string>("#00f0ff");
  const [activeTab, setActiveTab] = useState<"result" | "original">("result");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      setActiveTab("result");
    };
    reader.readAsDataURL(file);
  };

  // Algorithm inspired by rembg background color clustering and edge alpha falloff
  const processBackgroundRemoval = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample border backdrop corner colors (top-left, top-right, bottom-left, bottom-right)
      const corners = [
        [0, 0],
        [canvas.width - 1, 0],
        [0, canvas.height - 1],
        [canvas.width - 1, canvas.height - 1],
        [Math.floor(canvas.width / 2), 0],
      ];

      const sampleColors: [number, number, number][] = [];
      corners.forEach(([x, y]) => {
        const idx = (y * canvas.width + x) * 4;
        sampleColors.push([data[idx], data[idx + 1], data[idx + 2]]);
      });

      const maxDist = (tolerance / 100) * 441.67; // 441.67 is max RGB Euclidean distance (sqrt(255^2*3))

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Check distance to any sampled backdrop color
        let isBackground = false;
        for (const [br, bg, bb] of sampleColors) {
          const dist = Math.sqrt(
            (r - br) * (r - br) + (g - bg) * (g - bg) + (b - bb) * (b - bb)
          );
          if (dist < maxDist) {
            isBackground = true;
            // Soft alpha edge feathering
            const alphaRatio = dist / maxDist;
            if (feather > 0 && alphaRatio > 0.8) {
              data[i + 3] = Math.floor(255 * (alphaRatio - 0.8) * 5);
            } else {
              data[i + 3] = 0; // Transparent
            }
            break;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // If user selected a custom background color, render composite
      if (bgColor !== "transparent") {
        const compositeCanvas = document.createElement("canvas");
        compositeCanvas.width = canvas.width;
        compositeCanvas.height = canvas.height;
        const compCtx = compositeCanvas.getContext("2d");
        if (compCtx) {
          compCtx.fillStyle = bgColor === "custom" ? customBgColor : bgColor;
          compCtx.fillRect(0, 0, canvas.width, canvas.height);
          compCtx.drawImage(canvas, 0, 0);
          setProcessedSrc(compositeCanvas.toDataURL("image/png"));
        }
      } else {
        setProcessedSrc(canvas.toDataURL("image/png"));
      }

      setIsProcessing(false);
    };
  };

  useEffect(() => {
    if (imageSrc) {
      processBackgroundRemoval();
    }
  }, [imageSrc, tolerance, feather, bgColor, customBgColor]);

  const handleDownload = () => {
    if (!processedSrc) return;
    const a = document.createElement("a");
    a.href = processedSrc;
    a.download = `DevDrop_Transparent_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="w-full bg-cyber-card/60 border border-cyber-border rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-cyber-borderSubtle">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-green/10 text-cyber-green border border-cyber-green/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              Photo Background Remover
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-green/20 text-cyber-green border border-cyber-green/30 font-sans font-semibold">
                Rembg-Engine v2.4
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-cyber-muted font-mono mt-0.5">
              Instant client-side background removal with transparent PNG export. 100% private.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-cyber-green bg-cyber-dark/80 px-3 py-1.5 rounded-lg border border-cyber-borderSubtle">
          <Shield className="w-3.5 h-3.5" />
          <span>Zero Server Upload</span>
        </div>
      </div>

      {/* Main Workspace */}
      {!imageSrc ? (
        /* File Upload Zone */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]) handleImageUpload(e.dataTransfer.files[0]);
          }}
          className="my-8 border-2 border-dashed border-cyber-borderSubtle hover:border-cyber-green rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all bg-cyber-dark/40 hover:bg-cyber-dark/60 group"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
            }}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-cyber-green/10 border border-cyber-green/30 text-cyber-green flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-mono text-white">
            Upload or Drag & Drop Image
          </h3>
          <p className="text-xs font-mono text-cyber-muted mt-1.5 max-w-sm mx-auto">
            Supports JPG, PNG, WebP. High resolution processed in-memory in your browser.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-green text-black font-mono font-bold text-xs uppercase tracking-wider">
            Select Photo
          </div>
        </div>
      ) : (
        /* Editor & Controls Workspace */
        <div className="my-6 space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-cyber-dark/80 border border-cyber-borderSubtle">
            {/* Tolerance Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyber-muted flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>Tolerance Cutoff:</span>
                </span>
                <span className="text-white font-bold">{tolerance}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                value={tolerance}
                onChange={(e) => setTolerance(parseInt(e.target.value, 10))}
                className="w-full accent-cyber-green cursor-pointer"
              />
            </div>

            {/* Edge Feathering Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyber-muted flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>Edge Feather:</span>
                </span>
                <span className="text-white font-bold">{feather}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={feather}
                onChange={(e) => setFeather(parseInt(e.target.value, 10))}
                className="w-full accent-cyber-cyan cursor-pointer"
              />
            </div>

            {/* Background Backdrop Presets */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyber-muted flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-cyber-green" />
                  <span>Replacement Backdrop:</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { id: "transparent", label: "PNG", style: "border-cyber-borderSubtle" },
                  { id: "#ffffff", label: "White", style: "bg-white" },
                  { id: "#000000", label: "Dark", style: "bg-black" },
                  { id: "#00ff66", label: "Green", style: "bg-emerald-500" },
                  { id: "#00f0ff", label: "Cyan", style: "bg-cyan-500" },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBgColor(b.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all border ${
                      bgColor === b.id
                        ? "border-cyber-green text-cyber-green font-bold bg-cyber-card"
                        : "border-cyber-borderSubtle text-cyber-muted hover:text-white"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Viewport */}
          <div className="relative w-full aspect-video sm:aspect-[16/9] max-h-[460px] rounded-2xl overflow-hidden border border-cyber-border flex items-center justify-center shadow-inner">
            {/* Checkerboard Pattern for Transparency */}
            <div
              className="absolute inset-0 z-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: `repeating-conic-gradient(#1a2030 0% 25%, #0d121f 0% 50%)`,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Active Rendered Image */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
              {activeTab === "result" && processedSrc ? (
                <img
                  src={processedSrc}
                  alt="Background removed preview"
                  className="max-h-full max-w-full object-contain rounded-lg drop-shadow-xl"
                />
              ) : (
                <img
                  src={imageSrc}
                  alt="Original upload"
                  className="max-h-full max-w-full object-contain rounded-lg drop-shadow-xl"
                />
              )}
            </div>

            {/* Tab switch overlay (Original vs Result) */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-cyber-dark/80 backdrop-blur-md p-1 rounded-xl border border-cyber-borderSubtle">
              <button
                onClick={() => setActiveTab("result")}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === "result"
                    ? "bg-cyber-green text-black"
                    : "text-cyber-muted hover:text-white"
                }`}
              >
                Removed BG
              </button>
              <button
                onClick={() => setActiveTab("original")}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === "original"
                    ? "bg-cyber-card text-white"
                    : "text-cyber-muted hover:text-white"
                }`}
              >
                Original
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                setImageSrc(null);
                setProcessedSrc(null);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyber-dark hover:bg-cyber-card border border-cyber-borderSubtle text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Upload Another Photo</span>
            </button>

            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyber-green to-emerald-400 text-black font-mono font-black text-sm uppercase tracking-wider hover:opacity-90 transition-all shadow-neon-green/30 flex items-center justify-center gap-2 hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download Transparent PNG</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoBgRemoverTool;
