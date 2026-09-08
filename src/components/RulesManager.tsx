import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Bell, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Globe,
  Search,
  ExternalLink,
  Bot,
  Zap,
  Sparkles,
  Sliders,
  Share2,
  Check
} from 'lucide-react';
import { RadarRule } from '../types';
import { buildPlatformSearchUrl, getPlatformBadgeStyle } from '../utils/searchUrlBuilder';

interface RulesManagerProps {
  rules: RadarRule[];
  onToggleRule: (ruleId: string) => void;
  onDeleteRule: (ruleId: string) => void;
  onOpenCreateRule: () => void;
  onScanRule?: (rule: RadarRule) => void;
}

export const RulesManager: React.FC<RulesManagerProps> = ({
  rules,
  onToggleRule,
  onDeleteRule,
  onOpenCreateRule,
  onScanRule
}) => {
  const [copiedRuleId, setCopiedRuleId] = useState<string | null>(null);

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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0F0F0F] border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-red-500" />
              <span>Fırsat Radarı Kurallarım</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
              7/24 Çapraz Tarama
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            "Sen Arama, O Haber Versin": Aradığınız ürünü ve bütçenizi belirleyin; radar Amazon, Trendyol, Hepsiburada ve Sahibinden'i çapraz tarasın.
          </p>
        </div>

        <button
          onClick={onOpenCreateRule}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-950/40 active:scale-95 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Yeni Radar Kuralı Ekle</span>
        </button>
      </div>

      {/* Rules List */}
      {rules.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0F0F0F] border border-white/10 space-y-3">
          <SlidersHorizontal className="w-8 h-8 text-white/20 mx-auto" />
          <h3 className="font-bold text-base text-white">Henüz Radar Kuralı Eklenmedi</h3>
          <p className="text-xs text-white/50 max-w-md mx-auto">
            Hangi ürünleri, araçları veya fırsatları takip etmek istediğinizi tanımlayarak 7/24 çapraz platform taramasını başlatın.
          </p>
          <button
            onClick={onOpenCreateRule}
            className="mt-2 px-5 py-2 bg-white text-black font-bold rounded-full text-xs"
          >
            İlk Radarını Tanımla
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => {
            const platforms = rule.platforms && rule.platforms.length > 0 
              ? rule.platforms 
              : (['Amazon', 'Hepsiburada', 'Trendyol', 'Sahibinden'] as const);
            const query = rule.searchQuery || rule.name;
            const isAutoAi = rule.platformMode === 'auto_ai' || !rule.platformMode;

            return (
              <div
                key={rule.id}
                className={`p-6 rounded-3xl border transition-all duration-200 ${
                  rule.isActive
                    ? 'bg-[#0F0F0F] border-white/15 shadow-md'
                    : 'bg-[#0a0a0a] border-white/5 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80">
                        {rule.category}
                      </span>
                      <span className="text-xs text-white/30">•</span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        Bütçe: ₺{rule.minPrice.toLocaleString('tr-TR')} — ₺{rule.maxPrice.toLocaleString('tr-TR')}
                      </span>
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
                      <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
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
                        {rule.positiveKeywords.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-white/40 text-[11px]">Pozitif:</span>
                            {rule.positiveKeywords.map((kw, i) => (
                              <span key={i} className="px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono">
                                +{kw}
                              </span>
                            ))}
                          </div>
                        )}

                        {rule.negativeKeywords.length > 0 && (
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

                  {/* Status & Actions */}
                  <div className="flex sm:flex-col items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/5 shrink-0">
                    <div className="flex items-center gap-2">
                      {onScanRule && (
                        <button
                          onClick={() => onScanRule(rule)}
                          className="px-3 py-1.5 bg-red-600/15 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
                          title="Bu kuralı şu an tüm sitelerde canlı tara"
                        >
                          <Zap className="w-3 h-3 text-red-400" />
                          <span>Şimdi Tara</span>
                        </button>
                      )}

                      <button
                        onClick={() => onToggleRule(rule.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          rule.isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/5 text-white/40 border border-white/10'
                        }`}
                      >
                        <span>{rule.isActive ? 'Aktif' : 'Durduruldu'}</span>
                      </button>

                      <button
                        onClick={() => handleShareRule(rule)}
                        className={`p-1.5 rounded-xl transition-colors ${
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

                      <button
                        onClick={() => onDeleteRule(rule.id)}
                        className="p-1.5 text-white/40 hover:text-red-400 rounded-xl hover:bg-white/5 transition-colors"
                        title="Kuralı Sil"
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
    </div>
  );
};
