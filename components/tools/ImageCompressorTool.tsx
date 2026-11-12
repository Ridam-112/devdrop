"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Upload, 
  Download, 
  FileImage, 
  Zap, 
  Sliders, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  Maximize2
} from "lucide-react";

export default function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [compressedDimensions, setCompressedDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  
  const [quality, setQuality] = useState<number>(75);
  const [targetFormat, setTargetFormat] = useState<"image/jpeg" | "image/webp" | "image/png">("image/webp");
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"split" | "compressed" | "original">("split");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP, etc.)");
      return;
    }
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setOriginalPreview(result);

      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setMaxWidth(Math.min(img.naturalWidth, 1920));
      };
      img.src = result;
    };
    reader.readAsDataURL(selectedFile);
  };

  const compressImage = useCallback(() => {
    if (!originalPreview) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let finalWidth = img.naturalWidth;
      let finalHeight = img.naturalHeight;

      if (maxWidth && img.naturalWidth > maxWidth) {
        finalWidth = maxWidth;
        finalHeight = maintainAspect 
          ? Math.round((img.naturalHeight * maxWidth) / img.naturalWidth)
          : img.naturalHeight;
      }

      const canvas = document.createElement("canvas");
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // Fill white background for JPEG
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, finalWidth, finalHeight);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

      const qualityValue = targetFormat === "image/png" ? 1.0 : quality / 100;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedSize(blob.size);
            setCompressedDimensions({ width: finalWidth, height: finalHeight });
            const compressedUrl = URL.createObjectURL(blob);
            setCompressedPreview(compressedUrl);
          }
          setIsProcessing(false);
        },
        targetFormat,
        qualityValue
      );
    };
    img.src = originalPreview;
  }, [originalPreview, quality, targetFormat, maxWidth, maintainAspect]);

  useEffect(() => {
    if (originalPreview) {
      compressImage();
    }
  }, [originalPreview, quality, targetFormat, maxWidth, maintainAspect, compressImage]);

  const handleDownload = () => {
    if (!compressedPreview) return;
    const a = document.createElement("a");
    a.href = compressedPreview;
    const ext = targetFormat === "image/jpeg" ? "jpg" : targetFormat === "image/webp" ? "webp" : "png";
    const baseName = file ? file.name.substring(0, file.name.lastIndexOf(".")) || "image" : "optimized-image";
    a.download = `${baseName}-optimized.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const percentSaved = originalSize && compressedSize 
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Upload Zone */}
      {!originalPreview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          }}
          className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 bg-neutral-900/60 hover:bg-neutral-900/90 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 group shadow-xl hover:shadow-emerald-500/10"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Drop your image here or browse</h3>
            <p className="text-neutral-400 text-sm max-w-md">
              Supports PNG, JPG, JPEG, and WebP. Instant high-performance in-browser compression with zero server upload.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400/80 bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-800/40">
            <ShieldCheck className="w-4 h-4" /> 100% Private Client-Side Processing
          </div>
          <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/png, image/jpeg, image/webp" 
            className="hidden" 
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <FileImage className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-white truncate max-w-xs">{file?.name}</span>
                <span className="text-xs text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                  {originalDimensions.width} × {originalDimensions.height} px
                </span>
              </div>
              <button 
                onClick={() => {
                  setOriginalPreview(null);
                  setCompressedPreview(null);
                  setFile(null);
                }}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Choose Another Image
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quality Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-400" /> Compression Quality:
                  </span>
                  <span className="text-emerald-400 font-bold">{quality}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="95" 
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                />
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>Smallest File (5%)</span>
                  <span>Balanced (75%)</span>
                  <span>Highest Quality (95%)</span>
                </div>
              </div>

              {/* Target Format */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Output Format:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["image/webp", "image/jpeg", "image/png"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setTargetFormat(fmt)}
                      className={`text-xs py-2 px-3 rounded-lg border font-medium transition ${
                        targetFormat === fmt 
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                      }`}
                    >
                      {fmt === "image/webp" ? "WebP (Best)" : fmt === "image/jpeg" ? "JPEG" : "PNG"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resize Resolution */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-emerald-400" /> Max Width:
                  </span>
                  <span className="text-neutral-400 font-semibold">{maxWidth}px</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input 
                    type="range" 
                    min="320" 
                    max={Math.max(originalDimensions.width || 1920, 1920)} 
                    step="40"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                  />
                  <label className="text-xs text-neutral-400 flex items-center gap-1 cursor-pointer whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      checked={maintainAspect} 
                      onChange={(e) => setMaintainAspect(e.target.checked)}
                      className="accent-emerald-500"
                    />
                    Lock ratio
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Badge Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-500/30 rounded-xl p-4">
            <div className="text-center md:text-left">
              <span className="text-xs text-neutral-400">Original Size</span>
              <p className="text-lg font-bold text-neutral-200">{formatBytes(originalSize)}</p>
            </div>
            <div className="text-center md:text-left">
              <span className="text-xs text-neutral-400">Compressed Size</span>
              <p className="text-lg font-bold text-emerald-400">
                {isProcessing ? "Optimizing..." : formatBytes(compressedSize)}
              </p>
            </div>
            <div className="text-center md:text-left">
              <span className="text-xs text-neutral-400">Space Saved</span>
              <p className="text-lg font-bold text-emerald-300 flex items-center justify-center md:justify-start gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {percentSaved}% Saved
              </p>
            </div>
            <div className="flex items-center justify-center md:justify-end">
              <button
                onClick={handleDownload}
                disabled={!compressedPreview || isProcessing}
                className="w-full md:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>

          {/* Preview View Tabs */}
          <div className="flex gap-2 border-b border-neutral-800 pb-2">
            <button
              onClick={() => setActiveTab("split")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "split" 
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" 
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Side-by-Side View
            </button>
            <button
              onClick={() => setActiveTab("compressed")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "compressed" 
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" 
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Compressed Preview
            </button>
            <button
              onClick={() => setActiveTab("original")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "original" 
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" 
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Original Preview
            </button>
          </div>

          {/* Visual Container */}
          <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-4 overflow-hidden min-h-[380px] flex items-center justify-center">
            {activeTab === "split" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-neutral-400 px-1">
                    <span>Original ({formatBytes(originalSize)})</span>
                    <span>{originalDimensions.width} × {originalDimensions.height}</span>
                  </div>
                  <div className="relative border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/50 flex items-center justify-center p-2 min-h-[280px]">
                    {originalPreview && (
                      <img 
                        src={originalPreview} 
                        alt="Original" 
                        className="max-h-[320px] max-w-full object-contain rounded-lg" 
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-emerald-400 px-1">
                    <span>Compressed ({formatBytes(compressedSize)}) - {percentSaved}% smaller</span>
                    <span>{compressedDimensions.width} × {compressedDimensions.height}</span>
                  </div>
                  <div className="relative border border-emerald-500/30 rounded-xl overflow-hidden bg-neutral-900/50 flex items-center justify-center p-2 min-h-[280px]">
                    {compressedPreview ? (
                      <img 
                        src={compressedPreview} 
                        alt="Compressed" 
                        className="max-h-[320px] max-w-full object-contain rounded-lg shadow-inner" 
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-neutral-500 text-sm">
                        <Zap className="w-4 h-4 animate-spin text-emerald-400" /> Compressing...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "compressed" && compressedPreview && (
              <div className="flex flex-col items-center gap-3">
                <img 
                  src={compressedPreview} 
                  alt="Optimized preview" 
                  className="max-h-[460px] max-w-full object-contain rounded-xl border border-emerald-500/30" 
                />
                <span className="text-xs text-neutral-400">
                  {compressedDimensions.width} × {compressedDimensions.height} • {formatBytes(compressedSize)} ({percentSaved}% saved)
                </span>
              </div>
            )}

            {activeTab === "original" && originalPreview && (
              <div className="flex flex-col items-center gap-3">
                <img 
                  src={originalPreview} 
                  alt="Original preview" 
                  className="max-h-[460px] max-w-full object-contain rounded-xl border border-neutral-800" 
                />
                <span className="text-xs text-neutral-400">
                  {originalDimensions.width} × {originalDimensions.height} • {formatBytes(originalSize)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
