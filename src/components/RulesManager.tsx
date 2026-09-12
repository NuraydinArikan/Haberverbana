import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Send, 
  ExternalLink, 
  Bot, 
  Zap, 
  Sparkles, 
  Sliders, 
  Share2, 
  Check, 
  RotateCcw,
  CheckSquare,
  Square,
  AlertTriangle,
  X,
  Power,
  PowerOff,
  Edit3,
  DollarSign
} from 'lucide-react';
import { RadarRule } from '../types';
import { buildPlatformSearchUrl, getPlatformBadgeStyle } from '../utils/searchUrlBuilder';
import { formatPriceHuman } from './RuleDrawer';

interface RulesManagerProps {
  rules: RadarRule[];
  onToggleRule: (ruleId: string) => void;
  onDeleteRule: (ruleId: string) => void;
  onDeleteMultipleRules: (ruleIds: string[]) => void;
  onResetRulesToDefault: () => void;
  onClearAllRules: () => void;
  onToggleMultipleRules?: (ruleIds: string[], active: boolean) => void;
  onOpenCreateRule: () => void;
  onEditRule?: (rule: RadarRule) => void;
  onUpdateRuleDirect?: (updatedRule: RadarRule) => void;
  onScanRule?: (rule: RadarRule) => void;
}

export const RulesManager: React.FC<RulesManagerProps> = ({
  rules,
  onToggleRule,
  onDeleteRule,
  onDeleteMultipleRules,
  onResetRulesToDefault,
  onClearAllRules,
  onToggleMultipleRules,
  onOpenCreateRule,
  onEditRule,
  onUpdateRuleDirect,
  onScanRule
}) => {
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
  const [copiedRuleId, setCopiedRuleId] = useState<string | null>(null);
  
  // Modals state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isConfirmBatchDeleteOpen, setIsConfirmBatchDeleteOpen] = useState(false);
  const [ruleToDeleteSingle, setRuleToDeleteSingle] = useState<RadarRule | null>(null);
  const [ruleForQuickBudget, setRuleForQuickBudget] = useState<RadarRule | null>(null);
  const [quickMinPrice, setQuickMinPrice] = useState<number>(0);
  const [quickMaxPrice, setQuickMaxPrice] = useState<number>(0);

  const handleOpenQuickBudget = (rule: RadarRule) => {
    setRuleForQuickBudget(rule);
    setQuickMinPrice(rule.minPrice);
    setQuickMaxPrice(rule.maxPrice);
  };

  const handleSaveQuickBudget = () => {
    if (!ruleForQuickBudget) return;
    if (onUpdateRuleDirect) {
      onUpdateRuleDirect({
        ...ruleForQuickBudget,
        minPrice: quickMinPrice,
        maxPrice: quickMaxPrice
      });
    }
    setRuleForQuickBudget(null);
  };

  // Selection helpers
  const allSelected = rules.length > 0 && selectedRuleIds.length === rules.length;
  const isPartiallySelected = selectedRuleIds.length > 0 && selectedRuleIds.length < rules.length;

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedRuleIds([]);
    } else {
      setSelectedRuleIds(rules.map(r => r.id));
    }
  };

  const handleToggleSelectRule = (ruleId: string) => {
    setSelectedRuleIds(prev => 
      prev.includes(ruleId) ? prev.filter(id => id !== ruleId) : [...prev, ruleId]
    );
  };

  const handleBatchDeleteConfirmed = () => {
    if (selectedRuleIds.length > 0) {
      onDeleteMultipleRules(selectedRuleIds);
      setSelectedRuleIds([]);
      setIsConfirmBatchDeleteOpen(false);
    }
  };

  const handleSingleDeleteConfirmed = () => {
    if (ruleToDeleteSingle) {
      onDeleteRule(ruleToDeleteSingle.id);
      setSelectedRuleIds(prev => prev.filter(id => id !== ruleToDeleteSingle.id));
      setRuleToDeleteSingle(null);
    }
  };

  const handleBatchToggleActive = (active: boolean) => {
    if (onToggleMultipleRules && selectedRuleIds.length > 0) {
      onToggleMultipleRules(selectedRuleIds, active);
      setSelectedRuleIds([]);
    }
  };

  const handleShareRule = (rule: RadarRule) => {
    try {
      const url = new URL(window.location.href);
      const q = rule.searchQuery || rule.name;
      url.searchParams.set('q', q);
      url.searchParams.set('cat', rule.category);
      url.searchParams.set('score', rule.minScore.toString());
      url.searchParams.set('rule', rule.name);

      const shareUrl = url.toString();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl);
      } else {
        const ta = document.createElement('textarea');
        ta.value = shareUrl;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedRuleId(rule.id);
      setTimeout(() => setCopiedRuleId(null), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0F0F0F] border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-red-500" />
              <span>Taleplerim & Radar Kuralları</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
              {rules.length} Talep Tanımlı
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            "Sen Arama, O Haber Versin": Aradığınız ürün, vasıta veya gayrimenkul taleplerini yönetin; seçerek silin veya tek tıkla sıfırlayın.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          {/* Talepleri Sıfırla / Temizle Butonu */}
          <button
            id="reset-rules-btn"
            onClick={() => setIsResetModalOpen(true)}
            className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            title="Talepleri sıfırla veya tüm listeyi temizle"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Talepleri Sıfırla</span>
          </button>

          {/* Yeni Talep Ekle Butonu */}
          <button
            id="create-new-rule-btn"
            onClick={onOpenCreateRule}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-950/40 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Yeni Talep Ekle</span>
          </button>
        </div>
      </div>

      {/* Top Bar with Multi-Select Controls (If rules exist) */}
      {rules.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSelectAll}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer group"
              title={allSelected ? 'Tüm seçimleri kaldır' : 'Tüm talepleri seç'}
            >
              {allSelected ? (
                <CheckSquare className="w-4 h-4 text-red-500" />
              ) : isPartiallySelected ? (
                <div className="w-4 h-4 rounded border border-red-500 bg-red-500/20 flex items-center justify-center">
                  <div className="w-2 h-0.5 bg-red-400 rounded-sm"></div>
                </div>
              ) : (
                <Square className="w-4 h-4 text-white/40 group-hover:text-white/80" />
              )}
              <span className="font-medium">
                {allSelected ? 'Tüm Seçimleri Kaldır' : 'Tümünü Seç'} ({rules.length})
              </span>
            </button>

            {selectedRuleIds.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-300 font-mono text-[11px] font-bold">
                {selectedRuleIds.length} talep seçildi
              </span>
            )}
          </div>

          {/* Quick inline action when items are selected */}
          {selectedRuleIds.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsConfirmBatchDeleteOpen(true)}
                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Seçilenleri Sil ({selectedRuleIds.length})</span>
              </button>

              <button
                onClick={() => setSelectedRuleIds([])}
                className="px-2.5 py-1.5 text-white/50 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
            </div>
          )}
        </div>
      )}

      {/* Rules List */}
      {rules.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0F0F0F] border border-white/10 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
            <SlidersHorizontal className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">Henüz Tanımlı Takip Talebi Yok</h3>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              Tüm taleplerinizi sildiniz veya henüz kural eklemediniz. Yeni bir talep oluşturabilir ya da örnek radar kurallarını tek tıkla geri yükleyebilirsiniz.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onResetRulesToDefault}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Örnek Talepleri Geri Yükle</span>
            </button>
            <button
              onClick={onOpenCreateRule}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-xs transition-all shadow-md shadow-red-950/40 cursor-pointer"
            >
              + İlk Talebini Tanımla
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => {
            const isSelected = selectedRuleIds.includes(rule.id);
            const platforms = rule.platforms && rule.platforms.length > 0 
              ? rule.platforms 
              : (['Amazon', 'Hepsiburada', 'Trendyol', 'Sahibinden'] as const);
            const query = rule.searchQuery || rule.name;
            const isAutoAi = rule.platformMode === 'auto_ai' || !rule.platformMode;

            return (
              <div
                key={rule.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 relative group ${
                  isSelected
                    ? 'bg-red-950/15 border-red-500/50 shadow-lg shadow-red-950/20'
                    : rule.isActive
                    ? 'bg-[#0F0F0F] border-white/15 hover:border-white/25 shadow-md'
                    : 'bg-[#0a0a0a] border-white/5 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Checkbox & Content */}
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Multi-Select Checkbox */}
                    <button
                      onClick={() => handleToggleSelectRule(rule.id)}
                      className="mt-1 p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer shrink-0"
                      title={isSelected ? 'Seçimi Kaldır' : 'Talebi Seç'}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-red-500" />
                      ) : (
                        <Square className="w-5 h-5 text-white/30 group-hover:text-white/60" />
                      )}
                    </button>

                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80">
                          {rule.category}
                        </span>
                        <span className="text-xs text-white/30">•</span>
                        <button
                          type="button"
                          onClick={() => handleOpenQuickBudget(rule)}
                          className="text-xs font-mono text-emerald-400 font-bold hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 hover:border-emerald-500/50 px-2 py-0.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer group/budget shadow-xs"
                          title="Bütçeyi hızlı düzeltmek için tıklayın (Eksik/Fazla Sıfır)"
                        >
                          <DollarSign className="w-3 h-3 text-emerald-400" />
                          <span>Bütçe: ₺{rule.minPrice.toLocaleString('tr-TR')} — ₺{rule.maxPrice.toLocaleString('tr-TR')}</span>
                          <Edit3 className="w-3 h-3 text-emerald-400/60 group-hover/budget:text-emerald-300 transition-colors" />
                        </button>
                        <span className="text-xs text-white/30">•</span>
                        <span className="text-[11px] font-mono text-amber-400">
                          Min Skor: {rule.minScore.toFixed(1)}/10
                        </span>
                        <span className="text-xs text-white/30">•</span>
                        <span className="text-[11px] text-[#229ED9] flex items-center gap-1 font-mono">
                          <Send className="w-3 h-3" />
                          {rule.notificationChannel} ({rule.frequency})
                        </span>
                        <span className="text-xs text-white/30">•</span>
                        {isAutoAi ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            AI Keşif ({platforms.length} Site)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                            <Sliders className="w-2.5 h-2.5" />
                            Özel Seçim ({platforms.length} Site)
                            {rule.autoExpandPlatforms && ' + Hibrit'}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 flex-wrap">
                          <span>{rule.name}</span>
                          {rule.searchQuery && (
                            <span className="text-xs font-normal text-white/40 font-mono">
                              (Arama: "{rule.searchQuery}")
                            </span>
                          )}
                        </h3>

                        {rule.aiInstructions && (
                          <p className="text-xs text-white/70 mt-1 flex items-start gap-1.5 bg-black/40 p-2.5 rounded-xl border border-white/5">
                            <Bot className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span><b>Gemini Kriteri:</b> {rule.aiInstructions}</span>
                          </p>
                        )}

                        {rule.aiRationale && (
                          <p className="text-[11px] text-white/70 mt-1.5 flex items-start gap-1.5 bg-gradient-to-r from-purple-950/30 to-black p-2 rounded-xl border border-purple-500/20">
                            <Sparkles className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                            <span><b>AI Platform Keşif Gerekçesi:</b> {rule.aiRationale}</span>
                          </p>
                        )}
                      </div>

                      {/* Platforms Scanned */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white/40 text-[11px] font-mono">
                            {isAutoAi ? 'AI ile Keşfedilen Siteler:' : 'Seçili Mecralar:'}
                          </span>
                          {platforms.map((p) => {
                            const url = buildPlatformSearchUrl(p, query, rule.maxPrice);
                            return (
                              <a
                                key={p}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold flex items-center gap-1 transition-all ${getPlatformBadgeStyle(p)}`}
                                title={`${p} üzerinde canlı arama şablonunu aç`}
                              >
                                <span>{p}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </a>
                            );
                          })}
                        </div>

                        {/* Positive & Negative Keywords */}
                        <div className="flex items-center gap-4 flex-wrap text-xs pt-1">
                          {rule.positiveKeywords && rule.positiveKeywords.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-white/40 text-[11px]">Pozitif:</span>
                              {rule.positiveKeywords.map((kw, i) => (
                                <span key={i} className="px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono">
                                  +{kw}
                                </span>
                              ))}
                            </div>
                          )}

                          {rule.negativeKeywords && rule.negativeKeywords.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-amber-400/70 text-[11px] flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-amber-400" />
                                Negatif:
                              </span>
                              {rule.negativeKeywords.map((kw, i) => (
                                <span key={i} className="px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono">
                                  🚫 {kw}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex sm:flex-col items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/5 shrink-0">
                    <div className="flex items-center gap-2">
                      {onScanRule && (
                        <button
                          onClick={() => onScanRule(rule)}
                          className="px-3 py-1.5 bg-red-600/15 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
                          title="Bu talebi şu an tüm sitelerde canlı tara"
                        >
                          <Zap className="w-3 h-3 text-red-400" />
                          <span>Şimdi Tara</span>
                        </button>
                      )}

                      <button
                        onClick={() => onToggleRule(rule.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          rule.isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/5 text-white/40 border border-white/10'
                        }`}
                        title={rule.isActive ? 'Talebi durdur' : 'Talebi aktif et'}
                      >
                        <span>{rule.isActive ? 'Aktif' : 'Durduruldu'}</span>
                      </button>

                      {/* Düzenle Butonu */}
                      {onEditRule && (
                        <button
                          onClick={() => onEditRule(rule)}
                          className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm hover:shadow-amber-500/10"
                          title="Bu Talebi Düzenle (Bütçe, Kriterler, Platformlar)"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Düzenle</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleShareRule(rule)}
                        className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                          copiedRuleId === rule.id
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-white/40 hover:text-amber-400 hover:bg-white/5'
                        }`}
                        title={copiedRuleId === rule.id ? 'Bağlantı kopyalandı!' : 'Kural Bağlantısını Kopyala & Paylaş'}
                      >
                        {copiedRuleId === rule.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>

                      {/* Tekli Silme Butonu */}
                      <button
                        onClick={() => setRuleToDeleteSingle(rule)}
                        className="p-1.5 text-white/40 hover:text-red-400 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                        title="Bu Talebi Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-white/40 block">Eşleşen Fırsatlar</span>
                      <span className="font-mono text-xs text-white font-bold">
                        {rule.matchedCount} adet tespit edildi
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky Multi-Select Floating Action Bar (Gmail / Notion Style) */}
      {selectedRuleIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl bg-[#141414]/95 backdrop-blur-xl border border-red-500/40 rounded-2xl p-3.5 shadow-2xl shadow-black/80 flex items-center justify-between gap-3 text-xs animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-[11px] font-mono">
              {selectedRuleIds.length}
            </div>
            <span className="text-white font-medium">talep seçildi</span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleMultipleRules && (
              <>
                <button
                  onClick={() => handleBatchToggleActive(true)}
                  className="px-2.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  title="Seçili talepleri aktif hale getir"
                >
                  <Power className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">Aktif Et</span>
                </button>
                <button
                  onClick={() => handleBatchToggleActive(false)}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  title="Seçili talepleri durdur"
                >
                  <PowerOff className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">Durdur</span>
                </button>
              </>
            )}

            <button
              onClick={() => setIsConfirmBatchDeleteOpen(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-md shadow-red-950/40 cursor-pointer active:scale-95"
              title="Seçili talepleri sil"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Seçilenleri Sil ({selectedRuleIds.length})</span>
            </button>

            <button
              onClick={() => setSelectedRuleIds([])}
              className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Seçimi Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: Talepleri Sıfırla / Temizle Seçenekleri */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121212] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Talepleri Sıfırla</h3>
                  <p className="text-xs text-white/50">Nasıl bir sıfırlama işlemi yapmak istiyorsunuz?</p>
                </div>
              </div>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="p-1.5 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Seçenek 1: Tüm Listeyi Boşalt */}
              <div 
                onClick={() => {
                  onClearAllRules();
                  setSelectedRuleIds([]);
                  setIsResetModalOpen(false);
                }}
                className="p-4 rounded-2xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 transition-all cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between text-red-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4 text-red-400" />
                    Tüm Talepleri Sil (Listeyi Boşalt)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-600/30 text-red-200">
                    {rules.length} Talep
                  </span>
                </div>
                <p className="text-white/60 leading-relaxed">
                  Kayıtlı tüm takip kurallarını temizler. Kendi sıfır listenizle temiz bir başlangıç yapmak için uygundur.
                </p>
              </div>

              {/* Seçenek 2: Varsayılan Örneklere Dön */}
              <div 
                onClick={() => {
                  onResetRulesToDefault();
                  setSelectedRuleIds([]);
                  setIsResetModalOpen(false);
                }}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between text-white font-bold">
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    Varsayılan Örnek Taleplere Sıfırla
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                    Fabrika Ayarı
                  </span>
                </div>
                <p className="text-white/60 leading-relaxed">
                  Mevcut kuralları siler ve ilk kurulumdaki hazır örnek talepleri (MacBook Air/Pro, Vasıta, Emlak) yeniden yükler.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Seçilenleri Silme Onayı */}
      {isConfirmBatchDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121212] border border-red-500/30 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-white">Seçilen Talepleri Sil</h3>
                <p className="text-xs text-white/50">{selectedRuleIds.length} adet takip talebi silinecek.</p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              İşaretlediğiniz <b>{selectedRuleIds.length}</b> adet takip kuralı radardan kaldırılacak ve bu kriterlerde arka plan taraması durdurulacaktır. Onaylıyor musunuz?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setIsConfirmBatchDeleteOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={handleBatchDeleteConfirmed}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-950/40 cursor-pointer"
              >
                Evet, Seçilenleri Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Tekli Kural Silme Onayı */}
      {ruleToDeleteSingle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121212] border border-white/15 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-white">Talebi Sil</h3>
                <p className="text-xs text-white/50">Radar kuralı kaldırılıyor</p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              "<b>{ruleToDeleteSingle.name}</b>" talebini silmek istediğinize emin misiniz?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setRuleToDeleteSingle(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={handleSingleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-950/40 cursor-pointer"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Hızlı Bütçe Düzenleme (Sıfır Hatası Düzeltici) */}
      {ruleForQuickBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121212] border border-white/20 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white">Bütçeyi Düzenle</h3>
                  <p className="text-xs text-white/50 truncate max-w-[220px]">
                    {ruleForQuickBudget.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRuleForQuickBudget(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Price Banner */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-white/40 block">Mevcut Tavan</span>
                <span className="text-xs font-mono line-through text-white/50">
                  ₺{ruleForQuickBudget.maxPrice.toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">Yeni Tavan</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {formatPriceHuman(quickMaxPrice)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-white/70 block mb-1">
                  Maksimum Bütçe Tavanı (TL)
                </label>
                <input
                  type="number"
                  value={quickMaxPrice}
                  onChange={(e) => setQuickMaxPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/20 rounded-xl text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Zero multiplier helper buttons */}
              <div>
                <span className="text-[10.5px] text-white/50 block mb-1.5">
                  Sıfır Ekleme / Düzeltme Kısayolları:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setQuickMaxPrice(prev => prev * 10)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold transition-all cursor-pointer"
                    title="1 sıfır ekle (Örn: 300.000 TL → 3.000.000 TL)"
                  >
                    ×10 (0 Ekle)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickMaxPrice(prev => Math.floor(prev / 10))}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition-all cursor-pointer"
                    title="1 sıfır sil (Örn: 3.000.000 TL → 300.000 TL)"
                  >
                    ÷10 (0 Sil)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickMaxPrice(3000000)}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 text-xs font-mono transition-colors cursor-pointer"
                  >
                    3.000.000 ₺
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickMaxPrice(2500000)}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 text-xs font-mono transition-colors cursor-pointer"
                  >
                    2.500.000 ₺
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickMaxPrice(prev => prev + 500000)}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 text-xs font-mono transition-colors cursor-pointer"
                  >
                    +500 Bin ₺
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-white/50 block mb-1">
                  Minimum Bütçe Tabanı (TL)
                </label>
                <input
                  type="number"
                  value={quickMinPrice}
                  onChange={(e) => setQuickMinPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10 flex-wrap gap-2">
              {onEditRule && (
                <button
                  type="button"
                  onClick={() => {
                    const r = ruleForQuickBudget;
                    setRuleForQuickBudget(null);
                    onEditRule(r);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Tüm Kriterleri Düzenle</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setRuleForQuickBudget(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuickBudget}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Bütçeyi Kaydet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
