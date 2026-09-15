'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CROSS_SELL_PRODUCTS } from '@/data/crossSellProducts';

export default function ProductCrossSell({
  mainProduct,
  currentVariant,
  recommendedProducts = [],
}) {
  const { addToCart, addCrossSellItem } = useCart();

  // Mağazanın digər məhsullarından tövsiyə siyahısını formalaşdır
  const bundleItems = useMemo(() => {
    if (recommendedProducts && recommendedProducts.length > 0) {
      return recommendedProducts
        .filter((p) => {
          if (!mainProduct) return true;
          const mainHandle = (mainProduct.handle || '').toLowerCase();
          const itemHandle = (p.handle || '').toLowerCase();
          return itemHandle !== mainHandle;
        })
        .slice(0, 4)
        .map((p, idx) => {
          const price = parseFloat(
            p.priceRange?.minVariantPrice?.amount || p.price || 0
          );
          const compareAtPrice = parseFloat(
            p.compareAtPriceRange?.minVariantPrice?.amount ||
              p.compareAtPrice ||
              (price > 0 ? (price * 1.45).toFixed(2) : 0)
          );
          const discountVal =
            compareAtPrice > price
              ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
              : 20;

          const imageUrl =
            p.images?.edges?.[0]?.node?.url ||
            p.image ||
            'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80';

          return {
            id: String(p.id || `rec-${idx}`),
            title: p.title,
            category: 'Electrolify Seçimi',
            price,
            compareAtPrice,
            discount: `-${discountVal}%`,
            image: imageUrl,
            description: p.description
              ? p.description.slice(0, 80).trim() + '...'
              : 'Orijinal zəmanətli mağaza məhsulu',
            handle: p.handle,
            rawProduct: p,
          };
        });
    }

    // Əgər serverdən gəlməyibsə, cari məhsulu çıxmaqla CROSS_SELL_PRODUCTS-dən istifadə et
    return CROSS_SELL_PRODUCTS.filter((item) => {
      if (!mainProduct) return true;
      const mainHandle = (mainProduct.handle || '').toLowerCase();
      const itemHandle = (item.handle || '').toLowerCase();
      return itemHandle !== mainHandle;
    }).slice(0, 4);
  }, [recommendedProducts, mainProduct]);

  const handleOrderProduct = (cross) => {
    if (cross.rawProduct) {
      const variant =
        cross.rawProduct.variants?.edges?.[0]?.node || {
          id: cross.rawProduct.id,
          title: 'Standart',
          price: { amount: String(cross.price), currencyCode: 'AZN' },
        };
      addToCart(cross.rawProduct, variant, 1, true);
    } else {
      addCrossSellItem(cross);
    }
  };

  if (bundleItems.length === 0) return null;

  return (
    <section className="w-full my-10 p-5 sm:p-7 rounded-3xl bg-white border border-neutral-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5B00] flex items-center gap-1.5 mb-1 font-bold">
            <Zap className="w-3.5 h-3.5 fill-[#FF5B00]" /> Tövsiyə Edilən Məhsullar
          </span>
          <h3 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">
            Bununla Birlikdə Tez-tez Alınırlar
          </h3>
        </div>
      </div>

      {/* Tövsiyə Olunan Mağaza Məhsulları */}
      <div
        className={`grid gap-4 my-5 ${
          bundleItems.length === 1
            ? 'grid-cols-1 max-w-sm'
            : 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
        }`}
      >
        {bundleItems.map((cross) => {
          const productHref = `/products/${cross.handle}`;
          return (
            <div
              key={cross.id}
              className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all flex flex-col justify-between shadow-sm relative group"
            >
              <div>
                {/* Endirim Nişanı */}
                {cross.discount && (
                  <div className="absolute top-6 right-6 z-10">
                    <span className="text-[10px] font-black text-white bg-[#10B981] px-2 py-0.5 rounded-md shadow-xs">
                      {cross.discount}
                    </span>
                  </div>
                )}

                {/* Şəkil (Kliklənən Link - birbaşa məhsul səhifəsinə aparır) */}
                <Link
                  href={productHref}
                  className="block relative aspect-square rounded-xl bg-neutral-50 overflow-hidden mb-3 border border-neutral-200 group-hover:opacity-90 transition-opacity"
                  aria-label={cross.title}
                >
                  <Image
                    src={cross.image}
                    alt={cross.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>

                {/* Ad (Kliklənən Link - birbaşa məhsul səhifəsinə aparır) */}
                <Link href={productHref} className="block group/title">
                  <h4 className="text-sm font-bold text-neutral-900 leading-snug line-clamp-2 group-hover/title:text-[#FF5B00] transition-colors">
                    {cross.title}
                  </h4>
                </Link>

                {/* Açıqlama */}
                <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {cross.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100">
                {/* Qiymət */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-base font-black text-[#FF5B00]">
                    {cross.price.toFixed(2)} AZN
                  </span>
                  {cross.compareAtPrice > cross.price && (
                    <span className="text-xs text-neutral-400 line-through">
                      {cross.compareAtPrice.toFixed(2)} AZN
                    </span>
                  )}
                </div>

                {/* 2 Hissəli Düymələr: "Məhsula Bax" və "Sifariş Ver" */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={productHref}
                    className="min-h-[42px] px-3 py-2 rounded-xl border border-neutral-300 hover:border-neutral-400 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors text-center cursor-pointer active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Məhsula Bax</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleOrderProduct(cross)}
                    className="min-h-[42px] px-3 py-2 rounded-xl bg-[#FF5B00] hover:bg-[#E64D00] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#FF5B00]/25 transition-all active:scale-95 cursor-pointer text-center"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Səbətə At</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
