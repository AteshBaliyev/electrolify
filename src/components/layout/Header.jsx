'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#1C1C1C] transition-all">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-18 flex items-center justify-between gap-3 md:gap-8">
          {/* 1. Sol: Minimalist Loqo (Electrolify) */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-[#FF5B00] via-[#FF6E1A] to-yellow-500 flex items-center justify-center shadow-lg shadow-[#FF5B00]/25 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-black tracking-tight text-white flex items-center">
                ELECTROLIFY<span className="text-[#FF5B00]">.AZ</span>
              </span>
              <span className="hidden sm:block text-[9px] text-neutral-400 font-semibold tracking-widest uppercase -mt-1">
                Ağıllı Elektronika
              </span>
            </div>
          </Link>

          {/* 2. Masaüstü Üfüqi Naviqasiya Menyu (Desktop Horizontal Navigation) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-bold text-neutral-300">
            <Link href="/category/smart-saatlar" className="hover:text-[#FF5B00] transition-colors whitespace-nowrap">
              Smart Saatlar
            </Link>
            <Link href="/category/qulaqliqlar" className="hover:text-[#FF5B00] transition-colors whitespace-nowrap">
              Simsiz Qulaqlıqlar
            </Link>
            <Link href="/category/sarj-cihazlari" className="hover:text-[#FF5B00] transition-colors whitespace-nowrap">
              MagSafe & Şarj
            </Link>
            <Link href="/endirimlər" className="text-[#FF5B00] hover:text-[#ff782e] transition-colors whitespace-nowrap flex items-center gap-1 font-extrabold">
              <Sparkles className="w-3.5 h-3.5" /> Kampaniyalar
            </Link>
            <Link href="/support" className="hover:text-white transition-colors whitespace-nowrap">
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
                className="w-full bg-[#121212] border border-[#242424] hover:border-[#333333] focus:border-[#FF5B00] rounded-full py-2.5 pl-10 pr-9 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#FF5B00]/40 transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs p-1"
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
              className="md:hidden min-w-[48px] min-h-[48px] rounded-xl text-neutral-300 hover:text-white hover:bg-[#141414] flex items-center justify-center transition-colors"
              aria-label="Axtarış"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Sürətli Dəstək (Masaüstü üçün) */}
            <a
              href="tel:+994556422545"
              className="hidden 2xl:flex items-center gap-2 px-3 py-2 rounded-full bg-[#121212] hover:bg-[#1A1A1A] border border-[#242424] text-xs text-neutral-300 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#FF5B00]" />
              <span className="font-semibold">055 642 25 45</span>
            </a>

            {/* Səbət İkonu (Min 48px toxunma sahəsi) */}
            <button
              type="button"
              onClick={openCart}
              className="relative min-w-[48px] min-h-[48px] rounded-xl bg-[#141414] hover:bg-[#1C1C1C] border border-[#262626] transition-all flex items-center justify-center group"
              aria-label="Səbət"
            >
              <ShoppingBag className="w-5 h-5 text-neutral-200 group-hover:text-[#FF5B00] transition-colors" />
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
              className="min-w-[48px] min-h-[48px] rounded-xl bg-[#141414] hover:bg-[#1C1C1C] border border-[#262626] text-neutral-200 hover:text-[#FF5B00] transition-colors md:hidden flex items-center justify-center"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobil Ekranlar Üçün Açılan Axtarış Paneli */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-4 py-3 bg-[#0E0E0E] border-t border-[#1C1C1C] animate-fadeIn">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Axtarış edin..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#FF5B00] rounded-xl min-h-[48px] py-2.5 pl-11 pr-10 text-base text-white placeholder-neutral-500 focus:outline-none"
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
