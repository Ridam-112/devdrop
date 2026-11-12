import fs from "fs";
import path from "path";
import { CATEGORIES as existingCategories, TOOLS as existingTools, ToolCategory, ToolItem } from "../lib/data/tools";

const newCategories: ToolCategory[] = [
  {
    slug: "image-media",
    name: "Image & Photo Utilities",
    h1: "Free Online Image & Photo Processing Tools",
    metaTitle: "Free Image Compressor, Background Remover & Photo Tools | DEVDROP",
    metaDescription: "Compress image file sizes, remove photo backgrounds automatically, convert formats, and optimize graphics 100% in your browser.",
    description: "High-performance client-side image compressors, automatic background removers, aspect ratio calculators, and color pickers.",
    longDescription: "Optimize and edit your images with lightning speed and 100% privacy. DevDrop's Image & Photo suite processes all PNG, JPG, and WebP files locally inside your browser—no uploads, no quality loss, and zero server storage.",
    iconName: "Image",
    faqs: [
      {
        question: "Are my photos uploaded to any server?",
        answer: "No. All image compression, background removal, and editing algorithms execute 100% locally on your computer or mobile phone using HTML5 Canvas and client-side processing."
      },
      {
        question: "Is there a limit on how many images I can process?",
        answer: "There are no usage caps or daily quotas. You can compress and edit as many images as you need for free."
      },
      {
        question: "Which image formats are supported?",
        answer: "DevDrop supports JPEG, JPG, PNG, WebP, SVG, and modern web graphic formats."
      }
    ]
  },
  {
    slug: "pdf-document",
    name: "PDF & Document Tools",
    h1: "Free Online PDF Creator, Image to PDF & Document Tools",
    metaTitle: "Online PDF Maker & Photo to PDF Converters | DEVDROP",
    metaDescription: "Create clean PDF documents from notes, merge multiple photos into multi-page PDFs, and format printable files without server uploads.",
    description: "Client-side PDF makers, photo to PDF album compilers, and formatted document generators.",
    longDescription: "Generate professional PDFs on the fly. Whether compiling receipts into a multi-page expense report or creating a clean vector document from text notes, our PDF engine generates publication-grade PDFs entirely in-browser.",
    iconName: "FileText",
    faqs: [
      {
        question: "Can I convert photos into a single PDF file?",
        answer: "Yes. Our Photo to PDF tool allows you to upload multiple images, reorder pages, adjust margins, and compile them into a unified PDF."
      },
      {
        question: "Are my confidential documents safe?",
        answer: "Yes. Files are compiled in browser memory using jsPDF without transmitting any data over the internet."
      }
    ]
  },
  {
    slug: "developer-utils",
    name: "Productivity & Web Utilities",
    h1: "Essential Everyday Developer, Finance & Web Utilities",
    metaTitle: "Everyday Online Developer Tools, Calculators & Converters | DEVDROP",
    metaDescription: "Instant QR code generator, barcode maker, JSON formatter, Base64 encoder, password generator, EMI and age calculators.",
    description: "QR generators, barcodes, JSON beautifiers, Base64 codecs, UUID generators, EMI calculators, and password tools.",
    longDescription: "A comprehensive developer and everyday toolbox designed for productivity. Generate scannable QR codes, thermal barcodes, calculate loan EMIs, format messy JSON, generate cryptographically secure passwords, and convert units instantly.",
    iconName: "Sliders",
    faqs: [
      {
        question: "Are these developer utilities free to use for commercial projects?",
        answer: "Yes. All tools, generators, and code formatters are 100% free and unrestricted for personal, educational, and commercial workflows."
      },
      {
        question: "Do these tools require signing up or creating an account?",
        answer: "No registration, subscription, or software installation is required. Every tool is immediately accessible in your browser."
      }
    ]
  }
];

const newTools: ToolItem[] = [
  // 1. Image Compressor
  {
    slug: "image-compressor",
    aliases: ["image-size-compressor", "photo-compressor", "compress-image"],
    name: "Image Size Compressor",
    h1: "Online Image Size Compressor: Reduce JPG, PNG & WebP File Size Without Losing Quality",
    tagline: "Reduce image file size up to 90% with instant in-browser compression",
    categorySlug: "image-media",
    iconName: "FileImage",
    badge: "Popular 2026",
    isPopular: true,
    shortIntro: "Compress JPEG, PNG, and WebP images directly in your browser with real-time before-and-after preview, quality sliders, and instant download. 100% private with zero server upload.",
    description: "Compress and optimize images client-side. Shrink file sizes dramatically while maintaining crisp visual quality.",
    longDescription: "The DevDrop Image Size Compressor lets you dramatically reduce image file sizes without sacrificing visual clarity. Using advanced HTML5 canvas downsampling and WebP encoding, you can shrink multi-megabyte camera photos into lightweight web-ready files in milliseconds. Preview side-by-side comparisons and download your optimized files instantly.",
    features: [
      "Compress JPEG, PNG, and WebP images up to 90% smaller",
      "Side-by-side interactive before-and-after visual preview",
      "Custom quality slider and resolution downscaling controls",
      "100% private in-browser compression—no images uploaded to servers"
    ],
    limitations: [
      "Client-Side Processing: Processing speed depends on your local device CPU and browser memory.",
      "Zero Server Storage: Images are discarded immediately upon closing or refreshing the tab."
    ],
    disclaimer: "All compression routines run locally inside your browser sandbox. Your images are never transmitted or stored.",
    howItWorks: [
      "Drag and drop or select any image (PNG, JPG, WebP) from your device",
      "Adjust the compression quality slider and choose your preferred output format",
      "Compare the file size reduction and image clarity in the side-by-side preview",
      "Click Download to save your lightweight optimized image instantly"
    ],
    faqs: [
      {
        question: "Does compressing images reduce their visual quality?",
        answer: "Our intelligent compression algorithm discards invisible metadata and optimizes color palettes so photos remain sharp and clear to the human eye while shrinking file size by up to 90%."
      },
      {
        question: "Is there a limit on image dimensions or file size?",
        answer: "Because processing happens directly on your device, there are no arbitrary server upload limits. You can compress high-resolution DSLR photos effortlessly."
      },
      {
        question: "Which output format yields the highest file size reduction?",
        answer: "WebP generally provides the best compression ratio, typically saving 25% to 35% more space than standard JPEG at equivalent visual quality."
      }
    ],
    relatedSlugs: ["photo-bg-remover", "photo-to-pdf", "image-color-picker", "favicon-generator"],
    metaTitle: "Image Size Compressor — Free Online JPG, PNG & WebP Optimizer | DEVDROP",
    metaDescription: "Compress image file sizes online for free. Reduce PNG, JPG, and WebP file sizes up to 90% with zero quality loss and 100% privacy.",
    canonicalPath: "/tools/image-compressor"
  },

  // 2. Photo BG Remover
  {
    slug: "photo-bg-remover",
    aliases: ["image-background-remover", "remove-bg", "transparent-background"],
    name: "Photo Background Remover",
    h1: "Photo Background Remover: Instant AI-Powered Transparent Cutouts",
    tagline: "Erase photo backgrounds automatically in-browser with zero upload",
    categorySlug: "image-media",
    iconName: "Scissors",
    badge: "Trending",
    isPopular: true,
    shortIntro: "Remove photo backgrounds automatically inspired by rembg open-source models. Create transparent PNG cutouts, product photos, profile pictures, and replace backgrounds with solid colors or chroma green.",
    description: "Automatic photo background remover that creates transparent PNG cutouts directly in the browser.",
    longDescription: "Inspired by cutting-edge open-source background removal models like danielgatis/rembg, the DevDrop Photo Background Remover automatically detects foreground subjects and isolates them from distracting backgrounds. Adjust edge tolerance, feather borders, swap backdrops (transparent, white studio, dark cyberpunk, or chroma green), and download crisp PNG cutouts.",
    features: [
      "Automatic background removal for portraits, objects, and product photos",
      "Tolerance threshold and edge feathering sliders for pixel-perfect cutouts",
      "Instant background replacer: transparent checkerboard, pure white, dark, or green screen",
      "1-click high-resolution PNG download with preserved alpha transparency"
    ],
    limitations: [
      "Client-side algorithm performs best on photos with distinct lighting contrast between foreground and background.",
      "Complex fine hair or semi-transparent glass may require fine-tuning tolerance sliders."
    ],
    disclaimer: "Operates 100% client-side in browser memory. No photos are uploaded or analyzed by third-party tracking APIs.",
    howItWorks: [
      "Upload or drop any portrait or product photo",
      "The tool analyzes color clustering and isolates the subject automatically",
      "Fine-tune the tolerance or feather slider for softer edges",
      "Select a background fill or keep it transparent, then click Download PNG"
    ],
    faqs: [
      {
        question: "How does this compare to Python's rembg tool?",
        answer: "It applies client-side foreground-background edge segmentation inspired by rembg concepts directly in modern WebAssembly/Canvas environments without requiring Python or server backends."
      },
      {
        question: "Can I replace the background with a white backdrop for eCommerce?",
        answer: "Yes. Simply switch the backdrop selector to 'Pure White' to generate Amazon and Shopify-ready product photos instantly."
      }
    ],
    relatedSlugs: ["image-compressor", "photo-to-pdf", "image-color-picker"],
    metaTitle: "Photo Background Remover — Free Instant Transparent PNG Cutouts | DEVDROP",
    metaDescription: "Remove photo backgrounds automatically online for free. Create transparent PNGs and eCommerce product shots with zero server upload.",
    canonicalPath: "/tools/photo-bg-remover"
  },

  // 3. QR Code Generator
  {
    slug: "qr-code-generator",
    aliases: ["qr-maker", "free-qr-generator", "custom-qr-code"],
    name: "QR Code Generator & Customizer",
    h1: "Free QR Code Generator: Create Custom Scannable QR Codes for URLs, Wi-Fi & Text",
    tagline: "Generate HD vector QR codes with custom colors and instant download",
    categorySlug: "developer-utils",
    iconName: "QrCode",
    badge: "Essential",
    isPopular: true,
    shortIntro: "Generate customized high-resolution QR codes for websites, Wi-Fi auto-connect, text notes, emails, and phone numbers. Customize foreground and background colors, error correction, and download as PNG or SVG.",
    description: "Generate customized, high-resolution QR codes for websites, Wi-Fi networks, text, and contacts.",
    longDescription: "The DevDrop QR Code Generator creates scannable, high-resolution QR codes ready for menus, business cards, flyers, and digital packaging. Choose from multiple payloads including Website URLs, Wi-Fi network credentials (WPA/WPA2/WPA3), contact emails, and phone dials. Customize brand colors, tweak Reed-Solomon error correction levels, and export in crisp PNG or scalable SVG vector formats.",
    features: [
      "Supports Website URLs, Wi-Fi credentials, plain text, emails, and phone numbers",
      "Custom dot colors, background themes, and size scaling up to 800px HD",
      "Adjustable Reed-Solomon error correction levels (L, M, Q, H)",
      "Instant export to PNG, SVG vector, or direct clipboard copy"
    ],
    limitations: [
      "Static QR codes: Destination URLs cannot be redirected after printing. Test scan before mass production."
    ],
    disclaimer: "Generated QR codes do not expire and contain zero tracking redirects.",
    howItWorks: [
      "Select your QR code type (URL, Plain Text, Wi-Fi, Email, Phone)",
      "Enter your destination link or credentials",
      "Customize brand colors and error recovery percentage",
      "Test scan with your phone camera and download PNG or SVG"
    ],
    faqs: [
      {
        question: "Do these QR codes ever expire?",
        answer: "No. The QR codes generated by DevDrop are standard static codes containing the direct encoded data. They never expire and do not route through intermediary redirect servers."
      },
      {
        question: "Which error correction level should I choose?",
        answer: "For standard digital screens, Level M (15%) is ideal. If you plan to print the code on merchandise, outdoor banners, or add a logo overlay, choose Level H (30%) for maximum durability."
      }
    ],
    relatedSlugs: ["barcode-generator", "url-encoder-decoder", "slug-generator"],
    metaTitle: "Free QR Code Generator — Custom Scannable QR Codes (PNG/SVG) | DEVDROP",
    metaDescription: "Create free custom QR codes online for URLs, Wi-Fi networks, text, and phone numbers. Customize colors and download in high-res PNG or SVG.",
    canonicalPath: "/tools/qr-code-generator"
  },

  // 4. Barcode Generator
  {
    slug: "barcode-generator",
    aliases: ["barcode-maker", "code128-generator", "sku-barcode-generator"],
    name: "Barcode Generator (Code 128)",
    h1: "Free Online Barcode Generator: Create Scannable Code 128 Labels for Inventory & Retail",
    tagline: "Generate standard Code 128 barcodes for retail, shipping, and inventory",
    categorySlug: "developer-utils",
    iconName: "Barcode",
    badge: "Productivity",
    isPopular: true,
    shortIntro: "Generate 100% compliant Code 128 barcodes for SKU inventory management, shipping labels, asset tags, and retail scanners. Customize height, thickness, colors, and print directly.",
    description: "Create standard Code 128 barcodes for shipping labels, inventory management, and asset tracking.",
    longDescription: "DevDrop Barcode Generator produces crisp, optically compliant Code 128-B barcodes recognized by all industrial 1D laser scanners and mobile optical readers. Customize bar width, bar height, human-readable text labels, and color palettes. Download printable PNG labels or trigger direct thermal printing in one click.",
    features: [
      "Standard Code 128-B algorithmic encoding supporting alphanumeric text and symbols",
      "Customizable bar height, line thickness, and human-readable text toggles",
      "Adjustable high-contrast color themes for thermal label printers",
      "1-click PNG image download and direct print dialog trigger"
    ],
    limitations: [
      "Code 128-B encodes standard ASCII characters (0-9, A-Z, a-z, symbols). For 2D matrices, use our QR Code Generator."
    ],
    disclaimer: "Barcodes are compiled client-side in HTML5 canvas. Always test-scan printed labels before commercial deployment.",
    howItWorks: [
      "Enter your SKU, product code, or serial number",
      "Adjust bar height and thickness to match your label sheet dimensions",
      "Choose whether to display the human-readable text below the bars",
      "Download high-res PNG or print directly to your thermal barcode printer"
    ],
    faqs: [
      {
        question: "Can these barcodes be scanned by standard supermarket laser scanners?",
        answer: "Yes. Code 128 is an internationally recognized ISO/IEC standard supported by virtually all 1D barcode scanners, POS systems, and mobile inventory apps."
      },
      {
        question: "What characters can I include in Code 128?",
        answer: "Code 128-B supports all standard keyboard characters including numbers (0-9), uppercase (A-Z), lowercase (a-z), and punctuation symbols."
      }
    ],
    relatedSlugs: ["qr-code-generator", "uuid-generator", "hash-generator"],
    metaTitle: "Barcode Generator Online — Free Code 128 Barcodes for SKU & Labels | DEVDROP",
    metaDescription: "Generate scannable Code 128 barcodes online for inventory, SKU numbers, shipping labels, and retail packaging. Free PNG download and direct print.",
    canonicalPath: "/tools/barcode-generator"
  },

  // 5. PDF Maker
  {
    slug: "pdf-maker",
    aliases: ["text-to-pdf", "create-pdf-online", "notes-to-pdf"],
    name: "PDF Maker & Document Generator",
    h1: "Free Online PDF Maker: Convert Text, Notes & Markdown into Formatted PDFs",
    tagline: "Create publication-grade vector PDFs directly from text notes and reports",
    categorySlug: "pdf-document",
    iconName: "FileText",
    badge: "New 2026",
    isPopular: true,
    shortIntro: "Write, edit, and compile clean PDF documents from text, notes, and outlines. Configure typography, page sizes (A4/Letter), margins, headers, and automated page numbering with 100% privacy.",
    description: "Write and generate formatted vector PDF documents from notes, reports, and outlines.",
    longDescription: "The DevDrop PDF Maker provides a lightweight, distraction-free document editor that compiles directly into standard Adobe-compatible vector PDFs. Customize font families (Helvetica, Times, Courier), font sizes, line spacing, margins, orientation (Portrait/Landscape), and automated page headers/footers with zero data transmitted over the web.",
    features: [
      "Clean vector PDF compilation using client-side jsPDF technology",
      "Customizable typography: Helvetica, Times New Roman, and Courier",
      "Multi-page auto text-wrapping and intelligent page break calculations",
      "Automated page numbers ('Page X of Y') and document author metadata"
    ],
    limitations: [
      "Client-side compilation processes standard ASCII and Latin typography without requiring server font downloads."
    ],
    disclaimer: "All PDF document generation runs in browser memory. Your confidential writings never touch a server.",
    howItWorks: [
      "Type or paste your document text, notes, or contract outline into the editor",
      "Select page layout (A4 or US Letter) and typography preferences",
      "Click Preview to inspect the document layout in a new tab",
      "Click Generate & Download PDF to save the vectorized PDF file"
    ],
    faqs: [
      {
        question: "Can I use this PDF maker for confidential legal or business notes?",
        answer: "Yes! Because DevDrop generates the PDF entirely in your browser's local sandbox, your text is never transmitted over the internet or logged on any server."
      },
      {
        question: "Does the PDF support multiple pages automatically?",
        answer: "Yes. Our intelligent text measurement splits long texts across multiple pages with automated margins and page counters."
      }
    ],
    relatedSlugs: ["photo-to-pdf", "word-counter", "markdown-previewer"],
    metaTitle: "PDF Maker Online — Free Text & Notes to PDF Converter | DEVDROP",
    metaDescription: "Create clean, formatted PDF documents from text notes and reports online for free. Custom typography, A4 layout, and instant download.",
    canonicalPath: "/tools/pdf-maker"
  },

  // 6. Photo to PDF
  {
    slug: "photo-to-pdf",
    aliases: ["images-to-pdf", "jpg-to-pdf", "convert-photo-to-pdf"],
    name: "Photo to PDF Multi-Page Converter",
    h1: "Photo to PDF Converter: Merge Multiple Images into a Single PDF Document",
    tagline: "Combine JPG, PNG, and WebP photos into one consolidated PDF file",
    categorySlug: "pdf-document",
    iconName: "Images",
    badge: "Trending",
    isPopular: true,
    shortIntro: "Combine multiple photos, scanned receipts, documents, and camera shots into a single consolidated PDF document. Reorder pages, adjust margins, and export in seconds.",
    description: "Combine multiple photos, receipts, and scans into a single multi-page PDF document.",
    longDescription: "Convert multiple JPG, PNG, or WebP images into a single professional PDF document. Ideal for compiling receipts for expense reports, submitting multi-page homework assignments, organizing photo albums, or creating digital product catalogs. Reorder pages with intuitive up/down controls, configure page margins, and download your consolidated PDF instantly.",
    features: [
      "Upload and compile unlimited photos into a single unified PDF",
      "Drag-and-drop or click to reorder page sequences effortlessly",
      "Page sizing options: Standard A4 or exact image dimension matching",
      "Adjustable page margins (borderless edge-to-edge or clean framed margin)"
    ],
    limitations: [
      "Large quantities of 4K photos may consume device memory; compress images first if uploading dozens of files."
    ],
    disclaimer: "No photos are uploaded to any server. Compilation runs entirely inside your browser.",
    howItWorks: [
      "Select or drop multiple photos (PNG, JPG, WebP) into the upload area",
      "Rearrange image order using the Up and Down arrow buttons",
      "Choose your preferred page format (Standard A4 or Exact Fit) and margin width",
      "Click Convert to PDF to generate and download your multi-page document"
    ],
    faqs: [
      {
        question: "How many photos can I combine into one PDF?",
        answer: "There are no hard limits. You can combine dozens of photos depending on your device's browser memory capacity."
      },
      {
        question: "Will my images lose quality during the PDF conversion?",
        answer: "Images are embedded at their native resolution with high-fidelity rendering, keeping text on receipts and documents crisp and legible."
      }
    ],
    relatedSlugs: ["pdf-maker", "image-compressor", "photo-bg-remover"],
    metaTitle: "Photo to PDF Converter — Combine Multiple Images into PDF Free | DEVDROP",
    metaDescription: "Convert and merge photos into a single multi-page PDF online for free. Support for JPG, PNG, WebP with custom page order and margins.",
    canonicalPath: "/tools/photo-to-pdf"
  },

  // 7. Word Counter
  {
    slug: "word-counter",
    aliases: ["character-counter", "word-count-tool", "text-analyzer"],
    name: "Word & Character Counter",
    h1: "Online Word Counter: Real-Time Character, Sentence & Reading Time Analyzer",
    tagline: "Instant word count, characters, sentences, paragraphs, and reading speed",
    categorySlug: "developer-utils",
    iconName: "Type",
    badge: "Essential",
    isPopular: true,
    shortIntro: "Analyze text length in real time. Count words, characters (with and without spaces), sentences, paragraphs, estimated reading time, and speaking duration.",
    description: "Count words, characters, sentences, paragraphs, and estimated reading time in real-time.",
    longDescription: "The DevDrop Word & Character Counter provides real-time text metrics for copywriters, students, developers, and SEO specialists. As you type or paste content, calculate total words, character count with and without spaces, sentences, paragraphs, and estimated reading time.",
    features: [
      "Real-time word, character, sentence, and paragraph counting",
      "Character count excluding spaces for Twitter/X and social media limits",
      "Estimated reading time based on standard 200 wpm rate",
      "1-click copy text button with clean responsive UI"
    ],
    limitations: ["Processes text in browser memory without sending content to remote servers."],
    disclaimer: "Your typed or pasted text is processed locally and never stored.",
    howItWorks: ["Type or paste text into the box to see immediate live counts."],
    faqs: [
      { question: "What is the average reading speed used?", answer: "Reading time is calculated using the industry standard of 200 words per minute." }
    ],
    relatedSlugs: ["case-converter", "slug-generator", "markdown-previewer"],
    metaTitle: "Word Counter Online — Free Character, Sentence & Reading Time Count | DEVDROP",
    metaDescription: "Count words and characters online for free. Real-time character count with/without spaces, sentences, paragraphs, and reading time.",
    canonicalPath: "/tools/word-counter"
  },

  // 8. Case Converter
  {
    slug: "case-converter",
    aliases: ["text-case-converter", "uppercase-lowercase", "camelcase-converter"],
    name: "Text Case Converter",
    h1: "Text Case Converter: UPPERCASE, lowercase, Title Case, camelCase & snake_case",
    tagline: "Transform text between uppercase, lowercase, title, camel, snake, and kebab case",
    categorySlug: "developer-utils",
    iconName: "Type",
    badge: "Utility",
    isPopular: false,
    shortIntro: "Convert text instantly between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and PascalCase with 1-click clipboard copy.",
    description: "Transform text into uppercase, lowercase, title case, camelCase, snake_case, and kebab-case.",
    longDescription: "Easily convert strings into any programming or formatting case. Whether preparing code variables in camelCase, database column names in snake_case, or article headlines in Title Case, this tool formats text instantly.",
    features: [
      "Supports 7 major casing styles: UPPER, lower, Title, camel, snake, kebab, Pascal",
      "1-click individual copy buttons for each converted format",
      "Preserves numbers and alphanumeric identifiers"
    ],
    limitations: ["Special unicode glyphs are converted according to standard ECMAScript casing tables."],
    disclaimer: "Runs entirely in browser memory.",
    howItWorks: ["Enter text and copy the required case format instantly."],
    faqs: [
      { question: "What is the difference between camelCase and PascalCase?", answer: "camelCase starts with a lowercase letter (e.g. myVariable), whereas PascalCase starts with an uppercase letter (e.g. MyVariable)." }
    ],
    relatedSlugs: ["word-counter", "slug-generator", "json-formatter"],
    metaTitle: "Text Case Converter — UPPERCASE, lowercase, camelCase, snake_case | DEVDROP",
    metaDescription: "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case online for free with instant copy.",
    canonicalPath: "/tools/case-converter"
  },

  // 9. JSON Formatter
  {
    slug: "json-formatter",
    aliases: ["json-validator", "json-beautifier", "json-minifier"],
    name: "JSON Formatter & Validator",
    h1: "Online JSON Formatter: Beautify, Minify & Validate JSON Syntax with Syntax Highlighting",
    tagline: "Beautify messy JSON data, validate syntax errors, or minify for production",
    categorySlug: "developer-utils",
    iconName: "FileJson",
    badge: "Developer",
    isPopular: true,
    shortIntro: "Format, beautify, and validate JSON data in real time. Detect syntax errors, minify JSON payloads, and copy formatted code with clean 2-space indentation.",
    description: "Format, validate, beautify, and minify JSON data with real-time error detection.",
    longDescription: "A fast, privacy-focused JSON formatter and validator for web developers and API engineers. Paste unformatted or nested API responses to beautify them with clean indentation, inspect syntax errors with precise line explanations, or minify data for lightweight network transfers.",
    features: [
      "Automatic real-time JSON syntax validation and parsing",
      "Clean 2-space indentation and bracket formatting",
      "1-click JSON minifier to strip whitespace for production payloads",
      "Instant copy formatted JSON to clipboard"
    ],
    limitations: ["Validates RFC 8259 compliant JSON strings."],
    disclaimer: "Your sensitive API payloads and database dumps never leave your browser.",
    howItWorks: ["Paste raw JSON on the left to see instant validated and formatted code on the right."],
    faqs: [
      { question: "Is my JSON payload uploaded anywhere?", answer: "No. JSON parsing is executed natively via window.JSON.parse inside your browser." }
    ],
    relatedSlugs: ["base64-encoder-decoder", "jwt-decoder", "csv-to-json-converter"],
    metaTitle: "JSON Formatter & Validator — Beautify & Minify JSON Online | DEVDROP",
    metaDescription: "Format, validate, and beautify JSON data online for free. Real-time syntax error checking, 2-space indentation, and minifier.",
    canonicalPath: "/tools/json-formatter"
  },

  // 10. Base64
  {
    slug: "base64-encoder-decoder",
    aliases: ["base64-codec", "base64-decode", "base64-encode"],
    name: "Base64 Encoder & Decoder",
    h1: "Base64 Encoder & Decoder: Convert Plain Text to Base64 & Decode Data Strings",
    tagline: "Encode plain text to Base64 or decode Base64 strings back to text instantly",
    categorySlug: "developer-utils",
    iconName: "Binary",
    badge: "Developer",
    isPopular: true,
    shortIntro: "Encode UTF-8 text into standard Base64 format or decode Base64 strings back into readable plain text. Client-side, fast, and secure.",
    description: "Encode text into Base64 format or decode Base64 strings back to plain text.",
    longDescription: "Encode text into Base64 binary-to-text representation or decode Base64 strings into readable text. Essential for debugging basic HTTP authentication headers, data URLs, API payloads, and encoded tokens.",
    features: [
      "Bidirectional encoding and decoding toggles",
      "Full UTF-8 unicode character support",
      "Instant error reporting for malformed Base64 inputs"
    ],
    limitations: ["Processes text and string payloads in browser memory."],
    disclaimer: "No data is transmitted over the internet.",
    howItWorks: ["Choose Encode or Decode, paste your content, and view the converted output."],
    faqs: [
      { question: "Is Base64 an encryption algorithm?", answer: "No. Base64 is an encoding scheme designed to represent binary data in ASCII string format; it provides no cryptographic confidentiality." }
    ],
    relatedSlugs: ["json-formatter", "jwt-decoder", "url-encoder-decoder"],
    metaTitle: "Base64 Encoder & Decoder Online — Free Text to Base64 Tool | DEVDROP",
    metaDescription: "Encode and decode Base64 strings online for free. Convert plain UTF-8 text to Base64 or decode Base64 back to text with instant copy.",
    canonicalPath: "/tools/base64-encoder-decoder"
  },

  // 11. Password Generator
  {
    slug: "password-generator",
    aliases: ["secure-password-generator", "random-password", "strong-password-maker"],
    name: "Secure Password Generator",
    h1: "Secure Password Generator: Create Strong, Uncrackable Random Passwords",
    tagline: "Generate cryptographically secure random passwords with customizable length and entropy",
    categorySlug: "developer-utils",
    iconName: "Key",
    badge: "Security",
    isPopular: true,
    shortIntro: "Generate cryptographically strong, random passwords using the browser's native Web Crypto API. Customize length, uppercase, numbers, and symbols to protect accounts.",
    description: "Generate cryptographically strong, random passwords with customizable length and symbols.",
    longDescription: "Protect your online accounts from brute-force and dictionary attacks with high-entropy random passwords. Generated using your browser's window.crypto pseudo-random number generator, these passwords never leave your device.",
    features: [
      "Hardware-level random entropy via Web Crypto API",
      "Customizable length from 8 to 64 characters",
      "Toggles for uppercase, lowercase, numbers, and symbols",
      "1-click instant clipboard copy with zero server logging"
    ],
    limitations: ["Generated passwords are not stored anywhere; be sure to save them in your password manager."],
    disclaimer: "Passwords are generated locally on your computer and never transmitted.",
    howItWorks: ["Select desired character sets and length, then click Copy to use your password."],
    faqs: [
      { question: "What makes a password strong?", answer: "A strong password has at least 16 characters and includes a blend of uppercase letters, lowercase letters, numbers, and symbols with high random entropy." }
    ],
    relatedSlugs: ["strong-passphrase-generator", "hash-generator", "uuid-generator"],
    metaTitle: "Secure Password Generator — Create Strong Random Passwords | DEVDROP",
    metaDescription: "Generate strong, uncrackable random passwords online for free. Customizable length, symbols, numbers, and 100% private Web Crypto generation.",
    canonicalPath: "/tools/password-generator"
  },

  // 12. Age Calculator
  {
    slug: "age-calculator",
    aliases: ["chronological-age-calculator", "exact-age-checker", "birthday-calculator"],
    name: "Exact Age & Birthday Calculator",
    h1: "Exact Age Calculator: Calculate Age in Years, Months, Days & Total Days Lived",
    tagline: "Find your exact chronological age in years, months, days, and total days lived",
    categorySlug: "developer-utils",
    iconName: "Clock",
    badge: "Everyday",
    isPopular: true,
    shortIntro: "Calculate your exact age down to the day. Enter your birth date to see your age in years, months, days, total days lived, and countdown to your next birthday.",
    description: "Calculate exact chronological age in years, months, days, and total days lived.",
    longDescription: "The DevDrop Exact Age Calculator computes your chronological age with calendar precision. Accounting for leap years and month lengths, view your age broken down into years, months, days, and cumulative days lived.",
    features: [
      "Precise calculation accounting for leap years and variable month lengths",
      "Displays years, months, days, and total days lived",
      "Instant calendar date picker with zero page reload"
    ],
    limitations: ["Calculates based on the user device's local system clock."],
    disclaimer: "Birth dates are processed locally and never recorded.",
    howItWorks: ["Select your birth date in the calendar input to see your exact age breakdown immediately."],
    faqs: [
      { question: "Does the calculator account for leap years?", answer: "Yes. All leap year February 29th dates are calculated accurately according to Gregorian calendar rules." }
    ],
    relatedSlugs: ["days-between-dates", "bmi-calculator", "loan-emi-calculator"],
    metaTitle: "Exact Age Calculator — Calculate Age in Years, Months & Days | DEVDROP",
    metaDescription: "Calculate your exact age in years, months, and days online for free. Find out total days lived and your next birthday countdown.",
    canonicalPath: "/tools/age-calculator"
  },

  // 13. BMI Calculator
  {
    slug: "bmi-calculator",
    aliases: ["body-mass-index", "bmi-checker", "healthy-weight-calculator"],
    name: "BMI Body Mass Index Calculator",
    h1: "BMI Calculator: Calculate Body Mass Index & Healthy Weight Category",
    tagline: "Calculate your Body Mass Index (BMI) and health category based on WHO standards",
    categorySlug: "developer-utils",
    iconName: "Sliders",
    badge: "Health",
    isPopular: false,
    shortIntro: "Calculate your Body Mass Index (BMI) from your height and weight. Discover your weight category (Underweight, Normal, Overweight, Obese) based on WHO health standards.",
    description: "Calculate your Body Mass Index (BMI) and discover your healthy weight category.",
    longDescription: "Check your Body Mass Index (BMI) quickly using standard World Health Organization criteria. Adjust the interactive height and weight sliders to instantly see your calculated BMI score and weight status category.",
    features: [
      "Interactive real-time height and weight sliders",
      "WHO weight categorization (Underweight, Normal, Overweight, Obese)",
      "Instant color-coded health indicators"
    ],
    limitations: ["BMI is a general screening metric and does not distinguish between muscle mass and fat."],
    disclaimer: "This tool is for educational and informational reference only, not medical diagnosis.",
    howItWorks: ["Slide your weight in kilograms and height in centimeters to view your BMI score."],
    faqs: [
      { question: "What is considered a normal BMI range?", answer: "According to the World Health Organization, a normal healthy BMI ranges between 18.5 and 24.9." }
    ],
    relatedSlugs: ["age-calculator", "percentage-calculator", "unit-converter"],
    metaTitle: "BMI Calculator — Free Body Mass Index & Weight Category Checker | DEVDROP",
    metaDescription: "Calculate your Body Mass Index (BMI) online for free. Interactive height and weight sliders with WHO health status indicators.",
    canonicalPath: "/tools/bmi-calculator"
  },

  // 14. Loan EMI Calculator
  {
    slug: "loan-emi-calculator",
    aliases: ["emi-calculator", "home-loan-emi", "car-loan-emi-calculator"],
    name: "Loan EMI & Interest Calculator",
    h1: "Loan EMI Calculator: Calculate Monthly Payment, Total Interest & Loan Cost",
    tagline: "Calculate monthly EMI payments, total interest, and total payable for any loan",
    categorySlug: "developer-utils",
    iconName: "Calculator",
    badge: "Finance",
    isPopular: true,
    shortIntro: "Calculate your monthly Equated Monthly Installment (EMI) for home loans, car loans, and personal loans. View total interest payable and overall loan cost in seconds.",
    description: "Calculate monthly EMI payments, total interest payable, and overall loan costs.",
    longDescription: "Plan your finances accurately before taking out a home, auto, education, or personal loan. Input your principal amount, annual interest rate, and tenure to compute your exact monthly EMI payment, total interest accumulated, and final repayment total.",
    features: [
      "Standard compound interest EMI amortization formula",
      "Instant breakdown of Monthly EMI, Total Interest, and Total Repayment",
      "Flexible principal, interest rate, and tenure inputs"
    ],
    limitations: ["Calculations exclude bank processing fees, stamp duty, or insurance charges."],
    disclaimer: "Provides financial estimates based on standard mathematical formulas.",
    howItWorks: ["Enter loan principal, annual interest rate (%), and tenure in years to see your monthly EMI."],
    faqs: [
      { question: "What formula is used to calculate EMI?", answer: "EMI is calculated using: P x R x (1+R)^N / [(1+R)^N - 1], where P is principal, R is monthly interest rate, and N is the number of monthly installments." }
    ],
    relatedSlugs: ["discount-sale-calculator", "percentage-calculator", "tip-calculator"],
    metaTitle: "Loan EMI Calculator — Calculate Monthly EMI & Total Interest | DEVDROP",
    metaDescription: "Calculate monthly loan EMI payments online for free. Compute total interest and repayment for home loans, car loans, and personal loans.",
    canonicalPath: "/tools/loan-emi-calculator"
  },

  // 15. Hash Generator
  {
    slug: "hash-generator",
    aliases: ["sha256-generator", "sha1-hash", "sha512-hasher"],
    name: "Hash Generator (SHA-256, SHA-1, SHA-512)",
    h1: "Online Hash Generator: Generate SHA-256, SHA-1 & SHA-512 Cryptographic Hashes",
    tagline: "Compute one-way cryptographic hashes directly in-browser using Web Crypto",
    categorySlug: "developer-utils",
    iconName: "Hash",
    badge: "Developer",
    isPopular: false,
    shortIntro: "Generate secure cryptographic hashes for text and passwords using SHA-256, SHA-1, and SHA-512. Fast, private, and powered by browser-native Web Crypto.",
    description: "Generate SHA-256, SHA-1, and SHA-512 cryptographic hashes using native Web Crypto.",
    longDescription: "Compute cryptographic digests and checksums for verification, integrity checking, and API signatures. Using the browser's built-in crypto.subtle engine, generate SHA-256, SHA-1, and SHA-512 hex hashes instantly without transmitting plain text over the network.",
    features: [
      "Hardware-accelerated native Web Crypto API hashing",
      "Simultaneous generation of SHA-256, SHA-1, and SHA-512 hashes",
      "1-click copy buttons for individual hash digests"
    ],
    limitations: ["Hashes are one-way mathematical functions and cannot be reversed."],
    disclaimer: "All hashing takes place locally on your client machine.",
    howItWorks: ["Type or paste any text to see real-time SHA-256, SHA-1, and SHA-512 digests."],
    faqs: [
      { question: "Is SHA-256 secure?", answer: "Yes. SHA-256 is an industry-standard cryptographic hash algorithm with 256-bit security, widely used in SSL certificates, Bitcoin, and data integrity verification." }
    ],
    relatedSlugs: ["uuid-generator", "password-generator", "base64-encoder-decoder"],
    metaTitle: "Hash Generator Online — Free SHA-256, SHA-1 & SHA-512 Hashes | DEVDROP",
    metaDescription: "Generate cryptographic hashes online for free. Compute SHA-256, SHA-1, and SHA-512 digests instantly with 100% private in-browser Web Crypto.",
    canonicalPath: "/tools/hash-generator"
  },

  // 16. UUID Generator
  {
    slug: "uuid-generator",
    aliases: ["guid-generator", "uuid-v4", "unique-id-generator"],
    name: "UUID v4 Unique ID Generator",
    h1: "UUID Generator: Generate Cryptographically Secure Version-4 UUIDs & GUIDs",
    tagline: "Generate random Version 4 UUIDs (Universally Unique Identifiers) instantly",
    categorySlug: "developer-utils",
    iconName: "Key",
    badge: "Developer",
    isPopular: false,
    shortIntro: "Generate cryptographically secure Version-4 UUIDs and GUIDs for database primary keys, API tokens, and software engineering. Copy individual UUIDs or regenerate a batch.",
    description: "Generate cryptographically secure Version-4 UUIDs (GUIDs) for databases and APIs.",
    longDescription: "Create random, collision-resistant Universally Unique Identifiers (UUID v4) conforming to RFC 4122. Ideal for mock data generation, database primary keys, session tokens, and distributed tracking identifiers.",
    features: [
      "Generates RFC 4122 compliant UUID Version 4 identifiers",
      "Batch generation with 1-click clipboard copy",
      "Randomized using crypto.randomUUID engine"
    ],
    limitations: ["UUIDs generated are Version 4 (random) format."],
    disclaimer: "UUIDs are generated locally in browser memory.",
    howItWorks: ["View active generated UUIDs or click Regenerate to spawn a fresh batch."],
    faqs: [
      { question: "Can two UUID v4 values ever collide?", answer: "The probability of generating duplicate UUID v4 identifiers is virtually zero (1 in 2^122), making them safe for globally unique keys." }
    ],
    relatedSlugs: ["hash-generator", "password-generator", "barcode-generator"],
    metaTitle: "UUID Generator — Free RFC 4122 Version 4 UUID & GUID Generator | DEVDROP",
    metaDescription: "Generate Version-4 UUIDs and GUIDs online for free. Cryptographically random RFC 4122 identifiers for database primary keys and API tokens.",
    canonicalPath: "/tools/uuid-generator"
  },

  // 17. Unit Converter
  {
    slug: "unit-converter",
    aliases: ["metric-converter", "measurement-converter", "data-unit-converter"],
    name: "Metric & Imperial Unit Converter",
    h1: "Unit Converter: Convert Length, Weight, Temperature & Data Storage Units",
    tagline: "Convert between metric and imperial measurements for length, weight, and digital storage",
    categorySlug: "developer-utils",
    iconName: "ArrowRightLeft",
    badge: "Everyday",
    isPopular: false,
    shortIntro: "Convert effortlessly between metric and imperial measurement systems. Switch between meters, feet, kilometers, miles, kilograms, pounds, and digital byte units (MB, GB, TB).",
    description: "Convert between metric and imperial units for length, weight, and digital storage.",
    longDescription: "A versatile unit converter supporting key metric and imperial measurements. Accurately translate kilometers to miles, meters to feet, kilograms to pounds, and digital storage units (bytes, megabytes, gigabytes, terabytes) with real-time conversion precision.",
    features: [
      "Categories for Length, Weight, and Digital Data Storage",
      "Instant bidirectional calculations with high floating-point precision",
      "Clean dropdown selectors for source and destination units"
    ],
    limitations: ["Converts standard international standard metric and imperial units."],
    disclaimer: "All calculations run locally on your device.",
    howItWorks: ["Choose category, enter your value, and select your source and destination units."],
    faqs: [
      { question: "How many feet are in a meter?", answer: "1 meter is equal to approximately 3.28084 feet." }
    ],
    relatedSlugs: ["percentage-calculator", "bmi-calculator", "aspect-ratio-calculator"],
    metaTitle: "Unit Converter Online — Convert Length, Weight & Data Storage | DEVDROP",
    metaDescription: "Convert metric and imperial units online for free. Instant conversion between meters, feet, miles, kilograms, pounds, MB, and GB.",
    canonicalPath: "/tools/unit-converter"
  },

  // 18. URL Encoder / Decoder
  {
    slug: "url-encoder-decoder",
    aliases: ["percent-encoding", "url-decode", "encode-uri"],
    name: "URL Encoder & Decoder",
    h1: "URL Encoder & Decoder: Percent-Encode & Decode Query Strings & Links",
    tagline: "Encode special characters into percent-encoded URL formats or decode query strings",
    categorySlug: "developer-utils",
    iconName: "FileCode",
    badge: "Developer",
    isPopular: false,
    shortIntro: "Encode special characters into percent-encoded URL strings (%20, %2F, etc.) or decode encoded URLs and query parameters back into readable plain text.",
    description: "Encode query strings and links into percent-encoded URLs or decode them back to text.",
    longDescription: "Format URLs properly for HTTP requests and API endpoints. Convert spaces, ampersands, slashes, and non-ASCII symbols into safe percent-encoded values or decode encoded redirect links back to clean human-readable text.",
    features: [
      "Fast encode and decode mode toggles",
      "Full RFC 3986 URI component compliance",
      "1-click copy button for converted output"
    ],
    limitations: ["Processes standard URI component character mappings."],
    disclaimer: "URLs and query parameters are processed strictly in browser memory.",
    howItWorks: ["Select Encode or Decode, paste your URL, and copy the result."],
    faqs: [
      { question: "Why do URLs need to be encoded?", answer: "URLs can only be sent over the Internet using the standard ASCII character set; unsafe characters like spaces must be replaced with a '%' followed by two hexadecimal digits." }
    ],
    relatedSlugs: ["slug-generator", "base64-encoder-decoder", "qr-code-generator"],
    metaTitle: "URL Encoder & Decoder — Free Online Percent Encoding Tool | DEVDROP",
    metaDescription: "Encode and decode URLs and query strings online for free. Convert special characters to percent encoding (%20) or decode URLs with instant copy.",
    canonicalPath: "/tools/url-encoder-decoder"
  },

  // 19. Slug Generator
  {
    slug: "slug-generator",
    aliases: ["url-slug-generator", "seo-slug-maker", "clean-url-generator"],
    name: "SEO URL Slug Generator",
    h1: "SEO URL Slug Generator: Convert Titles into Clean, Search-Friendly URL Slugs",
    tagline: "Transform article titles and headlines into lowercase, hyphen-separated SEO URL slugs",
    categorySlug: "developer-utils",
    iconName: "Terminal",
    badge: "SEO",
    isPopular: false,
    shortIntro: "Convert blog titles, product names, and headlines into clean, lowercase, hyphen-separated SEO URL slugs. Strips special characters and punctuation automatically.",
    description: "Transform article headlines and product titles into clean, lowercase SEO URL slugs.",
    longDescription: "Clean, human-readable URLs are critical for search engine rankings and user trust. The DevDrop SEO URL Slug Generator converts titles into lowercase, hyphenated slugs, removing accents, punctuation, and invalid URL characters automatically.",
    features: [
      "Strips emojis, special punctuation, and invalid characters",
      "Converts spaces and underscores into clean single hyphens",
      "Lowercases all letters for standard web URL compliance"
    ],
    limitations: ["Optimized for Latin and alphanumeric article headlines."],
    disclaimer: "Operates 100% locally in browser memory.",
    howItWorks: ["Type or paste your headline to see an instant clean URL slug."],
    faqs: [
      { question: "What makes a good SEO URL slug?", answer: "A good SEO slug is short, lowercase, hyphen-separated, and contains your target keywords without filler words or special characters." }
    ],
    relatedSlugs: ["url-encoder-decoder", "case-converter", "word-counter"],
    metaTitle: "SEO URL Slug Generator — Convert Titles into Clean URLs | DEVDROP",
    metaDescription: "Generate clean, SEO-friendly URL slugs from article titles and headlines online for free. Automatic lowercase and hyphen formatting with instant copy.",
    canonicalPath: "/tools/slug-generator"
  },

  // 20. Binary Text Converter
  {
    slug: "binary-text-converter",
    aliases: ["binary-to-text", "text-to-binary", "ascii-binary-converter"],
    name: "Binary to Text & Text to Binary Converter",
    h1: "Binary to Text Converter: Convert English to 8-Bit Binary & Binary to Text",
    tagline: "Translate English text into 8-bit binary code (0s and 1s) or decode binary into words",
    categorySlug: "developer-utils",
    iconName: "Binary",
    badge: "Developer",
    isPopular: false,
    shortIntro: "Convert text into 8-bit binary code (0s and 1s) or decode binary sequences back into English text. Great for computer science students and binary data inspection.",
    description: "Convert English text to 8-bit binary code or decode binary sequences to readable text.",
    longDescription: "Translate text characters into their binary byte representation (e.g. 01000100 01100101) or decode raw binary code back into readable ASCII text. Understand how computers store characters at the lowest machine level.",
    features: [
      "Bidirectional Text to Binary and Binary to Text modes",
      "Standard 8-bit space-separated byte notation",
      "1-click copy result to clipboard"
    ],
    limitations: ["Translates standard ASCII and Latin character code points."],
    disclaimer: "Runs entirely in browser memory.",
    howItWorks: ["Choose mode, enter text or binary strings, and copy the converted output."],
    faqs: [
      { question: "What is 8-bit binary?", answer: "In computer systems, each standard character is represented by 8 bits (1 byte) of binary numbers consisting of 0s and 1s." }
    ],
    relatedSlugs: ["base64-encoder-decoder", "hash-generator", "hex-to-ascii-converter"],
    metaTitle: "Binary to Text Converter — Convert English to Binary Code & Back | DEVDROP",
    metaDescription: "Convert text to binary code (0s and 1s) and decode binary back to English text online for free. Standard 8-bit space-separated notation.",
    canonicalPath: "/tools/binary-text-converter"
  },

  // 21. JWT Decoder
  {
    slug: "jwt-decoder",
    aliases: ["jwt-token-inspector", "decode-jwt", "json-web-token-decoder"],
    name: "JWT Token Decoder & Inspector",
    h1: "JWT Decoder: Decode & Inspect JSON Web Tokens (Header & Payload) Client-Side",
    tagline: "Decode JSON Web Tokens (JWT) client-side without sending tokens to any server",
    categorySlug: "developer-utils",
    iconName: "Key",
    badge: "Security",
    isPopular: true,
    shortIntro: "Decode and inspect JSON Web Tokens (JWT) safely. View token header algorithms, expiration timestamps, user IDs, and claims 100% locally with zero server transmission.",
    description: "Decode and inspect JSON Web Tokens (JWT) safely without sending tokens over the internet.",
    longDescription: "Inspect the contents of JSON Web Tokens without compromising security. The DevDrop JWT Decoder splits the token into its header, payload, and signature components and decodes the JSON payload locally in your browser so confidential credentials and auth tokens are never leaked.",
    features: [
      "100% client-side decoding—your secret tokens are never sent over the web",
      "Color-coded formatted JSON view of header and payload claims",
      "Detects token expiration and role claims automatically"
    ],
    limitations: ["Decodes and inspects token payload; does not perform cryptographic signature validation against remote secret keys."],
    disclaimer: "Zero tokens are transmitted or logged. Verification occurs strictly in local memory.",
    howItWorks: ["Paste your Bearer JWT token into the text field to inspect decoded claims immediately."],
    faqs: [
      { question: "Is it safe to paste production JWT tokens here?", answer: "Yes! Unlike other online decoders that log tokens on their backend servers, DevDrop executes Base64URL decoding directly in your browser's JavaScript sandbox." }
    ],
    relatedSlugs: ["base64-encoder-decoder", "json-formatter", "hash-generator"],
    metaTitle: "JWT Decoder Online — Decode & Inspect JSON Web Tokens Safely | DEVDROP",
    metaDescription: "Decode JSON Web Tokens (JWT) online safely for free. Inspect token headers, expiration dates, and payload claims with 100% private client-side decoding.",
    canonicalPath: "/tools/jwt-decoder"
  },

  // 22. CSS Gradient Generator
  {
    slug: "css-gradient-generator",
    aliases: ["gradient-maker", "linear-gradient-css", "color-gradient-generator"],
    name: "CSS Gradient Generator",
    h1: "CSS Gradient Generator: Create Beautiful Linear Gradients & Copy CSS Code",
    tagline: "Design smooth color gradients with live visual preview and 1-click CSS code export",
    categorySlug: "developer-utils",
    iconName: "Sparkles",
    badge: "Design",
    isPopular: false,
    shortIntro: "Design modern linear CSS gradients with color pickers, custom angle rotation, and instant CSS background code generation. Ready for frontend web design.",
    description: "Create modern linear CSS gradients with live preview and instant CSS code generation.",
    longDescription: "Generate eye-catching background gradients for modern web applications and UI designs. Pick starting and ending colors, adjust rotation angles from 0 to 360 degrees, preview the gradient live, and copy production-ready CSS with a single click.",
    features: [
      "Dual color picker inputs with live preview canvas",
      "0° to 360° angle rotation slider",
      "1-click copy production-ready CSS background code"
    ],
    limitations: ["Generates standard linear-gradient CSS properties compatible with all modern browsers."],
    disclaimer: "Operates client-side.",
    howItWorks: ["Select your colors, drag the angle slider, and click Copy CSS."],
    faqs: [
      { question: "Is the generated CSS compatible with all browsers?", answer: "Yes. Standard linear-gradient syntax is supported across Chrome, Safari, Firefox, Edge, iOS, and Android." }
    ],
    relatedSlugs: ["image-color-picker", "favicon-generator", "slug-generator"],
    metaTitle: "CSS Gradient Generator — Create Beautiful Linear Gradients | DEVDROP",
    metaDescription: "Create beautiful linear CSS gradients online for free. Interactive color pickers, angle rotation slider, and 1-click production-ready CSS code.",
    canonicalPath: "/tools/css-gradient-generator"
  }
];

// Let's also add 30 more essential tools to reach 52+ tools!
const additionalUtilitySlugs = [
  { slug: "lorem-ipsum-generator", name: "Lorem Ipsum Dummy Text Generator", icon: "FileText", cat: "developer-utils" },
  { slug: "markdown-previewer", name: "Markdown to HTML Live Previewer", icon: "FileCode", cat: "developer-utils" },
  { slug: "color-hex-converter", name: "HEX to RGB & HSL Color Converter", icon: "Palette", cat: "developer-utils" },
  { slug: "percentage-calculator", name: "Percentage & Discount Calculator", icon: "Calculator", cat: "developer-utils" },
  { slug: "days-between-dates", name: "Days Between Dates Duration Calculator", icon: "Clock", cat: "developer-utils" },
  { slug: "unix-timestamp-converter", name: "Unix Epoch Timestamp to Date Converter", icon: "Clock", cat: "developer-utils" },
  { slug: "aspect-ratio-calculator", name: "Aspect Ratio (16:9, 4:3, 21:9) Calculator", icon: "Maximize2", cat: "developer-utils" },
  { slug: "html-entity-encoder", name: "HTML Entities Encoder & Decoder", icon: "FileCode", cat: "developer-utils" },
  { slug: "csv-to-json-converter", name: "CSV to JSON Data Converter", icon: "FileJson", cat: "developer-utils" },
  { slug: "json-to-csv-converter", name: "JSON to CSV Spreadsheet Converter", icon: "FileText", cat: "developer-utils" },
  { slug: "strong-passphrase-generator", name: "Memorable Diceware Passphrase Generator", icon: "Key", cat: "developer-utils" },
  { slug: "tip-calculator", name: "Restaurant Tip & Bill Split Calculator", icon: "Calculator", cat: "developer-utils" },
  { slug: "discount-sale-calculator", name: "Sale Price & Savings Discount Calculator", icon: "Calculator", cat: "developer-utils" },
  { slug: "screen-resolution-detector", name: "Screen Resolution & DPI Checker", icon: "Monitor", cat: "developer-utils" },
  { slug: "user-agent-parser", name: "Browser User-Agent & Device Checker", icon: "Cpu", cat: "developer-utils" },
  { slug: "roman-numeral-converter", name: "Roman Numeral to Number Converter", icon: "Hash", cat: "developer-utils" },
  { slug: "random-number-picker", name: "Random Number Generator & Dice Roller", icon: "Sparkles", cat: "developer-utils" },
  { slug: "random-choice-picker", name: "Random Option & Decision Picker", icon: "Sparkles", cat: "developer-utils" },
  { slug: "hex-to-ascii-converter", name: "Hexadecimal to ASCII Text Converter", icon: "Binary", cat: "developer-utils" },
  { slug: "digital-stopwatch-timer", name: "High-Precision Digital Stopwatch & Lap Timer", icon: "Clock", cat: "developer-utils" },
  { slug: "pomodoro-focus-timer", name: "Pomodoro 25/5 Productivity Focus Timer", icon: "Clock", cat: "developer-utils" },
  { slug: "world-clock-meeting-planner", name: "Global Timezone World Clock & Meeting Planner", icon: "Clock", cat: "developer-utils" },
  { slug: "text-diff-checker", name: "Text Diff & Comparison Checker", icon: "FileText", cat: "developer-utils" },
  { slug: "remove-duplicate-lines", name: "Duplicate Line Remover & List Sorter", icon: "Type", cat: "developer-utils" },
  { slug: "sql-formatter", name: "SQL Query Beautifier & Formatter", icon: "Terminal", cat: "developer-utils" },
  { slug: "regex-tester", name: "RegEx Regular Expression Tester & Matcher", icon: "Terminal", cat: "developer-utils" },
  { slug: "credit-card-validator", name: "Credit Card Luhn Algorithm Validator", icon: "ShieldCheck", cat: "developer-utils" },
  { slug: "image-color-picker", name: "Image Eyedropper & Hex Color Picker", icon: "Palette", cat: "image-media" },
  { slug: "favicon-generator", name: "Favicon 16x16 & 32x32 PNG Generator", icon: "FileImage", cat: "image-media" },
  { slug: "morse-code-translator", name: "Morse Code Audio & Text Translator", icon: "Volume2", cat: "developer-utils" }
];

for (const extra of additionalUtilitySlugs) {
  newTools.push({
    slug: extra.slug,
    name: extra.name,
    h1: `${extra.name}: Free High-Performance Online Tool`,
    tagline: `Free, private, and client-side ${extra.name.toLowerCase()} with zero server storage`,
    categorySlug: extra.cat,
    iconName: extra.icon,
    badge: "Utility",
    isPopular: false,
    shortIntro: `Experience ${extra.name.toLowerCase()} running 100% locally in your web browser. Fast, responsive, privacy-focused, and free forever.`,
    description: `Free online ${extra.name.toLowerCase()} with instant results and client-side processing.`,
    longDescription: `The DevDrop ${extra.name} provides a seamless, high-performance web utility built for productivity and speed. Process your data directly on your device with complete privacy, zero server logging, and instant results.`,
    features: [
      `100% client-side ${extra.name.toLowerCase()} engine`,
      "Zero server uploads or private data tracking",
      "Responsive design optimized for desktop and mobile",
      "Instant copy and export capabilities"
    ],
    limitations: ["Operates strictly within your local browser memory."],
    disclaimer: "No data is transmitted or stored on remote servers.",
    howItWorks: ["Enter your input data and view or copy the processed result immediately."],
    faqs: [
      {
        question: `Is this ${extra.name} free to use?`,
        answer: "Yes! All DevDrop utilities are 100% free with no registration or limits."
      },
      {
        question: "Is my data stored or tracked?",
        answer: "No. All computations run exclusively in your browser memory."
      }
    ],
    relatedSlugs: ["word-counter", "json-formatter", "base64-encoder-decoder"],
    metaTitle: `${extra.name} — Free Online Tool | DEVDROP`,
    metaDescription: `Use ${extra.name} online for free. Fast, client-side, privacy-focused with zero server upload and instant copy.`,
    canonicalPath: `/tools/${extra.slug}`
  });
}

// Combine and write back
const updatedCategories = [...existingCategories];
for (const cat of newCategories) {
  if (!updatedCategories.some(c => c.slug === cat.slug)) {
    updatedCategories.push(cat);
  }
}

const updatedTools = [...existingTools];
for (const tool of newTools) {
  if (!updatedTools.some(t => t.slug === tool.slug)) {
    updatedTools.push(tool);
  }
}

const outContent = `export interface ToolFaq {
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

export const CATEGORIES: ToolCategory[] = ${JSON.stringify(updatedCategories, null, 2)};

export const TOOLS: ToolItem[] = ${JSON.stringify(updatedTools, null, 2)};
`;

fs.writeFileSync(path.resolve(__dirname, "../lib/data/tools.ts"), outContent, "utf8");
console.log(`Success! Total Categories: ${updatedCategories.length}, Total Tools: ${updatedTools.length}`);
