import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Radar, 
  Send, 
  Bell, 
  DollarSign, 
  Sliders, 
  ShieldCheck, 
  Sparkles,
  X
} from 'lucide-react';
import { DealCategory, UserProfile } from '../types';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onComplete: (updatedUser: Partial<UserProfile>) => void;
}

const CATEGORIES: DealCategory[] = [
  'Elektronik & Bilgisayar',
  'Otomobil & Vasıta',
  'Emlak & Konut',
  'Giyim & Moda',
  'Ev & Yaşam'
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onClose,
  user,
  onComplete
}) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState(user.name || 'Fırsat Avcısı');
  const [email, setEmail] = useState(user.email || 'kullanici@haberverbana.app');
  const [selectedCategories, setSelectedCategories] = useState<DealCategory[]>(
    user.selectedCategories.length > 0 ? user.selectedCategories : ['Elektronik & Bilgisayar', 'Otomobil & Vasıta']
  );
  const [budgetMin, setBudgetMin] = useState<number>(user.budgetRange.min || 10000);
  const [budgetMax, setBudgetMax] = useState<number>(user.budgetRange.max || 150000);
  const [notificationChannel, setNotificationChannel] = useState<'Telegram' | 'E-posta' | 'Tümü'>('Telegram');
  const [telegramUsername, setTelegramUsername] = useState(user.telegramUsername || '@kullanici');
  const [minOpportunityScore, setMinOpportunityScore] = useState<number>(7.5);

  if (!isOpen) return null;

  const toggleCategory = (cat: DealCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleFinish = () => {
    onComplete({
      name,
      email,
      selectedCategories,
      budgetRange: { min: budgetMin, max: budgetMax },
      telegramUsername,
      telegramConnected: notificationChannel !== 'E-posta',
      onboardingCompleted: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F0F0F] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col">
        {/* Header with Step indicator */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
              <Radar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold">
                Haberverbana Karşılama Sihirbazı
              </h2>
              <p className="text-xs text-white/50">
                Adım {step} / 4: {
                  step === 1 ? 'Profil & Radar Tanıtımı' :
                  step === 2 ? 'İlgi Alanları & Bütçe Eşikleri' :
                  step === 3 ? 'Bildirim Kanalı Tercihi' : 'Kurulum Tamamlama'
                }
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-white/5">
          <div 
            className="h-full bg-red-600 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto max-h-[65vh]">
          {/* STEP 1: Profil & Misyon */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed space-y-1">
                  <p className="font-bold text-white text-sm">
                    "Sen Arama, O Haber Versin"
                  </p>
                  <p className="text-white/70">
                    Haberverbana, e-ticaret ve ilan sitelerinde sürekli gezmek zorunda kalmamanız için 7/24 piyasayı tarar. Sadece ucuzlayanları değil, yapay zeka ile emsallerini ve donanımını inceleyip <strong>gerçek fırsatları</strong> size bildirir.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Adınız / Takma Adınız
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                    placeholder="Örn: Deniz Yılmaz"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Bildirim E-posta Adresiniz
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                    placeholder="ornek@haberverbana.app"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Kategoriler & Bütçe */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2">
                  1. Radarın Tarayacağı Kategorileri Seçin (Birden fazla seçilebilir)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`p-3.5 rounded-2xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-red-600/15 border-red-500 text-white shadow-sm'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <Check className="w-4 h-4 text-red-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-3">
                <label className="block text-xs font-semibold text-white/80">
                  2. Genel Bütçe Hedefiniz (TL)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-white/50 block mb-1">En Az (TL)</span>
                    <input
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-white/50 block mb-1">En Fazla (TL)</span>
                    <input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-white/40">
                  * Bu bütçe aralığı dışındaki ürünler otomatik olarak filtrelenecektir.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Bildirim Kanalı & Spam Koruması */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2">
                  Hangi Kanaldan Anlık Bildirim Almak İstersiniz?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Telegram', label: 'Telegram Bot', icon: Send, badge: 'Önerilen / En Hızlı' },
                    { id: 'E-posta', label: 'E-posta Bülteni', icon: Bell, badge: 'Özet Bülten' },
                    { id: 'Tümü', label: 'Tüm Kanallar', icon: Radar, badge: 'Tam Kapsam' }
                  ].map((chan) => {
                    const isSelected = notificationChannel === chan.id;
                    const Icon = chan.icon;
                    return (
                      <button
                        key={chan.id}
                        type="button"
                        onClick={() => setNotificationChannel(chan.id as any)}
                        className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-white text-black font-bold border-white shadow-lg'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{chan.label}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-black/10 text-black' : 'bg-white/10 text-white/60'
                        }`}>
                          {chan.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {notificationChannel !== 'E-posta' && (
                <div className="p-4 rounded-2xl bg-[#229ED9]/10 border border-[#229ED9]/20 space-y-2">
                  <label className="block text-xs font-semibold text-[#229ED9]">
                    Telegram Kullanıcı Adınız veya Chat ID
                  </label>
                  <input
                    type="text"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="@kullanici_adiniz"
                    className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#229ED9]"
                  />
                  <p className="text-[11px] text-white/50">
                    Botumuz (@haberverbana_radar_bot) kriterlere uyan fırsat yakaladığında tek tıkla mesaj atar.
                  </p>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-white block">24 Saatlik Akıllı Anti-Spam Koruması:</span>
                  <span className="text-white/60">Aynı ürün için 24 saat boyunca tekrar bildirim gönderilmez.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Kurulum Tamamlama */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-center space-y-2 py-2">
                <div className="w-14 h-14 mx-auto rounded-3xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold">
                  Radarın Kurulumu Neredeyse Hazır!
                </h3>
                <p className="text-xs text-white/60 max-w-md mx-auto">
                  Aşağıdaki ayarlarınızla 7/24 piyasa tarayıcıları ve Gemini 2.5 Flash analitik motoru devreye giriyor.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50">Kullanıcı:</span>
                  <span className="text-white font-bold">{name} ({email})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50">Takip Kategorileri:</span>
                  <span className="text-white font-bold">{selectedCategories.join(', ')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50">Bütçe Hedefi:</span>
                  <span className="text-emerald-400 font-bold">₺{budgetMin.toLocaleString('tr-TR')} - ₺{budgetMax.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50">Bildirim Kanalı:</span>
                  <span className="text-red-400 font-bold">{notificationChannel}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-white/50">Negatif Filtreleme:</span>
                  <span className="text-emerald-400 font-bold">Ağır Hasarlı / Teşhir / Kutusu Açık Engelli</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/70">Asgari Fırsat Skoru Eşiği:</span>
                  <span className="font-mono text-red-400 font-bold">{minOpportunityScore.toFixed(1)} / 10</span>
                </div>
                <input
                  type="range"
                  min="6.5"
                  max="9.0"
                  step="0.1"
                  value={minOpportunityScore}
                  onChange={(e) => setMinOpportunityScore(Number(e.target.value))}
                  className="w-full accent-red-600"
                />
                <p className="text-[10px] text-white/40">
                  * Yalnızca yapay zekanın {minOpportunityScore.toFixed(1)} ve üzeri puan verdiği fırsatlarda anlık bildirim alırsınız.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-xs text-white/40 hover:text-white"
            >
              Daha Sonra Kur
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-white hover:bg-white/90 text-black rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <span>Devam Et</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-950/50 active:scale-95"
            >
              <Radar className="w-4 h-4" />
              <span>Radarı Başlat & Fırsatları Gör</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
