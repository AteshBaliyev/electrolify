'use client';

import React, { useState } from 'react';
import { TrendingUp, Flame, Star, Sparkles } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/shopify';
import ProductCard from './ProductCard';

export default function BestsellersGrid({ products = MOCK_PRODUCTS }) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'Bütün Məhsullar' },
    { id: 'watches', label: 'Smart Saatlar' },
    { id: 'audio', label: 'Qulaqlıqlar' },
    { id: 'chargers', label: 'Şarj & MagSafe' },
  ];

  const sourceProducts = products && products.length > 0 ? products : MOCK_PRODUCTS;

  const filteredProducts = sourceProducts.filter((prod) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'watches') return prod.handle?.includes('watch');
    if (activeTab === 'audio') return prod.handle?.includes('aurapod') || prod.handle?.includes('audio');
    if (activeTab === 'chargers') return prod.handle?.includes('voltpulse') || prod.handle?.includes('charge');
    return true;
  });

  return (
    <section className="w-full my-8 sm:my-12">
      {/* Bölmə Başlığı */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-[#1C1C1C]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF5B00]" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#FF5B00] font-bold">
              Hit Məhsullar
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Ən Çox Satanlar
          </h2>
        </div>

        {/* Filtr Düymələri (Mobildə rahat barmaqla sürüşdürülən və toxunulan tablar) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[40px] sm:min-h-[44px] py-2 px-3.5 sm:px-5 rounded-xl text-xs font-bold transition-all whitespace-nowrap select-none flex items-center justify-center cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#FF5B00] text-white font-black shadow-md shadow-[#FF5B00]/25 scale-105'
                  : 'bg-[#121212] text-neutral-300 hover:text-white border border-[#222222]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Məhsul Şəbəkəsi: Mobildə yan-yana 2-li, planşetdə 2-li/3-lü, böyük ekranlarda 4-lü */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
        {filteredProducts.map((product, idx) => {
          const badges = ['TOP 1', 'Çox Satan', 'Populyar'];
          const discounts = ['-44%', '-47%', '-40%'];

          return (
            <ProductCard
              key={product.id}
              product={product}
              badge={badges[idx % badges.length]}
              discount={discounts[idx % discounts.length]}
            />
          );
        })}
      </div>
    </section>
  );
}
