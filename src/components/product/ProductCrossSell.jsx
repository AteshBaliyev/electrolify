'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, Zap, Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CROSS_SELL_PRODUCTS } from '@/data/crossSellProducts';

export default function ProductCrossSell({ mainProduct, currentVariant }) {
  const { addToCart, addCrossSellItem } = useCart();

  // Seçilmiş cross-sell məhsulları (default: ilk 2 aksesuar seçilidir)
  const [selectedAddons, setSelectedAddons] = useState(['cross-1', 'cross-2']);
  const [isBundleAdded, setIsBundleAdded] = useState(false);

  const mainPrice = parseFloat(
    currentVariant?.price?.amount || mainProduct?.priceRange?.minVariantPrice?.amount || 0
  );

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Paket cəmi
  const selectedCrossItems = CROSS_SELL_PRODUCTS.filter((item) =>
    selectedAddons.includes(item.id)
  );
  const addonsTotal = selectedCrossItems.reduce((acc, item) => acc + item.price, 0);
  const bundleTotalPrice = (mainPrice + addonsTotal).toFixed(2);
  const bundleComparePrice = (
    parseFloat(currentVariant?.compareAtPrice?.amount || mainPrice + 50) +
    selectedCrossItems.reduce((acc, item) => acc + item.compareAtPrice, 0)
  ).toFixed(2);

  const handleAddBundle = () => {
    // 1. Əsas məhsulu əlavə et
    if (mainProduct && currentVariant) {
      addToCart(mainProduct, currentVariant, 1);
    }
    // 2. Seçilmiş aksesuarları əlavə et
    selectedCrossItems.forEach((cross) => {
      addCrossSellItem(cross);
    });

    setIsBundleAdded(true);
    setTimeout(() => setIsBundleAdded(false), 2000);
  };

  return (
    <section className="w-full my-12 p-5 sm:p-7 rounded-3xl bg-[#0B0B0B] border border-[#222222] shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#1A1A1A]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5B00] flex items-center gap-1.5 mb-1 font-bold">
            <Zap className="w-3.5 h-3.5 fill-[#FF5B00]" /> Xüsusi Dəst Təklifi (AOV Boost)
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Bununla Birlikdə Tez-tez Alınırlar
          </h3>
        </div>
        <span className="text-xs text-neutral-400 bg-[#141414] border border-[#242424] px-3 py-1.5 rounded-full">
          🔥 Dəst halında alarkən <strong>əlavə 20% qənaət</strong>
        </span>
      </div>

      {/* Aksesuarlar Siyahısı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-6">
        {CROSS_SELL_PRODUCTS.map((cross) => {
          const isSelected = selectedAddons.includes(cross.id);
          return (
            <div
              key={cross.id}
              onClick={() => toggleAddon(cross.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-[#140D08] border-[#FF5B00] shadow-md shadow-[#FF5B00]/10'
                  : 'bg-[#111111] border-[#222222] hover:border-[#333333] opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#FF5B00] border-[#FF5B00] text-white'
                        : 'border-neutral-600 bg-[#161616]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-[10px] font-black text-black bg-[#10B981] px-1.5 py-0.2 rounded">
                    {cross.discount}
                  </span>
                </div>

                <div className="relative aspect-square rounded-xl bg-[#181818] overflow-hidden mb-3 border border-white/5">
                  <Image
                    src={cross.image}
                    alt={cross.title}
                    fill
                    sizes="120px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                  {cross.title}
                </h4>
                <p className="text-[10px] text-neutral-400 mt-1 line-clamp-1">
                  {cross.description}
                </p>
              </div>

              <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-white/5">
                <span className="text-xs font-black text-[#FF5B00]">
                  {cross.price.toFixed(2)} AZN
                </span>
                <span className="text-[10px] text-neutral-500 line-through">
                  {cross.compareAtPrice.toFixed(2)} AZN
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dəst Cəmi və Səbətə At Düyməsi */}
      <div className="p-4 rounded-2xl bg-[#121212] border border-[#242424] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-neutral-400 block">
            Seçilmiş məhsullarla ümumi dəst qiyməti:
          </span>
          <div className="flex items-baseline gap-3 mt-0.5">
            <span className="text-2xl font-black text-[#FF5B00]">
              {bundleTotalPrice} AZN
            </span>
            <span className="text-sm text-neutral-500 line-through">
              {bundleComparePrice} AZN
            </span>
            <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded">
              {(bundleComparePrice - bundleTotalPrice).toFixed(2)} AZN Qənaət
            </span>
          </div>
        </div>

        <button
          onClick={handleAddBundle}
          className="w-full sm:w-auto min-h-[48px] py-3.5 px-8 rounded-xl bg-[#FF5B00] hover:bg-[#E64D00] text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-[#FF5B00]/25 transition-all active:scale-95 glow-orange"
        >
          {isBundleAdded ? (
            <>
              <Check className="w-5 h-5 text-white" />
              <span>Dəst Səbətə Əlavə Edildi!</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-white text-white" />
              <span>Bütün Dəsti Səbətə At</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
