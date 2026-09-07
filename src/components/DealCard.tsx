import React from 'react';
import { 
  ExternalLink, 
  Sparkles, 
  Send, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart2, 
  ShieldCheck, 
  Clock,
  Tag
} from 'lucide-react';
import { DealItem } from '../types';

interface DealCardProps {
  deal: DealItem;
  onSelectDeal: (deal: DealItem) => void;
  onSendTelegram: (deal: DealItem) => void;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  onSelectDeal,
  onSendTelegram
}) => {
  const isHighOpportunity = deal.opportunityScore >= 8.0;
  const savingsAmount = deal.marketAvgPrice - deal.currentPrice;

  return (
    <div 
      id={`deal-card-${deal.id}`}
      className="group relative bg-[#0F0F0F] rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-200 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:shadow-black/60"
    >
      {/* Top Media & Floating Badges */}
      <div className="relative aspect-16/10 overflow-hidden bg-black/40">
        <img 
          src={deal.imageUrl} 
          alt={deal.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-black/30" />

        {/* Platform Badge & Found time */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-md bg-black/80 backdrop-blur-md text-white border border-white/15">
            {deal.platform}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 backdrop-blur-md text-white/60 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {deal.foundAt}
          </span>
        </div>

        {/* Opportunity Score Badge */}
        <div className="absolute top-3 right-3">
          <div className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black shadow-lg flex items-center gap-1.5 border ${
            isHighOpportunity
              ? 'bg-red-600 text-white border-red-400 shadow-red-950/60 animate-pulse'
              : 'bg-amber-500 text-black border-amber-300 shadow-amber-950/40'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{deal.opportunityScore.toFixed(1)}/10</span>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">
              {deal.badge}
            </span>
          </div>
        </div>

        {/* Price & Savings Pill on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <span className="text-xs text-white/60 line-through font-mono">
              ₺{deal.marketAvgPrice.toLocaleString('tr-TR')} (Piyasa Ort.)
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight flex items-baseline gap-1">
              <span>₺{deal.currentPrice.toLocaleString('tr-TR')}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
              <TrendingDown className="w-3.5 h-3.5" />
              %{deal.discountRate} Fırsat
            </span>
            {savingsAmount > 0 && (
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5 font-medium">
                ₺{savingsAmount.toLocaleString('tr-TR')} cepte
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Tags */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">
              {deal.category}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[11px] text-white/50 truncate">
              {deal.sellerRating}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectDeal(deal)}
            className="font-medium text-base sm:text-lg text-white group-hover:text-red-400 transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {deal.title}
          </h3>

          {/* "Neden Senin İçin Fırsat?" AI Box */}
          <div className="mt-3.5 p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-red-400 font-bold uppercase text-[10px] tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Neden Senin İçin Fırsat?</span>
            </div>
            <p className="text-white/80 leading-relaxed font-sans">
              {deal.whyForYou}
            </p>
          </div>

          {/* Summary */}
          <p className="mt-2.5 text-xs text-white/60 italic line-clamp-2">
            "{deal.summary}"
          </p>

          {/* Pros & Negative Filter Pass Badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Negatif Filtre Temiz (Teşhir/Kusursuz)
            </span>
            {deal.pros.slice(0, 2).map((pro, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-white/70 border border-white/10 text-[10px]">
                <CheckCircle2 className="w-3 h-3 text-white/40" />
                <span className="truncate max-w-[180px]">{pro}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={() => onSelectDeal(deal)}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5 text-red-400" />
            <span>AI Analizi & Grafik</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSendTelegram(deal)}
              className="p-2 text-white/60 hover:text-[#229ED9] hover:bg-[#229ED9]/10 rounded-xl transition-colors border border-transparent hover:border-[#229ED9]/20"
              title="Telegram Bildirimini Test Et"
            >
              <Send className="w-4 h-4" />
            </button>

            <a
              href={deal.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-white hover:bg-white/90 text-black rounded-xl text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-md"
            >
              <span>Satıcıya Git</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
