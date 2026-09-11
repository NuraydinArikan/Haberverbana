import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  ExternalLink, 
  Mail, 
  Copy, 
  Check, 
  Sparkles, 
  SlidersHorizontal,
  Power,
  RotateCw,
  Send,
  ShieldCheck
} from 'lucide-react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRuleDrawer?: () => void;
  onOpenTelegramModal?: () => void;
  onOpenGuide?: () => void;
  onOpenKvkk?: () => void;
}

interface FaqItem {
  id: string;
  category: 'Genel' | 'İlanlar & Linkler' | 'Kişiselleştirme' | 'Bildirimler & Güvenlik';
  question: string;
  answer: React.ReactNode;
}

export const FaqModal: React.FC<FaqModalProps> = ({
  isOpen,
  onClose,
  onOpenRuleDrawer,
  onOpenTelegramModal,
  onOpenGuide,
  onOpenKvkk
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [expandedId, setExpandedId] = useState<string | null>('faq-link-issue');
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('destek@haberverbana.app');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback
    }
  };

  const faqItems: FaqItem[] = [
    {
      id: 'faq-link-issue',
      category: 'İlanlar & Linkler',
      question: 'Fırsat linklerine tıkladığımda ilana neden bazen ulaşılamıyor veya sayfa açılamıyor?',
      answer: (
        <div className="space-y-3 text-white/80 text-xs leading-relaxed">
          <p>
            Fırsat ilanlarına tıklarken yaşanan durumların birkaç temel teknik ve sektörel sebebi bulunmaktadır:
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-amber-400 block mb-1">1. İkinci El İlanların Çok Hızlı Satılması:</strong>
              <span>
                Özellikle Sahibinden, Letgo, Dolap gibi platformlarda piyasa değerinin belirgin altında listelenen dip fiyatlı ürünler çoğunlukla dakikalar içinde satılır. İlan sahibi ürünü sattığında veya rezerve ettiğinde platform ilanı anında yayından kaldırır ve <em>"Bu ilan artık yayında değildir"</em> veya 404 uyarısı çıkar.
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-cyan-400 block mb-1">2. Platform Güvenlik & Bot Korumaları (Cloudflare / PerimeterX):</strong>
              <span>
                Sahibinden, Arabam ve bazı büyük pazar yerleri harici web uygulamalarından gelen yönlendirmeleri (referrer) bot taraması sanarak engelleyebilir veya ana sayfaya / robot doğrulama sayfasına yönlendirebilir.
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-emerald-400 block mb-1">3. Tarayıcı Önizleme (iFrame) Kısıtlamaları:</strong>
              <span>
                Uygulama bir önizleme penceresinde (iframe) çalışırken bazı tarayıcılar güvenlik gerekçesiyle harici pop-up sekmeleri engelleyebilir.
              </span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 text-white/90">
            <strong className="text-red-400 block mb-1">💡 Çözümümüz & En Kolay Erişim Yolu:</strong>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-white/80">
              <li>Uygulamamızdaki linkler sizi doğrudan o ürünün kaynak sitedeki <strong>en güncel canlı arama sonuçlarına</strong> yönlendirir; böylece bir ilan kapansa bile aynı modelin o anki diğer ilanlarını anında görürsünüz.</li>
              <li>Eğer tarayıcınız yeni sekmeyi engellerse, kartın menüsündeki <strong>"Bağlantıyı Kopyala"</strong> butonuna basıp linki tarayıcınızın adres çubuğuna yapıştırabilirsiniz.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'faq-what-is',
      category: 'Genel',
      question: 'haberverbana.app nedir ve temel amacı nedir?',
      answer: (
        <div className="space-y-2 text-white/80 text-xs leading-relaxed">
          <p>
            <strong>haberverbana.app</strong> ("Sen Arama, O Haber Versin"), alışveriş ve ikinci el platformlarındaki yüz binlerce ilanı tek tek gezmek zorunda kalmamanız için geliştirilmiş yapay zeka destekli bir fırsat radarıdır.
          </p>
          <p>
            Belirlediğiniz marka, model ve bütçe kriterlerine göre piyasayı 7/24 tarar; yapay zeka ile emsal piyasa fiyatını hesaplar, fırsat skorunu belirler ve telefonunuza/ekranınıza sıcak fırsat bildirimi gönderir.
          </p>
        </div>
      )
    },
    {
      id: 'faq-custom-rule',
      category: 'Kişiselleştirme',
      question: 'Sadece kendi belirlediğim özel bir ürün (örn. iPhone 15 Pro veya Karavan) için nasıl alarm kurabilirim?',
      answer: (
        <div className="space-y-2 text-white/80 text-xs leading-relaxed">
          <p>
            Üst menüdeki <strong>"+ Yeni Talep"</strong> butonuna tıklayarak saniyeler içinde özel radar kuralı oluşturabilirsiniz:
          </p>
          <ul className="list-disc list-inside space-y-1 text-white/70 pl-2">
            <li><strong>Arama Kelimesi:</strong> Aradığınız ürünün tam adını yazın (örn: "MacBook Air M3 16GB" veya "Tesla Model Y").</li>
            <li><strong>Maksimum Bütçe:</strong> Alabileceğiniz en yüksek fiyatı belirleyin.</li>
            <li><strong>Negatif Filtreler:</strong> "ağır hasarlı", "teşhir", "kutusu açık" gibi görmek istemediğiniz kelimeleri yazarak kusurlu ürünleri otomatik eleyin.</li>
            <li><strong>Bildirim Kanalı:</strong> Telegram veya E-posta kanalını seçin.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'faq-dismiss-deal',
      category: 'Kişiselleştirme',
      question: 'İstemediğim veya ilgimi çekmeyen ürün önerilerini akıştan nasıl kaldırabilirim?',
      answer: (
        <div className="space-y-2 text-white/80 text-xs leading-relaxed">
          <p>
            Her fırsat kartının altındaki hızlı işlem çubuğunda ve kartın sağ üst köşesindeki üç nokta menüsünde <strong>"Kaldır"</strong> seçeneği mevcuttur.
          </p>
          <p>
            Bu butona bastığınızda o fırsat önerisi akışınızdan tamamen gizlenir. Yanlışlıkla sildiğiniz fırsatları geri getirmek isterseniz, akışın üzerinde otomatik beliren <em>"Kaldırılanları Geri Getir"</em> butonuna tıklamanız yeterlidir.
          </p>
        </div>
      )
    },
    {
      id: 'faq-pause-radar',
      category: 'Kişiselleştirme',
      question: 'Fırsat Radarını geçici olarak kapatabilir veya duraklatabilir miyim?',
      answer: (
        <div className="space-y-2 text-white/80 text-xs leading-relaxed">
          <p>
            Evet! Akışın başlığında ve en üst durum çubuğunda bulunan <strong>"Radarı Kapat" / "Radarı Aç"</strong> butonuyla taramayı tek tıkla duraklatabilirsiniz.
          </p>
          <p>
            Radar kapatıldığında otomatik tarama dondurulur, yeni bildirim gelmez ve kafa karışıklığı önlenir. İncelemek istediğinizde dilediğiniz an tek tıkla radarı yeniden başlatabilirsiniz.
          </p>
        </div>
      )
    },
    {
      id: 'faq-rotate-deals',
      category: 'İlanlar & Linkler',
      question: 'En üstte hep aynı fırsatlar kalmasın istiyorum, nasıl değiştirebilirim?',
      answer: (
        <div className="space-y-2 text-white/80 text-xs leading-relaxed">
          <p>
            Akış başlığındaki <strong>"Fırsatları Döndür"</strong> butonuna tıklayarak farklı sıcak fırsatların en üste gelmesini sağlayabilirsiniz.
          </p>
          <p>
            Ayrıca sıralama açılır menüsünden <strong>"✨ Dinamik Döngü"</strong> modunu seçtiğinizde sistem düzenli aralıklarla en üstteki fırsatları yenileyerek her zaman taze öneriler sunar.
          </p>
        </div>
      )
    },
    {
      id: 'faq-opportunity-score',
      category: 'Genel',
      question: 'Fırsat Skoru (1-10) nasıl hesaplanıyor?',
      answer: (
        <div className="space-y-2 text-white/80 text-xs leading-relaxed">
          <p>
            Fırsat skoru; ilgili kategorideki son 90 günlük piyasa fiyat ortalaması, anlık indirim yüzdesi, satıcının güvenilirlik puanı ve negatif kriterlerden (hasar, teşhir, kusur) arınmışlık düzeyi yapay zeka tarafından harmanlanarak 1 ile 10 arasında bir puan olarak belirlenir.
          </p>
          <p>
            8.0 ve üzeri skorlar <strong>"Kaçırılmayacak Fırsat"</strong> rozeti alır.
          </p>
        </div>
      )
    },
    {
      id: 'faq-telegram',
      category: 'Bildirimler & Güvenlik',
      question: 'Telegram bildirimlerini telefonuma nasıl bağlayabilirim?',
      answer: (
        <div className="space-y-2 text-white/80 text-xs leading-relaxed">
          <p>
            Üst menüdeki <strong>"Telegram"</strong> butonuna tıklayarak simülasyon ve canlı bot bağlantı talimatlarını görebilirsiniz.
          </p>
          <p>
            Kriterlerinize uyan bir fırsat tespit edildiğinde bot tarafından Telegram kanalınıza ürünün adı, güncel fiyatı, piyasa ortalaması ve doğrudan linki anlık mesaj olarak iletilir.
          </p>
        </div>
      )
    },
    {
      id: 'faq-kvkk',
      category: 'Bildirimler & Güvenlik',
      question: 'Kişisel verilerim kaydediliyor mu? KVKK kapsamında güvende miyim?',
      answer: (
        <div className="space-y-2 text-white/80 text-xs leading-relaxed">
          <p>
            Tamamen güvendesiniz. haberverbana.app, arama kriterlerinizi ve radar tercihlerinizi merkezi bir sunucuda profil oluşturmak amacıyla saklamaz.
          </p>
          <p>
            Tüm tercihleriniz tarayıcınızın kendi güvenli yerel depolama alanında (LocalStorage) tutulur ve hiçbir üçüncü şahısla paylaşılmaz veya satılmaz. Ayrıntılı bilgi için alt menüdeki <strong>"KVKK & Gizlilik"</strong> bağlantısını inceleyebilirsiniz.
          </p>
        </div>
      )
    },
    {
      id: 'faq-contact',
      category: 'Genel',
      question: 'Soru, öneri veya iş birliği için nasıl iletişime geçebilirim?',
      answer: (
        <div className="space-y-2 text-white/80 text-xs leading-relaxed">
          <p>
            Her türlü soru, teknik destek veya öneriniz için resmi kurumsal iletişim adresimiz:
          </p>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2 font-mono text-red-400 font-bold text-xs">
              <Mail className="w-4 h-4" />
              <span>destek@haberverbana.app</span>
            </div>
            <button
              onClick={handleCopyEmail}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/60" />}
              <span>{copiedEmail ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>
          <p className="text-[11px] text-white/50 italic">
            (E-posta kutumuz aktif edilme sürecindedir; iletileriniz kayıt altına alınarak en kısa sürede yanıtlanır.)
          </p>
        </div>
      )
    }
  ];

  const filteredFaqs = faqItems.filter((item) => {
    const matchesCat = selectedCategory === 'Tümü' || item.category === selectedCategory;
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const categories = ['Tümü', 'Genel', 'İlanlar & Linkler', 'Kişiselleştirme', 'Bildirimler & Güvenlik'];

  return (
    <div 
      id="faq-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="faq-modal-container"
        className="bg-[#0F0F0F] border border-white/15 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-gradient-to-r from-red-950/40 via-[#140A0A] to-[#0F0F0F]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-950 border border-red-500/40 flex items-center justify-center text-white shadow-lg shadow-red-950/50 shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Sık Sorulan Sorular (SSS)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-600/20 text-red-400 border border-red-500/30 font-bold">
                  Yardım & Destek
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                haberverbana.app hakkında merak edilenler, ilan linkleri ve kullanım ipuçları.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0A0A0A] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Sorularda ara (örn: link, ilan, kural, radar, telegram)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Accordion List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3 text-xs text-white/80 leading-relaxed font-sans">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <HelpCircle className="w-8 h-8 text-white/20 mx-auto" />
              <p className="text-white/60 text-xs">Aradığınız kriterde soru bulunamadı.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Tümü');
                }}
                className="text-red-400 underline underline-offset-2 text-xs font-bold"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            filteredFaqs.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div 
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded 
                      ? 'bg-[#141414] border-red-500/40 shadow-lg shadow-red-950/20' 
                      : 'bg-[#111111] border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      <span className="font-semibold text-white text-xs sm:text-sm">
                        {item.question}
                      </span>
                    </div>
                    <div className="shrink-0 text-white/40">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-red-400" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-white/5 animate-in fade-in duration-150">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Quick Contact Box */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-red-950/20 via-black to-black border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Başka bir sorunuz veya öneriniz mi var?</h4>
                <p className="text-[11px] text-white/60">
                  Resmi destek kutumuz: <strong className="text-red-400 font-mono">destek@haberverbana.app</strong>
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/60" />}
              <span>{copiedEmail ? 'Kopyalandı' : 'E-postayı Kopyala'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0A0A0A] flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-white/50">
            {onOpenGuide && (
              <button 
                onClick={() => {
                  onClose();
                  onOpenGuide();
                }}
                className="hover:text-white underline underline-offset-2 cursor-pointer"
              >
                Kullanım Kılavuzu
              </button>
            )}
            {onOpenKvkk && (
              <>
                <span>•</span>
                <button 
                  onClick={() => {
                    onClose();
                    onOpenKvkk();
                  }}
                  className="hover:text-white underline underline-offset-2 cursor-pointer"
                >
                  KVKK Metni
                </button>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-full transition-all cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
