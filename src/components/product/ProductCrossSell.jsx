'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Zap, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CROSS_SELL_PRODUCTS } from '@/data/crossSellProducts';

export default function ProductCrossSell({
  mainProduct,
  currentVariant,
  recommendedProducts = [],
}) {
  const { addToCart, addCrossSellItem, openCart } = useCart();
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isBundleAdded, setIsBundleAdded] = useState(false);

  // Mağazanın digər məhsullarından dəst siyahısını formalaşdır
  const bundleItems = useMemo(() => {
    if (recommendedProducts && recommendedProducts.length > 0) {
      return recommendedProducts.slice(0, 4).map((p, idx) => {
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
            ? p.description.slice(0, 75).trim() + '...'
            : 'Rəsmi zəmanətli mağaza məhsulu',
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

  // İlk tövsiyə olunan mağaza məhsulunu avtomatik seç
  useEffect(() => {
    if (bundleItems.length > 0) {
      setSelectedAddons([bundleItems[0].id]);
    }
  }, [bundleItems]);

  const mainPrice = parseFloat(
    currentVariant?.price?.amount || mainProduct?.priceRange?.minVariantPrice?.amount || 0
  );

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Seçilmiş dəst məhsulları və yekun qiymət hesabı
  const selectedCrossItems = bundleItems.filter((item) =>
    selectedAddons.includes(item.id)
  );
  const addonsTotal = selectedCrossItems.reduce((acc, item) => acc + item.price, 0);
  const bundleTotalPrice = (mainPrice + addonsTotal).toFixed(2);
  const bundleComparePrice = (
    parseFloat(
      currentVariant?.compareAtPrice?.amount ||
        mainProduct?.compareAtPriceRange?.minVariantPrice?.amount ||
        mainPrice * 1.35
    ) + selectedCrossItems.reduce((acc, item) => acc + item.compareAtPrice, 0)
  ).toFixed(2);

  const handleAddBundle = () => {
    // 1. Əsas məhsulu səbətə əlavə et
    if (mainProduct) {
      const variant = currentVariant || mainProduct.variants?.edges?.[0]?.node;
      addToCart(mainProduct, variant, 1, false);
    }

    // 2. Seçilmiş tövsiyə olunan mağaza məhsullarını səbətə əlavə et
    selectedCrossItems.forEach((cross) => {
      if (cross.rawProduct) {
        const variant =
          cross.rawProduct.variants?.edges?.[0]?.node || {
            id: cross.rawProduct.id,
            title: 'Standart',
            price: { amount: String(cross.price), currencyCode: 'AZN' },
          };
        addToCart(cross.rawProduct, variant, 1, false);
      } else {
        addCrossSellItem(cross);
      }
    });

    setIsBundleAdded(true);
    setTimeout(() => {
      setIsBundleAdded(false);
      openCart();
    }, 600);
  };

  if (bundleItems.length === 0) return null;

  return (
    <section className="w-full my-12 p-5 sm:p-7 rounded-3xl bg-white border border-neutral-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-neutral-100">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5B00] flex items-center gap-1.5 mb-1 font-bold">
            <Zap className="w-3.5 h-3.5 fill-[#FF5B00]" /> Mağazamızın Digər Məhsulları ilə Xüsusi Dəst
          </span>
          <h3 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">
            Bununla Birlikdə Tez-tez Alınırlar
          </h3>
        </div>
        <span className="text-xs text-neutral-700 bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-full font-medium">
          🔥 Birlikdə alarkən <strong>əlavə xüsusi qənaət</strong>
        </span>
      </div>

      {/* Tövsiyə Olunan Mağaza Məhsulları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-6">
        {bundleItems.map((cross) => {
          const isSelected = selectedAddons.includes(cross.id);
          return (
            <div
              key={cross.id}
              onClick={() => toggleAddon(cross.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-orange-50/50 border-[#FF5B00] shadow-sm'
                  : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#FF5B00] border-[#FF5B00] text-white'
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-[10px] font-black text-white bg-[#10B981] px-1.5 py-0.5 rounded">
                    {cross.discount}
                  </span>
                </div>

                <div className="relative aspect-square rounded-xl bg-white overflow-hidden mb-3 border border-neutral-200">
                  <Image
                    src={cross.image}
                    alt={cross.title}
                    fill
                    sizes="140px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                <h4 className="text-xs font-bold text-neutral-900 leading-snug line-clamp-2">
                  {cross.title}
                </h4>
                <p className="text-[10px] text-neutral-500 mt-1 line-clamp-1">
                  {cross.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-black text-[#FF5B00]">
                    {cross.price.toFixed(2)} AZN
                  </span>
                  <span className="text-[10px] text-neutral-400 line-through">
                    {cross.compareAtPrice.toFixed(2)} AZN
                  </span>
                </div>

                {cross.handle && (
                  <Link
                    href={`/products/${cross.handle}`}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 text-[10px] font-bold text-[#FF5B00] hover:text-[#E64D00] inline-flex items-center gap-0.5 transition-colors"
                  >
                    Məhsula bax <ChevronRight className="w-2.5 h-2.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dəst Cəmi və Səbətə At Düyməsi */}
      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-neutral-600 block">
            Seçilmiş məhsullarla ümumi dəst qiyməti:
          </span>
          <div className="flex items-baseline gap-3 mt-0.5">
            <span className="text-2xl font-black text-[#FF5B00]">
              {bundleTotalPrice} AZN
            </span>
            <span className="text-sm text-neutral-400 line-through">
              {bundleComparePrice} AZN
            </span>
            {parseFloat(bundleComparePrice) > parseFloat(bundleTotalPrice) && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                {(bundleComparePrice - bundleTotalPrice).toFixed(2)} AZN Qənaət
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddBundle}
          className="w-full sm:w-auto min-h-[48px] py-3.5 px-8 rounded-xl bg-[#FF5B00] hover:bg-[#E64D00] text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-[#FF5B00]/25 transition-all active:scale-95 glow-orange cursor-pointer"
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
