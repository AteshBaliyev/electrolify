'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, Clock, Zap, ChevronRight, Star, ShoppingBag } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/shopify';
import { useCart } from '@/context/CartContext';

export default function FlashSales({ products = MOCK_PRODUCTS }) {
  const { addToCart } = useCart();

  const displayProducts = (products && products.length > 0 ? products : MOCK_PRODUCTS).slice(0, 4);

  // Geriyə sayan canlı taymer (məsələn: 04:23:15)
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 23,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num) => String(num).padStart(2, '0');

  return (
    <section className="w-full my-6 sm:my-10 p-3 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-orange-50/70 via-white to-neutral-50 border border-orange-200 shadow-xl relative overflow-hidden">
      {/* Üst Başlıq və Geriyə Sayan Taymer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-orange-200/60">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#FF5B00] flex items-center justify-center text-white shadow-lg shadow-[#FF5B00]/30 animate-pulse">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#FF5B00] font-black">
                Məhdud Müddətli
              </span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-neutral-900 tracking-tight">
              Günün Fürsətləri (Flash Sales)
            </h2>
          </div>
        </div>

        {/* Geriyə Sayan Canlı Taymer */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white border border-orange-200 py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl self-start sm:self-auto shrink-0 shadow-sm">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF5B00] animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-[11px] sm:text-xs font-bold text-neutral-600 mr-1">Bitməsinə:</span>
          <div className="flex items-center gap-1 font-mono font-black text-[11px] sm:text-xs text-neutral-900">
            <span className="bg-orange-50 border border-orange-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[#FF5B00]">
              {formatDigit(timeLeft.hours)}
            </span>
            <span>:</span>
            <span className="bg-orange-50 border border-orange-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[#FF5B00]">
              {formatDigit(timeLeft.minutes)}
            </span>
            <span>:</span>
            <span className="bg-orange-50 border border-orange-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[#FF5B00]">
              {formatDigit(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Fürsət Məhsulları Qalereyası: Mobildə yan-yana 2-li, planşetdə 2-li, böyük ekranda 4-lü */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 mt-4 sm:mt-6">
        {displayProducts.map((prod, idx) => {
          const discountTags = ['-44% ENDİRİM', '-47% ENDİRİM', '-40% ENDİRİM', '-35% ENDİRİM'];
          const soldPercentages = [84, 76, 91, 68];
          const imgUrl = prod.images?.edges?.[0]?.node?.url || prod.images?.[0] || 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80';
          const defaultVariant = prod.variants?.edges?.[0]?.node || prod.variants?.[0];

          return (
            <div
              key={prod.id}
              className="p-2.5 sm:p-4 rounded-2xl bg-white border border-neutral-200 hover:border-[#FF5B00]/60 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                {/* Kliklənən Məhsul Şəkli */}
                <Link
                  href={`/products/${prod.handle}`}
                  className="block relative aspect-square rounded-xl bg-neutral-50 overflow-hidden mb-2.5 cursor-pointer group/img"
                  aria-label={prod.title}
                >
                  <span className="absolute top-2 left-2 z-10 bg-[#FF5B00] text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded shadow">
                    {discountTags[idx % discountTags.length]}
                  </span>
                  <Image
                    src={imgUrl}
                    alt={prod.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                    className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Reytinq */}
                <div className="flex items-center gap-1 text-yellow-400 mb-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-neutral-800 ml-0.5">4.9</span>
                </div>

                <Link href={`/products/${prod.handle}`} className="block group/title">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover/title:text-[#FF5B00] transition-colors line-clamp-2 leading-snug">
                    {prod.title}
                  </h4>
                </Link>
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-100 space-y-2 sm:space-y-2.5">
                {/* Qiymət */}
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
                    <span className="text-sm sm:text-lg md:text-xl font-black text-[#FF5B00]">
                      {prod.priceRange?.minVariantPrice?.amount || '0.00'} AZN
                    </span>
                    {prod.compareAtPriceRange?.minVariantPrice?.amount && (
                      <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                        {prod.compareAtPriceRange.minVariantPrice.amount} AZN
                      </span>
                    )}
                  </div>
                </div>

                {/* Satış Zolağı */}
                <div>
                  <div className="flex justify-between text-[9px] sm:text-[10px] text-neutral-500 font-semibold mb-1">
                    <span>Satıldı: {soldPercentages[idx % soldPercentages.length]}%</span>
                    <span className="text-red-500 hidden xs:inline">Son ədədlər</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-[#FF5B00] rounded-full"
                      style={{ width: `${soldPercentages[idx % soldPercentages.length]}%` }}
                    />
                  </div>
                </div>

                {/* Düymə */}
                <button
                  onClick={() => addToCart(prod, defaultVariant, 1)}
                  className="w-full min-h-[42px] sm:min-h-[48px] py-2 sm:py-2.5 px-2 rounded-xl bg-[#FF5B00] hover:bg-[#E64D00] text-white font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-transform active:scale-95 glow-orange shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  <span>Səbətə At</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
