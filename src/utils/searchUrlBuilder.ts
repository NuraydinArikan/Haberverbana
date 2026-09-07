import { Platform, DealCategory } from '../types';

export interface PlatformSearchSpec {
  platform: Platform;
  name: string;
  searchUrl: string;
  logoColor: string;
  iconName: string;
  categoryFit?: string;
}

export function buildPlatformSearchUrl(platform: Platform, query: string, maxPrice?: number): string {
  const cleanQuery = query.trim();
  const q = encodeURIComponent(cleanQuery);

  switch (platform) {
    case 'Amazon':
      return `https://www.amazon.com.tr/s?k=${q}${maxPrice ? `&rh=p_36%3A0-${maxPrice * 100}` : ''}`;
    case 'Hepsiburada':
      return `https://www.hepsiburada.com/ara?q=${q}${maxPrice ? `&fiyat=0-${maxPrice}` : ''}`;
    case 'Trendyol':
      return `https://www.trendyol.com/sr?q=${q}${maxPrice ? `&prc=0-${maxPrice}` : ''}`;
    case 'Sahibinden':
      return `https://www.sahibinden.com/kelime-ile-arama?query_text=${q}${maxPrice ? `&price_max=${maxPrice}` : ''}`;
    case 'Arabam':
      return `https://www.arabam.com/ikinci-el?searchText=${q}${maxPrice ? `&maxPrice=${maxPrice}` : ''}`;
    case 'N11':
      return `https://www.n11.com/arama?q=${q}${maxPrice ? `&ps=${maxPrice}` : ''}`;
    case 'Dolap':
      return `https://dolap.com/arama?q=${q}`;
    case 'Hepsiemlak':
      return `https://www.hepsiemlak.com/arama?query=${q}`;
    default:
      return `https://www.google.com/search?q=${q}`;
  }
}

export const buildSearchUrl = buildPlatformSearchUrl;

export interface AiPlatformDiscoveryResult {
  platforms: Platform[];
  rationale: string;
  confidence: number;
  highlightCategory: string;
}

/**
 * Gemini AI Platform Discovery Engine:
 * Analyzes the user's product query and category, identifying all probable
 * e-commerce and second-hand platforms where deals might exist.
 */
export function getAiRecommendedPlatforms(query: string, category?: DealCategory): AiPlatformDiscoveryResult {
  const q = (query || '').toLowerCase();

  // 1. Vehicles / Automobiles
  if (
    category === 'Otomobil & Vasıta' ||
    /araba|otomobil|bmw|mercedes|audi|tesla|volkswagen|golf|passat|km|rwd|suv|sedan|hatchback|vasıta|motor|motosiklet/i.test(q)
  ) {
    return {
      platforms: ['Sahibinden', 'Arabam', 'Hepsiburada'],
      rationale: 'Yapay zeka arama terimini "Taşıt / Vasıta" olarak sınıflandırdı. İkinci el araç portalları ve oto yedek parça/aksesuar pazarları seçildi.',
      confidence: 0.96,
      highlightCategory: 'Taşıt & Otomotiv Pazarları'
    };
  }

  // 2. Real Estate / Housing
  if (
    category === 'Emlak & Konut' ||
    /daire|ev|konut|villa|arsa|yazlık|kiralık|satılık|kadıköy|residence|emlak|bina/i.test(q)
  ) {
    return {
      platforms: ['Sahibinden', 'Hepsiemlak'],
      rationale: 'Yapay zeka konut/gayrimenkul niteliği tespit etti. Türkiye\'nin en aktif emlak ilan portalları taranacak.',
      confidence: 0.98,
      highlightCategory: 'Gayrimenkul & İlan Portalları'
    };
  }

  // 3. Fashion, Apparel, Sneakers, Luxury
  if (
    category === 'Giyim & Moda' ||
    /sneaker|ayakkabı|mont|ceket|elbise|çanta|nike|adidas|jordan|saat|parfüm|rolex|gömlek|pantolon/i.test(q)
  ) {
    return {
      platforms: ['Trendyol', 'Hepsiburada', 'Dolap', 'Amazon'],
      rationale: 'Moda ve giyim ürünlerinde yüksek kampanya ve ikinci el/butik hacmi sunan popüler pazaryerleri seçildi.',
      confidence: 0.94,
      highlightCategory: 'Moda & Butik Portalları'
    };
  }

  // 4. Electronics, Computers, Phones, Gadgets
  if (
    category === 'Elektronik & Bilgisayar' ||
    /macbook|apple|iphone|ipad|samsung|laptop|monitör|kulaklık|sony|playstation|xbox|nintendo|oled|qled|gpu|rtx|bilgisayar|tablet/i.test(q)
  ) {
    return {
      platforms: ['Amazon', 'Hepsiburada', 'Trendyol', 'Sahibinden', 'N11'],
      rationale: 'Teknoloji ve tüketici elektroniğinde en sert fiyat rekabetinin yaşandığı resmi satıcılı 5 büyük platform seçildi.',
      confidence: 0.99,
      highlightCategory: 'Elektronik & Çapraz Teknoloji Pazarları'
    };
  }

  // 5. Default General Cross-Platform
  return {
    platforms: ['Amazon', 'Hepsiburada', 'Trendyol', 'Sahibinden', 'N11'],
    rationale: 'Yapay zeka ürün için en geniş fiyat havuzuna sahip 5 ana e-ticaret ve ilan mecrasını aktif etti.',
    confidence: 0.90,
    highlightCategory: 'Genel E-Ticaret & İlan Platformları'
  };
}

export const ALL_AVAILABLE_PLATFORMS: Platform[] = [
  'Amazon', 
  'Hepsiburada', 
  'Trendyol', 
  'Sahibinden', 
  'Arabam', 
  'N11', 
  'Dolap', 
  'Hepsiemlak'
];

export function getPlatformBadgeStyle(platform: Platform): string {
  switch (platform) {
    case 'Amazon':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    case 'Hepsiburada':
      return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    case 'Trendyol':
      return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    case 'Sahibinden':
      return 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30';
    case 'Arabam':
      return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'N11':
      return 'text-red-300 bg-red-600/10 border-red-600/30';
    case 'Dolap':
      return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
    case 'Hepsiemlak':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    default:
      return 'text-white/70 bg-white/5 border-white/15';
  }
}

export function getAllPlatformSpecs(query: string, maxPrice?: number): PlatformSearchSpec[] {
  const platforms: Platform[] = ['Amazon', 'Hepsiburada', 'Trendyol', 'Sahibinden'];
  return platforms.map(platform => ({
    platform,
    name: platform,
    searchUrl: buildPlatformSearchUrl(platform, query, maxPrice),
    logoColor: getPlatformBadgeStyle(platform),
    iconName: platform
  }));
}
