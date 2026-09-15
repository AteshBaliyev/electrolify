'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Zap, ArrowRight, Flame, ShieldCheck, Sparkles } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    badge: '✨ ÇOX SATAN DƏRİ QULLUĞU',
    title: 'ClarifyPro - Qara Nöktə Vakum Cihazı',
    subtitle: 'Dəridəki qara nöqtələri və artıq yağı zədələmədən dərindən təmizləyən 3 rejimli güclü vakum.',
    discount: '-49% ENDİRİM',
    price: '24.99 AZN',
    comparePrice: '49.00 AZN',
    link: '/products/clarifypro-qara-noktə-təmizləyici-vakum-cihazi',
    image: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/ChatGPTImage26Agu202603_24_34.png?v=1787700289',
    ctaText: 'İndi Al, Qapıda Ödə',
    bgGradient: 'from-orange-50 via-white to-amber-50/50',
  },
  {
    id: 2,
    badge: '🔥 HƏFTƏNİN MEQA FÜRSƏTİ',
    title: 'İstiƏl — İstilikli Boyun və Çiyin Masajı',
    subtitle: 'İstilik verən və avtomatik sıxaraq masaj edən cihaz ilə boyun və kürək ağrılarına dərhal son.',
    discount: '-47% ENDİRİM',
    price: '45.00 AZN',
    comparePrice: '85.00 AZN',
    link: '/products/i̇stiəl-masaj-aparati-i̇stilikli-verən-və-avtomatik-sixaraq-masaj-edən-boyun-bel-və-ciyin-masaj-cihazi',
    image: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/ChatGPT_Image_16_Agu_2026_00_10_34.png?v=1786880634',
    ctaText: 'Fürsəti Əldə Et',
    bgGradient: 'from-amber-50 via-white to-orange-50/50',
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
          'from-orange-50/90 via-white to-amber-50/50',
          'from-sky-50/90 via-white to-neutral-50',
          'from-amber-50/90 via-white to-orange-50/50',
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
          ctaText: 'İndi Al, Qapıda Ödə',
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
      className="relative w-full overflow-hidden rounded-3xl border border-neutral-200 bg-white select-none shadow-xl touch-pan-y"
    >
      <div
        key={slide.id}
        className={`relative min-h-[420px] sm:min-h-[420px] md:min-h-[460px] p-4 sm:p-10 md:p-14 flex flex-col justify-center bg-gradient-to-r ${slide.bgGradient} animate-in fade-in duration-300`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center z-10">
          {/* Mətn və Təklif */}
          <div className="md:col-span-7 flex flex-col gap-2.5 sm:gap-4 max-w-xl">
            {/* 1. Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black bg-[#FF5B00] text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                {slide.badge}
              </span>
              <span className="text-[11px] font-bold text-[#10B981] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Qapıda Ödəniş
              </span>
            </div>

            {/* 2. Məhsulun Adı (Tıklandıqda məhsul səhifəsinə keçid) */}
            <Link
              href={slide.link}
              className="group/title block cursor-pointer"
            >
              <h1 className="text-xl sm:text-4xl md:text-5xl font-black text-neutral-900 group-hover/title:text-[#FF5B00] tracking-tight leading-tight transition-colors">
                {slide.title}
              </h1>
            </Link>

            {/* 3. Mobildə: Məhsulun Şəkli (Məhsulun adından aşağıda, açıqlamasından yuxarıda) */}
            <div className="flex md:hidden items-center justify-center my-1">
              <Link
                href={slide.link}
                aria-label={slide.title}
                className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden bg-white/95 border border-neutral-200 shadow-md p-1.5 flex items-center justify-center group cursor-pointer block"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="220px"
                    priority={currentSlide === 0}
                    className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
            </div>

            {/* 4. Məhsulun Açıqlaması (Tıklandıqda məhsul səhifəsinə keçid) */}
            <Link
              href={slide.link}
              className="group/desc block cursor-pointer"
            >
              <p className="text-xs sm:text-sm text-neutral-600 group-hover/desc:text-neutral-900 leading-relaxed max-w-lg transition-colors">
                {slide.subtitle}
              </p>
            </Link>

            {/* 5. Qiymət və Qənaət */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl sm:text-4xl font-black text-[#FF5B00]">
                {slide.price}
              </span>
              {slide.comparePrice && (
                <span className="text-sm sm:text-lg text-neutral-400 line-through font-semibold">
                  {slide.comparePrice}
                </span>
              )}
              <span className="text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded shadow-sm">
                {slide.discount}
              </span>
            </div>

            {/* 6. CTA Düyməsi */}
            <div className="pt-2">
              <Link
                href={slide.link}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 min-h-[48px] sm:min-h-[50px] py-3.5 px-8 rounded-2xl bg-[#FF5B00] hover:bg-[#E64D00] text-white font-black text-xs sm:text-sm uppercase tracking-wide shadow-xl shadow-[#FF5B00]/25 transition-all transform active:scale-95 glow-orange"
              >
                <Zap className="w-4 h-4 fill-white text-white" />
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>

          {/* Desktop / Planşet Şəkil Qutusu (Yalnız md və yuxarı ekranlarda sağ sütunda) */}
          <div className="hidden md:flex md:col-span-5 items-center justify-center relative">
            <Link
              href={slide.link}
              aria-label={slide.title}
              className="relative w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden bg-white/80 border border-neutral-200 shadow-xl p-2 flex items-center justify-center group cursor-pointer block"
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

      {/* Keçid Oxları */}
      <button
        onClick={handlePrev}
        aria-label="Əvvəlki slayd"
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 min-w-[38px] min-h-[38px] sm:min-w-[48px] sm:min-h-[48px] rounded-full bg-white/90 hover:bg-[#FF5B00] text-neutral-800 hover:text-white border border-neutral-200 flex items-center justify-center shadow-md transition-all active:scale-90"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Növbəti slayd"
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 min-w-[38px] min-h-[38px] sm:min-w-[48px] sm:min-h-[48px] rounded-full bg-white/90 hover:bg-[#FF5B00] text-neutral-800 hover:text-white border border-neutral-200 flex items-center justify-center shadow-md transition-all active:scale-90"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slayd Nöqtələri (Pagination) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === idx ? 'w-8 bg-[#FF5B00]' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
