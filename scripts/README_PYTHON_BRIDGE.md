# Haberverbana.app — Python Playwright Scraper & SQLite Entegrasyon Rehberi

Bu rehber, yerel bilgisayarınızdaki (`C:\Users\nuray\...`) Python Playwright kazıyıcılarınızı (`scrapers/ecommerce_scraper.py`) ve yerel SQLite veritabanınızı (`haberverbana_state.db`) yeni **Haberverbana React & Express** sistemine canlı olarak nasıl bağlayacağınızı açıklar.

---

## 1. Hızlı Başlangıç (Köprü Betiği)

`scripts/haberverbana_bridge.py` dosyasını yerel projenizin ana dizinine kopyalayın.

### Test Verisi Gönderme
```bash
python scripts/haberverbana_bridge.py --test
```
Bu komut, sisteme gerçek bir test fırsatı gönderir ve ekranda anında belirmesini sağlar.

### Radardaki Aktif Arama Linklerini ve Görevlerini Çekme
```bash
python scripts/haberverbana_bridge.py --tasks
```
React arayüzünde oluşturduğunuz kurallar için üretilen dinamik arama URL'lerini (Amazon, Sahibinden, Trendyol vb.) terminalde listeler.

### SQLite Verilerini Aktarma
```bash
python scripts/haberverbana_bridge.py --sync-sqlite haberverbana_state.db
```

---

## 2. Mevcut `ecommerce_scraper.py` Kodunuza Tek Satırla Bağlama

Mevcut Playwright botunuzun içerisine şu satırları ekleyerek bulunan her fırsatı otomatik olarak Haberverbana ekranına basabilirsiniz:

```python
from haberverbana_bridge import ingest_deal

# Playwright ürün kazıma döngünüzün içerisinde:
for product in scraped_products:
    ingest_deal(
        title=product['title'],
        current_price=product['price'],
        market_avg_price=product.get('market_price'),
        platform='Amazon', # veya 'Sahibinden', 'Trendyol' vb.
        category='Elektronik & Bilgisayar',
        product_url=product['url'],
        image_url=product.get('image'),
        seller_rating=product.get('seller')
    )
```

---

## 3. `haberverbana.app` Alan Adı Entegrasyonu (DNS & Canlı Ortam)

Alan adınızı Cloud Run / Canlı sunucuya bağlamak için domain sağlayıcınızın (Namecheap, GoDaddy vb.) DNS yönetim panelinde şu kayıtları oluşturun:

| Kayıt Tipi | Host (Ad) | Değer / Hedef | Açıklama |
|---|---|---|---|
| **A** | `@` | Cloud Run Özel IP Adresleri | Ana alan adı (`haberverbana.app`) |
| **CNAME** | `www` | `ghs.googlehosted.com.` | `www.haberverbana.app` yönlendirmesi |

SSL / TLS güvenlik sertifikası Google tarafından otomatik olarak tahsis edilir.
Canlıya geçtikten sonra Python botunuzu çalıştırmak için:
```bash
python haberverbana_bridge.py --api https://haberverbana.app --test
```
