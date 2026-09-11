import { Platform, DealCategory } from '../types';

export interface PlatformSearchSpec {
  platform: Platform;
  name: string;
  searchUrl: string;
  logoColor: string;
  iconName: string;
  categoryFit?: string;
}

export interface PlatformItemSpec {
  id: string;
  name: Platform;
  displayName: string;
  badge: string;
  kurumsal?: boolean;
  domainUrl: string;
  subgroup?: string;
}

export interface AutomotiveGroupSpec {
  groupId: string;
  groupTitle: string;
  badgeText: string;
  groupDescription: string;
  platforms: PlatformItemSpec[];
}

export const AUTOMOTIVE_SUBGROUPS: AutomotiveGroupSpec[] = [
  {
    groupId: 'open_marketplaces',
    groupTitle: 'Açık İlan Pazaryerleri',
    badgeText: 'Bireysel & Galeri İlanları',
    groupDescription: 'En geniş ilan havuzuna ve kullanıcı trafiğine sahip açık platformlar',
    platforms: [
      { id: 'sahibinden', name: 'Sahibinden', displayName: 'Sahibinden.com', badge: 'En Yüksek İlan Hacmi', domainUrl: 'https://www.sahibinden.com/vasita', subgroup: 'open_marketplaces' },
      { id: 'arabam', name: 'Arabam', displayName: 'Arabam.com', badge: 'Trink Sat & Galeri Ağı', domainUrl: 'https://www.arabam.com', subgroup: 'open_marketplaces' },
      { id: 'araba_com', name: 'Araba.com', displayName: 'Araba.com', badge: 'Geleneksel İlan Portalı', domainUrl: 'https://www.araba.com', subgroup: 'open_marketplaces' }
    ]
  },
  {
    groupId: 'distributors_certified',
    groupTitle: 'Distribütör & Yetkili Grup İkinci El Ağları',
    badgeText: 'Sertifikalı / Kurumsal',
    groupDescription: 'Resmi distribütör garantili, fabrika standartlarında ve 100+ nokta ekspertizli ağlar',
    platforms: [
      { id: 'otokoc', name: 'Otokoç İkinci El', displayName: 'Otokoç 2. El (Koç Grubu)', badge: 'Koç Holding Güvencesi', kurumsal: true, domainUrl: 'https://www.otokocikinciel.com', subgroup: 'distributors_certified' },
      { id: 'dod', name: 'DOD', displayName: 'DOD (Doğuş Otomotiv)', badge: 'VW/Audi/Seat/Skoda/Porsche 101 Nokta', kurumsal: true, domainUrl: 'https://www.dod.com.tr', subgroup: 'distributors_certified' },
      { id: 'dogusoto', name: 'Doğuş Oto', displayName: 'Doğuş Oto', badge: 'Doğuş Grubu Yetkili Satış', kurumsal: true, domainUrl: 'https://dogusoto.com.tr', subgroup: 'distributors_certified' },
      { id: 'borusanotonext', name: 'Borusan Next', displayName: 'Borusan Next (Borusan)', badge: 'BMW, MINI, Land Rover, Jaguar', kurumsal: true, domainUrl: 'https://www.borusanotonext.com', subgroup: 'distributors_certified' },
      { id: 'renault2', name: 'Renault2', displayName: 'Renault2 (Mais)', badge: 'Renault & Dacia Garantili', kurumsal: true, domainUrl: 'https://www.renault2.com.tr', subgroup: 'distributors_certified' },
      { id: 'spoticar', name: 'Spoticar', displayName: 'Spoticar (Stellantis)', badge: 'Peugeot, Citroën, Opel, DS, Fiat', kurumsal: true, domainUrl: 'https://www.spoticar.com.tr', subgroup: 'distributors_certified' },
      { id: 'toyotagaranti', name: 'Toyota Garanti', displayName: 'Toyota Garanti', badge: 'Toyota Plaza Ekspertizli', kurumsal: true, domainUrl: 'https://www.toyota.com.tr/ikinci-el', subgroup: 'distributors_certified' },
      { id: 'volvoselekt', name: 'Volvo Selekt', displayName: 'Volvo Selekt', badge: 'Fabrika Standartlarında Garanti', kurumsal: true, domainUrl: 'https://www.volvocars.com/tr/l/volvo-selekt', subgroup: 'distributors_certified' }
    ]
  },
  {
    groupId: 'multi_brand_showrooms',
    groupTitle: 'Büyük Çok Markalı Showroomlar & Perakende Satış Ağları',
    badgeText: 'Kurumsal Showroomlar',
    groupDescription: 'Geniş fiziksel showroom ağına sahip köklü kurumsal perakendeciler',
    platforms: [
      { id: 'neziroglu', name: 'Neziroğlu', displayName: 'Neziroğlu Otomotiv', badge: '50+ Yıllık Güvence & Ekspertiz', kurumsal: true, domainUrl: 'https://www.neziroglu.com.tr', subgroup: 'multi_brand_showrooms' },
      { id: 'koluman', name: 'Koluman 2. El', displayName: 'Koluman 2. El', badge: 'Mercedes-Benz Ana Bayi Güvencesi', kurumsal: true, domainUrl: 'https://www.koluman2el.com', subgroup: 'multi_brand_showrooms' },
      { id: 'mengerler', name: 'Mengerler 2. El', displayName: 'Mengerler 2. El', badge: 'Mercedes & Premium Araç Operasyonu', kurumsal: true, domainUrl: 'https://www.mengerler.com', subgroup: 'multi_brand_showrooms' },
      { id: 'otoshops', name: 'Otoshops', displayName: 'Otoshops (Gülpar)', badge: 'Çok Markalı Kurumsal Bayi Ağı', kurumsal: true, domainUrl: 'https://www.otoshops.com', subgroup: 'multi_brand_showrooms' }
    ]
  },
  {
    groupId: 'instant_cash_retail',
    groupTitle: 'Hızlı Nakit Alım & Doğrudan Stoktan Satış Platformları',
    badgeText: 'Doğrudan Stoktan Satış',
    groupDescription: 'Kullanıcıdan doğrudan nakit alıp ekspertiz ve yenileme sonrası satan platformlar',
    platforms: [
      { id: 'vavacars', name: 'VavaCars', displayName: 'VavaCars', badge: 'Yenilenmiş Garantili Stok', kurumsal: true, domainUrl: 'https://tr.vavacars.com', subgroup: 'instant_cash_retail' },
      { id: 'otoplus', name: 'otoplus', displayName: 'otoplus (letgo)', badge: 'Takas & Garantili Satış Ağı', kurumsal: true, domainUrl: 'https://www.otoplus.com', subgroup: 'instant_cash_retail' },
      { id: 'ikinciyeni', name: 'ikinciyeni.com', displayName: 'ikinciyeni.com', badge: 'Çelik Motor / Anadolu Grubu & Yapay Zeka', kurumsal: true, domainUrl: 'https://www.ikinciyeni.com', subgroup: 'instant_cash_retail' },
      { id: 'carvak', name: 'Carvak', displayName: 'Carvak (Kavak)', badge: 'Uluslararası Sertifikalı Satış', kurumsal: true, domainUrl: 'https://www.carvak.com', subgroup: 'instant_cash_retail' }
    ]
  },
  {
    groupId: 'online_auctions',
    groupTitle: 'Online İhale ve Açık Artırma Platformları',
    badgeText: 'Açık Artırma & Filo İhaleleri',
    groupDescription: 'Filo, banka ve şirket araçlarının teklif usulü satış kanalları',
    platforms: [
      { id: 'borusan_ihale', name: 'Borusan Araç İhale', displayName: 'Borusan Araç İhale', badge: 'Kurumsal Filo & Banka İhalesi', kurumsal: true, domainUrl: 'https://www.borusanaraciharesi.com', subgroup: 'online_auctions' },
      { id: 'ikinciyeni_ihale', name: 'İhale.ikinciyeni.com', displayName: 'İhale.ikinciyeni.com', badge: 'Online Teklifli Açık Artırma', kurumsal: true, domainUrl: 'https://www.ikinciyeni.com/ihale', subgroup: 'online_auctions' }
    ]
  }
];

export const CATEGORY_PLATFORMS_MAP: Record<DealCategory, PlatformItemSpec[]> = {
  'Otomobil & Vasıta': AUTOMOTIVE_SUBGROUPS.flatMap(g => g.platforms),
  'Elektronik & Bilgisayar': [
    { id: 'amazon', name: 'Amazon', displayName: 'Amazon Türkiye', badge: 'Prime & Lojistik', domainUrl: 'https://www.amazon.com.tr' },
    { id: 'hepsiburada', name: 'Hepsiburada', displayName: 'Hepsiburada', badge: 'Resmi Satıcılar', domainUrl: 'https://www.hepsiburada.com' },
    { id: 'trendyol', name: 'Trendyol', displayName: 'Trendyol', badge: 'Pazaryeri & Kampanya', domainUrl: 'https://www.trendyol.com' },
    { id: 'n11', name: 'N11', displayName: 'N11', badge: 'Kupon Fırsatları', domainUrl: 'https://www.n11.com' },
    { id: 'sahibinden', name: 'Sahibinden', displayName: 'Sahibinden', badge: 'Param Güvende 2. El', domainUrl: 'https://www.sahibinden.com' },
    { id: 'teknosa', name: 'Teknosa', displayName: 'Teknosa', badge: 'Sabancı Mağazası', kurumsal: true, domainUrl: 'https://www.teknosa.com' },
    { id: 'mediamarkt', name: 'MediaMarkt', displayName: 'MediaMarkt', badge: 'Tüketici Elektroniği', kurumsal: true, domainUrl: 'https://www.mediamarkt.com.tr' },
    { id: 'vatan', name: 'Vatan Bilgisayar', displayName: 'Vatan Bilgisayar', badge: 'OEM & Donanım', kurumsal: true, domainUrl: 'https://www.vatanbilgisayar.com' }
  ],
  'Emlak & Konut': [
    { id: 'sahibinden', name: 'Sahibinden', displayName: 'Sahibinden Emlak', badge: 'Ana İlan Portalı', domainUrl: 'https://www.sahibinden.com/emlak' },
    { id: 'hepsiemlak', name: 'Hepsiemlak', displayName: 'Hepsiemlak', badge: 'Kurumsal & Bireysel', domainUrl: 'https://www.hepsiemlak.com' },
    { id: 'emlakjet', name: 'Emlakjet', displayName: 'Emlakjet', badge: 'AI Emlak Portalı', domainUrl: 'https://www.emlakjet.com' },
    { id: 'zingat', name: 'Zingat', displayName: 'Zingat', badge: 'Bölge Raporlu', domainUrl: 'https://www.zingat.com' }
  ],
  'Giyim & Moda': [
    { id: 'trendyol', name: 'Trendyol', displayName: 'Trendyol Moda', badge: 'Butikler & Markalar', domainUrl: 'https://www.trendyol.com' },
    { id: 'dolap', name: 'Dolap', displayName: 'Dolap', badge: '2. El Moda', domainUrl: 'https://dolap.com' },
    { id: 'gardrops', name: 'Gardrops', displayName: 'Gardrops', badge: 'Komisyonsuz 2. El', domainUrl: 'https://gardrops.com' },
    { id: 'hepsiburada', name: 'Hepsiburada', displayName: 'Hepsiburada', badge: 'Resmi Giyim Mağazaları', domainUrl: 'https://www.hepsiburada.com' },
    { id: 'amazon', name: 'Amazon', displayName: 'Amazon Moda', badge: 'Global Markalar', domainUrl: 'https://www.amazon.com.tr' },
    { id: 'beymen', name: 'Beymen', displayName: 'Beymen', badge: 'Lüks & Tasarım', kurumsal: true, domainUrl: 'https://www.beymen.com' }
  ],
  'Ev & Yaşam': [
    { id: 'amazon', name: 'Amazon', displayName: 'Amazon Ev & Yaşam', badge: 'Ev Aletleri', domainUrl: 'https://www.amazon.com.tr' },
    { id: 'hepsiburada', name: 'Hepsiburada', displayName: 'Hepsiburada', badge: 'Ev & Mobilya', domainUrl: 'https://www.hepsiburada.com' },
    { id: 'trendyol', name: 'Trendyol', displayName: 'Trendyol', badge: 'Dekorasyon', domainUrl: 'https://www.trendyol.com' },
    { id: 'karaca', name: 'Karaca', displayName: 'Karaca', badge: 'Mutfak & Sofra', kurumsal: true, domainUrl: 'https://www.karaca.com' },
    { id: 'vivense', name: 'Vivense', displayName: 'Vivense', badge: 'Mobilya & Tasarım', kurumsal: true, domainUrl: 'https://www.vivense.com' },
    { id: 'koctas', name: 'Koçtaş', displayName: 'Koçtaş', badge: 'Yapı Market & Ev', kurumsal: true, domainUrl: 'https://www.koctas.com.tr' }
  ],
  'Tümü': [
    { id: 'sahibinden', name: 'Sahibinden', displayName: 'Sahibinden', badge: 'İlan Portalı', domainUrl: 'https://www.sahibinden.com' },
    { id: 'arabam', name: 'Arabam', displayName: 'Arabam', badge: 'Vasıta Portalı', domainUrl: 'https://www.arabam.com' },
    { id: 'otokoc', name: 'Otokoç İkinci El', displayName: 'Otokoç 2. El', badge: 'Otomotiv', kurumsal: true, domainUrl: 'https://www.otokocikinciel.com' },
    { id: 'dod', name: 'DOD', displayName: 'DOD', badge: 'Otomotiv', kurumsal: true, domainUrl: 'https://www.dod.com.tr' },
    { id: 'borusanotonext', name: 'Borusan Next', displayName: 'Borusan Next', badge: 'Otomotiv', kurumsal: true, domainUrl: 'https://www.borusanotonext.com' },
    { id: 'neziroglu', name: 'Neziroğlu', displayName: 'Neziroğlu', badge: 'Otomotiv', kurumsal: true, domainUrl: 'https://www.neziroglu.com.tr' },
    { id: 'vavacars', name: 'VavaCars', displayName: 'VavaCars', badge: 'Otomotiv', kurumsal: true, domainUrl: 'https://tr.vavacars.com' },
    { id: 'amazon', name: 'Amazon', displayName: 'Amazon', badge: 'Pazaryeri', domainUrl: 'https://www.amazon.com.tr' },
    { id: 'hepsiburada', name: 'Hepsiburada', displayName: 'Hepsiburada', badge: 'Pazaryeri', domainUrl: 'https://www.hepsiburada.com' },
    { id: 'trendyol', name: 'Trendyol', displayName: 'Trendyol', badge: 'Pazaryeri', domainUrl: 'https://www.trendyol.com' },
    { id: 'n11', name: 'N11', displayName: 'N11', badge: 'Pazaryeri', domainUrl: 'https://www.n11.com' },
    { id: 'dolap', name: 'Dolap', displayName: 'Dolap', badge: 'İkinci El', domainUrl: 'https://dolap.com' },
    { id: 'hepsiemlak', name: 'Hepsiemlak', displayName: 'Hepsiemlak', badge: 'Emlak Portalı', domainUrl: 'https://www.hepsiemlak.com' }
  ]
};

export function buildPlatformSearchUrl(platform: Platform | string, query: string, maxPrice?: number): string {
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
    case 'Araba.com':
      return `https://www.araba.com/arama?q=${q}`;
    case 'Borusan Oto Next':
    case 'Borusan Next':
      return `https://www.borusanotonext.com/arama?q=${q}`;
    case 'Koç Oto İkinci El':
    case 'Otokoç İkinci El':
    case 'Otokoç':
      return `https://www.otokocikinciel.com/araclar?q=${q}`;
    case 'Doğuş Oto':
      return `https://dogusoto.com.tr/arac-arama?q=${q}`;
    case 'Neziroğlu':
    case 'Neziroğlu Otomotiv':
      return `https://www.neziroglu.com.tr/arama?q=${q}`;
    case 'DOD':
      return `https://www.dod.com.tr/arac-arama?text=${q}`;
    case 'Renault2':
      return `https://www.renault2.com.tr/arac-arama?q=${q}`;
    case 'Spoticar':
      return `https://www.spoticar.com.tr/arac-arama?q=${q}`;
    case 'Toyota Garanti':
      return `https://www.toyota.com.tr/ikinci-el/arac-arama?q=${q}`;
    case 'Volvo Selekt':
      return `https://www.volvocars.com/tr/l/volvo-selekt/?q=${q}`;
    case 'Koluman 2. El':
      return `https://www.koluman2el.com/arac-arama?q=${q}`;
    case 'Mengerler 2. El':
      return `https://www.mengerler.com/ikinci-el?q=${q}`;
    case 'Otoshops':
      return `https://www.otoshops.com/arac-arama?q=${q}`;
    case 'VavaCars':
      return `https://tr.vavacars.com/araclar?q=${q}`;
    case 'Carvak':
      return `https://www.carvak.com/tr/satilik-arac?q=${q}`;
    case 'otoplus':
    case 'Otoplus':
      return `https://www.otoplus.com/araclar?q=${q}`;
    case 'ikinciyeni.com':
      return `https://www.ikinciyeni.com/ikinci-el-araba-fiyatlari?q=${q}`;
    case 'Borusan Araç İhale':
      return `https://www.borusanaraciharesi.com/ihale-araclari?q=${q}`;
    case 'İhale.ikinciyeni.com':
      return `https://www.ikinciyeni.com/ihale?q=${q}`;
    case 'N11':
      return `https://www.n11.com/arama?q=${q}${maxPrice ? `&ps=${maxPrice}` : ''}`;
    case 'Dolap':
      return `https://dolap.com/arama?q=${q}`;
    case 'Hepsiemlak':
      return `https://www.hepsiemlak.com/arama?query=${q}`;
    case 'Emlakjet':
      return `https://www.emlakjet.com/satilik-konut/?q=${q}`;
    case 'Zingat':
      return `https://www.zingat.com/satilik-konut?q=${q}`;
    case 'Teknosa':
      return `https://www.teknosa.com/arama?s=${q}`;
    case 'MediaMarkt':
      return `https://www.mediamarkt.com.tr/tr/search.html?query=${q}`;
    case 'Vatan Bilgisayar':
      return `https://www.vatanbilgisayar.com/arama/${q}/`;
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
      platforms: [
        'Sahibinden',
        'Arabam',
        'Otokoç İkinci El',
        'DOD',
        'Borusan Next',
        'Renault2',
        'Spoticar',
        'Toyota Garanti',
        'Volvo Selekt',
        'Neziroğlu',
        'Koluman 2. El',
        'VavaCars',
        'otoplus',
        'ikinciyeni.com',
        'Carvak'
      ],
      rationale: 'Yapay zeka arama terimini "Taşıt / Vasıta" olarak sınıflandırdı. Sahibinden ve Arabam gibi açık ilan pazaryerleri; Otokoç, DOD, Borusan Next, Renault2, Spoticar gibi sertifikalı distribütör ağları; Neziroğlu, Koluman gibi showroomlar ve VavaCars, otoplus, ikinciyeni.com gibi doğrudan stok satış ağları taranacak.',
      confidence: 0.99,
      highlightCategory: 'Açık Pazaryeri, Distribütör & Kurumsal Otomotiv Portalları'
    };
  }

  // 2. Real Estate / Housing
  if (
    category === 'Emlak & Konut' ||
    /daire|ev|konut|villa|arsa|yazlık|kiralık|satılık|kadıköy|residence|emlak|bina/i.test(q)
  ) {
    return {
      platforms: ['Sahibinden', 'Hepsiemlak', 'Emlakjet', 'Zingat'],
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
      platforms: ['Trendyol', 'Dolap', 'Gardrops', 'Hepsiburada', 'Amazon', 'Beymen'],
      rationale: 'Moda ve giyim ürünlerinde yüksek kampanya ve ikinci el/butik hacmi sunan popüler pazaryerleri seçildi.',
      confidence: 0.95,
      highlightCategory: 'Moda & Butik Portalları'
    };
  }

  // 4. Electronics, Computers, Phones, Gadgets
  if (
    category === 'Elektronik & Bilgisayar' ||
    /macbook|apple|iphone|ipad|samsung|laptop|monitör|kulaklık|sony|playstation|xbox|nintendo|oled|qled|gpu|rtx|bilgisayar|tablet/i.test(q)
  ) {
    return {
      platforms: ['Amazon', 'Hepsiburada', 'Trendyol', 'Sahibinden', 'N11', 'Teknosa', 'MediaMarkt', 'Vatan Bilgisayar'],
      rationale: 'Teknoloji ve tüketici elektroniğinde en sert fiyat rekabetinin yaşandığı resmi satıcılı ve teknoloji zinciri mağazalar seçildi.',
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
  'Sahibinden', 
  'Arabam', 
  'Araba.com',
  'Otokoç İkinci El',
  'Koç Oto İkinci El',
  'DOD',
  'Doğuş Oto',
  'Borusan Next',
  'Borusan Oto Next',
  'Renault2',
  'Spoticar',
  'Toyota Garanti',
  'Volvo Selekt',
  'Neziroğlu',
  'Koluman 2. El',
  'Mengerler 2. El',
  'Otoshops',
  'VavaCars',
  'otoplus',
  'ikinciyeni.com',
  'Carvak',
  'Borusan Araç İhale',
  'İhale.ikinciyeni.com',
  'Amazon', 
  'Hepsiburada', 
  'Trendyol', 
  'N11', 
  'Dolap', 
  'Hepsiemlak',
  'Emlakjet',
  'Teknosa',
  'MediaMarkt'
];

export function getPlatformBadgeStyle(platform: Platform | string): string {
  switch (platform) {
    case 'Sahibinden':
      return 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30';
    case 'Arabam':
      return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'Araba.com':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    case 'Borusan Oto Next':
    case 'Borusan Next':
      return 'text-sky-300 bg-sky-500/10 border-sky-500/30';
    case 'Koç Oto İkinci El':
    case 'Otokoç İkinci El':
    case 'Otokoç':
      return 'text-rose-300 bg-rose-500/10 border-rose-500/30';
    case 'Doğuş Oto':
      return 'text-blue-300 bg-blue-500/10 border-blue-500/30';
    case 'DOD':
      return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30';
    case 'Renault2':
      return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
    case 'Spoticar':
      return 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30';
    case 'Toyota Garanti':
      return 'text-red-300 bg-red-500/10 border-red-500/30';
    case 'Volvo Selekt':
      return 'text-sky-400 bg-sky-600/15 border-sky-500/30';
    case 'Neziroğlu':
      return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30';
    case 'Koluman 2. El':
      return 'text-slate-200 bg-slate-500/15 border-slate-400/30';
    case 'Mengerler 2. El':
      return 'text-teal-300 bg-teal-500/10 border-teal-500/30';
    case 'Otoshops':
      return 'text-violet-300 bg-violet-500/10 border-violet-500/30';
    case 'VavaCars':
      return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
    case 'otoplus':
    case 'Otoplus':
      return 'text-orange-300 bg-orange-500/10 border-orange-500/30';
    case 'ikinciyeni.com':
      return 'text-lime-300 bg-lime-500/10 border-lime-500/30';
    case 'Carvak':
      return 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30';
    case 'Borusan Araç İhale':
      return 'text-blue-400 bg-blue-600/15 border-blue-500/30';
    case 'İhale.ikinciyeni.com':
      return 'text-emerald-400 bg-emerald-600/15 border-emerald-500/30';
    case 'Amazon':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    case 'Hepsiburada':
      return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    case 'Trendyol':
      return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    case 'N11':
      return 'text-red-300 bg-red-600/10 border-red-600/30';
    case 'Dolap':
      return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
    case 'Hepsiemlak':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    case 'Emlakjet':
      return 'text-green-300 bg-green-500/10 border-green-500/30';
    case 'Teknosa':
      return 'text-orange-300 bg-orange-500/10 border-orange-500/30';
    case 'MediaMarkt':
      return 'text-red-400 bg-red-600/15 border-red-500/30';
    default:
      return 'text-white/70 bg-white/5 border-white/15';
  }
}

export function getAllPlatformSpecs(query: string, maxPrice?: number): PlatformSearchSpec[] {
  const platforms: Platform[] = ['Sahibinden', 'Arabam', 'Borusan Oto Next', 'Koç Oto İkinci El', 'Doğuş Oto'];
  return platforms.map(platform => ({
    platform,
    name: platform,
    searchUrl: buildPlatformSearchUrl(platform, query, maxPrice),
    logoColor: getPlatformBadgeStyle(platform),
    iconName: platform
  }));
}

