"use client";

import React, { useState, useRef } from "react";
import { Radar, Satellite, MapPin, Play, RotateCcw, CheckCircle2, AlertTriangle, Usb } from "lucide-react";
import { sound } from "@/lib/utils/audio";
import { UsbConnectionDetector, UsbDeviceDetails } from "./UsbConnectionDetector";

export const LocationTrackerSim: React.FC = () => {
  const [phoneInput, setPhoneInput] = useState("+1 (555) 019-2834");
  const [phoneModel, setPhoneModel] = useState("Apple iPhone 16 Pro");
  const [isUsbConnected, setIsUsbConnected] = useState(false);
  const [usbDetails, setUsbDetails] = useState<UsbDeviceDetails | null>(null);
  const [usbBlockedAlert, setUsbBlockedAlert] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState("Awaiting USB Baseband Connection");
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<any | null>(null);
  const [realGeoActive, setRealGeoActive] = useState(false);
  const [realGeoData, setRealGeoData] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const radarInterval = useRef<NodeJS.Timeout | null>(null);

  const handleUsbConnectionChange = (connected: boolean, details?: UsbDeviceDetails) => {
    setIsUsbConnected(connected);
    if (connected && details) {
      setUsbDetails(details);
      setUsbBlockedAlert(false);
      setStageText("Satellite Baseband Modem Ready");
      setLogs((prev) => [
        ...prev,
        `[USB-DETECTED] Physical link active on ${details.port}. Device: ${details.model} (${details.speed}).`,
      ]);
    } else {
      setUsbDetails(null);
      if (isRunning) {
        handleReset();
      }
      setStageText("Awaiting USB Baseband Connection");
      setLogs((prev) => [
        ...prev,
        "[USB-DISCONNECTED] Target phone unplugged. Telemetry channel disconnected.",
      ]);
    }
  };

  const startDiagnostic = () => {
    if (!isUsbConnected) {
      setUsbBlockedAlert(true);
      sound.playErrorBuzz();
      return;
    }
    if (isRunning) return;
    setUsbBlockedAlert(false);
    setIsRunning(true);
    setProgress(0);
    setResult(null);
    setLogs([
      `[INIT] Querying baseband cellular telemetry via USB link: ${phoneModel}`,
      "[INIT] Synchronizing with Global Telemetry Satellite Constellation...",
    ]);
    sound.playRadarPing();

    const stages = [
      { pct: 10, text: "Synchronizing low-earth orbit satellite ephemeris...", log: `[TELEMETRY] Baseband carrier synchronized on ${phoneModel}.` },
      { pct: 22, text: "Calibrating orbital azimuth & baseband Doppler shift...", log: "[ORBITAL] Doppler offset compensated (Δf = +1.42 kHz)." },
      { pct: 36, text: "Triangulating GSM/LTE ground base station transceivers...", log: "[BEACONS] 3 ground cellular base stations acknowledged telemetry ping." },
      { pct: 50, text: "Calculating Time Difference of Arrival (TDoA) hyperbolic curves...", log: "[TDoA] Hyperbolic intersection converged on Sector 7G." },
      { pct: 64, text: "Compensating for tropospheric microwave refraction delay...", log: "[ATMOSPHERE] Ionospheric delay correction: 14.2 nanoseconds." },
      { pct: 78, text: "Resolving geospatial latitude/longitude coordinates...", log: "[SECTOR] Synthesizing coordinate overlay map." },
      { pct: 90, text: "Verifying GPS ground station fix and signal lock...", log: "[PRECISION] Differential GPS lock verified (HDOP 0.8)." },
      { pct: 100, text: "Telemetry Lock Established", log: "[FINISH] Sector coordinates confirmed." },
    ];

    let current = 0;
    radarInterval.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (current < stages.length && next >= stages[current].pct) {
          const s = stages[current];
          setStageText(s.text);
          setLogs((l) => [...l, s.log]);
          sound.playRadarPing();
          current++;
        }
        if (next >= 100) {
          if (radarInterval.current) clearInterval(radarInterval.current);
          finishDiagnostic();
          return 100;
        }
        return next;
      });
    }, 650);
  };

  const finishDiagnostic = () => {
    setIsRunning(false);
    sound.playAccessGranted();
    setResult({
      target: `${phoneModel} (${phoneInput || "Target Device"})`,
      coordinates: "48°51'24.8\"N 2°21'07.2\"E",
      region: "Sector 7G — Baseband GPS Ground Station Relay",
      satellite: "ASTRA-SAT-99 (Orbital Primary)",
      accuracyRadius: "± 15 meters",
      usbLink: usbDetails?.port || "USB-C SuperSpeed (COM3)",
    });
  };

  const handleReset = () => {
    if (radarInterval.current) clearInterval(radarInterval.current);
    setIsRunning(false);
    setProgress(0);
    setResult(null);
    setLogs([]);
    setStageText(isUsbConnected ? "Satellite Baseband Modem Ready" : "Awaiting USB Baseband Connection");
  };

  const requestRealGeo = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setRealGeoActive(true);
        setRealGeoData({
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
          accuracy: Math.round(pos.coords.accuracy),
        });
        sound.playAccessGranted();
      },
      (err) => {
        setGeoError(`Browser permission unavailable (${err.message}).`);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Hardware USB Connection Detector Component */}
      <UsbConnectionDetector
        phoneModel={phoneModel}
        onPhoneModelChange={(name) => setPhoneModel(name)}
        isConnected={isUsbConnected}
        onConnectionChange={handleUsbConnectionChange}
        toolActionLabel="Satellite Baseband GPS Telemetry"
      />

      {/* Warning message if user tries to scan without USB */}
      {usbBlockedAlert && !isUsbConnected && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500 text-red-200 text-xs font-mono flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <span className="font-bold text-red-300 block">
              HARDWARE COMMUNICATION BLOCKED:
            </span>
            <span>
              Target phone must be connected via USB cable to calibrate the baseband cellular modem before triangulation can begin.
            </span>
          </div>
        </div>
      )}

      {/* Diagnostic Controls Card */}
      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle shadow-card-cyber">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-cyber-borderSubtle/60">
          <div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Satellite className="w-5 h-5 text-cyber-green" />
              Orbital Radar Telemetry Console
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Connect target phone via USB and enter telephone number to initiate satellite radar tracking.
            </p>
          </div>
          <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full border ${
            isUsbConnected
              ? "bg-cyber-green/10 text-cyber-green border-cyber-green/30"
              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
          }`}>
            {isUsbConnected ? "USB BASEBAND ONLINE" : "AWAITING USB LINK"}
          </span>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Target Phone Number:
            </label>
            <input
              type="text"
              value={phoneInput}
              disabled={isRunning}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="+1 (555) 019-2834"
              className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl py-2.5 px-4 text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyber-green"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={startDiagnostic}
              disabled={isRunning || !isUsbConnected}
              className="flex-1 py-2.5 px-4 rounded-xl bg-cyber-green text-black font-mono font-bold text-xs flex items-center justify-center gap-2 hover:bg-cyber-green/90 shadow-neon-green/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>
                {!isUsbConnected
                  ? "Connect USB to Scan"
                  : isRunning
                  ? "Tracking..."
                  : "Initiate Scan"}
              </span>
            </button>
            <button
              onClick={handleReset}
              disabled={isRunning && progress === 0}
              className="p-2.5 rounded-xl bg-cyber-panel border border-cyber-borderSubtle text-slate-300 hover:text-white hover:border-cyber-cyan/50 transition-colors"
              title="Reset Radar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Radar Visualizer */}
        <div className="relative w-full max-w-sm mx-auto aspect-square rounded-full bg-cyber-dark border-2 border-cyber-green/30 flex items-center justify-center overflow-hidden my-6 shadow-[0_0_40px_rgba(0,255,102,0.15)]">
          {/* Radar Grid Circles */}
          <div className="absolute inset-4 rounded-full border border-cyber-green/20" />
          <div className="absolute inset-16 rounded-full border border-cyber-green/20" />
          <div className="absolute inset-28 rounded-full border border-cyber-green/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-cyber-green/20" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-px bg-cyber-green/20" />
          </div>

          {/* Rotating Radar Sweep Needle */}
          <div
            className={`absolute inset-0 rounded-full pointer-events-none ${
              isRunning ? "animate-radar-sweep" : ""
            }`}
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, rgba(0, 255, 102, 0.4) 0deg, rgba(0, 255, 102, 0) 60deg, transparent 360deg)",
            }}
          />

          {/* Satellite Blips */}
          <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-cyber-green animate-ping opacity-75" />
          <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-cyber-green" />
          <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-pulse" />
          <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-cyber-purple" />

          {/* Center Coordinates Crosshair */}
          <div className="z-10 text-center">
            <div className="w-3 h-3 rounded-full bg-white mx-auto mb-1 shadow-[0_0_10px_#fff]" />
            <span className="text-[10px] font-mono text-cyber-green font-bold block">
              SAT-LINK
            </span>
            <span className="text-[9px] font-mono text-slate-300">
              {progress}%
            </span>
          </div>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">{stageText}</span>
            <span className="text-cyber-green font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-cyber-dark overflow-hidden border border-cyber-borderSubtle">
            <div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Console Log Lines */}
        <div className="p-3.5 rounded-xl bg-cyber-dark border border-cyber-borderSubtle/80 font-mono text-xs max-h-32 overflow-y-auto space-y-1">
          {logs.map((l, i) => (
            <div key={i} className="text-slate-300">
              <span className="text-cyber-green">❯</span> {l}
            </div>
          ))}
          {logs.length === 0 && (
            <span className="text-cyber-muted">Telemetry receiver standby. Click &apos;Initiate Scan&apos;.</span>
          )}
        </div>
      </div>

      {/* Result Panel */}
      {result && (
        <div className="p-6 rounded-2xl bg-cyber-panel border-2 border-cyber-green/50 shadow-neon-green/20 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyber-green/20 border border-cyber-green flex items-center justify-center text-cyber-green">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-cyber-green font-bold tracking-wider">
                TELEMETRY SCAN COMPLETE
              </div>
              <h4 className="text-lg font-bold text-white font-mono">
                Satellite Grid Coordinates Locked
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-xs font-mono mb-2">
            <div>
              <span className="text-cyber-muted block">Target Device:</span>
              <span className="text-white font-bold">{result.target}</span>
            </div>
            <div>
              <span className="text-cyber-muted block">Coordinates:</span>
              <span className="text-cyber-cyan font-bold">{result.coordinates || result.fictionalCoordinates}</span>
            </div>
            <div>
              <span className="text-cyber-muted block">Sector:</span>
              <span className="text-slate-200">{result.region}</span>
            </div>
            <div>
              <span className="text-cyber-muted block">Satellite:</span>
              <span className="text-cyber-green">{result.satellite}</span>
            </div>
          </div>
        </div>
      )}

      {/* Local Browser Geolocation API Demo */}
      <div className="p-5 rounded-2xl bg-cyber-card/60 border border-cyber-borderSubtle text-xs">
        <h4 className="font-bold text-white font-mono text-sm mb-1 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyber-cyan" />
          Browser Geolocation Testing Tool
        </h4>
        <p className="text-slate-400 mb-3 leading-relaxed">
          Test your device&apos;s native W3C Geolocation API. Coordinates are rendered locally in your browser and are never transmitted to any server.
        </p>

        {!realGeoActive ? (
          <button
            onClick={requestRealGeo}
            className="px-4 py-2 rounded-lg bg-cyber-panel border border-cyber-border text-slate-200 font-mono hover:text-white hover:border-cyber-cyan transition-colors"
          >
            Run Local Geolocation Check
          </button>
        ) : (
          <div className="p-3 rounded-lg bg-cyber-dark border border-cyber-cyan/40 font-mono text-cyber-cyan space-y-1">
            <div className="text-white font-bold">Local Device Coordinates:</div>
            <div>Latitude: {realGeoData?.lat}° | Longitude: {realGeoData?.lng}°</div>
            <div className="text-[11px] text-cyber-muted">
              Accuracy: ~{realGeoData?.accuracy} meters (Rendered client-side).
            </div>
          </div>
        )}

        {geoError && (
          <div className="mt-2 text-cyber-red font-mono text-[11px]">{geoError}</div>
        )}
      </div>
    </div>
  );
};
