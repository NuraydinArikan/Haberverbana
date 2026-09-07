export type DealCategory = 
  | 'Tümü'
  | 'Elektronik & Bilgisayar'
  | 'Otomobil & Vasıta'
  | 'Emlak & Konut'
  | 'Giyim & Moda'
  | 'Ev & Yaşam';

export type Platform = 
  | 'Amazon' 
  | 'Hepsiburada' 
  | 'Trendyol' 
  | 'Sahibinden' 
  | 'Arabam' 
  | 'N11' 
  | 'Dolap' 
  | 'Hepsiemlak';

export interface PricePoint {
  date: string;
  price: number;
}

export interface DealItem {
  id: string;
  title: string;
  category: DealCategory;
  platform: Platform;
  currentPrice: number;
  originalPrice: number;
  marketAvgPrice: number;
  discountRate: number; // percentage
  opportunityScore: number; // 1 to 10
  badge: 'Kaçırılmayacak Fırsat' | 'Sıcak Fırsat' | 'Fiyat Takibinde';
  whyForYou: string; // "Neden senin için fırsat?" yapay zeka analizi
  summary: string; // Tek cümlelik satın alma tavsiyesi
  pros: string[];
  cons: string[];
  riskFactors: string[];
  marketComparison: string;
  productUrl: string;
  imageUrl: string;
  foundAt: string;
  sellerRating: string;
  location?: string;
  priceHistory: PricePoint[];
  tags: string[];
  isAffiliate: boolean;
  matchedRuleIds?: string[];
}

export interface RadarRule {
  id: string;
  name: string;
  searchQuery?: string; // Ne arıyorsunuz? (ör: "MacBook Air M3 16GB")
  category: DealCategory;
  minPrice: number;
  maxPrice: number;
  platformMode?: 'auto_ai' | 'manual' | 'hybrid'; // AI otomatik keşif vs Kullanıcı özel seçimi vs Hibrit
  platforms?: Platform[]; // Seçilen veya taranacak platformlar
  autoExpandPlatforms?: boolean; // AI yeni uygun mecra keşfettiğinde otomatik dahil et
  aiDiscoveredPlatforms?: Platform[]; // Gemini AI tarafından dinamik tespit edilen platformlar
  aiRationale?: string; // Yapay zekanın mecra seçim gerekçesi
  aiInstructions?: string; // Gemini AI takip talimatı
  positiveKeywords: string[];
  negativeKeywords: string[]; // örn: "ağır hasarlı", "teşhir", "kutusu açık"
  minScore: number; // örn: 7 veya 8
  notificationChannel: 'Telegram' | 'E-posta' | 'Tümü';
  frequency: 'Anlık' | 'Günde 1 Kez' | 'Haftalık Özet';
  isActive: boolean;
  matchedCount: number;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  plan: 'Ücretsiz' | 'Pro Fırsat Avcısı' | 'B2B Arbitraj';
  telegramChatId?: string;
  telegramBotToken?: string;
  telegramUsername?: string;
  telegramConnected: boolean;
  budgetRange: { min: number; max: number };
  selectedCategories: DealCategory[];
  onboardingCompleted: boolean;
  spamGuardHours: number; // 24 saat spam koruması
}

export interface NotificationLog {
  id: string;
  dealId: string;
  dealTitle: string;
  platform: Platform;
  price: number;
  marketAvg: number;
  score: number;
  channel: 'Telegram' | 'E-posta';
  sentAt: string;
  status: 'İletildi' | 'Okundu';
}

export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
  iconLink?: string;
}

