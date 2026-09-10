export interface PlatformItem {
  id: string;
  name: string;
  category: string;
  description: string;
  badgeColor?: string;
  popular?: boolean;
}

export interface PlatformCategoryGroup {
  category: string;
  iconName: string;
  description: string;
  platforms: PlatformItem[];
}

export const TURKISH_PLATFORM_GROUPS: PlatformCategoryGroup[] = [
  {
    category: 'Genel Pazaryerleri (Çok Kategorili)',
    iconName: 'ShoppingBag',
    description: 'Tüm kategorilerde milyonlarca ürün ve satıcı',
    platforms: [
      { id: 'hepsiburada', name: 'Hepsiburada', category: 'Genel Pazaryerleri', description: 'Genel Pazaryeri & Resmi Satıcılar', popular: true },
      { id: 'trendyol', name: 'Trendyol', category: 'Genel Pazaryerleri', description: 'Genel Pazaryeri & Butikler', popular: true },
      { id: 'amazon', name: 'Amazon Türkiye', category: 'Genel Pazaryerleri', description: 'Amazon Lojistik ve Prime İndirimleri', popular: true },
      { id: 'n11', name: 'N11', category: 'Genel Pazaryerleri', description: 'Kuponlu Alışveriş & Pazaryeri', popular: true },
      { id: 'ciceksepeti', name: 'Çiçeksepeti (Ekstra)', category: 'Genel Pazaryerleri', description: 'Ekstra Pazaryeri & Hediyelik' },
      { id: 'pttavm', name: 'PttAVM', category: 'Genel Pazaryerleri', description: 'Devlet Güvenceli Pazaryeri' },
      { id: 'pazarama', name: 'Pazarama', category: 'Genel Pazaryerleri', description: 'Türkiye İş Bankası Pazaryeri' }
    ]
  },
  {
    category: 'İkinci El, Seri İlan ve C2C Pazaryerleri',
    iconName: 'Repeat',
    description: 'Bireysel ve kurumsal ikinci el ilanları',
    platforms: [
      { id: 'sahibinden', name: 'Sahibinden', category: 'İkinci El & İlan', description: 'Vasıta, Emlak, 2. El Param Güvende', popular: true },
      { id: 'letgo', name: 'Letgo (Otoplus)', category: 'İkinci El & İlan', description: 'Lokal 2. El ve Araç Alım-Satım', popular: true },
      { id: 'dolap', name: 'Dolap', category: 'İkinci El & İlan', description: '2. El Moda, Elektronik ve Ev Eşyası', popular: true },
      { id: 'gardrops', name: 'Gardrops', category: 'İkinci El & İlan', description: 'Komisyonsuz 2. El Giyim ve Aksesuar' }
    ]
  },
  {
    category: 'Elektronik & Bilgisayar Bileşenleri',
    iconName: 'Cpu',
    description: 'Oyuncu donanımları, bileşenler ve tüketici elektroniği',
    platforms: [
      { id: 'teknosa', name: 'Teknosa', category: 'Elektronik', description: 'Sabancı Güvenceli Teknoloji Mağazası', popular: true },
      { id: 'mediamarkt', name: 'MediaMarkt', category: 'Elektronik', description: 'Tüketici Elektroniği & Kulüp İndirimleri', popular: true },
      { id: 'vatan', name: 'Vatan Bilgisayar', category: 'Elektronik', description: 'Bilgisayar & OEM Donanım', popular: true },
      { id: 'itopya', name: 'İtopya', category: 'Elektronik', description: 'Hazır Sistem & Oyuncu Ekipmanları', popular: true },
      { id: 'gaminggentr', name: 'Gaming.gen.tr', category: 'Elektronik', description: 'Oyuncu Sistemleri & Bileşenler' },
      { id: 'sinerji', name: 'Sinerji Bilgisayar', category: 'Elektronik', description: 'Masaüstü Sistem & OEM Donanım' },
      { id: 'incehesap', name: 'İncehesap', category: 'Elektronik', description: 'Gaming Gecesi & İndirimli Sistemler' },
      { id: 'tebilon', name: 'Tebilon', category: 'Elektronik', description: 'Oyuncu Donanımı & Hazır Sistem' }
    ]
  },
  {
    category: 'Otomotiv & Araç Satışı',
    iconName: 'Car',
    description: 'Ekspertizli kurumsal 2. el ve sıfır araçlar',
    platforms: [
      { id: 'arabam', name: 'Arabam.com', category: 'Otomotiv', description: 'Türkiye’nin Araç Pazarı & Trink Sat', popular: true },
      { id: 'vavacars', name: 'VavaCars', category: 'Otomotiv', description: 'Garantili Ekspertizli 2. El Araç', popular: true },
      { id: 'borusannext', name: 'Borusan Next', category: 'Otomotiv', description: 'Premium 2. El Araçlar (BMW/MINI)' },
      { id: 'dogusoto', name: 'Doğuş Oto', category: 'Otomotiv', description: 'Yetkili Satış/Servis & DOD Güvencesi' },
      { id: 'otokoc', name: 'Otokoç İkinci El', category: 'Otomotiv', description: 'Koç Holding Güvenceli 2. El Araç' },
      { id: 'carvak', name: 'Carvak', category: 'Otomotiv', description: 'Kavak Güvencesiyle Sertifikalı Araç' }
    ]
  },
  {
    category: 'Emlak & Konut',
    iconName: 'Building2',
    description: 'Satılık ve kiralık konut, arsa, ticari gayrimenkul',
    platforms: [
      { id: 'hepsiemlak', name: 'Hepsiemlak', category: 'Emlak', description: 'Kurumsal ve Bireysel Emlak Portalı', popular: true },
      { id: 'emlakjet', name: 'Emlakjet', category: 'Emlak', description: 'Yapay Zeka Destekli Emlak Arama', popular: true },
      { id: 'zingat', name: 'Zingat', category: 'Emlak', description: 'Bölge Raporlu Emlak İlanları' }
    ]
  },
  {
    category: 'Yapı Market, Ev & Dekorasyon',
    iconName: 'Home',
    description: 'Mobilya, hırdavat, aydınlatma ve ev geliştirme',
    platforms: [
      { id: 'koctas', name: 'Koçtaş', category: 'Ev & Yapı Market', description: 'Ev Geliştirme & Yapı Marketi', popular: true },
      { id: 'ikea', name: 'IKEA Türkiye', category: 'Ev & Yapı Market', description: 'Demonte Mobilya & Ev Aksesuarı', popular: true },
      { id: 'bauhaus', name: 'Bauhaus', category: 'Ev & Yapı Market', description: 'Atölye, Bahçe & Yapı Marketi' },
      { id: 'vivense', name: 'Vivense', category: 'Ev & Yapı Market', description: 'İç Mimar Destekli Mobilya' },
      { id: 'evidea', name: 'Evidea', category: 'Ev & Yapı Market', description: 'Ev Tekstili, Mutfak & Züccaciye' },
      { id: 'enzahome', name: 'Enza Home', category: 'Ev & Yapı Market', description: 'Modern Mobilya & Yatak' },
      { id: 'tekzen', name: 'Tekzen', category: 'Ev & Yapı Market', description: 'Yapı Market & Bahçe' }
    ]
  },
  {
    category: 'Gıda Market, Hızlı Teslimat & Yemek Siparişi',
    iconName: 'UtensilsCrossed',
    description: 'Dakikalar içinde market ve sıcak yemek siparişi',
    platforms: [
      { id: 'getir', name: 'Getir (GetirBüyük & GetirYemek)', category: 'Gıda & Yemek', description: 'Ultra Hızlı Teslimat & Restoranlar', popular: true },
      { id: 'yemeksepeti', name: 'Yemeksepeti (Mahalle & Banabi)', category: 'Gıda & Yemek', description: 'Yemek & Mahalle Esnafı', popular: true },
      { id: 'trendyolgo', name: 'Trendyol Go', category: 'Gıda & Yemek', description: 'Hızlı Market & Sıcak Yemek' },
      { id: 'migros', name: 'Migros Sanal Market (Migros Hemen)', category: 'Gıda & Yemek', description: 'Süpermarket & Money Kampanyaları', popular: true },
      { id: 'carrefoursa', name: 'CarrefourSA Online', category: 'Gıda & Yemek', description: 'CarrefourSA Taze Gıda & Market' },
      { id: 'a101', name: 'A101 Kapıda', category: 'Gıda & Yemek', description: 'Uygun Fiyatlı Haftalık Market' },
      { id: 'sok', name: 'Cepte Şok', category: 'Gıda & Yemek', description: 'Şok Market Ücretsiz Kapıda Teslimat' },
      { id: 'tiklagelsin', name: 'Tıkla Gelsin', category: 'Gıda & Yemek', description: 'Restoran Zincirleri Hızlı Sipariş' }
    ]
  },
  {
    category: 'Giyim, Moda & Ayakkabı',
    iconName: 'Shirt',
    description: 'Tekstil, sokak modası ve spor giyim mağazaları',
    platforms: [
      { id: 'boyner', name: 'Boyner', category: 'Giyim & Moda', description: 'Çok Katlı Mağazacılık & Markalar', popular: true },
      { id: 'beymen', name: 'Beymen', category: 'Giyim & Moda', description: 'Lüks Moda, Tasarımcı Ürünleri & Club' },
      { id: 'lcwaikiki', name: 'LC Waikiki', category: 'Giyim & Moda', description: 'Ulaşılabilir Moda & Aile Giyimi', popular: true },
      { id: 'defacto', name: 'DeFacto', category: 'Giyim & Moda', description: 'Trend Günlük Giyim' },
      { id: 'koton', name: 'Koton', category: 'Giyim & Moda', description: 'Sezonluk Trend Koleksiyonlar' },
      { id: 'flo', name: 'FLO', category: 'Giyim & Moda', description: 'Ayakkabı, Çanta & Aksesuar' },
      { id: 'sneaksup', name: 'Sneaks Up', category: 'Giyim & Moda', description: 'Sneaker & Sokak Modası' },
      { id: 'barcin', name: 'Barçın Spor', category: 'Giyim & Moda', description: 'Orijinal Spor Ayakkabı & Ekipman' },
      { id: 'dalkilic', name: 'Dalkılıç Spor', category: 'Giyim & Moda', description: 'Outdoor & Spor Malzemeleri' },
      { id: 'morhipo', name: 'Morhipo', category: 'Giyim & Moda', description: 'Moda & Yaşam Fırsatları' }
    ]
  },
  {
    category: 'Kitap, Hobi, Kırtasiye & Eğlence',
    iconName: 'BookOpen',
    description: 'Yayınlar, hobi ürünleri, plaklar ve kırtasiye',
    platforms: [
      { id: 'dr', name: 'D&R', category: 'Kitap & Hobi', description: 'Kitap, Müzik, Film & Elektronik Hobi', popular: true },
      { id: 'kitapyurdu', name: 'Kitapyurdu', category: 'Kitap & Hobi', description: 'Geniş Kitap Kataloğu & Puan Kataloğu', popular: true },
      { id: 'bkmkitap', name: 'BKM Kitap', category: 'Kitap & Hobi', description: 'Uygun Fiyatlı Kitap & Kırtasiye' },
      { id: 'idefix', name: 'İdefix', category: 'Kitap & Hobi', description: 'Kültür & Sanat Pazaryeri' },
      { id: 'nezih', name: 'Nezih', category: 'Kitap & Hobi', description: 'Kırtasiye, Kitap & Oyuncak' },
      { id: 'pandora', name: 'Pandora', category: 'Kitap & Hobi', description: 'Akademik & Yabancı Dilde Kitaplar' }
    ]
  },
  {
    category: 'Kozmetik & Kişisel Bakım',
    iconName: 'Sparkles',
    description: 'Parfüm, dermokozmetik ve kişisel bakım',
    platforms: [
      { id: 'gratis', name: 'Gratis', category: 'Kozmetik', description: 'Kişisel Bakım & Gratis Kart Kampanyaları', popular: true },
      { id: 'watsons', name: 'Watsons', category: 'Kozmetik', description: 'Güzellik & Sağlık Ürünleri', popular: true },
      { id: 'rossmann', name: 'Rossmann', category: 'Kozmetik', description: 'Alman Kalitesi Bakım & Organik Ürünler' },
      { id: 'sephora', name: 'Sephora Türkiye', category: 'Kozmetik', description: 'Prestij Parfüm & Makyaj Markaları' },
      { id: 'yvesrocher', name: 'Yves Rocher', category: 'Kozmetik', description: 'Bitkisel Kozmetik & Cilt Bakımı' }
    ]
  },
  {
    category: 'Anne, Bebek & Çocuk',
    iconName: 'Baby',
    description: 'Bebek arabaları, oto koltuğu, mama ve tekstil',
    platforms: [
      { id: 'ebebek', name: 'ebebek', category: 'Anne & Bebek', description: 'Anne Bebek Dünyası & Bebeveyn Kulübü', popular: true },
      { id: 'joker', name: 'Joker', category: 'Anne & Bebek', description: 'Bebek Gereçleri & Oyuncak' },
      { id: 'civilim', name: 'Civilim', category: 'Anne & Bebek', description: 'Çocuk Giyimi & Bebek İhtiyaçları' }
    ]
  },
  {
    category: 'Petshop & Evcil Hayvan Ürünleri',
    iconName: 'PawPrint',
    description: 'Kedi, köpek maması, kum ve veteriner ürünleri',
    platforms: [
      { id: 'petlebi', name: 'Petlebi', category: 'Petshop', description: 'Orijinal Mama Garantisi & Hızlı Kargo', popular: true },
      { id: 'kolaymama', name: 'Kolay Mama', category: 'Petshop', description: 'Taze Mama & Evcil Hayvan İhtiyaçları' },
      { id: 'iyimama', name: 'İyimama', category: 'Petshop', description: 'Kedi/Köpek Maması & Konserveler' },
      { id: 'petihtiyac', name: 'Petihtiyac', category: 'Petshop', description: 'Evcil Hayvan Aksesuarları & Mama' },
      { id: 'juenpet', name: 'Juen Pet Market', category: 'Petshop', description: 'Akvaryum, Kuş & Pet Malzemeleri' }
    ]
  }
];

// Flat array of all platform names
export const ALL_PLATFORM_NAMES: string[] = TURKISH_PLATFORM_GROUPS.flatMap(g => 
  g.platforms.map(p => p.name)
);

export const TOTAL_PLATFORMS_COUNT = ALL_PLATFORM_NAMES.length;
