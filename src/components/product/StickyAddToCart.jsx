'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Zap } from 'lucide-react';

export default function StickyAddToCart({ product, selectedVariant, onOrderClick }) {
  if (!product || !selectedVariant) return null;

  const currentPrice = selectedVariant.price?.amount || product.priceRange?.minVariantPrice?.amount;
  const comparePrice = selectedVariant.compareAtPrice?.amount || product.compareAtPriceRange?.minVariantPrice?.amount;
  const imageUrl = product.images?.edges?.[0]?.node?.url;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-neutral-200 py-2 sm:py-3 pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))] px-3 md:px-6 shadow-[0_-5px_25px_rgba(0,0,0,0.08)] transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Məhsul Məlumatı (Thumbnail + Adı + Seçilmiş Variant + Qiymət) */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {imageUrl && (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-neutral-200 overflow-hidden shrink-0 relative flex items-center justify-center shadow-sm">
              <Image
                src={imageUrl}
                alt={product.title}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate max-w-[125px] sm:max-w-[260px] md:max-w-md">
              {product.title}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              {selectedVariant.title &&
                !['standart', 'default title'].includes(selectedVariant.title.toLowerCase()) && (
                  <span className="text-[11px] sm:text-xs text-neutral-500 font-medium truncate max-w-[85px] sm:max-w-[120px]">
                    {selectedVariant.title}
                  </span>
                )}
              <span className="text-xs sm:text-sm font-black text-[#FF5B00]">
                {currentPrice} AZN
              </span>
              {comparePrice && (
                <span className="hidden sm:inline-block text-[11px] text-neutral-400 line-through">
                  {comparePrice} AZN
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sifariş Düyməsi (Həmişə görünən və dərhal vurulan CTA) */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            id="sticky-order-button"
            onClick={onOrderClick}
            className="min-h-[48px] py-2.5 sm:py-3 px-4 sm:px-7 rounded-xl bg-[#FF5B00] hover:bg-[#E64D00] text-white font-black text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#FF5B00]/30 transition-all active:scale-95 glow-orange cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white text-white hidden sm:inline-block" />
            <span>İNDİ SİFARİŞ ET</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
