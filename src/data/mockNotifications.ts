import { AppNotification } from '../types';
import { INITIAL_DEALS } from './mockDeals';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'deal',
    title: '🔥 Sahibinden: Tesla Model Y RWD Fırsatı Yakalandı!',
    message: '2024 model 18.000 km hatasız Tesla Model Y, piyasa ortalamasından ₺140.000 daha uygun fiyata tespit edildi.',
    timestamp: '8 dakika önce',
    createdAt: Date.now() - 8 * 60 * 1000,
    read: false,
    dealId: INITIAL_DEALS[0]?.id,
    deal: INITIAL_DEALS[0],
    platform: 'Sahibinden',
    productUrl: INITIAL_DEALS[0]?.productUrl,
    price: 2280000,
    discountRate: 6.9,
    score: 9.3
  },
  {
    id: 'notif-2',
    type: 'deal',
    title: '🔥 Amazon: Apple MacBook Air M3 Dip Fiyat!',
    message: 'Resmi Amazon satıcılı MacBook Air 16GB / 512GB ₺47.499 seviyesinde son 90 günün en düşük seviyesinde yakalandı.',
    timestamp: '15 dakika önce',
    createdAt: Date.now() - 15 * 60 * 1000,
    read: false,
    dealId: INITIAL_DEALS[1]?.id,
    deal: INITIAL_DEALS[1],
    platform: 'Amazon',
    productUrl: INITIAL_DEALS[1]?.productUrl,
    price: 47499,
    discountRate: 12.0,
    score: 9.1
  },
  {
    id: 'notif-3',
    type: 'telegram',
    title: '🔔 Telegram Bildirim Kanalı Aktif',
    message: 'Fırsat radarı bildirimleri bağlı Telegram botunuza anlık iletilmek üzere yapılandırıldı.',
    timestamp: '32 dakika önce',
    createdAt: Date.now() - 32 * 60 * 1000,
    read: true
  },
  {
    id: 'notif-4',
    type: 'scan',
    title: '🔍 Çapraz Platform Fırsat Taraması Tamamlandı',
    message: 'Amazon, Trendyol, Hepsiburada ve Sahibinden üzerinde 4 aktif radar kuralı tarandı ve piyasa fiyatları güncellendi.',
    timestamp: '1 saat önce',
    createdAt: Date.now() - 60 * 60 * 1000,
    read: true
  }
];
