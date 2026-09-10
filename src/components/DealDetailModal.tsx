import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ExternalLink, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  BarChart2, 
  FileText,
  Copy,
  FolderSync,
  Heart,
  Bookmark,
  Scale
} from 'lucide-react';
import { DealItem } from '../types';

interface DealDetailModalProps {
  deal: DealItem | null;
  onClose: () => void;
  onSendTelegram: (deal: DealItem) => void;
  isFavorite?: boolean;
  isSavedForLater?: boolean;
  isComparing?: boolean;
  onToggleFavorite?: (dealId: string) => void;
  onToggleSavedForLater?: (dealId: string) => void;
  onToggleCompare?: (deal: DealItem) => void;
}

export const DealDetailModal: React.FC<DealDetailModalProps> = ({
  deal,
  onClose,
  onSendTelegram,
  isFavorite,
  isSavedForLater,
  isComparing,
  onToggleFavorite,
  onToggleSavedForLater,
  onToggleCompare
}) => {
  const [isAnalyzingWithAI, setIsAnalyzingWithAI] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!deal) return null;

  const handleDeepAIAnalyze = async () => {
    setIsAnalyzingWithAI(true);
    try {
      const res = await fetch('/api/ai/analyze-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: deal.title,
          currentPrice: deal.currentPrice,
          originalPrice: deal.originalPrice,
          marketAvgPrice: deal.marketAvgPrice,
          platform: deal.platform,
          category: deal.category,
          productUrl: deal.productUrl
        })
      });
      const data = await res.json();
      setAiReport(data);
    } catch (err) {
      console.error('Deep AI error:', err);
    } finally {
      setIsAnalyzingWithAI(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(deal.productUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const savings = deal.marketAvgPrice - deal.currentPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0F0F0F] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 border border-white/15">
              {deal.platform}
            </span>
            <span className="text-xs text-white/50">
              {deal.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Action Button Group */}
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => onToggleCompare?.(deal)}
                className={`p-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isComparing
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                    : 'text-white/70 hover:text-cyan-400 hover:bg-white/10'
                }`}
                title={isComparing ? 'Karşılaştırma Masasından Çıkar' : 'Karşılaştırma Masasına Ekle (Maks 3)'}
              >
                <Scale className={`w-3.5 h-3.5 ${isComparing ? 'text-cyan-400' : ''}`} />
                <span className="hidden sm:inline text-xs">{isComparing ? 'Kıyaslamada' : 'Kıyasla'}</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleFavorite?.(deal.id)}
                className={`p-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                    : 'text-white/70 hover:text-rose-400 hover:bg-white/10'
                }`}
                title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span className="hidden sm:inline text-xs">{isFavorite ? 'Favorilerde' : 'Favorile'}</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleSavedForLater?.(deal.id)}
                className={`p-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSavedForLater
                    ? 'bg-amber-400/30 text-amber-300 border border-amber-400/50'
                    : 'text-white/70 hover:text-amber-400 hover:bg-white/10'
                }`}
                title={isSavedForLater ? 'Daha Sonra İncele Listesinden Çıkar' : 'Daha Sonra İncele'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSavedForLater ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span className="hidden sm:inline text-xs">{isSavedForLater ? 'Listede' : 'Daha Sonra'}</span>
              </button>
            </div>

            <a
              href={deal.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 text-white/80 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs flex items-center gap-1.5 border border-white/10"
              title="İlanı satıcının sitesinde yeni sekmede aç"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-xs">Yeni Sekmede Aç</span>
            </a>

            <button
              onClick={handleCopyLink}
              className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors text-xs flex items-center gap-1"
              title="Ürün Linkini Kopyala"
            >
              <Copy className="w-4 h-4" />
              {copiedLink && <span className="text-emerald-400 text-[10px]">Kopyalandı!</span>}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Title & Key Numbers */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1 bg-red-600/20 border border-red-500/40 text-red-400 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fırsat Skoru: {deal.opportunityScore}/10 ({deal.badge})</span>
              </div>
              <span className="text-xs text-white/50 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Tespit Edilme: {deal.foundAt}
              </span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
              {deal.title}
            </h2>

            {/* Price Overview Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-black to-black border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-white/50 block font-mono">Fırsat Fiyatı</span>
                <span className="text-3xl sm:text-4xl font-mono font-black text-white">
                  ₺{deal.currentPrice.toLocaleString('tr-TR')}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="border-l border-white/15 pl-4">
                  <span className="text-white/40 block">Piyasa Ortalaması</span>
                  <span className="text-white line-through font-bold">
                    ₺{deal.marketAvgPrice.toLocaleString('tr-TR')}
                  </span>
                </div>

                <div className="border-l border-white/15 pl-4">
                  <span className="text-emerald-400 block font-semibold">Tasarruf / Arbitraj</span>
                  <span className="text-emerald-400 text-base font-bold">
                    -₺{savings.toLocaleString('tr-TR')} (%{deal.discountRate})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* "Neden Senin İçin Fırsat?" AI Box */}
          <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Neden Senin İçin Fırsat? (Gemini 2.5 Flash Analizi)</span>
              </div>
              <span className="text-[10px] text-white/40 font-mono">Structured JSON Output</span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              {aiReport?.whyForYou || deal.whyForYou}
            </p>
            <p className="text-xs text-white/60 italic pt-1 border-t border-white/5">
              Satın Alma Özeti: "{aiReport?.summary || deal.summary}"
            </p>
          </div>

          {/* Price History Visualization */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-red-400" />
                Fiyat Geçmişi & Dip Nokta Tespiti (Son 60 Gün)
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                Tarihi Dip Fiyat Tespit Edildi
              </span>
            </div>

            <div className="flex items-end justify-between gap-2 h-24 pt-4 px-2">
              {deal.priceHistory.map((pt, idx) => {
                const maxP = Math.max(...deal.priceHistory.map(p => p.price));
                const minP = Math.min(...deal.priceHistory.map(p => p.price));
                const heightPercent = Math.max(25, Math.round(((pt.price - minP * 0.8) / (maxP - minP * 0.8)) * 100));
                const isCurrent = idx === deal.priceHistory.length - 1;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[9px] font-mono text-white/50">
                      ₺{(pt.price / 1000).toFixed(0)}k
                    </span>
                    <div 
                      className={`w-full rounded-t-md transition-all ${
                        isCurrent 
                          ? 'bg-red-600 shadow-lg shadow-red-900/60' 
                          : 'bg-white/20 hover:bg-white/30'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] font-mono text-white/40">
                      {pt.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pros, Cons & Risk Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Artı Yönler & Avantajlar
              </span>
              <ul className="space-y-1.5 text-xs text-white/80">
                {(aiReport?.pros || deal.pros).map((pro: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Risk Faktörleri & Dikkat Noktaları
              </span>
              <ul className="space-y-1.5 text-xs text-white/80">
                {(aiReport?.riskFactors || deal.riskFactors).map((risk: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
                {(aiReport?.cons || deal.cons).map((con: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-white/60">
                    <span className="text-white/40">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Market Comparison Note */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 space-y-1">
            <span className="font-semibold text-white block">Piyasa Karşılaştırması:</span>
            <p>{aiReport?.marketComparison || deal.marketComparison}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#0A0A0A]">
          <button
            onClick={handleDeepAIAnalyze}
            disabled={isAnalyzingWithAI}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Sparkles className={`w-3.5 h-3.5 text-red-500 ${isAnalyzingWithAI ? 'animate-spin' : ''}`} />
            <span>{isAnalyzingWithAI ? 'Derin Analiz Yapılıyor...' : 'Gemini ile Yeniden Analiz Et'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSendTelegram(deal)}
              className="px-4 py-2.5 bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/30 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram'a İlet</span>
            </button>

            <a
              href={deal.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-red-950/40 active:scale-95"
            >
              <span>Yeni Sekmede Aç & İncele</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
