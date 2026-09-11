import React from 'react';
import { Truck, Banknote, ShieldCheck, Zap, MessageCircle } from 'lucide-react';

const TICKER_ITEMS = [
  {
    id: 1,
    icon: Truck,
    text: 'Azərbaycan üzrə Sürətli Çatdırılma — 50 AZN-dən Pulsuz',
  },
  {
    id: 2,
    icon: Banknote,
    text: 'Qapıda Nağd və ya Kartla Təhlükəsiz Ödəniş İmkanı',
  },
  {
    id: 3,
    icon: ShieldCheck,
    text: '100% Orijinal və Rəsmi Zəmanətli Seçimlər',
  },
  {
    id: 4,
    icon: Zap,
    text: 'Gözləmədən — Sifarişiniz 24 Saat Ərzində Ünvanda',
  },
  {
    id: 5,
    icon: MessageCircle,
    text: '7/24 Canlı WhatsApp Dəstəyi və Müştəri Xidməti',
  },
];

export default function ProductTrustTicker() {
  // Ticker-in fasiləsiz və qüsursuz dövr etməsi üçün elementləri 2 dəfə təkrarlayırıq
  const repeatedItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative w-full overflow-hidden bg-black text-white rounded-xl py-2.5 sm:py-3 border border-neutral-800 shadow-sm my-1">
      {/* Kənarlarda zərif tünd fade effekti */}
      <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      {/* Fırlanan Hissə (Continuous Loop) */}
      <div className="flex w-max items-center animate-ticker hover:[animation-play-state:paused] select-none">
        {repeatedItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2 whitespace-nowrap px-4">
              <span className="p-1 rounded-md bg-[#FF5B00]/20 text-[#FF5B00] flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-[#FF5B00]" />
              </span>
              <span className="text-xs sm:text-[13px] font-bold tracking-tight text-white">
                {item.text}
              </span>
              <span className="text-[#FF5B00] text-xs font-black ml-4 select-none">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
