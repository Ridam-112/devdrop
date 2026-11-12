"use client";

import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import { 
  Upload, 
  Download, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  FileCheck, 
  Images, 
  Check, 
  Plus, 
  ShieldCheck,
  Eye
} from "lucide-react";

interface UploadedImage {
  id: string;
  name: string;
  size: number;
  dataUrl: string;
  width: number;
  height: number;
}

export default function PhotoToPdfTool() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "fit">("a4");
  const [orientation, setOrientation] = useState<"p" | "l" | "auto">("auto");
  const [margin, setMargin] = useState<number>(10); // mm
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileList = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (fileList.length === 0) return;

    fileList.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setImages(prev => [
            ...prev,
            {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              size: file.size,
              dataUrl,
              width: img.naturalWidth,
              height: img.naturalHeight
            }
          ]);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    setImages(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      let doc: jsPDF | null = null;

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        const isLandscape = item.width > item.height;
        const pageOrientation = orientation === "auto" ? (isLandscape ? "l" : "p") : orientation;

        if (i === 0) {
          doc = new jsPDF({
            orientation: pageOrientation,
            unit: "mm",
            format: pageSize === "fit" ? [item.width * 0.264583, item.height * 0.264583] : "a4"
          });
        } else if (doc) {
          doc.addPage(
            pageSize === "fit" ? [item.width * 0.264583, item.height * 0.264583] : "a4",
            pageOrientation
          );
        }

        if (doc) {
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();

          if (pageSize === "fit") {
            doc.addImage(item.dataUrl, "JPEG", 0, 0, pageWidth, pageHeight);
          } else {
            const availWidth = pageWidth - (margin * 2);
            const availHeight = pageHeight - (margin * 2);

            const imgRatio = item.width / item.height;
            const availRatio = availWidth / availHeight;

            let renderWidth = availWidth;
            let renderHeight = availHeight;

            if (imgRatio > availRatio) {
              renderHeight = renderWidth / imgRatio;
            } else {
              renderWidth = renderHeight * imgRatio;
            }

            const posX = margin + (availWidth - renderWidth) / 2;
            const posY = margin + (availHeight - renderHeight) / 2;

            doc.addImage(item.dataUrl, "JPEG", posX, posY, renderWidth, renderHeight);
          }
        }
      }

      if (doc) {
        doc.save(`devdrop-photos-combined-${Date.now()}.pdf`);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
      alert("Error compiling PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Upload Zone */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 bg-neutral-900/60 hover:bg-neutral-900/90 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 group shadow-xl hover:shadow-emerald-500/10"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
          <Images className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Click to select photos or drop them here</h3>
          <p className="text-neutral-400 text-xs max-w-md">
            Select multiple JPG, PNG, or WebP images to convert into a single consolidated PDF document.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400/80 bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-800/40">
          <ShieldCheck className="w-3.5 h-3.5" /> Client-Side Conversion • No File Size Limits
        </div>
        <input 
          ref={fileInputRef} 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => handleFiles(e.target.files)} 
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Photos Grid & Reorder */}
          <div className="lg:col-span-8 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                {images.length} {images.length === 1 ? "Image" : "Images"} Ready
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add More
                </button>
                <button
                  onClick={() => setImages([])}
                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/40 text-xs rounded-lg transition"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {images.map((img, idx) => (
                <div 
                  key={img.id}
                  className="flex items-center gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800 hover:border-neutral-700 transition"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
                    <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-neutral-200 block truncate">
                      {idx + 1}. {img.name}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {img.width} × {img.height} px
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveImage(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 rounded bg-neutral-900 hover:bg-neutral-800"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveImage(idx, "down")}
                        disabled={idx === images.length - 1}
                        className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 rounded bg-neutral-900 hover:bg-neutral-800"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-1 text-red-400 hover:text-red-300 rounded bg-neutral-900 hover:bg-red-950/60"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings & Generate */}
          <div className="lg:col-span-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white pb-3 border-b border-neutral-800">
              PDF Layout Options
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Page Dimensions</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPageSize("a4")}
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      pageSize === "a4"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "bg-neutral-950 border-neutral-800 text-neutral-400"
                    }`}
                  >
                    Standard A4
                  </button>
                  <button
                    onClick={() => setPageSize("fit")}
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      pageSize === "fit"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "bg-neutral-950 border-neutral-800 text-neutral-400"
                    }`}
                  >
                    Fit Image Exact
                  </button>
                </div>
              </div>

              {pageSize === "a4" && (
                <>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Page Orientation</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "auto", label: "Auto Detect" },
                        { id: "p", label: "Portrait" },
                        { id: "l", label: "Landscape" }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setOrientation(item.id as any)}
                          className={`py-2 text-[11px] font-semibold rounded-lg border transition ${
                            orientation === item.id
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                              : "bg-neutral-950 border-neutral-800 text-neutral-400"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Margin Size</label>
                    <select
                      value={margin}
                      onChange={(e) => setMargin(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-300 outline-none"
                    >
                      <option value={0}>No Margin (Edge-to-edge)</option>
                      <option value={8}>Small Margin (8mm)</option>
                      <option value={15}>Standard Margin (15mm)</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={generatePdf}
              disabled={isProcessing}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {success ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              {success ? "PDF Created!" : isProcessing ? "Merging Pages..." : "Convert to PDF"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
