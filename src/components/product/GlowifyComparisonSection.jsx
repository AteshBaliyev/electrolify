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
  ArrowRight,
  ShoppingBag,
  Droplets,
  Music,
  Wind,
  Moon,
} from 'lucide-react';
import { getProductTheme } from '@/lib/productTheme';

export default function GlowifyComparisonSection({ product, theme }) {
  const activeTheme = theme || getProductTheme(product || 'glowify');

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
      feature: '6 Güclü Buxar Nozulu (Dərhal Bərabər Nəmləndirmə)',
      glowify: true,
      others: false,
    },
    {
      feature: 'Musiqi və Səsə Həssas Ritmik RGB İşıq Şousu',
      glowify: true,
      others: false,
    },
    {
      feature: '900ml Böyük Su Çəni (12+ Saat Fasiləsiz İşləmə)',
      glowify: true,
      others: false,
    },
    {
      feature: 'Type-C Simsiz Sərbəstlik & İstənilən Yerdə İstifadə',
      glowify: true,
      others: false,
    },
    {
      feature: 'Efir Yağı & Aromaterapiya Uyğunluğu (Zədələnməyən Çən)',
      glowify: true,
      others: false,
    },
    {
      feature: 'Ultra-Səssiz İşləmə (<25dB Dərin Yuxu Rejimi)',
      glowify: true,
      others: false,
    },
    {
      feature: '14 Gün Sınaq Müddəti və Rəsmi Qapıda Ödəniş Zəmanəti',
      glowify: true,
      others: false,
    },
  ];

  const featureCards = [
    {
      title: '6 Nozul Nano-Sprey Texnologiyası',
      desc: 'Otağı saniyələr içində bərabər və sərin nəmləndirən 6 güclü nano-dispersiya buxar sprey çıxışı.',
      img: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/R_ngar_ngBuxarEffektliDiffuzor.png?v=1793287963',
      badge: '6 NOZUL SPREY',
      icon: Wind,
    },
    {
      title: 'Səsə Həssas Ritmik RGB İşıq Şousu',
      desc: 'Musiqinin ritminə və ətraf səslərə dərhal reaksiya verən dinamik rəngli LED atmosfer effekti.',
      img: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/R_ngliAtmosfer_GLOWIFYPRO.png?v=1793287963',
      badge: 'RİTMİK RGB',
      icon: Music,
    },
    {
      title: '900ml Böyük Su Tutumu & Aromaterapiya',
      desc: 'Bütün gecəni su doldurmadan fasiləsiz işləmə və təbii efir yağları ilə evi bürüyən təravətli ətir.',
      img: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/GLOWIFY_PRO___R_ngar_ng_N_ml_ndirici.png?v=1793287977',
      badge: '900ML TUTUM',
      icon: Droplets,
    },
    {
      title: 'Ultra-Səssiz Gecə Rejimi (<25dB)',
      desc: 'Körpələr və dərin dincəlmə üçün akustik sükunət, göz yormayan gecə lampası və avtomatik təhlükəsiz sönmə.',
      img: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/S_ssizN_ml_ndirm_RahatMuhit.png?v=1793287964',
      badge: 'SƏSSİZ < 25dB',
      icon: Moon,
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
            Yeni Nəsil İqlim və Atmosfer Texnologiyası
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Evinizin Havasını və Ruhunu Bir Anda Dəyişin
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
            Köhnə tək çıxışlı, tez xarab olan və mebelləri isladan zəif nəmləndiriciləri unudun. Glowify Pro™ 6 sprey nozulu və ritmik işıq şousu ilə təmiz, sərin və enerjili mühit yaradır.
          </p>
        </div>

        {/* 4 Əsas Üstünlük Qutusu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group rounded-2xl border border-neutral-200/90 bg-neutral-50/60 hover:bg-white hover:border-cyan-300 p-4 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-950 border border-neutral-200">
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
                    <Icon className="w-4 h-4 text-cyan-600 shrink-0" />
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
            <span className="block text-2xl font-black text-cyan-600 font-mono">6 Nozul</span>
            <span className="text-xs text-neutral-600 font-medium mt-0.5 block">
              Güclü Nano-Dispersiya
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="block text-2xl font-black text-emerald-600 font-mono">900 ml</span>
            <span className="text-xs text-neutral-600 font-medium mt-0.5 block">
              Geniş Su Tutumu
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="block text-2xl font-black text-purple-600 font-mono">RGB</span>
            <span className="text-xs text-neutral-600 font-medium mt-0.5 block">
              Musiqiyə Həssas İşıq
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="block text-2xl font-black text-blue-600 font-mono">&lt; 25 dB</span>
            <span className="text-xs text-neutral-600 font-medium mt-0.5 block">
              Ultra-Səssiz Gecə Rejimi
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
              {/* Sütun Başlıqları: Glowify Pro və Sıravi Nəmləndiricilər */}
              <div className="flex justify-end pr-2 sm:pr-4 mb-2">
                <div className="grid grid-cols-2 gap-2 sm:gap-4 w-[160px] sm:w-[190px] text-center">
                  <span className="text-xs sm:text-sm font-black text-neutral-900 tracking-tight">
                    Glowify Pro™
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
                      <div className="bg-white w-[160px] sm:w-[190px] shrink-0 grid grid-cols-2 items-center text-center px-1">
                        {/* Glowify Pro Sütunu: Qalın Check (✓) */}
                        <div className="flex items-center justify-center">
                          <Check className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 stroke-[3]" />
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
              Otağınızın Havasını və Əhvalını Dəyişin! İndi sifariş edin, xüsusi 38% endirimdən yararlanın və qapıda yoxlayaraq təhvil alın.
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
