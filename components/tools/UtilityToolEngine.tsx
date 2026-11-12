"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Copy, 
  Check, 
  RefreshCw, 
  FileCode, 
  Sliders, 
  Sparkles, 
  Calculator, 
  Terminal, 
  ArrowRightLeft,
  Clock,
  Key,
  ShieldCheck,
  Type,
  FileJson,
  Hash,
  Binary,
  Layers,
  Zap
} from "lucide-react";

interface UtilityToolEngineProps {
  toolSlug: string;
}

export default function UtilityToolEngine({ toolSlug }: UtilityToolEngineProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Word Counter
  const [textInput, setTextInput] = useState("DevDrop is the ultimate high-utility developer and everyday tool suite. Fast, private, and client-side.");
  const wordCount = useMemo(() => textInput.trim() ? textInput.trim().split(/\s+/).length : 0, [textInput]);
  const charCount = textInput.length;
  const charNoSpaces = textInput.replace(/\s+/g, "").length;
  const sentenceCount = textInput.split(/[.!?]+/).filter(Boolean).length;
  const paragraphCount = textInput.split(/\n+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);

  // 2. Case Converter
  const caseConversions = useMemo(() => {
    const raw = textInput;
    return {
      upper: raw.toUpperCase(),
      lower: raw.toLowerCase(),
      title: raw.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
      camel: raw.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, ''),
      snake: raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_'),
      kebab: raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      pascal: raw.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '')
    };
  }, [textInput]);

  // 3. JSON Formatter
  const [jsonInput, setJsonInput] = useState('{"name":"DevDrop","version":2.0,"features":["Instant","Privacy-First","Open-Source"],"config":{"theme":"cyberpunk","active":true}}');
  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message || "Invalid JSON syntax");
    }
  }, [jsonInput]);

  // 4. Base64
  const [base64Mode, setBase64Mode] = useState<"encode" | "decode">("encode");
  const [base64Input, setBase64Input] = useState("Hello DevDrop 2026!");
  const base64Output = useMemo(() => {
    try {
      if (base64Mode === "encode") {
        return btoa(unescape(encodeURIComponent(base64Input)));
      } else {
        return decodeURIComponent(escape(atob(base64Input)));
      }
    } catch {
      return "Error: Invalid Base64 input string";
    }
  }, [base64Input, base64Mode]);

  // 5. Password Generator
  const [passLength, setPassLength] = useState(16);
  const [passIncludeUpper, setPassIncludeUpper] = useState(true);
  const [passIncludeNumbers, setPassIncludeNumbers] = useState(true);
  const [passIncludeSymbols, setPassIncludeSymbols] = useState(true);
  const [generatedPass, setGeneratedPass] = useState("");

  const generatePassword = () => {
    let chars = "abcdefghijklmnopqrstuvwxyz";
    if (passIncludeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (passIncludeNumbers) chars += "0123456789";
    if (passIncludeSymbols) chars += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let res = "";
    for (let i = 0; i < passLength; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPass(res);
  };

  useEffect(() => {
    generatePassword();
  }, [passLength, passIncludeUpper, passIncludeNumbers, passIncludeSymbols]);

  // 6. Age Calculator
  const [birthDate, setBirthDate] = useState("2000-01-01");
  const ageResult = useMemo(() => {
    const birth = new Date(birthDate);
    const now = new Date();
    if (isNaN(birth.getTime())) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    return { years, months, days, totalDays };
  }, [birthDate]);

  // 7. BMI Calculator
  const [bmiWeight, setBmiWeight] = useState(70);
  const [bmiHeight, setBmiHeight] = useState(175);
  const bmiScore = useMemo(() => {
    const hMeter = bmiHeight / 100;
    if (hMeter <= 0) return 0;
    return parseFloat((bmiWeight / (hMeter * hMeter)).toFixed(1));
  }, [bmiWeight, bmiHeight]);

  const bmiCategory = useMemo(() => {
    if (bmiScore < 18.5) return { label: "Underweight", color: "text-amber-400" };
    if (bmiScore < 25) return { label: "Normal weight", color: "text-emerald-400" };
    if (bmiScore < 30) return { label: "Overweight", color: "text-amber-500" };
    return { label: "Obesity", color: "text-red-400" };
  }, [bmiScore]);

  // 8. Loan EMI Calculator
  const [loanPrincipal, setLoanPrincipal] = useState(500000);
  const [loanRate, setLoanRate] = useState(9.5);
  const [loanTenureYears, setLoanTenureYears] = useState(5);

  const emiCalc = useMemo(() => {
    const p = loanPrincipal;
    const r = loanRate / 12 / 100;
    const n = loanTenureYears * 12;
    if (r === 0) return { emi: p / n, totalPayment: p, totalInterest: 0 };
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest)
    };
  }, [loanPrincipal, loanRate, loanTenureYears]);

  // 9. Hash Generator (Web Crypto)
  const [hashInput, setHashInput] = useState("DevDrop Secure Hash String");
  const [hashes, setHashes] = useState<{ sha1: string; sha256: string; sha512: string }>({ sha1: "", sha256: "", sha512: "" });

  useEffect(() => {
    const computeHashes = async () => {
      const encoder = new TextEncoder();
      const data = encoder.encode(hashInput);

      const bufToHex = (buf: ArrayBuffer) => 
        Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");

      try {
        const s1 = await crypto.subtle.digest("SHA-1", data);
        const s256 = await crypto.subtle.digest("SHA-256", data);
        const s512 = await crypto.subtle.digest("SHA-512", data);
        setHashes({
          sha1: bufToHex(s1),
          sha256: bufToHex(s256),
          sha512: bufToHex(s512)
        });
      } catch (err) {
        console.error(err);
      }
    };
    computeHashes();
  }, [hashInput]);

  // 10. UUID Generator
  const [uuids, setUuids] = useState<string[]>([]);
  const generateUuids = (qty = 5) => {
    const list = [];
    for (let i = 0; i < qty; i++) {
      list.push(crypto.randomUUID ? crypto.randomUUID() : `uuid-${Date.now()}-${Math.random()}`);
    }
    setUuids(list);
  };
  useEffect(() => {
    generateUuids(5);
  }, []);

  // 11. Unit Converter
  const [unitCategory, setUnitCategory] = useState<"length" | "weight" | "storage">("length");
  const [unitValue, setUnitValue] = useState(1);
  const [unitFrom, setUnitFrom] = useState("m");
  const [unitTo, setUnitTo] = useState("ft");

  const convertUnits = () => {
    const lengthFactors: Record<string, number> = { m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, mi: 1609.34 };
    const weightFactors: Record<string, number> = { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 };
    const storageFactors: Record<string, number> = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 };

    let factors = lengthFactors;
    if (unitCategory === "weight") factors = weightFactors;
    if (unitCategory === "storage") factors = storageFactors;

    const base = unitValue * (factors[unitFrom] || 1);
    return (base / (factors[unitTo] || 1)).toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  // 12. URL Encoder / Decoder
  const [urlInput, setUrlInput] = useState("https://devdrop.online/search?query=best tools&ref=cyber");
  const [urlMode, setUrlMode] = useState<"encode" | "decode">("encode");
  const urlOutput = useMemo(() => {
    try {
      return urlMode === "encode" ? encodeURIComponent(urlInput) : decodeURIComponent(urlInput);
    } catch {
      return "Invalid URI input";
    }
  }, [urlInput, urlMode]);

  // 13. Slug Generator
  const [slugSource, setSlugSource] = useState("The Complete 2026 Developer Guide to Web Performance!");
  const generatedSlug = useMemo(() => {
    return slugSource
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, [slugSource]);

  // 14. Binary to Text / Text to Binary
  const [binaryMode, setBinaryMode] = useState<"toBinary" | "toText">("toBinary");
  const [binaryText, setBinaryText] = useState("DevDrop");
  const binaryOutput = useMemo(() => {
    if (binaryMode === "toBinary") {
      return binaryText
        .split("")
        .map(char => char.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" ");
    } else {
      try {
        return binaryText
          .trim()
          .split(/\s+/)
          .map(bin => String.fromCharCode(parseInt(bin, 2)))
          .join("");
      } catch {
        return "Invalid binary sequence";
      }
    }
  }, [binaryText, binaryMode]);

  // 15. Percentage Calculator
  const [pctVal1, setPctVal1] = useState(20);
  const [pctVal2, setPctVal2] = useState(500);

  // 16. JWT Decoder
  const [jwtToken, setJwtToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiYWRtaW4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );
  const jwtDecoded = useMemo(() => {
    try {
      const parts = jwtToken.split(".");
      if (parts.length < 2) return { error: "Invalid JWT format. Must contain 3 dot-separated parts." };
      const header = JSON.parse(decodeURIComponent(escape(atob(parts[0]))));
      const payload = JSON.parse(decodeURIComponent(escape(atob(parts[1]))));
      return { header, payload, error: null };
    } catch (e: any) {
      return { error: e.message || "Failed to decode JWT string" };
    }
  }, [jwtToken]);

  // 17. Color Converter (Hex to RGB / HSL)
  const [hexColor, setHexColor] = useState("#00ff9d");
  const rgbValues = useMemo(() => {
    const hex = hexColor.replace("#", "");
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r, g, b, rgbStr: `rgb(${r}, ${g}, ${b})` };
    } else if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return { r, g, b, rgbStr: `rgb(${r}, ${g}, ${b})` };
    }
    return { r: 0, g: 0, b: 0, rgbStr: "rgb(0,0,0)" };
  }, [hexColor]);

  // 18. CSS Gradient Generator
  const [gradColor1, setGradColor1] = useState("#00ff9d");
  const [gradColor2, setGradColor2] = useState("#0070f3");
  const [gradAngle, setGradAngle] = useState(135);
  const cssGradientCode = `background: linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2});`;

  // Render by Slug Router
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* 1. Word Counter */}
      {toolSlug.includes("word-counter") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400">Words</span>
              <p className="text-2xl font-bold text-emerald-400">{wordCount}</p>
            </div>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400">Characters</span>
              <p className="text-2xl font-bold text-white">{charCount}</p>
            </div>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400">No Spaces</span>
              <p className="text-2xl font-bold text-neutral-300">{charNoSpaces}</p>
            </div>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400">Reading Time</span>
              <p className="text-2xl font-bold text-cyan-400">~{readingTime} min</p>
            </div>
          </div>
          <div>
            <textarea
              rows={8}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste or type text to inspect length, sentences, characters..."
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl p-4 text-sm text-neutral-200 outline-none leading-relaxed"
            />
          </div>
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span>{sentenceCount} Sentences • {paragraphCount} Paragraphs</span>
            <button
              onClick={() => copyToClipboard(textInput)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Text
            </button>
          </div>
        </div>
      )}

      {/* 2. Case Converter */}
      {toolSlug.includes("case-converter") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <textarea
            rows={4}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text to convert into different string cases..."
            className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl p-4 text-sm text-neutral-200 outline-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "UPPERCASE", val: caseConversions.upper },
              { label: "lowercase", val: caseConversions.lower },
              { label: "Title Case", val: caseConversions.title },
              { label: "camelCase", val: caseConversions.camel },
              { label: "snake_case", val: caseConversions.snake },
              { label: "kebab-case", val: caseConversions.kebab },
              { label: "PascalCase", val: caseConversions.pascal }
            ].map((item) => (
              <div key={item.label} className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl flex items-center justify-between gap-3">
                <div className="overflow-hidden">
                  <span className="text-[11px] font-semibold text-neutral-400 block">{item.label}</span>
                  <p className="text-sm font-mono text-emerald-400 truncate">{item.val}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(item.val)}
                  className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"
                  title="Copy"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. JSON Formatter */}
      {toolSlug.includes("json-formatter") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-neutral-300">Raw JSON Input</span>
                <button
                  onClick={() => {
                    try {
                      setJsonInput(JSON.stringify(JSON.parse(jsonInput)));
                    } catch {}
                  }}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Minify
                </button>
              </div>
              <textarea
                rows={14}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none resize-none"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-emerald-400">Formatted & Validated JSON</span>
                <button
                  onClick={() => copyToClipboard(jsonOutput)}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy Output
                </button>
              </div>
              <textarea
                rows={14}
                readOnly
                value={jsonError ? `Error: ${jsonError}` : jsonOutput}
                className={`w-full bg-neutral-950 border rounded-xl p-3 text-xs font-mono outline-none resize-none ${
                  jsonError ? "border-red-500/50 text-red-400" : "border-emerald-500/30 text-emerald-300"
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Base64 Encoder / Decoder */}
      {toolSlug.includes("base64") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex gap-2">
            <button
              onClick={() => setBase64Mode("encode")}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
                base64Mode === "encode"
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                  : "bg-neutral-950 border-neutral-800 text-neutral-400"
              }`}
            >
              Text to Base64 (Encode)
            </button>
            <button
              onClick={() => setBase64Mode("decode")}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
                base64Mode === "decode"
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                  : "bg-neutral-950 border-neutral-800 text-neutral-400"
              }`}
            >
              Base64 to Text (Decode)
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Input Text</label>
              <textarea
                rows={8}
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-neutral-400">Result</label>
                <button
                  onClick={() => copyToClipboard(base64Output)}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <textarea
                rows={8}
                readOnly
                value={base64Output}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono text-emerald-400 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. Password Generator */}
      {toolSlug.includes("password-generator") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="bg-neutral-950 border border-emerald-500/40 p-4 rounded-xl flex items-center justify-between gap-4">
            <span className="text-lg font-mono text-emerald-400 break-all select-all font-bold">
              {generatedPass}
            </span>
            <div className="flex gap-2">
              <button
                onClick={generatePassword}
                className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => copyToClipboard(generatedPass)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-neutral-300 mb-1">
                <span>Password Length</span>
                <span className="text-emerald-400 font-bold">{passLength} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={passLength}
                onChange={(e) => setPassLength(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={passIncludeUpper}
                  onChange={(e) => setPassIncludeUpper(e.target.checked)}
                  className="accent-emerald-500"
                />
                Include Uppercase (A-Z)
              </label>
              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={passIncludeNumbers}
                  onChange={(e) => setPassIncludeNumbers(e.target.checked)}
                  className="accent-emerald-500"
                />
                Include Numbers (0-9)
              </label>
              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={passIncludeSymbols}
                  onChange={(e) => setPassIncludeSymbols(e.target.checked)}
                  className="accent-emerald-500"
                />
                Include Symbols (!@#$)
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 6. Age Calculator */}
      {toolSlug.includes("age-calculator") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="max-w-xs">
            <label className="text-xs text-neutral-400 block mb-1">Select Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm w-full outline-none"
            />
          </div>
          {ageResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                <span className="text-xs text-neutral-400">Years</span>
                <p className="text-3xl font-bold text-emerald-400">{ageResult.years}</p>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                <span className="text-xs text-neutral-400">Months</span>
                <p className="text-3xl font-bold text-cyan-400">{ageResult.months}</p>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                <span className="text-xs text-neutral-400">Days</span>
                <p className="text-3xl font-bold text-purple-400">{ageResult.days}</p>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                <span className="text-xs text-neutral-400">Total Days Lived</span>
                <p className="text-2xl font-bold text-white">{ageResult.totalDays.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. BMI Calculator */}
      {toolSlug.includes("bmi-calculator") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Weight (kg): {bmiWeight} kg</label>
              <input
                type="range"
                min="30"
                max="180"
                value={bmiWeight}
                onChange={(e) => setBmiWeight(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Height (cm): {bmiHeight} cm</label>
              <input
                type="range"
                min="100"
                max="230"
                value={bmiHeight}
                onChange={(e) => setBmiHeight(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
          <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-800 text-center space-y-2">
            <span className="text-xs text-neutral-400">Your Body Mass Index</span>
            <p className="text-4xl font-extrabold text-white">{bmiScore}</p>
            <p className={`text-base font-bold ${bmiCategory.color}`}>{bmiCategory.label}</p>
          </div>
        </div>
      )}

      {/* 8. Loan EMI Calculator */}
      {toolSlug.includes("loan-emi") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Principal Amount</label>
              <input
                type="number"
                value={loanPrincipal}
                onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={loanRate}
                onChange={(e) => setLoanRate(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Tenure (Years)</label>
              <input
                type="number"
                value={loanTenureYears}
                onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400">Monthly EMI</span>
              <p className="text-2xl font-bold text-emerald-400">₹{emiCalc.emi.toLocaleString()}</p>
            </div>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400">Total Interest</span>
              <p className="text-2xl font-bold text-amber-400">₹{emiCalc.totalInterest.toLocaleString()}</p>
            </div>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400">Total Payable</span>
              <p className="text-2xl font-bold text-white">₹{emiCalc.totalPayment.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* 9. Hash Generator */}
      {toolSlug.includes("hash-generator") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Input Text to Hash</label>
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none font-mono"
            />
          </div>
          <div className="space-y-3 pt-2">
            {[
              { algo: "SHA-256", hash: hashes.sha256 },
              { algo: "SHA-1", hash: hashes.sha1 },
              { algo: "SHA-512", hash: hashes.sha512 }
            ].map((h) => (
              <div key={h.algo} className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl flex items-center justify-between gap-3">
                <div className="overflow-hidden">
                  <span className="text-[11px] font-bold text-neutral-400">{h.algo}</span>
                  <p className="text-xs font-mono text-emerald-400 truncate">{h.hash}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(h.hash)}
                  className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"
                  title="Copy Hash"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. UUID Generator */}
      {toolSlug.includes("uuid-generator") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <span className="text-xs text-neutral-400">Generated UUID v4 Unique Identifiers</span>
            <button
              onClick={() => generateUuids(5)}
              className="text-xs text-emerald-400 flex items-center gap-1 hover:underline"
            >
              <RefreshCw className="w-3 h-3" /> Regenerate
            </button>
          </div>
          <div className="space-y-2">
            {uuids.map((id, idx) => (
              <div key={idx} className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-mono text-neutral-200 select-all">{id}</span>
                <button
                  onClick={() => copyToClipboard(id)}
                  className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. Unit Converter */}
      {toolSlug.includes("unit-converter") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex gap-2">
            {(["length", "weight", "storage"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setUnitCategory(cat);
                  if (cat === "length") { setUnitFrom("m"); setUnitTo("ft"); }
                  if (cat === "weight") { setUnitFrom("kg"); setUnitTo("lb"); }
                  if (cat === "storage") { setUnitFrom("MB"); setUnitTo("GB"); }
                }}
                className={`px-4 py-2 text-xs font-bold rounded-lg border capitalize transition ${
                  unitCategory === cat
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Value</label>
              <input
                type="number"
                value={unitValue}
                onChange={(e) => setUnitValue(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">From</label>
              <select
                value={unitFrom}
                onChange={(e) => setUnitFrom(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none"
              >
                {unitCategory === "length" && (
                  <>
                    <option value="m">Meters (m)</option>
                    <option value="km">Kilometers (km)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="ft">Feet (ft)</option>
                    <option value="in">Inches (in)</option>
                    <option value="mi">Miles (mi)</option>
                  </>
                )}
                {unitCategory === "weight" && (
                  <>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="lb">Pounds (lb)</option>
                    <option value="oz">Ounces (oz)</option>
                  </>
                )}
                {unitCategory === "storage" && (
                  <>
                    <option value="B">Bytes (B)</option>
                    <option value="KB">Kilobytes (KB)</option>
                    <option value="MB">Megabytes (MB)</option>
                    <option value="GB">Gigabytes (GB)</option>
                    <option value="TB">Terabytes (TB)</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">To</label>
              <select
                value={unitTo}
                onChange={(e) => setUnitTo(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none"
              >
                {unitCategory === "length" && (
                  <>
                    <option value="ft">Feet (ft)</option>
                    <option value="m">Meters (m)</option>
                    <option value="km">Kilometers (km)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="in">Inches (in)</option>
                    <option value="mi">Miles (mi)</option>
                  </>
                )}
                {unitCategory === "weight" && (
                  <>
                    <option value="lb">Pounds (lb)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="oz">Ounces (oz)</option>
                  </>
                )}
                {unitCategory === "storage" && (
                  <>
                    <option value="GB">Gigabytes (GB)</option>
                    <option value="MB">Megabytes (MB)</option>
                    <option value="TB">Terabytes (TB)</option>
                    <option value="KB">Kilobytes (KB)</option>
                    <option value="B">Bytes (B)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="bg-neutral-950 p-6 rounded-xl border border-emerald-500/30 text-center">
            <span className="text-xs text-neutral-400">Converted Output</span>
            <p className="text-3xl font-extrabold text-emerald-400">
              {convertUnits()} {unitTo}
            </p>
          </div>
        </div>
      )}

      {/* 12. URL Encoder / Decoder */}
      {toolSlug.includes("url-encoder") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex gap-2">
            <button
              onClick={() => setUrlMode("encode")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition ${
                urlMode === "encode"
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                  : "bg-neutral-950 border-neutral-800 text-neutral-400"
              }`}
            >
              Encode URL
            </button>
            <button
              onClick={() => setUrlMode("decode")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition ${
                urlMode === "decode"
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                  : "bg-neutral-950 border-neutral-800 text-neutral-400"
              }`}
            >
              Decode URL
            </button>
          </div>
          <div>
            <textarea
              rows={4}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none"
            />
          </div>
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between gap-3">
            <p className="text-xs font-mono text-emerald-400 break-all">{urlOutput}</p>
            <button
              onClick={() => copyToClipboard(urlOutput)}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 13. Slug Generator */}
      {toolSlug.includes("slug-generator") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Enter Article / Page Title</label>
            <input
              type="text"
              value={slugSource}
              onChange={(e) => setSlugSource(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none"
            />
          </div>
          <div className="bg-neutral-950 p-4 rounded-xl border border-emerald-500/40 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-neutral-500 block">Clean SEO URL Slug:</span>
              <p className="text-sm font-mono text-emerald-400">{generatedSlug}</p>
            </div>
            <button
              onClick={() => copyToClipboard(generatedSlug)}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-lg flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Slug
            </button>
          </div>
        </div>
      )}

      {/* 14. Binary Text Converter */}
      {toolSlug.includes("binary") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex gap-2">
            <button
              onClick={() => setBinaryMode("toBinary")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg border ${binaryMode === "toBinary" ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-neutral-950 border-neutral-800 text-neutral-400"}`}
            >
              Text to Binary
            </button>
            <button
              onClick={() => setBinaryMode("toText")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg border ${binaryMode === "toText" ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-neutral-950 border-neutral-800 text-neutral-400"}`}
            >
              Binary to Text
            </button>
          </div>
          <textarea
            rows={4}
            value={binaryText}
            onChange={(e) => setBinaryText(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none"
          />
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between gap-3">
            <p className="text-xs font-mono text-emerald-400 break-all">{binaryOutput}</p>
            <button onClick={() => copyToClipboard(binaryOutput)} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 15. JWT Decoder */}
      {toolSlug.includes("jwt") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Paste JWT Token String</label>
            <textarea
              rows={3}
              value={jwtToken}
              onChange={(e) => setJwtToken(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none break-all"
            />
          </div>
          {jwtDecoded.error ? (
            <div className="p-3 bg-red-950/40 border border-red-800/40 text-red-300 text-xs rounded-xl">
              {jwtDecoded.error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-neutral-400 block mb-1">Header</span>
                <pre className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs text-cyan-400 overflow-x-auto">
                  {JSON.stringify(jwtDecoded.header, null, 2)}
                </pre>
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-400 block mb-1">Payload</span>
                <pre className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs text-emerald-400 overflow-x-auto">
                  {JSON.stringify(jwtDecoded.payload, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 16. CSS Gradient Generator */}
      {toolSlug.includes("css-gradient") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div 
            className="w-full h-40 rounded-2xl border border-neutral-700 shadow-xl"
            style={{ background: `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})` }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Color 1</label>
              <input
                type="color"
                value={gradColor1}
                onChange={(e) => setGradColor1(e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Color 2</label>
              <input
                type="color"
                value={gradColor2}
                onChange={(e) => setGradColor2(e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Angle: {gradAngle}°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={gradAngle}
                onChange={(e) => setGradAngle(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-4"
              />
            </div>
          </div>
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
            <code className="text-xs font-mono text-emerald-400">{cssGradientCode}</code>
            <button
              onClick={() => copyToClipboard(cssGradientCode)}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-lg flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy CSS
            </button>
          </div>
        </div>
      )}

      {/* Universal Default for any other utility */}
      {!toolSlug.includes("word-counter") &&
       !toolSlug.includes("case-converter") &&
       !toolSlug.includes("json-formatter") &&
       !toolSlug.includes("base64") &&
       !toolSlug.includes("password-generator") &&
       !toolSlug.includes("age-calculator") &&
       !toolSlug.includes("bmi-calculator") &&
       !toolSlug.includes("loan-emi") &&
       !toolSlug.includes("hash-generator") &&
       !toolSlug.includes("uuid-generator") &&
       !toolSlug.includes("unit-converter") &&
       !toolSlug.includes("url-encoder") &&
       !toolSlug.includes("slug-generator") &&
       !toolSlug.includes("binary") &&
       !toolSlug.includes("jwt") &&
       !toolSlug.includes("css-gradient") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 pb-3 border-b border-neutral-800">
            <Zap className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white capitalize">{toolSlug.replace(/-/g, " ")}</h3>
              <p className="text-xs text-neutral-400">High-performance client-side interactive tool</p>
            </div>
          </div>
          <textarea
            rows={6}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter input data to process..."
            className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl p-4 text-sm text-neutral-200 outline-none font-mono"
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4" /> 100% Client-Side Engine Ready
            </div>
            <button
              onClick={() => copyToClipboard(textInput)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Output
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
