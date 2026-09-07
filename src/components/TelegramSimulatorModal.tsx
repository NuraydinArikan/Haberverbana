import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  MessageSquare,
  Star,
  Settings,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  Copy
} from 'lucide-react';
import { DealItem } from '../types';
import { 
  getStoredTelegramConfig, 
  saveStoredTelegramConfig, 
  sendCustomTelegramTest, 
  sendRealTelegramAlert,
  TelegramConfig 
} from '../services/telegramService';

interface TelegramSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal?: DealItem | null;
}

export const TelegramSimulatorModal: React.FC<TelegramSimulatorModalProps> = ({
  isOpen,
  onClose,
  deal
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'connect'>('connect');
  const [config, setConfig] = useState<TelegramConfig>({ botToken: '', chatId: '' });
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [copiedIdBot, setCopiedIdBot] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredTelegramConfig();
      setConfig(stored);
      // If chatId is not set, open the connect tab by default so user can fix "bildirim gelmiyor"
      if (!stored.chatId) {
        setActiveTab('connect');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fallbackDeal: DealItem = {
    id: 'deal-macbook-air-m3',
    title: 'Apple MacBook Air 13.6" M3 (16GB RAM / 512GB SSD) Gece Yarısı',
    platform: 'Amazon',
    category: 'Elektronik & Bilgisayar',
    currentPrice: 47499,
    originalPrice: 53999,
    marketAvgPrice: 52000,
    opportunityScore: 9.1,
    discountRate: 12.0,
    badge: 'Kaçırılmayacak Fırsat',
    whyForYou: 'Satıcı resmi Amazon.com.tr ve fiyat 50.000 TL sınırının altında (₺47.499). Emsal piyasa ortalamasının ₺4.500 altında tarihi dip seviyede.',
    pros: [
      'Satıcı resmi Amazon Türkiye (Güvenilir garanti ve kolay iade)',
      '16GB birleşik bellek ile geleceğe dönük performans',
      'Son 90 günün en dip fiyatı'
    ],
    cons: [
      'Stok adedi 5 adet ile sınırlı'
    ],
    riskFactors: ['Risk bulunmuyor, resmi satıcı garantili.'],
    marketComparison: 'Piyasa ortalamasının ₺4.500 altında.',
    summary: 'Resmi Amazon satıcılı 16GB RAM / 512GB SSD M3 MacBook Air modelinde piyasanın dip fiyatı yakalandı.',
    productUrl: 'https://www.amazon.com.tr',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    foundAt: '5 dakika önce',
    sellerRating: '4.9 / 5.0 (Resmi Amazon)',
    priceHistory: [{ date: '01 Mar', price: 52000 }, { date: '05 Mar', price: 47499 }],
    tags: ['MacBook Air', 'M3', '16GB RAM'],
    isAffiliate: true
  };

  const currentDeal: DealItem = deal || fallbackDeal;

  const handleSaveConfig = () => {
    saveStoredTelegramConfig(config);
    setSendResult({ success: true, message: 'Telegram ayarları kaydedildi!' });
    setTimeout(() => setSendResult(null), 3000);
  };

  const handleSendTestMessage = async () => {
    if (!config.chatId.trim()) {
      setSendResult({ 
        success: false, 
        message: 'Lütfen Telegram Chat ID numaranızı girin. (Aşağıdaki adımlardan öğrenebilirsiniz)' 
      });
      return;
    }

    if (!config.botToken.trim()) {
      setSendResult({ 
        success: false, 
        message: 'Lütfen Telegram Bot Token girin veya .env dosyanızdaki tokenı yapıştırın.' 
      });
      return;
    }

    setIsSending(true);
    setSendResult(null);
    saveStoredTelegramConfig(config);

    const res = await sendCustomTelegramTest(config);
    setIsSending(false);

    if (res.success) {
      setSendResult({ 
        success: true, 
        message: 'Harika! Telefonunuza gerçek Telegram bildirimi başarıyla gönderildi. Kontrol ediniz!' 
      });
    } else {
      setSendResult({ 
        success: false, 
        message: `Gönderim başarısız: ${res.error}` 
      });
    }
  };

  const handleSendRealDealAlert = async () => {
    if (!config.chatId.trim() || !config.botToken.trim()) {
      setActiveTab('connect');
      setSendResult({ 
        success: false, 
        message: 'Lütfen önce Telegram Chat ID ve Bot Token bilgilerinizi kaydedin.' 
      });
      return;
    }

    setIsSending(true);
    setSendResult(null);

    const res = await sendRealTelegramAlert(currentDeal, config);
    setIsSending(false);

    if (res.success) {
      setSendResult({ 
        success: true, 
        message: `"${currentDeal.title}" fırsatı gerçek Telegram hesabınıza anında iletildi!` 
      });
    } else {
      setSendResult({ 
        success: false, 
        message: `Hata: ${res.error}` 
      });
    }
  };

  const scoreNum = Math.round(currentDeal.opportunityScore);
  const stars = '⭐'.repeat(Math.min(10, Math.max(1, scoreNum)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#182533] border border-[#2B5278] rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        {/* Telegram Chat Header */}
        <div className="px-5 py-3.5 bg-[#17212B] border-b border-[#0E1621] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-[#229ED9] flex items-center justify-center font-bold text-sm shadow-md">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">
                  haberverbana.app | Telegram Radarı
                </span>
                <span className="text-[10px] bg-[#229ED9]/30 text-[#229ED9] px-1.5 py-0.2 rounded font-mono font-semibold">
                  CANLI BOT
                </span>
              </div>
              <p className="text-[11px] text-white/50">
                @haberverbana_bot • Anlık Bildirim Motoru
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white rounded-full hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center px-4 border-b border-white/10 bg-[#131d27] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('connect')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'connect'
                ? 'border-[#229ED9] text-[#229ED9] font-bold'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Neden Bildirim Gelmiyor? (Canlı Bağla)</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'preview'
                ? 'border-[#229ED9] text-[#229ED9] font-bold'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Mesaj Önizlemesi</span>
          </button>
        </div>

        {/* Tab 1: Connect Real Telegram */}
        {activeTab === 'connect' && (
          <div className="p-5 space-y-4 overflow-y-auto max-h-[62vh] text-xs leading-relaxed">
            {/* Why notifications don't arrive explanation */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200/90 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Şu Anda Bildirim Gelmemesinin Sebebi:</span>
              </div>
              <p>
                Telegram botunun mesajları telefonunuza iletebilmesi için hesabınızın <strong>Telegram Chat ID</strong>'sini bilmesi gerekir. Aşağıdaki 2 adımı tamamladığınızda tüm bildirimler doğrudan cebinize gelecektir:
              </p>
            </div>

            {/* Steps to get Chat ID */}
            <div className="p-4 rounded-2xl bg-[#17212B] border border-[#2B5278]/40 space-y-3">
              <span className="font-bold text-white text-xs block">
                Telegram Chat ID'nizi Nasıl Öğrenirsiniz?
              </span>

              <div className="space-y-2 text-white/80">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#229ED9]/20 text-[#229ED9] flex items-center justify-center font-bold shrink-0 text-[11px]">1</span>
                  <p>
                    Telegram uygulamanızda arama kısmına <strong className="text-white">@userinfobot</strong> yazın ve <strong>/start</strong> deyin.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#229ED9]/20 text-[#229ED9] flex items-center justify-center font-bold shrink-0 text-[11px]">2</span>
                  <p>
                    Bot size anında <strong className="text-emerald-400">"Id: 123456789"</strong> şeklinde numaranızı söyleyecektir. O numarayı kopyalayıp aşağıdaki kutucuğa yapıştırın:
                  </p>
                </div>
              </div>
            </div>

            {/* Input fields */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-white/70 font-mono text-[11px] mb-1">
                  Telegram Chat ID (Numerik Numaranız) *
                </label>
                <input
                  type="text"
                  value={config.chatId}
                  onChange={(e) => setConfig({ ...config, chatId: e.target.value })}
                  placeholder="Örn: 987654321"
                  className="w-full px-3.5 py-2.5 bg-[#0E1621] border border-[#2B5278] rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#229ED9] font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-white/70 font-mono text-[11px]">
                    Telegram Bot Token *
                  </label>
                  <span className="text-[10px] text-white/40 font-mono">
                    .env dosyasındaki TELEGRAM_BOT_TOKEN
                  </span>
                </div>
                <input
                  type="password"
                  value={config.botToken}
                  onChange={(e) => setConfig({ ...config, botToken: e.target.value })}
                  placeholder="Örn: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                  className="w-full px-3.5 py-2.5 bg-[#0E1621] border border-[#2B5278] rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#229ED9] font-mono"
                />
                <span className="text-[10px] text-white/40 block mt-1">
                  Kendi botunuz yoksa @BotFather üzerinden 30 saniyede ücretsiz bir bot oluşturup token alabilirsiniz.
                </span>
              </div>
            </div>

            {/* Send Result Feedback */}
            {sendResult && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                sendResult.success 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}>
                {sendResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{sendResult.message}</span>
              </div>
            )}

            {/* Test Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveConfig}
                className="flex-1 py-2.5 px-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-semibold transition-colors"
              >
                Ayarları Kaydet
              </button>

              <button
                type="button"
                onClick={handleSendTestMessage}
                disabled={isSending}
                className="flex-1 py-2.5 px-4 bg-[#229ED9] hover:bg-[#1f8ec4] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Gönderiliyor...' : 'Telefonuma Test Gönder'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Formatted Telegram Message Preview */}
        {activeTab === 'preview' && (
          <div className="p-4 sm:p-5 bg-[#0E1621] space-y-4 max-h-[62vh] overflow-y-auto">
            {/* Timestamp chip */}
            <div className="text-center">
              <span className="px-3 py-1 bg-[#17212B] text-white/40 text-[10px] rounded-full font-mono">
                Bugün, {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Telegram Formatted Message Balloon matching core/notifiers/telegram.py */}
            <div className="bg-[#182533] border border-[#2B5278]/50 rounded-2xl p-4 space-y-3 shadow-xl max-w-[98%] text-xs leading-relaxed">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  🔔 <b>haberverbana.app | YENİ FIRSAT TESPİT EDİLDİ</b>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {currentDeal.opportunityScore}/10
                </span>
              </div>

              <div className="space-y-1.5 font-sans text-white/90">
                <p>
                  <b>Ürün / İlan:</b> <span className="text-white font-semibold">{currentDeal.title}</span>
                </p>
                <p>
                  <b>Platform:</b> <span className="text-[#50a2e9] font-medium">{currentDeal.platform}</span>
                </p>
                <p>
                  <b>Fiyat:</b> <code className="bg-black/40 px-1.5 py-0.5 rounded text-emerald-300 font-mono font-bold">₺{currentDeal.currentPrice.toLocaleString('tr-TR')}</code> {currentDeal.marketAvgPrice ? <span className="text-xs text-emerald-400 font-medium">(Piyasa Ort: ₺{currentDeal.marketAvgPrice.toLocaleString('tr-TR')})</span> : null}
                </p>
                <p>
                  📊 <b>AI Skoru:</b> <span className="font-bold text-amber-300">{currentDeal.opportunityScore}/10</span> <span className="text-xs tracking-widest">{stars}</span>
                </p>
                <p className="pt-1">
                  💡 <b>Fiyat Analizi:</b> <span>{currentDeal.whyForYou}</span>
                </p>

                {currentDeal.pros && currentDeal.pros.length > 0 && (
                  <div className="pt-1">
                    <b>Öne Çıkanlar:</b>
                    <ul className="pl-2 space-y-0.5 text-[11.5px] text-white/80">
                      {currentDeal.pros.slice(0, 3).map((p, i) => (
                        <li key={i}>  ✅ {p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentDeal.cons && currentDeal.cons.length > 0 && (
                  <div className="pt-1">
                    <b>Dikkat:</b>
                    <ul className="pl-2 space-y-0.5 text-[11.5px] text-amber-200/80">
                      {currentDeal.cons.slice(0, 2).map((c, i) => (
                        <li key={i}>  ⚠️ {c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-1 text-[#229ED9]">
                  🎯 <b>AI Kararı:</b> <i>"{currentDeal.summary || currentDeal.whyForYou}"</i>
                </div>
              </div>

              {/* In-Chat Action Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-2 border-t border-white/10">
                <a
                  href={currentDeal.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-[#2481CC] hover:bg-[#2072b4] text-white text-center rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow"
                >
                  <span>İlana Git</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={onClose}
                  className="py-2 px-3 bg-white/10 hover:bg-white/15 text-white text-center rounded-xl text-xs font-semibold transition-colors"
                >
                  <span>Kapat</span>
                </button>
              </div>

              <div className="text-right text-[10px] text-white/30 font-mono">
                {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} ✓✓
              </div>
            </div>

            {/* Send this deal live to phone */}
            <div className="pt-2">
              <button
                onClick={handleSendRealDealAlert}
                disabled={isSending}
                className="w-full py-2.5 px-4 bg-[#229ED9] hover:bg-[#1f8ec4] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'İletiliyor...' : 'Bu Fırsatı Telefonumdaki Telegram\'a Gönder'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-[#17212B] border-t border-[#0E1621] flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px]">24 Saat Spam & Çift Bildirim Koruması Aktif</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
