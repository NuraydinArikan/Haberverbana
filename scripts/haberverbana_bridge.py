#!/usr/bin/env python3
"""
Haberverbana.app — Python Playwright Scraper & SQLite Entegrasyon Köprüsü
=======================================================================
Bu betik, yerel bilgisayarınızdaki (C:\\Users\\nuray\\...) Python Playwright botunun
(scrapers/ecommerce_scraper.py) ve yerel veritabanınızın (haberverbana_state.db)
Haberverbana React ön yüzü ve Express API sunucusu ile canlı konuşmasını sağlar.

Kullanım:
    python haberverbana_bridge.py --test            # Test fırsatı gönderir
    python haberverbana_bridge.py --tasks           # Radardaki aktif arama görevlerini çeker
    python haberverbana_bridge.py --sync-sqlite     # SQLite'taki verileri Haberverbana'ya aktarır
"""

import sys
import os
import json
import sqlite3
import urllib.request
import urllib.error

# Varsayılan API Adresi (Yerel geliştirme veya canlı alan adı)
DEFAULT_API_BASE = os.environ.get("HABERVERBANA_API_URL", "http://localhost:3000")
# Canlıya geçildiğinde: "https://haberverbana.app"


def send_http_post(endpoint: str, payload: dict, api_base: str = DEFAULT_API_BASE) -> dict:
    """Haberverbana API'sine POST isteği gönderir (harici kütüphane gerektirmez)."""
    url = f"{api_base.rstrip('/')}{endpoint}"
    data_bytes = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data_bytes,
        headers={"Content-Type": "application/json", "User-Agent": "Haberverbana-Python-Scraper-Bot/1.0"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res_body = response.read().decode("utf-8")
            return json.loads(res_body)
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8")
        print(f"[-] HTTP Hatası ({e.code}): {err_msg}")
        return {"error": True, "status": e.code, "message": err_msg}
    except Exception as e:
        print(f"[-] Bağlantı Hatası: {e}")
        return {"error": True, "message": str(e)}


def send_http_get(endpoint: str, api_base: str = DEFAULT_API_BASE) -> dict:
    """Haberverbana API'sine GET isteği gönderir."""
    url = f"{api_base.rstrip('/')}{endpoint}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Haberverbana-Python-Scraper-Bot/1.0"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res_body = response.read().decode("utf-8")
            return json.loads(res_body)
    except Exception as e:
        print(f"[-] GET Hatası ({url}): {e}")
        return {"error": True, "message": str(e)}


def ingest_deal(
    title: str,
    current_price: float,
    market_avg_price: float = None,
    original_price: float = None,
    platform: str = "Amazon",
    category: str = "Elektronik & Bilgisayar",
    product_url: str = "https://haberverbana.app",
    image_url: str = None,
    seller_rating: str = "Yetkili Satıcı",
    why_for_you: str = None,
    opportunity_score: float = None,
    api_base: str = DEFAULT_API_BASE
) -> dict:
    """
    Playwright veya diğer kazıyıcılarınızın bulduğu yeni fırsatı tek satırda
    Haberverbana canlı ekranına basmak için kullanabileceğiniz fonksiyon.
    """
    payload = {
        "title": title,
        "currentPrice": current_price,
        "marketAvgPrice": market_avg_price or round(current_price * 1.25),
        "originalPrice": original_price or market_avg_price or round(current_price * 1.25),
        "platform": platform,
        "category": category,
        "productUrl": product_url,
        "imageUrl": image_url,
        "sellerRating": seller_rating,
        "whyForYou": why_for_you,
        "opportunityScore": opportunity_score,
        "source": "python_playwright_bot"
    }

    print(f"[*] Fırsat Haberverbana API'sine aktarılıyor: {title} (₺{current_price:,.0f})")
    res = send_http_post("/api/deals/ingest", payload, api_base=api_base)
    if not res.get("error"):
        print(f"[+] Başarıyla radara eklendi! Skor: {res.get('deal', {}).get('opportunityScore', 'N/A')}")
    return res


def fetch_scraper_tasks(api_base: str = DEFAULT_API_BASE) -> list:
    """Haberverbana arayüzünden kullanıcının aktif kurallarını ve üretilen arama linklerini çeker."""
    print(f"[*] Aktif radar kuralları ve arama linkleri çekiliyor ({api_base})...")
    res = send_http_get("/api/scraper/tasks", api_base=api_base)
    if res.get("success"):
        tasks = res.get("tasks", [])
        print(f"[+] {len(tasks)} adet aktif radar görevi alındı.")
        for t in tasks:
            print(f"    - Kural: {t.get('name')} | Bütçe: ₺{t.get('minPrice', 0):,} - ₺{t.get('maxPrice', 0):,}")
            for u in t.get("targetUrls", []):
                print(f"      * [{u.get('platform')}]: {u.get('crawlUrl')}")
        return tasks
    else:
        print("[-] Görevler çekilemedi:", res)
        return []


def sync_from_sqlite(sqlite_path: str = "haberverbana_state.db", api_base: str = DEFAULT_API_BASE):
    """
    C:\\Users\\nuray\\... klasöründeki mevcut haberverbana_state.db veritabanını tarar
    ve kayıtlı fırsatları Haberverbana React ekranına yükler.
    """
    # Veritabanını mevcut dizinde veya bir üst dizinde ara
    possible_paths = [
        sqlite_path,
        os.path.join("..", sqlite_path),
        os.path.expanduser(os.path.join("~", "haberverbana_state.db"))
    ]
    db_file = None
    for p in possible_paths:
        if os.path.exists(p):
            db_file = p
            break

    if not db_file:
        print(f"[-] SQLite veritabanı bulunamadı ({sqlite_path}).")
        print("    İpucu: Dosya yolunu doğrudan parametre vererek çalıştırabilirsiniz:")
        print("    python haberverbana_bridge.py --sync-sqlite C:\\Users\\nuray\\...\\haberverbana_state.db")
        return

    print(f"[*] SQLite veritabanı açılıyor: {db_file}")
    conn = sqlite3.connect(db_file)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:
        # Tabloları listele
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        print(f"[+] Veritabanı tabloları: {tables}")

        target_table = None
        for cand in ["deals", "firsatlar", "scraped_items", "products"]:
            if cand in tables:
                target_table = cand
                break
        
        if not target_table and tables:
            target_table = tables[0]

        if not target_table:
            print("[-] Uygun veri tablosu bulunamadı.")
            return

        cursor.execute(f"SELECT * FROM {target_table} LIMIT 50;")
        rows = cursor.fetchall()
        print(f"[+] '{target_table}' tablosundan {len(rows)} kayıt bulundu. Aktarılıyor...")

        count = 0
        for r in rows:
            d = dict(r)
            title = d.get("title") or d.get("name") or d.get("urun_adi") or "İsimsiz Ürün"
            price = d.get("current_price") or d.get("price") or d.get("fiyat") or 1000
            platform = d.get("platform") or d.get("kaynak") or "Amazon"
            url = d.get("product_url") or d.get("url") or d.get("link") or "https://haberverbana.app"

            ingest_deal(
                title=str(title),
                current_price=float(price),
                platform=str(platform),
                product_url=str(url),
                api_base=api_base
            )
            count += 1

        print(f"[✔] Tamamlandı! {count} adet fırsat SQLite'tan Haberverbana radarına aktarıldı.")

    except Exception as e:
        print(f"[-] SQLite okuma hatası: {e}")
    finally:
        conn.close()


def send_test_deal(api_base: str = DEFAULT_API_BASE):
    """Hızlı test fırsatı oluşturur ve sunucuya gönderir."""
    print(f"[*] Test fırsatı gönderiliyor ({api_base})...")
    res = ingest_deal(
        title="Apple MacBook Pro 14\" M3 Max (36GB RAM / 1TB SSD) Uzay Siyahı (Kapalı Kutu)",
        current_price=89999,
        market_avg_price=118000,
        platform="Hepsiburada",
        category="Elektronik & Bilgisayar",
        product_url="https://www.hepsiburada.com",
        seller_rating="Hepsiburada Resmi Mağaza",
        why_for_you="Piyasa emsallerinden tam ₺28.000 daha hesaplı yakalandı. M3 Max 36GB konfigürasyonunda son 6 ayın dip fiyatı.",
        opportunity_score=9.4,
        api_base=api_base
    )
    return res


if __name__ == "__main__":
    api_url = DEFAULT_API_BASE
    # Argüman kontrolü
    args = sys.argv[1:]

    if "--api" in args:
        idx = args.index("--api")
        if idx + 1 < len(args):
            api_url = args[idx + 1]

    if "--tasks" in args:
        fetch_scraper_tasks(api_base=api_url)
    elif "--sync-sqlite" in args:
        db_p = "haberverbana_state.db"
        idx = args.index("--sync-sqlite")
        if idx + 1 < len(args) and not args[idx + 1].startswith("--"):
            db_p = args[idx + 1]
        sync_from_sqlite(sqlite_path=db_p, api_base=api_url)
    elif "--test" in args or not args:
        send_test_deal(api_base=api_url)
        print("\nİpuçları:")
        print("  - Görevleri listelemek için: python haberverbana_bridge.py --tasks")
        print("  - SQLite'tan aktarmak için:  python haberverbana_bridge.py --sync-sqlite <dosya.db>")
        print("  - Canlı sunucuya göndermek: python haberverbana_bridge.py --api https://haberverbana.app --test")
