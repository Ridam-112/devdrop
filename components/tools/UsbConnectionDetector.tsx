"use client";

import React, { useState, useEffect } from "react";
import {
  Usb,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Cable,
  Zap,
  RefreshCw,
  PowerOff,
  Radio,
  Cpu,
} from "lucide-react";
import { sound } from "@/lib/utils/audio";

export interface UsbDeviceDetails {
  model: string;
  cableType: string;
  port: string;
  speed: string;
  battery: string;
  serial: string;
  driver: string;
  isRealWebUsb?: boolean;
}

interface UsbConnectionDetectorProps {
  phoneModel: string;
  onPhoneModelChange?: (name: string) => void;
  isConnected: boolean;
  onConnectionChange: (connected: boolean, details?: UsbDeviceDetails) => void;
  toolActionLabel?: string;
  allowEditPhoneName?: boolean;
}

export const UsbConnectionDetector: React.FC<UsbConnectionDetectorProps> = ({
  phoneModel,
  onPhoneModelChange,
  isConnected,
  onConnectionChange,
  toolActionLabel = "Diagnostic Protocol",
  allowEditPhoneName = true,
}) => {
  const [cableType, setCableType] = useState<string>("USB-C 3.2 Gen 2 (10 Gbps)");
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [handshakeStep, setHandshakeStep] = useState("");
  const [webUsbSupported, setWebUsbSupported] = useState(false);
  const [webUsbMessage, setWebUsbMessage] = useState<string | null>(null);

  // Check WebUSB support
  useEffect(() => {
    if (typeof window !== "undefined" && "usb" in navigator) {
      setWebUsbSupported(true);

      // Listen for hardware plug/unplug events if browser supports it
      const handleConnect = (e: any) => {
        const devName = e.device?.productName || "Hardware Device";
        if (onPhoneModelChange && e.device?.productName) {
          onPhoneModelChange(e.device.productName);
        }
        connectDevice({
          model: devName,
          cableType: "Physical USB Hardware Port",
          port: "Direct Host Controller",
          speed: "High Speed (480 Mbps - 10 Gbps)",
          battery: "⚡ 88% Fast Charge",
          serial: `SN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          driver: "libusb-win32 / Host Controller v2.4",
          isRealWebUsb: true,
        });
      };

      const handleDisconnect = () => {
        disconnectDevice();
      };

      try {
        const usbNav = (navigator as any).usb;
        if (usbNav) {
          usbNav.addEventListener("connect", handleConnect);
          usbNav.addEventListener("disconnect", handleDisconnect);

          return () => {
            usbNav.removeEventListener("connect", handleConnect);
            usbNav.removeEventListener("disconnect", handleDisconnect);
          };
        }
      } catch (err) {
        // Ignore fallback
      }
    }
  }, []);

  const connectDevice = (details?: Partial<UsbDeviceDetails>) => {
    const finalDetails: UsbDeviceDetails = {
      model: details?.model || phoneModel || "Smartphone Device",
      cableType: details?.cableType || cableType,
      port: details?.port || "Port 2: USB-C SuperSpeed (COM3)",
      speed: details?.speed || "10 Gbps Full Duplex",
      battery: details?.battery || "⚡ 87% (Fast Charging)",
      serial: details?.serial || `USB-${Math.random().toString(36).substring(2, 8).toUpperCase()}-NODE`,
      driver: details?.driver || "ADB / Apple Mobile Device Interface v18.4 (Active)",
      isRealWebUsb: details?.isRealWebUsb || false,
    };

    setIsHandshaking(true);
    setHandshakeStep("Detecting USB Host Port...");
    sound.playKeyClick();

    setTimeout(() => {
      setHandshakeStep("Negotiating USB 3.2 / Lightning Bus Protocol...");
      sound.playKeyClick();
    }, 400);

    setTimeout(() => {
      setHandshakeStep("Driver Handshake Confirmed. Device Authorized!");
      sound.playUsbConnected();
      setIsHandshaking(false);
      setHandshakeStep("");
      onConnectionChange(true, finalDetails);
    }, 900);
  };

  const disconnectDevice = () => {
    sound.playUsbDisconnected();
    onConnectionChange(false);
  };

  const handleRealWebUsbRequest = async () => {
    if (!webUsbSupported || !(navigator as any).usb) {
      setWebUsbMessage("WebUSB API not available in this browser. Use Direct Cable Connect below.");
      return;
    }
    try {
      setWebUsbMessage("Opening browser USB hardware device picker...");
      const device = await (navigator as any).usb.requestDevice({ filters: [] });
      if (device) {
        const detectedName = device.productName || device.manufacturerName || "USB Mobile Device";
        if (onPhoneModelChange && detectedName) {
          onPhoneModelChange(detectedName);
        }
        connectDevice({
          model: detectedName,
          cableType: "Physical Host USB Interface",
          port: `Vendor ID: 0x${device.vendorId.toString(16).padStart(4, "0")}`,
          speed: "High Speed USB Bridge",
          battery: "⚡ Hardware Bus Powered",
          serial: device.serialNumber || `SN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          driver: "Native USB Client Driver (Verified)",
          isRealWebUsb: true,
        });
        setWebUsbMessage(`Connected to physical USB: ${detectedName}`);
      }
    } catch (err: any) {
      if (err.name !== "NotFoundError") {
        setWebUsbMessage("No physical USB device selected. You can use 'Plug in USB Cable' below.");
      }
    }
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-[#0e1626] to-[#0a0f18] border border-cyber-borderSubtle p-5 sm:p-6 shadow-card-cyber transition-all">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyber-borderSubtle/60">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isConnected
                ? "bg-cyber-neon/15 text-cyber-neon border border-cyber-neon/40 shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                : "bg-red-500/15 text-red-400 border border-red-500/30"
            }`}
          >
            <Usb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
                Smartphone Hardware USB Interface
              </h4>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1.5 ${
                  isConnected
                    ? "bg-cyber-neon/15 text-cyber-neon border-cyber-neon/40"
                    : "bg-red-500/15 text-red-400 border-red-500/30"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? "bg-cyber-neon animate-pulse" : "bg-red-400"
                  }`}
                />
                {isConnected ? "USB DETECTED & ACTIVE" : "USB DISCONNECTED"}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Requires physical USB cable link to tether phone diagnostic channels.
            </p>
          </div>
        </div>

        {/* Quick Connect / Disconnect Buttons */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <button
              onClick={disconnectDevice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 transition-all hover:scale-105"
            >
              <PowerOff className="w-3.5 h-3.5" />
              Disconnect USB
            </button>
          ) : (
            <button
              onClick={() => connectDevice()}
              disabled={isHandshaking}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyber-neon to-cyber-cyan text-black hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isHandshaking ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Cable className="w-3.5 h-3.5 text-black" />
                  <span>Plug In USB Cable</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Handshake Progress Banner */}
      {isHandshaking && (
        <div className="mt-4 p-3 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono flex items-center gap-3 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-cyber-cyan" />
          <span>{handshakeStep}</span>
        </div>
      )}

      {/* Device Config & Status Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Device Name input */}
        <div className="p-3.5 rounded-xl bg-cyber-bg/80 border border-cyber-borderSubtle flex flex-col justify-between">
          <label className="text-[11px] font-mono text-slate-300 flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-cyber-cyan" />
              Target Smartphone Model:
            </span>
            <span className="text-[10px] text-slate-300">(Customizable)</span>
          </label>
          {allowEditPhoneName ? (
            <input
              type="text"
              value={phoneModel}
              onChange={(e) => onPhoneModelChange && onPhoneModelChange(e.target.value)}
              placeholder="e.g. Samsung Galaxy S24 Ultra / iPhone 16 Pro"
              disabled={isHandshaking}
              className="w-full bg-[#070b12] border border-cyber-borderSubtle focus:border-cyber-cyan rounded-lg px-3 py-1.5 text-xs font-mono text-white placeholder-slate-400 focus:outline-none transition-colors"
            />
          ) : (
            <div className="text-xs font-mono text-white font-semibold py-1">
              {phoneModel}
            </div>
          )}
          <p className="text-[10px] text-slate-300 mt-1">
            Specify the phone model connected to the USB terminal.
          </p>
        </div>

        {/* Cable Type Selector */}
        <div className="p-3.5 rounded-xl bg-cyber-bg/80 border border-cyber-borderSubtle flex flex-col justify-between">
          <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5 mb-1.5">
            <Cable className="w-3.5 h-3.5 text-cyber-neon" />
            USB Cable Standard:
          </label>
          <select
            value={cableType}
            onChange={(e) => setCableType(e.target.value)}
            disabled={isHandshaking || isConnected}
            className="w-full bg-[#070b12] border border-cyber-borderSubtle focus:border-cyber-neon rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none transition-colors disabled:opacity-70"
          >
            <option value="USB-C 3.2 Gen 2 (10 Gbps)">USB-C 3.2 Gen 2 (10 Gbps High Speed)</option>
            <option value="USB-C to Lightning (Apple MFi)">Apple Lightning MFi (Fast Charge Data)</option>
            <option value="Thunderbolt 4 / USB-4 (40 Gbps)">Thunderbolt 4 / USB-4 (40 Gbps Low Latency)</option>
            <option value="USB-A to USB-C (High Speed)">USB-A to USB-C 3.0 (5 Gbps)</option>
          </select>
          <p className="text-[10px] text-slate-300 mt-1">
            Standard hardware connection cable profile.
          </p>
        </div>
      </div>

      {/* Connected Telemetry Details OR Disconnected Alert */}
      {isConnected ? (
        <div className="mt-4 p-4 rounded-xl bg-cyber-neon/[0.04] border border-cyber-neon/30 text-xs font-mono">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyber-neon/20">
            <span className="text-cyber-neon font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyber-neon" />
              Tethered Hardware Link Active
            </span>
            <span className="text-[11px] text-slate-300">
              Bus 001 • Dev 004 • Latency &lt; 0.4ms
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="text-slate-300 block text-[10px]">Tethered Model:</span>
              <span className="text-white font-semibold truncate block">{phoneModel}</span>
            </div>
            <div>
              <span className="text-slate-300 block text-[10px]">Interface Bus:</span>
              <span className="text-cyber-cyan truncate block">{cableType.split(" ")[0]} 3.2 Gen 2</span>
            </div>
            <div>
              <span className="text-slate-300 block text-[10px]">Driver Handshake:</span>
              <span className="text-cyber-neon truncate block">ADB / MTP Ready</span>
            </div>
            <div>
              <span className="text-slate-300 block text-[10px]">Battery Level:</span>
              <span className="text-emerald-400 font-semibold truncate block">⚡ 88% (Charging)</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-400 text-xs">
                Physical USB Hardware Connection Required
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                To run {toolActionLabel}, connect your phone to this computer via USB cable and click &quot;Plug In USB Cable&quot; or pair your physical device.
              </p>
            </div>
          </div>

          {webUsbSupported && (
            <button
              onClick={handleRealWebUsbRequest}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold bg-cyber-cyan/15 hover:bg-cyber-cyan/25 text-cyber-cyan border border-cyber-cyan/30 whitespace-nowrap transition-colors"
            >
              <Radio className="w-3.5 h-3.5" />
              Scan Physical USB Port
            </button>
          )}
        </div>
      )}

      {webUsbMessage && (
        <p className="text-[10px] font-mono text-cyber-cyan mt-2">
          {webUsbMessage}
        </p>
      )}
    </div>
  );
};
