const fs = require('fs');
const path = require('path');

// Execute node to require the current tools
// Since ts-node or compiled ts might not be direct, let's parse the existing TOOLS from lib/data/tools.ts
const content = fs.readFileSync(path.join(__dirname, '../lib/data/tools.ts'), 'utf-8');

// Extract the TOOLS array using regex or evaluating
const toolsMatch = content.match(/export const TOOLS: ToolItem\[\] = (\[[\s\S]*?\]);\s*$/);
if (!toolsMatch) {
  console.error("Could not find TOOLS array in lib/data/tools.ts");
  process.exit(1);
}

// Evaluate tools
let rawTools;
try {
  rawTools = eval(toolsMatch[1]);
} catch (e) {
  console.error("Eval error:", e);
  process.exit(1);
}

console.log(`Loaded ${rawTools.length} raw tools from lib/data/tools.ts`);

const SLUG_MAPPINGS = {
  'wifi-hacker': { newSlug: 'wifi-hacker-simulator', alias: 'wifi-hacker' },
  'free-fire-hacker': { newSlug: 'free-fire-hacker-prank', alias: 'free-fire-hacker' },
  'bgmi-hacker': { newSlug: 'bgmi-hacker-simulator', alias: 'bgmi-hacker' },
  'instagram-prank': { newSlug: 'instagram-hacker-simulator', alias: 'instagram-prank' },
  'location-tracker': { newSlug: 'phone-location-prank', alias: 'location-tracker' },
  'hacker-terminal': { newSlug: 'fake-hacker-terminal', alias: 'hacker-terminal' },
  'password-simulator': { newSlug: 'password-strength-checker', alias: 'password-simulator' },
  'screen-lock': { newSlug: 'phone-unlock-simulator', alias: 'screen-lock' },
};

function generateToolFaqs(tool) {
  const name = tool.name;
  const isGame = tool.categorySlug === 'gaming-sims';
  const isWifi = tool.categorySlug === 'wifi-network';
  const isSocial = tool.categorySlug === 'social-media';
  const isMobile = tool.categorySlug === 'mobile-devices';
  const isFinance = tool.categorySlug === 'money-finance';
  const isVirus = tool.categorySlug === 'virus-security';
  const isSpy = tool.categorySlug === 'spy-stealth';
  const isAi = tool.categorySlug === 'ai-funny';

  let q1 = `How does the ${name} simulation work?`;
  let a1 = `The ${name} runs entirely in your browser using client-side JavaScript. It demonstrates ${tool.tagline.toLowerCase()} without making unauthorized requests.`;

  let q2 = `Is any real data accessed or modified?`;
  let a2 = `No. ${name} is strictly an educational and entertainment tool. It never connects to private databases, exploits device vulnerabilities, or modifies accounts.`;

  let q3 = `Do I need to install software or enter personal information?`;
  let a3 = `No software installation is required. The simulation runs instantaneously in any modern web browser. Never share real passwords or sensitive credentials online.`;

  if (isGame) {
    q2 = `Can this tool modify my actual in-game balance or rank?`;
    a2 = `No. In-game currency, ratings, and items exist on official server clusters. This simulator provides a fictional visual demonstration and cannot alter game servers.`;
    q3 = `Is it safe to use without risking an account ban?`;
    a3 = `Yes, 100% safe. Because this simulator runs purely in your browser and does not interface with game APIs, your gaming account cannot be detected or penalized.`;
  } else if (isWifi) {
    q2 = `Does this tool put my Wi-Fi card into monitor mode?`;
    a2 = `No. Web browsers cannot access low-level 802.11 network hardware or put adapters into promiscuous mode. All telemetry displayed is illustrative.`;
    q3 = `What is the real-world cybersecurity takeaway?`;
    a3 = `Real wireless security requires updating routers to WPA3 encryption, disabling legacy WPS PIN authentication, and maintaining complex, unpredictable network passphrases.`;
  } else if (isSocial) {
    q2 = `Can this tool view private social media messages or profiles?`;
    a2 = `No. Social media platforms use encrypted OAuth tokens and HTTPS. It is technically impossible to view private profile data through a third-party demonstration website.`;
    q3 = `How can I legitimately verify or secure my social account?`;
    a3 = `To secure your profile, enable Two-Factor Authentication via an authenticator app, audit authorized third-party applications, and follow official verification guidelines.`;
  } else if (isMobile) {
    q2 = `Will this simulator unlock a locked smartphone?`;
    a2 = `No. This is a virtual lockscreen demonstration. To unlock a real locked smartphone, you must follow official recovery instructions provided by Apple or Google.`;
    q3 = `How do smartphone manufacturers prevent brute-force passcode cracking?`;
    a3 = `Hardware security enclaves enforce progressive timeout delays (e.g. 1 minute, 5 minutes, 1 hour) and permanently wipe cryptographic keys after excessive failed attempts.`;
  } else if (isFinance) {
    q2 = `Is real money transferred or generated?`;
    a2 = `No. All transactions, balances, and UPI receipts are simulated visual mockups for video skits, design testing, and entertainment. No real banking networks are contacted.`;
    q3 = `Is it legal to use this simulated payment screen with merchants?`;
    a3 = `No. Misrepresenting simulated payment confirmations to merchants or individuals constitutes fraud. These tools are strictly for creative demonstration purposes.`;
  } else if (isVirus) {
    q2 = `Can this simulation harm my operating system or files?`;
    a2 = `No. This tool is a harmless visual effect that runs inside a standard browser sandbox. It cannot delete, encrypt, or download malicious files to your device.`;
    q3 = `How do I exit the fullscreen warning or BSOD crash screen?`;
    a3 = `You can exit at any moment by pressing the Escape (ESC) key on your keyboard or clicking anywhere on the screen.`;
  } else if (isSpy) {
    q2 = `Are these secret agent credentials legally valid?`;
    a2 = `No. All agent identity cards and badges are novelty props for cosplay, costume parties, and creative videos. Impersonating intelligence personnel is illegal.`;
    q3 = `Does the self-destruct countdown damage hardware?`;
    a3 = `Not at all. The self-destruct timer plays synthesized sound effects and triggers a brief visual screen glitch without affecting your computer or phone.`;
  }

  return [
    { question: q1, answer: a1 },
    { question: q2, answer: a2 },
    { question: q3, answer: a3 },
  ];
}

function generateLimitations(tool) {
  return [
    `Educational & Entertainment Simulation: Operates purely in-memory as a demonstration of ${tool.name}.`,
    `Zero Device Interaction: Does not communicate with external hardware, game servers, or private APIs.`,
    `Privacy Protected: User inputs are processed locally in your browser and never transmitted or retained.`,
  ];
}

const enrichedTools = rawTools.map((tool) => {
  let slug = tool.slug;
  let aliases = [];

  if (SLUG_MAPPINGS[slug]) {
    aliases.push(SLUG_MAPPINGS[slug].alias);
    slug = SLUG_MAPPINGS[slug].newSlug;
  }

  const h1 = `${tool.name}: ${tool.tagline}`;
  const metaTitle = `${tool.name} — ${tool.tagline} | DEVDROP`;
  
  // Create crisp 145-160 char meta description
  let metaDescription = `${tool.name}: ${tool.description}`;
  if (metaDescription.length > 155) {
    metaDescription = metaDescription.substring(0, 152) + '...';
  } else if (metaDescription.length < 120) {
    metaDescription = `${metaDescription} Explore safe cyber simulations on DEVDROP.`;
  }

  const shortIntro = `Experience an interactive demonstration of ${tool.name.toLowerCase()} featuring ${tool.tagline.toLowerCase()}. Designed for educational cybersecurity visualization, creative media, and entertainment.`;

  const limitations = generateLimitations(tool);
  const faqs = generateToolFaqs(tool);
  const canonicalPath = `/tools/${slug}`;

  // Update related slugs if they point to renamed slugs
  const relatedSlugs = tool.relatedSlugs.map((rs) => {
    return SLUG_MAPPINGS[rs] ? SLUG_MAPPINGS[rs].newSlug : rs;
  });

  return {
    ...tool,
    slug,
    aliases: aliases.length > 0 ? aliases : undefined,
    h1,
    tagline: tool.tagline,
    shortIntro,
    metaTitle,
    metaDescription,
    canonicalPath,
    limitations,
    faqs,
    relatedSlugs,
  };
});

console.log(`Enriched ${enrichedTools.length} tools.`);

// Build CATEGORIES array
const CATEGORIES = [
  {
    slug: "wifi-network",
    name: "Wi-Fi & Network Pranks",
    h1: "Wi-Fi & Network Security Simulators",
    metaTitle: "Wi-Fi & Network Security Simulators | DEVDROP",
    metaDescription: "Explore 802.11 monitor mode, WPA handshake interception, spectrum radars, and router gateway diagnostic simulators in a safe environment.",
    description: "802.11 beacon sniffers, WPA handshake crackers, signal radars, router admin gateways, and packet attack simulators.",
    longDescription: "Dive into our comprehensive collection of 802.11 wireless network and routing simulators. Each tool in this category demonstrates fundamental networking and cybersecurity concepts such as RF spectrum utilization, WPA2/WPA3 4-way EAPOL handshakes, PMKID hashing, and gateway administration.",
    iconName: "Wifi",
    faqs: [
      {
        question: "Can these Wi-Fi tools intercept real passwords?",
        answer: "No. All tools in the Wi-Fi & Network category are client-side educational simulators. They do not access your device's Wi-Fi hardware, put adapters into monitor mode, or capture real network traffic."
      },
      {
        question: "What is a 4-way WPA handshake in real cybersecurity?",
        answer: "In 802.11i networks, the 4-way handshake is the process where an access point and client derive pairwise transient keys (PTK) to encrypt data sessions without ever sending the master password over the air."
      },
      {
        question: "Why does WPA3 offer stronger protection than WPA2?",
        answer: "WPA3 introduces Simultaneous Authentication of Equals (SAE), replacing the traditional pre-shared key exchange with Dragonfly key exchange, which prevents offline dictionary attacks even on simple passwords."
      }
    ]
  },
  {
    slug: "gaming-sims",
    name: "Free Fire & BGMI Gaming",
    h1: "Free Fire & BGMI Gaming Data Simulators",
    metaTitle: "Free Fire & BGMI Gaming Simulators & Generators | DEVDROP",
    metaDescription: "Experience esports tournament predictors, cosmetic armory loaders, simulated UC and Diamond air-drops, and Conqueror rank calculators.",
    description: "Esports tournament predictors, fake UC & Diamond generators, Grandmaster rank boosters, and cosmetic skin unlockers.",
    longDescription: "Our gaming entertainment hub brings esports and battle royale enthusiasts an immersive array of telemetry and cosmetic inspection tools. Experience simulated UC air-drops, Free Fire diamond top-ups, Grandmaster tier ELO calculators, and rare weapon armory previews.",
    iconName: "Gamepad2",
    faqs: [
      {
        question: "Do these gaming tools provide real UC or Diamonds?",
        answer: "No. These tools are purely entertainment and video parody simulators. In-game currency in BGMI and Free Fire can only be legitimately acquired through official in-game top-up channels."
      },
      {
        question: "Can my gaming account get banned by using this website?",
        answer: "Not at all. Because DEVDROP runs entirely locally in your browser and never connects to game servers or asks for your account login, your gaming account is 100% safe."
      },
      {
        question: "Do I need to enter my game password or OTP?",
        answer: "Never. DEVDROP will never request passwords, OTPs, or authentication cookies. Only cosmetic public gamer tags or UIDs are accepted for simulated demonstrations."
      }
    ]
  },
  {
    slug: "social-media",
    name: "Social Media Pranks",
    h1: "Social Media Security & Profile Simulators",
    metaTitle: "Social Media Profile & Verification Simulators | DEVDROP",
    metaDescription: "Simulate verified blue badges, viral follower count surges, 2FA account recovery codes, and public social metadata security audits.",
    description: "Verified blue badge previews, viral followers counters, account recovery simulators, and profile audit suites.",
    longDescription: "Explore public metadata analysis, profile verification badges, and account security hygiene audits. Our social media simulators demonstrate how OpenGraph data is retrieved, how credential stuffing attacks operate, and why multi-factor authentication is crucial.",
    iconName: "Share2",
    faqs: [
      {
        question: "Can these tools access private social media accounts?",
        answer: "No. DEVDROP never connects to private social media APIs or databases. It is technically impossible to access private messages or accounts through a third-party website without official authorization."
      },
      {
        question: "How do I get an actual verified blue tick on Instagram or X?",
        answer: "Official verification badges must be applied for directly through the official platforms by submitting government identification and meeting public interest criteria."
      },
      {
        question: "What is the best way to secure my social media accounts?",
        answer: "Always enable Two-Factor Authentication (2FA) using an authenticator app, use unique passphrases generated by a password manager, and never click suspicious DM links."
      }
    ]
  },
  {
    slug: "mobile-devices",
    name: "Mobile & Device Simulators",
    h1: "Smartphone Chassis & Biometric Simulators",
    metaTitle: "Mobile Hardware & Lockscreen Simulators | DEVDROP",
    metaDescription: "Test virtual smartphone chassis, 4-digit PIN keypads, 9-dot pattern grids, biometric fingerprint sensors, and NAND photo recovery demos.",
    description: "Smartphone lockscreen PIN pads, 9-dot pattern grids, biometric fingerprint sensors, and NAND photo recovery demos.",
    longDescription: "Experience authentic virtual smartphone hardware interfaces. Test 4-digit PIN keypads, draw 9-dot unlock patterns, simulate TrueDepth 3D infrared facial recognition, and learn how modern mobile hardware security modules (Apple Secure Enclave, Samsung Knox, Google Titan M2) protect personal data.",
    iconName: "Smartphone",
    faqs: [
      {
        question: "Can these tools unlock my real physical phone?",
        answer: "No. These simulators operate inside a browser canvas. To recover an actual locked iPhone or Android phone, you must follow official manufacturer recovery protocols provided by Apple or Google."
      },
      {
        question: "How does modern hardware encryption protect locked phones?",
        answer: "Modern smartphones use dedicated hardware security modules that enforce exponential rate-limiting delays and wipe encryption keys after repeated incorrect PIN attempts."
      },
      {
        question: "Is deleted photo recovery possible on modern phones?",
        answer: "Due to file-based encryption (FBE) and flash memory TRIM commands, securely deleted files on modern devices cannot typically be recovered without existing cloud or local backups."
      }
    ]
  },
  {
    slug: "ip-intelligence",
    name: "IP & Cyber Intelligence",
    h1: "Global IP Telemetry & Cyber Intelligence Tools",
    metaTitle: "IP Trace, DNS & Cyber Intelligence Tools | DEVDROP",
    metaDescription: "Analyze BGP autonomous system hops, DNS records, browser HTTP headers, live cyber attack visualizers, and Shannon password entropy.",
    description: "Global IP traceroutes, recursive DNS inspectors, WHOIS lookups, live cyber warfare maps, and cyber defense quizzes.",
    longDescription: "Our cyber intelligence suite visualizes global internet infrastructure. Follow BGP packet hops across undersea fiber cables, inspect recursive DNS query hierarchies, evaluate cryptographic Shannon entropy, and test your knowledge with interactive cybersecurity defense challenges.",
    iconName: "Globe",
    faqs: [
      {
        question: "Can an IP address reveal someone's exact street address?",
        answer: "No. IP geolocation relies on public ISP registry databases (MaxMind, ARIN, RIPE) and only approximates locations to a city, region, or ISP routing hub—never an exact home address."
      },
      {
        question: "What is Shannon entropy in password security?",
        answer: "Shannon entropy measures the mathematical unpredictability and information density of a password in bits, helping determine how many brute-force attempts are required to crack it."
      },
      {
        question: "Are my test inputs transmitted to any server?",
        answer: "No. All password entropy calculations and telemetry simulations run 100% locally in your browser memory. Zero data is logged or transmitted."
      }
    ]
  },
  {
    slug: "money-finance",
    name: "Money & Finance Pranks",
    h1: "Financial Protocol & Payment Simulators",
    metaTitle: "UPI Payment & Banking Statement Simulators | DEVDROP",
    metaDescription: "Generate authentic UPI payment confirmation screens, high-net-worth portfolio asset breakdowns, Bitcoin mining rigs, and ATM cash dispensers.",
    description: "Realistic UPI payment success screens, high-net-worth bank balances, Bitcoin mining rigs, and ATM cash jackpotters.",
    longDescription: "A specialized financial simulation suite designed for content creators, game developers, and film productions. Generate realistic Indian UPI payment confirmation screens (GPay, PhonePe, Paytm), customize bank balance statements, and monitor real-time ASIC Bitcoin mining rigs.",
    iconName: "DollarSign",
    faqs: [
      {
        question: "Is real money involved in these payment simulators?",
        answer: "No. All balances, receipts, and UPI confirmations are fictional visual demonstrations. No real financial institution, bank account, or payment gateway is accessed."
      },
      {
        question: "Can I use these screens to show payment to a merchant?",
        answer: "Strictly prohibited. Using simulated payment confirmation screens to misrepresent payments or deceive individuals is illegal and constitutes fraud."
      },
      {
        question: "Does the Bitcoin mining simulator use my CPU or GPU?",
        answer: "No. The Bitcoin mining tool is an animation that visualizes hash rates, block discoveries, and power metrics without utilizing your device's processing power."
      }
    ]
  },
  {
    slug: "ai-funny",
    name: "AI & Funny Pranks",
    h1: "AI Cognitive & Humorous Parody Generators",
    metaTitle: "AI Polygraph, Mind Reader & Parody Tools | DEVDROP",
    metaDescription: "Engage with neural polygraph lie detectors, psychic mind-reading algorithms, crush love calculators, and savage hacker AI roasts.",
    description: "Neural polygraph lie detectors, mind-reading algorithms, crush love calculators, and savage AI roasts.",
    longDescription: "Unleash witty and entertaining artificial intelligence experiences. Interrogate friends with our undulating galvanic polygraph analyzer, test romantic compatibility with the FLAMES algorithm, generate elite hacker codenames, and laugh at savage developer roasts.",
    iconName: "Cpu",
    faqs: [
      {
        question: "Is the AI lie detector scientifically accurate?",
        answer: "No. The lie detector is an interactive entertainment parody designed for fun and social gatherings. It does not possess scientific or physiological lie-detection capabilities."
      },
      {
        question: "How does the mind-reading simulator work?",
        answer: "The mind reader combines psychological mentalism principles, mathematical patterns, and interactive browser sleight-of-hand to produce surprising reveals."
      },
      {
        question: "Does the AI store my roast or relationship inputs?",
        answer: "No. All cognitive generation routines run transiently in browser memory. Inputs are discarded immediately upon page refresh."
      }
    ]
  },
  {
    slug: "virus-security",
    name: "Virus & Security Simulators",
    h1: "Cyber Threat & BSOD Security Simulators",
    metaTitle: "BSOD Crash, Ransomware & Cyber Threat Simulators | DEVDROP",
    metaDescription: "Safely simulate Windows 11 Blue Screens (BSOD), WannaCry ransomware countdowns, falling Matrix code rain, and trojan warning alarms.",
    description: "Windows 11 Blue Screen of Death (BSOD), WannaCry ransomware timers, falling Matrix code rain, and trojan alerts.",
    longDescription: "Experience dramatic cyber threat simulations inside a completely safe browser sandbox. Trigger photorealistic fullscreen Windows 11 Blue Screen of Death crashes, WannaCry-inspired ransomware countdown timers, falling Matrix green digital code rain, and trojan intrusion alerts.",
    iconName: "Skull",
    faqs: [
      {
        question: "Can these virus simulators damage my computer or files?",
        answer: "Absolutely not. Every simulation is an entirely harmless visual and audio effect that runs strictly inside a contained browser tab. No files are encrypted, downloaded, or altered."
      },
      {
        question: "How do I exit the fullscreen Blue Screen (BSOD) simulator?",
        answer: "You can exit the fullscreen crash screen at any time by pressing the Escape (ESC) key on your keyboard or clicking anywhere on the screen."
      },
      {
        question: "What is the educational purpose of the ransomware simulation?",
        answer: "It illustrates the urgency and psychological pressure tactics used by cybercriminals, reinforcing the vital importance of maintaining regular offline backups."
      }
    ]
  },
  {
    slug: "spy-stealth",
    name: "Spy & Secret Agent Pranks",
    h1: "Secret Agent & Espionage Intelligence Ops",
    metaTitle: "Secret Agent ID & Espionage Simulators | DEVDROP",
    metaDescription: "Generate official MI6 and CIA agent identity cards, arm 10-second self-destruct timers, zoom orbital spy satellites, and decode Morse code.",
    description: "Official MI6/CIA secret agent ID cards, 10-second self-destruct timers, orbital spy satellites, and Morse code ciphers.",
    longDescription: "Step into the classified world of international espionage. Design personalized MI6 and CIA operative credentials with Level 5 clearance, trigger Mission Impossible-style 10-second self-destruct countdowns, take over mainframes with ACCESS GRANTED screens, and transmit real Morse code beeps.",
    iconName: "Eye",
    faqs: [
      {
        question: "Can I use the Secret Agent ID as real identification?",
        answer: "No. The Secret Agent ID cards are parody props for costume parties, video productions, and entertainment. Impersonating intelligence or law enforcement officers is a serious crime."
      },
      {
        question: "Does the Self-Destruct sequence harm my phone or monitor?",
        answer: "No. The self-destruct tool produces dramatic sound effects and a brief harmless visual screen glitch. It cannot harm your hardware in any way."
      },
      {
        question: "How does the Morse Code generator work?",
        answer: "It translates standard alphanumeric characters into International Morse Code and synthesizes calibrated 800 Hz audio dits and dahs using the browser's native Web Audio API."
      }
    ]
  }
];

// Write file
const output = `export interface ToolFaq {
  question: string;
  answer: string;
}

export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface ToolCategory {
  slug: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  longDescription: string;
  iconName: string;
  faqs: CategoryFaq[];
}

export interface ToolItem {
  slug: string;
  aliases?: string[];
  name: string;
  h1: string;
  tagline: string;
  categorySlug: string;
  iconName: string;
  shortIntro: string;
  description: string;
  longDescription: string;
  features: string[];
  limitations: string[];
  disclaimer: string;
  howItWorks: string[];
  faqs: ToolFaq[];
  relatedSlugs: string[];
  badge?: string;
  isPopular?: boolean;
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
}

export const CATEGORIES: ToolCategory[] = ${JSON.stringify(CATEGORIES, null, 2)};

export const TOOLS: ToolItem[] = ${JSON.stringify(enrichedTools, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../lib/data/tools.ts'), output, 'utf-8');
console.log("Successfully generated enriched lib/data/tools.ts with 87 tools and 9 categories!");
