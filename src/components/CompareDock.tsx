import React from 'react';
import { Scale, X, Plus, Trash2, ArrowRight } from 'lucide-react';
import { DealItem } from '../types';

interface CompareDockProps {
  selectedDeals: DealItem[];
  onRemoveDeal: (dealId: string) => void;
  onClearAll: () => void;
  onOpenModal: () => void;
}

export const CompareDock: React.FC<CompareDockProps> = ({
  selectedDeals,
  onRemoveDeal,
  onClearAll,
  onOpenModal
}) => {
  if (selectedDeals.length === 0) return null;

  const canCompare = selectedDeals.length >= 2;

  return (
    <div 
      id="compare-floating-dock"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-3xl animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto select-none"
    >
      <div className="bg-[#111111]/95 backdrop-blur-xl border border-white/20 rounded-3xl p-3 sm:p-4 shadow-2xl shadow-black/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Selected items slots */}
        <div className="flex items-center gap-2.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="hidden md:flex items-center gap-2 pr-2 border-r border-white/10 text-xs text-white/70 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-[11px] leading-tight">Fırsat Kıyasla</p>
              <span className="text-[10px] text-white/40 font-mono">{selectedDeals.length}/3 Seçildi</span>
            </div>
          </div>

          {/* 3 Slots */}
          {[0, 1, 2].map((slotIndex) => {
            const deal = selectedDeals[slotIndex];

            if (deal) {
              return (
                <div 
                  key={deal.id}
                  className="flex items-center gap-2 p-1.5 pr-2.5 bg-white/10 border border-white/15 rounded-2xl shrink-0 group relative"
                >
                  <img 
                    src={deal.imageUrl} 
                    alt={deal.title} 
                    className="w-9 h-9 rounded-xl object-cover bg-black shrink-0 border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 max-w-[120px] sm:max-w-[150px]">
                    <p className="text-[11px] font-bold text-white truncate leading-tight">
                      {deal.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-mono">
                      <span className="text-emerald-400 font-bold">₺{deal.currentPrice.toLocaleString('tr-TR')}</span>
                      <span>•</span>
                      <span className="truncate">{deal.platform}</span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveDeal(deal.id)}
                    className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors ml-1"
                    title="Seçimi kaldır"
                    aria-label={`${deal.title} seçimini kaldır`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            }

            return (
              <div 
                key={`empty-${slotIndex}`}
                className="hidden sm:flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl border border-dashed border-white/15 text-white/30 text-[11px] font-medium shrink-0 min-w-[100px]"
              >
                <Plus className="w-3 h-3" />
                <span>Slot {slotIndex + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            onClick={onClearAll}
            className="p-2 text-white/50 hover:text-white text-xs font-semibold rounded-xl hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
            title="Tüm seçimleri temizle"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Temizle</span>
          </button>

          <button
            id="open-compare-modal-btn"
            onClick={onOpenModal}
            disabled={!canCompare}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              canCompare
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-950/60 active:scale-95 animate-pulse hover:animate-none'
                : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
            }`}
            title={canCompare ? 'Seçili fırsatları yan yana kıyasla' : 'Kıyaslamak için en az 2 fırsat seçin'}
          >
            <Scale className="w-4 h-4" />
            <span>
              {canCompare ? `Kıyasla (${selectedDeals.length})` : 'En Az 2 Fırsat Seçin'}
            </span>
            {canCompare && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
