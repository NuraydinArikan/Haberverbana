# ⚡ Haberverbana — haberverbana.app

> **"Sen Arama, O Haber Versin"**  
> E-ticaret ve ilan platformlarında 7/24 piyasayı tarayıp kriterlere uyan gerçek fırsatları tespit eden Yapay Zeka Destekli Akıllı Takip ve Fırsat Radarı.

[![Website](https://img.shields.io/badge/Canlı%20Site-haberverbana.app-E11D48?style=for-the-badge&logo=google-chrome&logoColor=white)](https://haberverbana.app)
[![React](https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Python Scraper](https://img.shields.io/badge/Python-Playwright_Bridge-3776AB?style=for-the-badge&logo=python&logoColor=white)](scripts/README_PYTHON_BRIDGE.md)

---

## 🎯 Proje Hakkında

**Haberverbana**, kullanıcının aradığı ürünleri (MacBook, iPhone, temiz 2. el otomobil, ekran kartı vb.) tek tek e-ticaret sitelerinde saatlerce araması yerine; belirlediği bütçe, anahtar kelime ve filtre kurallarına göre piyasayı tarayan, yapay zeka ile arbitraj ve fırsat puanı hesaplayıp anında Telegram veya web bildirimleriyle haber veren akıllı bir takip ekosistemidir.

Canlı adres: **[https://haberverbana.app](https://haberverbana.app)**

---

## ✨ Öne Çıkan Özellikler

- **🤖 AI Fırsat Puanlama (Gemini Destekli):** Tespit edilen ürünlerin güncel fiyatı ile piyasa emsal fiyatını kıyaslayarak 1.0 - 10.0 arası yapay zeka fırsat skoru ve neden fırsat olduğunu özetleyen gerekçelendirme sunar.
- **🔍 Otomatik Platform Arama Linki Üretici:** Kullanıcının kuralına göre tek tıkla Amazon, Sahibinden, Trendyol, Hepsiburada, Arabam ve N11 üzerinde filtrelenmiş arama linkleri üretir.
- **🐍 Python Playwright & SQLite Köprüsü:** Yerel bilgisayardaki Playwright kazıyıcılarından (`ecommerce_scraper.py`) ve yerel SQLite veritabanından (`haberverbana_state.db`) web arayüzüne tek satırda canlı veri akışı sağlar.
- **📱 Telegram Entegrasyonu:** Yakalanan kritik fırsatları bot üzerinden kullanıcının Telegram kanalına/sohbetine otomatik şablonla gönderir.
- **🖱️ Bağlamsal Hızlı Menü (Context Menu):** Fırsat kartlarına sağ tıklayarak veya 3 nokta butonuna basarak linki kopyalama, doğrudan satıcı platformuna gitme ve paylaşma imkanı.
- **🌓 Midnight & Yüksek Kontrast:** Gece ve aydınlık mod arasında kusursuz geçiş.

---

## 🚀 Hızlı Başlangıç (Geliştirici Ortamı)

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/nuraydinarikan/haberverbana.git
cd haberverbana
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Uygulama `http://localhost:3000` adresinde çalışmaya başlayacaktır.

### 4. Üretim İçin Derleme (Build)
```bash
npm run build
```

---

## 🐍 Python Playwright Scraper Entegrasyonu

Proje içerisinde yer alan `scripts/haberverbana_bridge.py` köprü betiği sayesinde kendi Python botunuzu tek satır kodla arayüze bağlayabilirsiniz:

```bash
# Test fırsatı göndermek için:
python scripts/haberverbana_bridge.py --test

# Radardaki aktif arama görevlerini ve linkleri çekmek için:
python scripts/haberverbana_bridge.py --tasks

# Yerel SQLite veritabanındaki fırsatları aktarmak için:
python scripts/haberverbana_bridge.py --sync-sqlite haberverbana_state.db
```

### Kendi Playwright Kodunuza Ekleme:
```python
from haberverbana_bridge import ingest_deal

# Bulunan her ürünü Haberverbana radarına aktarın:
ingest_deal(
    title="Apple MacBook Air M3 16GB",
    current_price=47499,
    market_avg_price=52000,
    platform="Amazon",
    product_url="https://amazon.com.tr/..."
)
```

Detaylı entegrasyon kılavuzu için: [`scripts/README_PYTHON_BRIDGE.md`](scripts/README_PYTHON_BRIDGE.md)

---

## 🛠️ Teknoloji Yığını

| Alan | Teknolojiler |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Backend & API** | Node.js, Express, Google GenAI SDK (Gemini 2.5 Flash) |
| **Scraper Köprüsü** | Python 3, Playwright, SQLite3 |
| **Dağıtım (CI/CD)** | GitHub Actions, GitHub Pages, Cloud Run |
| **Alan Adı & DNS** | Cloudflare DNS, Porkbun, haberverbana.app |

---

## 📄 Lisans

Bu proje MIT lisansı altında korunmaktadır. © 2026 [Haberverbana](https://haberverbana.app)
