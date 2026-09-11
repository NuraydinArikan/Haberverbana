import { DealItem, RadarRule } from '../types';

export const INITIAL_DEALS: DealItem[] = [
  {
    id: 'deal-tesla-model-y',
    title: '2024 Tesla Model Y RWD (18.000 km, Hatasız, Boyasız, Tam PPF Kaplama, Kış Lastikli)',
    category: 'Otomobil & Vasıta',
    platform: 'Sahibinden',
    currentPrice: 2280000,
    originalPrice: 2450000,
    marketAvgPrice: 2420000,
    discountRate: 6.9,
    opportunityScore: 9.3,
    badge: 'Kaçırılmayacak Fırsat',
    whyForYou: 'Drive klasöründeki watches.yaml kuralındaki "Tesla Model Y / 2024+ / Hatasız / PPF kaplamalı" şartlarına tam uyuyor. Emsal piyasa ortalamasından ₺140.000 daha avantajlı.',
    summary: 'Boyasız, tramersiz, tam PPF korumalı ve kış lastikleri dahil; sahibinden acil nakit satılık Tesla Model Y RWD fırsatı.',
    pros: [
      'Hatasız, boyasız, değişensiz (Ekspertiz garantili)',
      'Komple Stek DynoShield PPF kaplama (Piyasa değeri ~₺90.000)',
      'Orijinal kış lastik seti dahil teslim edilecek',
      '2024 model ve sadece 18.000 km'
    ],
    cons: [
      'Nakit alım şartı bulunmaktadır, takas kabul edilmiyor'
    ],
    riskFactors: [
      'Batarya sağlığı %99.2 (Tesla servis raporuyla doğrulanmış), teknik risk yok.'
    ],
    marketComparison: '2024 Model Y RWD emsalleri Sahibinden üzerinde 2.390.000 - 2.460.000 ₺ bandında satılmaktadır.',
    productUrl: 'https://www.sahibinden.com/kelime-ile-arama?query_text=Tesla+Model+Y',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    foundAt: '8 dakika önce',
    sellerRating: 'Bireysel (İlk Sahibi - 5 Yıllık Üye)',
    location: 'İstanbul / Ataşehir',
    priceHistory: [
      { date: '10 Şub', price: 2450000 },
      { date: '20 Şub', price: 2390000 },
      { date: '01 Mar', price: 2340000 },
      { date: '05 Mar', price: 2280000 }
    ],
    tags: ['Tesla Model Y', 'PPF Kaplama', 'Hatasız', '2024', 'Kış Lastikli'],
    isAffiliate: false,
    matchedRuleIds: ['watch_tesla_model_y']
  },
  {
    id: 'deal-macbook-air-m3',
    title: 'Apple MacBook Air 13.6" M3 (16GB RAM / 512GB SSD) Gece Yarısı',
    category: 'Elektronik & Bilgisayar',
    platform: 'Amazon',
    currentPrice: 47499,
    originalPrice: 53999,
    marketAvgPrice: 52000,
    discountRate: 12.0,
    opportunityScore: 9.1,
    badge: 'Kaçırılmayacak Fırsat',
    whyForYou: 'Satıcı resmi Amazon.com.tr ve fiyat 50.000 TL sınırının altında (₺47.499). watches.yaml kuralındaki "Satıcı Amazon.com.tr ise ve fiyat 50.000 TL altındaysa fırsat" şartıyla birebir eşleşti.',
    summary: 'Resmi Amazon satıcılı 16GB RAM / 512GB SSD M3 MacBook Air modelinde piyasanın dip fiyatı yakalandı.',
    pros: [
      'Satıcı resmi Amazon Türkiye (Güvenilir garanti ve kolay iade)',
      '16GB birleşik bellek ile geleceğe dönük performans',
      'Son 90 günün en dip fiyatı (₺52.000 ortalamadan ₺4.500 daha ucuz)',
      'Vade farksız 6 taksit imkanı'
    ],
    cons: [
      'Stok adedi 5 adet ile sınırlı'
    ],
    riskFactors: [
      'Satıcı Amazon Türkiye, sıfır kapalı kutu distribütör garantili.'
    ],
    marketComparison: 'Apple Store satış fiyatı 56.499 TL, diğer zincir mağazalarda 51.999 - 53.500 TL aralığında.',
    productUrl: 'https://www.amazon.com.tr/s?k=macbook+air+m3+16gb',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    foundAt: '15 dakika önce',
    sellerRating: '4.9 / 5.0 (Amazon.com.tr Resmi)',
    priceHistory: [
      { date: '15 Oca', price: 53999 },
      { date: '01 Şub', price: 52499 },
      { date: '15 Şub', price: 51200 },
      { date: '01 Mar', price: 49999 },
      { date: '05 Mar', price: 47499 }
    ],
    tags: ['MacBook Air M3', '16GB RAM', 'Amazon TR', 'Dip Fiyat'],
    isAffiliate: true,
    matchedRuleIds: ['watch_macbook_m3']
  },
  {
    id: 'deal-segway-scooter',
    title: 'SEGWAY Ninebot Max G3 Elektrikli Scooter (Resmi Distribütör Garantili)',
    category: 'Elektronik & Bilgisayar',
    platform: 'Hepsiburada',
    currentPrice: 59990,
    originalPrice: 67990,
    marketAvgPrice: 68000,
    discountRate: 11.8,
    opportunityScore: 9.0,
    badge: 'Kaçırılmayacak Fırsat',
    whyForYou: 'Drive test_notifications.py dosyasında doğrulandığı üzere piyasa ortalamasının ~₺8.000 altında. Resmi distribütör garantili sıfır kutusunda son 30 günün en dip seviyesinde.',
    summary: 'Piyasa ortalamasının ~₺8.000 altında resmi Türkiye garantili Segway Ninebot Max G3 fırsatı.',
    pros: [
      'Resmi Türkiye Distribütör Garantili',
      'Fiyat son 30 günün en dip seviyesinde (~8.000 TL indirim)',
      'Hepsiburada güvencesiyle hızlı kargo'
    ],
    cons: [
      'Kampanya stokları sınırlı görünüyor'
    ],
    riskFactors: [
      'Sıfır ambalajında ve resmi garantili, risk unsuru yok.'
    ],
    marketComparison: 'Yetkili satıcılarda liste fiyatı 67.990 TL seviyesindedir.',
    productUrl: 'https://www.hepsiburada.com/ara?q=segway+ninebot+max+scooter',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    foundAt: '22 dakika önce',
    sellerRating: '4.8 / 5.0 (Resmi Mağaza)',
    priceHistory: [
      { date: '10 Şub', price: 67990 },
      { date: '20 Şub', price: 65990 },
      { date: '01 Mar', price: 63990 },
      { date: '05 Mar', price: 59990 }
    ],
    tags: ['Segway Ninebot', 'Elektrikli Scooter', '8000 TL İndirim', 'Resmi Distribütör'],
    isAffiliate: true,
    matchedRuleIds: ['rule-1']
  },
  {
    id: 'deal-1',
    title: 'Apple MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD) Uzay Siyahı',
    category: 'Elektronik & Bilgisayar',
    platform: 'Amazon',
    currentPrice: 94999,
    originalPrice: 124999,
    marketAvgPrice: 119000,
    discountRate: 24,
    opportunityScore: 9.4,
    badge: 'Kaçırılmayacak Fırsat',
    whyForYou: 'Belirlediğin "M3 Max / 36GB" kuralıyla %100 eşleşti. Amazon Türkiye resmi satıcılı son 6 ayın en düşük dip fiyatı tespit edildi. Piyasa ortalamasından ₺24.000 daha ucuz.',
    summary: 'M3 Max işlemcili bu konfigürasyon için tarihi dip seviye; resmi distribütör garantili kaçırılmaması gereken bir fırsat.',
    pros: [
      'Resmi Amazon Türkiye satıcı garantisi',
      '30 gün sorgusuz iade hakkı',
      'Piyasa ortalamasının ₺24.000 altında (Son 180 günün dip fiyatı)',
      'Taksit avantajı mevcut'
    ],
    cons: [
      'Stok adedi sadece 3 adet ile sınırlı',
      'Uzay Siyahı rengi parmak izi tutabilir'
    ],
    riskFactors: [
      'Satıcı güvenilir (Amazon TR), teknik risk bulunmuyor.'
    ],
    marketComparison: 'Piyasadaki diğer güvenilir satıcılarda (MediaMarkt, Hepsiburada, Apple Store) 118.000 - 125.000 ₺ bandında satılıyor.',
    productUrl: 'https://www.amazon.com.tr/s?k=MacBook+Pro+M3+Max+36GB',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    foundAt: '12 dakika önce',
    sellerRating: '4.9 / 5.0 (Resmi Satıcı)',
    priceHistory: [
      { date: '15 Oca', price: 124999 },
      { date: '01 Şub', price: 121500 },
      { date: '15 Şub', price: 119000 },
      { date: '01 Mar', price: 112000 },
      { date: '05 Mar', price: 94999 }
    ],
    tags: ['M3 Max', 'MacBook Pro', 'Dip Fiyat', 'Resmi Satıcı'],
    isAffiliate: true,
    matchedRuleIds: ['rule-1']
  },
  {
    id: 'deal-2',
    title: '2022 Volkswagen Golf 1.5 eTSI R-Line (Hatasız, Boyasız, İlk Sahibinden, 32.000 km)',
    category: 'Otomobil & Vasıta',
    platform: 'Sahibinden',
    currentPrice: 1385000,
    originalPrice: 1540000,
    marketAvgPrice: 1510000,
    discountRate: 8.3,
    opportunityScore: 8.8,
    badge: 'Kaçırılmayacak Fırsat',
    whyForYou: 'Otomobil radarındaki "R-Line / Hatasız / Boyasız" kriterine tam uyuyor. Negatif filtredeki "ağır hasarlı" ve "tramer" kontrolünden temiz çıktı. Emsallerine göre ₺125.000 avantajlı.',
    summary: 'Tramer kayıtsız ve yetkili servis bakımlı R-Line paket; hızlı satış ihtiyacı nedeniyle piyasanın belirgin altında listelendi.',
    pros: [
      'Ekspertiz raporu onaylı: Değişensiz & boyasız',
      'Yetkili servis garantisi ve tam bakım geçmişi',
      'Panoramik cam tavan + Harman Kardon ses sistemi mevcut',
      'Takasa kapalı, nakit acil fiyatı'
    ],
    cons: [
      'Nakit alım şartı koşulmuş',
      'Son periyodik bakımı 2.000 km sonra gerekiyor'
    ],
    riskFactors: [
      'Satıcı bireysel; noterde ekspertiz doğrulaması yapılması önerilir. Tramer sorgusu temiz.'
    ],
    marketComparison: 'Benzer km ve donanımdaki 2022 Golf R-Line piyasa ilan ortalaması 1.490.000 - 1.550.000 ₺ aralığında seyrediyor.',
    productUrl: 'https://www.sahibinden.com/kelime-ile-arama?query_text=Volkswagen+Golf+R+Line',
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    foundAt: '28 dakika önce',
    sellerRating: 'Bireysel (İlk Sahibi - 7 Yıllık Üye)',
    location: 'İstanbul / Kadıköy',
    priceHistory: [
      { date: '10 Şub', price: 1550000 },
      { date: '20 Şub', price: 1495000 },
      { date: '01 Mar', price: 1440000 },
      { date: '05 Mar', price: 1385000 }
    ],
    tags: ['Volkswagen', 'Golf R-Line', 'Hatasız', 'İlk Sahibi', 'Acil'],
    isAffiliate: false,
    matchedRuleIds: ['rule-2']
  },
  {
    id: 'deal-3',
    title: 'Sony WH-1000XM5 Kablosuz Gürültü Engelleyici Kulaklık (Gümüş)',
    category: 'Elektronik & Bilgisayar',
    platform: 'Hepsiburada',
    currentPrice: 10499,
    originalPrice: 14999,
    marketAvgPrice: 138000 / 10,
    discountRate: 30,
    opportunityScore: 8.6,
    badge: 'Kaçırılmayacak Fırsat',
    whyForYou: 'Gürültü engelleyici kulaklık radarında %30 anlık flaş kupon indirimi tespit edildi. Hepsiburada Premium satıcı kuponuyla piyasa dip rekoru kırıldı.',
    summary: 'Sınıfının lider ANC performansı sunan kulaklıkta son 1 yılın en düşük fiyatı; kupon stokları hızla tükeniyor.',
    pros: [
      'Resmi Sony Eurasia garantisi',
      'Piyasa ortalamasından ₺3.300 daha uygun',
      'Sektör standardı aktif gürültü engelleme (ANC)',
      '30 saat pil ömrü ve hızlı şarj'
    ],
    cons: [
      'Katlanabilir menteşe tasarımı XM4 kadar kompakt değil',
      'Kupon stoğu 50 adetle sınırlı'
    ],
    riskFactors: [
      'Satıcı Hepsiburada resmi mağazası, sıfır risk.'
    ],
    marketComparison: 'Teknosa ve D&R mağazalarında 13.999 ₺, Trendyol ortalaması 13.450 ₺.',
    productUrl: 'https://www.hepsiburada.com/ara?q=Sony+WH-1000XM5',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    foundAt: '45 dakika önce',
    sellerRating: '4.8 / 5.0 (Hepsiburada)',
    priceHistory: [
      { date: '01 Oca', price: 14999 },
      { date: '15 Oca', price: 13999 },
      { date: '10 Şub', price: 13499 },
      { date: '05 Mar', price: 10499 }
    ],
    tags: ['Sony', 'ANC', 'Gürültü Engelleme', 'Flaş İndirim'],
    isAffiliate: true,
    matchedRuleIds: ['rule-1']
  },
  {
    id: 'deal-4',
    title: 'Kadıköy Moda Caddesi Yanı 2+1 Satılık Daire (Balkonlu, Kombili, Krediye Uygun)',
    category: 'Emlak & Konut',
    platform: 'Sahibinden',
    currentPrice: 5850000,
    originalPrice: 6600000,
    marketAvgPrice: 6500000,
    discountRate: 11.4,
    opportunityScore: 7.9,
    badge: 'Sıcak Fırsat',
    whyForYou: 'Moda ve Caferağa emlak takibinde m² birim fiyatı bölge ortalamasının (85.000 ₺/m²) altında (69.000 ₺/m²). Kentsel dönüşüm riski bulunmuyor.',
    summary: 'Moda merkezde yüksek kira çarpanı ve prim potansiyeli sunan, krediye uygun fırsat daire.',
    pros: [
      'Bölge m² ortalamasının %18 altında',
      'Yüksek kira getirisi potansiyeli (Aylık ~₺35.000)',
      'Tramvay ve sahile yürüme mesafesinde',
      'Kat mülkiyetli ve krediye tam uygun'
    ],
    cons: [
      'Bina yaşı 22 yıl (Deprem testi raporu mevcut)',
      'Otopark bulunmuyor (sokak parkı)'
    ],
    riskFactors: [
      'Bina yaşı nedeniyle alım öncesi statik raporun incelenmesi tavsiye edilir.'
    ],
    marketComparison: 'Moda bölgesinde benzer nitelikteki 2+1 daireler 6.400.000 - 7.200.000 ₺ arasında listeleniyor.',
    productUrl: 'https://www.sahibinden.com/kelime-ile-arama?query_text=Kadikoy+Moda+Satilik+Daire',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    foundAt: '1 saat önce',
    sellerRating: 'Yetkili Emlak Ofisi (Kurumsal)',
    location: 'İstanbul / Kadıköy / Caferağa',
    priceHistory: [
      { date: '15 Oca', price: 6600000 },
      { date: '10 Şub', price: 6250000 },
      { date: '05 Mar', price: 5850000 }
    ],
    tags: ['Kadıköy', 'Moda', 'Emlak', 'Yatırımlık', 'Fırsat'],
    isAffiliate: false
  },
  {
    id: 'deal-5',
    title: 'Dyson V15 Detect Absolute Kablosuz Dikey Süpürge',
    category: 'Ev & Yaşam',
    platform: 'Trendyol',
    currentPrice: 22999,
    originalPrice: 29999,
    marketAvgPrice: 28500,
    discountRate: 23,
    opportunityScore: 8.9,
    badge: 'Kaçırılmayacak Fırsat',
    whyForYou: 'Ev teknolojileri radarında Dyson V15 için resmi satıcı sepette %20 ek indirim kampanyası başladı. Son 90 günün en dip seviyesine indi.',
    summary: 'Lazer aydınlatmalı piezo sensörlü amiral gemisi modelde resmi distribütör garantili net fırsat.',
    pros: [
      'Dyson Türkiye 2 yıl resmi garantili',
      'Sepette ekstra kupon ve peşin fiyatına 6 taksit',
      'Tüm başlıklar ve lazer zemin aparatı dahil',
      'Piyasa ortalamasından ₺5.500 tasarruf'
    ],
    cons: [
      'Kampanya stokları sınırlı, 24 saat geçerli'
    ],
    riskFactors: [
      'Kutu içeriğindeki aksesuarlar tam; sahte veya paralel ithalat değil.'
    ],
    marketComparison: 'Dyson web sitesinde 29.999 ₺, Teknosa/MediaMarkt 28.499 ₺.',
    productUrl: 'https://www.trendyol.com/sr?q=Dyson+V15+Detect+Absolute',
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
    foundAt: '2 saat önce',
    sellerRating: '4.9 / 5.0 (Dyson Resmi Mağaza)',
    priceHistory: [
      { date: '01 Şub', price: 29999 },
      { date: '15 Şub', price: 27999 },
      { date: '05 Mar', price: 22999 }
    ],
    tags: ['Dyson V15', 'Ev Elektroniği', 'Resmi Distribütör'],
    isAffiliate: true
  },
  {
    id: 'deal-6',
    title: 'Samsung 65" QN90C Neo QLED 4K Akıllı TV (120Hz, Anti-Glare)',
    category: 'Elektronik & Bilgisayar',
    platform: 'Amazon',
    currentPrice: 48999,
    originalPrice: 62999,
    marketAvgPrice: 58500,
    discountRate: 22,
    opportunityScore: 8.2,
    badge: 'Kaçırılmayacak Fırsat',
    whyForYou: 'TV ve görüntü sistemleri radarında 65 inç Mini-LED serisinde Amazon Bahar Fırsatları kapsamında rekor düşüş.',
    summary: 'Yüksek parlaklık ve konsol oyunu performansı arayanlar için sınıfının en iyi Mini-LED paneli.',
    pros: [
      '144Hz VRR desteği ve 4 adet HDMI 2.1 portu',
      'Yansıma önleyici (Anti-glare) özel kaplama',
      'Samsung Türkiye 10 yıl ekran yanması garantisi',
      'Ücretsiz yetkili servis kurulumu'
    ],
    cons: [
      'Büyük koli boyutları nedeniyle kargo teslimat süresi 2-3 gün sürebilir'
    ],
    riskFactors: [
      'Amazon lojistik garantisiyle hasarsız teslimat.'
    ],
    marketComparison: 'Vatan Bilgisayar 59.999 ₺, Hepsiburada 57.800 ₺.',
    productUrl: 'https://www.amazon.com.tr/s?k=Samsung+65+QN90C',
    imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
    foundAt: '3 saat önce',
    sellerRating: '4.9 / 5.0 (Amazon.com.tr)',
    priceHistory: [
      { date: '10 Oca', price: 62999 },
      { date: '05 Şub', price: 58999 },
      { date: '05 Mar', price: 48999 }
    ],
    tags: ['Samsung QLED', '4K TV', 'Konsol Hazır'],
    isAffiliate: true,
    matchedRuleIds: ['rule-1']
  }
];

export const INITIAL_RULES: RadarRule[] = [
  {
    id: 'watch_tesla_model_y',
    name: 'Tesla Model Y RWD Radarı',
    searchQuery: 'Tesla Model Y RWD',
    category: 'Otomobil & Vasıta',
    minPrice: 1800000,
    maxPrice: 2400000,
    platforms: ['Sahibinden', 'Arabam'],
    aiInstructions: 'Hatasız, boyasız, PPF kaplamalı veya kış lastikli olanları yüksek puanla değerlendir.',
    positiveKeywords: ['Tesla', 'Model Y', 'RWD', 'Hatasız', 'Boyasız', 'PPF', 'Kış Lastikli'],
    negativeKeywords: ['ağır hasarlı', 'boyalı', 'değişenli', 'tramer', 'hasarlı'],
    minScore: 8.5,
    notificationChannel: 'Telegram',
    frequency: 'Anlık',
    isActive: true,
    matchedCount: 2,
    createdAt: 'Drive: config/watches.yaml'
  },
  {
    id: 'watch_macbook_m3',
    name: 'MacBook Air M3 16GB Çapraz Platform Radarı',
    searchQuery: 'MacBook Air M3 16GB',
    category: 'Elektronik & Bilgisayar',
    minPrice: 35000,
    maxPrice: 50000,
    platformMode: 'auto_ai',
    platforms: ['Amazon', 'Hepsiburada', 'Trendyol', 'Sahibinden', 'N11'],
    aiDiscoveredPlatforms: ['Amazon', 'Hepsiburada', 'Trendyol', 'Sahibinden', 'N11'],
    aiRationale: 'Elektronik kategorisinde sıfır ve garantili cihazlar için pazar lideri e-ticaret siteleri ile ilan mecraları otomatik taramaya alındı.',
    autoExpandPlatforms: true,
    aiInstructions: 'Satıcısı resmi satıcı olan ve 50 bin altındaki fırsatları haber ver.',
    positiveKeywords: ['MacBook Air', 'M3', '16GB', 'Amazon.com.tr', 'Gece Yarısı'],
    negativeKeywords: ['yenilenmiş', 'refurbished', 'teşhir', 'kutusu açık'],
    minScore: 8.0,
    notificationChannel: 'Telegram',
    frequency: 'Anlık',
    isActive: true,
    matchedCount: 4,
    createdAt: 'Drive: config/watches.yaml'
  },
  {
    id: 'rule-1',
    name: 'Apple M3 Pro/Max Donanım Radarı',
    searchQuery: 'MacBook Pro M3 Max 36GB',
    category: 'Elektronik & Bilgisayar',
    minPrice: 15000,
    maxPrice: 120000,
    platformMode: 'manual',
    platforms: ['Amazon', 'Hepsiburada', 'Trendyol'],
    autoExpandPlatforms: true,
    aiInstructions: '36GB RAM üstü ve resmi distribütör garantili olanları haber ver.',
    positiveKeywords: ['M3 Max', 'M3 Pro', 'MacBook', '36GB', 'OLED', 'Sony XM5'],
    negativeKeywords: ['teşhir', 'kutusu açık', 'parça niyetine', 'yenilenmiş', 'tamirli'],
    minScore: 8.0,
    notificationChannel: 'Telegram',
    frequency: 'Anlık',
    isActive: true,
    matchedCount: 3,
    createdAt: '2 gün önce'
  },
  {
    id: 'rule-2',
    name: 'Temiz Vasıta (Hatasız & Düşük KM Otomobil)',
    searchQuery: 'Volkswagen Golf R-Line eTSI Hatasız',
    category: 'Otomobil & Vasıta',
    minPrice: 900000,
    maxPrice: 1600000,
    platformMode: 'auto_ai',
    platforms: ['Sahibinden', 'Arabam'],
    aiDiscoveredPlatforms: ['Sahibinden', 'Arabam'],
    aiRationale: 'Vasıta kategorisinde sadece araç odaklı güvenilir portal siteleri hedeflendi.',
    autoExpandPlatforms: true,
    aiInstructions: 'İlk sahibinden, yetkili servis bakımlı ve tramer kayıtsız olanlar.',
    positiveKeywords: ['Golf', 'R-Line', 'eTSI', 'Hatasız', 'Boyasız', 'İlk Sahibinden'],
    negativeKeywords: ['ağır hasarlı', 'pert', 'tramer', 'şasi işlemli', 'hava yastığı açmış'],
    minScore: 7.5,
    notificationChannel: 'Tümü',
    frequency: 'Anlık',
    isActive: true,
    matchedCount: 1,
    createdAt: '5 gün önce'
  },
  {
    id: 'rule-3',
    name: 'Kadıköy / Moda Emlak & Yatırım Radarı',
    searchQuery: 'Kadıköy Moda 2+1 Balkonlu Krediye Uygun',
    category: 'Emlak & Konut',
    minPrice: 3000000,
    maxPrice: 8000000,
    platformMode: 'auto_ai',
    platforms: ['Sahibinden', 'Hepsiemlak'],
    aiDiscoveredPlatforms: ['Sahibinden', 'Hepsiemlak'],
    aiRationale: 'Konut ve gayrimenkul için Sahibinden ve Hepsiemlak emlak portalları otomatik eşleştirildi.',
    autoExpandPlatforms: true,
    aiInstructions: 'Bina yaşı 15 altı veya kentsel dönüşüm riski olmayan, yüksek kira çarpanlı daireler.',
    positiveKeywords: ['Moda', 'Caferağa', 'Krediye Uygun', 'Balkonlu', 'Kira Getirisi'],
    negativeKeywords: ['hisseli', 'mahkemelik', 'riskli yapı', 'kamulaştırma'],
    minScore: 7.0,
    notificationChannel: 'E-posta',
    frequency: 'Günde 1 Kez',
    isActive: true,
    matchedCount: 1,
    createdAt: '1 hafta önce'
  }
];
