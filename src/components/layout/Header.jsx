'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Zap,
  Search,
  ShoppingBag,
  Menu,
  X,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { totalCount, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Gələcək mərhələdə axtarış səhifəsinə yönləndirmə
    console.log('Axtarış sorğusu:', searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-18 flex items-center justify-between gap-3 md:gap-8">
          {/* 1. Sol: Loqo (Electrolify) */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
            <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl bg-neutral-950 border border-orange-500/30 overflow-hidden shadow-md group-hover:scale-105 group-hover:border-[#FF5B00] transition-all flex items-center justify-center shrink-0">
              <Image
                src="/logo-icon.png"
                alt="Electrolify Logo"
                width={44}
                height={44}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-black tracking-tight text-neutral-900 flex items-center">
                ELECTROLIFY<span className="text-[#FF5B00]">.AZ</span>
              </span>
              <span className="hidden sm:block text-[9px] text-neutral-500 font-semibold tracking-widest uppercase -mt-1">
                Ağıllı Elektronika
              </span>
            </div>
          </Link>

          {/* 2. Masaüstü Üfüqi Naviqasiya Menyu (Desktop Horizontal Navigation) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-bold text-neutral-700">
            <Link href="/#bestsellers" className="hover:text-[#FF5B00] transition-colors whitespace-nowrap">
              Bütün Məhsullar
            </Link>
            <Link href="/category/deri-qullugu" className="hover:text-[#FF5B00] transition-colors whitespace-nowrap">
              Dəri Qulluğu & Vakum
            </Link>
            <Link href="/category/masaj" className="hover:text-[#FF5B00] transition-colors whitespace-nowrap">
              Masaj & Sağlamlıq
            </Link>
            <Link href="/#flashsales" className="text-[#FF5B00] hover:text-[#e04e00] transition-colors whitespace-nowrap flex items-center gap-1 font-extrabold">
              <Sparkles className="w-3.5 h-3.5" /> Günün Fürsətləri
            </Link>
            <Link href="/support" className="hover:text-neutral-900 transition-colors whitespace-nowrap">
              FAQ & Dəstək
            </Link>
          </nav>

          {/* 3. Orta: Axtarış Çubuğu (Masaüstü və Planşet üçün) */}
          <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Axtarış edin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-100 border border-neutral-200 hover:border-neutral-300 focus:border-[#FF5B00] focus:bg-white rounded-full py-2.5 pl-10 pr-9 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#FF5B00]/40 transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* 4. Sağ: Mobil Axtarış, Səbət və Hamburger Menyu (Bütün toxunma sahələri min 48px) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobil Axtarış Düyməsi (Min 48px toxunma sahəsi) */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden min-w-[48px] min-h-[48px] rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition-colors"
              aria-label="Axtarış"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Sürətli Dəstək (Masaüstü üçün) */}
            <a
              href="tel:+994556422545"
              className="hidden 2xl:flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs text-neutral-700 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#FF5B00]" />
              <span className="font-semibold">055 642 25 45</span>
            </a>

            {/* Səbət İkonu (Min 48px toxunma sahəsi) */}
            <button
              type="button"
              onClick={openCart}
              className="relative min-w-[48px] min-h-[48px] rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition-all flex items-center justify-center group"
              aria-label="Səbət"
            >
              <ShoppingBag className="w-5 h-5 text-neutral-800 group-hover:text-[#FF5B00] transition-colors" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF5B00] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobil-first Hamburger Menyu Açarı (Min 48px toxunma sahəsi) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Menyunu aç"
              className="min-w-[48px] min-h-[48px] rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 hover:text-[#FF5B00] transition-colors md:hidden flex items-center justify-center"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobil Ekranlar Üçün Açılan Axtarış Paneli */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-4 py-3 bg-white border-t border-neutral-200 animate-fadeIn">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Məhsul və ya brend axtarın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-100 border border-neutral-200 focus:border-[#FF5B00] focus:bg-white rounded-xl py-3 pl-10 pr-9 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] flex items-center justify-center text-neutral-400 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}
      </header>

      {/* Sürüşən Mobil Menyu Komponenti */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
    </>
  );
}
