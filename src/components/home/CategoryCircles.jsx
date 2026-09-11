import React from 'react';
import Link from 'next/link';
import {
  Watch,
  Headphones,
  Zap,
  BatteryCharging,
  Smartphone,
  Home,
  Flame,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'deri-qullugu',
    name: 'Dəri Qulluğu & Vakum',
    icon: Sparkles,
    href: '/category/deri-qullugu',
    gradient: 'from-[#FF5B00] to-yellow-500',
    badge: 'Hit',
  },
  {
    id: 'masaj',
    name: 'Masaj & Sağlamlıq',
    icon: Flame,
    href: '/category/masaj',
    gradient: 'from-emerald-500 to-teal-400',
    badge: 'Trend',
  },
  {
    id: 'bestsellers',
    name: 'Ən Çox Satanlar',
    icon: Zap,
    href: '/#bestsellers',
    gradient: 'from-amber-500 to-orange-400',
    badge: 'Top',
  },
  {
    id: 'deals',
    name: 'Günün Fürsətləri',
    icon: Flame,
    href: '/#flashsales',
    gradient: 'from-red-600 to-[#FF5B00]',
    badge: '-49%',
    highlight: true,
  },
];

export default function CategoryCircles() {
  return (
    <section className="w-full my-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm md:text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
          <span>Populyar Kateqoriyalar</span>
        </h3>
        <span className="text-[11px] text-neutral-500">Bütün bölmələr</span>
      </div>

      {/* Dairəvi İkonlar Zolağı (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none select-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              {/* Dairəvi Çərçivə */}
              <div className="relative">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr ${cat.gradient} group-hover:scale-105 transition-transform duration-300 shadow-md`}
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-3 text-neutral-800 group-hover:bg-neutral-50 shadow-inner transition-colors">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {cat.badge && (
                  <span
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-black px-2 py-0.2 rounded-full uppercase shadow-md ${
                      cat.highlight
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-[#FF5B00] text-white'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Kateqoriya Adı */}
              <span className="text-[11px] sm:text-xs font-bold text-neutral-800 group-hover:text-[#FF5B00] transition-colors text-center max-w-[80px] truncate">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
