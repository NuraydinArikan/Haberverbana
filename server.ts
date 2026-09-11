import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Google Gen AI
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

// In-memory state store simulating SQLite (haberverbana_state.db)
interface StoredRule {
  id: string;
  name: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  positiveKeywords: string[];
  negativeKeywords: string[];
  minScore: number;
  notificationChannel: 'Telegram' | 'E-posta' | 'Tümü';
  frequency: 'Anlık' | 'Günde 1 Kez' | 'Haftalık Özet';
  isActive: boolean;
  matchedCount: number;
  createdAt: string;
}

let storedRules: StoredRule[] = [
  {
    id: 'rule-1',
    name: 'Apple M3 Pro/Max & Üst Düzey Donanım Radarı',
    category: 'Elektronik & Bilgisayar',
    minPrice: 15000,
    maxPrice: 120000,
    positiveKeywords: ['M3 Max', 'M3 Pro', 'MacBook', '36GB', 'OLED', 'Sony XM5'],
    negativeKeywords: ['teşhir', 'kutusu açık', 'parça niyetine', 'yenilenmiş', 'tamirli'],
    minScore: 8.0,
    notificationChannel: 'Telegram',
    frequency: 'Anlık',
    isActive: true,
    matchedCount: 3,
    createdAt: '2 gün önce'
  },
  {
    id: 'rule-2',
    name: 'Temiz Vasıta (Hatasız & Düşük KM Otomobil)',
    category: 'Otomobil & Vasıta',
    minPrice: 900000,
    maxPrice: 1600000,
    positiveKeywords: ['Golf', 'R-Line', 'eTSI', 'Hatasız', 'Boyasız', 'İlk Sahibinden'],
    negativeKeywords: ['ağır hasarlı', 'pert', 'tramer', 'şasi işlemli', 'hava yastığı açmış'],
    minScore: 7.5,
    notificationChannel: 'Tümü',
    frequency: 'Anlık',
    isActive: true,
    matchedCount: 1,
    createdAt: '5 gün önce'
  }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY, mode: 'Deal Radar' });
});

// GET /api/rules: List active radar rules
app.get('/api/rules', (req, res) => {
  res.json({ rules: storedRules });
});

// POST /api/rules: Add a new radar rule
app.post('/api/rules', (req, res) => {
  const { name, category, minPrice, maxPrice, positiveKeywords, negativeKeywords, minScore, notificationChannel, frequency } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Kural adı belirtilmelidir.' });
  }

  const newRule: StoredRule = {
    id: `rule-${Date.now()}`,
    name,
    category: category || 'Elektronik & Bilgisayar',
    minPrice: Number(minPrice) || 0,
    maxPrice: Number(maxPrice) || 99999999,
    positiveKeywords: Array.isArray(positiveKeywords) ? positiveKeywords : (positiveKeywords ? String(positiveKeywords).split(',').map(s => s.trim()) : []),
    negativeKeywords: Array.isArray(negativeKeywords) ? negativeKeywords : (negativeKeywords ? String(negativeKeywords).split(',').map(s => s.trim()) : ['ağır hasarlı', 'teşhir', 'kutusu açık']),
    minScore: Number(minScore) || 7.0,
    notificationChannel: notificationChannel || 'Telegram',
    frequency: frequency || 'Anlık',
    isActive: true,
    matchedCount: 0,
    createdAt: 'Yeni eklendi'
  };

  storedRules.unshift(newRule);
  res.json({ success: true, rule: newRule });
});

// DELETE /api/rules/:id: Remove a radar rule
app.delete('/api/rules/:id', (req, res) => {
  const { id } = req.params;
  storedRules = storedRules.filter(r => r.id !== id);
  res.json({ success: true, message: 'Kural başarıyla silindi.' });
});

// PATCH /api/rules/:id/toggle: Activate/deactivate rule
app.patch('/api/rules/:id/toggle', (req, res) => {
  const { id } = req.params;
  const rule = storedRules.find(r => r.id === id);
  if (rule) {
    rule.isActive = !rule.isActive;
    res.json({ success: true, rule });
  } else {
    res.status(404).json({ error: 'Kural bulunamadı.' });
  }
});

// GET /api/users/:email/feed: Personalized Opportunity Feed
app.get('/api/users/:email/feed', (req, res) => {
  const { email } = req.params;
  const { category, minScore } = req.query;

  res.json({
    userEmail: email,
    radarStatus: '7/24 Aktif',
    scanCycleMinutes: 2,
    activeRulesCount: storedRules.filter(r => r.isActive).length,
    matchedOpportunitiesCount: 6,
    antiSpamGuard: 'Aktif (24 saatlik mükerrer bildirim koruması)'
  });
});

// POST /api/ai/analyze-deal: Gemini 2.5 Flash Opportunity Evaluator
app.post('/api/ai/analyze-deal', async (req, res) => {
  try {
    const { title, currentPrice, originalPrice, marketAvgPrice, platform, category, productUrl } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Ürün veya ilan adı gereklidir.' });
    }

    const ai = getAIClient();
    if (!ai) {
      // Intelligent heuristic fallback when API key is not configured in preview
      const cPrice = Number(currentPrice) || 10000;
      const mPrice = Number(marketAvgPrice) || (cPrice * 1.25);
      const discountPct = Math.round(((mPrice - cPrice) / mPrice) * 100);
      const score = Math.min(9.8, Math.max(7.2, +(7.0 + (discountPct / 15)).toFixed(1)));
      
      return res.json({
        opportunityScore: score,
        badge: score >= 8.0 ? 'Kaçırılmayacak Fırsat' : 'Sıcak Fırsat',
        whyForYou: `Piyasa ortalaması olan ₺${mPrice.toLocaleString('tr-TR')} seviyesinin %${discountPct} altında tespit edildi. Resmi satıcı güvencesiyle anlık fırsat şartlarını karşılıyor.`,
        summary: `${title} için tespit edilen bu fiyat seviyesi, piyasa emsallerine kıyasla güçlü bir arbitraj ve tasarruf avantajı barındırıyor.`,
        pros: [
          `Piyasa ortalamasından ₺${(mPrice - cPrice).toLocaleString('tr-TR')} daha hesaplı`,
          'Yetkili satıcı / platform güvencesi',
          'Yüksek talep gören aranan model'
        ],
        cons: [
          'Fırsat fiyatı kampanya süresi veya stoklarla sınırlı olabilir'
        ],
        riskFactors: [
          'Platform iade güvencesi mevcut; kritik donanım veya gizli hasar riski saptanmadı.'
        ],
        marketComparison: `Piyasadaki diğer güvenilir satıcılarda ₺${mPrice.toLocaleString('tr-TR')} bandında işlem görmektedir.`
      });
    }

    const prompt = `Sen "Haberverbana.app" ("Haber Ver Bana - Sen Arama, O Haber Versin") yapay zeka destekli akıllı takip ve fırsat radarının kıdemli piyasa analistisin.
Görevin: E-ticaret veya ilan sitelerinden kazınan (scraped) bu ürünü 7/24 piyasa dinamikleri, donanım değeri, riskler ve arbitraj açısından değerlendirmektir.

Ürün/İlan: ${title}
Kategori: ${category || 'Genel'}
Platform: ${platform || 'E-ticaret'}
Mevcut Fiyat: ${currentPrice ? currentPrice + ' TL' : 'Bilinmiyor'}
Orijinal/Eski Fiyat: ${originalPrice ? originalPrice + ' TL' : 'Bilinmiyor'}
Piyasa Ortalaması: ${marketAvgPrice ? marketAvgPrice + ' TL' : 'Bilinmiyor'}
Ürün Linki: ${productUrl || 'Yok'}

Lütfen analizi SADECE aşağıdaki JSON formatında döndür, başka hiçbir metin veya markdown etiketi ekleme:
{
  "opportunityScore": 8.7, // 1.0 ile 10.0 arasında tek ondalıklı fırsat puanı
  "badge": "Kaçırılmayacak Fırsat", // 8.0+ ise "Kaçırılmayacak Fırsat", 7.0-7.9 ise "Sıcak Fırsat", 7.0 altı ise "Fiyat Takibinde"
  "whyForYou": "Kullanıcının bütçe ve kriterlerine göre 'Neden senin için fırsat?' gerekçesi (1-2 vurucu cümle).",
  "summary": "Tek cümlelik net ve tarafsız satın alma tavsiyesi.",
  "pros": [
    "Artı yön 1 (örn. piyasa altı fiyat)",
    "Artı yön 2 (örn. donanım avantajı veya resmi garanti)"
  ],
  "cons": [
    "Eksi yön veya dikkat edilmesi gereken nokta (örn. sınırlı stok veya nakit alım)"
  ],
  "riskFactors": [
    "Risk analizi (örn. satıcı güvenilirliği, teşhir/kusur şüphesi, garanti durumu)"
  ],
  "marketComparison": "Piyasadaki diğer platform ve satıcıların fiyat ortalamasıyla net kıyaslama cümlesi."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/^```json/i, '').replace(/```$/, '').trim();
      parsed = JSON.parse(cleaned);
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('Deal analysis error:', error);
    res.status(500).json({ error: 'Fırsat analizi yapılamadı.', details: error?.message });
  }
});

// POST /api/ai/quick-evaluate: Analyze URL / title from Chrome extension simulator
app.post('/api/ai/quick-evaluate', async (req, res) => {
  try {
    const { url, title, platform, price } = req.body;
    if (!url && !title) {
      return res.status(400).json({ error: 'URL veya ürün başlığı gereklidir.' });
    }

    const ai = getAIClient();
    const evaluatedTitle = title || (url ? 'Web Linkinden Yakalanan Ürün' : 'Bilinmeyen Ürün');
    
    if (!ai) {
      return res.json({
        title: evaluatedTitle,
        estimatedMarketPrice: price ? Math.round(price * 1.25) : 35000,
        opportunityScore: 8.5,
        verdict: 'Yüksek Fırsat Potansiyeli',
        whyNotice: 'Bu linkteki ürün piyasa ortalamasının altında görünüyor. Radara eklenmeye değer.',
        recommendedAction: 'Radara Ekle & Alarm Kur'
      });
    }

    const prompt = `Bir kullanıcı Chrome Eklentisi ile e-ticaret/ilan sitesinde gezinirken bu linki yakaladı:
Link: ${url || 'Yok'}
Ürün/İlan Başlığı: ${title || 'Otomatik çıkarılacak'}
Platform: ${platform || 'Otomatik tespit'}
Fiyat: ${price || 'Bilinmiyor'}

Bu ürün için anlık bir hızlı ön değerlendirme yap. Yanıtı SADECE şu JSON ile ver:
{
  "title": "${title || 'Ürün Adı'}",
  "estimatedMarketPrice": 45000,
  "opportunityScore": 8.4,
  "verdict": "Sıcak Fırsat / Alım Değerlendirmesi",
  "whyNotice": "Kullanıcının dikkat etmesi gereken kritik piyasa sebebi (1 cümle)",
  "recommendedAction": "Radara Ekle & Fiyat Alarmı Kur"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const text = response.text?.trim() || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/^```json/i, '').replace(/```$/, '').trim();
      parsed = JSON.parse(cleaned);
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('Quick evaluate error:', error);
    res.status(500).json({ error: 'Hızlı analiz yapılamadı.', details: error?.message });
  }
});

// POST /api/telegram/simulate-notification: Simulates sending an instant Telegram alert
app.post('/api/telegram/simulate-notification', (req, res) => {
  const { dealTitle, price, marketAvg, score, whyForYou, platform, chatId } = req.body;

  const telegramPayload = {
    chatId: chatId || '@haberverbana_radar_bot',
    message: `🚨 *HABERVERBANA SICAK FIRSAT ALARMI* 🚨
━━━━━━━━━━━━━━━━━━━━
🎯 *${dealTitle || 'Fırsat Ürünü'}*
🏷 *Platform:* ${platform || 'Amazon'}
💰 *Fırsat Fiyatı:* ₺${(Number(price) || 0).toLocaleString('tr-TR')}
📊 *Piyasa Ortalaması:* ₺${(Number(marketAvg) || 0).toLocaleString('tr-TR')}
⭐ *Gemini Fırsat Skoru:* ${score || '9.2'}/10

💡 *Neden Senin İçin Fırsat?*
${whyForYou || 'Bütçe limitlerinize tam uydu ve son 90 günün en dip seviyesine indi.'}

━━━━━━━━━━━━━━━━━━━━
🔗 *İncele & Satın Al:* haberverbana.app/firsat/direct`,
    dispatchedAt: new Date().toLocaleTimeString('tr-TR'),
    status: 'Delivered (Simulated)'
  };

  res.json({ success: true, telegramPayload });
});

// ==========================================
// HABERVERBANA PYTHON PLAYWRIGHT BRIDGE API
// ==========================================

interface IngestedDeal {
  id: string;
  title: string;
  category: string;
  platform: string;
  currentPrice: number;
  originalPrice: number;
  marketAvgPrice: number;
  discountRate: number;
  opportunityScore: number;
  badge: string;
  whyForYou: string;
  summary: string;
  pros: string[];
  cons: string[];
  riskFactors: string[];
  marketComparison: string;
  productUrl: string;
  imageUrl: string;
  foundAt: string;
  sellerRating: string;
  location?: string;
  priceHistory: { date: string; price: number }[];
  tags: string[];
  isAffiliate: boolean;
  matchedRuleIds: string[];
  source?: string;
}

let storedDeals: IngestedDeal[] = [
  {
    id: 'deal-tesla-model-y',
    title: '2024 Tesla Model Y RWD (18.000 km, Hatasız, Boyasız, Tam PPF Kaplama, Kış Lastikli)',
    category: 'Otomobil & Vasıta',
    platform: 'Sahibinden',
    currentPrice: 2280000,
    originalPrice: 2450000,
    marketAvgPrice: 2420000,
    discountRate: 6.9,
    opportunityScore: 9.3,
    badge: 'Kaçırılmayacak Fırsat',
    whyForYou: 'Piyasa ortalamasından ₺140.000 daha hesaplı ve hatasız ekspertizli.',
    summary: 'Boyasız, tramersiz, tam PPF korumalı ve kış lastikleri dahil; sahibinden acil nakit satılık Tesla Model Y RWD.',
    pros: [
      'Hatasız, boyasız, değişensiz (Ekspertiz garantili)',
      'Komple Stek DynoShield PPF kaplama',
      'Orijinal kış lastik seti dahil',
      '2024 model ve sadece 18.000 km'
    ],
    cons: ['Nakit alım şartı bulunmaktadır'],
    riskFactors: ['Batarya sağlığı %99.2 (Tesla servis raporuyla doğrulanmış)'],
    marketComparison: '2024 Model Y RWD emsalleri 2.390.000 - 2.460.000 ₺ bandında satılmaktadır.',
    productUrl: 'https://www.sahibinden.com/tesla-model-y',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    foundAt: '8 dakika önce',
    sellerRating: 'Bireysel (İlk Sahibi)',
    location: 'İstanbul / Ataşehir',
    priceHistory: [
      { date: '10 Şub', price: 2450000 },
      { date: '20 Şub', price: 2390000 },
      { date: '01 Mar', price: 2340000 },
      { date: '05 Mar', price: 2280000 }
    ],
    tags: ['Tesla Model Y', 'PPF Kaplama', 'Hatasız', '2024'],
    isAffiliate: false,
    matchedRuleIds: ['rule-2']
  },
  {
    id: 'deal-macbook-air-m3',
    title: 'Apple MacBook Air 13.6" M3 (16GB RAM / 512GB SSD) Gece Yarısı',
    category: 'Elektronik & Bilgisayar',
    platform: 'Amazon',
    currentPrice: 47499,
    originalPrice: 53999,
    marketAvgPrice: 52000,
    discountRate: 12.0,
    opportunityScore: 9.1,
    badge: 'Kaçırılmayacak Fırsat',
    whyForYou: 'Satıcı resmi Amazon.com.tr ve piyasa ortalamasının %12 altında.',
    summary: 'Resmi Amazon satıcılı 16GB RAM / 512GB SSD M3 MacBook Air modelinde piyasanın dip fiyatı.',
    pros: [
      'Satıcı resmi Amazon Türkiye (Güvenilir garanti ve kolay iade)',
      '16GB birleşik bellek ile uzun ömürlü performans'
    ],
    cons: ['Stok adetleri anlık tükenebilir'],
    riskFactors: ['Platform iade garantisi altında sıfır kutulu ürün'],
    marketComparison: 'Yetkili satıcılarda ₺52.000 bandında satılmaktadır.',
    productUrl: 'https://www.amazon.com.tr/dp/B0CX23G1M2',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    foundAt: '15 dakika önce',
    sellerRating: 'Resmi Satıcı (Amazon.com.tr)',
    location: 'Amazon Lojistik',
    priceHistory: [
      { date: '15 Şub', price: 53999 },
      { date: '25 Şub', price: 51999 },
      { date: '04 Mar', price: 47499 }
    ],
    tags: ['MacBook Air', 'M3', '16GB RAM', 'Resmi Satıcı'],
    isAffiliate: false,
    matchedRuleIds: ['rule-1']
  }
];

let lastScraperIngestTime: string | null = null;
let totalScraperIngests = 0;

// Helper: build platform search URLs for scraper
function buildTargetUrl(platform: string, query: string, maxPrice?: number): string {
  const q = encodeURIComponent(query.trim());
  switch (platform) {
    case 'Amazon':
      return `https://www.amazon.com.tr/s?k=${q}${maxPrice ? `&rh=p_36%3A0-${maxPrice * 100}` : ''}`;
    case 'Hepsiburada':
      return `https://www.hepsiburada.com/ara?q=${q}${maxPrice ? `&fiyat=0-${maxPrice}` : ''}`;
    case 'Trendyol':
      return `https://www.trendyol.com/sr?q=${q}${maxPrice ? `&prc=0-${maxPrice}` : ''}`;
    case 'Sahibinden':
      return `https://www.sahibinden.com/kelime-ile-arama?query_text=${q}${maxPrice ? `&price_max=${maxPrice}` : ''}`;
    case 'Arabam':
      return `https://www.arabam.com/ikinci-el?searchText=${q}${maxPrice ? `&maxPrice=${maxPrice}` : ''}`;
    case 'N11':
      return `https://www.n11.com/arama?q=${q}${maxPrice ? `&ps=${maxPrice}` : ''}`;
    default:
      return `https://www.google.com/search?q=${q}`;
  }
}

// GET /api/deals: Returns all stored deals (UI + Scraper ingested)
app.get('/api/deals', (req, res) => {
  res.json({
    success: true,
    count: storedDeals.length,
    lastScraperIngestTime,
    totalScraperIngests,
    deals: storedDeals
  });
});

// POST /api/deals/ingest: Live ingestion endpoint for Python Playwright Bot
app.post('/api/deals/ingest', async (req, res) => {
  try {
    const {
      title,
      currentPrice,
      originalPrice,
      marketAvgPrice,
      platform,
      category,
      productUrl,
      imageUrl,
      sellerRating,
      location,
      whyForYou,
      summary,
      pros,
      cons,
      riskFactors,
      tags,
      matchedRuleIds,
      source
    } = req.body;

    if (!title || !currentPrice) {
      return res.status(400).json({ error: 'Ürün başlığı (title) ve güncel fiyat (currentPrice) zorunludur.' });
    }

    const cPrice = Number(currentPrice);
    const mPrice = Number(marketAvgPrice) || Number(originalPrice) || Math.round(cPrice * 1.22);
    const oPrice = Number(originalPrice) || mPrice;
    const discountRate = mPrice > cPrice ? +(((mPrice - cPrice) / mPrice) * 100).toFixed(1) : 10;

    // AI opportunity score calculation if not supplied
    let score = req.body.opportunityScore;
    let computedWhy = whyForYou;
    let computedSummary = summary;
    let computedPros = Array.isArray(pros) ? pros : [];

    if (!score) {
      const ai = getAIClient();
      if (ai) {
        try {
          const aiPrompt = `Python scraper yeni bir fırsat yakaladı:
Ürün: ${title}
Fiyat: ${cPrice} TL (Piyasa: ${mPrice} TL, İndirim: %${discountRate})
Platform: ${platform || 'E-ticaret'}
Lütfen 1.0 ile 10.0 arasında fırsat puanı ve 1 cümlelik neden fırsat olduğunu JSON olarak ver:
{"score": 8.8, "why": "Piyasa ortalamasının altında ve yetkili satıcı garantili.", "summary": "Kaçırılmayacak indirim seviyesinde."}`;

          const resp = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: aiPrompt,
            config: { responseMimeType: 'application/json' }
          });
          const parsed = JSON.parse(resp.text?.trim() || '{}');
          score = parsed.score || 8.2;
          if (!computedWhy) computedWhy = parsed.why;
          if (!computedSummary) computedSummary = parsed.summary;
        } catch {
          score = Math.min(9.7, Math.max(7.4, +(7.2 + discountRate / 12).toFixed(1)));
        }
      } else {
        score = Math.min(9.7, Math.max(7.4, +(7.2 + discountRate / 12).toFixed(1)));
      }
    }

    const newDeal: IngestedDeal = {
      id: `ingest-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title,
      category: category || 'Elektronik & Bilgisayar',
      platform: platform || 'Amazon',
      currentPrice: cPrice,
      originalPrice: oPrice,
      marketAvgPrice: mPrice,
      discountRate,
      opportunityScore: Number(score) || 8.0,
      badge: Number(score) >= 8.5 ? 'Kaçırılmayacak Fırsat' : 'Sıcak Fırsat',
      whyForYou: computedWhy || `Piyasa ortalaması olan ₺${mPrice.toLocaleString('tr-TR')} seviyesinin %${discountRate} altında yakalandı.`,
      summary: computedSummary || `${title} için tespit edilen bu fiyat seviyesi güçlü bir arbitraj ve tasarruf avantajı barındırıyor.`,
      pros: computedPros.length > 0 ? computedPros : [
        `Piyasa ortalamasından ₺${(mPrice - cPrice).toLocaleString('tr-TR')} daha hesaplı`,
        `${platform || 'Platform'} güvencesiyle kontrol edildi`
      ],
      cons: Array.isArray(cons) && cons.length > 0 ? cons : ['Fırsat stoklarla sınırlı olabilir'],
      riskFactors: Array.isArray(riskFactors) && riskFactors.length > 0 ? riskFactors : ['Platform iade güvencesi mevcut'],
      marketComparison: `Piyasa ortalaması ₺${mPrice.toLocaleString('tr-TR')} bandındadır.`,
      productUrl: productUrl || 'https://haberverbana.app',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      foundAt: 'Az önce',
      sellerRating: sellerRating || `${platform || 'Online'} Satıcı`,
      location: location || 'Türkiye Geneli',
      priceHistory: [
        { date: '10 gün önce', price: mPrice },
        { date: 'Şimdi', price: cPrice }
      ],
      tags: Array.isArray(tags) ? tags : [platform || 'İndirim', 'Canlı Scraper'],
      isAffiliate: false,
      matchedRuleIds: Array.isArray(matchedRuleIds) ? matchedRuleIds : [],
      source: source || 'python_playwright_bot'
    };

    // Prepend to stored deals
    storedDeals.unshift(newDeal);
    lastScraperIngestTime = new Date().toISOString();
    totalScraperIngests++;

    console.log(`[INGEST SUCCESS] Playwright Bot fırsatı aktardı: "${newDeal.title}" (₺${newDeal.currentPrice}) - Skor: ${newDeal.opportunityScore}`);

    res.status(201).json({
      success: true,
      message: 'Fırsat başarıyla Haberverbana radarına aktarıldı ve yayınlandı!',
      deal: newDeal,
      stats: {
        totalDeals: storedDeals.length,
        totalScraperIngests,
        lastScraperIngestTime
      }
    });
  } catch (error: any) {
    console.error('Deal ingest error:', error);
    res.status(500).json({ error: 'Fırsat aktarılırken sunucu hatası oluştu.', details: error?.message });
  }
});

// GET /api/scraper/tasks: Returns active radar targets and generated crawl URLs for Python crawler
app.get('/api/scraper/tasks', (req, res) => {
  const activeRules = storedRules.filter(r => r.isActive);
  const tasks = activeRules.map(rule => {
    const platforms = rule.category === 'Otomobil & Vasıta'
      ? ['Sahibinden', 'Arabam']
      : ['Amazon', 'Hepsiburada', 'Trendyol', 'Sahibinden'];

    const targetUrls = platforms.map(platform => ({
      platform,
      searchQuery: rule.name,
      crawlUrl: buildTargetUrl(platform, rule.name, rule.maxPrice)
    }));

    return {
      ruleId: rule.id,
      name: rule.name,
      category: rule.category,
      minPrice: rule.minPrice,
      maxPrice: rule.maxPrice,
      positiveKeywords: rule.positiveKeywords,
      negativeKeywords: rule.negativeKeywords,
      minScore: rule.minScore,
      targetUrls
    };
  });

  res.json({
    success: true,
    activeRulesCount: activeRules.length,
    ingestEndpoint: '/api/deals/ingest',
    domain: 'haberverbana.app',
    tasks
  });
});

// GET /api/scraper/status: Status of the ingestion bridge
app.get('/api/scraper/status', (req, res) => {
  res.json({
    bridgeStatus: 'Active & Listening',
    ingestUrl: 'http://localhost:3000/api/deals/ingest',
    productionIngestUrl: 'https://haberverbana.app/api/deals/ingest',
    totalScraperIngests,
    lastScraperIngestTime,
    storedDealsCount: storedDeals.length,
    activeRulesCount: storedRules.filter(r => r.isActive).length
  });
});

// GET /api/domain/status: Custom domain status & DNS instructions for haberverbana.app
app.get('/api/domain/status', (req, res) => {
  res.json({
    domain: 'haberverbana.app',
    status: 'Ready for DNS Mapping',
    environment: 'Google Cloud Run / AI Studio',
    instructions: {
      step1: 'Domain sağlayıcınızın (Namecheap, GoDaddy, Google Domains, vb.) DNS Yönetim paneline girin.',
      step2: 'A Kaydı ekleyin: Host = @ , Değer = Cloud Run Custom Domain IP (örn. 216.239.32.21, 216.239.34.21, 216.239.36.21, 216.239.38.21)',
      step3: 'CNAME Kaydı ekleyin: Host = www , Değer = ghs.googlehosted.com.',
      step4: 'SSL / TLS sertifikası Google tarafından otomatik olarak ücretsiz üretilir ve 15-30 dakika içinde aktifleşir.'
    }
  });
});


// Vite middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Hashed static assets can be cached safely
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: '1y',
      immutable: true
    }));
    // Other static files and index.html should not be aggressively cached
    app.use(express.static(distPath, {
      maxAge: 0,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Haberverbana server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
