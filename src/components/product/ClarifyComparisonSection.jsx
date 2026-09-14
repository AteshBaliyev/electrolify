'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Clock,
  HeartHandshake,
} from 'lucide-react';

export default function ClarifyComparisonSection({ product }) {
  const scrollToOrder = (e) => {
    e.preventDefault();
    const orderBtn = document.getElementById('main-order-button') || document.getElementById('checkout-form');
    if (orderBtn) {
      orderBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const comparisonRows = [
    {
      feature: 'Həssas Dərilər Üçün Uyğunluq',
      clarify: true,
      others: false,
    },
    {
      feature: 'Fərqli Bölgələr Üçün 3 Ucluq',
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
    <section className="my-10 sm:my-16 space-y-10 sm:space-y-12">
      {/* =========================================================================
          1. ƏVVƏL VƏ SONRA (BEFORE & AFTER) QARŞILAŞDIRMA BÖLMƏSİ
          ========================================================================= */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5B00] font-bold bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5B00]" />
            Gözlə Görünən Dəri Fərqi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            İlk İstifadə Dən Dərhal Sonra Real Nəticə
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
            Clarify Pro vakum texnologiyası dərini sıxmadan və ləkə qoymadan məsamələri dərindən təmizləyir, qara nöqtələri kökündən yox edir.
          </p>
        </div>

        {/* 2 Ədəd Realist Əvvəl / Sonra Kartı */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Kart 1: Burun və Yanaq Məsamələri */}
          <div className="flex flex-col bg-neutral-50 border border-neutral-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden">
              <Image
                src="/images/clarify/before-after-face.jpg"
                alt="Clarify Pro Burun və Yanaq Əvvəl Sonra Nəticəsi"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Əvvəl / Sonra Vizual Nişanları */}
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border border-white/20 shadow-md">
                ƏVVƏL
              </div>
              <div className="absolute top-3 right-3 bg-[#10B981]/90 backdrop-blur-sm text-white text-[11px] font-mono font-black px-2.5 py-1 rounded-lg border border-white/20 shadow-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> SONRA
              </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
                  Burun və Yanaq Məsamələrinin Dərindən Təmizlənməsi
                </h3>
                <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                  İri və çirklənmiş məsamələr vakum gücü ilə ağrısız təmizlənir, dəri hamar və parlaq teksturaya qovuşur.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  98% Təmizlənmə
                </span>
                <span className="text-neutral-500 font-medium">
                  Yalnız 1 istifadədən sonra
                </span>
              </div>
            </div>
          </div>

          {/* Kart 2: T-Bölgəsi və Dərin Qara Nöqtələr */}
          <div className="flex flex-col bg-neutral-50 border border-neutral-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden">
              <Image
                src="/images/clarify/before-after-nose.jpg"
                alt="Clarify Pro Burun Nahiyəsi Qara Nöqtə Təmizlənməsi Əvvəl Sonra"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border border-white/20 shadow-md">
                ƏVVƏL
              </div>
              <div className="absolute top-3 right-3 bg-[#10B981]/90 backdrop-blur-sm text-white text-[11px] font-mono font-black px-2.5 py-1 rounded-lg border border-white/20 shadow-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> SONRA
              </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
                  Kök Salmış Qara Nöqtələrin və Yağın Çıxarılması
                </h3>
                <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                  Əllə sıxmağa və qızartılara son qoyun! 3 fərqli ucluq sayəsində dərinin ən dar nöqtələrində belə zərərsiz nəticə.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  100% Ağrısız və Təhlükəsiz
                </span>
                <span className="text-neutral-500 font-medium">
                  Bütün dəri tiplərinə uyğun
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 3 Əsas Sübut Göstəricisi */}
        <div className="mt-8 pt-6 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="block text-2xl font-black text-[#FF5B00] font-mono">98%</span>
            <span className="text-xs text-neutral-600 font-medium mt-0.5 block">
              Qara nöqtələrdə dərhal azalma
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="block text-2xl font-black text-emerald-600 font-mono">3 Ucluq</span>
            <span className="text-xs text-neutral-600 font-medium mt-0.5 block">
              Hər üz nahiyəsi üçün 3 xüsusi başlıq
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="block text-2xl font-black text-blue-600 font-mono">1200+</span>
            <span className="text-xs text-neutral-600 font-medium mt-0.5 block">
              Məmnun Müştəri Azərbaycanda
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. DƏQİQ QARŞILAŞDIRMA CƏDVƏLİ VƏ ÇAĞIRIŞ BLOKU (ŞƏKİLDƏKİ FORMADA)
          ========================================================================= */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sol Tərəf: İstifadəçinin göndərdiyi dəqiq cədvəl dizaynı */}
          <div className="lg:col-span-7 flex flex-col items-center sm:items-start w-full">
            
            {/* Cədvəl Konteyneri */}
            <div className="w-full max-w-lg">
              {/* Sütun Başlıqları: Clarify Pro və Başqaları */}
              <div className="flex justify-end pr-2 sm:pr-4 mb-2">
                <div className="grid grid-cols-2 gap-2 sm:gap-4 w-[140px] sm:w-[170px] text-center">
                  <span className="text-xs sm:text-sm font-black text-neutral-900 tracking-tight">
                    Clarify Pro
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-neutral-500 tracking-tight">
                    Başqaları
                  </span>
                </div>
              </div>

              {/* Əsas Cədvəl Kartı: Sol tərəf qara arxa fon, sağ tərəf ağ arxa fon */}
              <div className="rounded-3xl overflow-hidden border border-neutral-200 shadow-xl bg-white">
                <div className="divide-y divide-neutral-200">
                  {comparisonRows.map((row, index) => (
                    <div
                      key={index}
                      className="flex items-stretch min-h-[52px] sm:min-h-[58px]"
                    >
                      {/* Sol Tərəf: Qara Fon, Ağ Mətn */}
                      <div className="bg-neutral-950 text-white flex-1 px-3 sm:px-5 py-3 flex items-center">
                        <span className="text-xs sm:text-sm font-bold leading-tight">
                          {row.feature}
                        </span>
                      </div>

                      {/* Sağ Tərəf: Ağ Fon, 2 Sütunlu İşarələr */}
                      <div className="bg-white w-[140px] sm:w-[170px] shrink-0 grid grid-cols-2 items-center text-center px-1">
                        {/* Clarify Pro Sütunu: Qalın Check (✓) */}
                        <div className="flex items-center justify-center">
                          <Check className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-950 stroke-[3]" />
                        </div>

                        {/* Başqaları Sütunu: X (✕) */}
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

          {/* Sağ Tərəf: İstifadəçinin Şəklindəki Elektrolify Mətni və Düyməsi */}
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

            <div className="pt-2 w-full flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={scrollToOrder}
                className="w-full sm:w-auto min-h-[50px] px-6 py-3.5 rounded-2xl bg-[#FF5B00] hover:bg-[#E64D00] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#FF5B00]/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white text-white" />
                <span>Qapıda Sifariş Ver</span>
              </button>

              <Link
                href="/products"
                className="w-full sm:w-auto min-h-[50px] px-6 py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 text-center"
              >
                <span>Bütün Məhsullara Bax</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Qapıda nağd və ya kartla ödəniş • 100% Orijinallıq Zəmanəti</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
