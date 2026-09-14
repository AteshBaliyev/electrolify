'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HomeComparison() {
  const comparisonRows = [
    {
      feature: 'Həssas Dərilər Üçün Uyğunluq',
      clarify: true,
      others: false,
    },
    {
      feature: 'Fərqli Bölgələri Üçün 6 Ucluq',
      clarify: true,
      others: false,
    },
    {
      feature: 'Uzunömürlü Simsiz Batareya',
      clarify: true,
      others: false,
    },
    {
      feature: 'Sürətli Çatdırılma və Zəmanət',
      clarify: true,
      others: false,
    },
  ];

  return (
    <section className="bg-white border border-neutral-200/80 rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm my-6 sm:my-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sol Tərəf: İstifadəçinin göndərdiyi formatda Cədvəl Kartı */}
        <div className="lg:col-span-7 flex flex-col items-center sm:items-start w-full">
          <div className="w-full max-w-lg">
            {/* Sütun Başlıqları: Clarify Pro və Başqaları */}
            <div className="flex justify-end pr-3 sm:pr-5 mb-2">
              <div className="grid grid-cols-2 gap-2 sm:gap-4 w-[140px] sm:w-[170px] text-center">
                <span className="text-xs sm:text-sm font-black text-neutral-900 tracking-tight">
                  Clarify Pro
                </span>
                <span className="text-xs sm:text-sm font-bold text-neutral-500 tracking-tight">
                  Başqaları
                </span>
              </div>
            </div>

            {/* Əsas Cədvəl Kartı: Sol tərəf qara, sağ tərəf ağ */}
            <div className="rounded-3xl overflow-hidden border border-neutral-200 shadow-xl bg-white">
              <div className="divide-y divide-neutral-200">
                {comparisonRows.map((row, index) => (
                  <div
                    key={index}
                    className="flex items-stretch min-h-[50px] sm:min-h-[56px]"
                  >
                    {/* Sol: Qara Fon, Ağ Mətn */}
                    <div className="bg-neutral-950 text-white flex-1 px-3.5 sm:px-5 py-3 flex items-center">
                      <span className="text-xs sm:text-sm font-bold leading-tight">
                        {row.feature}
                      </span>
                    </div>

                    {/* Sağ: Ağ Fon, 2 Sütun */}
                    <div className="bg-white w-[140px] sm:w-[170px] shrink-0 grid grid-cols-2 items-center text-center px-1">
                      <div className="flex items-center justify-center">
                        <Check className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-950 stroke-[3]" />
                      </div>
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-800 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Tərəf: Elektrolify Mətni və Düyməsi */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-neutral-950 border border-orange-500/30 overflow-hidden shadow-lg shadow-orange-500/10 shrink-0">
              <Image
                src="/logo-icon.png"
                alt="Electrolify Logo"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              Elektrolify®
            </h2>
          </div>

          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-md">
            İlin Ən Böyük Endirimi Başladı! İndi sifariş edin, 50% qənaət edin və pulsuz sürətli çatdırılma əldə edin.
          </p>

          <div className="pt-2 w-full sm:w-auto">
            <Link
              href="/products"
              className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-black text-sm uppercase tracking-wider shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Bütün Məhsullara Bax</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Qapıda nağd və ya kartla ödəniş • 100% Orijinallıq</span>
          </div>
        </div>
      </div>
    </section>
  );
}
