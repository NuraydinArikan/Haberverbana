import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Radar, 
  Filter, 
  SlidersHorizontal, 
  PlusCircle, 
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
  BookmarkCheck,
  Share2,
  Check,
  Bell,
  BellRing,
  Heart,
  Bookmark,
  X,
  Layers,
  LayoutGrid,
  Scale,
  Power,
  RotateCw,
  ArrowUpDown,
  BookOpen,
  HelpCircle,
  Mail,
  Copy
} from 'lucide-react';
import { 
  DealCategory, 
  DealItem, 
  RadarRule, 
  UserProfile,
  AppNotification
} from './types';
import { INITIAL_DEALS, INITIAL_RULES } from './data/mockDeals';
import { INITIAL_NOTIFICATIONS } from './data/mockNotifications';
import { Navbar } from './components/Navbar';
import { DealCard } from './components/DealCard';
import { PlatformGroupedFeed } from './components/PlatformGroupedFeed';
import { DealDetailModal } from './components/DealDetailModal';
import { CompareDealsModal } from './components/CompareDealsModal';
import { CompareDock } from './components/CompareDock';
import { RuleDrawer } from './components/RuleDrawer';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ChromeExtensionSimulator } from './components/ChromeExtensionSimulator';
import { TelegramSimulatorModal } from './components/TelegramSimulatorModal';
import { PricingModal } from './components/PricingModal';
import { RulesManager } from './components/RulesManager';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { PlatformSettingsModal } from './components/PlatformSettingsModal';
import { UserGuideModal } from './components/UserGuideModal';
import { KvkkModal } from './components/KvkkModal';
import { FaqModal } from './components/FaqModal';
import { useAnimatedFavicon } from './utils/useAnimatedFavicon';
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
  // Radar Active / Paused State (User can completely turn off radar to avoid confusion)
  const [isRadarActive, setIsRadarActive] = useState<boolean>(() => {
    const saved = localStorage.getItem('haberverbana_radar_active');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('haberverbana_radar_active', String(isRadarActive));
  }, [isRadarActive]);

  // Smooth Continuous Rotating Radar in Browser Address Bar / Favicon (Only active when radar is running)
  useAnimatedFavicon(isRadarActive);

  // Periodic Suggestion to Re-Open Radar when it is turned off
  const [showRadarResumePrompt, setShowRadarResumePrompt] = useState<boolean>(false);

  useEffect(() => {
    if (isRadarActive) {
      setShowRadarResumePrompt(false);
      return;
    }

    // Every 75 seconds, gently suggest re-opening radar if it's off
    const interval = setInterval(() => {
      setShowRadarResumePrompt(true);
    }, 75000);

    return () => clearInterval(interval);
  }, [isRadarActive]);

  // Dismissed / Removed Deal IDs (Persisted across sessions)
  const [dismissedDealIds, setDismissedDealIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('haberverbana_dismissed_deal_ids');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('haberverbana_dismissed_deal_ids', JSON.stringify(dismissedDealIds));
  }, [dismissedDealIds]);

  const handleDismissDeal = (dealId: string) => {
    const targetDeal = deals.find(d => d.id === dealId);
    setDismissedDealIds(prev => [...prev, dealId]);
    showToast(
      targetDeal ? `🗑️ "${targetDeal.title}" akıştan kaldırıldı.` : '🗑️ Fırsat akıştan kaldırıldı.',
      'system'
    );
  };

  const handleRestoreDismissedDeals = () => {
    setDismissedDealIds([]);
    showToast('🔄 Kaldırılan tüm fırsat önerileri akışa geri yüklendi.', 'system');
  };

  // Sorting Mode & Dynamic Rotation State (Prevents same deal always sticking to top)
  const [sortMode, setSortMode] = useState<'dynamic' | 'score' | 'newest' | 'discount'>('dynamic');
  const [rotationOffset, setRotationOffset] = useState<number>(() => {
    // Randomize initial starting offset so top recommendation changes between sessions
    return Math.floor(Math.random() * 5);
  });

  // Periodically rotate top deals when radar is active (every 60s)
  useEffect(() => {
    if (!isRadarActive) return;
    const interval = setInterval(() => {
      setRotationOffset(prev => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, [isRadarActive]);

  const handleRotateDeals = () => {
    setRotationOffset(prev => prev + 1);
    showToast('✨ Fırsat akışı döndürüldü: Farklı öne çıkan fırsatlar yukarı taşındı!', 'system');
  };

  // Navigation & Filter State
  const [activeTab, setActiveTab] = useState<'feed' | 'rules' | 'extension' | 'pricing'>('feed');
  const [selectedCategory, setSelectedCategory] = useState<DealCategory>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0); // 0 = all, 7 = hot, 8 = dip
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Tümü');
  const [quickListFilter, setQuickListFilter] = useState<'all' | 'favorites' | 'savedLater'>('all');

  // Platform Preferences State (empty = auto scan all 65+ platforms)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(() => {
    const saved = localStorage.getItem('haberverbana_selected_platforms');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });
  const [isPlatformSettingsOpen, setIsPlatformSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('haberverbana_selected_platforms', JSON.stringify(selectedPlatforms));
  }, [selectedPlatforms]);

  // Group by Platform Toggle (Persisted across sessions)
  const [groupByPlatform, setGroupByPlatform] = useState<boolean>(() => {
    const saved = localStorage.getItem('haberverbana_group_by_platform');
    return saved ? saved === 'true' : false;
  });

  useEffect(() => {
    localStorage.setItem('haberverbana_group_by_platform', String(groupByPlatform));
  }, [groupByPlatform]);

  // Favorites & Watch Later State (Persisted across sessions)
  const [favoriteDealIds, setFavoriteDealIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('haberverbana_favorites');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return ['deal-1']; // Seed top deal as initial sample favorite
  });

  const [savedLaterDealIds, setSavedLaterDealIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('haberverbana_saved_later');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return ['deal-2']; // Seed initial watch-later sample item
  });

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
  const [ruleToEdit, setRuleToEdit] = useState<RadarRule | null>(null);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [isKvkkOpen, setIsKvkkOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedFooterEmail, setCopiedFooterEmail] = useState(false);

  // Auto-open User Guide for first-time visitors
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('haberverbana_has_seen_guide');
    if (!hasSeenGuide) {
      const timer = setTimeout(() => {
        setIsUserGuideOpen(true);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, []);

  // Compare Deals State (Up to 3 deals, persisted in localStorage)
  const [selectedDealIdsForComparison, setSelectedDealIdsForComparison] = useState<string[]>(() => {
    const saved = localStorage.getItem('haberverbana_compare_deal_ids');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('haberverbana_compare_deal_ids', JSON.stringify(selectedDealIdsForComparison));
  }, [selectedDealIdsForComparison]);

  const selectedDealsForComparison = useMemo(() => {
    return selectedDealIdsForComparison
      .map(id => deals.find(d => d.id === id))
      .filter((d): d is DealItem => Boolean(d));
  }, [selectedDealIdsForComparison, deals]);

  const handleToggleCompare = (deal: DealItem) => {
    setSelectedDealIdsForComparison(prev => {
      if (prev.includes(deal.id)) {
        showToast(`⚖️ "${deal.title.slice(0, 25)}..." kıyaslama masasından çıkarıldı.`);
        return prev.filter(id => id !== deal.id);
      } else {
        if (prev.length >= 3) {
          showToast(`⚠️ Kıyaslama masasında en fazla 3 fırsat bulunabilir. Lütfen önce birini çıkarın.`);
          return prev;
        }
        const next = [...prev, deal.id];
        showToast(`⚖️ "${deal.title.slice(0, 25)}..." kıyaslamaya eklendi (${next.length}/3)!`);
        return next;
      }
    });
  };

  const handleAddDealToCompare = (deal: DealItem) => {
    setSelectedDealIdsForComparison(prev => {
      if (prev.includes(deal.id)) return prev;
      if (prev.length >= 3) {
        showToast(`⚠️ En fazla 3 fırsat aynı anda kıyaslanabilir.`);
        return prev;
      }
      const next = [...prev, deal.id];
      showToast(`⚖️ "${deal.title.slice(0, 25)}..." kıyaslama tablosuna eklendi (${next.length}/3).`);
      return next;
    });
  };

  const handleRemoveDealFromCompare = (dealId: string) => {
    setSelectedDealIdsForComparison(prev => prev.filter(id => id !== dealId));
  };

  const handleClearCompare = () => {
    setSelectedDealIdsForComparison([]);
    showToast(`🧹 Kıyaslama listesi temizlendi.`);
  };

  // Notification Center History State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('haberverbana_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_NOTIFICATIONS;
  });
  const [activeBannerNotification, setActiveBannerNotification] = useState<AppNotification | null>(null);

  // Midnight vs High-Contrast Dark Mode State (Optimized for low-light critical deal tracking)
  const [contrastMode, setContrastMode] = useState<'midnight' | 'high-contrast'>(() => {
    const saved = localStorage.getItem('haberverbana_contrast_mode');
    return (saved === 'high-contrast' || saved === 'midnight') ? saved : 'midnight';
  });

  useEffect(() => {
    localStorage.setItem('haberverbana_contrast_mode', contrastMode);
    if (contrastMode === 'high-contrast') {
      document.documentElement.classList.add('high-contrast');
      document.body.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
      document.body.classList.remove('high-contrast');
    }
  }, [contrastMode]);

  const handleToggleContrast = () => {
    setContrastMode(prev => {
      const next = prev === 'midnight' ? 'high-contrast' : 'midnight';
      showToast(
        next === 'high-contrast'
          ? '☀️ Yüksek Kontrast (OLED) modu aktif: Düşük ışıkta keskin kontrast ve maksimum okunabilirlik.'
          : '🌙 Midnight modu aktif: Koyu derin siyah tonlara dönüldü.',
        'system'
      );
      return next;
    });
  };

  // Sync notifications to local state
  useEffect(() => {
    localStorage.setItem('haberverbana_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Sync from URL search params on mount (when opening a shared radar link)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      const cat = params.get('cat');
      const score = params.get('score');
      const platform = params.get('platform');
      const ruleName = params.get('rule');

      let hasParam = false;
      if (q) {
        setSearchQuery(q);
        hasParam = true;
      }
      if (cat && (CATEGORIES as string[]).includes(cat)) {
        setSelectedCategory(cat as DealCategory);
        hasParam = true;
      }
      if (score && !isNaN(Number(score))) {
        setMinScoreFilter(Number(score));
        hasParam = true;
      }
      if (platform) {
        setSelectedPlatform(platform);
        hasParam = true;
      }
      const groupedParam = params.get('grouped');
      if (groupedParam !== null) {
        setGroupByPlatform(groupedParam === '1' || groupedParam === 'true');
        hasParam = true;
      }

      if (hasParam) {
        showToast(`🔗 Paylaşılan radar filtresi yüklendi${ruleName ? `: "${ruleName}"` : ''}!`);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

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

  // Dispatch rich notification to center & transient banner
  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read' | 'timestamp'> & { timestamp?: string }) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
      timestamp: notif.timestamp || 'Az önce',
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActiveBannerNotification(newNotif);

    // Auto-dismiss banner after 6 seconds, preserving it in Notification Center
    setTimeout(() => {
      setActiveBannerNotification(prev => prev?.id === newNotif.id ? null : prev);
    }, 6000);
  };

  const showToast = (msg: string, type: AppNotification['type'] = 'system', deal?: DealItem) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);

    // Automatically record into the Notification Center history
    addNotification({
      type,
      title: deal ? `🔥 Fırsat Yakalandı: ${deal.platform}` : msg.split(':')[0] || 'Radar Bildirimi',
      message: msg,
      deal,
      dealId: deal?.id,
      platform: deal?.platform,
      price: deal?.currentPrice,
      discountRate: deal?.discountRate,
      score: deal?.opportunityScore,
      productUrl: deal?.productUrl
    });
  };

  const handleToggleFavorite = (dealId: string) => {
    const targetDeal = deals.find(d => d.id === dealId);
    setFavoriteDealIds(prev => {
      const exists = prev.includes(dealId);
      const next = exists ? prev.filter(id => id !== dealId) : [...prev, dealId];
      localStorage.setItem('haberverbana_favorites', JSON.stringify(next));
      showToast(
        exists ? 'Fırsat favorilerden çıkarıldı.' : `❤️ "${targetDeal?.title?.slice(0, 35) || 'Fırsat'}..." favorilerinize eklendi!`,
        'system',
        targetDeal
      );
      return next;
    });
  };

  const handleToggleSavedForLater = (dealId: string) => {
    const targetDeal = deals.find(d => d.id === dealId);
    setSavedLaterDealIds(prev => {
      const exists = prev.includes(dealId);
      const next = exists ? prev.filter(id => id !== dealId) : [...prev, dealId];
      localStorage.setItem('haberverbana_saved_later', JSON.stringify(next));
      showToast(
        exists ? 'Fırsat "Daha Sonra İncele" listesinden çıkarıldı.' : `🔖 "${targetDeal?.title?.slice(0, 35) || 'Fırsat'}..." daha sonra incelemek üzere kaydedildi!`,
        'system',
        targetDeal
      );
      return next;
    });
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    setActiveBannerNotification(null);
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (activeBannerNotification?.id === id) {
      setActiveBannerNotification(null);
    }
  };

  // Rule Handlers
  const handleSaveRule = (
    ruleData: Omit<RadarRule, 'id' | 'createdAt' | 'matchedCount'>,
    ruleIdToUpdate?: string
  ) => {
    if (ruleIdToUpdate) {
      setRules(prev => prev.map(r => {
        if (r.id === ruleIdToUpdate) {
          return {
            ...r,
            ...ruleData,
          };
        }
        return r;
      }));
      showToast(`"${ruleData.name}" talebi güncellendi (Yeni Tavan: ₺${ruleData.maxPrice.toLocaleString('tr-TR')})!`);

      const updatedRule: RadarRule = {
        ...ruleData,
        id: ruleIdToUpdate,
        matchedCount: rules.find(r => r.id === ruleIdToUpdate)?.matchedCount || 1,
        createdAt: rules.find(r => r.id === ruleIdToUpdate)?.createdAt || 'Güncellendi'
      };

      setTimeout(() => {
        handleScanRule(updatedRule);
      }, 500);
    } else {
      const newRule: RadarRule = {
        ...ruleData,
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
    }
    setRuleToEdit(null);
  };

  const handleSaveNewRule = (newRuleData: Omit<RadarRule, 'id' | 'createdAt' | 'matchedCount'>) => {
    handleSaveRule(newRuleData);
  };

  const handleEditRule = (rule: RadarRule) => {
    setRuleToEdit(rule);
    setRuleDrawerInitialValues(null);
    setIsRuleDrawerOpen(true);
  };

  const handleUpdateRuleDirect = (updatedRule: RadarRule) => {
    setRules(prev => prev.map(r => r.id === updatedRule.id ? updatedRule : r));
    showToast(`"${updatedRule.name}" bütçesi ₺${updatedRule.maxPrice.toLocaleString('tr-TR')} olarak güncellendi!`);
    setTimeout(() => {
      handleScanRule(updatedRule);
    }, 400);
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

      showToast(`🎉 Fırsat Yakalandı: ${primaryTask.platform} üzerinde ₺${scrapedPrice.toLocaleString('tr-TR')} değerinde yeni indirim tespit edildi!`, 'deal', scrapedDeal);

      // Dispatch live Telegram alert if connected
      const config = getStoredTelegramConfig();
      if (config.botToken && config.chatId) {
        sendRealTelegramAlert(scrapedDeal, config).then(res => {
          if (res.success) {
            showToast('🔔 Yeni yakalanan fırsat Telegram botunuza iletildi!', 'telegram', scrapedDeal);
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

  const handleDeleteMultipleRules = (ruleIds: string[]) => {
    setRules(prev => prev.filter(r => !ruleIds.includes(r.id)));
    showToast(`🗑️ ${ruleIds.length} adet takip talebi başarıyla silindi.`);
  };

  const handleResetRulesToDefault = () => {
    setRules(INITIAL_RULES);
    showToast('🔄 Takip talepleri varsayılan örneklere sıfırlandı.');
  };

  const handleClearAllRules = () => {
    const count = rules.length;
    setRules([]);
    showToast(`🧹 Tüm takip talepleri temizlendi (${count} talep silindi).`);
  };

  const handleToggleMultipleRules = (ruleIds: string[], active: boolean) => {
    setRules(prev => prev.map(r => ruleIds.includes(r.id) ? { ...r, isActive: active } : r));
    showToast(`⚡ ${ruleIds.length} adet talebin durumu "${active ? 'Aktif' : 'Durduruldu'}" olarak güncellendi.`);
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

  // Share current rule/view as a shareable link
  const handleShareCurrentView = () => {
    try {
      const url = new URL(window.location.href);
      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery) {
        url.searchParams.set('q', trimmedQuery);
      } else {
        url.searchParams.delete('q');
      }

      if (selectedCategory && selectedCategory !== 'Tümü') {
        url.searchParams.set('cat', selectedCategory);
      } else {
        url.searchParams.delete('cat');
      }

      if (minScoreFilter > 0) {
        url.searchParams.set('score', minScoreFilter.toString());
      } else {
        url.searchParams.delete('score');
      }

      if (selectedPlatform && selectedPlatform !== 'Tümü') {
        url.searchParams.set('platform', selectedPlatform);
      } else {
        url.searchParams.delete('platform');
      }

      if (groupByPlatform) {
        url.searchParams.set('grouped', '1');
      } else {
        url.searchParams.delete('grouped');
      }

      const ruleLabel = trimmedQuery 
        ? `${trimmedQuery} Radarı` 
        : (selectedCategory !== 'Tümü' ? `${selectedCategory} Fırsat Radarı` : 'Fırsat Radarı');
      url.searchParams.set('rule', ruleLabel);

      const shareUrl = url.toString();

      const copyAction = async () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareUrl);
        } else {
          const ta = document.createElement('textarea');
          ta.value = shareUrl;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
      };

      copyAction().then(() => {
        setCopiedShare(true);
        showToast(`🔗 "${ruleLabel}" kural paylaşım bağlantısı panoya kopyalandı!`);
        setTimeout(() => setCopiedShare(false), 2500);
      }).catch(() => {
        showToast('Bağlantı panoya kopyalanamadı.');
      });
    } catch {
      showToast('Paylaşım bağlantısı oluşturulurken bir hata oluştu.');
    }
  };

  // Adding deal from Chrome Extension Simulator
  const handleAddDetectedDeal = (newDeal: DealItem) => {
    setDeals([newDeal, ...deals]);
    setActiveTab('feed');
    showToast(`"${newDeal.title}" radara başarıyla eklendi!`, 'deal', newDeal);
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

  // Filtering & Dynamic Rotation Logic (Prevents same item always sticking to top)
  const filteredDeals = useMemo(() => {
    // 1. Filter out dismissed deals and match user criteria
    const list = deals.filter((deal) => {
      // Tek tıkla kaldırılan ürünleri akıştan gizle
      if (dismissedDealIds.includes(deal.id)) {
        return false;
      }

      // Quick List Filter: Favoriler veya Daha Sonra İncele
      if (quickListFilter === 'favorites' && !favoriteDealIds.includes(deal.id)) {
        return false;
      }
      if (quickListFilter === 'savedLater' && !savedLaterDealIds.includes(deal.id)) {
        return false;
      }

      // Category match
      if (selectedCategory !== 'Tümü' && deal.category !== selectedCategory) {
        return false;
      }
      // Specific Single Platform Dropdown match
      if (selectedPlatform !== 'Tümü' && deal.platform !== selectedPlatform) {
        return false;
      }
      // Global Platform Preferences from Settings (if user specified custom platforms)
      if (selectedPlatforms.length > 0 && selectedPlatforms[0] !== 'all') {
        const match = selectedPlatforms.some(sp => 
          deal.platform.toLowerCase().includes(sp.toLowerCase()) || 
          sp.toLowerCase().includes(deal.platform.toLowerCase())
        );
        if (!match) return false;
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

    // 2. Dynamic Rotation or Explicit Sorting
    if (sortMode === 'score') {
      return [...list].sort((a, b) => b.opportunityScore - a.opportunityScore);
    } else if (sortMode === 'newest') {
      return [...list].sort((a, b) => (b.foundAt || '').localeCompare(a.foundAt || ''));
    } else if (sortMode === 'discount') {
      return [...list].sort((a, b) => {
        const discA = (a.marketAvgPrice - a.currentPrice) / a.marketAvgPrice;
        const discB = (b.marketAvgPrice - b.currentPrice) / b.marketAvgPrice;
        return discB - discA;
      });
    } else {
      // 'dynamic': Döngüsel kaydırma (Kullanıcı her girdiğinde veya 'Fırsatları Döndür'e bastığında en üstte farklı bir sıcak fırsat görünür)
      if (list.length <= 1) return list;
      const offset = rotationOffset % list.length;
      return [...list.slice(offset), ...list.slice(0, offset)];
    }
  }, [
    deals,
    dismissedDealIds,
    quickListFilter,
    favoriteDealIds,
    savedLaterDealIds,
    selectedCategory,
    selectedPlatform,
    selectedPlatforms,
    minScoreFilter,
    searchQuery,
    sortMode,
    rotationOffset
  ]);

  return (
    <div className={`min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col font-sans selection:bg-red-600 selection:text-white transition-colors duration-200 ${contrastMode === 'high-contrast' ? 'high-contrast' : ''}`}>
      {/* Interactive Notification Banner (Geçici bildirim yerine tıklandığında detay açan ve merkeze yönlendiren akıllı bildirim kartı) */}
      {activeBannerNotification ? (
        <div 
          id="active-notification-banner"
          onClick={() => {
            if (activeBannerNotification.deal) {
              setSelectedDealForDetail(activeBannerNotification.deal);
            } else {
              setIsNotificationCenterOpen(true);
            }
            setActiveBannerNotification(null);
          }}
          className="fixed top-20 sm:top-24 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-full bg-[#121212]/95 backdrop-blur-xl text-white p-4 rounded-3xl shadow-2xl border border-red-500/40 animate-in slide-in-from-top-4 duration-300 cursor-pointer group hover:border-red-500/70 transition-all"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
              <BellRing className="w-4 h-4 animate-bounce" />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 font-bold border border-red-500/30">
                  {activeBannerNotification.type === 'deal' ? '🔥 Yeni Fırsat Yakalandı' : '🔔 Radar Bildirimi'}
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  {activeBannerNotification.timestamp}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                {activeBannerNotification.title}
              </h4>

              <p className="text-xs text-white/70 mt-1 line-clamp-2 leading-relaxed">
                {activeBannerNotification.message}
              </p>

              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNotificationCenterOpen(true);
                    setActiveBannerNotification(null);
                  }}
                  className="text-[11px] text-white/60 hover:text-white font-medium flex items-center gap-1.5 underline underline-offset-2"
                >
                  <Bell className="w-3 h-3 text-amber-400" />
                  <span>Bildirim Merkezinde Gör</span>
                </button>

                {activeBannerNotification.deal && (
                  <span className="text-[11px] font-bold text-red-400 flex items-center gap-1 group-hover:underline">
                    <span>Fırsatı İncele</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveBannerNotification(null);
              }}
              className="p-1 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0"
              title="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : toastMessage ? (
        <div className="fixed top-24 right-6 z-50 bg-[#0F0F0F] text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-medium flex items-center gap-2.5 border border-white/20 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      ) : null}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRuleDrawer={() => {
          setRuleToEdit(null);
          setRuleDrawerInitialValues(null);
          setIsRuleDrawerOpen(true);
        }}
        onOpenTelegramModal={() => {
          setSelectedDealForTelegram(deals[0] || null);
          setIsTelegramModalOpen(true);
        }}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenGuide={() => setIsUserGuideOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        onOpenNotificationCenter={() => setIsNotificationCenterOpen(true)}
        onOpenPlatformSettings={() => setIsPlatformSettingsOpen(true)}
        selectedPlatforms={selectedPlatforms}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
        contrastMode={contrastMode}
        onToggleContrast={handleToggleContrast}
        user={user}
        activeRulesCount={rules.filter(r => r.isActive).length}
        isRadarActive={isRadarActive}
        onToggleRadarActive={() => {
          const next = !isRadarActive;
          setIsRadarActive(next);
          showToast(
            next 
              ? '⚡ Fırsat Radarı açıldı! Canlı tarama ve fırsat uyarıları devrede.' 
              : '⏸️ Fırsat Radarı kapatıldı. Otomatik tarama duraklatıldı.',
            'system'
          );
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* VIEW 1: FIRSAT RADARI (FEED) */}
        {activeTab === 'feed' && (
          <div className="space-y-5">
            {/* Live Operational Dashboard Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-red-500" />
                    <span>Canlı Fırsat Akışı</span>
                  </h1>
                  {isRadarActive ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Canlı Taranıyor
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      Radar Kapalı
                    </span>
                  )}
                  <span className="text-xs text-white/50 font-mono">
                    ({filteredDeals.length} Fırsat)
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-1">
                  Kriterlerinizle eşleşen Amazon, Hepsiburada, Trendyol ve Sahibinden canlı fiyat anomalileri ve dip fırsatlar.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                {/* Radar Aç/Kapat Butonu (Kullanıcı kafası karışınca tek tıkla radarı durdurabilir) */}
                <button
                  id="feed-toggle-radar-btn"
                  onClick={() => {
                    const next = !isRadarActive;
                    setIsRadarActive(next);
                    showToast(
                      next 
                        ? '⚡ Fırsat Radarı açıldı! Canlı tarama ve fırsat uyarıları devrede.' 
                        : '⏸️ Fırsat Radarı kapatıldı. Otomatik tarama duraklatıldı.',
                      'system'
                    );
                  }}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border ${
                    isRadarActive
                      ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/50 shadow-md font-bold'
                  }`}
                  title={isRadarActive ? 'Fırsat radarını tamamen kapat (duraklat)' : 'Fırsat radarını yeniden başlat'}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isRadarActive ? 'Radar Açık' : 'Radarı Aç'}</span>
                </button>

                {/* Fırsatları Döndür Butonu (En üstte hep aynı öneri kalmasın) */}
                <button
                  id="feed-rotate-deals-btn"
                  onClick={handleRotateDeals}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
                  title="Farklı fırsat önerilerini üst sıralara taşır ve akışı tazeler"
                >
                  <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fırsatları Döndür</span>
                </button>

                {/* Fırsat Kıyaslama Butonu */}
                <button
                  id="feed-open-compare-modal-btn"
                  onClick={() => setIsCompareModalOpen(true)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border ${
                    selectedDealIdsForComparison.length > 0
                      ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-400/50 shadow-md shadow-cyan-950/40 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/15'
                  }`}
                  title="Fırsatları yan yana kıyaslama tablosunda aç"
                >
                  <Scale className={`w-3.5 h-3.5 ${selectedDealIdsForComparison.length > 0 ? 'text-cyan-400' : 'text-white/60'}`} />
                  <span>Kıyasla</span>
                  {selectedDealIdsForComparison.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-black text-[10px] font-black font-mono">
                      {selectedDealIdsForComparison.length}
                    </span>
                  )}
                </button>

                <button
                  id="feed-toggle-group-by-platform-btn"
                  onClick={() => {
                    const next = !groupByPlatform;
                    setGroupByPlatform(next);
                    showToast(
                      next 
                        ? '📂 Platform gruplama aktif: Fırsatlar kaynak platformlarına göre düzenlendi.' 
                        : '📋 Düz akış modu aktif: Tüm fırsatlar tek liste halinde gösteriliyor.',
                      'system'
                    );
                  }}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border ${
                    groupByPlatform
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/50 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/15'
                  }`}
                  title={groupByPlatform ? 'Düz liste görünümüne geç' : 'Fırsatları satıcı platformlarına göre grupla'}
                >
                  <Layers className={`w-3.5 h-3.5 ${groupByPlatform ? 'text-white' : 'text-amber-400'}`} />
                  <span>Platforma Göre Grupla</span>
                  {groupByPlatform && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </button>

                <button
                  id="feed-add-rule-btn"
                  onClick={() => setIsRuleDrawerOpen(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold shadow-md shadow-red-950/40 flex items-center gap-2 transition-all active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Yeni Radar Kuralı</span>
                </button>

                <button
                  onClick={() => setActiveTab('extension')}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Chrome className="w-3.5 h-3.5 text-amber-400" />
                  <span>Linkle Tara</span>
                </button>
              </div>
            </div>

            {/* Radar Kapalı Durum Bildirim Paneli */}
            {!isRadarActive && (
              <div className="bg-gradient-to-r from-amber-500/10 via-[#14120B] to-amber-500/5 border border-amber-500/25 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <Power className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Fırsat Radarı Kapatıldı</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono font-semibold">Tarama Duraklatıldı</span>
                    </h3>
                    <p className="text-xs text-white/70 mt-0.5 max-w-2xl leading-relaxed">
                      Kafa karışıklığını önlemek için otomatik arka plan taraması kapatıldı. İncelemek istediğinizde dilediğiniz an tek tıkla radarı yeniden etkinleştirebilirsiniz.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsRadarActive(true);
                    showToast('⚡ Fırsat Radarı yeniden başlatıldı! Canlı tarama devrede.', 'system');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Radarı Aç</span>
                </button>
              </div>
            )}

            {/* Radarı Yeniden Açma Öneri Uyarısı (Aralıklarla kullanıcıya sunulur) */}
            {showRadarResumePrompt && !isRadarActive && (
              <div className="bg-gradient-to-r from-red-600/15 via-[#1A0B0B] to-red-600/10 border border-red-500/40 rounded-3xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📡</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      Yeni sıcak indirimler tespit ediliyor olabilir!
                    </h4>
                    <p className="text-[11px] text-white/70">
                      Fırsat Radarını tekrar açarak güncel fiyat düşüşlerini ve dip fırsatları anında yakalamak ister misiniz?
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => setShowRadarResumePrompt(false)}
                    className="px-3 py-1.5 rounded-full text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    Daha Sonra
                  </button>
                  <button
                    onClick={() => {
                      setIsRadarActive(true);
                      setShowRadarResumePrompt(false);
                      showToast('⚡ Fırsat Radarı aktif edildi! En son indirimler taranıyor.', 'system');
                    }}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-full transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Radarı Aç</span>
                  </button>
                </div>
              </div>
            )}

            {/* Kaldırılan Ürünleri Geri Getirme Çubuğu */}
            {dismissedDealIds.length > 0 && (
              <div className="flex items-center justify-between bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span><strong>{dismissedDealIds.length}</strong> fırsat önerisi isteğiniz üzerine akıştan kaldırıldı (gizlendi).</span>
                </div>
                <button
                  onClick={handleRestoreDismissedDeals}
                  className="text-red-400 hover:text-red-300 font-bold underline underline-offset-2 cursor-pointer transition-colors"
                >
                  Kaldırılanları Geri Getir
                </button>
              </div>
            )}

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

                {/* Score & Quick List Filter Pills */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    <button
                      id="filter-all-deals-pill"
                      onClick={() => {
                        setQuickListFilter('all');
                        setMinScoreFilter(0);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                        quickListFilter === 'all' && minScoreFilter === 0
                          ? 'bg-red-600 text-white font-bold shadow-md'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      Tüm Fırsatlar
                    </button>

                    <button
                      id="filter-favorites-pill"
                      onClick={() => {
                        setQuickListFilter(quickListFilter === 'favorites' ? 'all' : 'favorites');
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                        quickListFilter === 'favorites'
                          ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-950/50'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-rose-400'
                      }`}
                      title="Sadece favorilere eklediğiniz fırsatları göster"
                    >
                      <Heart className={`w-3.5 h-3.5 ${quickListFilter === 'favorites' ? 'fill-white' : 'text-rose-400'}`} />
                      <span>Favorilerim ({favoriteDealIds.length})</span>
                    </button>

                    <button
                      id="filter-saved-later-pill"
                      onClick={() => {
                        setQuickListFilter(quickListFilter === 'savedLater' ? 'all' : 'savedLater');
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                        quickListFilter === 'savedLater'
                          ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-950/50'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-amber-400'
                      }`}
                      title="Sadece 'daha sonra incele' listenizdeki fırsatları göster"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${quickListFilter === 'savedLater' ? 'fill-white' : 'text-amber-400'}`} />
                      <span>Daha Sonra ({savedLaterDealIds.length})</span>
                    </button>

                    {[
                      { label: '🔥 Sıcak (7.0+)', min: 7.0 },
                      { label: '⚡ Dip Fiyat (8.0+)', min: 8.0 }
                    ].map((filter) => (
                      <button
                        key={filter.min}
                        onClick={() => {
                          setQuickListFilter('all');
                          setMinScoreFilter(filter.min);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                          quickListFilter === 'all' && minScoreFilter === filter.min
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

                  {/* Share Rule / View Link Button */}
                  <button
                    id="share-current-view-btn"
                    onClick={handleShareCurrentView}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0 border ${
                      copiedShare
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border-white/15'
                    }`}
                    title="Oluşturulan radar kuralı ve filtre görünümünü bir bağlantı olarak kopyalayıp başkalarıyla paylaşın"
                  >
                    {copiedShare ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-bold">Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Paylaş</span>
                      </>
                    )}
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

              {/* View Layout Switcher (Düz Liste vs Platforma Göre Grupla) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-white/50 font-medium">Görünüm Düzeni:</span>
                  <div className="inline-flex p-1 bg-black/60 border border-white/15 rounded-2xl shadow-inner">
                    <button
                      id="view-mode-flat-btn"
                      onClick={() => {
                        setGroupByPlatform(false);
                        showToast('📋 Düz akış görünümü aktif.', 'system');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        !groupByPlatform
                          ? 'bg-white text-black font-bold shadow-md'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                      title="Tüm fırsatları tek bir kesintisiz liste halinde gösterir"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Düz Liste</span>
                    </button>

                    <button
                      id="view-mode-grouped-btn"
                      onClick={() => {
                        setGroupByPlatform(true);
                        showToast('📂 Platform gruplama aktif: Fırsatlar kaynak platformlarına göre düzenlendi.', 'system');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        groupByPlatform
                          ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950/60'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                      title="Fırsatları kaynak platformlarına (Amazon, Sahibinden, Trendyol vb.) göre ayrı panellere ayırır"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Platforma Göre Grupla</span>
                    </button>
                  </div>
                </div>

                {/* Sort Mode & Dynamic Rotation Selector */}
                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 font-medium flex items-center gap-1">
                      <ArrowUpDown className="w-3 h-3 text-white/40" />
                      Sıralama:
                    </span>
                    <select
                      value={sortMode}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setSortMode(val);
                        if (val === 'dynamic') {
                          showToast('✨ Dinamik Döngü aktif: Fırsat önerileri periyodik olarak değişir.', 'system');
                        }
                      }}
                      className="bg-black/60 border border-white/15 text-xs text-white/90 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-red-500 cursor-pointer font-mono"
                    >
                      <option value="dynamic">✨ Dinamik Döngü (Sürekli Değişsin)</option>
                      <option value="score">🔥 En Yüksek Fırsat Skoru</option>
                      <option value="newest">⚡ En Yeni Tespit Edilenler</option>
                      <option value="discount">💰 En Yüksek İndirim Oranı</option>
                    </select>

                    {sortMode === 'dynamic' && (
                      <button
                        onClick={handleRotateDeals}
                        className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/15 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        title="Fırsatları hemen döndürerek en üste farklı ürünler getir"
                      >
                        <RotateCw className="w-3 h-3 text-amber-400" />
                        <span className="hidden sm:inline">Döndür</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
                    <span>{filteredDeals.length} Fırsat</span>
                    <span>•</span>
                    <span>{groupByPlatform ? '📂 Platform Gruplu' : '📋 Düz Liste'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deals Grid or Grouped by Platform */}
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
            ) : groupByPlatform ? (
              <PlatformGroupedFeed
                deals={filteredDeals}
                favoriteDealIds={favoriteDealIds}
                savedLaterDealIds={savedLaterDealIds}
                compareDealIds={selectedDealIdsForComparison}
                onToggleFavorite={handleToggleFavorite}
                onToggleSavedForLater={handleToggleSavedForLater}
                onToggleCompare={handleToggleCompare}
                onShowToast={showToast}
                onSelectDeal={(d) => setSelectedDealForDetail(d)}
                onSendTelegram={(d) => handleTriggerTelegram(d)}
                onSelectPlatformFilter={(p) => setSelectedPlatform(p)}
                onDismissDeal={handleDismissDeal}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    isFavorite={favoriteDealIds.includes(deal.id)}
                    isSavedForLater={savedLaterDealIds.includes(deal.id)}
                    isComparing={selectedDealIdsForComparison.includes(deal.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleSavedForLater={handleToggleSavedForLater}
                    onToggleCompare={handleToggleCompare}
                    onShowToast={showToast}
                    onSelectDeal={(d) => setSelectedDealForDetail(d)}
                    onSendTelegram={(d) => handleTriggerTelegram(d)}
                    onDismissDeal={handleDismissDeal}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: RADAR KURALLARIM & TALEPLER */}
        {activeTab === 'rules' && (
          <RulesManager
            rules={rules}
            onToggleRule={handleToggleRule}
            onDeleteRule={handleDeleteRule}
            onDeleteMultipleRules={handleDeleteMultipleRules}
            onResetRulesToDefault={handleResetRulesToDefault}
            onClearAllRules={handleClearAllRules}
            onToggleMultipleRules={handleToggleMultipleRules}
            onOpenCreateRule={() => {
              setRuleToEdit(null);
              setRuleDrawerInitialValues(null);
              setIsRuleDrawerOpen(true);
            }}
            onEditRule={handleEditRule}
            onUpdateRuleDirect={handleUpdateRuleDirect}
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
        isFavorite={selectedDealForDetail ? favoriteDealIds.includes(selectedDealForDetail.id) : false}
        isSavedForLater={selectedDealForDetail ? savedLaterDealIds.includes(selectedDealForDetail.id) : false}
        isComparing={selectedDealForDetail ? selectedDealIdsForComparison.includes(selectedDealForDetail.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onToggleSavedForLater={handleToggleSavedForLater}
        onToggleCompare={handleToggleCompare}
        onDismissDeal={handleDismissDeal}
      />

      {/* Compare Floating Dock */}
      <CompareDock
        selectedDeals={selectedDealsForComparison}
        onRemoveDeal={handleRemoveDealFromCompare}
        onClearAll={handleClearCompare}
        onOpenModal={() => setIsCompareModalOpen(true)}
      />

      {/* Side-by-Side Compare Deals Modal */}
      <CompareDealsModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedDeals={selectedDealsForComparison}
        allDeals={deals}
        onRemoveDeal={handleRemoveDealFromCompare}
        onAddDeal={handleAddDealToCompare}
        onClearAll={handleClearCompare}
        onSelectDeal={(d) => {
          setIsCompareModalOpen(false);
          setSelectedDealForDetail(d);
        }}
        onShowToast={(msg) => showToast(msg, 'system')}
      />

      {/* Rule Drawer (Alttan Açılan Kural Formu) */}
      <RuleDrawer
        isOpen={isRuleDrawerOpen}
        onClose={() => {
          setIsRuleDrawerOpen(false);
          setRuleDrawerInitialValues(null);
          setRuleToEdit(null);
        }}
        onSaveRule={(ruleData, ruleIdToUpdate) => {
          handleSaveRule(ruleData, ruleIdToUpdate);
          setRuleDrawerInitialValues(null);
        }}
        initialValues={ruleDrawerInitialValues}
        ruleToEdit={ruleToEdit}
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

      {/* Bildirim Merkezi (Notification Center) Paneli */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAllNotifications}
        onDeleteNotification={handleDeleteNotification}
        onSelectDeal={(deal) => {
          setSelectedDealForDetail(deal);
          setIsNotificationCenterOpen(false);
        }}
      />

      {/* Platform & Site Settings Modal */}
      <PlatformSettingsModal
        isOpen={isPlatformSettingsOpen}
        onClose={() => setIsPlatformSettingsOpen(false)}
        selectedPlatforms={selectedPlatforms}
        onSaveSelectedPlatforms={(platforms) => {
          setSelectedPlatforms(platforms);
          if (platforms.length === 0 || (platforms.length === 1 && platforms[0] === 'all')) {
            showToast('🌐 Radar ayarları güncellendi: Tüm ilgili platformlar (75 mağaza) otomatik taranıyor.');
          } else {
            showToast(`🎯 Radar ayarları güncellendi: ${platforms.length} özel platform hedeflendi.`);
          }
        }}
      />

      {/* Kullanım Kılavuzu & Başlangıç Pop-up'ı */}
      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
        onOpenRuleDrawer={() => {
          setRuleDrawerInitialValues(null);
          setIsRuleDrawerOpen(true);
        }}
        onOpenPlatformSettings={() => setIsPlatformSettingsOpen(true)}
        onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
      />

      {/* KVKK & Gizlilik Aydınlatma Metni Modalı */}
      <KvkkModal
        isOpen={isKvkkOpen}
        onClose={() => setIsKvkkOpen(false)}
        onClearLocalData={() => {
          localStorage.clear();
          setDeals(INITIAL_DEALS);
          setRules(INITIAL_RULES);
          showToast('Tüm yerel veriler ve kurallar başarıyla sıfırlandı.', 'system');
        }}
      />

      {/* Sık Sorulan Sorular (SSS) Modalı */}
      <FaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
        onOpenRuleDrawer={() => {
          setRuleDrawerInitialValues(null);
          setIsRuleDrawerOpen(true);
        }}
        onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
        onOpenGuide={() => setIsUserGuideOpen(true)}
        onOpenKvkk={() => setIsKvkkOpen(true)}
      />

      {/* Footer */}
      <footer className="bg-[#070707] border-t border-white/10 pt-10 pb-8 text-xs text-white/60 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Col 1: Brand & Slogan */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 inline-flex">
                <div className="w-7 h-7 rounded-xl bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-red-950/50">
                  ⚡
                </div>
                <span className="font-serif font-bold text-base text-white">
                  haberverbana<span className="text-red-500">.app</span>
                </span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed max-w-sm">
                "Hep ihmal ettiğiniz bir ihtiyacınızı belki HaberVerbanaAPP 75 sitede yaptığı düzenli fırsat taramalarıyla en uygun koşul ve fiyatlarla karşınıza çıkaracak."
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-medium">HaberVerBanaAPP çalışıyor</span>
              </div>
            </div>

            {/* Col 2: Rehber & Yardım Bağlantıları */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Rehber & Destek
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => setIsUserGuideOpen(true)}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
                    <span>Kullanım Kılavuzu (Hızlı Başlangıç)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsFaqOpen(true)}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Sık Sorulan Sorular (SSS) & Link Rehberi</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsKvkkOpen(true)}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>KVKK & Gizlilik Aydınlatma Metni</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: İletişim & Destek E-postası */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                İletişim & Destek
              </h4>
              <p className="text-[11px] text-white/50">
                Soru, teknik destek veya önerileriniz için resmi iletişim adresimiz:
              </p>
              
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-xs text-red-400 font-bold">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>destek@haberverbana.app</span>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText('destek@haberverbana.app');
                        setCopiedFooterEmail(true);
                        setTimeout(() => setCopiedFooterEmail(false), 2000);
                      } catch {
                        // Fallback
                      }
                    }}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    title="E-posta adresini kopyala"
                  >
                    {copiedFooterEmail ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-white/60" />
                        <span>Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-white/40 italic">
                  * Resmi kurumsal e-posta adresimiz aktif hale getirilme aşamasındadır; iletileriniz arşivlenerek değerlendirilir.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Divider & Copyright */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
            <div>
              <span>© 2026 haberverbana.app — Tüm Hakları Saklıdır.</span>
              <span className="hidden sm:inline"> • </span>
              <span className="hidden sm:inline">Kişisel veriler cihazınızda yerel saklanır (Sıfır Veri Satışı).</span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsKvkkOpen(true)}
                className="hover:text-white underline underline-offset-2 cursor-pointer"
              >
                KVKK Metni
              </button>
              <span>•</span>
              <button 
                onClick={() => setIsFaqOpen(true)}
                className="hover:text-white underline underline-offset-2 cursor-pointer"
              >
                SSS
              </button>
              <span>•</span>
              <button 
                onClick={() => setIsUserGuideOpen(true)}
                className="hover:text-white underline underline-offset-2 cursor-pointer"
              >
                Kılavuz
              </button>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
