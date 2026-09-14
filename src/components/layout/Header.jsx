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
        {/* ==================== 1. MOBİL HEADER (md-dən kiçik ekranlar) ==================== */}
        <div className="md:hidden max-w-7xl mx-auto px-4 h-16 relative flex items-center justify-between">
          {/* Sol: Hamburger Menyu Düyməsi */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menyunu aç"
            className="min-w-[44px] min-h-[44px] -ml-2 rounded-xl text-neutral-800 hover:text-[#FF5B00] hover:bg-neutral-100 flex items-center justify-center transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Tam Ortada: Loqo və Ad (ELECTROLIFY) */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group"
          >
            <div className="relative w-9 h-9 rounded-xl bg-neutral-950 border border-orange-500/30 overflow-hidden shadow-sm group-hover:scale-105 transition-all flex items-center justify-center shrink-0">
              <Image
                src="/logo-icon.png"
                alt="Electrolify Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="text-xl font-black tracking-tight text-neutral-900 group-hover:text-[#FF5B00] transition-colors">
              ELECTROLIFY
            </span>
          </Link>

          {/* Sağ: Axtarış və Səbət Düymələri */}
          <div className="flex items-center gap-1 -mr-2">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="min-w-[40px] min-h-[40px] rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition-colors"
              aria-label="Axtarış"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={openCart}
              className="relative min-w-[40px] min-h-[40px] rounded-xl text-neutral-800 hover:text-[#FF5B00] hover:bg-neutral-100 transition-colors flex items-center justify-center"
              aria-label="Səbət"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#FF5B00] text-white text-[10px] font-black w-4.5 h-4.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ==================== 2. MASAÜSTÜ HEADER (md və daha böyük ekranlar) ==================== */}
        <div className="hidden md:block max-w-7xl mx-auto px-4">
          {/* Yuxarı Sətir: Axtarış | TAM ORTADA LOQO VƏ AD | Əlaqə & Səbət */}
          <div className="grid grid-cols-3 items-center py-3 border-b border-neutral-100">
            {/* Sol: Axtarış Çubuğu */}
            <div className="flex items-center justify-start max-w-xs">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Məhsul axtarışı..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-100 border border-neutral-200 hover:border-neutral-300 focus:border-[#FF5B00] focus:bg-white rounded-full py-2 pl-9 pr-8 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#FF5B00]/30 transition-all"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </form>
            </div>

            {/* Tam Ortada: Loqo və Ad (ELECTROLIFY) */}
            <div className="flex justify-center items-center">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-11 h-11 rounded-xl bg-neutral-950 border border-orange-500/30 overflow-hidden shadow-md group-hover:scale-105 group-hover:border-[#FF5B00] transition-all flex items-center justify-center shrink-0">
                  <Image
                    src="/logo-icon.png"
                    alt="Electrolify Logo"
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-2xl lg:text-3xl font-black tracking-tight text-neutral-900 group-hover:text-[#FF5B00] transition-colors leading-tight">
                    ELECTROLIFY
                  </span>
                  <span className="text-[9px] text-neutral-500 font-bold tracking-widest uppercase -mt-0.5">
                    Ağıllı Elektronika
                  </span>
                </div>
              </Link>
            </div>

            {/* Sağ: Əlaqə və Səbət */}
            <div className="flex items-center justify-end gap-3">
              <a
                href="tel:+994556422545"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs text-neutral-700 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#FF5B00]" />
                <span className="font-semibold">055 642 25 45</span>
              </a>

              <button
                type="button"
                onClick={openCart}
                className="relative min-h-[42px] px-4 rounded-xl bg-neutral-900 hover:bg-[#FF5B00] text-white transition-all flex items-center gap-2 group shadow-sm"
                aria-label="Səbət"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span className="text-xs font-bold">Səbət</span>
                {totalCount > 0 && (
                  <span className="bg-[#FF5B00] group-hover:bg-white group-hover:text-[#FF5B00] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-colors">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Aşağı Sətir: Tam Ortada Naviqasiya Menyu */}
          <nav className="flex items-center justify-center gap-6 lg:gap-8 py-2.5 text-xs font-bold text-neutral-700">
            <Link href="/products" className="hover:text-[#FF5B00] transition-colors whitespace-nowrap">
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
