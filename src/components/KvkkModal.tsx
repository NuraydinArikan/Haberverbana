import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Database, 
  UserCheck, 
  Mail, 
  FileText, 
  Trash2, 
  Copy, 
  Check 
} from 'lucide-react';

interface KvkkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearLocalData?: () => void;
}

export const KvkkModal: React.FC<KvkkModalProps> = ({
  isOpen,
  onClose,
  onClearLocalData
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [dataCleared, setDataCleared] = useState(false);

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

  const handleClearData = () => {
    if (window.confirm('Tarayıcınızda kayıtlı tüm radar kuralları, favoriler ve kişiselleştirilmiş ayarlar silinecektir. Devam etmek istiyor musunuz?')) {
      if (onClearLocalData) {
        onClearLocalData();
      } else {
        localStorage.clear();
      }
      setDataCleared(true);
      setTimeout(() => setDataCleared(false), 3000);
    }
  };

  return (
    <div 
      id="kvkk-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="kvkk-modal-container"
        className="bg-[#0F0F0F] border border-white/15 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-gradient-to-r from-emerald-950/30 via-[#0B1511] to-[#0F0F0F]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/40 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  KVKK & Gizlilik Aydınlatma Metni
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  6698 Sayılı Kanun
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                Kişisel verilerinizin korunması, gizlilik standartlarımız ve yasal haklarınız hakkında bilgilendirme.
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

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-white/80 leading-relaxed font-sans">
          
          {/* Giriş & Veri Sorumlusu */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>1. Veri Sorumlusu</span>
            </h3>
            <p className="text-white/75 leading-relaxed">
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, <strong>haberverbana.app</strong> platformu olarak kişisel verilerinizin gizliliğine ve güvenliğine en üst düzeyde önem vermekteyiz. Veri sorumlusu sıfatıyla tarafımızla iletişime geçmek için resmi irtibat kanalımız:
            </p>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/10">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-400" />
                <span className="font-mono text-red-400 font-bold">destek@haberverbana.app</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/60" />}
                <span>{copiedEmail ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
          </div>

          {/* Hangi Veriler İşlenir? */}
          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>2. İşlenen Veriler ve "Yerel Saklama" Prensibi</span>
            </h3>
            <p className="text-white/75 leading-relaxed">
              haberverbana.app, kullanıcı gizliliğini temel alan bir mimariyle tasarlanmıştır. Uygulama içerisinde oluşturduğunuz:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-white/70 pl-2">
              <li><strong>Radar Takip Kuralları:</strong> Aradığınız ürün adları, bütçe aralıkları, pozitif ve negatif anahtar kelimeler.</li>
              <li><strong>Platform Tercihleri:</strong> Hangi pazar yerlerini ve ilan sitelerini takip etmek istediğiniz.</li>
              <li><strong>Kişiselleştirme Ayarları:</strong> Favorilediğiniz ilanlar, daha sonra incelemek üzere kaydettikleriniz ve akıştan gizlediğiniz fırsatlar.</li>
              <li><strong>Tema ve Kontrast Seçimleri:</strong> Midnight veya Yüksek Kontrast tercihleriniz.</li>
            </ul>
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
              <strong>Önemli Güvence:</strong> Yukarıda belirtilen tercihleriniz merkezi bir sunucuda profil oluşturmak amacıyla saklanmaz; yalnızca sizin tarayıcınızın yerel depolama alanında (LocalStorage) tutulur. Tarayıcınızı temizlediğinizde tüm veriler silinir.
            </div>
          </div>

          {/* Veri İşleme Amaçları */}
          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>3. Kişisel Verilerin İşlenme Amaçları</span>
            </h3>
            <p className="text-white/75 leading-relaxed">
              Verileriniz yalnızca aşağıdaki meşru amaçlar kapsamında işlenmektedir:
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/70 pl-2">
              <li>Belirlediğiniz kriterlere uygun fiyat düşüşü ve fırsat ilanlarını filtrelemek ve size sunmak,</li>
              <li>Kullanıcı arayüzünü her girişinizde yeniden yapılandırmak zorunda kalmamanızı sağlamak,</li>
              <li>Telegram botu simülasyonu veya bildirim taleplerinizi yerine getirmek,</li>
              <li>Sistem performansını, arama doğruluğunu ve kullanıcı deneyimini iyileştirmek.</li>
            </ul>
          </div>

          {/* Verilerin Aktarımı & Ticari Satış Yasağı */}
          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>4. Veri Aktarımı ve Üçüncü Taraflar</span>
            </h3>
            <p className="text-white/75 leading-relaxed">
              haberverbana.app, kişisel verilerinizi hiçbir surette reklam şirketlerine, veri simsarlarına veya üçüncü şahıslara <strong>satmaz, kiralamaz veya ticari amaçla devretmez</strong>. Fırsat linklerine tıkladığınızda açılan e-ticaret siteleri kendi bağımsız gizlilik politikalarına tabidir.
            </p>
          </div>

          {/* KVKK Madde 11 Kapsamındaki Haklarınız */}
          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-400" />
              <span>5. KVKK Madde 11 Kapsamındaki Haklarınız</span>
            </h3>
            <p className="text-white/75 leading-relaxed">
              KVKK'nın 11. maddesi uyarınca veri sahibi olarak;
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/70 pl-2">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme,</li>
              <li>Verilerin silinmesini veya yok edilmesini talep etme hakkına sahipsiniz.</li>
            </ul>
          </div>

          {/* Tek Tıkla Verileri Temizleme Bölümü */}
          <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Tek Tıkla Tüm Verileri Cihazınızdan Silin</span>
              </h4>
              <p className="text-[11px] text-white/70 mt-0.5">
                haberverbana.app tarafından tarayıcınızda tutulan tüm yerel ayarları ve kuralları tek hamlede sıfırlayabilirsiniz.
              </p>
              {dataCleared && (
                <span className="text-[11px] text-emerald-400 font-bold block mt-1">
                  ✓ Tüm yerel veriler başarıyla temizlendi!
                </span>
              )}
            </div>
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Verilerimi Temizle
            </button>
          </div>

          {/* İletişim */}
          <div className="text-[11px] text-white/50 border-t border-white/10 pt-4">
            Her türlü soru, görüş ve KVKK kapsamındaki talepleriniz için lütfen <strong className="text-white">destek@haberverbana.app</strong> adresi üzerinden bizimle iletişime geçiniz.
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0A0A0A] flex items-center justify-between">
          <span className="text-[11px] text-white/40 font-mono">
            Son Güncelleme: Mart 2026 • KVKK Uyumlu
          </span>
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
