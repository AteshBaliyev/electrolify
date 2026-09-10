'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Zap, ArrowRight, Flame, ShieldCheck, Sparkles } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    badge: '🔥 HƏFTƏNİN MEQA FÜRSƏTİ',
    title: 'Electrolify Pro Watch Series 9',
    subtitle: 'Titanium korpus, AMOLED super-ekran və zənglərə cavab vermə funksiyası ilə.',
    discount: '-44% ENDİRİM',
    price: '129.00 AZN',
    comparePrice: '229.00 AZN',
    link: '/products/electrolify-pro-watch-series-9',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1000&q=85',
    ctaText: 'İndi Sifariş Et',
    bgGradient: 'from-[#1A0B02] via-[#0D0D0D] to-[#050505]',
  },
  {
    id: 2,
    badge: '🎧 PREMİUM SƏS TƏCRÜBƏSİ',
    title: 'AuraPod ANC Pro Simsiz Qulaqlıq',
    subtitle: 'Aktiv küy boğma (ANC), 48 saat batareya ömrü və dərin Spatial Audio basları.',
    discount: '-47% ENDİRİM',
    price: '79.00 AZN',
    comparePrice: '149.00 AZN',
    link: '/products/aurapod-anc-pro',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000&q=85',
    ctaText: 'Fürsəti Kəşf Et',
    bgGradient: 'from-[#05111A] via-[#0D0D0D] to-[#050505]',
  },
  {
    id: 3,
    badge: '⚡ 3-Ü 1-DƏ MAGSAFE SÜRƏTLİ ŞARJ',
    title: 'VoltPulse 15W Simsiz Stansiya',
    subtitle: 'iPhone, Apple Watch və AirPods-u eyni vaxtda sürətli və təhlükəsiz şarj edin.',
    discount: '-40% ENDİRİM',
    price: '59.00 AZN',
    comparePrice: '99.00 AZN',
    link: '/products/voltpulse-3in1-magsafe',
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=1000&q=85',
    ctaText: 'Paketi Əldə Et',
    bgGradient: 'from-[#121005] via-[#0D0D0D] to-[#050505]',
  },
];

export default function HeroSlider({ products = [] }) {
  // Əgər real Shopify məhsulları varsa, onlardan avtomatik dinamik slaydlar yarat
  const slides = React.useMemo(() => {
    if (products && products.length > 0) {
      return products.slice(0, 3).map((prod, index) => {
        const imgUrl = prod.images?.edges?.[0]?.node?.url || SLIDES[index % SLIDES.length].image;
        const price = prod.priceRange?.minVariantPrice?.amount || '0.00';
        const comparePrice = prod.compareAtPriceRange?.minVariantPrice?.amount;
        const badges = ['🔥 HƏFTƏNİN MEQA FÜRSƏTİ', '⚡ ÇOX SATAN MƏHSUL', '✨ YENİ GƏLƏN'];
        const gradients = [
          'from-[#1A0B02] via-[#0D0D0D] to-[#050505]',
          'from-[#05111A] via-[#0D0D0D] to-[#050505]',
          'from-[#121005] via-[#0D0D0D] to-[#050505]',
        ];
        let discount = 'XÜSUSİ TƏKLİF';
        if (comparePrice && parseFloat(comparePrice) > parseFloat(price)) {
          discount = `-${Math.round((1 - parseFloat(price) / parseFloat(comparePrice)) * 100)}% ENDİRİM`;
        }

        return {
          id: prod.id || index + 1,
          badge: badges[index % badges.length],
          title: prod.title,
          subtitle: prod.description ? prod.description.slice(0, 95) + '...' : 'Məhdud sayda xüsusi qiymətlə. 24 saatda çatdırılma.',
          discount,
          price: `${price} AZN`,
          comparePrice: comparePrice ? `${comparePrice} AZN` : null,
          link: `/products/${encodeURIComponent(prod.handle)}`,
          image: imgUrl,
          ctaText: 'İndi Sifariş Et',
          bgGradient: gradients[index % gradients.length],
        };
      });
    }
    return SLIDES;
  }, [products]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Avtomatik slayd keçidi (hər 5.5 saniyədən bir)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Barmaqla sürüşdürmə (Touch Swipe Gestures for Mobile)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const slide = slides[currentSlide] || slides[0];

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative w-full overflow-hidden rounded-3xl border border-[#222222] bg-[#0A0A0A] select-none shadow-2xl touch-pan-y"
    >
      <div
        key={slide.id}
        className={`relative min-h-[380px] sm:min-h-[420px] md:min-h-[460px] p-5 sm:p-10 md:p-14 flex flex-col justify-center bg-gradient-to-r ${slide.bgGradient} animate-in fade-in duration-300`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center z-10">
          {/* Mətn və Təklif */}
          <div className="md:col-span-7 flex flex-col gap-3 sm:gap-4 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black bg-[#FF5B00] text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                {slide.badge}
              </span>
              <span className="text-[11px] font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Qapıda Ödəniş
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {slide.title}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg">
              {slide.subtitle}
            </p>

            {/* Qiymət və Qənaət */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl sm:text-4xl font-black text-[#FF5B00]">
                {slide.price}
              </span>
              <span className="text-sm sm:text-lg text-neutral-500 line-through font-semibold">
                {slide.comparePrice}
              </span>
              <span className="text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded">
                {slide.discount}
              </span>
            </div>

            {/* CTA Düyməsi (Min 50px toxunma sahəsi) */}
            <div className="pt-2">
              <Link
                href={slide.link}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 min-h-[50px] py-3.5 px-8 rounded-2xl bg-[#FF5B00] hover:bg-[#E64D00] text-white font-black text-xs sm:text-sm uppercase tracking-wide shadow-xl shadow-[#FF5B00]/25 transition-all transform active:scale-95 glow-orange"
              >
                <Zap className="w-4 h-4 fill-white text-white" />
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>

          {/* Şəkil Qutusu - Kliklənən Link və Next.js Image ilə LCP Optimizasiyası */}
          <div className="md:col-span-5 flex items-center justify-center relative">
            <Link
              href={slide.link}
              aria-label={slide.title}
              className="relative w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden bg-[#161616]/80 border border-white/10 shadow-2xl p-2 flex items-center justify-center group cursor-pointer block"
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="(max-width: 768px) 240px, 340px"
                  priority={currentSlide === 0}
                  className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Keçid Oxları (Min 48px toxunma sahəsi) */}
      <button
        onClick={handlePrev}
        aria-label="Əvvəlki slayd"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 min-w-[48px] min-h-[48px] rounded-full bg-black/60 hover:bg-[#FF5B00] text-white hover:text-white border border-white/10 flex items-center justify-center backdrop-blur-md transition-all active:scale-90"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Növbəti slayd"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 min-w-[48px] min-h-[48px] rounded-full bg-black/60 hover:bg-[#FF5B00] text-white hover:text-white border border-white/10 flex items-center justify-center backdrop-blur-md transition-all active:scale-90"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slayd Nöqtələri (Pagination) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === idx ? 'w-8 bg-[#FF5B00]' : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
