'use client';

import React from 'react';
import { AlertCircle, Zap } from 'lucide-react';
import { useFakeStats } from '@/hooks/useFakeStats';
import CustomerSalesBadge from './CustomerSalesBadge';

export default function ProductSocialProof({ product, productId = '' }) {
  const { stockLeft, viewers } = useFakeStats({
    productId: productId || product?.id,
    liveViewers: true,
  });

  return (
    <div className="flex flex-col gap-2.5 w-full my-2">
      {/* 1. İstifadəçinin göndərdiyi formatda Real Müştəri və Sifariş Statistikası Nişanı */}
      <CustomerSalesBadge product={product} className="w-full justify-start sm:justify-start" />

      {/* 2. Kompakt Canlı Stok və Baxış Təciliyi Zolağı */}
      <div className="px-3.5 py-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs shadow-xs">
        <span className="text-amber-900 font-bold flex items-center gap-1.5 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
          <span>
            Tələsin! Stokda yalnız <strong className="text-[#FF5B00] font-black">{stockLeft} ədəd</strong> qaldı!
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

