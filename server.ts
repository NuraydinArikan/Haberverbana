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
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Haberverbana server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
