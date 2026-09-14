'use client';

import React from 'react';
import {
  X,
  Search,
  Watch,
  Headphones,
  Zap,
  BatteryCharging,
  Flame,
  PhoneCall,
  MessageCircle,
  Truck,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MobileMenu({ isOpen, onClose, searchQuery, setSearchQuery, handleSearch }) {
  const categories = [
    {
      title: 'Dəri Qulluğu & Vakum',
      desc: 'ClarifyPro - Qara Nöqtə Təmizləyici',
      href: '/category/deri-qullugu',
      icon: Sparkles,
      badge: 'Hit',
      color: 'text-[#FF5B00]',
    },
    {
      title: 'Masaj & Sağlamlıq',
      desc: 'İstiƏl - İstilikli Boyun və Çiyin Masajı',
      href: '/category/masaj',
      icon: Flame,
      badge: 'Trend',
      color: 'text-emerald-500',
    },
    {
      title: 'Bütün Məhsullar',
      desc: 'Rəsmi zəmanətli mağaza seçimləri',
      href: '/products',
      icon: Zap,
      badge: 'Kataloq',
      color: 'text-amber-500',
    },
    {
      title: 'Günün Xüsusi Fürsətləri',
      desc: 'Qapıda ödəniş və sürətli çatdırılma',
      href: '/#flashsales',
      icon: Flame,
      badge: '🔥 Tələs',
      color: 'text-red-500',
      highlight: true,
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Qara Arxa Fon (Backdrop) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-200"
      />

      {/* Tam Ekran Mobil Menyu */}
      <div
        className="fixed inset-0 w-full h-full bg-white z-50 flex flex-col md:hidden overflow-y-auto animate-in slide-in-from-top-4 duration-200"
      >
            {/* Menyu Başlığı (Min 48px toxunma sahəsi) */}
            <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-xl bg-neutral-950 border border-orange-500/30 overflow-hidden shadow-md flex items-center justify-center shrink-0">
                  <Image
                    src="/logo-icon.png"
                    alt="Electrolify Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl tracking-tight text-neutral-900">
                    ELECTROLIFY
                  </span>
                  <span className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">
                    Ağıllı Elektronika
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Menyunu bağla"
                className="min-w-[48px] min-h-[48px] rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 flex items-center justify-center text-neutral-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobil Axtarış Zolağı */}
            <div className="p-4 border-b border-neutral-200 bg-white shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (handleSearch) handleSearch(e);
                  onClose();
                }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Məhsul və ya model axtar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-100 border border-neutral-200 focus:border-[#FF5B00] focus:bg-white rounded-xl min-h-[48px] py-3 pl-11 pr-4 text-base text-neutral-900 placeholder-neutral-500 focus:outline-none transition-colors"
                />
                <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </form>
            </div>

            {/* Kateqoriyalar Siyahısı */}
            <div className="p-4 flex-1 space-y-2.5">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest block mb-2 px-1">
                Bütün Bölmələr
              </span>
              <div className="flex flex-col gap-2.5">
                {categories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={idx}
                      href={cat.href}
                      onClick={onClose}
                      className={`min-h-[54px] flex items-center justify-between p-3.5 rounded-2xl border transition-all active:scale-[0.99] ${
                        cat.highlight
                          ? 'bg-red-50 border-red-200 text-red-900 shadow-sm'
                          : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-xl bg-white shadow-sm border border-neutral-200 ${cat.color} shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-neutral-900">{cat.title}</span>
                            {cat.badge && (
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                                  cat.highlight
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'bg-[#FF5B00]/10 text-[#FF5B00]'
                                }`}
                              >
                                {cat.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-neutral-500 block mt-0.5">{cat.desc}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-400 shrink-0" />
                    </Link>
                  );
                })}

                {/* Əlavə Sürətli Keçid: FAQ və Dəstək */}
                <Link
                  href="/support"
                  onClick={onClose}
                  className="min-h-[54px] flex items-center justify-between p-3.5 rounded-2xl border bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-white shadow-sm border border-neutral-200 text-blue-500 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-neutral-900 block">Müştəri Dəstəyi (FAQ)</span>
                      <span className="text-xs text-neutral-500 block mt-0.5">Çatdırılma, Qapıda Ödəniş, Zəmanət</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 shrink-0" />
                </Link>
              </div>
            </div>

            {/* WhatsApp ilə Birbaşa Sürətli Sifariş */}
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 flex flex-col gap-3 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
              <a
                href="https://wa.me/994559031176?text=Salam,%20Electrolify-dan%20sifari%C5%9F%20verm%C9%99k%20ist%C9%99yir%C9%99m"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[52px] py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2.5 shadow-md transition-transform active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>WhatsApp ilə Dərhal Əlaqə</span>
              </a>

              <a
                href="tel:+994559031176"
                className="min-h-[48px] flex items-center justify-between text-xs text-neutral-700 bg-white border border-neutral-200 px-4 py-2.5 rounded-xl shadow-sm"
              >
                <span className="flex items-center gap-2 font-bold text-neutral-900">
                  <PhoneCall className="w-4 h-4 text-[#FF5B00]" /> 055 903 11 76
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">Hər gün: 09:00 - 22:00</span>
              </a>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-around text-xs text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#FF5B00]" /> 24 Saat Çatdırılma
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Qapıda Ödəniş
                </span>
              </div>
            </div>
          </div>
    </>
  );
}
