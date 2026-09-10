import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  ExternalLink, 
  Send, 
  TrendingDown, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Share2, 
  Check, 
  Zap, 
  Trophy, 
  Plus,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { DealItem } from '../types';

interface CompareDealsModalProps {
  isOpen: boolean;
  deals?: DealItem[];
  selectedDeals?: DealItem[];
  allDeals: DealItem[];
  onClose: () => void;
  onRemoveDeal: (dealId: string) => void;
  onAddDeal: (deal: DealItem) => void;
  onClearAll?: () => void;
  onSelectDeal?: (deal: DealItem) => void;
  onSendTelegram?: (deal: DealItem) => void;
  onShowToast?: (msg: string) => void;
}

export const CompareDealsModal: React.FC<CompareDealsModalProps> = ({
  isOpen,
  deals: propDeals,
  selectedDeals,
  allDeals,
  onClose,
  onRemoveDeal,
  onAddDeal,
  onClearAll,
  onSelectDeal,
  onSendTelegram,
  onShowToast
}) => {
  const deals = selectedDeals || propDeals || [];
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);

  if (!isOpen) return null;

  // Highlights & Differences Calculations
  const hasDeals = deals.length > 0;
  const minPrice = hasDeals ? Math.min(...deals.map(d => d.currentPrice)) : 0;
  const maxPrice = hasDeals ? Math.max(...deals.map(d => d.currentPrice)) : 0;
  const maxDiscount = hasDeals ? Math.max(...deals.map(d => d.discountRate)) : 0;
  const maxScore = hasDeals ? Math.max(...deals.map(d => d.opportunityScore)) : 0;
  const maxSavings = hasDeals ? Math.max(...deals.map(d => d.marketAvgPrice - d.currentPrice)) : 0;

  // Available deals to add (excluding currently selected)
  const availableToAdd = allDeals.filter(
    d => !deals.some(selected => selected.id === d.id)
  );

  // Copy structured comparison summary
  const handleCopyComparison = async () => {
    let text = `⚡ [Haberverbana Fırsat Karşılaştırma Raporu]\n`;
    text += `Toplam ${deals.length} fırsat kıyaslandı:\n\n`;

    deals.forEach((d, idx) => {
      const isCheapest = d.currentPrice === minPrice;
      const isTopScore = d.opportunityScore === maxScore;
      text += `${idx + 1}. ${d.title}\n`;
      text += `   • Platform: ${d.platform}\n`;
      text += `   • Fiyat: ₺${d.currentPrice.toLocaleString('tr-TR')} ${isCheapest ? '(🏆 En Uygun Fiyat)' : ''}\n`;
      text += `   • Piyasa Emsal: ₺${d.marketAvgPrice.toLocaleString('tr-TR')} (%${d.discountRate} İndirim)\n`;
      text += `   • AI Skoru: ${d.opportunityScore.toFixed(1)}/10 ${isTopScore ? '(⚡ Zirve Skor)' : ''}\n`;
      text += `   • Fırsat Gerekçesi: ${d.whyForYou}\n`;
      text += `   • Link: ${d.productUrl}\n\n`;
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopiedSummary(true);
      onShowToast?.('📋 Fırsat karşılaştırma raporu panoya kopyalandı!');
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      onShowToast?.('Rapor kopyalanamadı.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#121212] border border-white/15 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-red-950/20 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Fırsat Kıyaslama Masası
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/15">
                  {deals.length} / 3 Fırsat Seçili
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Fiyat, platform, arbitraj oranı ve yapay zeka fırsat skorlarının yan yana analizi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Clear All Button */}
            {deals.length > 0 && onClearAll && (
              <button
                onClick={onClearAll}
                className="px-3.5 py-2 rounded-full text-xs font-semibold bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-300 border border-white/10 transition-colors"
                title="Tüm seçili fırsatları masadan kaldır"
              >
                Temizle
              </button>
            )}

            {/* Share / Copy Summary Button */}
            {deals.length > 0 && (
              <button
                onClick={handleCopyComparison}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 border ${
                  copiedSummary
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border-white/15'
                }`}
                title="Karşılaştırma özetini metin formatında kopyala"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Kıyaslamayı Kopyala</span>
                  </>
                )}
              </button>
            )}

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Highlights Summary Banner */}
        {deals.length >= 2 && (
          <div className="px-5 sm:px-6 py-3 bg-red-950/20 border-b border-red-900/30 flex items-center gap-4 overflow-x-auto scrollbar-none text-xs">
            <span className="font-bold text-red-400 flex items-center gap-1 shrink-0">
              <Zap className="w-3.5 h-3.5" />
              Öne Çıkan Farklar:
            </span>

            {/* En Ucuz Ürün Özeti */}
            <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span>En Uygun:</span>
              <strong className="font-mono">₺{minPrice.toLocaleString('tr-TR')}</strong>
              {maxPrice > minPrice && (
                <span className="text-[11px] text-emerald-400/80">
                  (₺{(maxPrice - minPrice).toLocaleString('tr-TR')} daha hesaplı)
                </span>
              )}
            </div>

            {/* En Yüksek İndirim Oranı */}
            <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
              <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Zirve İndirim:</span>
              <strong className="font-mono">%{maxDiscount}</strong>
            </div>

            {/* En Yüksek Skor */}
            <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>En Yüksek Skor:</span>
              <strong className="font-mono">{maxScore.toFixed(1)}/10</strong>
            </div>
          </div>
        )}

        {/* Comparison Table Container or Empty State */}
        {deals.length === 0 ? (
          <div className="p-10 sm:p-14 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-serif">
                Kıyaslama Masası Boş
              </h3>
              <p className="text-xs text-white/50 max-w-md mx-auto mt-1">
                Fırsat kartlarındaki <strong className="text-cyan-400">"Kıyasla"</strong> butonuna basarak veya aşağıdaki listeden seçerek en fazla 3 fırsatı yan yana detaylı karşılaştırabilirsiniz.
              </p>
            </div>
            <div className="max-w-xl mx-auto pt-4 text-left">
              <span className="text-xs text-white/40 font-mono uppercase block mb-2 font-semibold">
                Radardan Fırsat Ekle:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto p-1">
                {allDeals.slice(0, 6).map(deal => (
                  <div 
                    key={deal.id}
                    className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={deal.imageUrl} alt="" className="w-9 h-9 rounded-xl object-cover bg-black shrink-0" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <p className="text-xs text-white font-medium truncate">{deal.title}</p>
                        <p className="text-[11px] text-cyan-400 font-mono font-bold">₺{deal.currentPrice.toLocaleString('tr-TR')} • {deal.platform}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onAddDeal(deal)}
                      className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
                    >
                      + Ekle
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="min-w-[640px]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {/* Metric Label Column */}
                  <th className="w-48 p-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider border-b border-white/10 bg-[#0F0F0F] sticky left-0 z-10">
                    Kriter / Özellik
                  </th>

                  {/* Deals Header Columns */}
                  {deals.map((deal) => {
                    const isCheapest = deal.currentPrice === minPrice && deals.length > 1;
                    const isBestScore = deal.opportunityScore === maxScore && deals.length > 1;

                    return (
                      <th 
                        key={deal.id}
                        className={`p-4 text-left border-b border-white/10 bg-[#141414] relative transition-colors ${
                          isCheapest ? 'ring-1 ring-emerald-500/40 bg-emerald-950/10' : ''
                        }`}
                        style={{ width: `${100 / (deals.length + (deals.length < 3 ? 1 : 0))}%` }}
                      >
                        {/* Remove Deal Button */}
                        <button
                          onClick={() => onRemoveDeal(deal.id)}
                          className="absolute top-3 right-3 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                          title="Bu fırsatı karşılaştırmadan çıkar"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {/* Badges */}
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap pr-8">
                          {isCheapest && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                              <Trophy className="w-3 h-3 text-emerald-400" />
                              En Düşük Fiyat
                            </span>
                          )}
                          {isBestScore && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600/20 text-red-300 border border-red-500/40 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-red-400" />
                              Zirve Fırsat
                            </span>
                          )}
                        </div>

                        {/* Product Image & Title */}
                        <div className="flex items-start gap-3">
                          <img 
                            src={deal.imageUrl} 
                            alt={deal.title} 
                            className="w-16 h-16 rounded-xl object-cover bg-black/50 border border-white/10 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 pr-2">
                            <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                              {deal.title}
                            </h3>
                            <span className="text-[11px] text-white/50 block mt-1">
                              {deal.category}
                            </span>
                          </div>
                        </div>
                      </th>
                    );
                  })}

                  {/* Empty Slot to Add 3rd Deal */}
                  {deals.length < 3 && (
                    <th 
                      className="p-4 text-center border-b border-white/10 border-dashed border-white/15 bg-[#0D0D0D]/60 align-middle"
                      style={{ width: `${100 / (deals.length + 1)}%` }}
                    >
                      <div className="py-6 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-dashed border-white/20 mx-auto flex items-center justify-center text-white/40">
                          <Plus className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white/70">
                            + {3 - deals.length} Fırsat Daha Ekle
                          </p>
                          <p className="text-[11px] text-white/40 mt-0.5">
                            3'lü karşılaştırma için akıştan bir ürün daha seçin
                          </p>
                        </div>

                        {/* Quick Add Dropdown */}
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setIsAddDropdownOpen(!isAddDropdownOpen)}
                            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors mx-auto"
                          >
                            <span>Fırsat Seç...</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          {isAddDropdownOpen && (
                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#181818] border border-white/20 rounded-2xl shadow-2xl p-2 z-50 text-left max-h-60 overflow-y-auto">
                              <div className="px-2 py-1 text-[10px] text-white/40 font-mono uppercase">
                                Radardaki Fırsatlar
                              </div>
                              {availableToAdd.length === 0 ? (
                                <div className="p-3 text-xs text-white/50 text-center">
                                  Başka uygun fırsat kalmadı.
                                </div>
                              ) : (
                                availableToAdd.slice(0, 8).map(d => (
                                  <button
                                    key={d.id}
                                    onClick={() => {
                                      onAddDeal(d);
                                      setIsAddDropdownOpen(false);
                                    }}
                                    className="w-full p-2 hover:bg-white/10 rounded-xl text-left flex items-center gap-2 transition-colors group"
                                  >
                                    <img 
                                      src={d.imageUrl} 
                                      alt="" 
                                      className="w-8 h-8 rounded-lg object-cover bg-black shrink-0" 
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs text-white group-hover:text-red-400 truncate">
                                        {d.title}
                                      </p>
                                      <span className="text-[10px] text-white/50 font-mono">
                                        ₺{d.currentPrice.toLocaleString('tr-TR')} • {d.platform}
                                      </span>
                                    </div>
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 text-xs">
                {/* 1. ROW: Platform & Seller */}
                <tr>
                  <td className="p-3.5 font-semibold text-white/60 bg-[#0F0F0F] sticky left-0 z-10">
                    Platform & Satıcı
                  </td>
                  {deals.map(deal => (
                    <td key={deal.id} className="p-3.5 bg-[#141414] text-white">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide uppercase bg-white/10 text-white border border-white/15">
                          {deal.platform}
                        </span>
                        <span className="text-[11px] text-white/50 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          {deal.sellerRating}
                        </span>
                      </div>
                    </td>
                  ))}
                  {deals.length < 3 && <td className="bg-[#0D0D0D]/40" />}
                </tr>

                {/* 2. ROW: Fırsat Fiyatı */}
                <tr>
                  <td className="p-3.5 font-semibold text-white/60 bg-[#0F0F0F] sticky left-0 z-10">
                    Fırsat Fiyatı
                  </td>
                  {deals.map(deal => {
                    const isCheapest = deal.currentPrice === minPrice && deals.length > 1;
                    const diffFromMin = deal.currentPrice - minPrice;

                    return (
                      <td 
                        key={deal.id} 
                        className={`p-3.5 bg-[#141414] ${
                          isCheapest ? 'bg-emerald-950/15' : ''
                        }`}
                      >
                        <div className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight flex items-baseline gap-2">
                          <span>₺{deal.currentPrice.toLocaleString('tr-TR')}</span>
                        </div>
                        {isCheapest ? (
                          <span className="inline-block mt-0.5 text-[11px] text-emerald-400 font-medium">
                            En Düşük Fiyat
                          </span>
                        ) : diffFromMin > 0 ? (
                          <span className="inline-block mt-0.5 text-[11px] text-white/40 font-mono">
                            +₺{diffFromMin.toLocaleString('tr-TR')} fark
                          </span>
                        ) : null}
                      </td>
                    );
                  })}
                  {deals.length < 3 && <td className="bg-[#0D0D0D]/40" />}
                </tr>

                {/* 3. ROW: Piyasa Ortalama Fiyatı */}
                <tr>
                  <td className="p-3.5 font-semibold text-white/60 bg-[#0F0F0F] sticky left-0 z-10">
                    Piyasa Emsal Fiyatı
                  </td>
                  {deals.map(deal => (
                    <td key={deal.id} className="p-3.5 bg-[#141414] text-white/70 font-mono">
                      <span className="line-through text-white/50">
                        ₺{deal.marketAvgPrice.toLocaleString('tr-TR')}
                      </span>
                    </td>
                  ))}
                  {deals.length < 3 && <td className="bg-[#0D0D0D]/40" />}
                </tr>

                {/* 4. ROW: İndirim Oranı & Arbitraj */}
                <tr>
                  <td className="p-3.5 font-semibold text-white/60 bg-[#0F0F0F] sticky left-0 z-10">
                    İndirim Oranı
                  </td>
                  {deals.map(deal => {
                    const isHighestDiscount = deal.discountRate === maxDiscount && deals.length > 1;

                    return (
                      <td key={deal.id} className="p-3.5 bg-[#141414]">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1 ${
                            isHighestDiscount
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            <TrendingDown className="w-3.5 h-3.5" />
                            %{deal.discountRate} İndirim
                          </span>
                        </div>
                      </td>
                    );
                  })}
                  {deals.length < 3 && <td className="bg-[#0D0D0D]/40" />}
                </tr>

                {/* 5. ROW: Cepte Kalan Tutar (Tasarruf) */}
                <tr>
                  <td className="p-3.5 font-semibold text-white/60 bg-[#0F0F0F] sticky left-0 z-10">
                    Net Arbitraj Tasarrufu
                  </td>
                  {deals.map(deal => {
                    const savings = deal.marketAvgPrice - deal.currentPrice;
                    const isTopSavings = savings === maxSavings && deals.length > 1;

                    return (
                      <td key={deal.id} className="p-3.5 bg-[#141414]">
                        <span className={`font-mono font-bold ${
                          isTopSavings ? 'text-emerald-400 font-bold' : 'text-emerald-300'
                        }`}>
                          ₺{savings.toLocaleString('tr-TR')} Cepte
                        </span>
                      </td>
                    );
                  })}
                  {deals.length < 3 && <td className="bg-[#0D0D0D]/40" />}
                </tr>

                {/* 6. ROW: Yapay Zeka Fırsat Skoru */}
                <tr>
                  <td className="p-3.5 font-semibold text-white/60 bg-[#0F0F0F] sticky left-0 z-10">
                    AI Fırsat Skoru
                  </td>
                  {deals.map(deal => {
                    const isTopScore = deal.opportunityScore === maxScore && deals.length > 1;

                    return (
                      <td key={deal.id} className="p-3.5 bg-[#141414]">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-xl font-mono text-xs font-black border flex items-center gap-1.5 ${
                            deal.opportunityScore >= 8.0
                              ? 'bg-red-600 text-white border-red-400 shadow-md shadow-red-950/50'
                              : 'bg-amber-500 text-black border-amber-300'
                          }`}>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{deal.opportunityScore.toFixed(1)}/10</span>
                          </span>
                          <span className="text-[11px] text-white/60 font-medium">
                            {deal.badge}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                  {deals.length < 3 && <td className="bg-[#0D0D0D]/40" />}
                </tr>

                {/* 7. ROW: Fırsat Gerekçesi (Neden Senin İçin Fırsat?) */}
                <tr>
                  <td className="p-3.5 font-semibold text-white/60 bg-[#0F0F0F] sticky left-0 z-10">
                    Fırsat Gerekçesi
                  </td>
                  {deals.map(deal => (
                    <td key={deal.id} className="p-3.5 bg-[#141414] text-xs text-white/80 leading-relaxed">
                      {deal.whyForYou}
                    </td>
                  ))}
                  {deals.length < 3 && <td className="bg-[#0D0D0D]/40" />}
                </tr>

                {/* 8. ROW: Tek Cümlelik Satın Alma Tavsiyesi */}
                <tr>
                  <td className="p-3.5 font-semibold text-white/60 bg-[#0F0F0F] sticky left-0 z-10">
                    Satın Alma Tavsiyesi
                  </td>
                  {deals.map(deal => (
                    <td key={deal.id} className="p-3.5 bg-[#141414] text-xs text-white/70 italic">
                      "{deal.summary}"
                    </td>
                  ))}
                  {deals.length < 3 && <td className="bg-[#0D0D0D]/40" />}
                </tr>

                {/* 9. ROW: Öne Çıkan Artılar (Pros) */}
                <tr>
                  <td className="p-3.5 font-semibold text-white/60 bg-[#0F0F0F] sticky left-0 z-10">
                    Güçlü Yönler (Artılar)
                  </td>
                  {deals.map(deal => (
                    <td key={deal.id} className="p-3.5 bg-[#141414]">
                      <ul className="space-y-1.5">
                        {deal.pros.map((pro, i) => (
                          <li key={i} className="text-xs text-white/80 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {deals.length < 3 && <td className="bg-[#0D0D0D]/40" />}
                </tr>

                {/* 10. ROW: Riskler / Dikkat Edilecekler */}
                <tr>
                  <td className="p-3.5 font-semibold text-white/60 bg-[#0F0F0F] sticky left-0 z-10">
                    Dikkat / Riskler
                  </td>
                  {deals.map(deal => (
                    <td key={deal.id} className="p-3.5 bg-[#141414]">
                      <ul className="space-y-1.5">
                        {deal.riskFactors.map((risk, i) => (
                          <li key={i} className="text-xs text-amber-300/90 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {deals.length < 3 && <td className="bg-[#0D0D0D]/40" />}
                </tr>

                {/* 11. ROW: Aksiyonlar (Platforma Git & Telegram) */}
                <tr>
                  <td className="p-3.5 font-semibold text-white/60 bg-[#0F0F0F] sticky left-0 z-10">
                    Aksiyonlar
                  </td>
                  {deals.map(deal => (
                    <td key={deal.id} className="p-3.5 bg-[#141414]">
                      <div className="flex flex-col gap-2">
                        <a
                          href={deal.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-red-950/40 transition-all active:scale-95"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{deal.platform}'da İncele</span>
                        </a>

                        {onSelectDeal && (
                          <button
                            onClick={() => onSelectDeal(deal)}
                            className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/15 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>Detaylı İncele</span>
                          </button>
                        )}

                        {onSendTelegram && (
                          <button
                            onClick={() => onSendTelegram(deal)}
                            className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/15 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-blue-400" />
                            <span>Telegram'a İlet</span>
                          </button>
                        )}
                      </div>
                    </td>
                  ))}
                  {deals.length < 3 && <td className="bg-[#0D0D0D]/40" />}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0E0E0E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Fiyatlar canlı piyasa tarayıcıları ve emsal algoritmalarıyla kıyaslanmıştır.</span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
