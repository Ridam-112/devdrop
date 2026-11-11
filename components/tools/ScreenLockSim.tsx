"use client";

import React, { useState, useEffect } from "react";
import { Lock, Unlock, Fingerprint, RotateCcw, ExternalLink, CheckCircle2, Usb, AlertTriangle } from "lucide-react";
import { sound } from "@/lib/utils/audio";
import confetti from "canvas-confetti";
import { UsbConnectionDetector, UsbDeviceDetails } from "./UsbConnectionDetector";

export const ScreenLockSim: React.FC = () => {
  const [phoneModel, setPhoneModel] = useState("Apple iPhone 16 Pro");
  const [isUsbConnected, setIsUsbConnected] = useState(false);
  const [usbDetails, setUsbDetails] = useState<UsbDeviceDetails | null>(null);
  const [usbAlert, setUsbAlert] = useState(false);

  const [pin, setPin] = useState("");
  const [targetPin] = useState("1337");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [errorShake, setErrorShake] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [fpScanning, setFpScanning] = useState(false);
  const [fpProgress, setFpProgress] = useState(0);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds > 0) {
      const timer = setInterval(() => {
        setLockoutSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutSeconds]);

  const handleUsbConnectionChange = (connected: boolean, details?: UsbDeviceDetails) => {
    setIsUsbConnected(connected);
    if (connected && details) {
      setUsbDetails(details);
      setUsbAlert(false);
    } else {
      setUsbDetails(null);
      setIsUnlocked(false);
      setPin("");
    }
  };

  const handleKeyPress = (num: string) => {
    if (!isUsbConnected) {
      setUsbAlert(true);
      sound.playErrorBuzz();
      return;
    }
    if (isUnlocked || lockoutSeconds > 0) return;
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      sound.playKeyClick();

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const verifyPin = (entered: string) => {
    if (entered === targetPin) {
      triggerUnlock("4-Digit PIN Verified!");
    } else {
      sound.playErrorBuzz();
      setErrorShake(true);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      setTimeout(() => {
        setErrorShake(false);
        setPin("");
      }, 500);

      if (newAttempts >= 3) {
        setLockoutSeconds(30);
      }
    }
  };

  const handleBackspace = () => {
    if (!isUsbConnected) {
      setUsbAlert(true);
      sound.playErrorBuzz();
      return;
    }
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      sound.playKeyClick();
    }
  };

  const handleFingerprintStart = () => {
    if (!isUsbConnected) {
      setUsbAlert(true);
      sound.playErrorBuzz();
      return;
    }
    if (isUnlocked || lockoutSeconds > 0) return;
    setFpScanning(true);
    sound.playBiometricHum();

    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setFpProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setFpScanning(false);
        triggerUnlock("Biometric Fingerprint Match Confirmed!");
      }
    }, 100);
  };

  const handleFingerprintEnd = () => {
    if (fpScanning) {
      setFpScanning(false);
      setFpProgress(0);
    }
  };

  const triggerUnlock = (msg: string) => {
    setIsUnlocked(true);
    sound.playAccessGranted();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const resetPhone = () => {
    setIsUnlocked(false);
    setPin("");
    setAttempts(0);
    setLockoutSeconds(0);
    setFpProgress(0);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* USB Connection Detector */}
      <div className="w-full">
        <UsbConnectionDetector
          phoneModel={phoneModel}
          onPhoneModelChange={(name) => setPhoneModel(name)}
          isConnected={isUsbConnected}
          onConnectionChange={handleUsbConnectionChange}
          toolActionLabel="ADB & Secure Enclave Passcode Interface"
        />
      </div>

      {/* USB Alert Banner */}
      {usbAlert && !isUsbConnected && (
        <div className="w-full p-4 rounded-xl bg-red-950/40 border border-red-500 text-red-200 text-xs font-mono flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <span className="font-bold text-red-300 block">HARDWARE LOCK:</span>
            <span>
              Phone is disconnected. Plug in the USB cable in the panel above to communicate with {phoneModel}.
            </span>
          </div>
        </div>
      )}

      {/* Virtual Phone Mockup Chassis */}
      <div className="w-full max-w-[340px] aspect-[9/18] rounded-[48px] bg-cyber-dark border-[10px] border-[#222834] shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative p-4 flex flex-col justify-between overflow-hidden">
        {/* Dynamic Island / Speaker */}
        <div className="w-24 h-5 rounded-full bg-black mx-auto mt-1 flex items-center justify-center gap-2 border border-white/10">
          <div className="w-2.5 h-2.5 rounded-full bg-[#182335]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#111]" />
        </div>

        {/* Lockscreen Header */}
        <div className="text-center mt-6">
          <div className="w-10 h-10 rounded-full bg-white/10 mx-auto flex items-center justify-center mb-2">
            {!isUsbConnected ? (
              <Usb className="w-5 h-5 text-red-400 animate-pulse" />
            ) : isUnlocked ? (
              <Unlock className="w-5 h-5 text-cyber-green animate-bounce" />
            ) : (
              <Lock className="w-5 h-5 text-slate-200" />
            )}
          </div>
          <h4 className="text-sm font-bold text-white font-mono">
            {!isUsbConnected
              ? "USB Cable Disconnected"
              : isUnlocked
              ? "Device Unlocked"
              : lockoutSeconds > 0
              ? "Device Disabled"
              : "Enter Passcode"}
          </h4>
          <p className="text-[11px] font-mono text-cyber-muted mt-0.5">
            {!isUsbConnected
              ? "Connect USB cable above to proceed"
              : lockoutSeconds > 0
              ? `Try again in ${lockoutSeconds}s`
              : "Touch biometric sensor or enter PIN"}
          </p>

          {/* 4 PIN Dots */}
          {!isUnlocked && isUsbConnected && (
            <div
              className={`flex justify-center gap-3 my-4 transition-transform ${
                errorShake ? "animate-pulse translate-x-2 text-cyber-red" : ""
              }`}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full border border-white/40 transition-all ${
                    pin.length > i ? "bg-white scale-110 shadow-[0_0_8px_#fff]" : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Unlocked State vs Keypad */}
        {!isUsbConnected ? (
          <div className="text-center my-auto p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <Usb className="w-8 h-8 text-red-400 mx-auto mb-2 animate-bounce" />
            <div className="text-xs font-bold text-white font-mono">No USB Host Detected</div>
            <p className="text-[11px] text-slate-300 mt-1">
              Plug in USB cable to bridge hardware interface to {phoneModel}.
            </p>
          </div>
        ) : isUnlocked ? (
          <div className="text-center my-auto p-4 rounded-xl bg-cyber-green/10 border border-cyber-green/40">
            <CheckCircle2 className="w-10 h-10 text-cyber-green mx-auto mb-2" />
            <div className="text-sm font-bold text-white font-mono">Authentication Verified</div>
            <p className="text-xs text-slate-300 mt-1">
              Secure Enclave Token Accepted for {phoneModel}.
            </p>
            <button
              onClick={resetPhone}
              className="mt-4 px-4 py-1.5 rounded-lg bg-cyber-green text-black font-mono font-bold text-xs"
            >
              Lock Device
            </button>
          </div>
        ) : (
          <div className="my-auto">
            {/* 3x4 Numeric Keypad */}
            <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k, idx) => {
                if (k === "") return <div key={idx} />;
                if (k === "del") {
                  return (
                    <button
                      key={idx}
                      onClick={handleBackspace}
                      className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 font-mono text-xs flex items-center justify-center transition-colors mx-auto"
                    >
                      DEL
                    </button>
                  );
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleKeyPress(k)}
                    disabled={lockoutSeconds > 0}
                    className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white font-mono font-medium text-lg flex items-center justify-center transition-all mx-auto border border-white/5"
                  >
                    {k}
                  </button>
                );
              })}
            </div>

            {/* In-Display Fingerprint Sensor */}
            <div className="mt-6 flex flex-col items-center">
              <button
                onMouseDown={handleFingerprintStart}
                onMouseUp={handleFingerprintEnd}
                onTouchStart={handleFingerprintStart}
                onTouchEnd={handleFingerprintEnd}
                disabled={lockoutSeconds > 0}
                className={`w-14 h-14 rounded-full border border-cyber-cyan/40 flex items-center justify-center transition-all relative ${
                  fpScanning
                    ? "bg-cyber-cyan/30 shadow-[0_0_20px_#00f0ff] scale-95"
                    : "bg-cyber-dark hover:bg-cyber-panel"
                }`}
                title="Press and hold to scan"
              >
                <Fingerprint
                  className={`w-8 h-8 transition-colors ${
                    fpScanning ? "text-white" : "text-cyber-cyan"
                  }`}
                />
              </button>
              <span className="text-[10px] font-mono text-cyber-muted mt-1.5">
                {fpScanning ? `Scanning... ${fpProgress}%` : "Press & Hold Sensor"}
              </span>
            </div>
          </div>
        )}

        {/* Bottom Home Indicator */}
        <div className="w-28 h-1 rounded-full bg-white/30 mx-auto mb-2" />
      </div>

      {/* Official Manufacturer Guidance Links for Real Devices */}
      <div className="w-full p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle">
        <h4 className="text-sm font-bold text-white font-mono mb-2">
          Real-World Device Passcode Recovery Guidance
        </h4>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          If you are locked out of an actual physical smartphone, hardware-backed encryption requires official manufacturer procedures:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <a
            href="https://support.apple.com/en-us/118430"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-cyber-dark border border-cyber-borderSubtle hover:border-cyber-green text-slate-200 flex items-center justify-between transition-colors"
          >
            <span>Apple Support: Passcode Reset Procedures</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyber-green" />
          </a>
          <a
            href="https://support.google.com/android/answer/7663172"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-cyber-dark border border-cyber-borderSubtle hover:border-cyber-green text-slate-200 flex items-center justify-between transition-colors"
          >
            <span>Google Android: Official Device Recovery</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyber-green" />
          </a>
        </div>
      </div>
    </div>
  );
};
