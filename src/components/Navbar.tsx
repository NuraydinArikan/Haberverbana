import React from 'react';
import { 
  Radar, 
  PlusCircle, 
  Send, 
  Chrome, 
  HelpCircle, 
  SlidersHorizontal, 
  Sparkles, 
  ShieldCheck,
  Zap,
  TrendingDown,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'feed' | 'rules' | 'extension' | 'pricing';
  setActiveTab: (tab: 'feed' | 'rules' | 'extension' | 'pricing') => void;
  onOpenRuleDrawer: () => void;
  onOpenTelegramModal: () => void;
  onOpenOnboarding: () => void;
  user: UserProfile;
  activeRulesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenRuleDrawer,
  onOpenTelegramModal,
  onOpenOnboarding,
  user,
  activeRulesCount
}) => {
  const handleOpenAppNewTab = () => {
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10">
      {/* Top Banner: Status Bar */}
      <div className="bg-[#050505] border-b border-white/5 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] text-white/80">
              7/24 Kesintisiz Fırsat Radarı Aktif • Amazon, Hepsiburada, Trendyol, Sahibinden
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-white/60 font-mono">
            <button
              onClick={handleOpenAppNewTab}
              className="hover:text-white text-white/70 flex items-center gap-1 transition-colors group cursor-pointer"
              title="Uygulamayı bağımsız sekmede aç"
            >
              <ExternalLink className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="underline underline-offset-2">Yeni Sekmede Aç</span>
            </button>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="hidden sm:flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Doğrulanmış İlanlar
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="hidden sm:inline text-white/70">
              Takip Edilen Kural: <strong className="text-white font-bold">{activeRulesCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-950 flex items-center justify-center text-white shadow-lg shadow-red-950/40 border border-red-500/30">
              <Radar className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                  haberverbana<span className="text-red-500">.app</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Canlı
                </span>
              </div>
              <p className="text-[11px] text-white/50 font-medium italic tracking-wide">
                "Sen Arama, O Haber Versin"
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 text-xs font-medium">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'feed'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-red-500" />
              <span>Fırsat Radarı</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'rules'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Kurallarım ({activeRulesCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('extension')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'extension'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Chrome className="w-3.5 h-3.5 text-amber-400" />
              <span>Linkle Tara</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'pricing'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Pro & Arbitraj</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Direct Open in New Tab button */}
            <button
              id="open-app-new-tab-btn"
              onClick={handleOpenAppNewTab}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border border-white/10 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Uygulamayı bağımsız yeni sekmede tam ekran aç"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Yeni Sekmede Aç</span>
            </button>

            <button
              id="open-telegram-btn"
              onClick={onOpenTelegramModal}
              className="p-2 sm:px-3 sm:py-1.5 bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/30 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Telegram Canlı Bildirim Ayarları"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Telegram Bildirimleri</span>
            </button>

            <button
              id="open-onboarding-btn"
              onClick={onOpenOnboarding}
              className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              title="Nasıl Çalışır? Rehberi"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              id="add-rule-btn"
              onClick={onOpenRuleDrawer}
              className="px-3.5 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold shadow-lg shadow-red-900/30 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="whitespace-nowrap">+ Radar Kuralı</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
