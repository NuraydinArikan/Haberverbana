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
      { id: 'incehesap', name: 'İncehesap', category: 'Elektronik', description: 'Gaming Gecesi & İndirimli Sistemler' }
    ]
  },
  {
    category: 'Otomotiv & Araç Satışı',
    iconName: 'Car',
    description: 'Açık ilan pazaryerleri, distribütör garantili ağlar, kurumsal showroomlar ve ihale platformları',
    platforms: [
      { id: 'sahibinden_vasita', name: 'Sahibinden.com Vasıta', category: 'Otomotiv', description: 'Türkiye’nin en yüksek ilan hacmine sahip açık vasıta pazaryeri', popular: true },
      { id: 'arabam', name: 'Arabam.com', category: 'Otomotiv', description: 'Araç odaklı ilan platformu & Trink Sat anında nakit alım', popular: true },
      { id: 'araba_com', name: 'Araba.com', category: 'Otomotiv', description: 'Geleneksel alternatif açık ilan listeleme sitesi' },
      { id: 'otokoc', name: 'Otokoç 2. El (Koç Grubu)', category: 'Otomotiv', description: 'Ford, Fiat, Volvo temsilcisi kurumsal 2. el ağı', popular: true },
      { id: 'dod', name: 'DOD (Doğuş Otomotiv)', category: 'Otomotiv', description: 'VW, Audi, SEAT, Škoda 101 nokta ekspertiz garantisi', popular: true },
      { id: 'borusanotonext', name: 'Borusan Next', category: 'Otomotiv', description: 'BMW, MINI, Land Rover & Jaguar garantili premium 2. el', popular: true },
      { id: 'renault2', name: 'Renault2 (Mais)', category: 'Otomotiv', description: 'Renault & Dacia yetkili satıcıları garantili 2. el ağı', popular: true },
      { id: 'spoticar', name: 'Spoticar (Stellantis)', category: 'Otomotiv', description: 'Peugeot, Citroën, Opel, DS & Fiat ortak kurumsal ağı', popular: true },
      { id: 'toyotagaranti', name: 'Toyota Garanti', category: 'Otomotiv', description: 'Toyota Plazalarında ekspertizli garantili 2. el araçlar' },
      { id: 'volvoselekt', name: 'Volvo Selekt', category: 'Otomotiv', description: 'Fabrika standartlarında kontrol edilmiş 2. el Volvo modelleri' },
      { id: 'neziroglu', name: 'Neziroğlu Otomotiv', category: 'Otomotiv', description: '50+ yıllık güvenceyle binek ve lüks çok markalı perakendeci', popular: true },
      { id: 'koluman', name: 'Koluman 2. El', category: 'Otomotiv', description: 'Mercedes-Benz ana bayisi binek ve ticari 2. el satış kanalı' },
      { id: 'mengerler', name: 'Mengerler 2. El', category: 'Otomotiv', description: 'Mercedes-Benz ve diğer premium markaların kurumsal 2. eli' },
      { id: 'otoshops', name: 'Otoshops (Gülpar 2. El)', category: 'Otomotiv', description: 'Çok markalı kurumsal bayi ağı ve bağımsız showroomlar' },
      { id: 'vavacars', name: 'VavaCars', category: 'Otomotiv', description: 'Ekspertizli doğrudan nakit alım ve garantili stok satışı', popular: true },
      { id: 'otoplus', name: 'otoplus (letgo)', category: 'Otomotiv', description: 'letgo bünyesinde takas, doğrudan alım ve garantili satış', popular: true },
      { id: 'ikinciyeni', name: 'ikinciyeni.com', category: 'Otomotiv', description: 'Çelik Motor / Anadolu Grubu yapay zeka fiyatlamalı satış', popular: true },
      { id: 'carvak', name: 'Carvak (Kavak)', category: 'Otomotiv', description: 'Uluslararası standartta yenilenmiş ve sertifikalı 2. el' },
      { id: 'borusan_ihale', name: 'Borusan Araç İhale', category: 'Otomotiv', description: 'Filo, banka ve şirket araçları açık artırma ihale kanalı' },
      { id: 'ikinciyeni_ihale', name: 'İhale.ikinciyeni.com', category: 'Otomotiv', description: 'Bireysel ve kurumsal teklif verilebilen online açık artırma' }
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
      { id: 'tekzen', name: 'Tekzen', category: 'Ev & Yapı Market', description: 'Yapı Market & Bahçe' },
      { id: 'karaca', name: 'Karaca', category: 'Ev & Yapı Market', description: 'Mutfak, Sofra & Küçük Ev Aletleri', popular: true }
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
      { id: 'decathlon', name: 'Decathlon', category: 'Giyim & Moda', description: 'Spor Ekipmanları & Outdoor Giyim', popular: true },
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
      { id: 'pandora', name: 'Pandora', category: 'Kitap & Hobi', description: 'Akademik & Yabancı Dilde Kitaplar' },
      { id: 'avansas', name: 'Avansas', category: 'Kitap & Hobi', description: 'İşyeri, Ofis & Kırtasiye Tedariği' }
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
      { id: 'petihtiyac', name: 'Petihtiyac', category: 'Petshop', description: 'Evcil Hayvan Aksesuarları & Mama' }
    ]
  }
];

// Flat array of all platform names
export const ALL_PLATFORM_NAMES: string[] = TURKISH_PLATFORM_GROUPS.flatMap(g => 
  g.platforms.map(p => p.name)
);

export const TOTAL_PLATFORMS_COUNT = ALL_PLATFORM_NAMES.length;
