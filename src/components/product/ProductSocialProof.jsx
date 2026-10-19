'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useFakeStats } from '@/hooks/useFakeStats';
import { getProductTheme } from '@/lib/productTheme';

export default function ProductSocialProof({ product, productId = '', theme }) {
  const activeTheme = theme || getProductTheme(product);
  const { stockLeft, viewers } = useFakeStats({
    productId: productId || product?.id,
    liveViewers: true,
  });

  return (
    <div className="flex flex-col gap-2.5 w-full my-2">
      {/* Kompakt Canlı Stok və Baxış Təciliyi Zolağı */}
      <div className={`px-3.5 py-2.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs shadow-xs transition-colors ${activeTheme.urgencyBg || 'bg-amber-50/80'} ${activeTheme.urgencyBorder || 'border-amber-200/90'}`}>
        <span className={`${activeTheme.urgencyText || 'text-amber-900'} font-bold flex items-center gap-1.5 text-xs`}>
          <AlertCircle className={`w-4 h-4 ${activeTheme.urgencyIcon || 'text-amber-600'} animate-pulse shrink-0`} />
          <span>
            Tələsin! Stokda yalnız <strong className="font-black" style={{ color: activeTheme.primary }}>{stockLeft} ədəd</strong> qaldı!
          </span>
        </span>
        <div className="flex items-center gap-2 text-[11px] text-neutral-600 shrink-0">
          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            {viewers} nəfər hazırda baxır
          </span>
        </div>
      </div>
    </div>
  );
}

