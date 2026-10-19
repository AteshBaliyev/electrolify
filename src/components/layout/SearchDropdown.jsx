'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';
import { searchStoreProducts, SEARCHABLE_PRODUCTS } from '@/lib/searchHelper';

export default function SearchDropdown({
  query = '',
  isOpen = false,
  onClose,
  className = '',
}) {
  if (!isOpen) return null;

  const results = searchStoreProducts(query);
  const isQueryEmpty = !query.trim();

  return (
    <div
      className={`absolute z-50 bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ${className}`}
    >
      {/* Başlıq Hissəsi */}
      <div className="px-4 py-2.5 bg-neutral-50/90 border-b border-neutral-200/80 flex items-center justify-between text-xs text-neutral-500">
        <span className="font-bold flex items-center gap-1.5 text-neutral-700">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5B00]" />
          {isQueryEmpty ? 'Tövsiyə Olunan Məhsullar' : `Axtarış Nəticələri (${results.length})`}
        </span>
        <span className="text-[11px] text-neutral-400">
          {isQueryEmpty ? 'Bütün Seçimlər' : `"${query}" üzrə`}
        </span>
      </div>

      {/* Məhsul Siyahısı */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-neutral-100 p-1.5">
        {results.length > 0 ? (
          results.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              onClick={onClose}
              className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Kiçik Şəkil */}
                <div className="relative w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="48px"
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Ad, Kateqoriya və Qiymət */}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate group-hover:text-[#FF5B00] transition-colors">
                      {product.shortTitle || product.title}
                    </span>
                    {product.badge && (
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-[#FF5B00]/10 text-[#FF5B00] shrink-0">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-black text-neutral-900">
                      {product.price} AZN
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-[11px] text-neutral-400 line-through">
                        {product.compareAtPrice} AZN
                      </span>
                    )}
                    {product.discount && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                        {product.discount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sağ Ox */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-[#FF5B00] group-hover:translate-x-0.5 transition-all shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))
        ) : (
          <div className="py-6 px-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-2">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-neutral-800">
              Axtarışınıza uyğun məhsul tapılmadı
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">
              "Clarify", "İstiƏl" və ya "Lumify" axtarmağı yoxlayın.
            </p>
          </div>
        )}
      </div>

      {/* Alt Zolaq - Bütün Kataloqa Keçid */}
      <div className="p-2 bg-neutral-50 border-t border-neutral-100">
        <Link
          href="/products"
          onClick={onClose}
          className="w-full py-2 px-3 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
        >
          <span>Bütün Məhsullar Kataloquna Bax ({SEARCHABLE_PRODUCTS.length})</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#FF5B00]" />
        </Link>
      </div>
    </div>
  );
}
