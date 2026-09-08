import React, { useState, useRef, useEffect } from 'react';
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
  Tag,
  Heart,
  Bookmark,
  MoreVertical,
  Share2,
  Copy,
  Check,
  FileText,
  X,
  Globe,
  MessageCircle
} from 'lucide-react';
import { DealItem } from '../types';

interface DealCardProps {
  deal: DealItem;
  onSelectDeal: (deal: DealItem) => void;
  onSendTelegram: (deal: DealItem) => void;
  isFavorite?: boolean;
  isSavedForLater?: boolean;
  onToggleFavorite?: (dealId: string) => void;
  onToggleSavedForLater?: (dealId: string) => void;
  onShowToast?: (msg: string) => void;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  onSelectDeal,
  onSendTelegram,
  isFavorite,
  isSavedForLater,
  onToggleFavorite,
  onToggleSavedForLater,
  onShowToast
}) => {
  const isHighOpportunity = deal.opportunityScore >= 8.0;
  const savingsAmount = deal.marketAvgPrice - deal.currentPrice;

  // Local state fallback for maximum responsiveness and standalone usage
  const [localFavorite, setLocalFavorite] = useState(deal.isFavorite || false);
  const [localSavedLater, setLocalSavedLater] = useState(deal.isSavedForLater || false);

  const favoriteActive = isFavorite !== undefined ? isFavorite : localFavorite;
  const savedLaterActive = isSavedForLater !== undefined ? isSavedForLater : localSavedLater;

  // Contextual Quick Action Menu State
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [copiedAction, setCopiedAction] = useState<'link' | 'text' | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Close context menu on click outside or Escape
  useEffect(() => {
    if (!isContextMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setIsContextMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsContextMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isContextMenuOpen]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalFavorite(!favoriteActive);
    onToggleFavorite?.(deal.id);
  };

  const handleSaveLaterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalSavedLater(!savedLaterActive);
    onToggleSavedForLater?.(deal.id);
  };

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsContextMenuOpen((prev) => !prev);
  };

  const handleCardContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsContextMenuOpen(true);
  };

  // 1. Doğrudan Platforma Git
  const handleGoToPlatform = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(deal.productUrl, '_blank', 'noopener,noreferrer');
    setIsContextMenuOpen(false);
  };

  // 2. Bağlantıyı Kopyala
  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(deal.productUrl);
      setCopiedAction('link');
      onShowToast?.(`🔗 "${deal.platform}" ürün bağlantısı panoya kopyalandı!`);
      setTimeout(() => setCopiedAction(null), 2200);
      setTimeout(() => setIsContextMenuOpen(false), 800);
    } catch {
      // Fallback
      onShowToast?.('Bağlantı kopyalanamadı.');
    }
  };

  // 3. Fırsat Özetini Metin Olarak Kopyala
  const handleCopySummaryText = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const formattedText = 
`🔥 [Haberverbana Fırsat Radarı]
📦 ${deal.title}
💰 Fırsat Fiyatı: ₺${deal.currentPrice.toLocaleString('tr-TR')} (Piyasa Ort: ₺${deal.marketAvgPrice.toLocaleString('tr-TR')} - %${deal.discountRate} İndirim!)
🎯 Skor: ${deal.opportunityScore.toFixed(1)}/10 (${deal.badge})
🏬 Platform: ${deal.platform}
💡 Fırsat Nedeni: ${deal.whyForYou}
🔗 İncele: ${deal.productUrl}`;

    try {
      await navigator.clipboard.writeText(formattedText);
      setCopiedAction('text');
      onShowToast?.(`📋 Fırsat detay özeti panoya kopyalandı!`);
      setTimeout(() => setCopiedAction(null), 2200);
      setTimeout(() => setIsContextMenuOpen(false), 800);
    } catch {
      onShowToast?.('Metin kopyalanamadı.');
    }
  };

  // 4. Fırsatı Paylaş (Web Share API veya WhatsApp Fallback)
  const handleShareDeal = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: `${deal.title} - ₺${deal.currentPrice.toLocaleString('tr-TR')}`,
      text: `🔥 %${deal.discountRate} indirim: ${deal.title} şimdi ₺${deal.currentPrice.toLocaleString('tr-TR')}!`,
      url: deal.productUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setIsContextMenuOpen(false);
        onShowToast?.('Fırsat paylaşıldı!');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleFallbackShare();
        }
      }
    } else {
      handleFallbackShare();
    }
  };

  const handleFallbackShare = () => {
    const shareText = encodeURIComponent(
      `🔥 ${deal.title} - %${deal.discountRate} indirimle ₺${deal.currentPrice.toLocaleString('tr-TR')}! İncele: ${deal.productUrl}`
    );
    const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsContextMenuOpen(false);
    onShowToast?.('WhatsApp paylaşım ekranı açıldı.');
  };

  return (
    <div 
      id={`deal-card-${deal.id}`}
      onContextMenu={handleCardContextMenu}
      className="group relative bg-[#0F0F0F] rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-200 overflow-visible flex flex-col justify-between hover:shadow-2xl hover:shadow-black/60"
    >
      {/* Top Media & Floating Badges */}
      <div className="relative aspect-16/10 rounded-t-2xl overflow-hidden bg-black/40">
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

        {/* Opportunity Score Badge & Quick Action Buttons Group */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
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

          {/* Quick Action Button Group: Favorilere Ekle, Daha Sonra İncele & Bağlamsal Menü Düğmesi */}
          <div 
            id={`deal-quick-actions-bar-${deal.id}`}
            className="flex items-center gap-1 bg-black/85 backdrop-blur-md rounded-xl p-1 border border-white/20 shadow-xl shadow-black/80"
          >
            {/* Favorilere Ekle / Çıkar */}
            <button
              id={`btn-fav-${deal.id}`}
              type="button"
              onClick={handleFavoriteClick}
              className={`p-1.5 px-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                favoriteActive
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/60 shadow-sm shadow-rose-950/50 scale-105'
                  : 'text-white/80 hover:text-rose-400 hover:bg-white/10'
              }`}
              title={favoriteActive ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
              aria-label={favoriteActive ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            >
              <Heart className={`w-3.5 h-3.5 transition-transform duration-200 ${favoriteActive ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
              <span className="text-[10px] hidden sm:inline font-mono">
                {favoriteActive ? 'Favori' : 'Favorile'}
              </span>
            </button>

            <span className="w-px h-3.5 bg-white/20" />

            {/* Daha Sonra İncele / Çıkar */}
            <button
              id={`btn-save-later-${deal.id}`}
              type="button"
              onClick={handleSaveLaterClick}
              className={`p-1.5 px-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                savedLaterActive
                  ? 'bg-amber-400/30 text-amber-300 border border-amber-400/60 shadow-sm shadow-amber-950/50 scale-105'
                  : 'text-white/80 hover:text-amber-400 hover:bg-white/10'
              }`}
              title={savedLaterActive ? 'Daha Sonra İncele Listesinden Çıkar' : 'Daha Sonra İncele Listesine Ekle'}
              aria-label={savedLaterActive ? 'Daha Sonra İncele Listesinden Çıkar' : 'Daha Sonra İncele Listesine Ekle'}
            >
              <Bookmark className={`w-3.5 h-3.5 transition-transform duration-200 ${savedLaterActive ? 'fill-amber-400 text-amber-400 scale-110' : ''}`} />
              <span className="text-[10px] hidden sm:inline font-mono">
                {savedLaterActive ? 'Listede' : 'Daha Sonra'}
              </span>
            </button>

            <span className="w-px h-3.5 bg-white/20" />

            {/* Bağlamsal Hızlı Aksiyon Menüsü Açma Butonu */}
            <button
              id={`btn-deal-context-menu-${deal.id}`}
              type="button"
              onClick={handleToggleMenu}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center transition-all cursor-pointer ${
                isContextMenuOpen
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Bağlamsal Hızlı İşlemler Menüsü (Paylaş, Kopyala, Platform)"
              aria-label="Bağlamsal Hızlı İşlemler Menüsü"
              aria-expanded={isContextMenuOpen}
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
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

      {/* FLOATING CONTEXTUAL QUICK ACTION MENU */}
      {isContextMenuOpen && (
        <div 
          ref={contextMenuRef}
          id={`contextual-menu-${deal.id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-14 right-3 z-50 w-72 bg-[#121212]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl shadow-black/95 text-xs animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between px-2.5 py-1.5 mb-1.5 border-b border-white/10">
            <div className="flex items-center gap-1.5 truncate">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-red-600/30 text-red-300 border border-red-500/40">
                {deal.platform}
              </span>
              <span className="text-white/60 text-[11px] font-medium">Hızlı Aksiyonlar</span>
            </div>
            <button
              onClick={() => setIsContextMenuOpen(false)}
              className="p-1 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Menüyü Kapat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Quick Actions (Doğrudan Platforma Git, Kopyala, Paylaş) */}
          <div className="space-y-0.5">
            {/* 1. Doğrudan Platforma Git */}
            <button
              id={`ctx-go-platform-${deal.id}`}
              type="button"
              onClick={handleGoToPlatform}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-white hover:bg-white/10 transition-colors cursor-pointer group/btn"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover/btn:scale-105 transition-transform">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center gap-1">
                    <span>{deal.platform}'da Aç</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-normal">• Doğrudan</span>
                  </div>
                  <p className="text-[10px] text-white/50">Kaynak ilana yeni sekmede git</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-white/30 group-hover/btn:text-white/70">↗</span>
            </button>

            {/* 2. Ürün Bağlantısını Kopyala */}
            <button
              id={`ctx-copy-link-${deal.id}`}
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-white hover:bg-white/10 transition-colors cursor-pointer group/btn"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                  copiedAction === 'link'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-white/80 group-hover/btn:scale-105'
                }`}>
                  {copiedAction === 'link' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span>Bağlantıyı Kopyala</span>
                    {copiedAction === 'link' && (
                      <span className="text-[10px] font-bold text-emerald-400 animate-pulse">Kopyalandı!</span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/50 truncate max-w-[170px] font-mono">
                    {deal.productUrl.replace(/^https?:\/\//, '')}
                  </p>
                </div>
              </div>
            </button>

            {/* 3. Fırsat Özetini Metin Olarak Kopyala */}
            <button
              id={`ctx-copy-text-${deal.id}`}
              type="button"
              onClick={handleCopySummaryText}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-white hover:bg-white/10 transition-colors cursor-pointer group/btn"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                  copiedAction === 'text'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-white/80 group-hover/btn:scale-105'
                }`}>
                  {copiedAction === 'text' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-amber-300" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span>Fırsat Özetini Kopyala</span>
                    {copiedAction === 'text' && (
                      <span className="text-[10px] font-bold text-emerald-400 animate-pulse">Kopyalandı!</span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/50">WhatsApp / Discord paylaşım formatı</p>
                </div>
              </div>
            </button>

            {/* 4. Fırsatı Paylaş (Native Share / WhatsApp) */}
            <button
              id={`ctx-share-deal-${deal.id}`}
              type="button"
              onClick={handleShareDeal}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-white hover:bg-white/10 transition-colors cursor-pointer group/btn"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover/btn:scale-105 transition-transform">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-white">Fırsatı Paylaş</div>
                  <p className="text-[10px] text-white/50">Cihaz paylaşımı veya WhatsApp</p>
                </div>
              </div>
            </button>
          </div>

          <div className="my-1.5 border-t border-white/10" />

          {/* Secondary Actions (Telegram & AI Analizi) */}
          <div className="space-y-0.5">
            <button
              id={`ctx-telegram-${deal.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSendTelegram(deal);
                setIsContextMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-[#229ED9]/20 border border-[#229ED9]/30 flex items-center justify-center text-[#229ED9]">
                <Send className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-semibold">Telegram'a İlet</div>
                <p className="text-[10px] text-white/50">Bot kanalına bildirim gönder</p>
              </div>
            </button>

            <button
              id={`ctx-analysis-${deal.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectDeal(deal);
                setIsContextMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <BarChart2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-semibold">AI Analizi & Grafik</div>
                <p className="text-[10px] text-white/50">Fiyat trendi ve fırsat karnesi</p>
              </div>
            </button>
          </div>

          <div className="my-1.5 border-t border-white/10" />

          {/* Quick List Toggles */}
          <div className="grid grid-cols-2 gap-1 pt-0.5">
            <button
              id={`ctx-fav-${deal.id}`}
              type="button"
              onClick={handleFavoriteClick}
              className={`p-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                favoriteActive
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-rose-400 border border-white/5'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favoriteActive ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="text-[11px]">{favoriteActive ? 'Favorilerde' : 'Favorile'}</span>
            </button>

            <button
              id={`ctx-later-${deal.id}`}
              type="button"
              onClick={handleSaveLaterClick}
              className={`p-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                savedLaterActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-amber-400 border border-white/5'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${savedLaterActive ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="text-[11px]">{savedLaterActive ? 'Listede' : 'Daha Sonra'}</span>
            </button>
          </div>
        </div>
      )}

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
            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BarChart2 className="w-3.5 h-3.5 text-red-400" />
            <span>AI Analizi & Grafik</span>
          </button>

          <div className="flex items-center gap-1.5">
            {/* Quick Action Group in Footer */}
            <div 
              id={`footer-actions-${deal.id}`}
              className="flex items-center gap-0.5 p-0.5 rounded-xl bg-white/5 border border-white/10"
            >
              <button
                id={`footer-fav-${deal.id}`}
                type="button"
                onClick={handleFavoriteClick}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  favoriteActive 
                    ? 'text-rose-400 bg-rose-500/20 ring-1 ring-rose-500/30' 
                    : 'text-white/50 hover:text-rose-400 hover:bg-white/10'
                }`}
                title={favoriteActive ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                aria-label={favoriteActive ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
              >
                <Heart className={`w-3.5 h-3.5 transition-transform duration-200 ${favoriteActive ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
              </button>

              <button
                id={`footer-later-${deal.id}`}
                type="button"
                onClick={handleSaveLaterClick}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  savedLaterActive 
                    ? 'text-amber-300 bg-amber-400/20 ring-1 ring-amber-400/30' 
                    : 'text-white/50 hover:text-amber-400 hover:bg-white/10'
                }`}
                title={savedLaterActive ? 'Daha Sonra İncele Listesinden Çıkar' : 'Daha Sonra İncele'}
                aria-label={savedLaterActive ? 'Daha Sonra İncele Listesinden Çıkar' : 'Daha Sonra İncele'}
              >
                <Bookmark className={`w-3.5 h-3.5 transition-transform duration-200 ${savedLaterActive ? 'fill-amber-400 text-amber-400 scale-110' : ''}`} />
              </button>

              <button
                id={`footer-context-menu-${deal.id}`}
                type="button"
                onClick={handleToggleMenu}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isContextMenuOpen
                    ? 'text-white bg-white/20'
                    : 'text-white/50 hover:text-white hover:bg-white/10'
                }`}
                title="Hızlı Aksiyon Menüsü (Paylaş, Kopyala, Platform)"
                aria-label="Hızlı Aksiyon Menüsü"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => onSendTelegram(deal)}
              className="p-2 text-white/60 hover:text-[#229ED9] hover:bg-[#229ED9]/10 rounded-xl transition-colors border border-transparent hover:border-[#229ED9]/20 cursor-pointer"
              title="Telegram Bildirimi Gönder"
            >
              <Send className="w-4 h-4" />
            </button>

            <a
              href={deal.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-white hover:bg-white/90 text-black rounded-xl text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-md"
              title="Fırsat ilanını doğrudan kaynak sitede yeni sekmede aç"
            >
              <span>Yeni Sekmede Aç</span>
              <ExternalLink className="w-3.5 h-3.5 text-black" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

