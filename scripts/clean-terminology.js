const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../lib/data/tools.ts');
let toolsCode = fs.readFileSync(toolsPath, 'utf-8');

// Replace Category names
const categoryReplacements = {
  "Wi-Fi & Network Pranks": "Wi-Fi & Network Security",
  "Social Media Pranks": "Social Media Intelligence",
  "Money & Finance Pranks": "Money & Financial Protocols",
  "AI & Funny Pranks": "AI Cognitive & Social Analytics",
  "Virus & Security Simulators": "Malware & Threat Security Lab",
  "Spy & Secret Agent Pranks": "Classified Espionage Operations",
  "Mobile & Device Simulators": "Mobile Hardware & Security",
};

// Map tool names to clean, serious, high-tech names
const nameReplacements = {
  "Wi-Fi Hacker Simulator": "Wi-Fi Network Penetration Suite",
  "Fake Wi-Fi Password Cracker": "Wi-Fi WPA Key Decryption Engine",
  "Wi-Fi Signal Radar": "Wi-Fi Spectrum Frequency Radar",
  "Router Admin Hacker Prank": "Router Gateway Admin Exploit Console",
  "Network Scanner Simulator": "Network Subnet Port Scanner",
  "Fake Connected Devices Scanner": "Connected LAN Device Explorer",
  "Wi-Fi Speed Test": "Wi-Fi Multi-Stream Throughput Benchmark",
  "Cyber Network Attack Simulator": "Volumetric Network Stress Tester",

  "Free Fire Account Penetration Simulator": "Free Fire Account Security Auditor",
  "BGMI Account Penetration Simulator": "BGMI Battlegrounds Profile Auditor",
  "Fake UC Generator Simulator": "Unknown Cash (UC) Credit Allocator",
  "Fake Diamonds Generator": "Diamond Air-Drop Resource Loader",
  "Fake Rank Booster Simulator": "Conqueror ELO Rank Calculator",
  "Fake Rare Skin Unlocker": "Rare Cosmetic Armory Loader",
  "Gaming ID Lookup Demo": "Gaming ID & Combat Telemetry Inspector",
  "Fake Pro Player Stats": "Esports Tournament Champion Stat Card",
  "Gaming Ban Checker Demo": "Anti-Cheat Server Blacklist Auditor",
  "Esports Tournament Predictor": "Esports Tournament Victory Predictor",

  "Instagram Profile Security Auditor": "Instagram Public Profile Auditor",
  "Facebook Hacker Simulator": "Facebook Graph API Token Auditor",
  "Snapchat Hacker Simulator": "Snapchat Ephemeral Protocol Auditor",
  "WhatsApp Hacker Prank": "WhatsApp Pairing Protocol Inspector",
  "YouTube Channel Hacker Simulator": "YouTube Studio Analytics Auditor",
  "Fake Followers Counter": "Live Social Followers Ticker",
  "Fake Blue Tick Generator": "Verified Blue Badge Profile Card",
  "Fake Profile Verification": "Digital Identity Verification Inspector",
  "Social Media Security Scanner": "Social Media Breach Exposure Scanner",
  "Fake Account Recovery Simulator": "2FA Account Recovery Protocol",

  "Satellite Location Tracker": "Satellite Telemetry Coordinate Triangulator",
  "Mobile Security Auditor": "Mobile Kernel & Keystore Security Auditor",
  "Forgotten Screen Lock Simulator": "Smartphone Screen Lock Interface",
  "Android Unlock Simulator": "Android Pattern Lock Diagnostic",
  "iPhone Unlock Simulator": "iPhone Secure Enclave Passcode Diagnostic",
  "Fake Fingerprint Scanner": "In-Display Biometric Optical Scanner",
  "Fake Face ID Scanner": "3D TrueDepth Facial Geometry Scanner",
  "Phone Data Recovery Simulator": "NAND Flash Deep Data Recovery Utility",
  "Fake Deleted Photo Recovery": "Photo Cache & EXIF Reconstruction Utility",
  "Fake Spy Camera Detector Demo": "RF Bug & Spy Camera Lens Detector",
  "Phone Virus Scan Simulator": "Mobile Malware & Threat Scanner",

  "Global IP Traceroute Visualizer": "Global BGP Traceroute Visualizer",
  "Fake Exact Location Finder": "Targeted Street Coordinate Locator",
  "Cyberpunk Hacker Terminal": "Cyberpunk Underground Terminal CLI",
  "Digital Footprint Education Demo": "Digital Footprint Exposure Analyzer",
  "DNS Lookup": "Recursive DNS Record Resolver",
  "Domain Information Lookup": "Domain WHOIS & Registrar Inspector",
  "HTTP Header Inspector": "HTTP Protocol Header & TLS Inspector",
  "Password Strength Checker": "Password Cryptographic Entropy Analyzer",
  "Fake Cyber Attack Visualizer": "Global Cyber Attack Warfare Map",
  "Cybersecurity Quiz": "Cyber Defense Certification Challenge",
  "Port Scanner Simulator": "TCP Port & Firewall Vulnerability Scanner",

  "Fake Bank Balance Generator": "Bank Account Balance Statement Previewer",
  "Fake UPI Payment Success Screen": "UPI Payment Transaction Receipt Generator",
  "Fake Millionaire Simulator": "High-Net-Worth Portfolio Tracker",
  "Fake Crypto Profit Calculator": "Crypto Investment Profit & ROI Calculator",
  "Fake Bitcoin Mining Simulator": "ASIC Bitcoin Mining Rig Monitor",
  "Fake ATM Hacker Animation": "ATM Cash Dispenser Protocol Interface",
  "Fake Payment Receipt Maker": "Digital Payment Invoice & Receipt Generator",
  "Virtual Trading Simulator": "High-Leverage Futures Trading Terminal",
  "Fake Credit Card Validator": "Credit Card Luhn Checksum Validator",

  "AI Neural Polygraph Analyzer": "AI Neural Polygraph & Vocal Stress Analyzer",
  "Fake Mind Reader": "Neural Brainwave Mind Reader",
  "Fake Future Predictor": "Cyber Oracle Future Predictor",
  "Crush Love Calculator": "Biometric Love Compatibility Meter",
  "Friendship Compatibility Test": "Friendship Loyalty & Compatibility Index",
  "Fake Voice Analyzer": "Vocal Frequency & Acoustic Analyzer",
  "Hacker Name Generator": "Underground Hacker Callsign Creator",
  "Fake Personality Scanner": "AI Cognitive Personality Scanner",
  "AI Roast Generator": "AI Savage Tech & Profile Roaster",
  "Random Fortune Generator": "Cryptographic Fortune Cookie & Oracle",
  "Fake Hacker IQ Test": "Cyber Aptitude & Cognitive IQ Test",

  "Fake Virus Infection Screen": "Critical System Security Threat Alert",
  "Fake Ransomware Screen": "Encrypted Files Security Lockdown",
  "Fake Blue Screen Simulator": "Windows Blue Screen System Crash (BSOD)",
  "Matrix Code Rain": "Matrix Green Digital Stream Rain",
  "Fake System Breach Alert": "Enterprise Firewall Intrusion Alert",
  "Fake Data Decryption Animation": "Hexadecimal Data Decryption Visualizer",
  "Cyber Defense Challenge": "Firewall Defense & Packet Interceptor",
  "Phishing Awareness Quiz": "Phishing Detection & Threat Audit",
  "DDoS Mitigation Simulator": "DDoS Defense & Traffic Scrubbing Center",
  "Zero-Day Sandbox Simulator": "Zero-Day Malware Sandbox Environment",

  "Satellite Hacker Prank": "Orbital Reconnaissance Satellite Telemetry",
  "Secret Agent ID Generator": "Secret Agent Intelligence Credential Card",
  "Self-Destruct Screen": "Hardware Self-Destruct Protocol",
  "Admin Access Prank": "Root Superuser Mainframe Access Protocol",
  "Fake Night Vision Camera": "Tactical Night Vision Surveillance Lens",
  "Wiretap Audio Interceptor": "Wiretap Radio Frequency Interceptor",
  "Secret Agent Morse Code Cipher": "Secret Agent Morse Code Cipher",
};

// Apply Category replacements
for (const [oldCat, newCat] of Object.entries(categoryReplacements)) {
  toolsCode = toolsCode.split(oldCat).join(newCat);
}

// Apply Name replacements
for (const [oldName, newName] of Object.entries(nameReplacements)) {
  toolsCode = toolsCode.split(oldName).join(newName);
}

// Strip words like "simulation", "simulator", "prank", "fake" from meta titles, descriptions, and taglines
toolsCode = toolsCode.replace(/\bFake\s+/g, "");
toolsCode = toolsCode.replace(/\bfake\s+/g, "");
toolsCode = toolsCode.replace(/\bPrank\b/g, "Protocol");
toolsCode = toolsCode.replace(/\bprank\b/g, "tool");
toolsCode = toolsCode.replace(/\bSimulator\b/g, "Suite");
toolsCode = toolsCode.replace(/\bsimulator\b/g, "engine");
toolsCode = toolsCode.replace(/\bSimulation\b/g, "Diagnostic");
toolsCode = toolsCode.replace(/\bsimulation\b/g, "diagnostic");
toolsCode = toolsCode.replace(/\bsimulated\b/g, "live");
toolsCode = toolsCode.replace(/\bSimulated\b/g, "Live");

fs.writeFileSync(toolsPath, toolsCode, 'utf-8');
console.log("Successfully cleaned lib/data/tools.ts of prank/fake/simulator terminology!");
