import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Zap, 
  SlidersHorizontal, 
  Sliders, 
  Power, 
  RotateCw, 
  Trash2, 
  Send, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Mail,
  Copy,
  Check
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRuleDrawer?: () => void;
  onOpenPlatformSettings?: () => void;
  onOpenTelegramModal?: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenRuleDrawer,
  onOpenPlatformSettings,
  onOpenTelegramModal
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('haberverbana_has_seen_guide', 'true');
    }
    onClose();
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('destek@haberverbana.app');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div 
      id="user-guide-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div 
        id="user-guide-modal-container"
        className="bg-[#0F0F0F] border border-white/15 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-gradient-to-r from-red-950/40 via-[#140808] to-[#0F0F0F]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 border border-red-500/40 flex items-center justify-center text-white shadow-lg shadow-red-950/50 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Kullanım Kılavuzu & Hızlı Başlangıç
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-600/20 text-red-400 border border-red-500/30 font-bold">
                  Rehber
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                haberverbana.app ile fırsatları yakalamanın ve sistemi kendinize uyarlamanın en kolay yolu.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-white/80 leading-relaxed font-sans">
          
          {/* Section 1: Temel Amaç */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>1. Temel Amaç: "Sen Arama, O Haber Versin"</span>
            </div>
            <p className="text-white/90 leading-relaxed text-xs italic font-medium bg-red-950/20 p-2.5 rounded-xl border border-red-500/20 text-red-200">
              "Hep ihmal ettiğiniz bir ihtiyacınızı belki HaberVerbanaAPP 100'e yakın sitede yaptığı düzenli fırsat taramalarıyla en uygun koşul ve fiyatlarla karşınıza çıkaracak."
            </p>
            <p className="text-white/75 leading-relaxed text-xs">
              <strong>haberverbana.app</strong>, ikinci el ve popüler e-ticaret sitelerindeki (Sahibinden, Letgo, Dolap, Amazon, Trendyol, Hepsiburada vb.) anormal fiyat düşüşlerini, dip fiyatları ve gizli fırsatları 7/24 yapay zeka destekli radarıyla tarar. Sizin yerinize piyasa fiyat ortalamalarını hesaplar, risk faktörlerini inceler ve sadece gerçek fırsatları tek bir canlı akışta ve Telegram üzerinden size ulaştırır.
            </p>
          </div>

          {/* Section 2: Uygulamayı Kendinize Göre Nasıl Kişiselleştirirsiniz? */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-red-500" />
              <span>2. Uygulamayı Kendiniz İçin Nasıl Kişiselleştirirsiniz?</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/20 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-red-400 font-bold text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center text-[11px] font-mono font-bold">1</span>
                    Özel Radar Talebi Oluşturun
                  </span>
                  {onOpenRuleDrawer && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenRuleDrawer();
                      }}
                      className="text-[10px] text-red-400 hover:text-red-300 font-bold underline underline-offset-2 cursor-pointer"
                    >
                      [Talep Ekle]
                    </button>
                  )}
                </div>
                <p className="text-white/70 text-[11px]">
                  Üst menüdeki <strong>"+ Yeni Talep"</strong> butonuna tıklayarak aradığınız ürünün adını (örn. <em>"MacBook Air M3"</em>, <em>"2023 Tesla Model Y"</em>, <em>"Dyson V15"</em>), maksimum bütçenizi ve kaçınmak istediğiniz negatif kelimeleri (<em>"ağır hasarlı", "teşhir"</em>) belirleyin. Radar sizin kriterlerinize uyan ilanları anında yakalar.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/20 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[11px] font-mono font-bold">2</span>
                    Platform & Site Tercihleri
                  </span>
                  {onOpenPlatformSettings && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPlatformSettings();
                      }}
                      className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline underline-offset-2 cursor-pointer"
                    >
                      [Ayarlar]
                    </button>
                  )}
                </div>
                <p className="text-white/70 text-[11px]">
                  Üst durum çubuğundaki <strong>[Ayarlar]</strong> butonunu kullanarak radarın yalnızca ilgilendiğiniz siteleri (sadece Sahibinden, sadece Trendyol vb.) taramasını sağlayabilir veya yapay zekanın 100'e yakın alışveriş ve ilan mecrasını otomatik olarak taramasına izin verebilirsiniz.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/20 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-mono font-bold">3</span>
                    Radarı İstediğinizde Duraklatın
                  </span>
                  <span className="text-[10px] text-emerald-400/80 font-mono">Radar Aç/Kapat</span>
                </div>
                <p className="text-white/70 text-[11px]">
                  Çok fazla bildirim veya kafa karışıklığı istemediğinizde akış başlığındaki veya üst bardaki <strong>"Radarı Kapat"</strong> butonuna basarak taramayı duraklatabilirsiniz. İncelemek istediğinizde dilediğiniz an tek tıkla yeniden açabilirsiniz.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/20 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[11px] font-mono font-bold">4</span>
                    İstemediğiniz İlanları Kaldırın
                  </span>
                  <span className="text-[10px] text-rose-400/80 font-mono">Tek Tıkla Gizle</span>
                </div>
                <p className="text-white/70 text-[11px]">
                  İlginizi çekmeyen veya görmek istemediğiniz bir fırsat kartının altındaki <strong>"Kaldır"</strong> seçeneğine tıklayarak onu akışınızdan tamamen gizleyebilirsiniz. Yanlışlıkla sildiklerinizi üstteki çubuktan tek tıkla geri getirebilirsiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Akış Yönetimi & İlan Linkleri */}
          <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>3. Akış Sıralaması & İlanlara Erişim Hakkında Bilgi</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-white/70 list-disc list-inside">
              <li>
                <strong>Fırsatları Döndür:</strong> Sayfanın en üstünde sürekli aynı ilan kalmasın diye akış dinamik olarak döner. Farklı sıcak fırsatları yukarı taşımak için <strong>"Fırsatları Döndür"</strong> butonuna basabilirsiniz.
              </li>
              <li>
                <strong>İlana Gitme / Yeni Sekmede Aç:</strong> Fırsat kartının altındaki <em>"Yeni Sekmede Aç"</em> butonu sizi ilgili platformdaki canlı arama ve ilan sayfasına yönlendirir.
              </li>
              <li>
                <strong>Link Kopyalama Kolaylığı:</strong> Tarayıcı önizleme modu veya pop-up engelleyiciler nedeniyle harici site yeni sekmede açılmazsa, karttaki üç nokta menüsünden <strong>"Bağlantıyı Kopyala"</strong> seçeneğini kullanabilirsiniz.
              </li>
            </ul>
          </div>

          {/* Section 4: Telegram & Destek */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#229ED9]/10 via-[#0E1B26] to-[#0F0F0F] border border-[#229ED9]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#229ED9]/20 border border-[#229ED9]/30 flex items-center justify-center text-[#229ED9] shrink-0">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Telefonunuza Telegram Canlı Sinyal Kurulumu
                </h4>
                <p className="text-[11px] text-white/70">
                  Bilgisayar başında olmasanız bile radar kriterlerinize uyan bir fırsat çıktığında telefonunuza anında uyarı gelir.
                </p>
              </div>
            </div>
            {onOpenTelegramModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTelegramModal();
                }}
                className="px-3.5 py-1.5 bg-[#229ED9] hover:bg-[#229ED9]/90 text-white rounded-full text-xs font-bold transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
              >
                Telegram Kur
              </button>
            )}
          </div>

          {/* Section 5: Destek İletişim Bilgisi */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-400 shrink-0" />
              <div className="text-[11px]">
                <span className="text-white font-bold">Sorularınız veya Önerileriniz İçin Destek E-postası: </span>
                <span className="text-red-400 font-mono font-semibold">destek@haberverbana.app</span>
                <span className="text-white/40 block text-[10px]">
                  (Resmi destek kutumuz aktif edilme sürecindedir; her türlü geri bildiriminiz dikkatle değerlendirilir.)
                </span>
              </div>
            </div>
            <button
              onClick={handleCopyEmail}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="E-posta adresini kopyala"
            >
              {copiedEmail ? (
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

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0A0A0A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-white/60 hover:text-white select-none">
            <input 
              type="checkbox" 
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-black/40 text-red-600 focus:ring-0 focus:outline-none cursor-pointer"
            />
            <span>Bu kılavuzu bir daha başlangıçta otomatik gösterme</span>
          </label>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-full shadow-lg shadow-red-950/50 transition-all active:scale-95 cursor-pointer"
            >
              Anladım, Keşfetmeye Başla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
