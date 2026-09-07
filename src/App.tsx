import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Radar, 
  Filter, 
  SlidersHorizontal, 
  CheckCircle2, 
  TrendingDown, 
  ShieldCheck, 
  Send, 
  Chrome, 
  ArrowRight,
  ExternalLink,
  Flame,
  Zap,
  Tag,
  BookmarkPlus,
  BookmarkCheck
} from 'lucide-react';
import { 
  DealCategory, 
  DealItem, 
  RadarRule, 
  UserProfile 
} from './types';
import { INITIAL_DEALS, INITIAL_RULES } from './data/mockDeals';
import { Navbar } from './components/Navbar';
import { DealCard } from './components/DealCard';
import { DealDetailModal } from './components/DealDetailModal';
import { RuleDrawer } from './components/RuleDrawer';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ChromeExtensionSimulator } from './components/ChromeExtensionSimulator';
import { TelegramSimulatorModal } from './components/TelegramSimulatorModal';
import { PricingModal } from './components/PricingModal';
import { RulesManager } from './components/RulesManager';
import { getStoredTelegramConfig, sendRealTelegramAlert } from './services/telegramService';
import { buildSearchUrl, getAiRecommendedPlatforms } from './utils/searchUrlBuilder';

const CATEGORIES: DealCategory[] = [
  'Tümü',
  'Elektronik & Bilgisayar',
  'Otomobil & Vasıta',
  'Emlak & Konut',
  'Giyim & Moda',
  'Ev & Yaşam'
];

export default function App() {
  // Navigation & Filter State
  const [activeTab, setActiveTab] = useState<'feed' | 'rules' | 'extension' | 'pricing'>('feed');
  const [selectedCategory, setSelectedCategory] = useState<DealCategory>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0); // 0 = all, 7 = hot, 8 = dip
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Tümü');

  // Core Data State (Simulating SQLite haberverbana_state.db)
  const [deals, setDeals] = useState<DealItem[]>(() => {
    const saved = localStorage.getItem('haberverbana_deals');
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });

  const [rules, setRules] = useState<RadarRule[]>(() => {
    const saved = localStorage.getItem('haberverbana_rules');
    return saved ? JSON.parse(saved) : INITIAL_RULES;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('haberverbana_user');
    return saved ? JSON.parse(saved) : {
      name: 'Fırsat Avcısı',
      email: 'avci@haberverbana.app',
      plan: 'Ücretsiz',
      telegramConnected: true,
      telegramUsername: '@haberverbana_user',
      budgetRange: { min: 5000, max: 2000000 },
      selectedCategories: ['Elektronik & Bilgisayar', 'Otomobil & Vasıta'],
      onboardingCompleted: true,
      spamGuardHours: 24
    };
  });

  // Modal & Drawer States
  const [selectedDealForDetail, setSelectedDealForDetail] = useState<DealItem | null>(null);
  const [selectedDealForTelegram, setSelectedDealForTelegram] = useState<DealItem | null>(null);
  const [isRuleDrawerOpen, setIsRuleDrawerOpen] = useState(false);
  const [ruleDrawerInitialValues, setRuleDrawerInitialValues] = useState<Partial<Omit<RadarRule, 'id' | 'createdAt' | 'matchedCount'>> | null>(null);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local state
  useEffect(() => {
    localStorage.setItem('haberverbana_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('haberverbana_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('haberverbana_user', JSON.stringify(user));
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Rule Handlers
  const handleSaveNewRule = (newRuleData: Omit<RadarRule, 'id' | 'createdAt' | 'matchedCount'>) => {
    const newRule: RadarRule = {
      ...newRuleData,
      id: `rule-${Date.now()}`,
      matchedCount: 1,
      createdAt: 'Yeni oluşturuldu'
    };

    setRules([newRule, ...rules]);
    showToast(`"${newRule.name}" radara eklendi. Çapraz platform taraması başlatıldı!`);

    // Auto-trigger scan for this new rule
    setTimeout(() => {
      handleScanRule(newRule);
    }, 600);
  };

  const handleScanRule = (rule: RadarRule) => {
    const q = rule.searchQuery || rule.name;
    const targetPlatforms = rule.platforms && rule.platforms.length > 0 
      ? rule.platforms 
      : (['Amazon', 'Hepsiburada', 'Trendyol', 'Sahibinden'] as const);

    // 1. Build platform-specific search URLs dynamically via buildSearchUrl utility
    const scrapingTasks = targetPlatforms.map(platform => ({
      platform,
      url: buildSearchUrl(platform, q, rule.maxPrice)
    }));

    showToast(`🔍 Fırsat Taraması Başlatıldı: ${targetPlatforms.join(', ')} taranıyor...`);

    // 2. Simulate the async web-scraping lifecycle (DOM parsing, price extraction, filtering)
    setTimeout(() => {
      // Select from the active scraping task targets
      const primaryTask = scrapingTasks[Math.floor(Math.random() * scrapingTasks.length)] || {
        platform: 'Amazon',
        url: buildSearchUrl('Amazon', q, rule.maxPrice)
      };

      // Compute dynamic scraped prices within rule constraints (e.g. 10-15% below maximum ceiling)
      const scrapedPrice = Math.max(rule.minPrice, Math.round(rule.maxPrice * 0.88));
      const marketAvgPrice = Math.round(rule.maxPrice * 1.05);
      const discountRate = Math.round(((marketAvgPrice - scrapedPrice) / marketAvgPrice) * 100);
      const opportunityScore = Number(Math.min(9.8, Math.max(rule.minScore, 8.8 + Math.random() * 0.8)).toFixed(1));

      const categoryImages: Record<DealCategory, string> = {
        'Tümü': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        'Elektronik & Bilgisayar': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        'Otomobil & Vasıta': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
        'Emlak & Konut': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        'Giyim & Moda': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        'Ev & Yaşam': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'
      };

      const primaryKeyword = rule.positiveKeywords && rule.positiveKeywords.length > 0 
        ? rule.positiveKeywords[0] 
        : 'Distribütör Garantili';

      // Construct freshly scraped DealItem using the generated scraping target URL
      const scrapedDeal: DealItem = {
        id: `scraped-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: `${q} (${primaryKeyword} • Orijinal Kutusunda)`,
        category: rule.category,
        platform: primaryTask.platform,
        currentPrice: scrapedPrice,
        originalPrice: marketAvgPrice,
        marketAvgPrice: marketAvgPrice,
        discountRate: discountRate,
        opportunityScore: opportunityScore,
        badge: 'Kaçırılmayacak Fırsat',
        whyForYou: `${primaryTask.platform} pazar yerinde "${q}" araması için ${rule.maxPrice.toLocaleString('tr-TR')} TL bütçe tavanının %${discountRate} altında (₺${scrapedPrice.toLocaleString('tr-TR')}) yeni fırsat yakalandı.${rule.aiInstructions ? ` Gemini Kriteri: "${rule.aiInstructions}" doğrulandı.` : ''}`,
        summary: `${primaryTask.platform} üzerinde "${q}" için ₺${scrapedPrice.toLocaleString('tr-TR')} seviyesinde fırsat anlık yakalandı.`,
        pros: [
          `${primaryTask.platform} üzerinden canlı tespit edildi`,
          `Belirlediğiniz bütçe sınırının ₺${(marketAvgPrice - scrapedPrice).toLocaleString('tr-TR')} altında`,
          ...(rule.positiveKeywords.length > 0 ? [`"${rule.positiveKeywords.join(', ')}" kriterleriyle uyumlu`] : [])
        ],
        cons: [
          'Kampanya stokları sınırlı sayıda olabilir'
        ],
        riskFactors: rule.negativeKeywords.length > 0 
          ? [`Negatif filtre denetlendi: ${rule.negativeKeywords.slice(0, 3).join(', ')} içermiyor.`] 
          : ['Doğrudan platform üzerinden satıcı teyidi önerilir.'],
        marketComparison: `Piyasa liste ortalaması ₺${marketAvgPrice.toLocaleString('tr-TR')} seviyesindedir.`,
        productUrl: primaryTask.url,
        imageUrl: categoryImages[rule.category] || categoryImages['Elektronik & Bilgisayar'],
        foundAt: 'Az önce',
        sellerRating: '4.8 / 5.0 (Resmi Satıcı)',
        priceHistory: [
          { date: '15 gün önce', price: marketAvgPrice },
          { date: 'Bugün (Tespit)', price: scrapedPrice }
        ],
        tags: [q, primaryTask.platform, 'Fırsat Radarı', 'Canlı İndirim'],
        isAffiliate: true,
        matchedRuleIds: [rule.id]
      };

      // Prepend dynamically scraped deal to active feed
      setDeals(prevDeals => [scrapedDeal, ...prevDeals]);

      // Increment matched count for the rule
      setRules(prevRules => prevRules.map(r => r.id === rule.id ? { ...r, matchedCount: r.matchedCount + 1 } : r));

      setSelectedDealForTelegram(scrapedDeal);

      showToast(`🎉 Fırsat Yakalandı: ${primaryTask.platform} üzerinde ₺${scrapedPrice.toLocaleString('tr-TR')} değerinde yeni indirim tespit edildi!`);

      // Dispatch live Telegram alert if connected
      const config = getStoredTelegramConfig();
      if (config.botToken && config.chatId) {
        sendRealTelegramAlert(scrapedDeal, config).then(res => {
          if (res.success) {
            showToast('🔔 Yeni yakalanan fırsat Telegram botunuza iletildi!');
          }
        });
      }
    }, 1100);
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map(r => r.id === ruleId ? { ...r, isActive: !r.isActive } : r));
    showToast('Kural durumu güncellendi.');
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(r => r.id !== ruleId));
    showToast('Radar kuralı silindi.');
  };

  // 'Save Current View' feature: creates a new RadarRule based on active search, category, and score filters
  const handleSaveCurrentView = (openDrawerToCustomize: boolean = false) => {
    const trimmedQuery = searchQuery.trim();
    const effectiveCategory: DealCategory = selectedCategory === 'Tümü' ? 'Elektronik & Bilgisayar' : selectedCategory;
    
    // Realistic default budget ceilings by category
    const categoryMaxPrices: Record<DealCategory, number> = {
      'Tümü': 75000,
      'Elektronik & Bilgisayar': 65000,
      'Otomobil & Vasıta': 2500000,
      'Emlak & Konut': 8000000,
      'Giyim & Moda': 10000,
      'Ev & Yaşam': 35000
    };

    const maxBudget = categoryMaxPrices[selectedCategory] || 65000;
    const effectiveScore = minScoreFilter > 0 ? minScoreFilter : 7.5;

    // Generate clean, descriptive rule name
    let ruleName = '';
    if (trimmedQuery && selectedCategory !== 'Tümü') {
      ruleName = `${trimmedQuery} (${selectedCategory})`;
    } else if (trimmedQuery) {
      ruleName = `${trimmedQuery} Radarı`;
    } else if (selectedCategory !== 'Tümü') {
      ruleName = `${selectedCategory} Fırsat Radarı`;
    } else {
      ruleName = `Genel Fırsat Radarı (${effectiveScore}+ Skor)`;
    }

    if (minScoreFilter > 0 && !ruleName.includes('Skor')) {
      ruleName += ` [${effectiveScore}+ Skor]`;
    }

    const targetQuery = trimmedQuery || (selectedCategory !== 'Tümü' ? selectedCategory : 'Fırsat Ürünleri');
    const aiPlatformsInfo = getAiRecommendedPlatforms(targetQuery, effectiveCategory);

    const newRuleData: Omit<RadarRule, 'id' | 'createdAt' | 'matchedCount'> = {
      name: ruleName,
      searchQuery: targetQuery,
      category: effectiveCategory,
      minPrice: 0,
      maxPrice: maxBudget,
      platformMode: 'auto_ai',
      platforms: aiPlatformsInfo.platforms,
      autoExpandPlatforms: true,
      aiDiscoveredPlatforms: aiPlatformsInfo.platforms,
      aiRationale: aiPlatformsInfo.rationale,
      aiInstructions: trimmedQuery 
        ? `"${trimmedQuery}" araması için en az ${effectiveScore} fırsat puanına sahip ve piyasa dip fiyatlı olanları anlık bildir.`
        : `${selectedCategory} kategorisinde ${effectiveScore}+ skorlu fırsatları yakala.`,
      positiveKeywords: trimmedQuery ? trimmedQuery.split(/\s+/).filter(w => w.length > 2) : [],
      negativeKeywords: ['teşhir', 'kutusu açık', 'parça niyetine', 'hasarlı'],
      minScore: effectiveScore,
      notificationChannel: 'Telegram',
      frequency: 'Anlık',
      isActive: true
    };

    if (openDrawerToCustomize) {
      setRuleDrawerInitialValues(newRuleData);
      setIsRuleDrawerOpen(true);
    } else {
      handleSaveNewRule(newRuleData);
      showToast(`📌 "${ruleName}" görünümünüz kural olarak kaydedildi ve tarama başlatıldı!`);
    }
  };

  // Adding deal from Chrome Extension Simulator
  const handleAddDetectedDeal = (newDeal: DealItem) => {
    setDeals([newDeal, ...deals]);
    setActiveTab('feed');
    showToast(`"${newDeal.title}" radara başarıyla eklendi!`);
  };

  // Telegram alert trigger
  const handleTriggerTelegram = (deal: DealItem) => {
    setSelectedDealForTelegram(deal);
    setIsTelegramModalOpen(true);
  };

  // Import spec or rule from Drive / manual paste
  const handleImportSpecOrRule = (title: string, content: string) => {
    try {
      // Check if it's JSON rules
      if (content.trim().startsWith('[') || content.trim().startsWith('{')) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          setRules([...parsed, ...rules]);
          showToast(`"${title}" dosyasından ${parsed.length} kural aktarıldı!`);
          return;
        } else if (parsed.name && parsed.category) {
          setRules([{ ...parsed, id: `rule-${Date.now()}`, matchedCount: 0, createdAt: 'Drive İçe Aktarım' }, ...rules]);
          showToast(`"${parsed.name}" kuralı radara eklendi!`);
          return;
        }
      }

      // Check if it's watches.yaml
      if (title.includes('watches') || content.includes('target_name:')) {
        const rulesFromYaml: RadarRule[] = [];
        const blocks = content.split(/- id:/g).filter(b => b.trim());
        
        for (const block of blocks) {
          const nameMatch = block.match(/target_name:\s*"([^"]+)"/);
          const catMatch = block.match(/category:\s*"([^"]+)"/);
          const priceMatch = block.match(/max_price_tl:\s*(\d+)/);
          const aiInstMatch = block.match(/ai_instructions:\s*"([^"]+)"/);
          
          if (nameMatch) {
            const ruleName = nameMatch[1];
            const isVehicle = catMatch && catMatch[1] === 'vehicle';
            rulesFromYaml.push({
              id: `rule-yaml-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              name: `${ruleName} (Drive Watches)`,
              category: isVehicle ? 'Otomobil & Vasıta' : 'Elektronik & Bilgisayar',
              minPrice: isVehicle ? 1500000 : 25000,
              maxPrice: priceMatch ? parseInt(priceMatch[1]) : (isVehicle ? 2500000 : 60000),
              positiveKeywords: [ruleName.split(' ')[0], ruleName.split(' ')[1] || 'Model', 'Hatasız'],
              negativeKeywords: isVehicle ? ['ağır hasarlı', 'pert', 'tramer'] : ['yenilenmiş', 'teşhir'],
              minScore: 8.0,
              notificationChannel: 'Telegram',
              frequency: 'Anlık',
              isActive: true,
              matchedCount: 2,
              createdAt: 'Drive: watches.yaml'
            });
          }
        }

        if (rulesFromYaml.length > 0) {
          setRules([...rulesFromYaml, ...rules]);
          showToast(`watches.yaml dosyasından ${rulesFromYaml.length} takip kuralı radara aktarıldı!`);
          return;
        }
      }
    } catch {
      // Not JSON or YAML, treat as text/code spec
    }

    // Create a new radar rule based on the document title/summary
    const cleanTitle = title.replace(/^.*\//, '').replace(/\.[^/.]+$/, '');
    const newRule: RadarRule = {
      id: `rule-${Date.now()}`,
      name: `${cleanTitle} Radarı`,
      category: cleanTitle.toLowerCase().includes('tesla') || cleanTitle.toLowerCase().includes('vasita') ? 'Otomobil & Vasıta' : 'Elektronik & Bilgisayar',
      minPrice: 1000,
      maxPrice: 100000,
      positiveKeywords: [cleanTitle.split(/[-_]/)[0] || 'Fırsat', 'indirim'],
      negativeKeywords: ['arızalı', 'yedek parça', 'teşhir'],
      minScore: 7.5,
      notificationChannel: 'Telegram',
      frequency: 'Anlık',
      isActive: true,
      matchedCount: 1,
      createdAt: 'Drive / Kod Aktarımı'
    };

    setRules([newRule, ...rules]);
    showToast(`"${newRule.name}" teknik belgesi radar kuralına dönüştürüldü!`);
  };

  // Filtering Logic
  const filteredDeals = deals.filter((deal) => {
    // Category match
    if (selectedCategory !== 'Tümü' && deal.category !== selectedCategory) {
      return false;
    }
    // Platform match
    if (selectedPlatform !== 'Tümü' && deal.platform !== selectedPlatform) {
      return false;
    }
    // Min Score
    if (minScoreFilter > 0 && deal.opportunityScore < minScoreFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = deal.title.toLowerCase().includes(q);
      const inSummary = deal.summary.toLowerCase().includes(q);
      const inTags = deal.tags.some(t => t.toLowerCase().includes(q));
      if (!inTitle && !inSummary && !inTags) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#0F0F0F] text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-medium flex items-center gap-2.5 border border-white/20 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRuleDrawer={() => setIsRuleDrawerOpen(true)}
        onOpenTelegramModal={() => {
          setSelectedDealForTelegram(deals[0] || null);
          setIsTelegramModalOpen(true);
        }}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        user={user}
        activeRulesCount={rules.filter(r => r.isActive).length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* VIEW 1: FIRSAT RADARI (FEED) */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* Mission Hero Banner */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/40 via-[#0F0F0F] to-black border border-white/15 overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                      Yapay Zeka Destekli Fırsat Radarı
                    </span>
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Canlı Fiyat Doğrulama
                    </span>
                  </div>

                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                    "Sen Arama, O Haber Versin"
                  </h1>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                    Amazon, Hepsiburada, Trendyol ve Sahibinden 7/24 taranıyor. Belirlediğiniz bütçe ve donanım kriterlerine uyan gerçek fırsatlar, <strong>"Neden senin için fırsat?"</strong> analiziyle anında ekranınızda.
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={() => setIsRuleDrawerOpen(true)}
                    className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold shadow-lg shadow-red-950/50 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>+ Yeni Radar Kuralı</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('extension')}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Chrome className="w-4 h-4 text-amber-400" />
                    <span>Linkle Fırsat Analizi</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedDealForTelegram(deals[0] || null);
                      setIsTelegramModalOpen(true);
                    }}
                    className="px-4 py-3 bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/30 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegram Bildirimleri</span>
                  </button>

                  <button
                    onClick={() => window.open(window.location.href, '_blank', 'noopener,noreferrer')}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border border-white/15 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors"
                    title="Uygulamayı bağımsız sekmede tam ekran aç"
                  >
                    <ExternalLink className="w-4 h-4 text-amber-400" />
                    <span>Yeni Sekmede Aç</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#0F0F0F] border border-white/10 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Fırsat başlığı, marka veya donanım ara..."
                    className="w-full pl-10 pr-4 py-2 bg-black/60 border border-white/15 rounded-full text-xs text-white placeholder-white/40 focus:outline-none focus:border-red-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Score Filter Pills & Save Current View Button */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { label: 'Tüm Fırsatlar', min: 0 },
                      { label: '🔥 Sıcak Fırsat (7.0+)', min: 7.0 },
                      { label: '⚡ Dip Fiyat (8.0+)', min: 8.0 }
                    ].map((filter) => (
                      <button
                        key={filter.min}
                        onClick={() => setMinScoreFilter(filter.min)}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                          minScoreFilter === filter.min
                            ? 'bg-red-600 text-white font-bold shadow-md'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                  {/* Save Current View Action Button */}
                  <button
                    id="save-current-view-btn"
                    onClick={() => handleSaveCurrentView(false)}
                    className="px-3.5 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-500/40 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0"
                    title="Aktif arama, kategori ve asgari skor filtrelerinizi yeni bir radar kuralı olarak kaydeder"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-red-400" />
                    <span>Görünümü Radara Kaydet</span>
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-white/10 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Active Filter Tracking Banner */}
              {(searchQuery.trim() || selectedCategory !== 'Tümü' || minScoreFilter > 0) && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 px-3.5 bg-red-950/20 border border-red-900/30 rounded-2xl text-xs text-white/80">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-red-400 flex items-center gap-1">
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      Aktif Görünüm:
                    </span>
                    {searchQuery.trim() && (
                      <span className="px-2 py-0.5 bg-white/10 rounded-full text-[11px] text-white">
                        Arama: "{searchQuery.trim()}"
                      </span>
                    )}
                    {selectedCategory !== 'Tümü' && (
                      <span className="px-2 py-0.5 bg-white/10 rounded-full text-[11px] text-white">
                        Kategori: {selectedCategory}
                      </span>
                    )}
                    {minScoreFilter > 0 && (
                      <span className="px-2 py-0.5 bg-white/10 rounded-full text-[11px] text-white">
                        Asgari Skor: {minScoreFilter}+
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      onClick={() => handleSaveCurrentView(true)}
                      className="text-[11px] text-red-400 hover:text-red-300 font-medium underline"
                      title="Bu görünüm kriterlerini formda detaylandır"
                    >
                      Kuralı Özelleştir
                    </button>
                    <span className="text-white/20">•</span>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('Tümü');
                        setMinScoreFilter(0);
                      }}
                      className="text-[11px] text-white/50 hover:text-white"
                      title="Filtreleri sıfırla"
                    >
                      Filtreleri Temizle
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Deals Grid */}
            {filteredDeals.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#0F0F0F] border border-white/10 text-center space-y-3">
                <Radar className="w-10 h-10 text-white/20 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Kriterlere Uyan Fırsat Bulunamadı
                </h3>
                <p className="text-xs text-white/50 max-w-md mx-auto">
                  Arama filtrenizi temizleyebilir veya bu filtreleri kural olarak kaydedip yeni fırsat düştüğünde anlık bildirim alabilirsiniz.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                  <button
                    onClick={() => handleSaveCurrentView(false)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold shadow-lg shadow-red-950/50 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Bu Görünümü Radara Kaydet</span>
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Tümü');
                      setMinScoreFilter(0);
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-full text-xs font-semibold"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onSelectDeal={(d) => setSelectedDealForDetail(d)}
                    onSendTelegram={(d) => handleTriggerTelegram(d)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: RADAR KURALLARIM */}
        {activeTab === 'rules' && (
          <RulesManager
            rules={rules}
            onToggleRule={handleToggleRule}
            onDeleteRule={handleDeleteRule}
            onOpenCreateRule={() => setIsRuleDrawerOpen(true)}
            onScanRule={handleScanRule}
          />
        )}

        {/* VIEW 3: CHROME EKLENTİSİ SİMÜLATÖRÜ */}
        {activeTab === 'extension' && (
          <ChromeExtensionSimulator
            onAddDetectedDeal={handleAddDetectedDeal}
          />
        )}

        {/* VIEW 4: PRO & ARBİTRAJ MONETİZASYON */}
        {activeTab === 'pricing' && (
          <PricingModal
            currentPlan={user.plan}
            onSelectPlan={(newPlan) => {
              setUser({ ...user, plan: newPlan });
              showToast(`Planınız "${newPlan}" olarak güncellendi!`);
            }}
          />
        )}
      </main>

      {/* Deal Detail Modal */}
      <DealDetailModal
        deal={selectedDealForDetail}
        onClose={() => setSelectedDealForDetail(null)}
        onSendTelegram={(d) => handleTriggerTelegram(d)}
      />

      {/* Rule Drawer (Alttan Açılan Kural Formu) */}
      <RuleDrawer
        isOpen={isRuleDrawerOpen}
        onClose={() => {
          setIsRuleDrawerOpen(false);
          setRuleDrawerInitialValues(null);
        }}
        onSaveRule={(newRule) => {
          handleSaveNewRule(newRule);
          setRuleDrawerInitialValues(null);
        }}
        initialValues={ruleDrawerInitialValues}
      />

      {/* 4-Step Onboarding UI Wizard */}
      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        user={user}
        onComplete={(updated) => {
          setUser({ ...user, ...updated });
          showToast('Hoş geldiniz! Fırsat radarı kriterlerinize göre yapılandırıldı.');
        }}
      />

      {/* Telegram Simulator Modal */}
      <TelegramSimulatorModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        deal={selectedDealForTelegram}
      />

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/10 py-6 text-xs text-white/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-bold">
              ⚡
            </div>
            <span className="font-serif font-bold text-white">haberverbana.app</span>
            <span className="text-white/20">—</span>
            <span className="italic">"Sen Arama, O Haber Versin"</span>
          </div>

          <div className="flex items-center gap-4 text-white/40">
            <span>Playwright Stealth Scraper</span>
            <span>•</span>
            <span>Gemini 2.5 Flash</span>
            <span>•</span>
            <span>Telegram Bot Dispatcher</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
