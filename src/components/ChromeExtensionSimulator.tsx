import React, { useState } from 'react';
import { 
  Chrome, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Zap, 
  Copy,
  Plus
} from 'lucide-react';
import { DealItem } from '../types';

interface ChromeExtensionSimulatorProps {
  onAddDetectedDeal: (deal: DealItem) => void;
}

const SAMPLE_LINKS = [
  {
    platform: 'Amazon',
    title: 'Sony Alpha A7 IV Aynasız Fotoğraf Makinesi (Gövde)',
    url: 'https://www.amazon.com.tr/dp/B09JZT54B3',
    price: 64999,
    marketAvg: 79000,
    category: 'Elektronik & Bilgisayar'
  },
  {
    platform: 'Sahibinden',
    title: '2023 Fiat Egea 1.6 Multijet Lounge (Otomatik, 18.000 km, Hatasız)',
    url: 'https://www.sahibinden.com/ilan/vasita-otomobil-fiat-egea-lounge-18bin-km',
    price: 885000,
    marketAvg: 960000,
    category: 'Otomobil & Vasıta'
  },
  {
    platform: 'Hepsiburada',
    title: 'Roborock S8 Pro Ultra Akıllı Robot Süpürge (Yıkama İstasyonlu)',
    url: 'https://www.hepsiburada.com/roborock-s8-pro-ultra-robot-supurge',
    price: 36999,
    marketAvg: 44500,
    category: 'Ev & Yaşam'
  }
];

export const ChromeExtensionSimulator: React.FC<ChromeExtensionSimulatorProps> = ({
  onAddDetectedDeal
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleScanUrl = async (sample?: any) => {
    const targetUrl = sample?.url || urlInput;
    const targetTitle = sample?.title || '';
    const targetPrice = sample?.price || 0;

    if (!targetUrl.trim()) return;

    setIsScanning(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/ai/quick-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          title: targetTitle,
          platform: sample?.platform || 'E-ticaret',
          price: targetPrice
        })
      });
      const data = await res.json();
      setScanResult({
        ...data,
        sampleData: sample || {
          platform: 'Amazon',
          title: targetTitle || 'Taranan Ürün Linki',
          price: 24500,
          marketAvg: 31000,
          category: 'Elektronik & Bilgisayar',
          url: targetUrl
        }
      });
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddScannedToRadar = () => {
    if (!scanResult) return;
    const sample = scanResult.sampleData;
    const currentP = sample.price || 24500;
    const marketP = sample.marketAvg || Math.round(currentP * 1.25);
    const discountRate = Math.round(((marketP - currentP) / marketP) * 100);

    const newDeal: DealItem = {
      id: `ext-deal-${Date.now()}`,
      title: sample.title || scanResult.title || 'Chrome Eklentisi ile Yakalanan Ürün',
      category: sample.category || 'Elektronik & Bilgisayar',
      platform: sample.platform || 'Amazon',
      currentPrice: currentP,
      originalPrice: marketP,
      marketAvgPrice: marketP,
      discountRate: Math.max(12, discountRate),
      opportunityScore: scanResult.opportunityScore || 8.4,
      badge: (scanResult.opportunityScore || 8.4) >= 8.0 ? 'Kaçırılmayacak Fırsat' : 'Sıcak Fırsat',
      whyForYou: scanResult.whyNotice || 'Chrome eklentisiyle eklendi. Piyasa ortalamasından belirgin tasarruf sağlıyor.',
      summary: scanResult.verdict || 'Hızlı alım değerlendirmesi için radara alındı.',
      pros: [
        'Chrome eklentisi ile doğrudan mağazadan yakalandı',
        `Piyasa ortalamasının ₺${(marketP - currentP).toLocaleString('tr-TR')} altında`,
        'Otomatik fiyat geçmişi takibi başlatıldı'
      ],
      cons: ['Fiyat değişimleri için anlık bot alarmı devrede'],
      riskFactors: ['Standart satıcı iade koşulları geçerli'],
      marketComparison: `Diğer platformlarda ortalama ₺${marketP.toLocaleString('tr-TR')} seviyesindedir.`,
      productUrl: sample.url || urlInput,
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
      foundAt: 'Az önce',
      sellerRating: 'Resmi Mağaza',
      priceHistory: [
        { date: '10 Şub', price: marketP },
        { date: '01 Mar', price: marketP - 2000 },
        { date: '05 Mar', price: currentP }
      ],
      tags: ['Eklenti ile Yakalandı', 'Fırsat'],
      isAffiliate: true
    };

    onAddDetectedDeal(newDeal);
    setScanResult(null);
    setUrlInput('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Extension Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F0F0F] to-black border border-white/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Chrome className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Chrome Eklentisi (Manifest V3) Simülatörü
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                Eklenti v1.2
              </span>
            </div>
            <p className="text-xs text-white/50">
              Amazon, Trendyol, Hepsiburada veya Sahibinden'de gezinirken sayfadaki ilanı tek tıkla radara yakalayın.
            </p>
          </div>
        </div>

        {/* URL Input Form */}
        <div className="pt-2">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Herhangi bir ürün/ilan linki yapıştırın (Amazon, Trendyol, Sahibinden)..."
                className="w-full pl-11 pr-4 py-3 bg-black/60 border border-white/15 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              onClick={() => handleScanUrl()}
              disabled={isScanning || !urlInput.trim()}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              <Zap className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Yapay Zeka İnceliyor...' : 'Linkten Yakala'}</span>
            </button>
          </div>
        </div>

        {/* Quick Sample Links */}
        <div className="pt-2 space-y-2">
          <span className="text-[11px] text-white/50 block">
            Veya hazır örnek ilanlarla eklentiyi deneyin:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_LINKS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUrlInput(sample.url);
                  handleScanUrl(sample);
                }}
                className="p-3 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 transition-all flex flex-col justify-between gap-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400">
                    {sample.platform}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    ₺{sample.price.toLocaleString('tr-TR')}
                  </span>
                </div>
                <span className="truncate font-medium text-[11px] group-hover:text-white">
                  {sample.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated Chrome Extension Popup Result */}
      {scanResult && (
        <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-amber-500/30 shadow-2xl space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold text-xs text-amber-400 uppercase tracking-wider">
                Haberverbana Chrome Eklentisi Önizleme
              </span>
            </div>
            <div className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-mono font-bold">
              Fırsat Skoru: {scanResult.opportunityScore}/10
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-base text-white">
              {scanResult.title}
            </h3>
            <p className="text-xs text-white/70">
              {scanResult.whyNotice}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-white/10 grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-white/40 block">İlandaki Fiyat:</span>
              <span className="text-white font-bold text-sm">
                ₺{(scanResult.sampleData?.price || 24500).toLocaleString('tr-TR')}
              </span>
            </div>
            <div>
              <span className="text-white/40 block">Tahmini Piyasa Ortalaması:</span>
              <span className="text-emerald-400 font-bold text-sm">
                ₺{(scanResult.sampleData?.marketAvg || 31000).toLocaleString('tr-TR')}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={() => setScanResult(null)}
              className="px-4 py-2 text-xs text-white/50 hover:text-white"
            >
              Kapat
            </button>
            <button
              onClick={handleAddScannedToRadar}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-950/40 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tek Tıkla Radarıma Ekle</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
