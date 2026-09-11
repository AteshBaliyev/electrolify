'use client';

import React, { useState } from 'react';
import { TrendingUp, Flame, Star, Sparkles } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/shopify';
import ProductCard from './ProductCard';

export default function BestsellersGrid({ products = MOCK_PRODUCTS }) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'Bütün Məhsullar' },
    { id: 'deri', label: 'Dəri Qulluğu & Vakum' },
    { id: 'masaj', label: 'Masaj & Sağlamlıq' },
  ];

  const sourceProducts = products && products.length > 0 ? products : MOCK_PRODUCTS;

  const filteredProducts = sourceProducts.filter((prod) => {
    if (activeTab === 'all') return true;
    const title = (prod.title || '').toLowerCase();
    const handle = (prod.handle || '').toLowerCase();
    if (activeTab === 'deri') {
      return (
        handle.includes('clarify') ||
        handle.includes('vakum') ||
        title.includes('vakum') ||
        title.includes('qara')
      );
    }
    if (activeTab === 'masaj') {
      return (
        handle.includes('istiəl') ||
        handle.includes('istiel') ||
        handle.includes('masaj') ||
        title.includes('masaj') ||
        title.includes('isti')
      );
    }
    return true;
  });

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : sourceProducts;

  return (
    <section id="bestsellers" className="w-full my-8 sm:my-12">
      {/* Bölmə Başlığı */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF5B00]" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#FF5B00] font-bold">
              Hit Məhsullar
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Ən Çox Satanlar
          </h2>
        </div>

        {/* Filtr Düymələri */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[40px] sm:min-h-[44px] py-2 px-3.5 sm:px-5 rounded-xl text-xs font-bold transition-all whitespace-nowrap select-none flex items-center justify-center cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#FF5B00] text-white font-black shadow-md shadow-[#FF5B00]/25 scale-105'
                  : 'bg-white text-neutral-700 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50 shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Məhsul Şəbəkəsi: Mobildə yan-yana 2-li, planşetdə 2-li/3-lü, böyük ekranlarda 4-lü */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
        {displayProducts.map((product, idx) => {
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
