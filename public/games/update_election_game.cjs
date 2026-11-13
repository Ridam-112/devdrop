const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '44_election_mayhem_voting_battle.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add CSS for Newspaper Clipping & Meme Soundboard, and update .roster-grid
const cssToInsert = `
    /* Newspaper Clipping in Modal */
    .newspaper-clip {
      width: 100%;
      background: #fef3c7;
      color: #0f172a;
      border: 2px solid #b45309;
      border-radius: 10px;
      padding: 10px 14px;
      margin-bottom: 14px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
      transform: rotate(-0.5deg);
      text-align: left;
    }
    .newspaper-topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid #d97706;
      padding-bottom: 4px;
      margin-bottom: 6px;
      font-size: 11px;
      font-weight: 700;
      color: #78350f;
      letter-spacing: 0.5px;
    }
    .newspaper-tag {
      background: #dc2626;
      color: #fff;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 900;
    }
    .newspaper-headline {
      font-family: 'Hind Siliguri', 'Times New Roman', serif;
      font-size: 15px;
      font-weight: 800;
      line-height: 1.35;
      color: #1c1917;
    }

    /* Live Meme Soundboard Bar */
    .meme-soundboard {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(250, 204, 21, 0.3);
      border-radius: 12px;
      padding: 6px 10px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    .soundboard-label {
      font-size: 12px;
      font-weight: 800;
      color: #facc15;
    }
    .btn-soundboard {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      padding: 5px 12px;
      border-radius: 8px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .btn-soundboard:hover {
      background: #facc15;
      color: #0f172a;
      transform: scale(1.04);
    }
`;

content = content.replace('.jhogra-actions {', `${cssToInsert}\n    .jhogra-actions {`);

// Update .roster-grid minmax to 240px and max-width 1250px
content = content.replace(
  'grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n      gap: 16px;\n      width: 100%;\n      max-width: 1100px;',
  'grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n      gap: 14px;\n      width: 100%;\n      max-width: 1250px;'
);

// 2. Add playLaughTrack to AudioMemeEngine
const laughMethod = `
      playLaughTrack() {
        this.init();
        const now = this.ctx.currentTime;
        for (let i = 0; i < 7; i++) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320 + (i % 2 === 0 ? 80 : 0), now + i * 0.11);
          osc.frequency.exponentialRampToValueAtTime(200, now + i * 0.11 + 0.08);
          gain.gain.setValueAtTime(0.25, now + i * 0.11);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.11 + 0.09);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.11);
          osc.stop(now + i * 0.11 + 0.1);
        }
      }
`;

content = content.replace('speakText(text, lang = \'bn-IN\') {', `${laughMethod}\n      speakText(text, lang = 'bn-IN') {`);

// 3. Add Newspaper Clipping in Outcome Modal
const newspaperHTML = `
        <!-- Satirical Newspaper Front Page Clipping -->
        <div class="newspaper-clip" id="newspaperClip">
          <div class="newspaper-topbar">
            <span>📰 দ্য মর্নিং টেলিগ্রাফ • তাজা খবর</span>
            <span class="newspaper-tag">🚨 ব্রেকিং হেডলাইন</span>
          </div>
          <div class="newspaper-headline" id="outcomeNewspaperHeadline">"রাস্তা না বানিয়ে ভাইয়ের অ্যাকাউন্টে ৫০০ কোটি!"</div>
        </div>
`;

content = content.replace(
  '<div class="outcome-desc" id="outcomeModalDesc"></div>',
  `<div class="outcome-desc" id="outcomeModalDesc"></div>\n${newspaperHTML}`
);

// 4. Add Meme Soundboard in TV Studio (#viewDebate)
const soundboardHTML = `
        <!-- Live Interactive Meme Soundboard Bar -->
        <div class="meme-soundboard">
          <div class="soundboard-label">🔊 মিম সাউন্ডবোর্ড:</div>
          <button class="btn-soundboard" onclick="sound.speakText('দ্যা নেশন ওয়ান্টস টু নো!'); sound.playGavel();">
            📢 অর্ণব: "Nation Wants to Know!"
          </button>
          <button class="btn-soundboard" onclick="sound.playAirhorn();">
            🎺 এয়ারহর্ন ব্লাস্ট
          </button>
          <button class="btn-soundboard" onclick="sound.playVineBoom();">
            💥 ভাইন বুম
          </button>
          <button class="btn-soundboard" onclick="sound.playLaughTrack(); sound.playSlap();">
            👏 ঠোক্কো তালি!
          </button>
        </div>
`;

content = content.replace(
  '<!-- Interactive Jhogra Response Buttons -->',
  `${soundboardHTML}\n        <!-- Interactive Jhogra Response Buttons -->`
);

// 5. Add Yogi and Nitish to LEADERS array
const yogiLeader = `      {
        id: 'yogi',
        name: 'যোগী আদিত্যনাথ',
        alias: 'বুলডোজার বাবা (Action Hero)',
        symbol: '🚜',
        tagline: 'আইন নিজের হাতে নিলে গাড়ি কিন্তু উল্টাবে!',
        quote: '"অপরাধীদের মাফ করা হবে না! বুলডোজার প্রস্তুত!"',
        speechQuote: 'অপরাধীদের বাড়ি গুঁড়িয়ে দিতে বুলডোজার প্রস্তুত!',
        color: '#ea580c',
        specialMove: 'বুলডোজার সুপার ক্র্যাশ পঞ্চ!',
        memeSlogan: '"বুলডোজার চলবে!"',
        svgAvatar: createYogiSVG()
      },
      {
        id: 'nitish',
        name: 'নীতিশ কুমার',
        alias: 'পাল্টু কুমার (U-Turn Master)',
        symbol: '🏹',
        tagline: 'জোট যেটাই হোক, কুরসি কিন্তু আমারই!',
        quote: '"আমি নীতি আর ন্যায়ের সাথে আছি, তাই ডিগবাজি খাই!"',
        speechQuote: 'আমি নীতি আর ন্যায়ের সাথে আছি, তাই ডিগবাজি খাই!',
        color: '#059669',
        specialMove: '১৮০ ডিগ্রি ডিগবাজি জাম্প!',
        memeSlogan: '"ডিগবাজি জিন্দাবাদ!"',
        svgAvatar: createNitishSVG()
      },`;

content = content.replace(
  '        svgAvatar: createTharoorSVG()\n      }\n    ];',
  `        svgAvatar: createTharoorSVG()\n      },\n${yogiLeader}\n    ];`
);

// 6. Add Yogi & Nitish SVGs
const yogiAndNitishSVGs = `
    function createYogiSVG() {
      return \`<svg viewBox="0 0 100 100" width="75" height="75">
        <circle cx="50" cy="50" r="46" fill="#ffedd5"/>
        <path d="M20 88 Q50 68 80 88 L80 100 L20 100 Z" fill="#ea580c"/>
        <path d="M40 76 Q50 78 60 76 L64 100 L36 100 Z" fill="#f97316"/>
        <circle cx="50" cy="46" r="25" fill="#fed7aa"/>
        <rect x="47" y="27" width="6" height="12" rx="3" fill="#dc2626"/>
        <line x1="43" y1="33" x2="57" y2="33" stroke="#facc15" stroke-width="2"/>
        <circle cx="24" cy="48" r="3" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
        <circle cx="76" cy="48" r="3" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
        <ellipse cx="42" cy="44" rx="3.5" ry="3" fill="#000"/><ellipse cx="58" cy="44" rx="3.5" ry="3" fill="#000"/>
        <path d="M44 56 Q50 54 56 56" stroke="#000" stroke-width="2.5" fill="none"/>
      </svg>\`;
    }
    function createNitishSVG() {
      return \`<svg viewBox="0 0 100 100" width="75" height="75">
        <circle cx="50" cy="50" r="46" fill="#dcfce7"/>
        <path d="M22 88 Q50 68 78 88 L78 100 L22 100 Z" fill="#ffffff"/>
        <path d="M30 84 Q50 74 70 84 L72 100 L28 100 Z" fill="#059669"/>
        <circle cx="50" cy="46" r="24" fill="#fde68a"/>
        <path d="M25 38 Q30 22 50 24 Q70 22 75 38 Q74 26 50 28 Q26 26 25 38 Z" fill="#94a3b8"/>
        <rect x="36" y="38" width="11" height="8" rx="2" fill="none" stroke="#334155" stroke-width="1.8"/>
        <rect x="53" y="38" width="11" height="8" rx="2" fill="none" stroke="#334155" stroke-width="1.8"/>
        <line x1="47" y1="42" x2="53" y2="42" stroke="#334155" stroke-width="1.8"/>
        <circle cx="41.5" cy="42" r="2" fill="#000"/><circle cx="58.5" cy="42" r="2" fill="#000"/>
        <path d="M38 52 Q50 56 62 52 Q50 50 38 52 Z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1"/>
        <path d="M44 57 Q52 61 58 56" stroke="#000" stroke-width="2" fill="none"/>
      </svg>\`;
    }
`;

content = content.replace(
  'function createTharoorSVG() {',
  `${yogiAndNitishSVGs}\n    function createTharoorSVG() {`
);

// 7. Update DILEMMAS to include newspaper headlines for each choice
content = content.replace(
  "dialogue: 'রাস্তার কাজ শেষ! মসৃণ ৬-লেনের হাইওয়েতে হু হু করে গাড়ি ছুটছে!'",
  "dialogue: 'রাস্তার কাজ শেষ! মসৃণ ৬-লেনের হাইওয়েতে হু হু করে গাড়ি ছুটছে!',\n            newspaperHeadline: '📰 \"রাতারাতি চকচকে ৬-লেনের হাইওয়ে! বিরোধীদের মুখে কুলুপ, গতির ঝড়!\"'"
);
content = content.replace(
  "dialogue: '৫ বছর কেটে গেল! রাস্তা আগের মতোই ভাঙা, ফাইল টেবিলে ধুলো খাচ্ছে!'",
  "dialogue: '৫ বছর কেটে গেল! রাস্তা আগের মতোই ভাঙা, ফাইল টেবিলে ধুলো খাচ্ছে!',\n            newspaperHeadline: '📰 \"ফিতা কাটতেই ৫০ কোটি খরচ! মূল কাজের ফাইল ধুলো খাচ্ছে লাল ফিতের বাঁধনে!\"'"
);
content = content.replace(
  "dialogue: 'পকেটে ৫০০ কোটি টাকা এলো! কিন্তু রাস্তায় মানুষ চটি ছুড়ছে ও বিক্ষোভ করছে!'",
  "dialogue: 'পকেটে ৫০০ কোটি টাকা এলো! কিন্তু রাস্তায় মানুষ চটি ছুড়ছে ও বিক্ষোভ করছে!',\n            newspaperHeadline: '📰 \"রাস্তা উধাও, ভাইয়ের একাউন্টে ৫০০ কোটি! ইডি অফিসে চা খাওয়ার ডাক!\"'"
);
content = content.replace(
  "dialogue: 'পাবলিক রেগে গিয়ে মন্ত্রীর কুশপুতুল পোড়াচ্ছে!'",
  "dialogue: 'পাবলিক রেগে গিয়ে মন্ত্রীর কুশপুতুল পোড়াচ্ছে!',\n            newspaperHeadline: '📰 \"হাইওয়েতে হামাগুড়ির সরকারি নিদান! হাসির খোরাক রাজ্য সরকার!\"'"
);

// Dilemma 2 (Hospital)
content = content.replace(
  "dialogue: 'রোগীদের পরিবার ক্ষোভে ফেটে পড়ে হাসপাতালের কাচ ভেঙে দিল!'",
  "dialogue: 'রোগীদের পরিবার ক্ষোভে ফেটে পড়ে হাসপাতালের কাচ ভেঙে দিল!',\n            newspaperHeadline: '📰 \"মেয়াদোত্তীর্ণ ওষুধ কেলেঙ্কারি! ভাইপোর ফার্মেসিতে সিবিআই হানা!\"'"
);
content = content.replace(
  "dialogue: 'হাসপাতাল আধুনিক হলো! রোগীরা বিনামূল্যে পূর্ণাঙ্গ চিকিৎসা পাচ্ছে!'",
  "dialogue: 'হাসপাতাল আধুনিক হলো! রোগীরা বিনামূল্যে পূর্ণাঙ্গ চিকিৎসা পাচ্ছে!',\n            newspaperHeadline: '📰 \"হাসপাতালে ৩০০০ বিশ্বমানের আইসিইউ বেড! বিনামূল্যে চিকিৎসায় স্বস্তি!\"'"
);
content = content.replace(
  "dialogue: 'নেতারা বিদেশে সেলফি তুলছে, হাসপাতালে রোগীদের কান্না থামছে না!'",
  "dialogue: 'নেতারা বিদেশে সেলফি তুলছে, হাসপাতালে রোগীদের কান্না থামছে না!',\n            newspaperHeadline: '📰 \"ভেন্টিলেটর ছেড়ে আল্পসে বিধায়কদের স্নো-স্কিয়িং! ক্ষোভে ফুঁসছে রাজ্য!\"'"
);
content = content.replace(
  "dialogue: 'ডাক্তাররা ক্ষোভে দল বেঁধে গণ-ইস্তফা দিলেন!'",
  "dialogue: 'ডাক্তাররা ক্ষোভে দল বেঁধে গণ-ইস্তফা দিলেন!',\n            newspaperHeadline: '📰 \"অক্সিজেনের বদলে পার্কে অনুলোম-বিলোমের ফতোয়া! ডাক্তারদের গণ-ইস্তফা!\"'"
);

// Dilemma 3 (Kisan)
content = content.replace(
  "dialogue: 'কৃষকরা কোনো বিমার টাকাই পেল না, ঋণের দায়ে মাঠেই বসে রইল!'",
  "dialogue: 'কৃষকরা কোনো বিমার টাকাই পেল না, ঋণের দায়ে মাঠেই বসে রইল!',\n            newspaperHeadline: '📰 \"২০০ পাতার বিমা ফর্মে নাকানি-চোবানি! হতাশায় মাথায় হাত কৃষকের!\"'"
);
content = content.replace(
  "dialogue: 'কৃষকদের মুখে হাসি! অ্যাকাউন্টে সরাসরি ক্ষতিপূরণের টাকা ঢুকতেই মিষ্টি বিলি!'",
  "dialogue: 'কৃষকদের মুখে হাসি! অ্যাকাউন্টে সরাসরি ক্ষতিপূরণের টাকা ঢুকতেই মিষ্টি বিলি!',\n            newspaperHeadline: '📰 \"সরাসরি একাউন্টে ঢুকলো ₹২৫,০০০! কৃষকের মুখে হাসি, ঋণমুক্ত চাষি!\"'"
);
content = content.replace(
  "dialogue: 'কৃষকদের ট্রাক্টর ব্যারিকেড ভেঙে মন্ত্রীর বাড়ির দিকে রওনা দিল!'",
  "dialogue: 'কৃষকদের ট্রাক্টর ব্যারিকেড ভেঙে মন্ত্রীর বাড়ির দিকে রওনা দিল!',\n            newspaperHeadline: '📰 \"অনাহারের মাঝে ফাইভ-স্টারে কাভিয়ার পার্টি! মন্ত্রীর বাড়ি ঘেরাও ট্রাক্টরের!\"'"
);
content = content.replace(
  "dialogue: 'কৃষকরা শুকনো ফসলের ছাই ছুড়ে মন্ত্রীর গাড়ি আটকে দিল!'",
  "dialogue: 'কৃষকরা শুকনো ফসলের ছাই ছুড়ে মন্ত্রীর গাড়ি আটকে দিল!',\n            newspaperHeadline: '📰 \"বৃষ্টি নামাতে সরকারি রেইন ড্যান্সের সার্কুলার! ছাই ছুড়ে বিক্ষোভ চাষিদের!\"'"
);

// Dilemma 4 (Power)
content = content.replace(
  "dialogue: 'কারেন্ট তো এলোই না, ইলেকট্রিক বিলের বোঝা মানুষের মাথায় চাপল!'",
  "dialogue: 'কারেন্ট তো এলোই না, ইলেকট্রিক বিলের বোঝা মানুষের মাথায় চাপল!',\n            newspaperHeadline: '📰 \"অন্ধকারে রাজ্যবাসী, বিদ্যুৎ মাফিয়াদের সাথে নেতার গোপন কমিশন ফাঁস!\"'"
);
content = content.replace(
  "dialogue: 'পাবলিক ক্ষুব্ধ হয়ে মন্ত্রীর ছবিওয়ালা তালপাতার পাখা ছুড়ে ফেলে দিল!'",
  "dialogue: 'পাবলিক ক্ষুব্ধ হয়ে মন্ত্রীর ছবিওয়ালা তালপাতার পাখা ছুড়ে ফেলে দিল!',\n            newspaperHeadline: '📰 \"লোডশেডিংয়ে নেতার ছবিওয়ালা তালপাতার পাখা বিতরণ! রাগে রাস্তায় ছুঁড়ল জনতা!\"'"
);
content = content.replace(
  "dialogue: 'গোটা রাজ্য আলোয় ঝলমল! লোডশেডিং চিরতরে বিদায় নিল!'",
  "dialogue: 'গোটা রাজ্য আলোয় ঝলমল! লোডশেডিং চিরতরে বিদায় নিল!',\n            newspaperHeadline: '📰 \"২৪x৭ নিরবচ্ছিন্ন বিদ্যুৎ! সোলার গ্রিডে বিপ্লব, ঝলমল করছে রাজ্য!\"'"
);
content = content.replace(
  "dialogue: 'বিদ্যুৎ দফতরে তালা ঝুলিয়ে দিল ক্ষুব্ধ জনতা!'",
  "dialogue: 'বিদ্যুৎ দফতরে তালা ঝুলিয়ে দিল ক্ষুব্ধ জনতা!',\n            newspaperHeadline: '📰 \"অন্ধকারে মানসিক শান্তির ডার্ক ট্যুরিজম ঘোষণা! বিদ্যুৎ দফতরে তালা!\"'"
);

// Dilemma 5 (Flood)
content = content.replace(
  "dialogue: 'হাজার হাজার পরিবার উদ্ধার পেল! বাঁধ শক্ত করে জল আটকানো হলো!'",
  "dialogue: 'হাজার হাজার পরিবার উদ্ধার পেল! বাঁধ শক্ত করে জল আটকানো হলো!',\n            newspaperHeadline: '📰 \"মিলিটারি গতিতে বাঁধ সংস্কার ও এয়ারড্রপ! বানের গ্রাস থেকে বাঁচল হাজারো প্রাণ!\"'"
);
content = content.replace(
  "dialogue: 'পলিথিনের বস্তা বানের জলে খড়কুটোর মতো ভেসে গেল!'",
  "dialogue: 'পলিথিনের বস্তা বানের জলে খড়কুটোর মতো ভেসে গেল!',\n            newspaperHeadline: '📰 \"বালির বদলে সস্তা পলিথিনে বাঁধ রক্ষা! প্রথম ঢেউয়েই ভেসে গেল কোটি টাকার ভাঁওতা!\"'"
);
content = content.replace(
  "dialogue: 'টিভি ক্যামেরায় ত্রাণের চাল বিক্রির প্রমাণ ফাঁস হয়ে গেল!'",
  "dialogue: 'টিভি ক্যামেরায় ত্রাণের চাল বিক্রির প্রমাণ ফাঁস হয়ে গেল!',\n            newspaperHeadline: '📰 \"ত্রাণের চালে নতুন বিলাসবহুল প্রাইভেট বিমান! নেতার বিরুদ্ধে দেশজুড়ে ধিক্কার!\"'"
);
content = content.replace(
  "dialogue: 'মানুষ মন্ত্রীর কনভয়ের ওপর জল ছিটিয়ে দিল!'",
  "dialogue: 'মানুষ মন্ত্রীর কনভয়ের ওপর জল ছিটিয়ে দিল!',\n            newspaperHeadline: '📰 \"বন্যায় অলিম্পিক সাঁতার শেখার নিদান! মন্ত্রীর কনভয়ে জল ছিটিয়ে ক্ষোভ প্রদর্শন!\"'"
);

// 8. Add Dilemmas 6 and 7 (Primary Teacher & Smart City)
const additionalDilemmas = `      {
        id: 'teacher',
        fundTitle: '৬. প্রাথমিক শিক্ষা ও স্কুল মিড-ডে মিল সংস্কার',
        fundAmount: 750,
        crisisName: 'স্কুলে শিক্ষক নেই! মিড-ডে মিলে শুধুই নুন-ভাত!',
        crisisDesc: 'গ্রামের স্কুলে একজন শিক্ষক ৪টি ক্লাস করাচ্ছেন! মিড-ডে মিলে ডিম বা দুধের দেখা নেই! যোগ্য চাকরিপ্রার্থীরা রাস্তায় বসে অনশন করছে!',
        choices: [
          {
            tag: '🎓',
            clause: 'ধারা ৩৩(ক) — মেধা তালিকা অনুযায়ী স্বচ্ছ ই-কাউন্সেলিং',
            title: 'স্বচ্ছ মেরিট লিস্টে ২০,০০০ শিক্ষক নিয়োগ ও সেন্ট্রালাইজড পুষ্টিকর খাবার',
            detail: 'কোনো কাটমানি ছাড়া মেধার ভিত্তিতে নিয়োগপত্র প্রদান এবং প্রতিটি স্কুলে সপ্তাহে ৩ দিন ডিম, ফল ও পুষ্টিকর খিচুড়ি নিশ্চিতকরণ।',
            auditNote: '🔍 অডিট রিপোর্ট: ১০০% সততা! শিক্ষা ব্যবস্থা পুনরুজ্জীবিত হবে, ছাত্র-শিক্ষক উপকৃত।',
            visualIcon: '🎓🍎📚',
            type: 'GENUINE_WORK',
            fundUsed: 750,
            pocketGain: 0,
            approvalChange: +26,
            edChange: -12,
            dialogue: '২০,০০০ যোগ্য শিক্ষক স্কুলে যোগ দিলেন! বাচ্চারা পুষ্টিকর গরম খাবার পাচ্ছে!',
            newspaperHeadline: '📰 "২০,০০০ শিক্ষকের স্বচ্ছ নিয়োগ! শিশুদের পাতে পুষ্টিকর ডিম-খিচুড়ি!"'
          },
          {
            tag: '📜',
            clause: 'বিজ্ঞপ্তি ১০১ — নিয়োগ জটিলতা নিষ্পত্তি কমিশন',
            title: 'অবসরপ্রাপ্ত বিচারপতি দিয়ে তদন্ত কমিটি গঠন ও ৫ বছর নিয়োগ স্থগিত রাখা',
            detail: 'আদালতের গেরোয় মামলা আটকে রেখে কমিশনের নামে ৩০০ কোটি খরচ করা হোক, যাতে আন্দোলনরত প্রার্থীরা ক্লান্ত হয়ে বাড়ি ফিরে যায়।',
            auditNote: '🔍 অডিট রিপোর্ট: আমলাতান্ত্রিক কালক্ষেপণ! যুবকদের ভবিষ্যৎ নিয়ে নোংরা খেলা।',
            visualIcon: '⚖️📁⏳',
            type: 'BUREAUCRATIC_TRAP',
            fundUsed: 350,
            pocketGain: 150,
            approvalChange: -15,
            edChange: +16,
            dialogue: 'বছরের পর বছর কেটে গেল! চাকরিপ্রার্থীদের চোখের জল শুকাল না!',
            newspaperHeadline: '📰 "নিয়োগ আটকে ৫ বছর মেয়াদী তদন্ত কমিশন! রাজপথে আন্দোলনকারীদের চোখের জল!"'
          },
          {
            tag: '💼',
            clause: 'তফসিল ৯ — ব্যাকডোর রিক্রুটমেন্ট কোটা',
            title: 'সাদা ওএমআর শিট জমা নিয়ে চাকরি বিক্রির সিন্ডিকেট ও ৫০০ কোটি লোপাট',
            detail: 'প্রত্যেক অযোগ্য প্রার্থীর থেকে ₹১৫ লাখ নিয়ে চাকরি দিন এবং ৫০০ কোটি টাকা নিজের আত্মীয়দের ট্রাস্টে ট্রান্সফার করুন!',
            auditNote: '🔍 অডিট রিপোর্ট: মেগা রিক্রুটমেন্ট স্ক্যাম! কোটি কোটি টাকার পাহাড় মিলবে নেতার ঘরে।',
            visualIcon: '💼💵🔒',
            type: 'CORRUPT_STEAL',
            fundUsed: 750,
            pocketGain: 500,
            approvalChange: -42,
            edChange: +48,
            dialogue: 'চাকরি বিক্রি করে পকেট ভরল! কিন্তু আদালতে এফআইআর দায়ের হলো!',
            newspaperHeadline: '📰 "সাদা ওএমআরে চাকরি বিক্রির মহামারী! নেতার খাটের তলায় টাকার পাহাড়!"'
          },
          {
            tag: '🤡',
            clause: 'পুষ্টি নির্দেশিকা — সৌরশক্তি পুষ্টি গ্রহণ',
            title: 'ছাত্রদের মাঠে রোদে দাঁড়িয়ে ভিটামিন-ডি দিয়ে পেট ভরানোর নোটিশ জারি',
            detail: 'খাবারের কোনো প্রয়োজন নেই, সূর্যরশ্মি ও নির্মল বায়ু গ্রহণ করলেই বাচ্চাদের পেটের খিদে মিটে যাবে বলে সার্কুলার দিন!',
            auditNote: '🔍 অডিট রিপোর্ট: বিবেকহীন হাসির পাত্র!',
            visualIcon: '☀️🍃🧘',
            type: 'FUNNY_NONSENSE',
            fundUsed: 30,
            pocketGain: 30,
            approvalChange: -22,
            edChange: +6,
            dialogue: 'অভিভাবকরা স্কুলে তালা মেরে হেডমাস্টারকে ঘেরাও করলেন!',
            newspaperHeadline: '📰 "খাবারের বদলে রোদে দাঁড়িয়ে ফটোসিন্থেসিসের নিদান! ক্ষোভে ফেটে পড়লেন অভিভাবকরা!"'
          }
        ]
      },
      {
        id: 'smart_city',
        fundTitle: '৭. স্মার্ট সিটি ৫-জি ফাইবার ও আইটি হাব মিশন',
        fundAmount: 650,
        crisisName: 'ইন্টারনেট ড্রপ! রাজ্য ছেড়ে পালাচ্ছে আইটি কোম্পানি!',
        crisisDesc: 'রাজ্যের তথ্যপ্রযুক্তি করিডোরে স্লো ইন্টারনেট ও বারবার ফাইবার কাট! বড় বড় টেক সংস্থা বেঙ্গালুরু-হায়দ্রাবাদ চলে যাওয়ার হুমকি দিচ্ছে!',
        choices: [
          {
            tag: '🌐',
            clause: 'ধারা ১৪ — গিগাবিট অপটিক্যাল ব্যাকবোন ও গ্রিন ডেটাসেন্টার',
            title: 'ভূগর্ভস্থ হাইস্পিড অপটিক্যাল ফাইবার রিং ও তরুণদের জন্য ফ্রি ইনকিউবেশন হাব',
            detail: 'সরাসরি বিশ্বমানের টেলিকম পরিকাঠামো গড়ে তুলে নতুন ৫০,০০০ স্টার্টআপ চাকরি ও আন্তর্জাতিক বিনিয়োগ নিশ্চিতকরণ।',
            auditNote: '🔍 অডিট রিপোর্ট: ১০০% নিখুঁত হাইটেক আধুনিকীকরণ! রাজ্যে লক্ষাধিক চাকরি তৈরি হবে।',
            visualIcon: '🌐💻🚀',
            type: 'GENUINE_WORK',
            fundUsed: 650,
            pocketGain: 0,
            approvalChange: +27,
            edChange: -12,
            dialogue: 'আইটি হাব দ্রুতগতিতে দৌড়াতে শুরু করল! নতুন কোম্পানিরা বিনিয়োগের চুক্তি সই করল!',
            newspaperHeadline: '📰 "সুপারফাস্ট ৫-জি ও আইটি করিডোর! রাজ্যে ৫০,০০০ নতুন চাকরির সুযোগ!"'
          },
          {
            tag: '📜',
            clause: 'পরিপত্র ৭৫ — ব্র্যান্ডিং ও মহোৎসব মহোৎসব',
            title: 'স্মার্ট সিটির ৫০ ফুট রঙিন তোরণ ও ২০ কোটি টাকার ব্যানার লাগিয়ে প্রচার',
            detail: 'ইন্টারনেট পরে হবে, আগে শহরের মোড়ে মোড়ে নেতার রঙিন কাটআউট ও ফাইবার ছাড়া লোহার তোরণ বানিয়ে কৃতিত্ব জাহির করা হোক!',
            auditNote: '🔍 অডিট রিপোর্ট: শুধুই ফাঁকা প্রচার! আসল স্পিড বাড়বে না।',
            visualIcon: '🎪🪧📸',
            type: 'BUREAUCRATIC_TRAP',
            fundUsed: 300,
            pocketGain: 140,
            approvalChange: -14,
            edChange: +18,
            dialogue: 'ব্যানারে শহর ঢেকে গেল, কিন্তু ইন্টারনেট সেই ২জি স্পিডেই আটকে রইল!',
            newspaperHeadline: '📰 "ইন্টারনেট নেই তো কী, মোড়ে মোড়ে ৫০ ফুটের কাটআউট! প্রচারেই বাজিমাত!"'
          },
          {
            tag: '💼',
            clause: 'তফসিল ২২ — বিশেষ একক ভেন্ডার লাইসেন্স',
            title: '২০ বছর পুরোনো অকেজো রাউটার বসিয়ে ৪৫০ কোটি টাকা নিজের কোম্পানিতে পাচার',
            detail: 'আমদানি করা ভাঙাচোরা যন্ত্রপাতি দিয়ে কাজ সেরে বাকি ৪৫০ কোটি টাকা বিদেশে বেনামী কোম্পানি খুলে ট্রান্সফার করা হোক!',
            auditNote: '🔍 অডিট রিপোর্ট: সাইবার সিন্ডিকেট স্ক্যাম! অকেজো রাউটারে টাকা লুট।',
            visualIcon: '💼📡💰',
            type: 'CORRUPT_STEAL',
            fundUsed: 650,
            pocketGain: 450,
            approvalChange: -38,
            edChange: +44,
            dialogue: 'রাউটার চালু করতেই ধোঁয়া বেরোল! আইটি কোম্পানিরা রাজ্য ছেড়ে পালিয়ে গেল!',
            newspaperHeadline: '📰 "স্মার্ট সিটির নামে ২০ বছরের ভাঙা রাউটার! ৪৫০ কোটি বিদেশে পাচার!"'
          },
          {
            tag: '🤡',
            clause: 'টেলিকম নোটিশ — দেশীয় ঐতিহ্যবাহী বার্তাবাহক',
            title: 'জরুরি ফাইলের জন্য পায়রা পালন ও পাহাড়ে ধোঁয়া উড়িয়ে বার্তা পাঠানোর প্রকল্প',
            detail: 'ইন্টারনেট পশ্চিমা অপসংস্কৃতি! শান্তির প্রতীক পায়রা দিয়ে চিঠি পাঠালে কোনো হ্যাকিংয়ের ভয় থাকবে না!',
            auditNote: '🔍 অডিট রিপোর্ট: মধ্যযুগীয় ভাঁওতাবাজি!',
            visualIcon: '🕊️✉️💨',
            type: 'FUNNY_NONSENSE',
            fundUsed: 25,
            pocketGain: 25,
            approvalChange: -20,
            edChange: +5,
            dialogue: 'পায়রা সব উড়াল দিল, আইটি পার্কের কর্মীরা মাথায় হাত দিয়ে বসল!',
            newspaperHeadline: '📰 "ইন্টারনেটের বদলে পায়রা দিয়ে ফাইল পাঠানোর ফরমান! বিশ্বজুড়ে হাসির ট্রোল!"'
          }
        ]
      }`;

content = content.replace(
  "dialogue: 'মানুষ মন্ত্রীর কনভয়ের ওপর জল ছিটিয়ে দিল!',\n            newspaperHeadline: '📰 \"বন্যায় অলিম্পিক সাঁতার শেখার নিদান! মন্ত্রীর কনভয়ে জল ছিটিয়ে ক্ষোভ প্রদর্শন!\"'\n          }\n        ]\n      }\n    ];",
  `dialogue: 'মানুষ মন্ত্রীর কনভয়ের ওপর জল ছিটিয়ে দিল!',\n            newspaperHeadline: '📰 \"বন্যায় অলিম্পিক সাঁতার শেখার নিদান! মন্ত্রীর কনভয়ে জল ছিটিয়ে ক্ষোভ প্রদর্শন!\"'\n          }\n        ]\n      },\n${additionalDilemmas}\n    ];`
);

// 9. Update makeDecision to update outcomeNewspaperHeadline
content = content.replace(
  "document.getElementById('outcomeModalDesc').innerText = choice.dialogue;",
  "document.getElementById('outcomeModalDesc').innerText = choice.dialogue;\n      document.getElementById('outcomeNewspaperHeadline').innerText = choice.newspaperHeadline || '📰 \"ব্রেকিং নিউজ: মন্ত্রীর সিদ্ধান্তে সরগরম রাজ্য রাজনীতি!\"';"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated 44_election_mayhem_voting_battle.html with all features!');
