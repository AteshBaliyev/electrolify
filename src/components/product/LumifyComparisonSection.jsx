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
  Flame,
  Gift,
  Eye,
  Sliders,
  BatteryCharging,
  ShoppingBag,
} from 'lucide-react';
import { getProductTheme } from '@/lib/productTheme';

export default function LumifyComparisonSection({ product, theme }) {
  const activeTheme = theme || getProductTheme(product || 'lumify');

  const scrollToOrder = (e) => {
    e.preventDefault();
    const orderBtn =
      document.getElementById('main-order-button') ||
      document.getElementById('checkout-form');
    if (orderBtn) {
      orderBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const comparisonRows = [
    {
      feature: '16 Fərqli Bayram və Nağıl Naxışı',
      lumify: true,
      others: false,
    },
    {
      feature: '270° Fırlanan və İstiqamətlənən Bucaq',
      lumify: true,
      others: false,
    },
    {
      feature: 'Divar və Mebelə Zərər Verməyən Rahat Quraşdırma',
      lumify: true,
      others: false,
    },
    {
      feature: 'Qızmayan və Təhlükəsiz Soyuq LED Korpus',
      lumify: true,
      others: false,
    },
    {
      feature: 'USB & Powerbank İlə Hər Yerdə İşləmə',
      lumify: true,
      others: false,
    },
    {
      feature: 'Sürətli Çatdırılma və Qapıda Ödəniş Zəmanəti',
      lumify: true,
      others: false,
    },
  ];

  const featureCards = [
    {
      title: '16 Fərqli Bayram Naxışı',
      desc: 'Şaxta baba, maral arabası, uçuşan qar dənələri, yolkalar və ulduzlar bir cihazda.',
      img: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/512d6254-ad6a-4fe4-8264-667b8d575652.jpg?v=1792430765',
      badge: '16 REJİM',
      icon: Gift,
    },
    {
      title: '270° Tənzimlənən Bucağı',
      desc: 'Tavana, divara və ya pərdəyə tək hərəkətlə istədiyiniz bucaqda yönləndirin.',
      img: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/723f2d20-65e0-4cf7-9266-cc3c25ae69e4.jpg?v=1792430728',
      badge: '270° ROTASİYA',
      icon: Sliders,
    },
    {
      title: 'USB & Powerbank Uyğunluğu',
      desc: 'Sadə adapter, noutbuk və ya telefon powerbank-ı ilə həm evdə, həm bağda fasiləsiz işləyir.',
      img: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/9fc531f6-7586-4131-9986-b0fc813cc3b6.jpg?v=1792430752',
      badge: 'USB ENERJİ',
      icon: BatteryCharging,
    },
    {
      title: 'Uşaqlar və Qonaqlar Üçün Nağılvari Mühit',
      desc: 'Gözləri yormayan yumşaq optik linza və soyuq LED ilə 100% təhlükəsiz və sehirli aura.',
      img: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/723c70d6-dbe9-49f2-98ce-b10759a195b5.jpg?v=1792430737',
      badge: 'GÖZ QORUMASI',
      icon: Eye,
    },
  ];

  return (
    <section className="my-10 sm:my-16 space-y-10 sm:space-y-12">
      {/* =========================================================================
          1. REAL GÖSTƏRİCİLƏR VƏ XÜSUSİYYƏT KARTLARI
          ========================================================================= */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span
            className="text-[11px] font-mono uppercase tracking-widest font-bold px-3.5 py-1 rounded-full border inline-flex items-center gap-1.5 mb-2.5 transition-colors"
            style={{
              color: activeTheme.primary,
              backgroundColor: activeTheme.primaryLight,
              borderColor: activeTheme.primaryBorder,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: activeTheme.primary }} />
            Sehrli Bayram Texnologiyası
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Evinizi Bir Düymə İlə Nağıllar Aləminə Çevirin
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
            Köhnə, dolaşan və tez xarab olan bazar ledlərini unudun. Lumify Pro divar və tavanı bürüyən canlı bayram proyeksiya effektləri təqdim edir.
          </p>
        </div>

        {/* 4 Əsas Üstünlük Qutusu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group rounded-2xl border border-neutral-200/90 bg-neutral-50/60 hover:bg-white hover:border-indigo-300 p-4 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-900 border border-neutral-200">
                    <Image
                      src={card.img}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/80 text-white backdrop-blur-sm">
                      {card.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon className="w-4 h-4 text-indigo-600 shrink-0" />
                    <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real Nəticə Statistikası */}
        <div className="mt-8 pt-6 border-t border-neutral-200/80 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="block text-2xl font-black text-indigo-600 font-mono">16</span>
            <span className="text-xs text-neutral-600 font-medium mt-0.5 block">
              Dinamik Nağıl Motivi
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="block text-2xl font-black text-emerald-600 font-mono">270°</span>
            <span className="text-xs text-neutral-600 font-medium mt-0.5 block">
              Tənzimlənən Bucağı
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="block text-2xl font-black text-purple-600 font-mono">100%</span>
            <span className="text-xs text-neutral-600 font-medium mt-0.5 block">
              Soyuq LED & Təhlükəsiz
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="block text-2xl font-black text-blue-600 font-mono">1050+</span>
            <span className="text-xs text-neutral-600 font-medium mt-0.5 block">
              Məmnun Alıcı Azərbaycanda
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. DƏQİQ QARŞILAŞDIRMA CƏDVƏLİ VƏ ÇAĞIRIŞ BLOKU
          ========================================================================= */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sol Tərəf: Cədvəl Kartı */}
          <div className="lg:col-span-7 flex flex-col items-center sm:items-start w-full">
            <div className="w-full max-w-lg">
              {/* Sütun Başlıqları: Lumify Pro və Başqaları */}
              <div className="flex justify-end pr-2 sm:pr-4 mb-2">
                <div className="grid grid-cols-2 gap-2 sm:gap-4 w-[140px] sm:w-[170px] text-center">
                  <span className="text-xs sm:text-sm font-black text-neutral-900 tracking-tight">
                    Lumify Pro
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-neutral-500 tracking-tight">
                    Başqaları
                  </span>
                </div>
              </div>

              {/* Əsas Cədvəl Kartı */}
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
                        {/* Lumify Pro Sütunu: Qalın Check (✓) */}
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

          {/* Sağ Tərəf: Trendim Çağırış Mətni və Düyməsi */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#111827] flex items-center justify-center text-white shadow-md shrink-0">
                <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
                Trendim®
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-md">
              Mövsümün Ən Çox Sevilən Bayram İşıqları! İndi sifariş edin, xüsusi bayram endirimindən yararlanın və pulsuz sürətli çatdırılma əldə edin.
            </p>

            <div className="pt-2 w-full flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={scrollToOrder}
                style={{
                  backgroundColor: activeTheme.primary,
                  boxShadow: `0 10px 25px -5px ${activeTheme.primaryGlow}`,
                }}
                className="w-full sm:w-auto min-h-[50px] px-6 py-3.5 rounded-2xl text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer hover:brightness-95"
              >
                <Zap className="w-4 h-4 fill-white text-white" />
                <span>İndi Al, Qapıda Ödə</span>
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
