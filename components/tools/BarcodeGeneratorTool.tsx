"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Barcode, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  Sliders, 
  RefreshCw,
  Info
} from "lucide-react";

// Code 128-B encoding patterns (107 patterns, each 11 modules wide, stop is 13)
const CODE128_PATTERNS: string[] = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", // 0-9
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132", // 10-19
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", // 20-29
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313", // 30-39
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", // 40-49
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111", // 50-59
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214", // 60-69
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111", // 70-79
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141", // 80-89
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141", // 90-99
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112" // 100-106 (106 is STOP)
];

const START_B = 104;
const STOP = 106;

function encodeCode128B(text: string): string {
  const codes: number[] = [START_B];
  let checksum = START_B;

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) - 32;
    if (code >= 0 && code <= 95) {
      codes.push(code);
      checksum += code * (i + 1);
    }
  }

  const checkDigit = checksum % 103;
  codes.push(checkDigit);
  codes.push(STOP);

  // Convert pattern digits to binary string (1 for bar, 0 for space)
  let binary = "0000000000"; // quiet zone
  for (const code of codes) {
    const pattern = CODE128_PATTERNS[code];
    let isBar = true;
    for (let j = 0; j < pattern.length; j++) {
      const width = parseInt(pattern[j], 10);
      binary += (isBar ? "1" : "0").repeat(width);
      isBar = !isBar;
    }
  }
  binary += "0000000000"; // quiet zone
  return binary;
}

export default function BarcodeGeneratorTool() {
  const [value, setValue] = useState("DEVDROP-2026-X9");
  const [barcodeHeight, setBarcodeHeight] = useState(100);
  const [barWidth, setBarWidth] = useState(2);
  const [showText, setShowText] = useState(true);
  const [barColor, setBarColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const trimmed = value.trim() || "SAMPLE128";
    const binary = encodeCode128B(trimmed);
    
    const totalWidth = binary.length * barWidth;
    const textHeight = showText ? 28 : 0;
    const totalHeight = barcodeHeight + textHeight + 20;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Draw bars
    ctx.fillStyle = barColor;
    for (let i = 0; i < binary.length; i++) {
      if (binary[i] === "1") {
        ctx.fillRect(i * barWidth, 10, barWidth, barcodeHeight);
      }
    }

    // Text label
    if (showText) {
      ctx.fillStyle = barColor;
      ctx.font = "bold 15px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(trimmed, totalWidth / 2, barcodeHeight + 20);
    }
  }, [value, barcodeHeight, barWidth, showText, barColor, bgColor]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `devdrop-barcode-${value.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      });
    } catch {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode - ${value}</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: monospace; }
            img { max-width: 90%; height: auto; margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <img src="${canvas.toDataURL("image/png")}" />
          <script>
            window.onload = function() { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-7 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-neutral-800">
            <Barcode className="w-5 h-5 text-emerald-400" />
            Barcode Settings (Code 128)
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">Barcode Text / Value</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. SKU-984214, 1234567890"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-sm font-mono text-neutral-100 outline-none"
              />
              <button
                onClick={() => setValue(`SKU-${Math.floor(100000 + Math.random() * 900000)}`)}
                className="bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded-lg text-xs text-neutral-300 flex items-center gap-1.5 transition"
                title="Generate Random SKU"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Random
              </button>
            </div>
            <p className="text-[11px] text-neutral-500">
              Supports alphanumeric characters, symbols, uppercase, lowercase, and numbers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Bar Height:</span>
                <span className="text-emerald-400 font-mono">{barcodeHeight}px</span>
              </div>
              <input
                type="range"
                min="40"
                max="180"
                value={barcodeHeight}
                onChange={(e) => setBarcodeHeight(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Bar Thickness:</span>
                <span className="text-emerald-400 font-mono">{barWidth}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={barWidth}
                onChange={(e) => setBarWidth(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Bar Color</label>
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 rounded-lg p-2">
                <input
                  type="color"
                  value={barColor}
                  onChange={(e) => setBarColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-neutral-300">{barColor}</span>
              </div>
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Card Background</label>
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 rounded-lg p-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-neutral-300">{bgColor}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showText}
                onChange={(e) => setShowText(e.target.checked)}
                className="accent-emerald-500 w-4 h-4 rounded"
              />
              Show readable text below barcode
            </label>
          </div>

          <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-3 flex items-start gap-2 text-xs text-neutral-400">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              High-resolution 100% compliant Code 128 standard barcode. Ready for commercial thermal label printers, inventory management, logistics & retail scanners.
            </span>
          </div>
        </div>

        {/* Live Canvas Preview & Download */}
        <div className="lg:col-span-5 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-between gap-6">
          <div className="w-full text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center gap-1.5 mb-1">
              <Barcode className="w-4 h-4" /> Live Barcode Preview
            </span>
            <p className="text-xs text-neutral-400">Scannable with any 1D/2D laser or optical scanner</p>
          </div>

          {/* Canvas Wrapper */}
          <div className="w-full overflow-x-auto p-4 bg-white/95 border border-neutral-700 rounded-xl flex items-center justify-center min-h-[180px] shadow-2xl">
            <canvas ref={canvasRef} className="max-w-full h-auto" />
          </div>

          <div className="w-full space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownload}
                className="py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" /> Download PNG
              </button>
              <button
                onClick={handlePrint}
                className="py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs rounded-xl border border-neutral-700 flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" /> Print Label
              </button>
            </div>
            <button
              onClick={handleCopy}
              className="w-full py-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 font-medium text-xs rounded-xl border border-neutral-800 flex items-center justify-center gap-1.5 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied to Clipboard!" : "Copy Barcode Image"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
