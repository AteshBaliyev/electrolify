'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag, Truck, ShieldCheck, Heart, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product, badge = null, discount = null }) {
  const { addToCart } = useCart();

  if (!product) return null;

  const currentPrice =
    product.priceRange?.minVariantPrice?.amount || '0.00';
  const comparePrice =
    product.compareAtPriceRange?.minVariantPrice?.amount || null;
  const imageUrl =
    product.images?.edges?.[0]?.node?.url ||
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80';

  const defaultVariant = product.variants?.edges?.[0]?.node;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultVariant, 1);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white border border-neutral-200 hover:border-[#FF5B00]/50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl">
      {/* Üst Şəkil Çərçivəsi (Kliklənən Link) */}
      <Link
        href={`/products/${product.handle}`}
        className="block relative aspect-square bg-neutral-50 overflow-hidden cursor-pointer"
        aria-label={product.title}
      >
        {/* Endirim və ya Xüsusi Nişan */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 flex flex-col gap-1">
          {discount && (
            <span className="bg-[#FF5B00] text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded shadow-md">
              {discount}
            </span>
          )}
          {badge && (
            <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded shadow-md">
              {badge}
            </span>
          )}
        </div>

        {/* Məhsul Şəkli */}
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Sürətli Səbətə At Hover Düyməsi (Masaüstü üçün) */}
        <button
          onClick={handleQuickAdd}
          aria-label="Səbətə əlavə et"
          className="absolute bottom-2.5 right-2.5 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF5B00] hover:bg-[#E64D00] text-white hidden sm:flex items-center justify-center shadow-xl transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 active:scale-90 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </Link>

      {/* Məhsul Təfərrüatları */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Ulduzlar və Reytinq */}
          <div className="flex items-center gap-1 mb-1">
            <div className="flex text-yellow-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400" />
              ))}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-neutral-900">4.9</span>
            <span className="text-[9px] sm:text-[10px] text-neutral-500">(184)</span>
          </div>

          {/* Başlıq */}
          <Link href={`/products/${product.handle}`} className="block group/title">
            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover/title:text-[#FF5B00] transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h4>
          </Link>
        </div>

        <div>
          {/* Qiymət Bloku */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 pt-1 border-t border-neutral-100">
            <span className="text-sm sm:text-lg md:text-xl font-black text-[#FF5B00]">
              {currentPrice} AZN
            </span>
            {comparePrice && (
              <span className="text-[10px] sm:text-xs text-neutral-400 line-through font-medium">
                {comparePrice} AZN
              </span>
            )}
          </div>

          {/* Səbətə Əlavə Et Düyməsi */}
          <div className="pt-2">
            <button
              onClick={handleQuickAdd}
              className="w-full min-h-[42px] sm:min-h-[46px] py-2 sm:py-2.5 px-2.5 sm:px-4 rounded-xl bg-neutral-900 hover:bg-[#FF5B00] text-white font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span>Səbətə At</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
