import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Tag, 
  Sparkles, 
  Zap, 
  Car, 
  Building2, 
  Globe, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  TrendingDown, 
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { DealItem, Platform } from '../types';
import { DealCard } from './DealCard';

interface PlatformGroupedFeedProps {
  deals: DealItem[];
  favoriteDealIds: string[];
  savedLaterDealIds: string[];
  compareDealIds?: string[];
  onToggleFavorite: (dealId: string) => void;
  onToggleSavedForLater: (dealId: string) => void;
  onToggleCompare?: (deal: DealItem) => void;
  onDismissDeal?: (dealId: string) => void;
  onShowToast: (msg: string, type?: 'deal' | 'system', deal?: DealItem) => void;
  onSelectDeal: (deal: DealItem) => void;
  onSendTelegram: (deal: DealItem) => void;
  onSelectPlatformFilter?: (platform: string) => void;
}

interface PlatformMeta {
  name: string;
  badgeClass: string;
  borderAccent: string;
  icon: React.ReactNode;
  tagline: string;
  domainUrl: string;
}

const PLATFORM_METAS: Record<string, PlatformMeta> = {
  Amazon: {
    name: 'Amazon Türkiye',
    badgeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    borderAccent: 'border-amber-500/30',
    icon: <ShoppingBag className="w-4 h-4 text-amber-400" />,
    tagline: 'Global E-Ticaret & İndirimli Prime Fırsatları',
    domainUrl: 'https://www.amazon.com.tr'
  },
  Sahibinden: {
    name: 'Sahibinden.com',
    badgeClass: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300',
    borderAccent: 'border-yellow-500/30',
    icon: <Tag className="w-4 h-4 text-yellow-400" />,
    tagline: 'İkinci El, Vasıta ve Sahibinden Acil İlanlar',
    domainUrl: 'https://www.sahibinden.com'
  },
  Trendyol: {
    name: 'Trendyol',
    badgeClass: 'bg-orange-500/15 border-orange-500/40 text-orange-300',
    borderAccent: 'border-orange-500/30',
    icon: <Sparkles className="w-4 h-4 text-orange-400" />,
    tagline: 'Süper Fırsatlar, Elektronik & Kupon İndirimleri',
    domainUrl: 'https://www.trendyol.com'
  },
  Hepsiburada: {
    name: 'Hepsiburada',
    badgeClass: 'bg-orange-600/15 border-orange-600/40 text-orange-400',
    borderAccent: 'border-orange-600/30',
    icon: <Zap className="w-4 h-4 text-orange-400" />,
    tagline: 'Premium Fiyat Takibi ve Efsane İndirimler',
    domainUrl: 'https://www.hepsiburada.com'
  },
  Arabam: {
    name: 'Arabam.com',
    badgeClass: 'bg-red-500/15 border-red-500/40 text-red-300',
    borderAccent: 'border-red-500/30',
    icon: <Car className="w-4 h-4 text-red-400" />,
    tagline: 'Ekspertizli ve Hatasız Otomobil Fırsatları',
    domainUrl: 'https://www.arabam.com'
  },
  'Borusan Oto Next': {
    name: 'Borusan Next',
    badgeClass: 'bg-sky-500/15 border-sky-500/40 text-sky-300',
    borderAccent: 'border-sky-500/30',
    icon: <Car className="w-4 h-4 text-sky-400" />,
    tagline: 'BMW, MINI, Land Rover & Premium 2. El Araçlar',
    domainUrl: 'https://www.borusanotonext.com'
  },
  'Borusan Next': {
    name: 'Borusan Next',
    badgeClass: 'bg-sky-500/15 border-sky-500/40 text-sky-300',
    borderAccent: 'border-sky-500/30',
    icon: <Car className="w-4 h-4 text-sky-400" />,
    tagline: 'BMW, MINI, Land Rover Sertifikalı 2. El',
    domainUrl: 'https://www.borusanotonext.com'
  },
  'Koç Oto İkinci El': {
    name: 'Otokoç 2. El (Koç Grubu)',
    badgeClass: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
    borderAccent: 'border-rose-500/30',
    icon: <Car className="w-4 h-4 text-rose-400" />,
    tagline: 'Koç Holding Güvenceli Ekspertizli Araçlar',
    domainUrl: 'https://www.otokocikinciel.com'
  },
  'Otokoç İkinci El': {
    name: 'Otokoç 2. El (Koç Grubu)',
    badgeClass: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
    borderAccent: 'border-rose-500/30',
    icon: <Car className="w-4 h-4 text-rose-400" />,
    tagline: 'Koç Holding Güvenceli Ekspertizli Araçlar',
    domainUrl: 'https://www.otokocikinciel.com'
  },
  'Araba.com': {
    name: 'Araba.com',
    badgeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    borderAccent: 'border-amber-500/30',
    icon: <Car className="w-4 h-4 text-amber-400" />,
    tagline: 'Geleneksel Açık Vasıta İlan Pazarı',
    domainUrl: 'https://www.araba.com'
  },
  'Doğuş Oto': {
    name: 'Doğuş Oto',
    badgeClass: 'bg-blue-500/15 border-blue-500/40 text-blue-300',
    borderAccent: 'border-blue-500/30',
    icon: <Car className="w-4 h-4 text-blue-400" />,
    tagline: 'Volkswagen Grubu Yetkili Satış & Servis',
    domainUrl: 'https://dogusoto.com.tr'
  },
  Neziroğlu: {
    name: 'Neziroğlu Otomotiv',
    badgeClass: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    borderAccent: 'border-emerald-500/30',
    icon: <Car className="w-4 h-4 text-emerald-400" />,
    tagline: '50+ Yıllık Güvence & Ekspertizli İkinci El',
    domainUrl: 'https://www.neziroglu.com.tr'
  },
  DOD: {
    name: 'DOD (Doğuş Otomotiv)',
    badgeClass: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
    borderAccent: 'border-cyan-500/30',
    icon: <Car className="w-4 h-4 text-cyan-400" />,
    tagline: 'Doğuş Otomotiv 101 Nokta Ekspertiz Garantisi',
    domainUrl: 'https://www.dod.com.tr'
  },
  Renault2: {
    name: 'Renault2 (Mais)',
    badgeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    borderAccent: 'border-amber-500/30',
    icon: <Car className="w-4 h-4 text-amber-400" />,
    tagline: 'Renault & Dacia Yetkili Bayi Garantili Araçlar',
    domainUrl: 'https://www.renault2.com.tr'
  },
  Spoticar: {
    name: 'Spoticar (Stellantis)',
    badgeClass: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300',
    borderAccent: 'border-indigo-500/30',
    icon: <Car className="w-4 h-4 text-indigo-400" />,
    tagline: 'Peugeot, Citroën, Opel, DS & Fiat Ortak Ağı',
    domainUrl: 'https://www.spoticar.com.tr'
  },
  'Toyota Garanti': {
    name: 'Toyota Garanti',
    badgeClass: 'bg-red-500/15 border-red-500/40 text-red-300',
    borderAccent: 'border-red-500/30',
    icon: <Car className="w-4 h-4 text-red-400" />,
    tagline: 'Toyota Plazalarında Ekspertizli Garantili 2. El',
    domainUrl: 'https://www.toyota.com.tr/ikinci-el'
  },
  'Volvo Selekt': {
    name: 'Volvo Selekt',
    badgeClass: 'bg-sky-500/15 border-sky-500/40 text-sky-300',
    borderAccent: 'border-sky-500/30',
    icon: <Car className="w-4 h-4 text-sky-400" />,
    tagline: 'Fabrika Standartlarında Kontrollü 2. El Volvo',
    domainUrl: 'https://www.volvocars.com/tr/l/volvo-selekt'
  },
  'Koluman 2. El': {
    name: 'Koluman 2. El',
    badgeClass: 'bg-slate-400/15 border-slate-400/40 text-slate-200',
    borderAccent: 'border-slate-400/30',
    icon: <Car className="w-4 h-4 text-slate-300" />,
    tagline: 'Mercedes-Benz Ana Bayi Güvencesiyle 2. El',
    domainUrl: 'https://www.koluman2el.com'
  },
  'Mengerler 2. El': {
    name: 'Mengerler 2. El',
    badgeClass: 'bg-teal-500/15 border-teal-500/40 text-teal-300',
    borderAccent: 'border-teal-500/30',
    icon: <Car className="w-4 h-4 text-teal-400" />,
    tagline: 'Mercedes & Premium Araç Kurumsal Operasyonu',
    domainUrl: 'https://www.mengerler.com'
  },
  Otoshops: {
    name: 'Otoshops (Gülpar 2. El)',
    badgeClass: 'bg-violet-500/15 border-violet-500/40 text-violet-300',
    borderAccent: 'border-violet-500/30',
    icon: <Car className="w-4 h-4 text-violet-400" />,
    tagline: 'Çok Markalı Kurumsal Bayi Ağı & Showroomlar',
    domainUrl: 'https://www.otoshops.com'
  },
  VavaCars: {
    name: 'VavaCars',
    badgeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    borderAccent: 'border-amber-500/30',
    icon: <Car className="w-4 h-4 text-amber-400" />,
    tagline: 'Garantili Ekspertizli Online 2. El Araç Satışı',
    domainUrl: 'https://tr.vavacars.com'
  },
  otoplus: {
    name: 'otoplus (letgo)',
    badgeClass: 'bg-orange-500/15 border-orange-500/40 text-orange-300',
    borderAccent: 'border-orange-500/30',
    icon: <Car className="w-4 h-4 text-orange-400" />,
    tagline: 'Takas, Doğrudan Alım ve Garantili Satış',
    domainUrl: 'https://www.otoplus.com'
  },
  'ikinciyeni.com': {
    name: 'ikinciyeni.com (Çelik Motor / Anadolu)',
    badgeClass: 'bg-lime-500/15 border-lime-500/40 text-lime-300',
    borderAccent: 'border-lime-500/30',
    icon: <Car className="w-4 h-4 text-lime-400" />,
    tagline: 'Yapay Zeka Fiyatlamalı Doğrudan Satış & İhale',
    domainUrl: 'https://www.ikinciyeni.com'
  },
  Carvak: {
    name: 'Carvak (Kavak)',
    badgeClass: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300',
    borderAccent: 'border-indigo-500/30',
    icon: <Car className="w-4 h-4 text-indigo-400" />,
    tagline: 'Yenilenmiş Sertifikalı Araç Satışı',
    domainUrl: 'https://www.carvak.com'
  },
  'Borusan Araç İhale': {
    name: 'Borusan Araç İhale',
    badgeClass: 'bg-blue-500/15 border-blue-500/40 text-blue-300',
    borderAccent: 'border-blue-500/30',
    icon: <Car className="w-4 h-4 text-blue-400" />,
    tagline: 'Filo, Banka ve Şirket Araçları Açık Artırması',
    domainUrl: 'https://www.borusanaraciharesi.com'
  },
  'İhale.ikinciyeni.com': {
    name: 'İhale.ikinciyeni.com',
    badgeClass: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    borderAccent: 'border-emerald-500/30',
    icon: <Car className="w-4 h-4 text-emerald-400" />,
    tagline: 'Bireysel ve Kurumsal Teklifli Açık Artırma',
    domainUrl: 'https://www.ikinciyeni.com/ihale'
  },
  N11: {
    name: 'N11',
    badgeClass: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
    borderAccent: 'border-purple-500/30',
    icon: <Globe className="w-4 h-4 text-purple-400" />,
    tagline: 'Uğurlu Kampanyalar ve Pazar Yeri Fırsatları',
    domainUrl: 'https://www.n11.com'
  },
  Dolap: {
    name: 'Dolap',
    badgeClass: 'bg-teal-500/15 border-teal-500/40 text-teal-300',
    borderAccent: 'border-teal-500/30',
    icon: <ShoppingBag className="w-4 h-4 text-teal-400" />,
    tagline: 'İkinci El Moda ve Teknoloji',
    domainUrl: 'https://dolap.com'
  },
  Hepsiemlak: {
    name: 'Hepsiemlak',
    badgeClass: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
    borderAccent: 'border-rose-500/30',
    icon: <Building2 className="w-4 h-4 text-rose-400" />,
    tagline: 'Fırsat Konut ve Gayrimenkul İlanları',
    domainUrl: 'https://www.hepsiemlak.com'
  }
};

const DEFAULT_PLATFORM_META: PlatformMeta = {
  name: 'Diğer Platformlar',
  badgeClass: 'bg-white/10 border-white/20 text-white/90',
  borderAccent: 'border-white/15',
  icon: <Globe className="w-4 h-4 text-white/70" />,
  tagline: 'Harici E-Ticaret ve İlan Siteleri',
  domainUrl: '#'
};

export const PlatformGroupedFeed: React.FC<PlatformGroupedFeedProps> = ({
  deals,
  favoriteDealIds,
  savedLaterDealIds,
  compareDealIds,
  onToggleFavorite,
  onToggleSavedForLater,
  onToggleCompare,
  onDismissDeal,
  onShowToast,
  onSelectDeal,
  onSendTelegram,
  onSelectPlatformFilter
}) => {
  // Collapsed state per platform (all expanded by default)
  const [collapsedPlatforms, setCollapsedPlatforms] = useState<Record<string, boolean>>({});

  // Group deals by platform
  const groupedDeals = useMemo(() => {
    const map = new Map<string, DealItem[]>();
    
    // Grouping
    for (const deal of deals) {
      const p = deal.platform || 'Diğer';
      if (!map.has(p)) {
        map.set(p, []);
      }
      map.get(p)!.push(deal);
    }

    // Sort platforms: by deal count descending
    const sortedEntries = Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
    return sortedEntries;
  }, [deals]);

  const togglePlatform = (platform: string) => {
    setCollapsedPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const expandAll = () => setCollapsedPlatforms({});
  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    for (const [platform] of groupedDeals) {
      allCollapsed[platform] = true;
    }
    setCollapsedPlatforms(allCollapsed);
  };

  const isAllCollapsed = groupedDeals.length > 0 && groupedDeals.every(([p]) => collapsedPlatforms[p]);

  return (
    <div className="space-y-8">
      {/* Top Header Controls for Grouped Feed */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Platformlara Göre Düzenlenmiş Fırsatlar</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                {groupedDeals.length} Platform
              </span>
            </h2>
            <p className="text-[11px] text-white/50">
              Fırsatlar satıcı platformlarına göre ayrılmış ve en yüksek arbitraj skoruna göre sıralanmıştır.
            </p>
          </div>
        </div>

        {/* Global Expand / Collapse Control */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={isAllCollapsed ? expandAll : collapseAll}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isAllCollapsed ? 'Tüm platform gruplarını genişlet' : 'Tüm platform gruplarını topla'}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-red-400" />
            <span>{isAllCollapsed ? 'Tümünü Genişlet' : 'Tümünü Katla'}</span>
          </button>
        </div>
      </div>

      {/* Platform Groups List */}
      <div className="space-y-8">
        {groupedDeals.map(([platformKey, platformDeals]) => {
          const meta = PLATFORM_METAS[platformKey] || {
            ...DEFAULT_PLATFORM_META,
            name: platformKey
          };

          const isCollapsed = Boolean(collapsedPlatforms[platformKey]);

          // Platform level stats
          const maxScore = Math.max(...platformDeals.map(d => d.opportunityScore));
          const avgDiscount = Math.round(
            platformDeals.reduce((sum, d) => sum + d.discountRate, 0) / platformDeals.length
          );
          const totalSavings = platformDeals.reduce(
            (sum, d) => sum + (d.marketAvgPrice - d.currentPrice),
            0
          );

          return (
            <div 
              key={platformKey}
              id={`platform-group-${platformKey.toLowerCase()}`}
              className="rounded-3xl bg-[#0F0F0F] border border-white/10 overflow-hidden transition-all duration-200"
            >
              {/* Platform Group Header Bar */}
              <div 
                onClick={() => togglePlatform(platformKey)}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
              >
                {/* Left: Platform Identity */}
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-md shrink-0 ${meta.badgeClass}`}>
                    {meta.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-serif text-lg font-bold text-white tracking-tight">
                        {meta.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/15">
                        {platformDeals.length} Fırsat
                      </span>
                      {maxScore >= 8.5 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1 font-mono">
                          <Zap className="w-3 h-3" />
                          Dip Fiyat Skoru: {maxScore.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/50 mt-0.5">
                      {meta.tagline}
                    </p>
                  </div>
                </div>

                {/* Right: Metrics & Actions */}
                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap justify-between md:justify-end">
                  {/* Platform Quick Badges */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      Ort. %{avgDiscount} İndirim
                    </span>

                    {totalSavings > 0 && (
                      <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-white/70 hidden lg:inline-flex">
                        ₺{totalSavings.toLocaleString('tr-TR')} Toplam Tasarruf
                      </span>
                    )}
                  </div>

                  {/* External Platform Link (Direct Browse) */}
                  {meta.domainUrl && meta.domainUrl !== '#' && (
                    <a
                      href={meta.domainUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
                      title={`${meta.name} anasayfasını yeni sekmede aç`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {/* Collapse Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlatform(platformKey);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
                    aria-label={isCollapsed ? 'Genişlet' : 'Daralt'}
                    title={isCollapsed ? 'Genişlet' : 'Daralt'}
                  >
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Group Deals Body */}
              {!isCollapsed && (
                <div className="p-4 sm:p-5 pt-0 border-t border-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-5">
                    {platformDeals.map((deal) => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        isFavorite={favoriteDealIds.includes(deal.id)}
                        isSavedForLater={savedLaterDealIds.includes(deal.id)}
                        isComparing={compareDealIds?.includes(deal.id)}
                        onToggleFavorite={onToggleFavorite}
                        onToggleSavedForLater={onToggleSavedForLater}
                        onToggleCompare={onToggleCompare}
                        onDismissDeal={onDismissDeal}
                        onShowToast={onShowToast}
                        onSelectDeal={onSelectDeal}
                        onSendTelegram={onSendTelegram}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
