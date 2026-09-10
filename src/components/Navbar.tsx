import React from 'react';
import { 
  Radar, 
  PlusCircle, 
  Send, 
  Chrome, 
  SlidersHorizontal, 
  Zap, 
  Bell, 
  Contrast, 
  Sliders
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'feed' | 'rules' | 'extension' | 'pricing';
  setActiveTab: (tab: 'feed' | 'rules' | 'extension' | 'pricing') => void;
  onOpenRuleDrawer: () => void;
  onOpenTelegramModal: () => void;
  onOpenOnboarding?: () => void;
  onOpenNotificationCenter: () => void;
  onOpenPlatformSettings?: () => void;
  selectedPlatforms?: string[];
  unreadNotificationsCount?: number;
  contrastMode: 'midnight' | 'high-contrast';
  onToggleContrast: () => void;
  user: UserProfile;
  activeRulesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenRuleDrawer,
  onOpenTelegramModal,
  onOpenNotificationCenter,
  onOpenPlatformSettings,
  selectedPlatforms = [],
  unreadNotificationsCount = 0,
  contrastMode,
  onToggleContrast,
  activeRulesCount
}) => {
  // Format the platform status text dynamically
  const getPlatformDisplayText = () => {
    if (!selectedPlatforms || selectedPlatforms.length === 0 || (selectedPlatforms.length === 1 && selectedPlatforms[0] === 'all')) {
      return 'Tüm İlgili Platformlar (Kategoriye Göre 65+ Mecra)';
    }
    if (selectedPlatforms.length <= 3) {
      return selectedPlatforms.join(' • ');
    }
    return `${selectedPlatforms.slice(0, 3).join(' • ')} (+${selectedPlatforms.length - 3} site)`;
  };

  const isCustomPlatforms = selectedPlatforms && selectedPlatforms.length > 0 && selectedPlatforms[0] !== 'all';

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10">
      {/* Top Banner: Minimal Clean Status Bar */}
      <div className="bg-[#050505] border-b border-white/5 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Dynamic System Platform Status */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-1.5 truncate font-mono text-[11px] text-white/80">
              <span>Sistem: Canlı Radar Aktif •</span>
              <span className={isCustomPlatforms ? "text-amber-400 font-bold" : "text-emerald-400 font-medium"}>
                {getPlatformDisplayText()}
              </span>
              {onOpenPlatformSettings && (
                <button
                  onClick={onOpenPlatformSettings}
                  className="text-[10px] text-red-400 hover:text-red-300 underline underline-offset-2 ml-1 cursor-pointer font-bold"
                  title="Platform ve site tercihlerini ayarla"
                >
                  [Ayarlar]
                </button>
              )}
            </div>
          </div>

          {/* Right: Quick Settings & Counters */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-white/60 font-mono shrink-0">
            {/* Contrast Mode */}
            <button
              onClick={onToggleContrast}
              className="hover:text-white text-white/80 flex items-center gap-1.5 transition-colors cursor-pointer group"
              title="Midnight ve Yüksek Kontrast dark mode arasında geçiş yapın"
            >
              <Contrast className={`w-3 h-3 ${contrastMode === 'high-contrast' ? 'text-amber-400' : 'text-white/60'} group-hover:rotate-180 transition-transform duration-300`} />
              <span className="hidden sm:inline underline underline-offset-2">
                Mod: <strong className={contrastMode === 'high-contrast' ? 'text-amber-400' : 'text-white'}>{contrastMode === 'high-contrast' ? 'Yüksek Kontrast' : 'Midnight'}</strong>
              </span>
            </button>
            <span className="text-white/20">•</span>

            {/* Bildirim Merkezi */}
            <button
              onClick={onOpenNotificationCenter}
              className="hover:text-white text-white/80 flex items-center gap-1.5 transition-colors cursor-pointer group"
              title="Bildirim Merkezini Aç"
            >
              <Bell className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="underline underline-offset-2">Bildirimler</span>
              {unreadNotificationsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-bold rounded-full">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            <span className="text-white/20">•</span>

            {/* Takip Edilen Kural Sayısı */}
            <span className="text-white/70">
              Kural: <strong className="text-white font-bold">{activeRulesCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo with Smooth Continuous Rotating Radar Icon */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-950 flex items-center justify-center text-white shadow-lg shadow-red-950/40 border border-red-500/30 shrink-0">
              <Radar className="w-5 h-5 animate-radar-spin text-white" />
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

          {/* Navigation Tabs */}
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
              title="Takip Taleplerim ve Radar Kuralları"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Taleplerim ({activeRulesCount})</span>
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
              <span>Planlar</span>
            </button>
          </nav>

          {/* Action Buttons (Clean & Focused) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Platform Ayarları Butonu */}
            {onOpenPlatformSettings && (
              <button
                id="open-platform-settings-btn"
                onClick={onOpenPlatformSettings}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border border-white/10 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer group"
                title="Platform ve Site Tercihleri (Ayarlar)"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
                <span className="hidden sm:inline">Ayarlar</span>
              </button>
            )}

            {/* Telegram Entegrasyonu */}
            <button
              id="open-telegram-btn"
              onClick={onOpenTelegramModal}
              className="p-2 sm:px-3 sm:py-2 bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/30 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Telegram Canlı Bildirim Ayarları"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Telegram</span>
            </button>

            {/* Yeni Talep Ekle */}
            <button
              id="add-rule-btn"
              onClick={onOpenRuleDrawer}
              className="px-3.5 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold shadow-lg shadow-red-900/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="whitespace-nowrap">+ Yeni Talep</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
