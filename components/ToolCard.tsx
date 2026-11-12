import React from "react";
import Link from "next/link";
import { ToolItem, CATEGORIES } from "@/lib/data/tools";
import {
  Radar,
  Smartphone,
  Camera,
  Lock,
  Globe,
  KeyRound,
  Activity,
  Terminal,
  ArrowRight,
  ShieldCheck,
  Wifi,
  Flame,
  Gamepad2,
  Coins,
  Skull,
  Eye,
  Shield,
  Zap,
  Server,
  Search,
  Cpu,
  UserCheck,
  AlertTriangle,
  QrCode,
  DollarSign,
  CreditCard,
  Key,
  FileText,
  Radio,
  Crosshair,
  Award,
  HelpCircle,
  Sparkles,
  MessageSquare,
  PhoneCall,
  Music,
  ShieldAlert,
  FileImage,
  Scissors,
  Barcode,
  Images,
  Type,
  FileJson,
  Binary,
  Sliders,
  Calculator,
  Clock,
  ArrowRightLeft,
  Hash,
  Palette,
  Maximize2,
  Monitor,
  Volume2,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  Radar: <Radar className="w-6 h-6" />,
  Smartphone: <Smartphone className="w-6 h-6" />,
  Instagram: <Camera className="w-6 h-6" />,
  Camera: <Camera className="w-6 h-6" />,
  Lock: <Lock className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  KeyRound: <KeyRound className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  Terminal: <Terminal className="w-6 h-6" />,
  Wifi: <Wifi className="w-6 h-6" />,
  Flame: <Flame className="w-6 h-6" />,
  Gamepad2: <Gamepad2 className="w-6 h-6" />,
  Coins: <Coins className="w-6 h-6" />,
  Skull: <Skull className="w-6 h-6" />,
  Eye: <Eye className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Server: <Server className="w-6 h-6" />,
  Search: <Search className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  UserCheck: <UserCheck className="w-6 h-6" />,
  AlertTriangle: <AlertTriangle className="w-6 h-6" />,
  QrCode: <QrCode className="w-6 h-6" />,
  DollarSign: <DollarSign className="w-6 h-6" />,
  CreditCard: <CreditCard className="w-6 h-6" />,
  Key: <Key className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  Radio: <Radio className="w-6 h-6" />,
  Crosshair: <Crosshair className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  HelpCircle: <HelpCircle className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  PhoneCall: <PhoneCall className="w-6 h-6" />,
  Music: <Music className="w-6 h-6" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6" />,
  FileImage: <FileImage className="w-6 h-6" />,
  Image: <FileImage className="w-6 h-6" />,
  Scissors: <Scissors className="w-6 h-6" />,
  Barcode: <Barcode className="w-6 h-6" />,
  Images: <Images className="w-6 h-6" />,
  Type: <Type className="w-6 h-6" />,
  FileJson: <FileJson className="w-6 h-6" />,
  Binary: <Binary className="w-6 h-6" />,
  Sliders: <Sliders className="w-6 h-6" />,
  Calculator: <Calculator className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
  ArrowRightLeft: <ArrowRightLeft className="w-6 h-6" />,
  Hash: <Hash className="w-6 h-6" />,
  Palette: <Palette className="w-6 h-6" />,
  Maximize2: <Maximize2 className="w-6 h-6" />,
  Monitor: <Monitor className="w-6 h-6" />,
  Volume2: <Volume2 className="w-6 h-6" />,
};

interface ToolCardProps {
  tool: ToolItem;
  featured?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, featured = false }) => {
  const category = CATEGORIES.find((c) => c.slug === tool.categorySlug);

  return (
    <article
      className={`group relative rounded-2xl bg-cyber-card/90 border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden ${
        featured
          ? "border-cyber-green/40 shadow-neon-green/20 hover:border-cyber-green"
          : "border-cyber-borderSubtle hover:border-cyber-cyan/40 hover:shadow-neon-cyan/10"
      }`}
    >
      {/* Subtle top indicator glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-green/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-cyber-dark/80 border border-cyber-border flex items-center justify-center text-cyber-green group-hover:text-cyber-cyan transition-colors duration-200">
            {ICON_MAP[tool.iconName] || <ShieldCheck className="w-6 h-6" />}
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {tool.badge && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyber-green/10 text-cyber-green border border-cyber-green/30 font-semibold tracking-wide">
                {tool.badge}
              </span>
            )}
            {category && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyber-panel text-slate-300 border border-cyber-borderSubtle">
                {category.name}
              </span>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-cyber-green transition-colors duration-200 mb-1.5 flex items-center gap-1.5">
          {tool.name}
        </h3>

        <p className="text-xs font-mono text-cyber-cyan/80 mb-3">
          {tool.tagline}
        </p>

        <p className="text-sm text-slate-300/90 leading-relaxed mb-4 flex-1">
          {tool.description}
        </p>

        <div className="pt-4 border-t border-cyber-borderSubtle/60 flex items-center justify-between mt-auto">
          <span className="text-xs font-mono text-emerald-400/90 font-medium">
            Free • Client-Side
          </span>
          <Link
            href={`/tools/${tool.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyber-green group-hover:text-cyber-cyan group-hover:translate-x-0.5 transition-all duration-200"
            aria-label={`Launch ${tool.name}`}
          >
            Launch Tool
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
