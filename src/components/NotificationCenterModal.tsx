import React, { useState } from 'react';
import { 
  Bell, 
  BellOff, 
  CheckCheck, 
  Trash2, 
  X, 
  ExternalLink, 
  Flame, 
  Send, 
  Radar, 
  SlidersHorizontal, 
  Info, 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AppNotification, DealItem } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onDeleteNotification: (id: string) => void;
  onSelectDeal: (deal: DealItem) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onDeleteNotification,
  onSelectDeal
}) => {
  const [filter, setFilter] = useState<'all' | 'deals' | 'unread'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'deals') return n.type === 'deal';
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'deal':
        return <Flame className="w-4 h-4 text-red-400" />;
      case 'telegram':
        return <Send className="w-4 h-4 text-[#229ED9]" />;
      case 'scan':
        return <Radar className="w-4 h-4 text-amber-400" />;
      case 'rule':
        return <SlidersHorizontal className="w-4 h-4 text-purple-400" />;
      default:
        return <Info className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getTypeBadge = (type: AppNotification['type']) => {
    switch (type) {
      case 'deal':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'telegram':
        return 'bg-[#229ED9]/15 text-[#229ED9] border-[#229ED9]/30';
      case 'scan':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'rule':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-[#0F0F0F] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg font-bold text-white">Bildirim Merkezi</h2>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-600 text-white font-bold animate-pulse">
                      {unreadCount} Yeni
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/50">Radar tarafından yakalanan tüm fırsat ve işlem geçmişi</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/5 transition-colors"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Toolbar & Filters */}
          <div className="px-5 py-3 border-b border-white/5 bg-[#141414] flex flex-wrap items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Tümü ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('deals')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  filter === 'deals'
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                🔥 Fırsatlar ({notifications.filter(n => n.type === 'deal').length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  filter === 'unread'
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Okunmamış ({unreadCount})
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 text-xs">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="px-2.5 py-1 text-white/70 hover:text-emerald-400 hover:bg-white/5 rounded-lg flex items-center gap-1 transition-colors"
                  title="Tümünü okundu olarak işaretle"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Okundu Say</span>
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="px-2.5 py-1 text-white/50 hover:text-red-400 hover:bg-white/5 rounded-lg flex items-center gap-1 transition-colors"
                  title="Tüm bildirim geçmişini temizle"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Temizle</span>
                </button>
              )}
            </div>
          </div>

          {/* Notification Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/30 border border-white/10">
                  <BellOff className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-white text-base">
                  {filter === 'unread' 
                    ? 'Tüm Bildirimler Okundu' 
                    : filter === 'deals'
                      ? 'Fırsat Bildirimi Bulunmuyor'
                      : 'Bildirim Bulunmuyor'}
                </h3>
                <p className="text-xs text-white/50 max-w-xs leading-relaxed">
                  {filter === 'unread'
                    ? 'Okunmamış bildiriminiz yok. Yeni bir fırsat tespit edildiğinde burada görünecektir.'
                    : 'Radarınız 7/24 pazar yerlerini taramaya devam ediyor. Kriterlerinize uyan yeni bir fırsat olduğunda anında buraya düşecektir.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const isDeal = notification.type === 'deal' && notification.deal;

                return (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read) onMarkAsRead(notification.id);
                      if (isDeal && notification.deal) {
                        onSelectDeal(notification.deal);
                      }
                    }}
                    className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer group ${
                      notification.read
                        ? 'bg-[#121212] border-white/5 hover:border-white/15 opacity-80 hover:opacity-100'
                        : 'bg-[#191919] border-red-500/30 shadow-md shadow-red-950/20 hover:border-red-500/50'
                    }`}
                  >
                    {/* Unread indicator dot */}
                    {!notification.read && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500/80"></span>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Type Icon */}
                      <div className="w-8 h-8 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        {/* Meta Tags */}
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${getTypeBadge(notification.type)}`}>
                            {notification.type === 'deal' ? 'Fırsat Alarmı' : 
                             notification.type === 'telegram' ? 'Telegram' :
                             notification.type === 'scan' ? 'Radar Taraması' : 
                             notification.type === 'rule' ? 'Kural Takibi' : 'Sistem'}
                          </span>

                          {notification.platform && (
                            <span className="text-[10px] font-medium text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                              {notification.platform}
                            </span>
                          )}

                          <span className="text-[11px] text-white/40 font-mono">
                            {notification.timestamp}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                          {notification.title}
                        </h4>

                        {/* Message */}
                        <p className="text-xs text-white/65 mt-1 leading-relaxed line-clamp-3">
                          {notification.message}
                        </p>

                        {/* Deal Specific Details */}
                        {isDeal && (
                          <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              {notification.price && (
                                <span className="text-xs font-bold text-emerald-400 font-mono">
                                  ₺{notification.price.toLocaleString('tr-TR')}
                                </span>
                              )}
                              {notification.discountRate && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                                  %{notification.discountRate} İndirim
                                </span>
                              )}
                              {notification.score && (
                                <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                                  ★ {notification.score}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-red-400 font-medium flex items-center gap-1 group-hover:underline">
                                <span>Fırsatı İncele</span>
                                <ArrowRight className="w-3 h-3" />
                              </span>

                              {notification.productUrl && (
                                <a
                                  href={notification.productUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1 text-white/40 hover:text-white rounded hover:bg-white/10"
                                  title="Yeni sekmede aç"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Delete notification button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNotification(notification.id);
                        }}
                        className="p-1.5 text-white/30 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                        title="Bildirimi sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-white/50">
            <span>Sen Arama, O Haber Versin</span>
            <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              7/24 Kesintisiz Takip
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
