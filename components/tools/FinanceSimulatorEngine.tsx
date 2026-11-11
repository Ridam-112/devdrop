"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  DollarSign,
  Coins,
  CreditCard,
  TrendingUp,
  Play,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Zap,
  Terminal,
  Receipt,
  QrCode,
  Building2,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { sound } from "@/lib/utils/audio";

interface FinanceSimulatorEngineProps {
  toolSlug: string;
}

export const FinanceSimulatorEngine: React.FC<FinanceSimulatorEngineProps> = ({ toolSlug }) => {
  const isUpi = toolSlug.includes("upi");
  const isMining = toolSlug.includes("mining");
  const isAtm = toolSlug.includes("atm");
  const isTrading = toolSlug.includes("trading");
  const isBalance = toolSlug.includes("balance") || toolSlug.includes("millionaire");

  // Custom states
  const [payeeName, setPayeeName] = useState(isUpi ? "Rohan Sharma" : "Cyber Holdings Ltd.");
  const [amount, setAmount] = useState(isUpi ? "15,000" : isBalance ? "2,450,000" : "50,000");
  const [bankName, setBankName] = useState("HDFC Bank");
  const [upiApp, setUpiApp] = useState("Google Pay");

  // Mining states
  const [hashRate, setHashRate] = useState(142.5);
  const [minedBtc, setMinedBtc] = useState(0.00428);

  // Trading simulator states
  const [leverage, setLeverage] = useState("50x");
  const [pnl, setPnl] = useState(1480.5);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string) => {
    const time = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const handleStart = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setProgress(0);
    setLogs([]);
    setIsCompleted(false);
    sound.playKeyClick();

    addLog(`INITIALIZING FINANCIAL PROTOCOL HANDSHAKE...`);
    addLog(`TRANSACTION PARAMETERS: Amount=${amount} | Beneficiary=${payeeName}`);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next === 15) {
          if (isUpi) {
            setCurrentStep("Connecting to Banking Gateway Immediate Payment Service...");
            addLog("Encrypted VPA routed through payment switch. Token verified.");
            sound.playKeyClick();
          } else if (isMining) {
            setCurrentStep("Broadcasting Nonce to SHA-256 Mining Pool...");
            addLog("Found Block hash candidate: 00000000000000000001a4f... computing proof-of-work.");
            sound.playKeyClick();
          } else if (isAtm) {
            setCurrentStep("Sending XFS Hardware Dispenser Signal...");
            addLog("Cassette 1 ($100 bills): Solenoid check. Dispenser mechanism ready.");
            sound.playKeyClick();
          } else {
            setCurrentStep("Validating Ledger Balances on ISO 20022 Network...");
            addLog("Clearinghouse response received: Status OK.");
            sound.playKeyClick();
          }
        } else if (next === 40) {
          if (isUpi) {
            setCurrentStep("Interrogating UPI 2.0 Encrypted QR & Merchant Metadata...");
            addLog("Dual-factor cryptogram validated against central switch.");
            sound.playKeyClick();
          } else if (isMining) {
            setCurrentStep("Calculating Hashrate (94.2 TH/s) & Difficulty Target...");
            addLog("Mempool transactions packed into candidate block header.");
            sound.playKeyClick();
          } else {
            setCurrentStep("Verifying Counterparty Clearinghouse Settlement Matrix...");
            addLog("Real-Time Gross Settlement (RTGS) queue slot booked.");
            sound.playKeyClick();
          }
        } else if (next === 68) {
          setCurrentStep("Generating Cryptographic Transaction Stamp & UTR...");
          addLog("Signed with ECDSA secp256k1 certificate.");
          sound.playCoinChime();
        } else if (next === 88) {
          setCurrentStep("Finalizing Ledger State & Digital Receipt Generation...");
          addLog("Unique transaction reference (UTR) immutable hash committed.");
          sound.playKeyClick();
        } else if (next >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsCompleted(true);
          setCurrentStep("Transaction Diagnostic Finalized");
          addLog("PAYMENT DEMONSTRATION SUCCESSFUL — Preview Rendered.");
          sound.playAccessGranted();
          return 100;
        }
        return next;
      });
    }, 650);
  };

  const handleReset = () => {
    setIsProcessing(false);
    setProgress(0);
    setCurrentStep("");
    setLogs([]);
    setIsCompleted(false);
    sound.playKeyClick();
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-2xl p-4 sm:p-6 shadow-card-cyber space-y-6">
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyber-borderSubtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
              Financial Protocol & Ledger Simulator
            </h2>
            <p className="text-xs text-cyber-muted font-mono">
              Status: {isProcessing ? "PROCESSING LEDGER..." : isCompleted ? "AUTHORIZED" : "STANDBY"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-lg bg-cyber-panel border border-cyber-borderSubtle text-cyber-muted hover:text-white transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyber-green" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">
            {isUpi ? "Payee Name / VPA" : "Account Holder / Merchant"}
          </label>
          <input
            type="text"
            value={payeeName}
            onChange={(e) => setPayeeName(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl p-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-green disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">
            Target Amount ({isUpi ? "INR ₹" : "USD $"})
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl p-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-green disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">
            {isUpi ? "UPI Application Theme" : "Bank / Issuer"}
          </label>
          {isUpi ? (
            <select
              value={upiApp}
              onChange={(e) => setUpiApp(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyber-green disabled:opacity-50"
            >
              <option value="Google Pay">Google Pay (GPay Style)</option>
              <option value="PhonePe">PhonePe Style</option>
              <option value="Paytm">Paytm Payments Bank Style</option>
            </select>
          ) : (
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyber-green disabled:opacity-50"
            >
              <option value="HDFC Bank">HDFC Bank</option>
              <option value="State Bank of India">State Bank of India</option>
              <option value="Chase Bank">JPMorgan Chase</option>
              <option value="Barclays">Barclays Global</option>
            </select>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleStart}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-green text-black font-bold font-mono text-sm tracking-wide hover:bg-cyber-green/90 transition-all disabled:opacity-50 shadow-neon-green"
        >
          {isProcessing ? (
            <>
              <Zap className="w-4 h-4 animate-spin" />
              <span>ROUTING SETTLEMENT...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>GENERATE TRANSACTION SLIP</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-cyber-panel border border-cyber-borderSubtle text-slate-300 font-mono text-sm hover:text-white transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="space-y-2 p-4 bg-cyber-dark/80 rounded-xl border border-cyber-borderSubtle">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-cyber-green flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
              {currentStep || "Connecting to payment gateway..."}
            </span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-cyber-panel rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-cyber-green to-cyber-cyan transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Realistic Receipt / UPI Screen on Complete */}
      {isCompleted && (
        <div className="max-w-md mx-auto p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/60 shadow-2xl space-y-5 text-center text-white">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-neon-green">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              {isUpi ? `${upiApp} Payment Successful` : "Payment Receipt Verified"}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono mt-1 text-white">
              {isUpi ? `₹${amount}` : `$${amount}`}
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">Paid to {payeeName}</div>
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-4 text-xs font-mono space-y-2.5 text-left border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">UTR Reference No:</span>
              <span className="text-emerald-400 font-bold select-all">429188402194</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Debited From:</span>
              <span className="text-white font-bold">{bankName} (•••• 4920)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Timestamp:</span>
              <span className="text-white">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transaction Status:</span>
              <span className="text-emerald-400 font-bold">SUCCESS (CONFIRMED)</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                const receiptText = `===============================\nPAYMENT CONFIRMATION SLIP\n===============================\nAmount: ${isUpi ? "₹" : "$"}${amount}\nPaid To: ${payeeName}\nChannel: ${isUpi ? upiApp : bankName}\nUTR Ref: 429188402194\nTimestamp: ${new Date().toLocaleString()}\nStatus: SUCCESS (CONFIRMED)\n===============================`;
                navigator.clipboard.writeText(receiptText);
                sound.playKeyClick();
                alert("Receipt copied to clipboard!");
              }}
              type="button"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs transition-colors"
            >
              Copy Receipt Slip
            </button>
            <button
              onClick={() => {
                window.print();
              }}
              type="button"
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs transition-colors"
            >
              Print / Save PDF
            </button>
          </div>
        </div>
      )}

      {/* Terminal Real-time Console */}
      <div className="rounded-xl bg-black border border-cyber-borderSubtle overflow-hidden">
        <div className="bg-cyber-panel px-4 py-2 border-b border-cyber-borderSubtle flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyber-green">
            <Terminal className="w-3.5 h-3.5" />
            <span>fintech-settlement-core-v2</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">GATEWAY: ISO_20022</span>
        </div>
        <div ref={logsContainerRef} className="p-4 font-mono text-xs text-cyber-green/90 h-32 overflow-y-auto space-y-1 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-slate-500 italic">Configure amount and beneficiary to simulate transaction clearance.</div>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
};
