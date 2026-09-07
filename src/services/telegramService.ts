import { DealItem } from '../types';

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

const STORAGE_KEY_TOKEN = 'haberverbana_telegram_token';
const STORAGE_KEY_CHAT_ID = 'haberverbana_telegram_chat_id';

// Default bot token if user doesn't specify one, or empty
export const getStoredTelegramConfig = (): TelegramConfig => {
  return {
    botToken: localStorage.getItem(STORAGE_KEY_TOKEN) || '',
    chatId: localStorage.getItem(STORAGE_KEY_CHAT_ID) || ''
  };
};

export const saveStoredTelegramConfig = (config: TelegramConfig) => {
  if (config.botToken) {
    localStorage.setItem(STORAGE_KEY_TOKEN, config.botToken.trim());
  }
  if (config.chatId) {
    localStorage.setItem(STORAGE_KEY_CHAT_ID, config.chatId.trim());
  }
};

export const formatTelegramHtmlMessage = (deal: DealItem): string => {
  const stars = '⭐'.repeat(Math.min(10, Math.max(1, Math.round(deal.opportunityScore))));
  const discountText = deal.discountRate ? `(🔥 %${deal.discountRate} İndirim / Piyasa Ort: ${deal.marketAvgPrice.toLocaleString('tr-TR')} TL)` : '';
  
  let prosText = '';
  if (deal.pros && deal.pros.length > 0) {
    prosText = '\n<b>Öne Çıkanlar:</b>\n' + deal.pros.slice(0, 3).map(p => `  ✅ ${p}`).join('\n');
  }

  let consText = '';
  if (deal.cons && deal.cons.length > 0) {
    consText = '\n<b>Dikkat:</b>\n' + deal.cons.slice(0, 2).map(c => `  ⚠️ ${c}`).join('\n');
  }

  return `🔔 <b>haberverbana.app | YENİ FIRSAT TESPİT EDİLDİ</b>

<b>Ürün / İlan:</b> ${deal.title}
<b>Platform:</b> ${deal.platform}
<b>Fiyat:</b> <code>${deal.currentPrice.toLocaleString('tr-TR')} TL</code> ${discountText}
📊 <b>AI Skoru:</b> ${deal.opportunityScore}/10 (${stars})

💡 <b>Fiyat Analizi:</b> ${deal.whyForYou}${prosText}${consText}

🎯 <b>AI Kararı:</b> <i>"${deal.summary || deal.whyForYou}"</i>

🔗 <a href="${deal.productUrl}">İlana Gitmek İçin Tıklayın</a>`;
};

export async function sendRealTelegramAlert(
  deal: DealItem,
  customConfig?: TelegramConfig
): Promise<{ success: boolean; error?: string }> {
  const config = customConfig || getStoredTelegramConfig();

  if (!config.botToken) {
    return { 
      success: false, 
      error: 'Telegram Bot Token girilmemiş. Lütfen BotFather üzerinden aldığınız tokenı veya projenizin .env dosyasındaki tokenı girin.' 
    };
  }

  if (!config.chatId) {
    return { 
      success: false, 
      error: 'Telegram Chat ID girilmemiş. Lütfen @userinfobot üzerinden aldığınız numerik Chat ID\'nizi girin.' 
    };
  }

  const messageText = formatTelegramHtmlMessage(deal);

  try {
    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      return {
        success: false,
        error: data.description || `Telegram API Hatası (${response.status})`
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Telegram sunucusuna bağlanılamadı. İnternet bağlantınızı kontrol edin.'
    };
  }
}

export async function sendCustomTelegramTest(
  config: TelegramConfig,
  customText?: string
): Promise<{ success: boolean; error?: string }> {
  if (!config.botToken.trim()) {
    return { success: false, error: 'Lütfen Telegram Bot Token alanını doldurun.' };
  }
  if (!config.chatId.trim()) {
    return { success: false, error: 'Lütfen Telegram Chat ID alanını doldurun.' };
  }

  const text = customText || `⚡ <b>haberverbana.app | CANLI BİLDİRİM TESTİ BAŞARILI!</b>

Tebrikler! Telegram bildirim kanalınız başarıyla bağlandı.
"Sen Arama, O Haber Versin" radarı tanımladığınız kriterlere uyan fırsatları bu kanaldan anında iletecektir.

🛡️ <i>24 Saat Spam Koruması Aktif</i>
⏱️ <i>Tarih: ${new Date().toLocaleString('tr-TR')}</i>`;

  try {
    const url = `https://api.telegram.org/bot${config.botToken.trim()}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId.trim(),
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      return {
        success: false,
        error: data.description || `Telegram API Hatası: ${response.status}`
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Telegram servisine ulaşılamadı.'
    };
  }
}
