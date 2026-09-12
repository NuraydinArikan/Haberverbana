import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Sliders, 
  Send, 
  Bell, 
  Check, 
  Sparkles,
  DollarSign,
  Tag,
  Search,
  ExternalLink,
  Globe,
  Bot,
  Zap,
  CheckSquare,
  Square,
  Compass,
  Cpu,
  Car,
  Edit3
} from 'lucide-react';
import { DealCategory, RadarRule, Platform } from '../types';
import { 
  buildPlatformSearchUrl, 
  getAiRecommendedPlatforms, 
  ALL_AVAILABLE_PLATFORMS,
  CATEGORY_PLATFORMS_MAP,
  AUTOMOTIVE_SUBGROUPS,
  getPlatformBadgeStyle,
  PlatformItemSpec
} from '../utils/searchUrlBuilder';

export const formatPriceHuman = (val: number): string => {
  if (isNaN(val) || val <= 0) return '₺0';
  if (val >= 1_000_000) {
    const millions = val / 1_000_000;
    return `${millions.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} Milyon TL (₺${val.toLocaleString('tr-TR')})`;
  }
  if (val >= 1_000) {
    const thousands = val / 1_000;
    return `${thousands.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} Bin TL (₺${val.toLocaleString('tr-TR')})`;
  }
  return `₺${val.toLocaleString('tr-TR')} TL`;
};

interface RuleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRule: (rule: Omit<RadarRule, 'id' | 'createdAt' | 'matchedCount'>, ruleIdToUpdate?: string) => void;
  initialValues?: Partial<Omit<RadarRule, 'id' | 'createdAt' | 'matchedCount'>> | null;
  ruleToEdit?: RadarRule | null;
}

const CATEGORIES: DealCategory[] = [
  'Elektronik & Bilgisayar',
  'Otomobil & Vasıta',
  'Emlak & Konut',
  'Giyim & Moda',
  'Ev & Yaşam'
];

const PRESET_SUGGESTIONS = [
  { name: 'MacBook Air M3 16GB', cat: 'Elektronik & Bilgisayar' as DealCategory, max: 50000, ai: 'Satıcısı resmi Amazon olan ve 50.000 TL altındaki fırsatları bildir.' },
  { name: 'Tesla Model Y RWD', cat: 'Otomobil & Vasıta' as DealCategory, max: 2400000, ai: 'Hatasız, boyasız, PPF kaplamalı veya kış lastikli olanları; Borusan Oto Next, Koç Oto İkinci El, Doğuş Oto, Neziroğlu, Sahibinden ve Arabam genelinde yüksek puanla değerlendir.' },
  { name: 'Sony WH-1000XM5', cat: 'Elektronik & Bilgisayar' as DealCategory, max: 12500, ai: 'Kapalı kutu distribütör garantili ve piyasa ortalamasının altında olanlar.' },
  { name: 'Dyson V15 Detect', cat: 'Ev & Yaşam' as DealCategory, max: 26000, ai: 'Resmi Dyson satıcılı ve 26.000 TL altındaki fırsatlar.' }
];

export const RuleDrawer: React.FC<RuleDrawerProps> = ({
  isOpen,
  onClose,
  onSaveRule,
  initialValues,
  ruleToEdit
}) => {
  const [searchQuery, setSearchQuery] = useState('MacBook Air M3 16GB');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DealCategory>('Elektronik & Bilgisayar');
  const [minPrice, setMinPrice] = useState<number>(1000);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  
  // Platform Strategy Mode: 'auto_ai' (AI scans all probable platforms) vs 'manual' (User freely chooses)
  const [platformMode, setPlatformMode] = useState<'auto_ai' | 'manual'>('auto_ai');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['Amazon', 'Hepsiburada', 'Trendyol', 'Sahibinden']);
  const [autoExpandPlatforms, setAutoExpandPlatforms] = useState<boolean>(true);
  const [showOtherPlatforms, setShowOtherPlatforms] = useState<boolean>(false);

  const [aiInstructions, setAiInstructions] = useState('Satıcısı resmi satıcı olan ve 50 bin altındaki fırsatları haber ver.');
  const [positiveKeywordsInput, setPositiveKeywordsInput] = useState('');
  const [positiveKeywords, setPositiveKeywords] = useState<string[]>(['16GB', 'M3', 'Sıfır']);
  const [negativeKeywordsInput, setNegativeKeywordsInput] = useState('');
  const [negativeKeywords, setNegativeKeywords] = useState<string[]>([
    'teşhir',
    'kutusu açık',
    'parça niyetine',
    'tamirli',
    'ağır hasarlı'
  ]);
  const [minScore, setMinScore] = useState<number>(7.5);
  const [notificationChannel, setNotificationChannel] = useState<'Telegram' | 'E-posta' | 'Tümü'>('Telegram');
  const [frequency, setFrequency] = useState<'Anlık' | 'Günde 1 Kez' | 'Haftalık Özet'>('Anlık');

  // Compute AI platform discovery whenever searchQuery or category changes
  const aiPlatformDiscovery = getAiRecommendedPlatforms(searchQuery, category);

  useEffect(() => {
    if (!isOpen) return;

    const source = ruleToEdit || initialValues;
    if (source) {
      if (source.searchQuery !== undefined) setSearchQuery(source.searchQuery);
      if (source.name !== undefined) setName(source.name);
      if (source.category !== undefined) setCategory(source.category);
      if (source.minPrice !== undefined) setMinPrice(source.minPrice);
      if (source.maxPrice !== undefined) setMaxPrice(source.maxPrice);
      if (source.minScore !== undefined) setMinScore(source.minScore);
      if (source.aiInstructions !== undefined) setAiInstructions(source.aiInstructions);
      if (source.platforms !== undefined) setSelectedPlatforms(source.platforms);
      if (source.platformMode !== undefined) setPlatformMode(source.platformMode === 'manual' ? 'manual' : 'auto_ai');
      if (source.autoExpandPlatforms !== undefined) setAutoExpandPlatforms(source.autoExpandPlatforms);
      if (source.positiveKeywords !== undefined) setPositiveKeywords(source.positiveKeywords);
      if (source.negativeKeywords !== undefined) setNegativeKeywords(source.negativeKeywords);
      if (source.notificationChannel !== undefined) setNotificationChannel(source.notificationChannel);
      if (source.frequency !== undefined) setFrequency(source.frequency);
    } else {
      setSearchQuery('MacBook Air M3 16GB');
      setName('MacBook Air M3 16GB Radarı');
      setCategory('Elektronik & Bilgisayar');
      setMinPrice(1000);
      setMaxPrice(50000);
      setPlatformMode('auto_ai');
      setSelectedPlatforms(['Amazon', 'Hepsiburada', 'Trendyol', 'Sahibinden']);
      setAutoExpandPlatforms(true);
      setAiInstructions('Satıcısı resmi satıcı olan ve 50 bin altındaki fırsatları haber ver.');
      setPositiveKeywords(['16GB', 'M3', 'Sıfır']);
      setNegativeKeywords(['teşhir', 'kutusu açık', 'parça niyetine', 'tamirli', 'ağır hasarlı']);
      setMinScore(7.5);
      setNotificationChannel('Telegram');
      setFrequency('Anlık');
    }
  }, [isOpen, ruleToEdit, initialValues]);

  if (!isOpen) return null;

  const togglePlatform = (p: Platform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(item => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const applyPreset = (preset: typeof PRESET_SUGGESTIONS[0]) => {
    setSearchQuery(preset.name);
    setName(preset.name + ' Radarı');
    setCategory(preset.cat);
    setMaxPrice(preset.max);
    setAiInstructions(preset.ai);
    const catSpecs = CATEGORY_PLATFORMS_MAP[preset.cat];
    if (catSpecs && catSpecs.length > 0) {
      setSelectedPlatforms(catSpecs.map(s => s.name));
    }
  };

  const handleAddPositiveKeyword = () => {
    if (positiveKeywordsInput.trim()) {
      setPositiveKeywords([...positiveKeywords, positiveKeywordsInput.trim()]);
      setPositiveKeywordsInput('');
    }
  };

  const handleRemovePositiveKeyword = (kw: string) => {
    setPositiveKeywords(positiveKeywords.filter(k => k !== kw));
  };

  const handleAddNegativeKeyword = () => {
    if (negativeKeywordsInput.trim()) {
      setNegativeKeywords([...negativeKeywords, negativeKeywordsInput.trim()]);
      setNegativeKeywordsInput('');
    }
  };

  const handleRemoveNegativeKeyword = (kw: string) => {
    setNegativeKeywords(negativeKeywords.filter(k => k !== kw));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveQuery = searchQuery.trim();
    if (!effectiveQuery) return;

    // Determine target platforms based on user choice vs AI auto discovery
    const targetPlatforms = platformMode === 'auto_ai' 
      ? aiPlatformDiscovery.platforms 
      : selectedPlatforms;

    onSaveRule({
      name: name.trim() || `${effectiveQuery} Radarı`,
      searchQuery: effectiveQuery,
      category,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      platformMode,
      platforms: targetPlatforms,
      autoExpandPlatforms: platformMode === 'manual' ? autoExpandPlatforms : true,
      aiDiscoveredPlatforms: aiPlatformDiscovery.platforms,
      aiRationale: aiPlatformDiscovery.rationale,
      aiInstructions: aiInstructions.trim(),
      positiveKeywords,
      negativeKeywords,
      minScore,
      notificationChannel,
      frequency,
      isActive: ruleToEdit ? ruleToEdit.isActive : true
    }, ruleToEdit?.id);

    onClose();
  };

  const activeScanningPlatforms = platformMode === 'auto_ai' 
    ? aiPlatformDiscovery.platforms 
    : selectedPlatforms;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-Up Bottom Sheet / Drawer */}
      <div className="fixed inset-x-0 bottom-0 max-h-[92vh] flex flex-col bg-[#0F0F0F] border-t border-white/20 rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 text-white">
        {/* Grab bar */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-1" />

        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              ruleToEdit 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'bg-red-600/20 text-red-500 border border-red-500/30'
            }`}>
              {ruleToEdit ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base sm:text-lg font-bold text-white">
                  {ruleToEdit ? (
                    <>Talebi / Radarı Düzenle: <span className="text-amber-400">{ruleToEdit.name}</span></>
                  ) : (
                    'Yeni Fırsat Radarı Oluştur'
                  )}
                </h2>
                {ruleToEdit ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
                    Düzenleme Modu
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                    Akıllı Platform Taraması
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50">
                {ruleToEdit 
                  ? 'Bütçe sınırları, arama terimi, anahtar kelimeler, AI kriterleri ve taranacak platformları güncelleyin.'
                  : '"Sen Arama, O Haber Versin" — Aradığınız ürünü veya bütçenizi belirleyin, radar sizin için tüm pazar yerlerini 7/24 izlesin.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Quick Preset Badges */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider block">
              Hızlı Örnek Seçin veya Kendiniz Yazın:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {PRESET_SUGGESTIONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 rounded-xl text-xs whitespace-nowrap transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: What are you looking for? */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#141414] to-black border border-red-500/20 space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-red-500" />
              <label className="text-sm font-bold text-white">
                1. Ne Arıyorsunuz? (Ürün, Marka veya Model)
              </label>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!name || name.endsWith(' Radarı')) {
                    setName(e.target.value ? `${e.target.value} Radarı` : '');
                  }
                }}
                placeholder="Örn: MacBook Air M3 16GB veya Tesla Model Y RWD..."
                required
                className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-medium"
              />
              <p className="text-[11px] text-white/50 leading-relaxed">
                Herhangi bir ürün linki yapıştırmanıza gerek yoktur. Bot bu arama kelimesini aşağıda seçtiğiniz tüm mecralarda 7/24 otomatik aratacaktır.
              </p>
            </div>

            {/* Category & Custom Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-mono text-white/60 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const newCat = e.target.value as DealCategory;
                    setCategory(newCat);
                    const catSpecs = CATEGORY_PLATFORMS_MAP[newCat];
                    if (catSpecs && catSpecs.length > 0) {
                      setSelectedPlatforms(catSpecs.map(s => s.name));
                    }
                  }}
                  className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#141414] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/60 mb-1">
                  Radar Kural İsmi (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: M3 Air 16GB Takibi"
                  className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                >
                </input>
              </div>
            </div>
          </div>

          {/* Section 2: Hybrid Platform Architecture (AI Auto-Discovery + User Freedom) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#229ED9]" />
                <span>2. Platform Tarama Stratejisi</span>
              </label>

              {/* Strategy Switcher Tabs */}
              <div className="flex items-center p-1 bg-white/5 rounded-xl border border-white/10 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setPlatformMode('auto_ai')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    platformMode === 'auto_ai'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Otomatik Keşif</span>
                  <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full font-mono">Tavsiye</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlatformMode('manual')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    platformMode === 'manual'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Özel Platform Seçimi</span>
                </button>
              </div>
            </div>

            {/* TAB 1: AI AUTO DISCOVERY VIEW */}
            {platformMode === 'auto_ai' ? (
              <div className="space-y-3">
                {/* AI Rationale Banner */}
                <div className="p-3.5 bg-gradient-to-r from-red-950/30 to-purple-950/20 border border-red-500/30 rounded-xl space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-1.5">
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Gemini AI Çapraz Platform Algoritması
                    </span>
                    <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                      %{Math.round(aiPlatformDiscovery.confidence * 100)} Doğruluk Güveni • {aiPlatformDiscovery.highlightCategory}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {aiPlatformDiscovery.rationale}
                  </p>
                  <div className="pt-1 flex items-center gap-2 flex-wrap text-[11px] text-white/50">
                    <span>Otomatik Keşfedilen & Eş Zamanlı Taranacak Mecralar:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {aiPlatformDiscovery.platforms.map((p) => (
                        <span 
                          key={p} 
                          className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold flex items-center gap-1 ${getPlatformBadgeStyle(p)}`}
                        >
                          <Check className="w-2.5 h-2.5" />
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11.5px] text-white/50 pt-1">
                  <span>💡 Yeni bir pazar yeri eklendiğinde AI onu otomatik olarak tarama havuzuna alır.</span>
                  <button
                    type="button"
                    onClick={() => setPlatformMode('manual')}
                    className="text-red-400 hover:text-red-300 font-medium underline"
                  >
                    Kendim Seçmek İstiyorum
                  </button>
                </div>
              </div>
            ) : (
              /* TAB 2: MANUAL USER FREEDOM VIEW */
              <div className="space-y-3">
                {/* Category-targeted header & Quick Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {category === 'Otomobil & Vasıta' ? '🚗 Otomotiv Portalları (5 Kategori & 20 Kurumsal Mecra):' : `${category} Portalları:`}
                    </span>
                    <span className="font-mono text-white/50 text-[11px] bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      {selectedPlatforms.length} mecra seçili
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const catSpecs = CATEGORY_PLATFORMS_MAP[category] || [];
                        const allCatNames = catSpecs.map(s => s.name);
                        setSelectedPlatforms(allCatNames);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors"
                    >
                      Tümünü Seç
                    </button>
                    {category === 'Otomobil & Vasıta' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const distPlatforms = AUTOMOTIVE_SUBGROUPS
                              .filter(g => g.groupId === 'distributors_certified' || g.groupId === 'multi_brand_showrooms')
                              .flatMap(g => g.platforms.map(p => p.name));
                            setSelectedPlatforms(distPlatforms);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-[11px] font-medium flex items-center gap-1 transition-colors"
                        >
                          <ShieldCheck className="w-3 h-3 text-sky-400" />
                          Sertifikalı & Showroomlar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const directPlatforms = AUTOMOTIVE_SUBGROUPS
                              .filter(g => g.groupId === 'instant_cash_retail' || g.groupId === 'online_auctions')
                              .flatMap(g => g.platforms.map(p => p.name));
                            setSelectedPlatforms(directPlatforms);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-medium flex items-center gap-1 transition-colors"
                        >
                          <Zap className="w-3 h-3 text-amber-400" />
                          Stoktan Satış & İhaleler
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const first = CATEGORY_PLATFORMS_MAP[category]?.[0]?.name || 'Sahibinden';
                        setSelectedPlatforms([first]);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-[11px] transition-colors"
                    >
                      Sıfırla
                    </button>
                  </div>
                </div>

                {/* Platform Rendering: Grouped by 5 Taxonomies for Automotive, or Single Grid for others */}
                {category === 'Otomobil & Vasıta' ? (
                  <div className="space-y-4">
                    {AUTOMOTIVE_SUBGROUPS.map((subgroup) => {
                      const groupPlatformNames = subgroup.platforms.map(p => p.name);
                      const allGroupSelected = groupPlatformNames.every(name => selectedPlatforms.includes(name));
                      const someGroupSelected = groupPlatformNames.some(name => selectedPlatforms.includes(name));

                      const toggleGroup = () => {
                        if (allGroupSelected) {
                          setSelectedPlatforms(prev => prev.filter(p => !groupPlatformNames.includes(p)));
                        } else {
                          setSelectedPlatforms(prev => Array.from(new Set([...prev, ...groupPlatformNames])));
                        }
                      };

                      return (
                        <div key={subgroup.groupId} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2.5">
                          {/* Subgroup Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-white/5">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-white">{subgroup.groupTitle}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">
                                  {subgroup.badgeText}
                                </span>
                              </div>
                              <p className="text-[11px] text-white/40 mt-0.5">{subgroup.groupDescription}</p>
                            </div>
                            <button
                              type="button"
                              onClick={toggleGroup}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors shrink-0 self-start sm:self-auto"
                            >
                              {allGroupSelected ? 'Tümünü Kaldır' : 'Grubu Seç'}
                            </button>
                          </div>

                          {/* Cards Grid in Subgroup */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {subgroup.platforms.map((item) => {
                              const isSelected = selectedPlatforms.includes(item.name);
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => togglePlatform(item.name)}
                                  className={`p-2.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                                    isSelected
                                      ? 'bg-red-600/15 border-red-500 text-white shadow-sm ring-1 ring-red-500/30'
                                      : 'bg-black/30 border-white/10 text-white/60 hover:text-white hover:bg-white/5'
                                  }`}
                                >
                                  <div className="space-y-0.5 pr-2">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-semibold text-xs text-white">{item.displayName || item.name}</span>
                                      {item.kurumsal && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono font-medium flex items-center gap-0.5">
                                          <ShieldCheck className="w-2.5 h-2.5" />
                                          Kurumsal
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10.5px] text-white/50 leading-tight">
                                      {item.badge}
                                    </p>
                                  </div>
                                  <div className="mt-0.5 shrink-0">
                                    {isSelected ? (
                                      <CheckSquare className="w-4 h-4 text-red-400" />
                                    ) : (
                                      <Square className="w-4 h-4 text-white/30" />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Standard Grid for non-automotive categories */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {(CATEGORY_PLATFORMS_MAP[category] || []).map((item) => {
                      const isSelected = selectedPlatforms.includes(item.name);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => togglePlatform(item.name)}
                          className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                            isSelected
                              ? 'bg-red-600/15 border-red-500 text-white shadow-sm ring-1 ring-red-500/30'
                              : 'bg-black/30 border-white/10 text-white/60 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className="space-y-1 pr-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-xs text-white">{item.displayName || item.name}</span>
                              {item.kurumsal && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono font-medium flex items-center gap-0.5">
                                  <ShieldCheck className="w-2.5 h-2.5" />
                                  Kurumsal
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-white/50 leading-tight">
                              {item.badge}
                            </p>
                          </div>
                          <div className="mt-0.5 shrink-0">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-red-400" />
                            ) : (
                              <Square className="w-4 h-4 text-white/30" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Collapsible General/Other Platforms */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowOtherPlatforms(!showOtherPlatforms)}
                    className="text-xs text-white/60 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-white/40" />
                    <span>
                      {showOtherPlatforms 
                        ? 'Diğer genel e-ticaret sitelerini gizle' 
                        : '+ Diğer genel pazaryerlerini de ekle (Amazon, Hepsiburada, Trendyol vb.)'}
                    </span>
                  </button>

                  {showOtherPlatforms && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-white/10 animate-in fade-in duration-200">
                      {ALL_AVAILABLE_PLATFORMS
                        .filter(p => !(CATEGORY_PLATFORMS_MAP[category] || []).some(catP => catP.name === p))
                        .map((p) => {
                          const isSelected = selectedPlatforms.includes(p);
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => togglePlatform(p)}
                              className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                                isSelected
                                  ? 'bg-red-600/15 border-red-500 text-white'
                                  : 'bg-black/20 border-white/10 text-white/50 hover:text-white'
                              }`}
                            >
                              <span>{p}</span>
                              {isSelected ? (
                                <CheckSquare className="w-3.5 h-3.5 text-red-400 shrink-0" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-white/30 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Hybrid Option: Auto-expand with AI */}
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="auto-expand-toggle"
                    checked={autoExpandPlatforms}
                    onChange={(e) => setAutoExpandPlatforms(e.target.checked)}
                    className="mt-0.5 accent-red-600 rounded cursor-pointer"
                  />
                  <label htmlFor="auto-expand-toggle" className="text-xs text-white/80 cursor-pointer space-y-0.5">
                    <span className="font-semibold text-white block">
                      🌟 Akıllı Genişletme (Hibrit Güvence)
                    </span>
                    <span className="text-white/50 block text-[11px]">
                      Seçtiğim platformlar haricinde başka bir güvenilir mecrada (ör: N11, Sahibinden) piyasanın çok altında dip fiyat tespit edilirse AI onu da fırsat olarak bildirsin.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Generated Search URLs Live Preview */}
            {searchQuery.trim() && (
              <div className="mt-3 p-3 bg-[#0A0A0A] border border-white/10 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                  <span>⚡ Canlı Taranacak Platform URL Şablonları ({activeScanningPlatforms.length} Mecra):</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Aktif
                  </span>
                </div>
                <div className="space-y-1.5 font-mono text-[10.5px] max-h-36 overflow-y-auto pr-1">
                  {activeScanningPlatforms.map(p => {
                    const url = buildPlatformSearchUrl(p, searchQuery, maxPrice);
                    return (
                      <div key={p} className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white/5 text-white/70 hover:text-white group">
                        <div className="flex items-center gap-2 truncate">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${getPlatformBadgeStyle(p)}`}>
                            {p}
                          </span>
                          <span className="truncate text-white/50 group-hover:text-white/80">{url}</span>
                        </div>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="p-1 hover:bg-white/10 rounded text-red-400 shrink-0"
                          title="Önizle"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Budget & AI Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price Limits */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <label className="text-xs font-mono text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3. Bütçe Sınırları</span>
                </label>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {formatPriceHuman(maxPrice)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-white/40 block mb-1">Min Bütçe (TL)</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block mb-1">Maksimum Bütçe Tavanı (TL)</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-mono font-bold text-emerald-400"
                  />
                </div>
              </div>

              {/* Zero error prevention & quick multiplier buttons */}
              <div className="pt-1">
                <span className="text-[10.5px] text-white/40 block mb-1.5">
                  Hızlı Bütçe Düzeltme (Eksik/Fazla Sıfır Düzeltici):
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setMaxPrice(prev => prev * 10)}
                    className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-semibold transition-colors cursor-pointer"
                    title="Bir sıfır ekle (Örn: 300.000 TL → 3.000.000 TL)"
                  >
                    ×10 (0 Ekle)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaxPrice(prev => Math.floor(prev / 10))}
                    className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-semibold transition-colors cursor-pointer"
                    title="Bir sıfır sil (Örn: 3.000.000 TL → 300.000 TL)"
                  >
                    ÷10 (0 Sil)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaxPrice(3000000)}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    3.000.000 ₺
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaxPrice(2500000)}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    2.500.000 ₺
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaxPrice(prev => prev + 500000)}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    +500 Bin ₺
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-white/40">
                Belirlediğiniz maksimum bütçenin üzerinde kalan ilanlar bildirim olarak iletilmez.
              </p>
            </div>

            {/* AI Custom Evaluation Instructions */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <label className="text-xs font-mono text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Gemini AI Özel Değerlendirme Talimatı</span>
              </label>

              <textarea
                rows={3}
                value={aiInstructions}
                onChange={(e) => setAiInstructions(e.target.value)}
                placeholder="Örn: Satıcı resmi Amazon TR ise ve fiyat 50.000 TL altındaysa yüksek fırsat skoru ver..."
                className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-red-500 resize-none leading-relaxed"
              />

              <span className="text-[10px] text-white/40 block">
                Yapay zeka ilanları incelerken verdiğiniz bu kriteri 1-10 puanlamasında esas alır.
              </span>
            </div>
          </div>

          {/* Section 4: Negative Keywords (Anti-Spam) */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                <span>5. Negatif Filtreler (Görülürse Anında Eler)</span>
              </label>
              <span className="text-[10px] text-white/40">İstemediğiniz kelimeler</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {negativeKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-300 flex items-center gap-1"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNegativeKeyword(kw)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={negativeKeywordsInput}
                onChange={(e) => setNegativeKeywordsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNegativeKeyword();
                  }
                }}
                placeholder="Örn: hasarlı, yenilenmiş, teşhir..."
                className="flex-1 px-3 py-1.5 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={handleAddNegativeKeyword}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold"
              >
                Ekle
              </button>
            </div>
          </div>

          {/* Section 5: Notification & Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <label className="text-xs font-mono text-white/70 uppercase tracking-wider block">
                Bildirim Kanalı
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Telegram', 'E-posta', 'Tümü'] as const).map((channel) => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => setNotificationChannel(channel)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                      notificationChannel === channel
                        ? 'bg-white text-black font-bold shadow'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {channel === 'Telegram' && <Send className="w-3 h-3 text-[#229ED9]" />}
                    {channel === 'E-posta' && <Bell className="w-3 h-3 text-amber-400" />}
                    <span>{channel}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <label className="text-xs font-mono text-white/70 uppercase tracking-wider block">
                Bildirim Sıklığı
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Anlık', 'Günde 1 Kez', 'Haftalık Özet'] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition-all ${
                      frequency === freq
                        ? 'bg-white text-black font-bold shadow'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-semibold transition-colors"
            >
              Vazgeç
            </button>

            <button
              type="submit"
              className={`px-6 py-3 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                ruleToEdit
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-950/50'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-950/50'
              }`}
            >
              {ruleToEdit ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Değişiklikleri Kaydet & Radarı Güncelle</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>
                    {platformMode === 'auto_ai' 
                      ? `Radarı Başlat (AI Keşif: ${aiPlatformDiscovery.platforms.length} Platform)` 
                      : `Radarı Başlat (${selectedPlatforms.length} Platform Seçili)`}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
