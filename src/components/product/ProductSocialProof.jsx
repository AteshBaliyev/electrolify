'use client';

import React from 'react';
import { Flame, Eye, Heart, AlertCircle } from 'lucide-react';
import { useFakeStats } from '@/hooks/useFakeStats';

export default function ProductSocialProof({ productId = '' }) {
  const { likes, viewers, soldLast24Hours, stockLeft } = useFakeStats({
    productId,
    liveViewers: true,
  });

  return (
    <div className="flex flex-col gap-2 w-full my-2">
      {/* 3 Kompakt Sosial Sübut Kartı (Tək sətir) */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {/* 1. Baxanlar */}
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-orange-50/80 border border-orange-200 text-center justify-center">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <p className="text-[11px] text-neutral-700 truncate">
            👀 <strong className="text-[#FF5B00] font-black">{viewers}</strong> baxır
          </p>
        </div>

        {/* 2. Satılan */}
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center justify-center">
          <p className="text-[11px] text-neutral-700 truncate">
            🔥 <strong className="text-emerald-700 font-black">{soldLast24Hours}</strong> satıldı
          </p>
        </div>

        {/* 3. Bəyənmə */}
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-pink-50/80 border border-pink-200 text-center justify-center">
          <p className="text-[11px] text-neutral-700 truncate">
            ❤️ <strong className="text-pink-600 font-black">{likes}</strong> bəyəndi
          </p>
        </div>
      </div>

      {/* Kompakt Stok Təciliyi Zolağı */}
      <div className="px-3 py-2 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-2 text-xs">
        <span className="text-amber-900 font-bold flex items-center gap-1.5 text-[11px]">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />
          <span>Tələsin! Yalnız <strong className="text-[#FF5B00] font-black">{stockLeft} ədəd</strong> qaldı!</span>
        </span>
        <span className="text-[10px] text-neutral-500 font-mono shrink-0">89% tükəndi</span>
      </div>
    </div>
  );
}

