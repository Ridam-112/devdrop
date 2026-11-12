"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  Wifi, 
  Globe, 
  FileText, 
  Mail, 
  Phone, 
  Palette, 
  Sliders, 
  Share2 
} from "lucide-react";

type QrType = "url" | "text" | "wifi" | "email" | "phone";

export default function QrCodeGeneratorTool() {
  const [qrType, setQrType] = useState<QrType>("url");
  const [url, setUrl] = useState("https://devdrop.online");
  const [text, setText] = useState("Hello from DevDrop!");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiAuth, setWifiAuth] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Styling
  const [darkColor, setDarkColor] = useState("#00ff9d");
  const [lightColor, setLightColor] = useState("#0a0a0c");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [size, setSize] = useState<number>(320);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compute raw payload based on type
  const getPayload = () => {
    switch (qrType) {
      case "url":
        return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
      case "text":
        return text;
      case "wifi":
        return `WIFI:T:${wifiAuth};S:${wifiSsid};P:${wifiPass};H:${wifiHidden ? "true" : "false"};;`;
      case "email":
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "phone":
        return `tel:${phoneNumber}`;
      default:
        return url;
    }
  };

  useEffect(() => {
    const payload = getPayload();
    if (!payload.trim()) return;

    QRCode.toDataURL(payload, {
      width: size,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor
      },
      errorCorrectionLevel: errorLevel
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Error generating QR code:", err));
  }, [qrType, url, text, wifiSsid, wifiPass, wifiAuth, wifiHidden, emailTo, emailSubject, emailBody, phoneNumber, darkColor, lightColor, errorLevel, size]);

  const handleDownload = (format: "png" | "svg") => {
    if (!qrDataUrl) return;
    if (format === "png") {
      const a = document.createElement("a");
      a.href = qrDataUrl;
      a.download = `devdrop-qrcode-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const payload = getPayload();
      QRCode.toString(payload, {
        type: "svg",
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor
        },
        errorCorrectionLevel: errorLevel
      }).then((svgString) => {
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `devdrop-qrcode-${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }
  };

  const handleCopy = async () => {
    if (!qrDataUrl) return;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: copy text payload
      navigator.clipboard.writeText(getPayload());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Type Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-neutral-900/80 p-2 rounded-xl border border-neutral-800">
        {[
          { type: "url", label: "Website URL", icon: Globe },
          { type: "text", label: "Plain Text", icon: FileText },
          { type: "wifi", label: "Wi-Fi Access", icon: Wifi },
          { type: "email", label: "Send Email", icon: Mail },
          { type: "phone", label: "Phone Dial", icon: Phone }
        ].map((item) => {
          const Icon = item.icon;
          const active = qrType === item.type;
          return (
            <button
              key={item.type}
              onClick={() => setQrType(item.type as QrType)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition ${
                active 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Configuration Panel */}
        <div className="lg:col-span-7 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-neutral-800">
            <Sliders className="w-4 h-4 text-emerald-400" />
            1. Enter Content
          </h3>

          {qrType === "url" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">Destination URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition"
              />
              <span className="text-[11px] text-neutral-500">Scan redirects automatically to this address.</span>
            </div>
          )}

          {qrType === "text" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">Text Content</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                placeholder="Enter any text, note, secret token, or coupon code..."
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition resize-none"
              />
            </div>
          )}

          {qrType === "wifi" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Wi-Fi Network Name (SSID)</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="e.g. Office_WiFi_5G"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-sm text-neutral-100 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Password</label>
                <input
                  type="text"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  placeholder="Network password"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-sm text-neutral-100 outline-none font-mono"
                />
              </div>
              <div className="flex gap-4 items-center">
                <select
                  value={wifiAuth}
                  onChange={(e) => setWifiAuth(e.target.value as any)}
                  className="bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-300 outline-none"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Password (Open)</option>
                </select>
                <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wifiHidden}
                    onChange={(e) => setWifiHidden(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  Hidden Network
                </label>
              </div>
            </div>
          )}

          {qrType === "email" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300">Recipient Email</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg px-4 py-2 text-sm text-neutral-100 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-300">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Inquiry regarding..."
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg px-4 py-2 text-sm text-neutral-100 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-300">Message Body</label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={2}
                  placeholder="Hi there, I wanted to reach out..."
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg px-4 py-2 text-sm text-neutral-100 outline-none resize-none"
                />
              </div>
            </div>
          )}

          {qrType === "phone" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">Phone Number (with Country Code)</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-sm text-neutral-100 outline-none font-mono"
              />
            </div>
          )}

          {/* Styling Options */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-emerald-400" /> 2. Style & Colors
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">QR Dots Color</label>
                <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 rounded-lg p-1.5">
                  <input
                    type="color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-neutral-300">{darkColor}</span>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Background</label>
                <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 rounded-lg p-1.5">
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-neutral-300">{lightColor}</span>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Error Correction</label>
                <select
                  value={errorLevel}
                  onChange={(e) => setErrorLevel(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-neutral-300 outline-none"
                >
                  <option value="L">L (7% Recovery)</option>
                  <option value="M">M (15% Recovery)</option>
                  <option value="Q">Q (25% Recovery)</option>
                  <option value="H">H (30% Highest)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Size (px)</label>
                <select
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-neutral-300 outline-none"
                >
                  <option value={200}>200 × 200</option>
                  <option value={320}>320 × 320</option>
                  <option value={500}>500 × 500</option>
                  <option value={800}>800 × 800 (HD)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview & Action Download Panel */}
        <div className="lg:col-span-5 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-between gap-6">
          <div className="w-full text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center gap-1.5 mb-1">
              <QrCode className="w-4 h-4" /> Live QR Preview
            </span>
            <p className="text-xs text-neutral-400">Scan with any smartphone camera</p>
          </div>

          <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl flex items-center justify-center max-w-[280px] aspect-square w-full">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="text-neutral-500 text-xs">Generating QR...</div>
            )}
          </div>

          <div className="w-full space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDownload("png")}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" /> Download PNG
              </button>
              <button
                onClick={() => handleDownload("svg")}
                className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs rounded-xl border border-neutral-700 flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" /> Download SVG
              </button>
            </div>
            <button
              onClick={handleCopy}
              className="w-full py-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 font-medium text-xs rounded-xl border border-neutral-800 flex items-center justify-center gap-1.5 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied to Clipboard!" : "Copy Image / Data"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
