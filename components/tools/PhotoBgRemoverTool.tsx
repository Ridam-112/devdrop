"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Cpu,
  Cloud,
  Zap,
  AlertCircle
} from "lucide-react";

export const PhotoBgRemoverTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [engineMode, setEngineMode] = useState<"ai" | "local">("ai");
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Local tuning controls
  const [tolerance, setTolerance] = useState(28); // 0 to 100
  const [feather, setFeather] = useState(2); // 0 to 8
  const [bgColor, setBgColor] = useState<string>("transparent");
  const [customBgColor, setCustomBgColor] = useState<string>("#00f0ff");
  const [activeTab, setActiveTab] = useState<"result" | "original">("result");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local Canvas background removal (inspired by rembg color-clustering)
  const processLocalRemoval = useCallback(() => {
    if (!imageSrc) return;
    setIsProcessing(true);
    setApiError(null);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      // Draw original
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample border corner colors
      const corners = [
        [0, 0],
        [canvas.width - 1, 0],
        [0, canvas.height - 1],
        [canvas.width - 1, canvas.height - 1],
        [Math.floor(canvas.width / 2), 0],
        [0, Math.floor(canvas.height / 2)],
        [canvas.width - 1, Math.floor(canvas.height / 2)],
      ];

      const sampleColors: [number, number, number][] = [];
      corners.forEach(([x, y]) => {
        const idx = (y * canvas.width + x) * 4;
        sampleColors.push([data[idx], data[idx + 1], data[idx + 2]]);
      });

      const maxDist = (tolerance / 100) * 441.67;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        let isBg = false;
        for (const [br, bg, bb] of sampleColors) {
          const dist = Math.sqrt(
            (r - br) * (r - br) + (g - bg) * (g - bg) + (b - bb) * (b - bb)
          );
          if (dist < maxDist) {
            isBg = true;
            const alphaRatio = dist / maxDist;
            if (feather > 0 && alphaRatio > 0.8) {
              data[i + 3] = Math.floor(255 * (alphaRatio - 0.8) * 5);
            } else {
              data[i + 3] = 0;
            }
            break;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setProcessedSrc(canvas.toDataURL("image/png"));
      setIsProcessing(false);
    };
  }, [imageSrc, tolerance, feather]);

  // AI Cloud Removal via remove.bg API
  const processAiRemoval = useCallback(async (file: File | null, b64Src: string | null) => {
    setIsProcessing(true);
    setApiError(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append("image_file", file);
      } else if (b64Src) {
        formData.append("image_file_b64", b64Src);
      } else {
        processLocalRemoval();
        return;
      }

      const res = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("image/png")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setProcessedSrc(url);
      } else {
        const data = await res.json();
        if (data.fallbackRequired || !data.success) {
          setApiError(
            `Remove.bg API notice: ${data.error || "Rate limit or credit limit reached"}. Automatically engaged local rembg engine.`
          );
          setEngineMode("local");
          processLocalRemoval();
          return;
        }
      }
    } catch (err: any) {
      setApiError(`Cloud error: ${err.message}. Switched to local rembg engine.`);
      setEngineMode("local");
      processLocalRemoval();
    } finally {
      setIsProcessing(false);
    }
  }, [processLocalRemoval]);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP)");
      return;
    }
    setCurrentFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      setActiveTab("result");

      if (engineMode === "ai") {
        processAiRemoval(file, src);
      } else {
        setTimeout(processLocalRemoval, 50);
      }
    };
    reader.readAsDataURL(file);
  };

  // Re-run if engineMode or tuning sliders change
  const handleEngineSwitch = (newMode: "ai" | "local") => {
    setEngineMode(newMode);
    if (newMode === "ai") {
      processAiRemoval(currentFile, imageSrc);
    } else {
      processLocalRemoval();
    }
  };

  useEffect(() => {
    if (imageSrc && engineMode === "local") {
      processLocalRemoval();
    }
  }, [tolerance, feather, imageSrc, engineMode, processLocalRemoval]);

  const handleDownload = () => {
    if (!processedSrc) return;

    // If a background color is chosen (not transparent), composite it before download
    if (bgColor !== "transparent") {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = processedSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = bgColor === "custom" ? customBgColor : bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `devdrop-cutout-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    } else {
      const a = document.createElement("a");
      a.href = processedSrc;
      a.download = `devdrop-transparent-bg-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Upload Zone */}
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleImageUpload(e.dataTransfer.files[0]);
            }
          }}
          className="border-2 border-dashed border-cyber-green/40 hover:border-cyber-green bg-cyber-card/60 hover:bg-cyber-card/90 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 group shadow-xl hover:shadow-neon-green/10"
        >
          <div className="w-20 h-20 rounded-full bg-cyber-green/10 flex items-center justify-center border border-cyber-green/30 group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10 text-cyber-green" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2 font-mono">
              Drop any photo here or browse
            </h3>
            <p className="text-neutral-400 text-sm max-w-md">
              Powered by Remove.bg AI & client-side rembg algorithms. Perfect for portraits, product photos, cars, and graphics.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
              <Sparkles className="w-3.5 h-3.5" /> Remove.bg AI Engine Active
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 text-cyan-400 border border-cyan-800/40">
              <Shield className="w-3.5 h-3.5" /> Zero Private Data Storage
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* API notice banner if fallback used */}
          {apiError && (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Engine Selector & Controls Bar */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              {/* Engine Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  AI Engine:
                </span>
                <div className="flex rounded-lg bg-neutral-950 p-1 border border-neutral-800">
                  <button
                    onClick={() => handleEngineSwitch("ai")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                      engineMode === "ai"
                        ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Cloud className="w-3.5 h-3.5" /> Remove.bg AI (HD)
                  </button>
                  <button
                    onClick={() => handleEngineSwitch("local")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                      engineMode === "local"
                        ? "bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" /> Local rembg (Canvas)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (engineMode === "ai") processAiRemoval(currentFile, imageSrc);
                    else processLocalRemoval();
                  }}
                  disabled={isProcessing}
                  className="text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin" : ""}`} />
                  Re-process
                </button>
                <button
                  onClick={() => {
                    setImageSrc(null);
                    setCurrentFile(null);
                    setProcessedSrc(null);
                    setApiError(null);
                  }}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition"
                >
                  <Upload className="w-3.5 h-3.5" /> New Photo
                </button>
              </div>
            </div>

            {/* Backdrop Replacer */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-emerald-400" /> Replace Background:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "transparent", label: "Transparent", class: "bg-neutral-800 text-neutral-200 border-neutral-700" },
                  { id: "#ffffff", label: "Pure White", class: "bg-white text-black border-neutral-300 font-semibold" },
                  { id: "#0f172a", label: "Dark Slate", class: "bg-slate-900 text-white border-slate-700" },
                  { id: "#00ff66", label: "Chroma Green", class: "bg-green-500 text-black font-semibold border-green-600" },
                  { id: "#06b6d4", label: "Cyan Glow", class: "bg-cyan-500 text-black font-semibold border-cyan-600" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setBgColor(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition ${item.class} ${
                      bgColor === item.id ? "ring-2 ring-emerald-400 shadow-md" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 px-2 py-1 rounded-lg">
                  <input
                    type="color"
                    value={customBgColor}
                    onChange={(e) => {
                      setCustomBgColor(e.target.value);
                      setBgColor("custom");
                    }}
                    className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                    title="Choose custom background color"
                  />
                  <span className="text-[11px] text-neutral-400 font-mono">Custom</span>
                </div>
              </div>
            </div>

            {/* Local Fine-Tuning Sliders (Available when local engine is selected or for custom edge softening) */}
            {engineMode === "local" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-neutral-800">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Color Tolerance</span>
                    <span className="text-emerald-400 font-mono font-bold">{tolerance}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Edge Feathering</span>
                    <span className="text-emerald-400 font-mono font-bold">{feather}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    value={feather}
                    onChange={(e) => setFeather(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-2 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                <button
                  onClick={() => setActiveTab("result")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                    activeTab === "result"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Cutout Result
                </button>
                <button
                  onClick={() => setActiveTab("original")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                    activeTab === "original"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Original Photo
                </button>
              </div>

              {isProcessing && (
                <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
                  <Zap className="w-3.5 h-3.5 animate-spin" /> Processing AI cutout...
                </span>
              )}
            </div>

            <button
              onClick={handleDownload}
              disabled={!processedSrc || isProcessing}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
          </div>

          {/* Visual Canvas Display Area */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 min-h-[420px] flex items-center justify-center overflow-hidden">
            {activeTab === "result" ? (
              <div
                className="w-full h-full max-h-[500px] flex items-center justify-center p-4 rounded-xl transition-colors duration-300 relative"
                style={{
                  backgroundColor:
                    bgColor === "transparent"
                      ? undefined
                      : bgColor === "custom"
                      ? customBgColor
                      : bgColor,
                  backgroundImage:
                    bgColor === "transparent"
                      ? "repeating-conic-gradient(#1f2937 0% 25%, #111827 0% 50%)"
                      : undefined,
                  backgroundSize: bgColor === "transparent" ? "20px 20px" : undefined,
                }}
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-3 p-8 bg-neutral-900/80 rounded-2xl border border-neutral-700">
                    <Sparkles className="w-8 h-8 text-emerald-400 animate-spin" />
                    <span className="text-sm font-bold text-white">Removing Background...</span>
                    <span className="text-xs text-neutral-400">
                      {engineMode === "ai" ? "Calling Remove.bg AI model" : "Clustering image pixels"}
                    </span>
                  </div>
                ) : processedSrc ? (
                  <img
                    src={processedSrc}
                    alt="Cutout background removed"
                    className="max-h-[460px] max-w-full object-contain drop-shadow-2xl"
                  />
                ) : (
                  <span className="text-xs text-neutral-500">No cutout generated yet</span>
                )}
              </div>
            ) : (
              <div className="w-full max-h-[500px] flex items-center justify-center p-4">
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt="Original Upload"
                    className="max-h-[460px] max-w-full object-contain rounded-xl border border-neutral-800"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoBgRemoverTool;
