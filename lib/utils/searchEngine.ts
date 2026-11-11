import { TOOLS, ToolItem, CATEGORIES } from "@/lib/data/tools";

// Common user search queries mapped directly to the best matching tool slugs
const SYNONYM_MAP: Record<string, string[]> = {
  // Phone & Location
  "phone tracker": ["phone-location-tool", "location-tracker", "exact-location-finder"],
  "phone track": ["phone-location-tool", "location-tracker"],
  "tracker": ["phone-location-tool", "location-tracker", "exact-location-finder", "ip-trace"],
  "track": ["phone-location-tool", "location-tracker", "exact-location-finder", "ip-trace"],
  "track phone": ["phone-location-tool", "location-tracker"],
  "location": ["phone-location-tool", "exact-location-finder", "location-tracker", "ip-trace"],
  "location tracker": ["phone-location-tool", "location-tracker", "exact-location-finder"],
  "location finder": ["exact-location-finder", "phone-location-tool"],
  "gps": ["phone-location-tool", "exact-location-finder", "location-tracker"],
  "satellite": ["phone-location-tool", "satellite-telemetry"],

  // Phone Unlock & Hardware
  "phone unlock": ["phone-unlock-engine", "android-unlock", "iphone-unlock", "screen-lock"],
  "unlock phone": ["phone-unlock-engine", "android-unlock", "iphone-unlock", "screen-lock"],
  "unlock": ["phone-unlock-engine", "android-unlock", "iphone-unlock", "screen-lock", "rare-skin-unlocker"],
  "screen lock": ["phone-unlock-engine", "screen-lock"],
  "pin lock": ["phone-unlock-engine", "screen-lock"],
  "pin": ["phone-unlock-engine", "screen-lock"],
  "passcode": ["phone-unlock-engine", "iphone-unlock", "screen-lock"],
  "pattern lock": ["android-unlock"],
  "android unlock": ["android-unlock", "phone-unlock-engine"],
  "iphone unlock": ["iphone-unlock", "phone-unlock-engine"],
  "bypass": ["phone-unlock-engine", "android-unlock", "account-recovery"],
  "face id": ["face-id-scanner", "iphone-unlock"],
  "fingerprint": ["fingerprint-scanner", "screen-lock"],
  "biometric": ["fingerprint-scanner", "face-id-scanner", "screen-lock"],

  // Recovery & Data
  "recovery": ["phone-data-recovery", "photo-recovery", "account-recovery"],
  "phone recovery": ["phone-data-recovery", "photo-recovery"],
  "photo recovery": ["photo-recovery", "phone-data-recovery"],
  "data recovery": ["phone-data-recovery", "photo-recovery"],
  "deleted photo": ["photo-recovery"],
  "photos": ["photo-recovery"],

  // Virus & BSOD
  "virus": ["phone-virus-scan", "virus-infection", "ransomware", "blue-screen", "cyber-defense"],
  "phone virus": ["phone-virus-scan"],
  "malware": ["phone-virus-scan", "virus-infection"],
  "trojan": ["virus-infection", "phone-virus-scan"],
  "bsod": ["blue-screen"],
  "blue screen": ["blue-screen"],
  "crash": ["blue-screen"],
  "ransomware": ["ransomware"],
  "lock screen": ["phone-unlock-engine", "screen-lock"],

  // Wi-Fi & Network
  "wifi": ["wifi-hacker-engine", "wifi-password-cracker", "wifi-radar", "wifi-speed-test", "network-scanner", "router-admin-tool", "connected-devices", "network-attack"],
  "wi-fi": ["wifi-hacker-engine", "wifi-password-cracker", "wifi-radar", "wifi-speed-test", "network-scanner", "router-admin-tool", "connected-devices", "network-attack"],
  "wifi hacker": ["wifi-hacker-engine", "wifi-password-cracker"],
  "wifi password": ["wifi-password-cracker", "wifi-hacker-engine"],
  "wifi crack": ["wifi-password-cracker", "wifi-hacker-engine"],
  "wifi radar": ["wifi-radar"],
  "wifi speed": ["wifi-speed-test"],
  "speed test": ["wifi-speed-test"],
  "speed": ["wifi-speed-test"],
  "internet speed": ["wifi-speed-test"],
  "router": ["router-admin-tool"],
  "router admin": ["router-admin-tool"],
  "connected devices": ["connected-devices", "network-scanner"],
  "network scanner": ["network-scanner", "connected-devices"],
  "network attack": ["network-attack"],

  // Gaming: Free Fire & BGMI
  "free fire": ["free-fire-hacker", "diamond-generator", "rank-booster", "rare-skin-unlocker", "gaming-id-lookup"],
  "freefire": ["free-fire-hacker", "diamond-generator", "rank-booster", "rare-skin-unlocker", "gaming-id-lookup"],
  "ff": ["free-fire-hacker", "diamond-generator", "rank-booster"],
  "ff diamond": ["diamond-generator", "free-fire-hacker"],
  "diamond": ["diamond-generator", "free-fire-hacker"],
  "diamonds": ["diamond-generator", "free-fire-hacker"],
  "bgmi": ["bgmi-hacker", "uc-generator", "rank-booster", "pro-player-stats", "gaming-ban-checker"],
  "pubg": ["bgmi-hacker", "uc-generator"],
  "uc": ["uc-generator", "bgmi-hacker"],
  "uc generator": ["uc-generator", "bgmi-hacker"],
  "rank booster": ["rank-booster"],
  "skin unlocker": ["rare-skin-unlocker"],
  "esports": ["esports-predictor"],
  "gaming": ["free-fire-hacker", "bgmi-hacker", "diamond-generator", "uc-generator", "rank-booster"],

  // Social Media
  "instagram": ["instagram-protocol", "instagram-hacker-simulator", "followers-counter", "blue-tick-generator", "profile-verification"],
  "insta": ["instagram-protocol", "instagram-hacker-simulator", "followers-counter"],
  "ig": ["instagram-protocol", "instagram-hacker-simulator"],
  "facebook": ["facebook-hacker", "social-media-scanner", "profile-verification"],
  "fb": ["facebook-hacker"],
  "whatsapp": ["whatsapp-hacker", "social-media-scanner"],
  "wa": ["whatsapp-hacker"],
  "snapchat": ["snapchat-hacker", "social-media-scanner"],
  "snap": ["snapchat-hacker"],
  "youtube": ["youtube-hacker", "followers-counter"],
  "yt": ["youtube-hacker"],
  "followers": ["followers-counter", "blue-tick-generator"],
  "follower": ["followers-counter", "blue-tick-generator"],
  "blue tick": ["blue-tick-generator", "profile-verification"],
  "verification": ["profile-verification", "blue-tick-generator"],

  // Money & Payments
  "upi": ["upi-payment-maker", "payment-receipt-maker"],
  "gpay": ["upi-payment-maker", "payment-receipt-maker"],
  "phonepe": ["upi-payment-maker", "payment-receipt-maker"],
  "paytm": ["upi-payment-maker", "payment-receipt-maker"],
  "payment": ["payment-receipt-maker", "upi-payment-maker", "bank-balance-maker"],
  "receipt": ["payment-receipt-maker", "upi-payment-maker"],
  "bank": ["bank-balance-maker", "millionaire-sim", "atm-cash-animation"],
  "bank balance": ["bank-balance-maker", "millionaire-sim"],
  "millionaire": ["millionaire-sim", "bank-balance-maker"],
  "atm": ["atm-cash-animation", "bank-balance-maker"],
  "bitcoin": ["bitcoin-mining", "crypto-profit-calc"],
  "btc": ["bitcoin-mining", "crypto-profit-calc"],
  "mining": ["bitcoin-mining"],
  "crypto": ["crypto-profit-calc", "bitcoin-mining", "trading-sim"],
  "trading": ["trading-sim", "crypto-profit-calc"],

  // IP & Intelligence
  "ip": ["ip-trace", "exact-location-finder", "http-inspector"],
  "ip trace": ["ip-trace"],
  "ip address": ["ip-trace"],
  "dns": ["dns-lookup", "domain-info"],
  "domain": ["domain-info", "dns-lookup"],
  "whois": ["domain-info", "dns-lookup"],
  "headers": ["http-inspector"],
  "http": ["http-inspector"],
  "password": ["password-strength-checker", "wifi-password-cracker"],
  "password strength": ["password-strength-checker"],
  "password checker": ["password-strength-checker"],
  "terminal": ["hacker-terminal", "fake-hacker-terminal"],
  "hacker terminal": ["hacker-terminal", "fake-hacker-terminal"],
  "cli": ["hacker-terminal"],
  "matrix": ["matrix-rain"],
  "matrix rain": ["matrix-rain"],
  "code rain": ["matrix-rain"],

  // AI & Entertainment
  "love": ["love-calculator", "friendship-test"],
  "love calculator": ["love-calculator"],
  "crush": ["love-calculator"],
  "friendship": ["friendship-test", "love-calculator"],
  "lie detector": ["lie-detector"],
  "mind reader": ["mind-reader"],
  "fortune": ["fortune-teller"],
  "future": ["fortune-teller"],
  "roast": ["ai-roast"],
  "ai roast": ["ai-roast"],
  "hacker name": ["hacker-name-gen"],
  "name generator": ["hacker-name-gen"],

  // Spy & Stealth
  "spy": ["spy-camera-detector", "secret-agent-id", "satellite-telemetry"],
  "camera": ["spy-camera-detector", "photo-recovery"],
  "spy camera": ["spy-camera-detector"],
  "hidden camera": ["spy-camera-detector"],
  "secret agent": ["secret-agent-id", "admin-override", "self-destruct"],
  "agent id": ["secret-agent-id"],
  "self destruct": ["self-destruct"],
  "morse": ["morse-code"],
  "morse code": ["morse-code"],
  "admin": ["admin-override"],
  "admin access": ["admin-override"],

  // Quiz
  "quiz": ["phishing-quiz", "cybersecurity-quiz"],
  "phishing": ["phishing-quiz"],
  "cybersecurity quiz": ["cybersecurity-quiz", "phishing-quiz"],
};

export interface SearchMatch {
  tool: ToolItem;
  score: number;
}

/**
 * High-performance smart search scoring engine
 */
export function searchTools(query: string, categoryFilter: string = "all"): ToolItem[] {
  const cleanQ = query.toLowerCase().trim();

  // If query is empty, just filter by category
  if (!cleanQ) {
    if (categoryFilter === "all") return TOOLS;
    return TOOLS.filter((t) => t.categorySlug === categoryFilter);
  }

  // Tokenize query words
  const tokens = cleanQ.split(/\s+/).filter(Boolean);

  // Check synonym map boosts
  const boostedSlugs = new Set<string>();
  if (SYNONYM_MAP[cleanQ]) {
    SYNONYM_MAP[cleanQ].forEach((s) => boostedSlugs.add(s));
  }
  tokens.forEach((tok) => {
    if (SYNONYM_MAP[tok]) {
      SYNONYM_MAP[tok].forEach((s) => boostedSlugs.add(s));
    }
  });

  const matches: SearchMatch[] = [];

  for (const tool of TOOLS) {
    // Category filter check
    if (categoryFilter !== "all" && tool.categorySlug !== categoryFilter) {
      continue;
    }

    let score = 0;
    const nameLower = tool.name.toLowerCase();
    const slugLower = tool.slug.toLowerCase();
    const taglineLower = tool.tagline.toLowerCase();
    const descLower = tool.description.toLowerCase();
    const catLower = tool.categorySlug.toLowerCase();
    const aliases = (tool.aliases || []).map((a) => a.toLowerCase());
    const featuresLower = (tool.features || []).join(" ").toLowerCase();
    const h1Lower = (tool.h1 || "").toLowerCase();

    // 1. Boosted by synonyms (Top Priority)
    if (boostedSlugs.has(tool.slug) || aliases.some((a) => boostedSlugs.has(a))) {
      score += 150;
    }

    // 2. Exact match on slug
    if (slugLower === cleanQ || aliases.includes(cleanQ)) {
      score += 120;
    } else if (slugLower.includes(cleanQ)) {
      score += 80;
    }

    // 3. Exact match on title
    if (nameLower === cleanQ) {
      score += 140;
    } else if (nameLower.startsWith(cleanQ)) {
      score += 90;
    } else if (nameLower.includes(cleanQ)) {
      score += 70;
    }

    // 4. Tagline & H1 full match
    if (taglineLower.includes(cleanQ) || h1Lower.includes(cleanQ)) {
      score += 50;
    }

    // 5. Description full match
    if (descLower.includes(cleanQ)) {
      score += 35;
    }

    // 6. Token matching across all fields
    let tokensMatchedCount = 0;
    for (const tok of tokens) {
      let tokenFound = false;
      if (nameLower.includes(tok)) {
        score += 25;
        tokenFound = true;
      }
      if (slugLower.includes(tok) || aliases.some((a) => a.includes(tok))) {
        score += 20;
        tokenFound = true;
      }
      if (taglineLower.includes(tok) || h1Lower.includes(tok)) {
        score += 15;
        tokenFound = true;
      }
      if (descLower.includes(tok) || featuresLower.includes(tok)) {
        score += 10;
        tokenFound = true;
      }
      if (catLower.includes(tok)) {
        score += 10;
        tokenFound = true;
      }

      if (tokenFound) {
        tokensMatchedCount++;
      }
    }

    // Bonus if ALL tokens match
    if (tokens.length > 1 && tokensMatchedCount === tokens.length) {
      score += 40;
    }

    if (score > 0) {
      matches.push({ tool, score });
    }
  }

  // Sort descending by score
  matches.sort((a, b) => b.score - a.score);

  return matches.map((m) => m.tool);
}
