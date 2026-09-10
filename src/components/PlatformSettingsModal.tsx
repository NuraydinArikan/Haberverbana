import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Search, 
  RotateCcw, 
  Sliders, 
  Globe, 
  Sparkles, 
  CheckSquare, 
  Square, 
  ShieldCheck,
  Building2,
  Car,
  Cpu,
  ShoppingBag,
  Repeat,
  Home,
  UtensilsCrossed,
  Shirt,
  BookOpen,
  Baby,
  PawPrint
} from 'lucide-react';
import { 
  TURKISH_PLATFORM_GROUPS, 
  ALL_PLATFORM_NAMES, 
  TOTAL_PLATFORMS_COUNT 
} from '../data/platformsData';

interface PlatformSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlatforms: string[]; // empty or ['all'] means auto/all
  onSaveSelectedPlatforms: (platforms: string[]) => void;
}

export const PlatformSettingsModal: React.FC<PlatformSettingsModalProps> = ({
  isOpen,
  onClose,
  selectedPlatforms,
  onSaveSelectedPlatforms
}) => {
  const isAutoModeInitial = selectedPlatforms.length === 0 || (selectedPlatforms.length === 1 && selectedPlatforms[0] === 'all');
  
  const [isAutoMode, setIsAutoMode] = useState<boolean>(isAutoModeInitial);
  const [tempSelected, setTempSelected] = useState<string[]>(() => {
    return isAutoModeInitial ? [] : selectedPlatforms;
  });
  const [activeCategory, setActiveCategory] = useState<string>('Tümü');
  const [searchFilter, setSearchFilter] = useState<string>('');

  if (!isOpen) return null;

  const handleTogglePlatform = (platformName: string) => {
    setTempSelected(prev => {
      if (prev.includes(platformName)) {
        return prev.filter(p => p !== platformName);
      } else {
        return [...prev, platformName];
      }
    });
  };

  const handleSelectAllInCurrentCategory = (platforms: string[]) => {
    setTempSelected(prev => {
      const set = new Set([...prev, ...platforms]);
      return Array.from(set);
    });
  };

  const handleDeselectAllInCurrentCategory = (platforms: string[]) => {
    setTempSelected(prev => prev.filter(p => !platforms.includes(p)));
  };

  const handleResetToAutoAll = () => {
    setIsAutoMode(true);
    setTempSelected([]);
  };

  const handleSave = () => {
    if (isAutoMode || tempSelected.length === 0) {
      onSaveSelectedPlatforms([]); // Empty means auto / all relevant platforms
    } else {
      onSaveSelectedPlatforms(tempSelected);
    }
    onClose();
  };

  // Filter groups
  const filteredGroups = TURKISH_PLATFORM_GROUPS.map(group => {
    let list = group.platforms;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return {
      ...group,
      platforms: list
    };
  }).filter(group => {
    if (activeCategory !== 'Tümü' && group.category !== activeCategory) {
      return false;
    }
    return group.platforms.length > 0;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111111] border border-white/15 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-red-950 flex items-center justify-center text-white border border-red-500/30 shadow-md shadow-red-950/40">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                  Radar Platform & Site Tercihleri
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                  {TOTAL_PLATFORMS_COUNT}+ Türkiye Mecrası
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Radarın hangi platformları tarayacağını belirleyin veya yapay zekaya bırakın.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-white/[0.02] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Mode 1: Auto / All (Default) */}
            <div
              onClick={() => setIsAutoMode(true)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                isAutoMode
                  ? 'bg-emerald-950/20 border-emerald-500/50 shadow-md'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isAutoMode ? 'border-emerald-400 bg-emerald-400' : 'border-white/30'
                  }`}>
                    {isAutoMode && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                  <span className="text-xs font-bold text-white">Tüm İlgili Siteleri Tara (Varsayılan)</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                  Önerilen
                </span>
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed pl-6">
                Herhangi bir site belirtmediğinizde, kategoriye uygun tüm platformlar (65+ e-ticaret, ilan ve ikinci el sitesi) otomatik taranır.
              </p>
            </div>

            {/* Mode 2: Custom Pick */}
            <div
              onClick={() => setIsAutoMode(false)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                !isAutoMode
                  ? 'bg-red-950/25 border-red-500/50 shadow-md'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    !isAutoMode ? 'border-red-500 bg-red-500' : 'border-white/30'
                  }`}>
                    {!isAutoMode && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-xs font-bold text-white">Özel Site Seçimi Yap</span>
                </div>
                {!isAutoMode && tempSelected.length > 0 && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-600/30 text-red-300">
                    {tempSelected.length} Site Seçili
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed pl-6">
                Sadece işaretleyeceğiniz siteleri tarar ve üst durum çubuğunda belirttiğiniz sitelerin isimleri yer alır.
              </p>
            </div>
          </div>
        </div>

        {/* Content: Custom Selection List (Visible when !isAutoMode) */}
        {!isAutoMode ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-[250px]">
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Platform ara (örn: Teknosa, Sahibinden, ebebek...)"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 transition-colors"
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Reset to Auto */}
              <button
                onClick={handleResetToAutoAll}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Varsayılanlara Dön</span>
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 text-xs no-scrollbar">
              <button
                onClick={() => setActiveCategory('Tümü')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === 'Tümü'
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                Tüm Kategoriler ({TOTAL_PLATFORMS_COUNT})
              </button>
              {TURKISH_PLATFORM_GROUPS.map((group) => {
                const count = group.platforms.length;
                const isCatActive = activeCategory === group.category;
                return (
                  <button
                    key={group.category}
                    onClick={() => setActiveCategory(group.category)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isCatActive
                        ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950/40'
                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{group.category.split('(')[0].trim()}</span>
                    <span className="text-[10px] opacity-60 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Platform Groups & Checkboxes */}
            <div className="space-y-4 pt-1">
              {filteredGroups.map((group) => {
                const groupPlatformNames = group.platforms.map(p => p.name);
                const allGroupSelected = groupPlatformNames.every(name => tempSelected.includes(name));

                return (
                  <div key={group.category} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-white">{group.category}</h4>
                        <p className="text-[11px] text-white/40">{group.description}</p>
                      </div>

                      <button
                        onClick={() => {
                          if (allGroupSelected) {
                            handleDeselectAllInCurrentCategory(groupPlatformNames);
                          } else {
                            handleSelectAllInCurrentCategory(groupPlatformNames);
                          }
                        }}
                        className="text-[11px] text-red-400 hover:text-red-300 font-semibold cursor-pointer underline underline-offset-2"
                      >
                        {allGroupSelected ? 'Kategoriyi Temizle' : 'Bu Kategoriyi Seç'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {group.platforms.map((platform) => {
                        const isChecked = tempSelected.includes(platform.name);

                        return (
                          <div
                            key={platform.id}
                            onClick={() => handleTogglePlatform(platform.name)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                              isChecked
                                ? 'bg-red-950/30 border-red-500/50 text-white'
                                : 'bg-black/40 border-white/5 hover:border-white/20 text-white/70'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-red-600 border-red-500 text-white' : 'border-white/30 bg-white/5'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 text-white stroke-[3]" />}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-semibold truncate ${isChecked ? 'text-white font-bold' : 'text-white/80'}`}>
                                  {platform.name}
                                </span>
                                {platform.popular && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Popüler Platform" />
                                )}
                              </div>
                              <p className="text-[10px] text-white/40 truncate">{platform.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-3 bg-[#0c0c0c] flex-1 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-white">Otomatik Çapraz Tarama Modu Aktif</h3>
            <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
              Bu modda radar, aradığınız veya takip ettiğiniz her ürün için Türkiye'nin en büyük 65+ e-ticaret ve ilan platformunu yapay zekayla otomatik olarak tarar. Sizin tek tek platform seçmeniz gerekmez.
            </p>
            <button
              onClick={() => setIsAutoMode(false)}
              className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-full text-xs font-semibold transition-colors cursor-pointer"
            >
              Belirli Siteleri Manuel Seçmek İstiyorum →
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0A0A0A] flex items-center justify-between gap-4">
          <div className="text-xs text-white/50">
            {isAutoMode ? (
              <span className="text-emerald-400 font-medium">Tüm platformlar (Otomatik Kapsam)</span>
            ) : (
              <span>
                <strong className="text-white font-bold">{tempSelected.length}</strong> platform seçildi
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-950/40 cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Ayarları Kaydet</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
