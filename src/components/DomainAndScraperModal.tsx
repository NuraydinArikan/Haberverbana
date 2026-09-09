import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  X, 
  Zap, 
  Database, 
  RefreshCw, 
  Server, 
  Radio,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { DealItem } from '../types';

interface DomainAndScraperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewDealIngested?: (deal: DealItem) => void;
  onShowToast: (msg: string) => void;
}

export const DomainAndScraperModal: React.FC<DomainAndScraperModalProps> = ({
  isOpen,
  onClose,
  onNewDealIngested,
  onShowToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'scraper' | 'domain'>('scraper');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [bridgeStats, setBridgeStats] = useState<{
    totalScraperIngests: number;
    lastScraperIngestTime: string | null;
    storedDealsCount: number;
    activeRulesCount: number;
  }>({
    totalScraperIngests: 0,
    lastScraperIngestTime: null,
    storedDealsCount: 0,
    activeRulesCount: 2
  });

  useEffect(() => {
    if (!isOpen) return;

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/scraper/status');
        if (res.ok) {
          const data = await res.json();
          setBridgeStats({
            totalScraperIngests: data.totalScraperIngests || 0,
            lastScraperIngestTime: data.lastScraperIngestTime,
            storedDealsCount: data.storedDealsCount || 0,
            activeRulesCount: data.activeRulesCount || 2
          });
        }
      } catch {
        // ignore
      }
    };

    fetchStats();
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast('Panoya kopyalandı');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSendTestScrapedDeal = async () => {
    setIsSendingTest(true);
    try {
      const sampleItem = {
        title: `Apple MacBook Pro 14" M3 Max (36GB / 1TB SSD) Kapalı Kutu [Test-${Math.floor(Math.random() * 900 + 100)}]`,
        currentPrice: 88500,
        marketAvgPrice: 114000,
        platform: 'Amazon',
        category: 'Elektronik & Bilgisayar',
        productUrl: 'https://www.amazon.com.tr',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        sellerRating: 'Amazon Lojistik (Resmi Satıcı)',
        whyForYou: 'Python Playwright botu tarafından anlık yakalandı. Piyasa ortalamasından ₺25.500 daha ucuz!',
        opportunityScore: 9.4,
        source: 'python_playwright_bot'
      };

      const res = await fetch('/api/deals/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleItem)
      });

      if (res.ok) {
        const result = await res.json();
        if (result.deal && onNewDealIngested) {
          onNewDealIngested(result.deal);
        }
        setBridgeStats(prev => ({
          ...prev,
          totalScraperIngests: prev.totalScraperIngests + 1,
          lastScraperIngestTime: new Date().toISOString(),
          storedDealsCount: prev.storedDealsCount + 1
        }));
        onShowToast('⚡ Python Botu yeni fırsatı aktardı! Ekrana eklendi.');
      } else {
        onShowToast('İstek başarısız oldu.');
      }
    } catch {
      onShowToast('Bağlantı hatası.');
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-[#0D0D0D] border border-white/15 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-red-950/30 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
              {activeSubTab === 'scraper' ? <Terminal className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-serif">
                  haberverbana<span className="text-red-500">.app</span> Entegrasyon Merkezi
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  API & DNS Aktif
                </span>
              </div>
              <p className="text-xs text-white/60">
                Python Playwright kazıyıcılarınızı bağlayın ve alan adı yönlendirmesini yönetin.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/40 px-6">
          <button
            onClick={() => setActiveSubTab('scraper')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'scraper'
                ? 'border-red-500 text-white'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>Python Scraper & SQLite Köprüsü</span>
            {bridgeStats.totalScraperIngests > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400">
                +{bridgeStats.totalScraperIngests}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('domain')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'domain'
                ? 'border-red-500 text-white'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>haberverbana.app Alan Adı & DNS</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {activeSubTab === 'scraper' ? (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div>
                    <div className="text-white font-semibold text-xs flex items-center gap-2">
                      <span>Ingestion API Ucu Açık ve Dinliyor</span>
                      <code className="text-[11px] bg-black/60 px-2 py-0.5 rounded text-emerald-300 font-mono">
                        POST /api/deals/ingest
                      </code>
                    </div>
                    <div className="text-[11px] text-white/50 mt-0.5">
                      Yerel Playwright botunuz bu adrese POST attığında kartlar canlı olarak ekrana düşer.
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSendTestScrapedDeal}
                  disabled={isSendingTest}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer disabled:opacity-50 transition-all shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-spin' : ''}`} />
                  <span>{isSendingTest ? 'Aktarılıyor...' : 'Test Verisi Gönder'}</span>
                </button>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-white/50 block">Aktarılan Canlı Fırsat</span>
                  <span className="text-lg font-mono font-bold text-white mt-1 block">
                    {bridgeStats.totalScraperIngests}
                  </span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-white/50 block">Aktif Radar Hedefleri</span>
                  <span className="text-lg font-mono font-bold text-emerald-400 mt-1 block">
                    {bridgeStats.activeRulesCount} Kural
                  </span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-white/50 block">Son Veri Gelişi</span>
                  <span className="text-xs font-mono text-white/80 mt-1.5 block truncate">
                    {bridgeStats.lastScraperIngestTime ? 'Az önce' : 'Bekleniyor'}
                  </span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-white/50 block">SQLite Desteği</span>
                  <span className="text-xs font-mono text-amber-400 mt-1.5 block">
                    haberverbana_state.db
                  </span>
                </div>
              </div>

              {/* Step 1: Run Bridge */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center text-[10px]">1</span>
                  Kendi Bilgisayarınızda Köprüyü Çalıştırma
                </h4>
                <p className="text-xs text-white/60">
                  Proje kök dizininde hazır bulunan <code className="text-white bg-white/10 px-1.5 py-0.5 rounded">scripts/haberverbana_bridge.py</code> dosyasını kendi Python ortamınızda çalıştırın:
                </p>
                <div className="p-3 bg-black/80 rounded-xl border border-white/10 font-mono text-xs text-white/90 flex items-center justify-between">
                  <code>python scripts/haberverbana_bridge.py --test</code>
                  <button
                    onClick={() => copyToClipboard('python scripts/haberverbana_bridge.py --test', 'cmd1')}
                    className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white"
                    title="Kopyala"
                  >
                    {copiedKey === 'cmd1' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Step 2: One-line scraper hook */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center text-[10px]">2</span>
                  Playwright Scraper Kodunuza Ekleme (ecommerce_scraper.py)
                </h4>
                <p className="text-xs text-white/60">
                  Playwright döngünüzde bulunan her ürünü Haberverbana ekranına göndermek için şu fonksiyonu çağırın:
                </p>
                <div className="p-3 bg-black/80 rounded-xl border border-white/10 font-mono text-[11px] text-emerald-400 relative">
                  <button
                    onClick={() => copyToClipboard(`from haberverbana_bridge import ingest_deal\n\n# Playwright ürün yakalama döngünüz:\ningest_deal(\n    title="MacBook Air M3",\n    current_price=47499,\n    platform="Amazon",\n    product_url="https://amazon.com.tr/..."\n)`, 'pyCode')}
                    className="absolute top-2 right-2 p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white"
                  >
                    {copiedKey === 'pyCode' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <pre className="overflow-x-auto text-white/80">
{`from haberverbana_bridge import ingest_deal

# Playwright ürün yakalama döngünüz:
ingest_deal(
    title="MacBook Air M3",
    current_price=47499,
    platform="Amazon",
    product_url="https://amazon.com.tr/..."
)`}
                  </pre>
                </div>
              </div>

              {/* Step 3: SQLite Sync */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center text-[10px]">3</span>
                  SQLite Veritabanınızı (haberverbana_state.db) Eşitleme
                </h4>
                <div className="p-3 bg-black/80 rounded-xl border border-white/10 font-mono text-xs text-white/90 flex items-center justify-between">
                  <code>python scripts/haberverbana_bridge.py --sync-sqlite haberverbana_state.db</code>
                  <button
                    onClick={() => copyToClipboard('python scripts/haberverbana_bridge.py --sync-sqlite haberverbana_state.db', 'cmd2')}
                    className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white"
                  >
                    {copiedKey === 'cmd2' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Domain Overview */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-blue-900/10 to-transparent border border-blue-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <h4 className="text-white font-bold text-sm">
                    haberverbana.app Alan Adı Yapılandırması
                  </h4>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Satın aldığınız <strong>haberverbana.app</strong> alan adını Cloud Run / üretim sunucunuza bağlamak için domain firmanızın (GoDaddy, Namecheap, Google Domains vb.) DNS paneline şu 2 kaydı eklemeniz yeterlidir:
                </p>
              </div>

              {/* DNS Table */}
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black/50">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-white/60 font-mono">
                    <tr>
                      <th className="p-3">Kayıt Türü</th>
                      <th className="p-3">Host / Ad</th>
                      <th className="p-3">Hedef / Değer</th>
                      <th className="p-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    <tr>
                      <td className="p-3 text-amber-400 font-bold">A</td>
                      <td className="p-3 text-white">@ (veya boş)</td>
                      <td className="p-3 text-white/90">216.239.32.21, 216.239.34.21</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => copyToClipboard('216.239.32.21', 'dnsA')}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] text-white"
                        >
                          {copiedKey === 'dnsA' ? 'Kopyalandı' : 'Kopyala'}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-blue-400 font-bold">CNAME</td>
                      <td className="p-3 text-white">www</td>
                      <td className="p-3 text-white/90">ghs.googlehosted.com.</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => copyToClipboard('ghs.googlehosted.com.', 'dnsCname')}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] text-white"
                        >
                          {copiedKey === 'dnsCname' ? 'Kopyalandı' : 'Kopyala'}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* SSL Details */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Otomatik Ücretsiz SSL / TLS Sertifikası</span>
                </div>
                <p className="text-xs text-white/70">
                  DNS kayıtlarını yönlendirdikten sonra Google Cloud, <strong className="text-white">https://haberverbana.app</strong> ve <strong className="text-white">https://www.haberverbana.app</strong> için SSL sertifikasını 15-30 dakika içinde otomatik olarak aktif hale getirir.
                </p>
              </div>

              {/* Production API URL */}
              <div className="space-y-1.5">
                <span className="text-xs text-white/60">Canlı Scraper Webhook Adresiniz:</span>
                <div className="p-3 bg-black/80 rounded-xl border border-white/10 font-mono text-xs text-white/90 flex items-center justify-between">
                  <code>https://haberverbana.app/api/deals/ingest</code>
                  <button
                    onClick={() => copyToClipboard('https://haberverbana.app/api/deals/ingest', 'prodApi')}
                    className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white"
                  >
                    {copiedKey === 'prodApi' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <span className="text-xs text-white/50 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Haberverbana Canlı Köprüsü v2.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
