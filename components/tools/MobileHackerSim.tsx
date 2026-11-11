"use client";

import React, { useState, useRef } from "react";
import { Smartphone, Play, RotateCcw, CheckCircle2, Cpu, AlertTriangle, Usb } from "lucide-react";
import { sound } from "@/lib/utils/audio";
import { UsbConnectionDetector, UsbDeviceDetails } from "./UsbConnectionDetector";

export const MobileHackerSim: React.FC = () => {
  const [deviceModel, setDeviceModel] = useState("Apple iPhone 16 Pro (A18 Pro)");
  const [isUsbConnected, setIsUsbConnected] = useState(false);
  const [usbDetails, setUsbDetails] = useState<UsbDeviceDetails | null>(null);
  const [usbBlockedAlert, setUsbBlockedAlert] = useState(false);

  const [scanType, setScanType] = useState("full-sandbox");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("Awaiting Diagnostic Trigger");
  const [logs, setLogs] = useState<string[]>([]);
  const [report, setReport] = useState<any | null>(null);

  const scanInterval = useRef<NodeJS.Timeout | null>(null);

  const devicePresets = [
    "Apple iPhone 16 Pro (A18 Pro)",
    "Samsung Galaxy S24 Ultra (Snapdragon 8 Gen 3)",
    "Google Pixel 9 Pro (Tensor G4 / Titan M2)",
    "OnePlus 12 (OxygenOS 14)",
    "Xiaomi 14 Ultra (HyperOS)",
  ];

  const handleUsbConnectionChange = (connected: boolean, details?: UsbDeviceDetails) => {
    setIsUsbConnected(connected);
    if (connected && details) {
      setUsbDetails(details);
      setUsbBlockedAlert(false);
      setLogs((prev) => [
        ...prev,
        `[USB-CONNECT] Device handshake confirmed: ${details.model} on ${details.port} (${details.speed}).`,
      ]);
    } else {
      setUsbDetails(null);
      if (isRunning) {
        handleReset();
      }
      setLogs((prev) => [
        ...prev,
        "[USB-DISCONNECT] Hardware connection severed. Pausing kernel diagnostic.",
      ]);
    }
  };

  const startScan = () => {
    if (!isUsbConnected) {
      setUsbBlockedAlert(true);
      sound.playErrorBuzz();
      return;
    }
    if (isRunning) return;
    setUsbBlockedAlert(false);
    setIsRunning(true);
    setProgress(0);
    setReport(null);
    setLogs([
      `[TARGET] Initializing sandbox integrity diagnostic via tethered USB on: ${deviceModel}`,
      `[INTERFACE] Port: ${usbDetails?.port || "USB 3.2 SuperSpeed (COM3)"} • Driver: Active`,
    ]);
    sound.playKeyClick();

    const stages = [
      { pct: 10, text: "Synchronizing USB-C Hardware Bridge & ADB Baseband...", log: "[USB-BRIDGE] High-speed serial channel negotiated." },
      { pct: 22, text: "Inspecting Application Sandbox Boundaries & Memory Isolation...", log: "[SANDBOX] Virtual memory space verified. Inter-process isolation: ACTIVE." },
      { pct: 36, text: "Auditing Kernel Memory & ASLR Entropy...", log: "[KERNEL] Address Space Layout Randomization (ASLR) entropy: 99.4%." },
      { pct: 50, text: "Interrogating Hardware Cryptographic Keystore...", log: "[CRYPTO] Secure Enclave / Titan M coprocessor handshake: SECURE." },
      { pct: 65, text: "Testing Pointer Authentication Codes (PAC) & Stack Canaries...", log: "[MITIGATION] Pointer authentication & stack protection verified." },
      { pct: 78, text: "Scanning App Manifest Permissions & Trust Anchors...", log: "[PERMISSIONS] Scanned 142 system apps. Zero unconstrained root daemons." },
      { pct: 90, text: "Compiling Device Security Report & Integrity Matrix...", log: "[FINAL] Assembling security assessment parameters." },
      { pct: 100, text: "Inspection Complete", log: "[STATUS] Security audit compiled successfully." },
    ];

    let step = 0;
    scanInterval.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (step < stages.length && next >= stages[step].pct) {
          const s = stages[step];
          setPhase(s.text);
          setLogs((l) => [...l, s.log]);
          sound.playKeyClick();
          step++;
        }
        if (next >= 100) {
          if (scanInterval.current) clearInterval(scanInterval.current);
          finishScan();
          return 100;
        }
        return next;
      });
    }, 650);
  };

  const finishScan = () => {
    setIsRunning(false);
    sound.playAccessGranted();
    setReport({
      model: deviceModel,
      sandboxScore: "99.8% (Maximum Isolation)",
      firmwareStatus: "Integrity Verified (Zero Anomalies)",
      hardwareSecurity: "Hardware-backed AES-XTS Cryptography Active",
      vulnerabilityFindings: "0 Security Flaws Detected",
      educationalTakeaway:
        "Modern mobile operating systems utilize strict application sandboxing, micro-kernel architecture, and dedicated hardware chips (like Apple's Secure Enclave or Google's Titan M2) that isolate sensitive encryption keys from operating system memory.",
    });
  };

  const handleReset = () => {
    if (scanInterval.current) clearInterval(scanInterval.current);
    setIsRunning(false);
    setProgress(0);
    setReport(null);
    setLogs([]);
    setPhase("Awaiting Diagnostic Trigger");
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* USB Connection Interface */}
      <UsbConnectionDetector
        phoneModel={deviceModel}
        onPhoneModelChange={(name) => setDeviceModel(name)}
        isConnected={isUsbConnected}
        onConnectionChange={handleUsbConnectionChange}
        toolActionLabel="Hardware Keystore & Kernel Diagnostic"
      />

      {/* USB Alert if user clicked scan without USB */}
      {usbBlockedAlert && !isUsbConnected && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500 text-red-200 text-xs font-mono flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <span className="font-bold text-red-300 block">HARDWARE DISCONNECTED:</span>
            <span>
              Connect {deviceModel} via USB cable to initialize low-level kernel memory scanning.
            </span>
          </div>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle shadow-card-cyber">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-cyber-borderSubtle/60">
          <div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-cyber-cyan" />
              Smartphone Firmware & Kernel Security Inspector
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Connect phone via USB to test virtual sandbox boundaries and cryptographic defenses.
            </p>
          </div>
          <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full border ${
            isUsbConnected
              ? "bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30"
              : "bg-red-500/10 text-red-400 border-red-500/30"
          }`}>
            {isUsbConnected ? "USB TETHER ACTIVE" : "USB REQUIRED"}
          </span>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Target Phone Model:
            </label>
            <input
              type="text"
              value={deviceModel}
              disabled={isRunning}
              onChange={(e) => setDeviceModel(e.target.value)}
              placeholder="e.g. iPhone 16 Pro, Galaxy S24..."
              className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-cyan rounded-xl py-2.5 px-4 text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyber-cyan"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {devicePresets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDeviceModel(p)}
                  disabled={isRunning}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-panel border border-cyber-borderSubtle text-slate-300 hover:text-cyber-cyan hover:border-cyber-cyan/40 transition-colors"
                >
                  {p.split(" ")[0]} {p.split(" ")[1]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Diagnostic Profile:
            </label>
            <select
              value={scanType}
              disabled={isRunning}
              onChange={(e) => setScanType(e.target.value)}
              className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-cyan rounded-xl py-2.5 px-4 text-sm font-mono text-white focus:outline-none"
            >
              <option value="full-sandbox">Full Application Sandbox & ASLR Audit</option>
              <option value="hardware-keystore">Secure Enclave & Hardware Keystore Inspection</option>
              <option value="kernel-memory">Micro-Kernel Memory Boundary Diagnostic</option>
            </select>

            <div className="flex items-end gap-2 mt-4">
              <button
                onClick={startScan}
                disabled={isRunning || !isUsbConnected}
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyber-cyan text-black font-mono font-bold text-xs flex items-center justify-center gap-2 hover:bg-cyber-cyan/90 shadow-neon-cyan/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>
                  {!isUsbConnected
                    ? "Connect USB to Scan"
                    : isRunning
                    ? "Diagnosing..."
                    : "Run Security Scan"}
                </span>
              </button>
              <button
                onClick={handleReset}
                disabled={isRunning && progress === 0}
                className="p-2.5 rounded-xl bg-cyber-panel border border-cyber-borderSubtle text-slate-300 hover:text-white"
                title="Reset Diagnostic"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar & Stage */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">{phase}</span>
            <span className="text-cyber-cyan font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-cyber-dark overflow-hidden border border-cyber-borderSubtle">
            <div
              className="h-full bg-gradient-to-r from-cyber-purple via-cyber-cyan to-cyber-green transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Diagnostic Logs */}
        <div className="p-3.5 rounded-xl bg-cyber-dark border border-cyber-borderSubtle/80 font-mono text-xs max-h-36 overflow-y-auto space-y-1">
          {logs.map((l, i) => (
            <div key={i} className="text-slate-300">
              <span className="text-cyber-cyan">❯</span> {l}
            </div>
          ))}
          {logs.length === 0 && (
            <span className="text-cyber-muted">Diagnostic daemon idle. Choose phone and click &apos;Run Security Scan&apos;.</span>
          )}
        </div>
      </div>

      {/* Report Result */}
      {report && (
        <div className="p-6 rounded-2xl bg-cyber-panel border-2 border-cyber-cyan/50 shadow-neon-cyan/20 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyber-cyan/20 border border-cyber-cyan flex items-center justify-center text-cyber-cyan">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-cyber-cyan font-bold tracking-wider">
                DIAGNOSTIC REPORT COMPLETE
              </div>
              <h4 className="text-lg font-bold text-white font-mono">
                {report.model}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-xs font-mono mb-4">
            <div>
              <span className="text-cyber-muted block">Sandbox Integrity:</span>
              <span className="text-cyber-green font-bold">{report.sandboxScore}</span>
            </div>
            <div>
              <span className="text-cyber-muted block">Firmware Integrity:</span>
              <span className="text-white font-bold">{report.firmwareStatus}</span>
            </div>
            <div>
              <span className="text-cyber-muted block">Keystore Hardware:</span>
              <span className="text-cyber-cyan">{report.hardwareSecurity}</span>
            </div>
            <div>
              <span className="text-cyber-muted block">Vulnerability Assessment:</span>
              <span className="text-slate-200">{report.vulnerabilityFindings}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyber-dark/80 border border-cyber-borderSubtle text-xs text-slate-300 flex items-start gap-2.5">
            <Cpu className="w-4 h-4 text-cyber-cyan flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Technical Architecture:</strong> {report.educationalTakeaway}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
