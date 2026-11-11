"use client";

import React, { useState, useId } from "react";
import {
  Smartphone,
  CheckCircle2,
  Zap,
  Radio,
  CreditCard,
  Download,
  RotateCcw,
  Search,
  Filter,
  Check,
  Globe2,
  Tv,
  Infinity as InfinityIcon,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface PlanItem {
  id: string;
  price: number;
  validity: string;
  data: string;
  calls: string;
  sms: string;
  category: "popular" | "5g" | "data" | "annual" | "ott";
  tag?: string;
  description: string;
  ottPerks?: string[];
}

const PROVIDERS = [
  {
    id: "jio",
    name: "Jio",
    fullName: "Reliance Jio Infocomm",
    color: "from-blue-600 to-cyan-500",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    network: "True 5G Standalone",
  },
  {
    id: "airtel",
    name: "Airtel",
    fullName: "Bharti Airtel 5G Plus",
    color: "from-red-600 to-rose-500",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    network: "5G Plus NSA",
  },
  {
    id: "vi",
    name: "Vi",
    fullName: "Vodafone Idea Hero",
    color: "from-amber-600 to-yellow-500",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    network: "GIGAnet 4G/5G",
  },
  {
    id: "bsnl",
    name: "BSNL",
    fullName: "Bharat Sanchar Nigam Ltd",
    color: "from-emerald-600 to-teal-500",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    network: "4G Bharat Network",
  },
];

const CIRCLES = [
  "West Bengal",
  "Kolkata",
  "Delhi NCR",
  "Mumbai",
  "Maharashtra & Goa",
  "Karnataka (Bangalore)",
  "Tamil Nadu & Chennai",
  "Andhra Pradesh & Telangana",
  "Gujarat",
  "Uttar Pradesh (East)",
  "Uttar Pradesh (West)",
  "Bihar & Jharkhand",
  "Rajasthan",
  "Punjab & Haryana",
  "Kerala",
  "Madhya Pradesh & CG",
  "Assam & North East",
];

const REAL_PLANS_DATA: Record<string, PlanItem[]> = {
  jio: [
    {
      id: "jio-349",
      price: 349,
      validity: "28 Days",
      data: "2 GB/Day + Unlimited True 5G",
      calls: "Unlimited Domestic Calls",
      sms: "100 SMS/Day",
      category: "5g",
      tag: "TRUE 5G ENTRY",
      description: "Fastest entry-level True 5G plan with uncapped 5G data speed.",
      ottPerks: ["JioTV", "JioCinema", "JioCloud"],
    },
    {
      id: "jio-299",
      price: 299,
      validity: "28 Days",
      data: "1.5 GB/Day (42 GB Total)",
      calls: "Unlimited Calls",
      sms: "100 SMS/Day",
      category: "popular",
      tag: "BESTSELLER",
      description: "Standard daily driver value pack for everyday streaming and voice.",
      ottPerks: ["JioTV", "JioCinema"],
    },
    {
      id: "jio-859",
      price: 859,
      validity: "84 Days",
      data: "2 GB/Day + Unlimited True 5G",
      calls: "Unlimited Calls Across India",
      sms: "100 SMS/Day",
      category: "5g",
      tag: "MOST POPULAR",
      description: "Quarterly uninterrupted connectivity with unlimited True 5G data.",
      ottPerks: ["JioHotstar Mobile (3 Mos)", "JioTV", "JioAI Cloud"],
    },
    {
      id: "jio-1199",
      price: 1199,
      validity: "84 Days",
      data: "3 GB/Day + Unlimited True 5G",
      calls: "Unlimited Calls",
      sms: "100 SMS/Day",
      category: "ott",
      tag: "POWER STREAMER",
      description: "Maximum bandwidth plan with complete premium entertainment suite.",
      ottPerks: ["Netflix Basic", "JioHotstar", "JioCinema Premium"],
    },
    {
      id: "jio-3599",
      price: 3599,
      validity: "365 Days",
      data: "2.5 GB/Day + Unlimited True 5G",
      calls: "Unlimited Calls for 1 Full Year",
      sms: "100 SMS/Day",
      category: "annual",
      tag: "ANNUAL SAVER",
      description: "Zero recharge hassle for 365 days with premium high-speed 5G allowance.",
      ottPerks: ["JioTV", "JioCinema", "JioCloud Storage 100GB"],
    },
    {
      id: "jio-19",
      price: 19,
      validity: "Existing Plan Validity",
      data: "1.5 GB High-Speed Data",
      calls: "NA (Data Only)",
      sms: "NA",
      category: "data",
      tag: "INSTANT BOOSTER",
      description: "Emergency high-speed top-up when daily data threshold is reached.",
    },
    {
      id: "jio-69",
      price: 69,
      validity: "Existing Plan Validity",
      data: "6 GB High-Speed Data",
      calls: "NA (Data Only)",
      sms: "NA",
      category: "data",
      tag: "WEEKEND PACK",
      description: "Instant data booster for high-resolution video streaming and downloads.",
    },
  ],
  airtel: [
    {
      id: "airtel-349",
      price: 349,
      validity: "28 Days",
      data: "1.5 GB/Day + Unlimited 5G Data",
      calls: "Unlimited Local & STD",
      sms: "100 SMS/Day",
      category: "5g",
      tag: "5G BESTSELLER",
      description: "Airtel 5G Plus entry pack with unlimited 5G in covered zones.",
      ottPerks: ["Airtel Thanks Rewards", "Wynk Music", "Apollo 24|7"],
    },
    {
      id: "airtel-379",
      price: 379,
      validity: "1 Calendar Month",
      data: "2 GB/Day + Unlimited 5G",
      calls: "Unlimited Roaming & STD",
      sms: "100 SMS/Day",
      category: "popular",
      tag: "CALENDAR MONTH",
      description: "Exact monthly renewal with high daily data and spam protection filter.",
      ottPerks: ["Adobe Express Premium", "Airtel Thanks"],
    },
    {
      id: "airtel-979",
      price: 979,
      validity: "84 Days",
      data: "2 GB/Day + Unlimited 5G Data",
      calls: "Unlimited Voice Nationwide",
      sms: "100 SMS/Day",
      category: "5g",
      tag: "TOP QUARTERLY",
      description: "84 days reliable high-speed data with Airtel True 5G connectivity.",
      ottPerks: ["Airtel Xstream Play 22+ OTTs", "Wynk Music Free"],
    },
    {
      id: "airtel-1199",
      price: 1199,
      validity: "84 Days",
      data: "2.5 GB/Day + Unlimited 5G",
      calls: "Unlimited Voice",
      sms: "100 SMS/Day",
      category: "ott",
      tag: "ENTERTAINMENT PRO",
      description: "Includes bundled streaming licenses with top OTT providers.",
      ottPerks: ["Disney+ Hotstar 3 Mos", "SonyLIV", "Airtel Xstream"],
    },
    {
      id: "airtel-3599",
      price: 3599,
      validity: "365 Days",
      data: "2 GB/Day (730 GB Total) + Unlimited 5G",
      calls: "Unlimited Calling 365 Days",
      sms: "100 SMS/Day",
      category: "annual",
      tag: "ANNUAL VIP",
      description: "Airtel's top annual flagship pack with 1-year unlimited data warranty.",
      ottPerks: ["Apollo 24|7 Circle (1 Year)", "Wynk Music", "Free Hellotunes"],
    },
    {
      id: "airtel-33",
      price: 33,
      validity: "1 Day Validity",
      data: "2 GB High-Speed Data",
      calls: "NA",
      sms: "NA",
      category: "data",
      tag: "DAY BOOSTER",
      description: "Instant data top-up for heavy downloads or software updates.",
    },
  ],
  vi: [
    {
      id: "vi-349",
      price: 349,
      validity: "28 Days",
      data: "1.5 GB/Day + Binge All Night",
      calls: "Unlimited Calls",
      sms: "100 SMS/Day",
      category: "popular",
      tag: "HERO UNLIMITED",
      description: "Free unlimited data between 12 AM to 6 AM with Weekend Data Rollover.",
      ottPerks: ["Vi Movies & TV", "Weekend Data Rollover"],
    },
    {
      id: "vi-479",
      price: 479,
      validity: "48 Days",
      data: "1.5 GB/Day + Night Unlimited",
      calls: "Unlimited Calls",
      sms: "100 SMS/Day",
      category: "popular",
      tag: "EXTENDED MONTH",
      description: "Nearly two months of uninterrupted high-speed internet and calling.",
      ottPerks: ["Vi Data Delight 2GB extra/month"],
    },
    {
      id: "vi-859",
      price: 859,
      validity: "84 Days",
      data: "1.5 GB/Day + Weekend Rollover",
      calls: "Unlimited Voice",
      sms: "100 SMS/Day",
      category: "5g",
      tag: "VALUE LEADER",
      description: "Quarterly Hero pack with nighttime unmetered data usage.",
      ottPerks: ["Vi Movies & TV", "Binge All Night"],
    },
    {
      id: "vi-3199",
      price: 3199,
      validity: "365 Days",
      data: "2 GB/Day + Binge All Night (12AM-6AM)",
      calls: "Unlimited Voice 365 Days",
      sms: "100 SMS/Day",
      category: "annual",
      tag: "ANNUAL SAVER",
      description: "Cost-effective annual pack with nighttime unmetered browsing.",
      ottPerks: ["Disney+ Hotstar 1 Year Mobile", "Vi Movies & TV VIP"],
    },
    {
      id: "vi-49",
      price: 49,
      validity: "Existing Pack",
      data: "6 GB High-Speed Data",
      calls: "NA",
      sms: "NA",
      category: "data",
      tag: "DATA BURST",
      description: "Instant bulk data add-on with zero calling limits.",
    },
  ],
  bsnl: [
    {
      id: "bsnl-107",
      price: 107,
      validity: "35 Days",
      data: "3 GB Total Data",
      calls: "200 Free Voice Minutes",
      sms: "Standard Rates",
      category: "popular",
      tag: "SIM RETENTION",
      description: "Most affordable active-SIM validity extender in Indian telecom.",
      ottPerks: ["BSNL Tunes 35 Days"],
    },
    {
      id: "bsnl-197",
      price: 197,
      validity: "70 Days",
      data: "2 GB/Day for initial 18 days",
      calls: "Unlimited Voice for initial 18 days",
      sms: "100 SMS/Day",
      category: "popular",
      tag: "MAX VALIDITY",
      description: "Keep SIM active for 70 days at unmatched economical rate.",
    },
    {
      id: "bsnl-397",
      price: 397,
      validity: "150 Days (5 Months)",
      data: "2 GB/Day for 30 Days",
      calls: "Unlimited Voice for 30 Days",
      sms: "100 SMS/Day",
      category: "annual",
      tag: "5 MONTH PACK",
      description: "Half-year secondary SIM maintenance with zero recurring charges.",
    },
    {
      id: "bsnl-1999",
      price: 1999,
      validity: "365 Days",
      data: "600 GB Lump-Sum Data",
      calls: "Unlimited Voice for 1 Year",
      sms: "100 SMS/Day",
      category: "annual",
      tag: "ANNUAL VALUE",
      description: "No daily data throttling limit — use 600 GB anytime over 365 days.",
      ottPerks: ["Eros Now Entertainment 365 Days"],
    },
    {
      id: "bsnl-2399",
      price: 2399,
      validity: "395 Days (13 Months!)",
      data: "2 GB/Day (790 GB Total)",
      calls: "Unlimited Voice 395 Days",
      sms: "100 SMS/Day",
      category: "annual",
      tag: "13 MONTHS PACK",
      description: "Longest validity telecom pack in India with daily 2GB data.",
      ottPerks: ["Hardy Games", "Lokdhun Content"],
    },
  ],
};

export const MobileRechargeSim: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("jio");
  const [selectedCircle, setSelectedCircle] = useState("West Bengal");
  const [activeTab, setActiveTab] = useState<"all" | "popular" | "5g" | "data" | "annual" | "ott">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Transaction checkout modal state
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const mobileInputId = useId();
  const operatorSelectId = useId();
  const circleSelectId = useId();
  const searchInputId = useId();

  // Auto-detect provider prefix heuristics
  const handleMobileChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(cleaned);

    if (cleaned.length >= 4) {
      const prefix = cleaned.slice(0, 2);
      if (["98", "99", "97", "88", "81"].includes(prefix)) {
        // Common airtel prefix range
        setSelectedProvider("airtel");
      } else if (["70", "79", "63", "84", "89"].includes(prefix)) {
        // Common jio prefix range
        setSelectedProvider("jio");
      } else if (["90", "91", "92", "93"].includes(prefix)) {
        // Common vi prefix range
        setSelectedProvider("vi");
      } else if (["94", "85"].includes(prefix)) {
        // Common bsnl prefix range
        setSelectedProvider("bsnl");
      }
    }
  };

  const currentProviderMeta = PROVIDERS.find((p) => p.id === selectedProvider) || PROVIDERS[0];
  const allProviderPlans = REAL_PLANS_DATA[selectedProvider] || [];

  const filteredPlans = allProviderPlans.filter((p) => {
    const matchesTab = activeTab === "all" || p.category === activeTab;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.price.toString().includes(searchQuery) ||
      p.validity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.data.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleInitiateRecharge = (plan: PlanItem) => {
    setSelectedPlan(plan);
    setIsProcessing(false);
    setProgressStep(0);
    setTransactionSuccess(false);
    setTransactionId(`TXN-DD-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setProgressStep(1);

    // Sequence simulation steps
    setTimeout(() => {
      setProgressStep(2);
    }, 1200);

    setTimeout(() => {
      setProgressStep(3);
    }, 2400);

    setTimeout(() => {
      setProgressStep(4);
      setIsProcessing(false);
      setTransactionSuccess(true);
    }, 3600);
  };

  const handleDownloadReceipt = () => {
    if (!selectedPlan) return;
    const receiptText = `
========================================
       DEVDROP TELECOM GATEWAY RECEIPT
========================================
Transaction ID  : ${transactionId}
Date & Time     : ${new Date().toLocaleString()}
Status          : SUCCESSFUL / APPROVED

CUSTOMER DETAILS
Mobile Number   : +91 ${mobileNumber || "9876543210"}
Operator        : ${currentProviderMeta.fullName}
Telecom Circle  : ${selectedCircle}
Network Standard: ${currentProviderMeta.network}

PLAN BENEFITS PURCHASED
Pack Price      : ₹${selectedPlan.price}.00 (Incl. of All GST & Taxes)
Validity Period : ${selectedPlan.validity}
Data Quota      : ${selectedPlan.data}
Calling Benefit : ${selectedPlan.calls}
SMS Allowance   : ${selectedPlan.sms}
Entertainment   : ${selectedPlan.ottPerks ? selectedPlan.ottPerks.join(", ") : "Standard Access"}

HLR Signaling Token: HLR-SIG-${Math.random().toString(36).substring(2, 10).toUpperCase()}
Bank Auth Code     : APPR-RBI-GATEWAY-2026-OK
========================================
Thank you for using DevDrop Fast Portal!
    `.trim();

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DevDrop_Recharge_${transactionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-cyber-card/60 border border-cyber-border rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Decorative background grid and glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-green/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header telemetry badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-cyber-borderSubtle">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-green/10 border border-cyber-green/30 text-cyber-green">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              Instant Mobile Recharge Portal
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-green/20 text-cyber-green border border-cyber-green/30 font-sans font-semibold">
                Live 2026 Tariffs
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-cyber-muted font-mono mt-0.5">
              Real-time telecom billing gateway, HLR signaling emulator & genuine prepaid packs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-cyber-muted bg-cyber-dark/80 px-3 py-1.5 rounded-lg border border-cyber-borderSubtle">
          <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
          <span>Gateway: 100% Online</span>
        </div>
      </div>

      {/* Input Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        {/* Mobile Number Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={mobileInputId} className="text-xs font-mono font-medium text-cyber-muted uppercase tracking-wider flex items-center justify-between">
            <span>Mobile Number</span>
            <span className="text-[10px] text-cyber-cyan font-semibold">Auto-Operator Detection</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyber-muted font-mono text-sm">
              +91
            </div>
            <input
              id={mobileInputId}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit number"
              value={mobileNumber}
              onChange={(e) => handleMobileChange(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-cyber-dark/80 border border-cyber-borderSubtle rounded-xl text-white font-mono text-sm placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all"
            />
            {mobileNumber.length === 10 && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-cyber-green">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Operator Selector */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={operatorSelectId} className="text-xs font-mono font-medium text-cyber-muted uppercase tracking-wider">
            Telecom Operator
          </label>
          <div className="relative">
            <select
              id={operatorSelectId}
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-4 py-2.5 bg-cyber-dark/80 border border-cyber-borderSubtle rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all appearance-none cursor-pointer"
            >
              {PROVIDERS.map((prov) => (
                <option key={prov.id} value={prov.id} className="bg-cyber-dark text-white">
                  {prov.name} — {prov.fullName}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-cyber-muted">
              ▼
            </div>
          </div>
        </div>

        {/* Telecom Circle Selector */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={circleSelectId} className="text-xs font-mono font-medium text-cyber-muted uppercase tracking-wider">
            Telecom Circle / State
          </label>
          <div className="relative">
            <select
              id={circleSelectId}
              value={selectedCircle}
              onChange={(e) => setSelectedCircle(e.target.value)}
              className="w-full px-4 py-2.5 bg-cyber-dark/80 border border-cyber-borderSubtle rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all appearance-none cursor-pointer"
            >
              {CIRCLES.map((c) => (
                <option key={c} value={c} className="bg-cyber-dark text-white">
                  {c}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-cyber-muted">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Operator Quick Switch Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-2 rounded-xl bg-cyber-dark/60 border border-cyber-borderSubtle">
        <span className="text-xs font-mono text-cyber-muted px-2">Provider:</span>
        {PROVIDERS.map((prov) => {
          const isSelected = selectedProvider === prov.id;
          return (
            <button
              key={prov.id}
              onClick={() => setSelectedProvider(prov.id)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-2 transition-all ${
                isSelected
                  ? `bg-gradient-to-r ${prov.color} text-white shadow-lg shadow-cyber-green/10 border border-white/20`
                  : "bg-cyber-card/40 text-cyber-muted hover:text-white border border-transparent hover:border-cyber-borderSubtle"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : "bg-cyber-muted"}`} />
              {prov.name}
            </button>
          );
        })}

        <div className="ml-auto hidden sm:flex items-center gap-2 text-xs font-mono text-cyber-cyan">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{currentProviderMeta.network} Active</span>
        </div>
      </div>

      {/* Plan Search & Category Filter Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Plans" },
            { id: "5g", label: "Unlimited 5G", icon: InfinityIcon },
            { id: "popular", label: "Popular", icon: Zap },
            { id: "data", label: "Data Boosters" },
            { id: "annual", label: "Annual Packs", icon: Globe2 },
            { id: "ott", label: "OTT & Movies", icon: Tv },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 font-semibold"
                    : "text-cyber-muted hover:text-white hover:bg-cyber-card/40 border border-transparent"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Plan Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-cyber-muted" />
          <input
            id={searchInputId}
            type="text"
            placeholder="Search price, data or OTT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-cyber-dark/80 border border-cyber-borderSubtle rounded-lg text-xs font-mono text-white placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-cyan"
          />
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-cyber-dark/90 border border-cyber-borderSubtle hover:border-cyber-cyan/50 rounded-xl p-4 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-cyber-cyan/5 relative overflow-hidden"
            >
              {plan.tag && (
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyber-green/10 text-cyber-green border border-cyber-green/30 tracking-wider">
                  {plan.tag}
                </div>
              )}

              <div>
                {/* Price & Validity */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                    ₹{plan.price}
                  </span>
                  <span className="text-xs font-mono text-cyber-muted">/ {plan.validity}</span>
                </div>

                {/* Key Benefits */}
                <div className="space-y-1.5 my-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-cyber-cyan font-semibold">
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span>{plan.data}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Smartphone className="w-3.5 h-3.5 shrink-0 text-cyber-muted" />
                    <span>{plan.calls}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-cyber-muted" />
                    <span>{plan.sms}</span>
                  </div>
                </div>

                <p className="text-[11px] text-cyber-muted font-sans leading-relaxed my-2">
                  {plan.description}
                </p>

                {/* OTT perks badges */}
                {plan.ottPerks && plan.ottPerks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 my-3 pt-2 border-t border-cyber-borderSubtle/60">
                    {plan.ottPerks.map((perk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-card border border-cyber-borderSubtle text-cyber-green"
                      >
                        ✓ {perk}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleInitiateRecharge(plan)}
                className="w-full mt-3 py-2 px-4 rounded-lg bg-cyber-green/10 hover:bg-cyber-green text-cyber-green hover:text-black font-mono font-bold text-xs uppercase tracking-wider border border-cyber-green/30 hover:border-cyber-green transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Recharge ₹{plan.price}</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center font-mono text-sm text-cyber-muted">
            No matching prepaid recharge plans found for this filter.
          </div>
        )}
      </div>

      {/* Checkout & Simulated Payment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-2xl relative text-left overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-cyber-borderSubtle">
              <div>
                <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                  Fast Telecom Checkout
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
                    256-Bit SSL
                  </span>
                </h3>
                <p className="text-xs font-mono text-cyber-muted mt-0.5">
                  Order ID: {transactionId}
                </p>
              </div>

              {!isProcessing && (
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-cyber-muted hover:text-white font-mono text-lg px-2"
                >
                  ✕
                </button>
              )}
            </div>

            {!transactionSuccess ? (
              <div className="space-y-4 my-4">
                {/* Plan Summary Card */}
                <div className="p-3.5 rounded-xl bg-cyber-dark/80 border border-cyber-borderSubtle flex items-center justify-between font-mono text-xs">
                  <div>
                    <div className="text-white font-bold text-sm">
                      +91 {mobileNumber || "9876543210"}
                    </div>
                    <div className="text-cyber-muted text-[11px] mt-0.5">
                      {currentProviderMeta.name} • {selectedCircle}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyber-green font-extrabold text-xl">
                      ₹{selectedPlan.price}
                    </div>
                    <div className="text-[10px] text-cyber-muted">{selectedPlan.validity}</div>
                  </div>
                </div>

                {/* Plan Details preview */}
                <div className="text-xs font-mono text-slate-300 space-y-1 bg-cyber-dark/40 p-3 rounded-lg border border-cyber-borderSubtle/40">
                  <div className="text-cyber-cyan">⚡ Benefits: {selectedPlan.data}</div>
                  <div>📞 Voice: {selectedPlan.calls}</div>
                  <div>💬 SMS: {selectedPlan.sms}</div>
                  {selectedPlan.ottPerks && (
                    <div className="text-cyber-green text-[11px]">
                      🎁 OTT: {selectedPlan.ottPerks.join(", ")}
                    </div>
                  )}
                </div>

                {/* Payment Option Selector */}
                {!isProcessing && (
                  <div>
                    <label className="text-xs font-mono text-cyber-muted uppercase tracking-wider block mb-2">
                      Select Payment Gateway
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "upi", label: "Instant UPI (GPay/PhonePe)" },
                        { id: "card", label: "Debit / Credit Card" },
                        { id: "netbanking", label: "Net Banking" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id)}
                          className={`p-2.5 rounded-xl font-mono text-xs text-center border transition-all ${
                            paymentMethod === m.id
                              ? "bg-cyber-cyan/20 border-cyber-cyan text-white font-bold"
                              : "bg-cyber-dark border-cyber-borderSubtle text-cyber-muted hover:text-white"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Processing Steps Animation */}
                {isProcessing && (
                  <div className="p-4 rounded-xl bg-black border border-cyber-borderSubtle font-mono text-xs space-y-2">
                    <div className="text-cyber-green flex items-center gap-2 font-bold animate-pulse">
                      <Radio className="w-4 h-4 animate-spin" />
                      <span>Transacting with Telecom Core Gateway...</span>
                    </div>

                    <div className="space-y-1 text-[11px] text-cyber-muted pt-2 border-t border-cyber-borderSubtle/40">
                      <div className={progressStep >= 1 ? "text-cyber-cyan" : "opacity-40"}>
                        {progressStep >= 1 ? "✔" : "○"} Step 1: Encrypting payment token via RBI payment rail...
                      </div>
                      <div className={progressStep >= 2 ? "text-cyber-cyan" : "opacity-40"}>
                        {progressStep >= 2 ? "✔" : "○"} Step 2: Querying {currentProviderMeta.name} HLR signaling server...
                      </div>
                      <div className={progressStep >= 3 ? "text-cyber-cyan" : "opacity-40"}>
                        {progressStep >= 3 ? "✔" : "○"} Step 3: Quota verified: Allocating {selectedPlan.data}...
                      </div>
                      <div className={progressStep >= 4 ? "text-cyber-green font-bold" : "opacity-40"}>
                        {progressStep >= 4 ? "✔" : "○"} Step 4: Auth Confirmed! Dispatching confirmation SMS...
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {!isProcessing && (
                  <button
                    onClick={handleConfirmPayment}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyber-green to-emerald-500 text-black font-mono font-extrabold text-sm uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-cyber-green/20 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{selectedPlan.price} & Activate Pack</span>
                  </button>
                )}
              </div>
            ) : (
              /* Success Screen */
              <div className="my-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-cyber-green/20 border-2 border-cyber-green text-cyber-green flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="text-xl font-bold font-mono text-white">
                    Recharge Successful!
                  </h4>
                  <p className="text-xs font-mono text-cyber-green mt-1">
                    Pack of ₹{selectedPlan.price} successfully credited to +91 {mobileNumber || "9876543210"}
                  </p>
                </div>

                {/* Simulated SMS Notification banner */}
                <div className="p-3 bg-cyber-dark/90 rounded-xl border border-cyber-green/40 text-left font-mono text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-cyber-muted">
                    <span>SMS FROM: {currentProviderMeta.name.toUpperCase()}-ALERT</span>
                    <span>Just Now</span>
                  </div>
                  <p className="text-white text-[11px] leading-relaxed">
                    Dear Customer, Recharge of ₹{selectedPlan.price} is successful on your number. Benefits: {selectedPlan.data}, {selectedPlan.calls}, validity: {selectedPlan.validity}. Ref: {transactionId}.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={handleDownloadReceipt}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-cyber-cyan/10 hover:bg-cyber-cyan text-cyber-cyan hover:text-black font-mono font-bold text-xs border border-cyber-cyan/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Receipt</span>
                  </button>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-cyber-card hover:bg-cyber-dark text-white font-mono font-bold text-xs border border-cyber-borderSubtle transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Recharge Another</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
