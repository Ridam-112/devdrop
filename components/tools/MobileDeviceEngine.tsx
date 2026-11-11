"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Smartphone,
  Lock,
  Unlock,
  Fingerprint,
  Camera,
  Play,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Eye,
  ShieldAlert,
  Zap,
  Terminal,
  Search,
  HardDrive,
  FileImage,
  Sparkles,
  AlertTriangle,
  Usb,
} from "lucide-react";
import { sound } from "@/lib/utils/audio";
import { UsbConnectionDetector, UsbDeviceDetails } from "./UsbConnectionDetector";

interface MobileDeviceEngineProps {
  toolSlug: string;
}

export const MobileDeviceEngine: React.FC<MobileDeviceEngineProps> = ({ toolSlug }) => {
  const isPattern = toolSlug.includes("android");
  const isFingerprint = toolSlug.includes("fingerprint");
  const isFaceId = toolSlug.includes("face-id");
  const isRecovery = toolSlug.includes("recovery") || toolSlug.includes("photo");
  const isSpyCam = toolSlug.includes("spy-camera");
  const isVirusScan = toolSlug.includes("virus");

  const [deviceModel, setDeviceModel] = useState("Samsung Galaxy S24 Ultra");
  const [isUsbConnected, setIsUsbConnected] = useState(false);
  const [usbDetails, setUsbDetails] = useState<UsbDeviceDetails | null>(null);
  const [usbBlockedAlert, setUsbBlockedAlert] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Pattern unlock interactive states
  const [patternSelected, setPatternSelected] = useState<number[]>([]);

  // Spy camera diagnostic state
  const [rfFrequency, setRfFrequency] = useState(2440);
  const [rfSignalStrength, setRfSignalStrength] = useState(15);

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

  const handleUsbConnectionChange = (connected: boolean, details?: UsbDeviceDetails) => {
    setIsUsbConnected(connected);
    if (connected && details) {
      setUsbDetails(details);
      setUsbBlockedAlert(false);
      addLog(`[USB-CONNECT] Device handshake confirmed: ${details.model} on ${details.port} (${details.speed})`);
      addLog("[USB-DRIVER] ADB / libusb fastboot interface synchronized.");
    } else {
      setUsbDetails(null);
      if (isProcessing) {
        handleReset();
      }
      addLog("[USB-DISCONNECT] Physical USB disconnected. Interface halted.");
    }
  };

  const handleStart = () => {
    if (!isUsbConnected) {
      setUsbBlockedAlert(true);
      sound.playErrorBuzz();
      return;
    }
    if (isProcessing) return;
    setUsbBlockedAlert(false);
    setIsProcessing(true);
    setProgress(0);
    setLogs([]);
    setIsCompleted(false);
    sound.playKeyClick();

    addLog(`INITIALIZING HARDWARE INTERFACE ON ${deviceModel.toUpperCase()} VIA USB-C / LIGHTNING PORT...`);
    addLog(`[PORT STATUS] ${usbDetails?.port || "USB 3.2 High-Speed Bridge"} • Active`);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next === 15) {
          if (isFaceId) {
            setCurrentStep("Firing 30,000 Infrared VCSEL Dot Projections...");
            addLog("Face matrix mesh aligned: 1,420 facial depth points matched.");
            sound.playBiometricHum();
          } else if (isFingerprint) {
            setCurrentStep("Scanning Sub-Epidermal Dermal Ridge Patterns...");
            addLog("Optical CCD sensor reading minutiae points (delta & core loops).");
            sound.playBiometricHum();
          } else if (isRecovery) {
            setCurrentStep("Carving Raw NAND Flash Sectors for JPG/HEIC Headers...");
            addLog("Found 1,842 fragmented file headers. Reconstructing master index.");
            sound.playKeyClick();
          } else if (isSpyCam) {
            setCurrentStep("Sweeping 50 MHz - 6 GHz RF Spectrum & Optical Glare Lens...");
            addLog("Signal spike detected at 2.45 GHz (-32 dBm). Analyzing transmission...");
            setRfSignalStrength(88);
            sound.playRadarPing();
          } else if (isVirusScan) {
            setCurrentStep("Heuristic Signature Analysis on 48,200 App Packages...");
            addLog("Scanned APK sandbox directories. Checking DEX permissions.");
            sound.playKeyClick();
          } else {
            setCurrentStep("Querying Hardware Keystore via Fastboot Protocol...");
            addLog("ADB connection established. Testing partition integrity.");
            sound.playKeyClick();
          }
        } else if (next === 38) {
          if (isFaceId || isFingerprint) {
            setCurrentStep("Evaluating Neural Engine Biometric Vector Embeddings...");
            addLog("Biometric Euclidean distance threshold: 0.042 (High-Confidence Match).");
            sound.playKeyClick();
          } else if (isRecovery) {
            setCurrentStep("Rebuilding EXT4 / APFS Inode Trees from Unallocated Space...");
            addLog("Indexed 28 unallocated clusters. Restoring metadata timestamps.");
            sound.playKeyClick();
          } else if (isSpyCam) {
            setCurrentStep("Demodulating 5.8 GHz Analogue & Digital Video Carrier Waveforms...");
            addLog("Analyzing video frame synchronization pulse. Carrier lock established.");
            sound.playRadarPing();
          } else {
            setCurrentStep("Auditing Cryptographic Nonce & Enclave Security State...");
            addLog("Keybox certificate chain evaluated against hardware root of trust.");
            sound.playKeyClick();
          }
        } else if (next === 65) {
          setCurrentStep("Verifying Cryptographic Enclave & Boundary Integrity...");
          addLog("SELinux Enforcing mode evaluated. Kernel trace complete.");
          sound.playKeyClick();
        } else if (next === 85) {
          setCurrentStep("Finalizing Hardware Diagnostics & Memory Dump Synthesis...");
          addLog("Assembly verification complete. Preparing hardware report.");
          sound.playKeyClick();
        } else if (next >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsCompleted(true);
          setCurrentStep("Diagnostic Cycle Completed");
          addLog("DEVICE OPERATION COMPLETED.");
          sound.playAccessGranted();
          return 100;
        }
        return next;
      });
    }, 650);
  };

  const handlePatternDotClick = (dotIndex: number) => {
    if (!isUsbConnected) {
      setUsbBlockedAlert(true);
      sound.playErrorBuzz();
      return;
    }
    if (isProcessing) return;
    sound.playKeyClick();
    if (!patternSelected.includes(dotIndex)) {
      setPatternSelected([...patternSelected, dotIndex]);
    }
  };

  const handleReset = () => {
    setIsProcessing(false);
    setProgress(0);
    setCurrentStep("");
    setLogs([]);
    setIsCompleted(false);
    setPatternSelected([]);
    setRfSignalStrength(15);
    sound.playKeyClick();
  };

  return (
    <div className="space-y-6">
      {/* USB Connection Interface */}
      <UsbConnectionDetector
        phoneModel={deviceModel}
        onPhoneModelChange={(name) => setDeviceModel(name)}
        isConnected={isUsbConnected}
        onConnectionChange={handleUsbConnectionChange}
        toolActionLabel="Hardware Mobile Protocol & Fastboot ADB"
      />

      {/* USB Disconnected Alert Banner */}
      {usbBlockedAlert && !isUsbConnected && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500 text-red-200 text-xs font-mono flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <span className="font-bold text-red-300 block">HARDWARE USB TETHER REQUIRED:</span>
            <span>
              Connect {deviceModel} via USB cable to access internal partitions, flash storage, and recovery channels.
            </span>
          </div>
        </div>
      )}

      <div className="bg-cyber-card border border-cyber-border rounded-2xl p-4 sm:p-6 shadow-card-cyber space-y-6">
        {/* Top Controller Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyber-borderSubtle">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isUsbConnected ? "bg-cyber-green/10 border border-cyber-green/30 text-cyber-green" : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}>
              <Smartphone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                Mobile Hardware & Sensor Diagnostic Suite
              </h2>
              <p className="text-xs text-cyber-muted font-mono">
                Status: {!isUsbConnected ? "USB DISCONNECTED (CONNECT CABLE)" : isProcessing ? "PROCESSING BIOMETRICS..." : isCompleted ? "DIAGNOSTIC COMPLETE" : "TETHERED & STANDBY"}
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

      {/* Target Setup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">Target Smartphone Chassis</label>
          <select
            value={deviceModel}
            onChange={(e) => setDeviceModel(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyber-green disabled:opacity-50"
          >
            <option value="Samsung Galaxy S24 Ultra">Samsung Galaxy S24 Ultra (Knox Vault 3.0)</option>
            <option value="Apple iPhone 16 Pro Max">Apple iPhone 16 Pro Max (A18 Secure Enclave)</option>
            <option value="Google Pixel 9 Pro">Google Pixel 9 Pro (Titan M2 Enclave)</option>
            <option value="OnePlus 12">OnePlus 12 (OxygenOS 14)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">Firmware Diagnostic Mode</label>
          <div className="p-3 bg-cyber-dark rounded-xl border border-cyber-borderSubtle text-xs font-mono text-slate-300">
            {isPattern && "9-Point Pattern Decryption Protocol"}
            {isFingerprint && "Ultrasonic In-Display Biometric Sensor"}
            {isFaceId && "TrueDepth Infrared VCSEL Facial Recognition"}
            {isRecovery && "NAND Sector Carving & EXIF Recovery"}
            {isSpyCam && "RF Electromagnetic Leak & Lens Glare Sensor"}
            {isVirusScan && "Heuristic Sandbox Threat Scan"}
            {!isPattern && !isFingerprint && !isFaceId && !isRecovery && !isSpyCam && !isVirusScan && "Fastboot Kernel Diagnostic Mode"}
          </div>
        </div>
      </div>

      {/* Pattern Unlock Interactive Grid */}
      {isPattern && (
        <div className="flex flex-col items-center justify-center p-6 bg-cyber-dark/80 rounded-2xl border border-cyber-borderSubtle space-y-4">
          <div className="text-xs font-mono text-cyber-muted">Draw active unlock pattern (click dots):</div>
          <div className="grid grid-cols-3 gap-6 p-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((dot) => {
              const active = patternSelected.includes(dot);
              return (
                <button
                  key={dot}
                  onClick={() => handlePatternDotClick(dot)}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm transition-all duration-200 ${
                    active
                      ? "bg-cyber-green text-black border-cyber-green shadow-neon-green scale-110"
                      : "bg-cyber-panel text-slate-400 border-cyber-border hover:border-cyber-green/50"
                  }`}
                >
                  {dot}
                </button>
              );
            })}
          </div>
          <div className="text-xs font-mono text-cyber-green">
            Connected Pattern: {patternSelected.length > 0 ? patternSelected.join(" → ") : "None"}
          </div>
        </div>
      )}

      {/* Biometric Fingerprint / Face ID View */}
      {(isFingerprint || isFaceId) && (
        <div className="flex flex-col items-center justify-center p-8 bg-cyber-dark/80 rounded-2xl border border-cyber-borderSubtle space-y-4">
          <div
            onClick={handleStart}
            className={`w-28 h-28 rounded-3xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              isProcessing
                ? "border-cyber-green bg-cyber-green/10 shadow-neon-green animate-pulse"
                : isCompleted
                ? "border-cyber-green bg-cyber-green/20"
                : "border-cyber-border bg-cyber-panel hover:border-cyber-cyan"
            }`}
          >
            {isFingerprint ? (
              <Fingerprint className={`w-14 h-14 ${isProcessing ? "text-cyber-green" : "text-slate-300"}`} />
            ) : (
              <Eye className={`w-14 h-14 ${isProcessing ? "text-cyber-cyan" : "text-slate-300"}`} />
            )}
            <span className="text-[10px] font-mono mt-2 text-cyber-muted uppercase">
              {isProcessing ? "SCANNING..." : isCompleted ? "AUTHORIZED" : "TOUCH TO SCAN"}
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400">Click biometric sensor to simulate authentication</p>
        </div>
      )}

      {/* Spy Camera RF Meter */}
      {isSpyCam && (
        <div className="p-4 bg-cyber-dark rounded-xl border border-cyber-borderSubtle space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-cyber-muted">RF Signal Frequency: {rfFrequency} MHz</span>
            <span className={rfSignalStrength > 50 ? "text-cyber-red font-bold animate-pulse" : "text-cyber-green"}>
              Field Strength: {rfSignalStrength}%
            </span>
          </div>
          <div className="w-full h-3 bg-cyber-panel rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                rfSignalStrength > 50 ? "bg-cyber-red" : "bg-cyber-green"
              }`}
              style={{ width: `${rfSignalStrength}%` }}
            />
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            {rfSignalStrength > 50 ? "⚠️ Hidden RF Emitter Signal Detected Nearby" : "Normal Background Ambient Noise Floor"}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleStart}
          disabled={isProcessing || !isUsbConnected}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-green text-black font-bold font-mono text-sm tracking-wide hover:bg-cyber-green/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-neon-green"
        >
          {isProcessing ? (
            <>
              <Zap className="w-4 h-4 animate-spin" />
              <span>TESTING HARDWARE LAYER...</span>
            </>
          ) : !isUsbConnected ? (
            <>
              <Usb className="w-4 h-4" />
              <span>CONNECT USB CABLE TO START</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>START DIAGNOSTIC SCAN</span>
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
              {currentStep || "Querying hardware enclaves..."}
            </span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-cyber-panel rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyber-green via-cyber-cyan to-cyber-green transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Final Diagnostic Report */}
      {isCompleted && (
        <div className="p-4 rounded-xl bg-cyber-green/10 border border-cyber-green/40 space-y-3">
          <div className="flex items-center gap-2 text-cyber-green font-mono font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>DIAGNOSTIC REPORT: {deviceModel}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-cyber-dark/80 rounded-lg border border-cyber-borderSubtle">
              <span className="text-cyber-muted block mb-1">Keystore Status</span>
              <span className="text-cyber-green font-bold">Hardened</span>
            </div>
            <div className="p-3 bg-cyber-dark/80 rounded-lg border border-cyber-borderSubtle">
              <span className="text-cyber-muted block mb-1">Sandbox Integrity</span>
              <span className="text-cyber-green font-bold">100% Passed</span>
            </div>
            <div className="p-3 bg-cyber-dark/80 rounded-lg border border-cyber-borderSubtle">
              <span className="text-cyber-muted block mb-1">Threat Status</span>
              <span className="text-cyber-green font-bold">0 Vulnerabilities</span>
            </div>
            <div className="p-3 bg-cyber-dark/80 rounded-lg border border-cyber-borderSubtle">
              <span className="text-cyber-muted block mb-1">Biometric Hash</span>
              <span className="text-white font-bold">0x7F892...</span>
            </div>
          </div>

          
        </div>
      )}

      {/* Real-time Terminal */}
      <div className="rounded-xl bg-black border border-cyber-borderSubtle overflow-hidden">
        <div className="bg-cyber-panel px-4 py-2 border-b border-cyber-borderSubtle flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyber-green">
            <Terminal className="w-3.5 h-3.5" />
            <span>fastboot-dmesg-telemetry</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">PORT: USB-C 3.2</span>
        </div>
        <div ref={logsContainerRef} className="p-4 font-mono text-xs text-cyber-green/90 h-36 overflow-y-auto space-y-1 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-slate-500 italic">Select device chassis and execute diagnostic routine.</div>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </div>
    </div>
    </div>
  );
};
