"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  Zap,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Trash2,
  Download,
  Globe,
  Search,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
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

  // ── Shared text input ──────────────────────────────────────────────────────
  const [textInput, setTextInput] = useState(
    "DevDrop is the ultimate high-utility developer and everyday tool suite. Fast, private, and client-side."
  );
  const wordCount = useMemo(
    () => (textInput.trim() ? textInput.trim().split(/\s+/).length : 0),
    [textInput]
  );
  const charCount = textInput.length;
  const charNoSpaces = textInput.replace(/\s+/g, "").length;
  const sentenceCount = textInput.split(/[.!?]+/).filter(Boolean).length;
  const paragraphCount = textInput.split(/\n+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);

  // ── Case Converter ─────────────────────────────────────────────────────────
  const caseConversions = useMemo(() => {
    const raw = textInput;
    return {
      upper: raw.toUpperCase(),
      lower: raw.toLowerCase(),
      title: raw.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
      camel: raw.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, ""),
      snake: raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_"),
      kebab: raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
      pascal: raw.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, ""),
    };
  }, [textInput]);

  // ── JSON Formatter ─────────────────────────────────────────────────────────
  const [jsonInput, setJsonInput] = useState(
    '{"name":"DevDrop","version":2.0,"features":["Instant","Privacy-First","Open-Source"],"config":{"theme":"cyberpunk","active":true}}'
  );
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

  // ── Base64 ─────────────────────────────────────────────────────────────────
  const [base64Mode, setBase64Mode] = useState<"encode" | "decode">("encode");
  const [base64Input, setBase64Input] = useState("Hello DevDrop 2026!");
  const base64Output = useMemo(() => {
    try {
      if (base64Mode === "encode") return btoa(unescape(encodeURIComponent(base64Input)));
      return decodeURIComponent(escape(atob(base64Input)));
    } catch {
      return "Error: Invalid Base64 input string";
    }
  }, [base64Input, base64Mode]);

  // ── Password Generator ─────────────────────────────────────────────────────
  const [passLength, setPassLength] = useState(16);
  const [passIncludeUpper, setPassIncludeUpper] = useState(true);
  const [passIncludeNumbers, setPassIncludeNumbers] = useState(true);
  const [passIncludeSymbols, setPassIncludeSymbols] = useState(true);
  const [generatedPass, setGeneratedPass] = useState("");

  const generatePassword = useCallback(() => {
    let chars = "abcdefghijklmnopqrstuvwxyz";
    if (passIncludeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (passIncludeNumbers) chars += "0123456789";
    if (passIncludeSymbols) chars += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let res = "";
    for (let i = 0; i < passLength; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    setGeneratedPass(res);
  }, [passLength, passIncludeUpper, passIncludeNumbers, passIncludeSymbols]);

  useEffect(() => { generatePassword(); }, [generatePassword]);

  // ── Age Calculator ─────────────────────────────────────────────────────────
  const [birthDate, setBirthDate] = useState("2000-01-01");
  const ageResult = useMemo(() => {
    const birth = new Date(birthDate);
    const now = new Date();
    if (isNaN(birth.getTime())) return null;
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    return { years, months, days, totalDays };
  }, [birthDate]);

  // ── BMI ────────────────────────────────────────────────────────────────────
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

  // ── Loan EMI ───────────────────────────────────────────────────────────────
  const [loanPrincipal, setLoanPrincipal] = useState(500000);
  const [loanRate, setLoanRate] = useState(9.5);
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const emiCalc = useMemo(() => {
    const p = loanPrincipal, r = loanRate / 12 / 100, n = loanTenureYears * 12;
    if (r === 0) return { emi: p / n, totalPayment: p, totalInterest: 0 };
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    return { emi: Math.round(emi), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalPayment - p) };
  }, [loanPrincipal, loanRate, loanTenureYears]);

  // ── Hash Generator ─────────────────────────────────────────────────────────
  const [hashInput, setHashInput] = useState("DevDrop Secure Hash String");
  const [hashes, setHashes] = useState<{ sha1: string; sha256: string; sha512: string }>({ sha1: "", sha256: "", sha512: "" });
  useEffect(() => {
    const computeHashes = async () => {
      const encoder = new TextEncoder();
      const data = encoder.encode(hashInput);
      const bufToHex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
      try {
        setHashes({
          sha1: bufToHex(await crypto.subtle.digest("SHA-1", data)),
          sha256: bufToHex(await crypto.subtle.digest("SHA-256", data)),
          sha512: bufToHex(await crypto.subtle.digest("SHA-512", data)),
        });
      } catch (err) { console.error(err); }
    };
    computeHashes();
  }, [hashInput]);

  // ── UUID ───────────────────────────────────────────────────────────────────
  const [uuids, setUuids] = useState<string[]>([]);
  const generateUuids = (qty = 5) => {
    setUuids(Array.from({ length: qty }, () => crypto.randomUUID ? crypto.randomUUID() : `uuid-${Date.now()}-${Math.random()}`));
  };
  useEffect(() => { generateUuids(5); }, []);

  // ── Unit Converter ─────────────────────────────────────────────────────────
  const [unitCategory, setUnitCategory] = useState<"length" | "weight" | "storage">("length");
  const [unitValue, setUnitValue] = useState(1);
  const [unitFrom, setUnitFrom] = useState("m");
  const [unitTo, setUnitTo] = useState("ft");
  const convertUnits = () => {
    const length = { m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, mi: 1609.34 };
    const weight = { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 };
    const storage = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 };
    const factors: Record<string, number> = unitCategory === "weight" ? weight : unitCategory === "storage" ? storage : length;
    const base = unitValue * (factors[unitFrom] || 1);
    return (base / (factors[unitTo] || 1)).toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  // ── URL Encoder ────────────────────────────────────────────────────────────
  const [urlInput, setUrlInput] = useState("https://devdrop.online/search?query=best tools&ref=cyber");
  const [urlMode, setUrlMode] = useState<"encode" | "decode">("encode");
  const urlOutput = useMemo(() => {
    try { return urlMode === "encode" ? encodeURIComponent(urlInput) : decodeURIComponent(urlInput); }
    catch { return "Invalid URI input"; }
  }, [urlInput, urlMode]);

  // ── Slug Generator ─────────────────────────────────────────────────────────
  const [slugSource, setSlugSource] = useState("The Complete 2026 Developer Guide to Web Performance!");
  const generatedSlug = useMemo(() =>
    slugSource.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, ""),
    [slugSource]
  );

  // ── Binary Converter ───────────────────────────────────────────────────────
  const [binaryMode, setBinaryMode] = useState<"toBinary" | "toText">("toBinary");
  const [binaryText, setBinaryText] = useState("DevDrop");
  const binaryOutput = useMemo(() => {
    if (binaryMode === "toBinary") return binaryText.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
    try { return binaryText.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join(""); }
    catch { return "Invalid binary sequence"; }
  }, [binaryText, binaryMode]);

  // ── JWT Decoder ────────────────────────────────────────────────────────────
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
    } catch (e: any) { return { error: e.message || "Failed to decode JWT string" }; }
  }, [jwtToken]);

  // ── CSS Gradient ───────────────────────────────────────────────────────────
  const [gradColor1, setGradColor1] = useState("#00ff9d");
  const [gradColor2, setGradColor2] = useState("#0070f3");
  const [gradAngle, setGradAngle] = useState(135);
  const cssGradientCode = `background: linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2});`;

  // ── Color HEX to RGB/HSL ───────────────────────────────────────────────────
  const [hexColor, setHexColor] = useState("#00ff9d");
  const colorValues = useMemo(() => {
    const hex = hexColor.replace("#", "");
    let r = 0, g = 0, b = 0;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16); g = parseInt(hex[1] + hex[1], 16); b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16); g = parseInt(hex.substring(2, 4), 16); b = parseInt(hex.substring(4, 6), 16);
    }
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const max = Math.max(rN, gN, bN), min = Math.min(rN, gN, bN);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rN: h = ((gN - bN) / d + (gN < bN ? 6 : 0)) / 6; break;
        case gN: h = ((bN - rN) / d + 2) / 6; break;
        case bN: h = ((rN - gN) / d + 4) / 6; break;
      }
    }
    return {
      r, g, b,
      rgbStr: `rgb(${r}, ${g}, ${b})`,
      hslStr: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    };
  }, [hexColor]);

  // ── Percentage Calculator ──────────────────────────────────────────────────
  const [pctVal, setPctVal] = useState(20);
  const [pctOf, setPctOf] = useState(500);
  const pctResult = useMemo(() => ((pctVal / 100) * pctOf).toFixed(2), [pctVal, pctOf]);
  const [reverseNum, setReverseNum] = useState(100);
  const [reverseTotal, setReverseTotal] = useState(500);
  const reverseResult = useMemo(() => ((reverseNum / reverseTotal) * 100).toFixed(2), [reverseNum, reverseTotal]);

  // ── Days Between Dates ─────────────────────────────────────────────────────
  const [dateFrom, setDateFrom] = useState("2000-01-01");
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const daysBetween = useMemo(() => {
    const a = new Date(dateFrom), b = new Date(dateTo);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
    const diff = Math.abs(b.getTime() - a.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);
    return { days, weeks, months, years };
  }, [dateFrom, dateTo]);

  // ── Unix Timestamp ─────────────────────────────────────────────────────────
  const [unixInput, setUnixInput] = useState(Math.floor(Date.now() / 1000).toString());
  const unixResult = useMemo(() => {
    const ts = parseInt(unixInput);
    if (isNaN(ts)) return null;
    const ms = ts > 1e10 ? ts : ts * 1000;
    const d = new Date(ms);
    return { utc: d.toUTCString(), local: d.toLocaleString(), iso: d.toISOString() };
  }, [unixInput]);
  const currentUnix = Math.floor(Date.now() / 1000);

  // ── Aspect Ratio Calculator ────────────────────────────────────────────────
  const [arWidth, setArWidth] = useState(1920);
  const [arHeight, setArHeight] = useState(1080);
  const aspectRatio = useMemo(() => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    if (!arWidth || !arHeight) return "—";
    const g = gcd(arWidth, arHeight);
    return `${arWidth / g}:${arHeight / g}`;
  }, [arWidth, arHeight]);
  const [arNewWidth, setArNewWidth] = useState(1280);
  const scaledHeight = useMemo(() => arHeight ? Math.round((arNewWidth * arHeight) / arWidth) : 0, [arNewWidth, arWidth, arHeight]);

  // ── HTML Entity Encoder ────────────────────────────────────────────────────
  const [entityInput, setEntityInput] = useState('<h1 class="hello">Hello & "World" <DevDrop>!</h1>');
  const [entityMode, setEntityMode] = useState<"encode" | "decode">("encode");
  const entityOutput = useMemo(() => {
    if (entityMode === "encode") {
      return entityInput
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    return entityInput
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  }, [entityInput, entityMode]);

  // ── CSV / JSON Converter ───────────────────────────────────────────────────
  const [csvInput, setCsvInput] = useState('name,age,city\nAlice,30,London\nBob,25,New York\nCharlie,35,Tokyo');
  const [jsonInput2, setJsonInput2] = useState('[{"name":"Alice","age":30},{"name":"Bob","age":25}]');
  const csvToJson = useMemo(() => {
    try {
      const lines = csvInput.trim().split("\n");
      const headers = lines[0].split(",").map(h => h.trim());
      const result = lines.slice(1).map(line => {
        const vals = line.split(",").map(v => v.trim());
        return Object.fromEntries(headers.map((h, i) => [h, vals[i] || ""]));
      });
      return JSON.stringify(result, null, 2);
    } catch { return "Invalid CSV format"; }
  }, [csvInput]);
  const jsonToCsv = useMemo(() => {
    try {
      const arr = JSON.parse(jsonInput2);
      if (!Array.isArray(arr) || arr.length === 0) return "Input must be a JSON array";
      const headers = Object.keys(arr[0]);
      const rows = arr.map((row: any) => headers.map(h => String(row[h] ?? "")).join(","));
      return [headers.join(","), ...rows].join("\n");
    } catch { return "Invalid JSON array input"; }
  }, [jsonInput2]);

  // ── Tip & Bill Split ───────────────────────────────────────────────────────
  const [billAmount, setBillAmount] = useState(100);
  const [tipPct, setTipPct] = useState(15);
  const [splitCount, setSplitCount] = useState(4);
  const tipCalc = useMemo(() => {
    const tip = (billAmount * tipPct) / 100;
    const total = billAmount + tip;
    const perPerson = total / splitCount;
    return { tip: tip.toFixed(2), total: total.toFixed(2), perPerson: perPerson.toFixed(2) };
  }, [billAmount, tipPct, splitCount]);

  // ── Discount Calculator ────────────────────────────────────────────────────
  const [originalPrice, setOriginalPrice] = useState(1000);
  const [discountPct, setDiscountPct] = useState(20);
  const discountCalc = useMemo(() => {
    const saved = (originalPrice * discountPct) / 100;
    return { saved: saved.toFixed(2), finalPrice: (originalPrice - saved).toFixed(2) };
  }, [originalPrice, discountPct]);

  // ── Roman Numeral ──────────────────────────────────────────────────────────
  const [romanInput, setRomanInput] = useState(2024);
  const [romanMode, setRomanMode] = useState<"toRoman" | "fromRoman">("toRoman");
  const [romanStrInput, setRomanStrInput] = useState("MMXXIV");
  const toRoman = (num: number): string => {
    const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
    const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
    let result = "";
    for (let i = 0; i < vals.length && num > 0; i++) {
      while (num >= vals[i]) { result += syms[i]; num -= vals[i]; }
    }
    return result;
  };
  const fromRoman = (roman: string): number => {
    const map: Record<string, number> = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
    let result = 0;
    const upper = roman.toUpperCase();
    for (let i = 0; i < upper.length; i++) {
      const curr = map[upper[i]] || 0;
      const next = map[upper[i + 1]] || 0;
      result += curr < next ? -curr : curr;
    }
    return result;
  };

  // ── Random Number / Dice ───────────────────────────────────────────────────
  const [randMin, setRandMin] = useState(1);
  const [randMax, setRandMax] = useState(100);
  const [randCount, setRandCount] = useState(5);
  const [randResults, setRandResults] = useState<number[]>([]);
  const [diceType, setDiceType] = useState(6);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const generateRandom = () => {
    const results = Array.from({ length: randCount }, () => Math.floor(Math.random() * (randMax - randMin + 1)) + randMin);
    setRandResults(results);
  };
  useEffect(() => { generateRandom(); }, []);

  // ── Random Choice Picker ───────────────────────────────────────────────────
  const [choices, setChoices] = useState("Pizza\nBurger\nTacos\nSushi\nSandwich");
  const [chosenResult, setChosenResult] = useState<string | null>(null);
  const pickChoice = () => {
    const list = choices.split("\n").map(c => c.trim()).filter(Boolean);
    if (list.length > 0) setChosenResult(list[Math.floor(Math.random() * list.length)]);
  };

  // ── Hex to ASCII ───────────────────────────────────────────────────────────
  const [hexAsciiInput, setHexAsciiInput] = useState("48656c6c6f20576f726c64");
  const [hexAsciiMode, setHexAsciiMode] = useState<"hexToAsc" | "ascToHex">("hexToAsc");
  const hexAsciiOutput = useMemo(() => {
    if (hexAsciiMode === "hexToAsc") {
      try { return hexAsciiInput.match(/.{1,2}/g)?.map(h => String.fromCharCode(parseInt(h, 16))).join("") || ""; }
      catch { return "Invalid hex string"; }
    } else {
      return hexAsciiInput.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
    }
  }, [hexAsciiInput, hexAsciiMode]);

  // ── Morse Code ─────────────────────────────────────────────────────────────
  const MORSE: Record<string, string> = {
    A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",
    L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",
    W:".--",X:"-..-",Y:"-.--",Z:"--..",
    "0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....",
    "6":"-....","7":"--...","8":"---..","9":"----.",
    " ":"/",".":`.-.-.-`,",":"--..--","?":`..--..`,"!":"-.-.--",
  };
  const MORSE_REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));
  const [morseInput, setMorseInput] = useState("DEVDROP");
  const [morseMode, setMorseMode] = useState<"toMorse" | "fromMorse">("toMorse");
  const morseOutput = useMemo(() => {
    if (morseMode === "toMorse") {
      return morseInput.toUpperCase().split("").map(c => MORSE[c] || "?").join(" ");
    } else {
      return morseInput.split(" / ").map(word => word.split(" ").map(code => MORSE_REVERSE[code] || "?").join("")).join(" ");
    }
  }, [morseInput, morseMode]);

  // ── Lorem Ipsum ────────────────────────────────────────────────────────────
  const loremBase = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum";
  const loremWords = loremBase.split(" ");
  const [loremCount, setLoremCount] = useState(5);
  const [loremType, setLoremType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const loremOutput = useMemo(() => {
    if (loremType === "words") {
      const words = Array.from({ length: loremCount }, (_, i) => loremWords[i % loremWords.length]);
      return words.join(" ") + ".";
    }
    if (loremType === "sentences") {
      return Array.from({ length: loremCount }, (_, i) => {
        const start = (i * 7) % loremWords.length;
        return loremWords.slice(start, start + 12).join(" ").replace(/^\w/, c => c.toUpperCase()) + ".";
      }).join(" ");
    }
    // paragraphs
    return Array.from({ length: loremCount }, (_, i) => {
      const sentences = Array.from({ length: 4 }, (_, j) => {
        const start = ((i * 4 + j) * 11) % loremWords.length;
        return loremWords.slice(start, start + 14).join(" ").replace(/^\w/, c => c.toUpperCase()) + ".";
      });
      return sentences.join(" ");
    }).join("\n\n");
  }, [loremCount, loremType]);

  // ── Markdown Previewer ────────────────────────────────────────────────────
  const [mdInput, setMdInput] = useState("# Hello DevDrop\n\nThis is **bold** and *italic* text.\n\n- Item one\n- Item two\n- Item three\n\n> A blockquote example.\n\n`code snippet` inline.\n\n```\nconst x = 42;\nconsole.log(x);\n```");
  const mdPreview = useMemo(() => {
    return mdInput
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-purple-400 mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-cyan-400 mt-5 mb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-emerald-400 mt-6 mb-3">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="text-neutral-300 italic">$1</em>')
      .replace(/`{3}[\s\S]*?`{3}/g, (m) => `<pre class="bg-neutral-950 border border-neutral-700 p-3 rounded-lg text-xs font-mono text-emerald-300 my-2 overflow-x-auto">${m.replace(/```/g, "").trim()}</pre>`)
      .replace(/`(.+?)`/g, '<code class="bg-neutral-800 text-cyan-300 px-1 rounded text-xs font-mono">$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-emerald-500 pl-4 text-neutral-400 italic my-2">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li class="text-neutral-300 ml-4 list-disc">$1</li>')
      .replace(/(<li.*<\/li>\n?)+/g, '<ul class="space-y-1 my-2">$&</ul>')
      .replace(/^(\d+)\. (.+)$/gm, '<li class="text-neutral-300 ml-4 list-decimal">$2</li>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-cyan-400 underline hover:text-cyan-300" target="_blank">$1</a>')
      .replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>');
  }, [mdInput]);

  // ── Markdown Table Generator ───────────────────────────────────────────────
  type Alignment = "left" | "center" | "right";
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHeaders, setTableHeaders] = useState<string[]>(["Column 1", "Column 2", "Column 3"]);
  const [tableData, setTableData] = useState<string[][]>([
    ["Cell 1", "Cell 2", "Cell 3"],
    ["Cell 4", "Cell 5", "Cell 6"],
    ["Cell 7", "Cell 8", "Cell 9"],
  ]);
  const [tableAligns, setTableAligns] = useState<Alignment[]>(["left", "center", "right"]);

  const addTableRow = () => {
    setTableData(prev => [...prev, Array(tableCols).fill("")]);
    setTableRows(r => r + 1);
  };
  const addTableCol = () => {
    setTableHeaders(prev => [...prev, `Column ${tableCols + 1}`]);
    setTableData(prev => prev.map(row => [...row, ""]));
    setTableAligns(prev => [...prev, "left"]);
    setTableCols(c => c + 1);
  };
  const removeTableRow = () => {
    if (tableRows <= 1) return;
    setTableData(prev => prev.slice(0, -1));
    setTableRows(r => r - 1);
  };
  const removeTableCol = () => {
    if (tableCols <= 1) return;
    setTableHeaders(prev => prev.slice(0, -1));
    setTableData(prev => prev.map(row => row.slice(0, -1)));
    setTableAligns(prev => prev.slice(0, -1));
    setTableCols(c => c - 1);
  };
  const updateHeader = (colIdx: number, val: string) => {
    setTableHeaders(prev => { const n = [...prev]; n[colIdx] = val; return n; });
  };
  const updateCell = (rowIdx: number, colIdx: number, val: string) => {
    setTableData(prev => { const n = prev.map(r => [...r]); n[rowIdx][colIdx] = val; return n; });
  };
  const cycleAlign = (colIdx: number) => {
    const cycle: Alignment[] = ["left", "center", "right"];
    setTableAligns(prev => { const n = [...prev]; n[colIdx] = cycle[(cycle.indexOf(n[colIdx]) + 1) % 3]; return n; });
  };
  const markdownTable = useMemo(() => {
    const alignSep = (a: Alignment) => a === "center" ? ":---:" : a === "right" ? "---:" : ":---";
    const headerRow = "| " + tableHeaders.join(" | ") + " |";
    const sepRow = "| " + tableAligns.map(alignSep).join(" | ") + " |";
    const dataRows = tableData.map(row => "| " + row.join(" | ") + " |");
    return [headerRow, sepRow, ...dataRows].join("\n");
  }, [tableHeaders, tableData, tableAligns]);

  // ── HTML to Markdown ───────────────────────────────────────────────────────
  const [htmlInput, setHtmlInput] = useState(`<h1>Hello World</h1>
<p>This is a <strong>bold</strong> and <em>italic</em> paragraph.</p>
<ul>
  <li>Item one</li>
  <li>Item two</li>
</ul>
<a href="https://devdrop.online">Visit DevDrop</a>
<blockquote>This is a quote.</blockquote>`);
  const htmlToMarkdown = useMemo(() => {
    return htmlInput
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n")
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n")
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n")
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n")
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n")
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n")
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
      .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
      .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
      .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")
      .replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`")
      .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "```\n$1\n```")
      .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, "[$2]($1)")
      .replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, "![$2]($1)")
      .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, c) => c.trim().split("\n").map((l: string) => "> " + l.trim()).join("\n") + "\n")
      .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
      .replace(/<\/ul>|<\/ol>|<ul[^>]*>|<ol[^>]*>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n")
      .replace(/<hr\s*\/?>/gi, "\n---\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
      .replace(/\n{3,}/g, "\n\n").trim();
  }, [htmlInput]);

  // ── Pomodoro Timer ─────────────────────────────────────────────────────────
  const WORK_MINS = 25, BREAK_MINS = 5;
  const [pomPhase, setPomPhase] = useState<"work" | "break">("work");
  const [pomSeconds, setPomSeconds] = useState(WORK_MINS * 60);
  const [pomRunning, setPomRunning] = useState(false);
  const [pomSessions, setPomSessions] = useState(0);
  const [pomLaps, setPomLaps] = useState<string[]>([]);
  const pomIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (pomRunning) {
      pomIntervalRef.current = setInterval(() => {
        setPomSeconds(prev => {
          if (prev <= 1) {
            clearInterval(pomIntervalRef.current!);
            if (pomPhase === "work") {
              setPomSessions(s => s + 1);
              const now = new Date().toLocaleTimeString();
              setPomLaps(l => [...l, `✅ Work session completed at ${now}`]);
              setPomPhase("break");
              setPomRunning(false);
              return BREAK_MINS * 60;
            } else {
              const now = new Date().toLocaleTimeString();
              setPomLaps(l => [...l, `☕ Break completed at ${now}`]);
              setPomPhase("work");
              setPomRunning(false);
              return WORK_MINS * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (pomIntervalRef.current) clearInterval(pomIntervalRef.current);
    }
    return () => { if (pomIntervalRef.current) clearInterval(pomIntervalRef.current); };
  }, [pomRunning, pomPhase]);

  const pomReset = () => {
    setPomRunning(false);
    setPomPhase("work");
    setPomSeconds(WORK_MINS * 60);
  };
  const pomMins = Math.floor(pomSeconds / 60).toString().padStart(2, "0");
  const pomSecs = (pomSeconds % 60).toString().padStart(2, "0");
  const pomTotal = pomPhase === "work" ? WORK_MINS * 60 : BREAK_MINS * 60;
  const pomPct = ((pomTotal - pomSeconds) / pomTotal) * 100;

  // ── Stopwatch ──────────────────────────────────────────────────────────────
  const [swMs, setSwMs] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [swLaps, setSwLaps] = useState<string[]>([]);
  const swRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (swRunning) {
      swRef.current = setInterval(() => setSwMs(p => p + 10), 10);
    } else {
      if (swRef.current) clearInterval(swRef.current);
    }
    return () => { if (swRef.current) clearInterval(swRef.current); };
  }, [swRunning]);

  const formatMs = (ms: number) => {
    const mins = Math.floor(ms / 60000).toString().padStart(2, "0");
    const secs = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
    const centis = Math.floor((ms % 1000) / 10).toString().padStart(2, "0");
    return `${mins}:${secs}.${centis}`;
  };

  // ── World Clock ────────────────────────────────────────────────────────────
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const timezones = [
    { city: "New York", tz: "America/New_York", flag: "🇺🇸" },
    { city: "London", tz: "Europe/London", flag: "🇬🇧" },
    { city: "Paris", tz: "Europe/Paris", flag: "🇫🇷" },
    { city: "Dubai", tz: "Asia/Dubai", flag: "🇦🇪" },
    { city: "Kolkata", tz: "Asia/Kolkata", flag: "🇮🇳" },
    { city: "Singapore", tz: "Asia/Singapore", flag: "🇸🇬" },
    { city: "Tokyo", tz: "Asia/Tokyo", flag: "🇯🇵" },
    { city: "Sydney", tz: "Australia/Sydney", flag: "🇦🇺" },
    { city: "Los Angeles", tz: "America/Los_Angeles", flag: "🇺🇸" },
  ];

  // ── Text Diff Checker ──────────────────────────────────────────────────────
  const [diffA, setDiffA] = useState("The quick brown fox jumps over the lazy dog.\nThis is the original text.\nSome common line here.");
  const [diffB, setDiffB] = useState("The quick brown fox leaps over the lazy cat.\nThis is the modified text.\nSome common line here.");
  const diffResult = useMemo(() => {
    const linesA = diffA.split("\n");
    const linesB = diffB.split("\n");
    const maxLen = Math.max(linesA.length, linesB.length);
    return Array.from({ length: maxLen }, (_, i) => {
      const a = linesA[i] ?? null, b = linesB[i] ?? null;
      if (a === b) return { type: "same", lineA: a, lineB: b };
      if (a === null) return { type: "added", lineA: null, lineB: b };
      if (b === null) return { type: "removed", lineA: a, lineB: null };
      return { type: "changed", lineA: a, lineB: b };
    });
  }, [diffA, diffB]);

  // ── Remove Duplicate Lines ─────────────────────────────────────────────────
  const [dupInput, setDupInput] = useState("apple\nbanana\napple\ncherry\nbanana\ndate\napple");
  const dedupedOutput = useMemo(() => {
    const lines = dupInput.split("\n");
    const seen = new Set<string>();
    return lines.filter(l => { const t = l.trim(); if (!t) return true; if (seen.has(t)) return false; seen.add(t); return true; }).join("\n");
  }, [dupInput]);
  const dupCount = dupInput.split("\n").length - dedupedOutput.split("\n").length;

  // ── SQL Formatter ──────────────────────────────────────────────────────────
  const [sqlInput, setSqlInput] = useState("SELECT u.id, u.name, u.email, o.order_id, o.total FROM users u LEFT JOIN orders o ON u.id=o.user_id WHERE u.active=1 AND o.total>100 ORDER BY o.total DESC LIMIT 50;");
  const sqlFormatted = useMemo(() => {
    const keywords = ["SELECT","FROM","WHERE","LEFT JOIN","RIGHT JOIN","INNER JOIN","JOIN","ON","AND","OR","ORDER BY","GROUP BY","HAVING","LIMIT","OFFSET","INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","CREATE TABLE","ALTER TABLE","DROP TABLE"];
    let result = sqlInput;
    keywords.forEach(kw => {
      result = result.replace(new RegExp(`\\b${kw}\\b`, "gi"), `\n${kw.toUpperCase()}`);
    });
    return result.replace(/\n+/g, "\n").trim();
  }, [sqlInput]);

  // ── RegEx Tester ───────────────────────────────────────────────────────────
  const [regexPattern, setRegexPattern] = useState("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}");
  const [regexFlags, setRegexFlags] = useState("gi");
  const [regexTestStr, setRegexTestStr] = useState("Contact us at hello@devdrop.online or support@devdrop.dev for help.");
  const regexResult = useMemo(() => {
    try {
      const re = new RegExp(regexPattern, regexFlags);
      const matches = Array.from(regexTestStr.matchAll(new RegExp(regexPattern, regexFlags.includes("g") ? regexFlags : regexFlags + "g")));
      const highlighted = regexTestStr.replace(re, m => `<mark class="bg-emerald-500/30 text-emerald-300 rounded px-0.5">${m}</mark>`);
      return { matches: matches.map(m => m[0]), highlighted, error: null };
    } catch (e: any) { return { matches: [], highlighted: regexTestStr, error: e.message }; }
  }, [regexPattern, regexFlags, regexTestStr]);

  // ── Credit Card Luhn ───────────────────────────────────────────────────────
  const [ccNumber, setCcNumber] = useState("4532015112830366");
  const luhnResult = useMemo(() => {
    const digits = ccNumber.replace(/\D/g, "");
    if (digits.length < 13) return { valid: false, brand: "Unknown" };
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let d = parseInt(digits[digits.length - 1 - i]);
      if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
      sum += d;
    }
    const valid = sum % 10 === 0;
    let brand = "Unknown";
    if (/^4/.test(digits)) brand = "Visa";
    else if (/^5[1-5]/.test(digits)) brand = "Mastercard";
    else if (/^3[47]/.test(digits)) brand = "Amex";
    else if (/^6011/.test(digits)) brand = "Discover";
    return { valid, brand };
  }, [ccNumber]);

  // ── Screen Resolution ──────────────────────────────────────────────────────
  const [screenInfo] = useState(() => ({
    width: typeof window !== "undefined" ? window.screen.width : "—",
    height: typeof window !== "undefined" ? window.screen.height : "—",
    innerW: typeof window !== "undefined" ? window.innerWidth : "—",
    innerH: typeof window !== "undefined" ? window.innerHeight : "—",
    dpr: typeof window !== "undefined" ? window.devicePixelRatio : "—",
    colorDepth: typeof window !== "undefined" ? window.screen.colorDepth : "—",
  }));

  // ── User Agent ─────────────────────────────────────────────────────────────
  const [userAgent] = useState(() => typeof navigator !== "undefined" ? navigator.userAgent : "");
  const uaParsed = useMemo(() => {
    const ua = userAgent;
    const isChrome = /Chrome/.test(ua) && !/Chromium|Edge/.test(ua);
    const isFirefox = /Firefox/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isEdge = /Edge|Edg/.test(ua);
    const browser = isChrome ? "Chrome" : isFirefox ? "Firefox" : isSafari ? "Safari" : isEdge ? "Edge" : "Unknown";
    const isWindows = /Windows/.test(ua);
    const isMac = /Macintosh/.test(ua);
    const isLinux = /Linux/.test(ua);
    const isAndroid = /Android/.test(ua);
    const isIOS = /iPhone|iPad/.test(ua);
    const os = isWindows ? "Windows" : isMac ? "macOS" : isLinux ? "Linux" : isAndroid ? "Android" : isIOS ? "iOS" : "Unknown";
    const isMobile = /Mobile|Android|iPhone/.test(ua);
    return { browser, os, type: isMobile ? "Mobile" : "Desktop" };
  }, [userAgent]);

  // ── Strong Passphrase ──────────────────────────────────────────────────────
  const wordList = ["correct","horse","battery","staple","dragon","monkey","shadow","master","sunshine","princess","football","iloveyou","trustno1","letmein","welcome","hello","admin","passw0rd","ninja","puppy","turtle","cherry","pizza","delta","alpha","bravo","cyber","cloud","pixel","rocket","laser","storm","thunder","quick","brave","happy","lucky"];
  const [phraseWordCount, setPhraseWordCount] = useState(4);
  const [passphrases, setPassphrases] = useState<string[]>([]);
  const generatePassphrases = () => {
    setPassphrases(Array.from({ length: 5 }, () => {
      const words = Array.from({ length: phraseWordCount }, () => wordList[Math.floor(Math.random() * wordList.length)]);
      return words.join("-") + Math.floor(Math.random() * 999);
    }));
  };
  useEffect(() => { generatePassphrases(); }, [phraseWordCount]);

  // ── Image Color Picker ─────────────────────────────────────────────────────
  const [pickedColor, setPickedColor] = useState("#00ff9d");

  // ── Favicon Generator ──────────────────────────────────────────────────────
  const [faviconText, setFaviconText] = useState("D");
  const [faviconBg, setFaviconBg] = useState("#0d1117");
  const [faviconFg, setFaviconFg] = useState("#00ff9d");
  const faviconCanvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = faviconCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 64; canvas.height = 64;
    ctx.fillStyle = faviconBg;
    ctx.beginPath(); ctx.roundRect(0, 0, 64, 64, 12); ctx.fill();
    ctx.fillStyle = faviconFg;
    ctx.font = "bold 36px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(faviconText[0] || "?", 32, 32);
  }, [faviconText, faviconBg, faviconFg]);
  const downloadFavicon = () => {
    const canvas = faviconCanvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "favicon.png";
    a.click();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">

      {/* ── 1. Word Counter ── */}
      {toolSlug.includes("word-counter") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Words", val: wordCount, color: "text-emerald-400" },
              { label: "Characters", val: charCount, color: "text-white" },
              { label: "No Spaces", val: charNoSpaces, color: "text-neutral-300" },
              { label: "~Read Time", val: `${readingTime} min`, color: "text-cyan-400" },
            ].map(s => (
              <div key={s.label} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                <span className="text-xs text-neutral-400">{s.label}</span>
                <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
          <textarea rows={8} value={textInput} onChange={e => setTextInput(e.target.value)}
            placeholder="Paste or type text to inspect..." className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl p-4 text-sm text-neutral-200 outline-none" />
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span>{sentenceCount} Sentences • {paragraphCount} Paragraphs</span>
            <button onClick={() => copyToClipboard(textInput)} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg">
              <Copy className="w-3.5 h-3.5" /> Copy Text
            </button>
          </div>
        </div>
      )}

      {/* ── 2. Case Converter ── */}
      {toolSlug.includes("case-converter") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <textarea rows={4} value={textInput} onChange={e => setTextInput(e.target.value)}
            placeholder="Enter text to convert into different string cases..." className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl p-4 text-sm text-neutral-200 outline-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "UPPERCASE", val: caseConversions.upper },
              { label: "lowercase", val: caseConversions.lower },
              { label: "Title Case", val: caseConversions.title },
              { label: "camelCase", val: caseConversions.camel },
              { label: "snake_case", val: caseConversions.snake },
              { label: "kebab-case", val: caseConversions.kebab },
              { label: "PascalCase", val: caseConversions.pascal },
            ].map(item => (
              <div key={item.label} className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl flex items-center justify-between gap-3">
                <div className="overflow-hidden">
                  <span className="text-[11px] font-semibold text-neutral-400 block">{item.label}</span>
                  <p className="text-sm font-mono text-emerald-400 truncate">{item.val}</p>
                </div>
                <button onClick={() => copyToClipboard(item.val)} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. JSON Formatter ── */}
      {toolSlug.includes("json-formatter") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-neutral-300">Raw JSON Input</span>
                <button onClick={() => { try { setJsonInput(JSON.stringify(JSON.parse(jsonInput))); } catch {} }} className="text-xs text-neutral-400 hover:text-white">Minify</button>
              </div>
              <textarea rows={14} value={jsonInput} onChange={e => setJsonInput(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none resize-none" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-emerald-400">Formatted & Validated JSON</span>
                <button onClick={() => copyToClipboard(jsonOutput)} className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
              </div>
              <textarea rows={14} readOnly value={jsonError ? `Error: ${jsonError}` : jsonOutput}
                className={`w-full bg-neutral-950 border rounded-xl p-3 text-xs font-mono outline-none resize-none ${jsonError ? "border-red-500/50 text-red-400" : "border-emerald-500/30 text-emerald-300"}`} />
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Base64 ── */}
      {toolSlug.includes("base64") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex gap-2">
            {(["encode", "decode"] as const).map(m => (
              <button key={m} onClick={() => setBase64Mode(m)} className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${base64Mode === m ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-neutral-950 border-neutral-800 text-neutral-400"}`}>
                {m === "encode" ? "Text → Base64" : "Base64 → Text"}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Input</label>
              <textarea rows={8} value={base64Input} onChange={e => setBase64Input(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-neutral-400">Output</label>
                <button onClick={() => copyToClipboard(base64Output)} className="text-xs text-emerald-400 hover:underline flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
              </div>
              <textarea rows={8} readOnly value={base64Output} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono text-emerald-400 outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Password Generator ── */}
      {toolSlug.includes("password-generator") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="bg-neutral-950 border border-emerald-500/40 p-4 rounded-xl flex items-center justify-between gap-4">
            <span className="text-lg font-mono text-emerald-400 break-all select-all font-bold">{generatedPass}</span>
            <div className="flex gap-2">
              <button onClick={generatePassword} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"><RefreshCw className="w-4 h-4" /></button>
              <button onClick={() => copyToClipboard(generatedPass)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"><Copy className="w-3.5 h-3.5" /> Copy</button>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-neutral-300 mb-1">
                <span>Length</span><span className="text-emerald-400 font-bold">{passLength}</span>
              </div>
              <input type="range" min="8" max="64" value={passLength} onChange={e => setPassLength(Number(e.target.value))} className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Uppercase (A-Z)", val: passIncludeUpper, set: setPassIncludeUpper },
                { label: "Numbers (0-9)", val: passIncludeNumbers, set: setPassIncludeNumbers },
                { label: "Symbols (!@#$)", val: passIncludeSymbols, set: setPassIncludeSymbols },
              ].map(opt => (
                <label key={opt.label} className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input type="checkbox" checked={opt.val} onChange={e => opt.set(e.target.checked)} className="accent-emerald-500" /> {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Age Calculator ── */}
      {toolSlug.includes("age-calculator") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="max-w-xs">
            <label className="text-xs text-neutral-400 block mb-1">Date of Birth</label>
            <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm w-full outline-none" />
          </div>
          {ageResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Years", val: ageResult.years, color: "text-emerald-400" },
                { label: "Months", val: ageResult.months, color: "text-cyan-400" },
                { label: "Days", val: ageResult.days, color: "text-purple-400" },
                { label: "Total Days", val: ageResult.totalDays.toLocaleString(), color: "text-white" },
              ].map(s => (
                <div key={s.label} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                  <span className="text-xs text-neutral-400">{s.label}</span>
                  <p className={`text-3xl font-bold ${s.color}`}>{s.val}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 7. BMI ── */}
      {toolSlug.includes("bmi-calculator") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: `Weight: ${bmiWeight} kg`, min: 30, max: 180, val: bmiWeight, set: setBmiWeight },
              { label: `Height: ${bmiHeight} cm`, min: 100, max: 230, val: bmiHeight, set: setBmiHeight },
            ].map(s => (
              <div key={s.label}>
                <label className="text-xs text-neutral-400 block mb-1">{s.label}</label>
                <input type="range" min={s.min} max={s.max} value={s.val} onChange={e => s.set(Number(e.target.value))} className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </div>
            ))}
          </div>
          <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-800 text-center space-y-2">
            <span className="text-xs text-neutral-400">Your BMI Score</span>
            <p className="text-5xl font-extrabold text-white">{bmiScore}</p>
            <p className={`text-base font-bold ${bmiCategory.color}`}>{bmiCategory.label}</p>
            <div className="flex justify-center gap-6 text-xs text-neutral-500 pt-2">
              <span>Under 18.5 = Underweight</span><span>18.5–24.9 = Normal</span><span>25–29.9 = Overweight</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. Loan EMI ── */}
      {toolSlug.includes("loan-emi") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Principal Amount (₹)", val: loanPrincipal, set: setLoanPrincipal, step: 1 },
              { label: "Annual Interest Rate (%)", val: loanRate, set: setLoanRate, step: 0.1 },
              { label: "Tenure (Years)", val: loanTenureYears, set: setLoanTenureYears, step: 1 },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-neutral-400 block mb-1">{f.label}</label>
                <input type="number" step={f.step} value={f.val} onChange={e => f.set(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Monthly EMI", val: `₹${emiCalc.emi.toLocaleString()}`, color: "text-emerald-400" },
              { label: "Total Interest", val: `₹${emiCalc.totalInterest.toLocaleString()}`, color: "text-amber-400" },
              { label: "Total Payable", val: `₹${emiCalc.totalPayment.toLocaleString()}`, color: "text-white" },
            ].map(s => (
              <div key={s.label} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                <span className="text-xs text-neutral-400">{s.label}</span>
                <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 9. Hash Generator ── */}
      {toolSlug.includes("hash-generator") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <input type="text" value={hashInput} onChange={e => setHashInput(e.target.value)} placeholder="Enter text to hash..." className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none font-mono" />
          <div className="space-y-3 pt-2">
            {[{ algo: "SHA-256", hash: hashes.sha256 }, { algo: "SHA-1", hash: hashes.sha1 }, { algo: "SHA-512", hash: hashes.sha512 }].map(h => (
              <div key={h.algo} className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl flex items-center justify-between gap-3">
                <div className="overflow-hidden">
                  <span className="text-[11px] font-bold text-neutral-400">{h.algo}</span>
                  <p className="text-xs font-mono text-emerald-400 truncate">{h.hash}</p>
                </div>
                <button onClick={() => copyToClipboard(h.hash)} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"><Copy className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 10. UUID Generator ── */}
      {toolSlug.includes("uuid-generator") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <span className="text-xs text-neutral-400">UUID v4 Unique Identifiers</span>
            <button onClick={() => generateUuids(5)} className="text-xs text-emerald-400 flex items-center gap-1 hover:underline"><RefreshCw className="w-3 h-3" /> Regenerate</button>
          </div>
          <div className="space-y-2">
            {uuids.map((id, i) => (
              <div key={i} className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-mono text-neutral-200 select-all">{id}</span>
                <button onClick={() => copyToClipboard(id)} className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"><Copy className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
          <button onClick={() => generateUuids(10)} className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl transition">Generate 10 More UUIDs</button>
        </div>
      )}

      {/* ── 11. Unit Converter ── */}
      {toolSlug.includes("unit-converter") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex gap-2">
            {(["length", "weight", "storage"] as const).map(cat => (
              <button key={cat} onClick={() => { setUnitCategory(cat); if (cat === "length") { setUnitFrom("m"); setUnitTo("ft"); } else if (cat === "weight") { setUnitFrom("kg"); setUnitTo("lb"); } else { setUnitFrom("MB"); setUnitTo("GB"); } }}
                className={`px-4 py-2 text-xs font-bold rounded-lg border capitalize transition ${unitCategory === cat ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-neutral-950 border-neutral-800 text-neutral-400"}`}>{cat}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Value</label>
              <input type="number" value={unitValue} onChange={e => setUnitValue(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" />
            </div>
            {[{ label: "From", val: unitFrom, set: setUnitFrom }, { label: "To", val: unitTo, set: setUnitTo }].map(sel => (
              <div key={sel.label}>
                <label className="text-xs text-neutral-400 block mb-1">{sel.label}</label>
                <select value={sel.val} onChange={e => sel.set(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none">
                  {unitCategory === "length" && <><option value="m">Meters</option><option value="km">Kilometers</option><option value="cm">Centimeters</option><option value="ft">Feet</option><option value="in">Inches</option><option value="mi">Miles</option></>}
                  {unitCategory === "weight" && <><option value="kg">Kilograms</option><option value="g">Grams</option><option value="lb">Pounds</option><option value="oz">Ounces</option></>}
                  {unitCategory === "storage" && <><option value="B">Bytes</option><option value="KB">Kilobytes</option><option value="MB">Megabytes</option><option value="GB">Gigabytes</option><option value="TB">Terabytes</option></>}
                </select>
              </div>
            ))}
          </div>
          <div className="bg-neutral-950 p-6 rounded-xl border border-emerald-500/30 text-center">
            <span className="text-xs text-neutral-400">Converted Output</span>
            <p className="text-3xl font-extrabold text-emerald-400">{convertUnits()} {unitTo}</p>
          </div>
        </div>
      )}

      {/* ── 12. URL Encoder ── */}
      {toolSlug.includes("url-encoder") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex gap-2">
            {(["encode", "decode"] as const).map(m => (
              <button key={m} onClick={() => setUrlMode(m)} className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition ${urlMode === m ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-neutral-950 border-neutral-800 text-neutral-400"}`}>{m === "encode" ? "Encode URL" : "Decode URL"}</button>
            ))}
          </div>
          <textarea rows={4} value={urlInput} onChange={e => setUrlInput(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none" />
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between gap-3">
            <p className="text-xs font-mono text-emerald-400 break-all">{urlOutput}</p>
            <button onClick={() => copyToClipboard(urlOutput)} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"><Copy className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      )}

      {/* ── 13. Slug Generator ── */}
      {toolSlug.includes("slug-generator") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <input type="text" value={slugSource} onChange={e => setSlugSource(e.target.value)} placeholder="Enter article/page title..." className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" />
          <div className="bg-neutral-950 p-4 rounded-xl border border-emerald-500/40 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-neutral-500 block">SEO URL Slug:</span>
              <p className="text-sm font-mono text-emerald-400">{generatedSlug}</p>
            </div>
            <button onClick={() => copyToClipboard(generatedSlug)} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-lg flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> Copy</button>
          </div>
        </div>
      )}

      {/* ── 14. Binary Converter ── */}
      {toolSlug.includes("binary") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex gap-2">
            {[{ mode: "toBinary" as const, label: "Text → Binary" }, { mode: "toText" as const, label: "Binary → Text" }].map(b => (
              <button key={b.mode} onClick={() => setBinaryMode(b.mode)} className={`px-4 py-1.5 text-xs font-bold rounded-lg border ${binaryMode === b.mode ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-neutral-950 border-neutral-800 text-neutral-400"}`}>{b.label}</button>
            ))}
          </div>
          <textarea rows={4} value={binaryText} onChange={e => setBinaryText(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none" />
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between gap-3">
            <p className="text-xs font-mono text-emerald-400 break-all">{binaryOutput}</p>
            <button onClick={() => copyToClipboard(binaryOutput)} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"><Copy className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      )}

      {/* ── 15. JWT Decoder ── */}
      {toolSlug.includes("jwt") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <label className="text-xs text-neutral-400 block mb-1">Paste JWT Token</label>
          <textarea rows={3} value={jwtToken} onChange={e => setJwtToken(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none break-all" />
          {jwtDecoded.error ? (
            <div className="p-3 bg-red-950/40 border border-red-800/40 text-red-300 text-xs rounded-xl">{jwtDecoded.error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[{ label: "Header", data: jwtDecoded.header, color: "text-cyan-400" }, { label: "Payload", data: jwtDecoded.payload, color: "text-emerald-400" }].map(s => (
                <div key={s.label}>
                  <span className="text-xs font-bold text-neutral-400 block mb-1">{s.label}</span>
                  <pre className={`bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs ${s.color} overflow-x-auto`}>{JSON.stringify(s.data, null, 2)}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 16. CSS Gradient ── */}
      {toolSlug.includes("css-gradient") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="w-full h-40 rounded-2xl border border-neutral-700" style={{ background: `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})` }} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="text-xs text-neutral-400 block mb-1">Color 1</label><input type="color" value={gradColor1} onChange={e => setGradColor1(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0" /></div>
            <div><label className="text-xs text-neutral-400 block mb-1">Color 2</label><input type="color" value={gradColor2} onChange={e => setGradColor2(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0" /></div>
            <div><label className="text-xs text-neutral-400 block mb-1">Angle: {gradAngle}°</label><input type="range" min="0" max="360" value={gradAngle} onChange={e => setGradAngle(Number(e.target.value))} className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-4" /></div>
          </div>
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
            <code className="text-xs font-mono text-emerald-400">{cssGradientCode}</code>
            <button onClick={() => copyToClipboard(cssGradientCode)} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-lg flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> Copy CSS</button>
          </div>
        </div>
      )}

      {/* ── 17. Color HEX to RGB/HSL ── */}
      {(toolSlug.includes("color-hex") || toolSlug.includes("hex-converter") || toolSlug.includes("color-converter")) && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex gap-4 items-center">
            <input type="color" value={hexColor} onChange={e => setHexColor(e.target.value)} className="w-20 h-20 rounded-xl cursor-pointer border-0 bg-transparent" />
            <div>
              <input type="text" value={hexColor} onChange={e => setHexColor(e.target.value)} className="bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2 text-sm outline-none font-mono w-32 mb-2" />
              <div className="w-40 h-10 rounded-lg" style={{ background: hexColor }} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "HEX", val: hexColor, color: "text-purple-400" },
              { label: "RGB", val: colorValues.rgbStr, color: "text-cyan-400" },
              { label: "HSL", val: colorValues.hslStr, color: "text-emerald-400" },
            ].map(c => (
              <div key={c.label} className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-neutral-400">{c.label}</span>
                  <p className={`text-sm font-mono ${c.color}`}>{c.val}</p>
                </div>
                <button onClick={() => copyToClipboard(c.val)} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"><Copy className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
          <div className="text-xs text-neutral-500">RGB Components — R: {colorValues.r} · G: {colorValues.g} · B: {colorValues.b}</div>
        </div>
      )}

      {/* ── 18. Percentage Calculator ── */}
      {toolSlug.includes("percentage") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div>
            <h3 className="text-sm font-bold text-neutral-300 mb-3">What is X% of Y?</h3>
            <div className="grid grid-cols-3 gap-4 items-center">
              <div><label className="text-xs text-neutral-400 block mb-1">Percentage (%)</label><input type="number" value={pctVal} onChange={e => setPctVal(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" /></div>
              <div className="text-center text-neutral-500 font-bold pt-5">of</div>
              <div><label className="text-xs text-neutral-400 block mb-1">Total Value</label><input type="number" value={pctOf} onChange={e => setPctOf(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" /></div>
            </div>
            <div className="mt-3 bg-neutral-950 p-4 rounded-xl border border-emerald-500/30 text-center">
              <span className="text-xs text-neutral-400">{pctVal}% of {pctOf} =</span>
              <p className="text-3xl font-extrabold text-emerald-400">{pctResult}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-300 mb-3">X is what % of Y?</h3>
            <div className="grid grid-cols-3 gap-4 items-center">
              <div><label className="text-xs text-neutral-400 block mb-1">Number (X)</label><input type="number" value={reverseNum} onChange={e => setReverseNum(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" /></div>
              <div className="text-center text-neutral-500 font-bold pt-5">÷</div>
              <div><label className="text-xs text-neutral-400 block mb-1">Total (Y)</label><input type="number" value={reverseTotal} onChange={e => setReverseTotal(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" /></div>
            </div>
            <div className="mt-3 bg-neutral-950 p-4 rounded-xl border border-cyan-500/30 text-center">
              <span className="text-xs text-neutral-400">{reverseNum} is _% of {reverseTotal} =</span>
              <p className="text-3xl font-extrabold text-cyan-400">{reverseResult}%</p>
            </div>
          </div>
        </div>
      )}

      {/* ── 19. Days Between Dates ── */}
      {(toolSlug.includes("days-between") || toolSlug.includes("date-difference")) && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-xs text-neutral-400 block mb-1">Start Date</label><input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm w-full outline-none" /></div>
            <div><label className="text-xs text-neutral-400 block mb-1">End Date</label><input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm w-full outline-none" /></div>
          </div>
          {daysBetween && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Days", val: daysBetween.days.toLocaleString(), color: "text-emerald-400" },
                { label: "Weeks", val: daysBetween.weeks.toLocaleString(), color: "text-cyan-400" },
                { label: "Months", val: daysBetween.months.toLocaleString(), color: "text-purple-400" },
                { label: "Years", val: daysBetween.years.toLocaleString(), color: "text-white" },
              ].map(s => (
                <div key={s.label} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                  <span className="text-xs text-neutral-400">{s.label}</span>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 20. Unix Timestamp ── */}
      {toolSlug.includes("unix-timestamp") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-xl flex items-center justify-between">
            <span className="text-xs text-neutral-400">Current Unix Timestamp:</span>
            <code className="text-emerald-400 font-mono text-sm">{currentUnix}</code>
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Unix Timestamp to Convert</label>
            <input type="text" value={unixInput} onChange={e => setUnixInput(e.target.value)} placeholder="e.g. 1700000000" className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none font-mono" />
          </div>
          {unixResult && (
            <div className="space-y-2">
              {[
                { label: "UTC", val: unixResult.utc },
                { label: "Local Time", val: unixResult.local },
                { label: "ISO 8601", val: unixResult.iso },
              ].map(r => (
                <div key={r.label} className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-neutral-400">{r.label}</span>
                    <p className="text-sm font-mono text-emerald-300">{r.val}</p>
                  </div>
                  <button onClick={() => copyToClipboard(r.val)} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"><Copy className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 21. Aspect Ratio ── */}
      {toolSlug.includes("aspect-ratio") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-neutral-400 block mb-1">Width (px)</label><input type="number" value={arWidth} onChange={e => setArWidth(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" /></div>
            <div><label className="text-xs text-neutral-400 block mb-1">Height (px)</label><input type="number" value={arHeight} onChange={e => setArHeight(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" /></div>
          </div>
          <div className="bg-neutral-950 p-5 rounded-xl border border-emerald-500/30 text-center">
            <span className="text-xs text-neutral-400">Aspect Ratio</span>
            <p className="text-4xl font-extrabold text-emerald-400 mt-1">{aspectRatio}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-300 mb-3">Scale to New Width</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-neutral-400 block mb-1">New Width (px)</label><input type="number" value={arNewWidth} onChange={e => setArNewWidth(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" /></div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                <span className="text-xs text-neutral-400">Scaled Height</span>
                <p className="text-2xl font-bold text-cyan-400">{scaledHeight} px</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 22. HTML Entity Encoder ── */}
      {toolSlug.includes("html-entity") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex gap-2">
            {(["encode", "decode"] as const).map(m => (
              <button key={m} onClick={() => setEntityMode(m)} className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition ${entityMode === m ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-neutral-950 border-neutral-800 text-neutral-400"}`}>{m === "encode" ? "Encode Entities" : "Decode Entities"}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Input HTML</label>
              <textarea rows={8} value={entityInput} onChange={e => setEntityInput(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-neutral-400">Output</label>
                <button onClick={() => copyToClipboard(entityOutput)} className="text-xs text-emerald-400 flex items-center gap-1 hover:underline"><Copy className="w-3 h-3" /> Copy</button>
              </div>
              <textarea rows={8} readOnly value={entityOutput} className="w-full bg-neutral-950 border border-emerald-500/30 rounded-xl p-3 text-xs font-mono text-emerald-300 outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* ── 23. CSV to JSON ── */}
      {toolSlug.includes("csv-to-json") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">CSV Input (first row = headers)</label>
              <textarea rows={10} value={csvInput} onChange={e => setCsvInput(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none resize-none" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-neutral-400">JSON Output</label>
                <button onClick={() => copyToClipboard(csvToJson)} className="text-xs text-emerald-400 flex items-center gap-1 hover:underline"><Copy className="w-3 h-3" /> Copy</button>
              </div>
              <textarea rows={10} readOnly value={csvToJson} className="w-full bg-neutral-950 border border-emerald-500/30 rounded-xl p-3 text-xs font-mono text-emerald-300 outline-none resize-none" />
            </div>
          </div>
        </div>
      )}

      {/* ── 24. JSON to CSV ── */}
      {toolSlug.includes("json-to-csv") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">JSON Array Input</label>
              <textarea rows={10} value={jsonInput2} onChange={e => setJsonInput2(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none resize-none" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-neutral-400">CSV Output</label>
                <button onClick={() => copyToClipboard(jsonToCsv)} className="text-xs text-emerald-400 flex items-center gap-1 hover:underline"><Copy className="w-3 h-3" /> Copy</button>
              </div>
              <textarea rows={10} readOnly value={jsonToCsv} className="w-full bg-neutral-950 border border-emerald-500/30 rounded-xl p-3 text-xs font-mono text-emerald-300 outline-none resize-none" />
            </div>
          </div>
        </div>
      )}

      {/* ── 25. Tip Calculator ── */}
      {toolSlug.includes("tip-calculator") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="text-xs text-neutral-400 block mb-1">Bill Amount ($)</label><input type="number" value={billAmount} onChange={e => setBillAmount(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" /></div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Tip %: {tipPct}%</label>
              <input type="range" min="0" max="40" value={tipPct} onChange={e => setTipPct(Number(e.target.value))} className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2" />
              <div className="flex justify-between text-xs text-neutral-500 mt-1"><span>0%</span><span>40%</span></div>
            </div>
            <div><label className="text-xs text-neutral-400 block mb-1">Split Between (people)</label><input type="number" min="1" value={splitCount} onChange={e => setSplitCount(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Tip Amount", val: `$${tipCalc.tip}`, color: "text-amber-400" },
              { label: "Total Bill", val: `$${tipCalc.total}`, color: "text-white" },
              { label: "Per Person", val: `$${tipCalc.perPerson}`, color: "text-emerald-400" },
            ].map(s => (
              <div key={s.label} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                <span className="text-xs text-neutral-400">{s.label}</span>
                <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 26. Discount Calculator ── */}
      {toolSlug.includes("discount") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-xs text-neutral-400 block mb-1">Original Price ($)</label><input type="number" value={originalPrice} onChange={e => setOriginalPrice(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" /></div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Discount: {discountPct}%</label>
              <input type="range" min="0" max="99" value={discountPct} onChange={e => setDiscountPct(Number(e.target.value))} className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "You Save", val: `$${discountCalc.saved}`, color: "text-emerald-400" },
              { label: "Final Price", val: `$${discountCalc.finalPrice}`, color: "text-white" },
            ].map(s => (
              <div key={s.label} className="bg-neutral-950 p-6 rounded-xl border border-neutral-800 text-center">
                <span className="text-xs text-neutral-400">{s.label}</span>
                <p className={`text-3xl font-extrabold ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 27. Screen Resolution ── */}
      {toolSlug.includes("screen-resolution") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Screen Width", val: `${screenInfo.width}px` },
              { label: "Screen Height", val: `${screenInfo.height}px` },
              { label: "Viewport Width", val: `${screenInfo.innerW}px` },
              { label: "Viewport Height", val: `${screenInfo.innerH}px` },
              { label: "Device Pixel Ratio", val: `${screenInfo.dpr}x` },
              { label: "Color Depth", val: `${screenInfo.colorDepth} bit` },
            ].map(s => (
              <div key={s.label} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                <span className="text-xs text-neutral-400 block">{s.label}</span>
                <p className="text-xl font-bold text-emerald-400">{s.val}</p>
              </div>
            ))}
          </div>
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs text-neutral-400 font-mono break-all">Screen: {screenInfo.width}×{screenInfo.height} · DPR: {screenInfo.dpr} · Depth: {screenInfo.colorDepth}bit</div>
        </div>
      )}

      {/* ── 28. User Agent ── */}
      {toolSlug.includes("user-agent") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Browser", val: uaParsed.browser, color: "text-cyan-400" },
              { label: "OS", val: uaParsed.os, color: "text-purple-400" },
              { label: "Device Type", val: uaParsed.type, color: "text-emerald-400" },
            ].map(s => (
              <div key={s.label} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                <span className="text-xs text-neutral-400 block">{s.label}</span>
                <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Full User-Agent String</label>
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-between gap-3">
              <p className="text-xs font-mono text-neutral-300 break-all">{userAgent}</p>
              <button onClick={() => copyToClipboard(userAgent)} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 flex-shrink-0"><Copy className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      )}

      {/* ── 29. Roman Numeral ── */}
      {toolSlug.includes("roman-numeral") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex gap-2">
            {[{ mode: "toRoman" as const, label: "Number → Roman" }, { mode: "fromRoman" as const, label: "Roman → Number" }].map(b => (
              <button key={b.mode} onClick={() => setRomanMode(b.mode)} className={`px-4 py-1.5 text-xs font-bold rounded-lg border ${romanMode === b.mode ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-neutral-950 border-neutral-800 text-neutral-400"}`}>{b.label}</button>
            ))}
          </div>
          {romanMode === "toRoman" ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Number (1–3999)</label>
                <input type="number" min="1" max="3999" value={romanInput} onChange={e => setRomanInput(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" />
              </div>
              <div className="bg-neutral-950 p-6 rounded-xl border border-emerald-500/30 text-center flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400">{romanInput} in Roman Numerals:</span>
                  <p className="text-4xl font-extrabold text-emerald-400 tracking-widest">{romanInput >= 1 && romanInput <= 3999 ? toRoman(romanInput) : "Invalid"}</p>
                </div>
                <button onClick={() => copyToClipboard(toRoman(romanInput))} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"><Copy className="w-4 h-4" /></button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Roman Numeral</label>
                <input type="text" value={romanStrInput} onChange={e => setRomanStrInput(e.target.value.toUpperCase())} placeholder="e.g. MMXXIV" className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none font-mono uppercase" />
              </div>
              <div className="bg-neutral-950 p-6 rounded-xl border border-cyan-500/30 text-center">
                <span className="text-xs text-neutral-400">{romanStrInput} in Decimal:</span>
                <p className="text-4xl font-extrabold text-cyan-400">{fromRoman(romanStrInput)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 30. Random Number / Dice ── */}
      {toolSlug.includes("random-number") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="text-xs text-neutral-400 block mb-1">Min</label><input type="number" value={randMin} onChange={e => setRandMin(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" /></div>
            <div><label className="text-xs text-neutral-400 block mb-1">Max</label><input type="number" value={randMax} onChange={e => setRandMax(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" /></div>
            <div><label className="text-xs text-neutral-400 block mb-1">Count</label><input type="number" min="1" max="20" value={randCount} onChange={e => setRandCount(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" /></div>
          </div>
          <button onClick={generateRandom} className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold rounded-xl flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Generate Random Numbers</button>
          <div className="flex flex-wrap gap-2">
            {randResults.map((n, i) => <span key={i} className="bg-neutral-950 border border-emerald-500/40 text-emerald-400 font-mono font-bold px-4 py-2 rounded-xl text-lg">{n}</span>)}
          </div>
          <div className="border-t border-neutral-800 pt-4">
            <h3 className="text-sm font-bold text-neutral-300 mb-3">🎲 Dice Roller</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <select value={diceType} onChange={e => setDiceType(Number(e.target.value))} className="bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2 text-sm outline-none">
                {[4, 6, 8, 10, 12, 20, 100].map(d => <option key={d} value={d}>D{d}</option>)}
              </select>
              <button onClick={() => setDiceResult(Math.floor(Math.random() * diceType) + 1)} className="px-6 py-2 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl">🎲 Roll</button>
              {diceResult !== null && <div className="bg-neutral-950 border border-purple-500/40 px-6 py-3 rounded-xl text-center"><span className="text-xs text-neutral-400">Result</span><p className="text-3xl font-extrabold text-purple-400">{diceResult}</p></div>}
            </div>
          </div>
        </div>
      )}

      {/* ── 31. Random Choice Picker ── */}
      {toolSlug.includes("random-choice") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Enter choices (one per line)</label>
            <textarea rows={8} value={choices} onChange={e => setChoices(e.target.value)} placeholder="Enter choices, one per line..." className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-sm text-neutral-200 outline-none" />
          </div>
          <button onClick={pickChoice} className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold rounded-xl flex items-center justify-center gap-2 text-sm">
            <Sparkles className="w-4 h-4" /> Pick a Random Choice!
          </button>
          {chosenResult && (
            <div className="bg-neutral-950 border border-emerald-500/50 p-6 rounded-2xl text-center">
              <span className="text-xs text-neutral-400 block mb-1">🎯 The winner is...</span>
              <p className="text-3xl font-extrabold text-emerald-400">{chosenResult}</p>
            </div>
          )}
        </div>
      )}

      {/* ── 32. Hex to ASCII ── */}
      {toolSlug.includes("hex-to-ascii") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex gap-2">
            {[{ mode: "hexToAsc" as const, label: "Hex → ASCII" }, { mode: "ascToHex" as const, label: "ASCII → Hex" }].map(b => (
              <button key={b.mode} onClick={() => setHexAsciiMode(b.mode)} className={`px-4 py-1.5 text-xs font-bold rounded-lg border ${hexAsciiMode === b.mode ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-neutral-950 border-neutral-800 text-neutral-400"}`}>{b.label}</button>
            ))}
          </div>
          <textarea rows={4} value={hexAsciiInput} onChange={e => setHexAsciiInput(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none" />
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between gap-3">
            <p className="text-xs font-mono text-emerald-400 break-all">{hexAsciiOutput}</p>
            <button onClick={() => copyToClipboard(hexAsciiOutput)} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"><Copy className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      )}

      {/* ── 33. Morse Code ── */}
      {toolSlug.includes("morse-code") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex gap-2">
            {[{ mode: "toMorse" as const, label: "Text → Morse" }, { mode: "fromMorse" as const, label: "Morse → Text" }].map(b => (
              <button key={b.mode} onClick={() => setMorseMode(b.mode)} className={`px-4 py-1.5 text-xs font-bold rounded-lg border ${morseMode === b.mode ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-neutral-950 border-neutral-800 text-neutral-400"}`}>{b.label}</button>
            ))}
          </div>
          <textarea rows={4} value={morseInput} onChange={e => setMorseInput(e.target.value)} placeholder={morseMode === "toMorse" ? "Enter text..." : "Enter morse code (use / for word spaces)..."} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-sm font-mono text-neutral-200 outline-none" />
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between gap-3">
            <p className="text-sm font-mono text-emerald-400 break-all leading-relaxed">{morseOutput}</p>
            <button onClick={() => copyToClipboard(morseOutput)} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 flex-shrink-0"><Copy className="w-3.5 h-3.5" /></button>
          </div>
          <p className="text-xs text-neutral-500">Tip: Use dot (.) and dash (-) for morse, space between characters, / between words</p>
        </div>
      )}

      {/* ── 34. Lorem Ipsum ── */}
      {toolSlug.includes("lorem-ipsum") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Generate</label>
              <input type="number" min="1" max="20" value={loremCount} onChange={e => setLoremCount(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-neutral-400 block mb-1">Type</label>
              <div className="flex gap-2">
                {(["paragraphs", "sentences", "words"] as const).map(t => (
                  <button key={t} onClick={() => setLoremType(t)} className={`px-3 py-2 text-xs font-bold rounded-lg border capitalize transition ${loremType === t ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-neutral-950 border-neutral-800 text-neutral-400"}`}>{t}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="relative">
            <textarea rows={10} readOnly value={loremOutput} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-sm text-neutral-300 outline-none leading-relaxed resize-none" />
            <button onClick={() => copyToClipboard(loremOutput)} className="absolute top-2 right-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-lg flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
          </div>
        </div>
      )}

      {/* ── 35. Markdown Previewer ── */}
      {toolSlug.includes("markdown-previewer") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Markdown Input</label>
              <textarea rows={18} value={mdInput} onChange={e => setMdInput(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none resize-none" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Live Preview</label>
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 min-h-[18rem] text-sm text-neutral-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: mdPreview }} />
            </div>
          </div>
        </div>
      )}

      {/* ── 36. Markdown Table Generator ── */}
      {toolSlug.includes("markdown-table") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={addTableRow} className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1"><Plus className="w-3 h-3" /> Add Row</button>
            <button onClick={removeTableRow} className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-lg flex items-center gap-1"><Minus className="w-3 h-3" /> Remove Row</button>
            <button onClick={addTableCol} className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold rounded-lg flex items-center gap-1"><Plus className="w-3 h-3" /> Add Column</button>
            <button onClick={removeTableCol} className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-lg flex items-center gap-1"><Minus className="w-3 h-3" /> Remove Column</button>
            <span className="text-xs text-neutral-500 ml-2">{tableRows} rows × {tableCols} cols</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {tableHeaders.map((h, ci) => (
                    <th key={ci} className="border border-neutral-700 p-1">
                      <div className="flex items-center gap-1">
                        <input value={h} onChange={e => updateHeader(ci, e.target.value)} className="bg-neutral-900 text-emerald-400 font-bold text-xs p-1.5 rounded w-full outline-none border border-neutral-700 focus:border-emerald-500" />
                        <button onClick={() => cycleAlign(ci)} className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-400 flex-shrink-0" title={`Alignment: ${tableAligns[ci]}`}>
                          {tableAligns[ci] === "left" ? <AlignLeft className="w-3 h-3" /> : tableAligns[ci] === "center" ? <AlignCenter className="w-3 h-3" /> : <AlignRight className="w-3 h-3" />}
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-neutral-700 p-1">
                        <input value={cell} onChange={e => updateCell(ri, ci, e.target.value)} className="bg-neutral-900 text-neutral-200 text-xs p-1.5 rounded w-full outline-none border border-neutral-700 focus:border-emerald-500" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-neutral-400">Generated Markdown Table</label>
              <button onClick={() => copyToClipboard(markdownTable)} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-lg flex items-center gap-1"><Copy className="w-3 h-3" /> Copy Markdown</button>
            </div>
            <pre className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre">{markdownTable}</pre>
          </div>
        </div>
      )}

      {/* ── 37. HTML to Markdown ── */}
      {toolSlug.includes("html-to-markdown") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">HTML Input</label>
              <textarea rows={16} value={htmlInput} onChange={e => setHtmlInput(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none resize-none" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-neutral-400">Markdown Output</label>
                <button onClick={() => copyToClipboard(htmlToMarkdown)} className="text-xs text-emerald-400 flex items-center gap-1 hover:underline"><Copy className="w-3 h-3" /> Copy</button>
              </div>
              <textarea rows={16} readOnly value={htmlToMarkdown} className="w-full bg-neutral-950 border border-emerald-500/30 rounded-xl p-3 text-xs font-mono text-emerald-300 outline-none resize-none" />
            </div>
          </div>
        </div>
      )}

      {/* ── 38. Pomodoro Timer ── */}
      {toolSlug.includes("pomodoro") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center justify-center">
            <div className="relative w-56 h-56">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#262626" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="46" fill="none"
                  stroke={pomPhase === "work" ? "#10b981" : "#06b6d4"}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 46}`}
                  strokeDashoffset={`${2 * Math.PI * 46 * (1 - pomPct / 100)}`}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{pomPhase === "work" ? "🍅 Focus" : "☕ Break"}</span>
                <span className="text-5xl font-mono font-black text-white mt-1">{pomMins}:{pomSecs}</span>
                <span className="text-xs text-neutral-500">Session #{pomSessions + 1}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={() => setPomRunning(r => !r)} className={`px-8 py-3 rounded-xl font-extrabold text-sm flex items-center gap-2 transition ${pomRunning ? "bg-amber-500 hover:bg-amber-400 text-neutral-950" : "bg-emerald-500 hover:bg-emerald-400 text-neutral-950"}`}>
              {pomRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start</>}
            </button>
            <button onClick={pomReset} className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-300 font-bold text-sm flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Reset</button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-xs text-neutral-400">
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800"><span className="block text-neutral-500">Work</span><span className="text-emerald-400 font-bold">25 minutes</span></div>
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800"><span className="block text-neutral-500">Break</span><span className="text-cyan-400 font-bold">5 minutes</span></div>
          </div>
          {pomLaps.length > 0 && (
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-1 max-h-40 overflow-y-auto">
              <span className="text-xs font-bold text-neutral-400 block mb-2">Session Log</span>
              {pomLaps.map((l, i) => <p key={i} className="text-xs text-neutral-400 font-mono">{l}</p>)}
            </div>
          )}
        </div>
      )}

      {/* ── 39. Stopwatch ── */}
      {toolSlug.includes("stopwatch") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="bg-neutral-950 p-8 rounded-2xl border border-neutral-800 text-center">
            <span className="text-6xl font-mono font-black text-white tracking-widest">{formatMs(swMs)}</span>
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={() => setSwRunning(r => !r)} className={`px-8 py-3 rounded-xl font-extrabold text-sm flex items-center gap-2 ${swRunning ? "bg-amber-500 hover:bg-amber-400 text-neutral-950" : "bg-emerald-500 hover:bg-emerald-400 text-neutral-950"}`}>
              {swRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start</>}
            </button>
            <button onClick={() => { if (swRunning) setSwLaps(l => [...l, formatMs(swMs)]); }} className="px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl font-bold text-sm">Lap</button>
            <button onClick={() => { setSwMs(0); setSwRunning(false); setSwLaps([]); }} className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-300 font-bold text-sm flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Reset</button>
          </div>
          {swLaps.length > 0 && (
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-1 max-h-48 overflow-y-auto">
              <span className="text-xs font-bold text-neutral-400 block mb-2">Lap Times</span>
              {swLaps.map((l, i) => (
                <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-neutral-800">
                  <span className="text-neutral-500">Lap {i + 1}</span>
                  <span className="font-mono text-cyan-400 font-bold">{l}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 40. World Clock ── */}
      {toolSlug.includes("world-clock") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="bg-neutral-950 border border-emerald-500/30 p-4 rounded-xl text-center">
            <span className="text-xs text-neutral-400">Your Local Time</span>
            <p className="text-3xl font-mono font-black text-emerald-400">{currentTime.toLocaleTimeString()}</p>
            <p className="text-xs text-neutral-500 mt-1">{currentTime.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {timezones.map(tz => (
              <div key={tz.city} className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{tz.flag}</span>
                  <span className="text-xs text-neutral-400">{tz.city}</span>
                </div>
                <p className="text-xl font-mono font-bold text-white">
                  {currentTime.toLocaleTimeString("en-US", { timeZone: tz.tz, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  {currentTime.toLocaleDateString("en-US", { timeZone: tz.tz, weekday: "short", month: "short", day: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 41. Text Diff ── */}
      {toolSlug.includes("text-diff") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Original Text (A)</label>
              <textarea rows={8} value={diffA} onChange={e => setDiffA(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none resize-none" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Modified Text (B)</label>
              <textarea rows={8} value={diffB} onChange={e => setDiffB(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none resize-none" />
            </div>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-1 font-mono text-xs max-h-72 overflow-y-auto">
            <div className="flex gap-3 text-[11px] text-neutral-500 pb-2 border-b border-neutral-800 mb-2">
              <span className="text-red-400">─ removed</span>
              <span className="text-emerald-400">+ added</span>
              <span className="text-neutral-500">· same</span>
            </div>
            {diffResult.map((line, i) => (
              <div key={i} className={`px-2 py-0.5 rounded ${line.type === "same" ? "text-neutral-500" : line.type === "added" ? "text-emerald-400 bg-emerald-950/40" : line.type === "removed" ? "text-red-400 bg-red-950/40" : ""}`}>
                {line.type === "same" && `  ${line.lineA}`}
                {line.type === "added" && `+ ${line.lineB}`}
                {line.type === "removed" && `- ${line.lineA}`}
                {line.type === "changed" && (
                  <div className="space-y-0.5">
                    <div className="text-red-400 bg-red-950/40 px-1 rounded">- {line.lineA}</div>
                    <div className="text-emerald-400 bg-emerald-950/40 px-1 rounded">+ {line.lineB}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 42. Remove Duplicates ── */}
      {toolSlug.includes("duplicate") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Input Lines (with duplicates)</label>
              <textarea rows={12} value={dupInput} onChange={e => setDupInput(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none resize-none" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-neutral-400">Unique Lines</label>
                <button onClick={() => copyToClipboard(dedupedOutput)} className="text-xs text-emerald-400 flex items-center gap-1 hover:underline"><Copy className="w-3 h-3" /> Copy</button>
              </div>
              <textarea rows={12} readOnly value={dedupedOutput} className="w-full bg-neutral-950 border border-emerald-500/30 rounded-xl p-3 text-xs font-mono text-emerald-300 outline-none resize-none" />
            </div>
          </div>
          <div className="text-xs text-neutral-400 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            Removed <span className="text-red-400 font-bold">{dupCount}</span> duplicate line{dupCount !== 1 ? "s" : ""} · {dedupedOutput.split("\n").length} unique lines remain
          </div>
        </div>
      )}

      {/* ── 43. SQL Formatter ── */}
      {toolSlug.includes("sql-formatter") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Raw SQL Input</label>
              <textarea rows={12} value={sqlInput} onChange={e => setSqlInput(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none resize-none" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-neutral-400">Formatted SQL</label>
                <button onClick={() => copyToClipboard(sqlFormatted)} className="text-xs text-emerald-400 flex items-center gap-1 hover:underline"><Copy className="w-3 h-3" /> Copy</button>
              </div>
              <pre className="bg-neutral-950 border border-emerald-500/30 rounded-xl p-3 text-xs font-mono text-emerald-300 h-72 overflow-y-auto whitespace-pre-wrap">{sqlFormatted}</pre>
            </div>
          </div>
        </div>
      )}

      {/* ── 44. RegEx Tester ── */}
      {toolSlug.includes("regex-tester") && (
        <div className="space-y-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-neutral-400 block mb-1">Regular Expression Pattern</label>
              <input type="text" value={regexPattern} onChange={e => setRegexPattern(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none font-mono" placeholder="Enter regex pattern..." />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Flags</label>
              <input type="text" value={regexFlags} onChange={e => setRegexFlags(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none font-mono" placeholder="gi" />
            </div>
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Test String</label>
            <textarea rows={4} value={regexTestStr} onChange={e => setRegexTestStr(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-sm font-mono text-neutral-200 outline-none" />
          </div>
          {regexResult.error ? (
            <div className="p-3 bg-red-950/40 border border-red-800/40 text-red-300 text-xs rounded-xl">{regexResult.error}</div>
          ) : (
            <>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Highlighted Matches</label>
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm font-mono" dangerouslySetInnerHTML={{ __html: regexResult.highlighted }} />
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                <span className="text-xs font-bold text-neutral-400 block mb-2">{regexResult.matches.length} match{regexResult.matches.length !== 1 ? "es" : ""} found</span>
                <div className="flex flex-wrap gap-2">
                  {regexResult.matches.map((m, i) => <span key={i} className="bg-emerald-950/60 text-emerald-300 font-mono text-xs px-2 py-1 rounded">{m}</span>)}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── 45. Credit Card Luhn ── */}
      {toolSlug.includes("credit-card") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Card Number (16 digits)</label>
            <input type="text" value={ccNumber} onChange={e => setCcNumber(e.target.value.replace(/\D/g, "").slice(0, 19))} maxLength={19} placeholder="Enter card number..." className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none font-mono tracking-widest" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 bg-neutral-950 p-5 rounded-xl border border-neutral-800 flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black ${luhnResult.valid ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-400" : "bg-red-950/60 border border-red-500/40 text-red-400"}`}>
                {luhnResult.valid ? "✓" : "✗"}
              </div>
              <div>
                <p className={`text-lg font-extrabold ${luhnResult.valid ? "text-emerald-400" : "text-red-400"}`}>{luhnResult.valid ? "Valid Card Number" : "Invalid Card Number"}</p>
                <p className="text-xs text-neutral-500">Luhn Algorithm Check</p>
              </div>
            </div>
            <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block">Card Brand</span>
              <p className="text-2xl font-bold text-cyan-400 mt-1">{luhnResult.brand}</p>
            </div>
          </div>
          <p className="text-xs text-neutral-500">⚠ For educational purposes only. This validates card number format using the Luhn algorithm — not actual bank validation.</p>
        </div>
      )}

      {/* ── 46. Strong Passphrase ── */}
      {toolSlug.includes("strong-passphrase") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Words per Passphrase: {phraseWordCount}</label>
            <input type="range" min="3" max="8" value={phraseWordCount} onChange={e => setPhraseWordCount(Number(e.target.value))} className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
          </div>
          <button onClick={generatePassphrases} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold rounded-xl flex items-center justify-center gap-2 text-sm"><RefreshCw className="w-4 h-4" /> Generate New Passphrases</button>
          <div className="space-y-2">
            {passphrases.map((p, i) => (
              <div key={i} className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl flex items-center justify-between gap-3">
                <code className="text-sm font-mono text-emerald-400">{p}</code>
                <button onClick={() => copyToClipboard(p)} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"><Copy className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-500">Passphrases are more memorable and can be more secure than complex random passwords. Example: "correct-horse-battery-staple42"</p>
        </div>
      )}

      {/* ── 47. Image Color Picker ── */}
      {toolSlug.includes("image-color-picker") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <p className="text-sm text-neutral-400">Pick any color using the color input below, or upload an image and click to sample colors.</p>
          <div className="flex flex-wrap items-start gap-6">
            <div>
              <label className="text-xs text-neutral-400 block mb-2">Color Picker</label>
              <input type="color" value={pickedColor} onChange={e => setPickedColor(e.target.value)} className="w-32 h-32 rounded-xl cursor-pointer border-0 bg-transparent" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="w-full h-20 rounded-xl border border-neutral-700" style={{ background: pickedColor }} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "HEX", val: pickedColor },
                  { label: "RGB", val: `rgb(${parseInt(pickedColor.slice(1,3),16)}, ${parseInt(pickedColor.slice(3,5),16)}, ${parseInt(pickedColor.slice(5,7),16)})` },
                  { label: "HSL", val: colorValues.hslStr },
                ].map(c => (
                  <div key={c.label} className="bg-neutral-950 border border-neutral-800 p-2 rounded-xl flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-neutral-500">{c.label}</span>
                      <p className="text-xs font-mono text-emerald-400">{c.val}</p>
                    </div>
                    <button onClick={() => copyToClipboard(c.val)} className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-400"><Copy className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 48. Favicon Generator ── */}
      {toolSlug.includes("favicon-generator") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><label className="text-xs text-neutral-400 block mb-1">Letter / Symbol</label><input type="text" maxLength={2} value={faviconText} onChange={e => setFaviconText(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg p-2.5 text-sm outline-none font-mono" /></div>
              <div><label className="text-xs text-neutral-400 block mb-1">Background Color</label><input type="color" value={faviconBg} onChange={e => setFaviconBg(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border-0 bg-transparent" /></div>
              <div><label className="text-xs text-neutral-400 block mb-1">Text Color</label><input type="color" value={faviconFg} onChange={e => setFaviconFg(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border-0 bg-transparent" /></div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                <canvas ref={faviconCanvasRef} width={64} height={64} className="w-32 h-32 rounded-xl" style={{ imageRendering: "pixelated" }} />
              </div>
              <button onClick={downloadFavicon} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold rounded-xl flex items-center gap-2 text-sm"><Download className="w-4 h-4" /> Download PNG</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Default fallback ── */}
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
       !toolSlug.includes("css-gradient") &&
       !toolSlug.includes("color-hex") &&
       !toolSlug.includes("hex-converter") &&
       !toolSlug.includes("color-converter") &&
       !toolSlug.includes("percentage") &&
       !toolSlug.includes("days-between") &&
       !toolSlug.includes("date-difference") &&
       !toolSlug.includes("unix-timestamp") &&
       !toolSlug.includes("aspect-ratio") &&
       !toolSlug.includes("html-entity") &&
       !toolSlug.includes("csv-to-json") &&
       !toolSlug.includes("json-to-csv") &&
       !toolSlug.includes("tip-calculator") &&
       !toolSlug.includes("discount") &&
       !toolSlug.includes("screen-resolution") &&
       !toolSlug.includes("user-agent") &&
       !toolSlug.includes("roman-numeral") &&
       !toolSlug.includes("random-number") &&
       !toolSlug.includes("random-choice") &&
       !toolSlug.includes("hex-to-ascii") &&
       !toolSlug.includes("morse-code") &&
       !toolSlug.includes("lorem-ipsum") &&
       !toolSlug.includes("markdown-previewer") &&
       !toolSlug.includes("markdown-table") &&
       !toolSlug.includes("html-to-markdown") &&
       !toolSlug.includes("pomodoro") &&
       !toolSlug.includes("stopwatch") &&
       !toolSlug.includes("world-clock") &&
       !toolSlug.includes("text-diff") &&
       !toolSlug.includes("duplicate") &&
       !toolSlug.includes("sql-formatter") &&
       !toolSlug.includes("regex-tester") &&
       !toolSlug.includes("credit-card") &&
       !toolSlug.includes("strong-passphrase") &&
       !toolSlug.includes("image-color-picker") &&
       !toolSlug.includes("favicon-generator") && (
        <div className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 pb-3 border-b border-neutral-800">
            <Zap className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white capitalize">{toolSlug.replace(/-/g, " ")}</h3>
              <p className="text-xs text-neutral-400">High-performance client-side interactive tool</p>
            </div>
          </div>
          <textarea rows={6} value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="Enter input data to process..." className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl p-4 text-sm text-neutral-200 outline-none font-mono" />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4" /> 100% Client-Side
            </div>
            <button onClick={() => copyToClipboard(textInput)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition">
              <Copy className="w-3.5 h-3.5" /> Copy Output
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
