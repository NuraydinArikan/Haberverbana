import React from 'react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  Car, 
  Building 
} from 'lucide-react';

interface PricingModalProps {
  currentPlan: string;
  onSelectPlan: (planName: any) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  currentPlan,
  onSelectPlan
}) => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="px-3.5 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
          Avantajlı Üyelik Planları
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
          İhtiyacınıza Uygun Fırsat Radarı
        </h2>
        <p className="text-xs sm:text-sm text-white/60">
          İster bireysel alışverişlerinizde dip fiyatları yakalayın, ister profesyonel arbitraj ile piyasa altı portföy toplayın.
        </p>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1: Ücretsiz (Freemium) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0F0F0F] border border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-white/50 uppercase tracking-wider">
                Bireysel Başlangıç
              </span>
              <h3 className="font-serif text-xl font-bold text-white mt-1">
                Ücretsiz Plan
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Temel e-ticaret fırsatlarını keşfetmek ve radarla tanışmak için.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-mono font-bold text-white">₺0</span>
              <span className="text-xs text-white/40">/ömür boyu</span>
            </div>

            <ul className="space-y-2.5 text-xs text-white/80 pt-4 border-t border-white/10">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3 Aktif Radar Kuralı</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>30 Dakikalık Tarama Döngüsü</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>E-posta Günlük Fırsat Özeti</span>
              </li>
              <li className="flex items-center gap-2 text-white/40">
                <span>✕ 2 Dakikalık Ultra Hızlı Tarama</span>
              </li>
              <li className="flex items-center gap-2 text-white/40">
                <span>✕ Anlık Telegram Bot Alarmları</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlan('Ücretsiz')}
            className={`w-full py-3 rounded-full text-xs font-bold transition-all ${
              currentPlan === 'Ücretsiz'
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            {currentPlan === 'Ücretsiz' ? 'Mevcut Planınız' : 'Ücretsiz Kullan'}
          </button>
        </div>

        {/* Tier 2: Pro Fırsat Avcısı (POPULAR) */}
        <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-red-950/30 to-[#0F0F0F] border border-red-500/40 flex flex-col justify-between space-y-6 shadow-2xl shadow-red-950/40">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-600 text-white rounded-full text-[10px] font-mono uppercase font-bold tracking-wider shadow-lg">
            En Çok Tercih Edilen
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Süper Hızlı Radar
              </span>
              <h3 className="font-serif text-xl font-bold text-white mt-1">
                Pro Fırsat Avcısı
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Stok bitmeden önce ilk dakikasında haberdar olun.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-mono font-bold text-white">₺149</span>
              <span className="text-xs text-white/40">/aylık</span>
            </div>

            <ul className="space-y-2.5 text-xs text-white/90 pt-4 border-t border-white/10">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-red-400 shrink-0" />
                <strong className="text-white">2-5 Dakikalık Ultra Hızlı Tarama</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-red-400 shrink-0" />
                <span>Sınırsız Radar Kuralı Ekleme</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-red-400 shrink-0" />
                <strong className="text-[#229ED9]">Anlık Telegram Bot & Sesli Bildirim</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-red-400 shrink-0" />
                <span>Gemini 2.5 Flash Derin Fırsat Analizi</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-red-400 shrink-0" />
                <span>Chrome Eklentisi Tam Entegrasyonu</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlan('Pro Fırsat Avcısı')}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold shadow-lg shadow-red-950/50 active:scale-95 transition-all"
          >
            {currentPlan === 'Pro Fırsat Avcısı' ? 'Mevcut Planınız' : 'Pro Pakete Geç'}
          </button>
        </div>

        {/* Tier 3: B2B Arbitraj & İhale Radarı */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0F0F0F] border border-purple-500/30 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                Kurumsal & Ticaret
              </span>
              <h3 className="font-serif text-xl font-bold text-white mt-1">
                B2B Arbitraj Radarı
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Oto galeriler, gayrimenkul ve arbitraj tüccarları için.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-mono font-bold text-white">₺990</span>
              <span className="text-xs text-white/40">/aylık</span>
            </div>

            <ul className="space-y-2.5 text-xs text-white/80 pt-4 border-t border-white/10">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <strong className="text-white">1 Dakikalık Stealth Tarayıcı Motoru</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Vasıta Ekspertiz & Tramer Filtreleme</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Emlak m² Birim Fiyat Arbitraj Alarmı</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>WebHook & Özel API Erişimi</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>WhatsApp VIP Bildirim Hattı</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlan('B2B Arbitraj')}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs font-bold transition-all shadow-md"
          >
            {currentPlan === 'B2B Arbitraj' ? 'Mevcut Planınız' : 'B2B Çözümlerini İncele'}
          </button>
        </div>
      </div>

      {/* Altyapı & Sürdürülebilirlik Modeli */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <p>
            <strong className="text-white">Altyapı & Hizmet Modeli:</strong> Radar tarama motorumuz ve anlık bildirim sunucularımız, kullanıcı abonelik ücretleri ve Pro/B2B paketler ile finanse edilerek 7/24 kesintisiz ve tarafsız hizmet sunar.
          </p>
        </div>
      </div>
    </div>
  );
};
