'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Clock, Flame } from 'lucide-react';

export default function ProductGallery({ images = [], title = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const imageList = images.length > 0 ? images : [
    {
      node: {
        url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
        altText: title,
      },
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  // Barmaqla sürüşdürmə (Touch Swipe Gestures)
  const minSwipeDistance = 40;

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

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Əsas Şəkil Çərçivəsi (Barmaqla Sürüşdürülən Swipeable Karusel) */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative aspect-square w-full rounded-3xl bg-[#0F0F0F] border border-[#222222] overflow-hidden group select-none shadow-2xl touch-pan-y"
      >
        {/* Yüksək Konversiya Təcili Endirim Nişanı */}
        <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5 pointer-events-none">
          <span className="bg-[#FF5B00] text-white text-[11px] md:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-white text-white" /> -44% ENDİRİM
          </span>
          <span className="bg-black/80 backdrop-blur-md border border-red-500/30 text-red-400 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
            <Clock className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>Bitməsinə: 02:47:18</span>
          </span>
        </div>

        {/* Şəkil Sayğacı */}
        <div className="absolute top-3.5 right-3.5 z-20 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] text-white/90 font-mono">
          {currentIndex + 1} / {imageList.length}
        </div>

        {/* Aktiv Şəkil (Bütün qalereya şəkilləri dərhal və kəsintisiz keçid üçün pre-render edilir) */}
        <div className="w-full h-full relative flex items-center justify-center p-3">
          {imageList.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 p-3 transition-opacity duration-200 ${
                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.node.url}
                  alt={img.node.altText || title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={idx === 0}
                  className="object-contain rounded-2xl"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Karusel Oxları (Min 48px toxunma sahəsi) */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Əvvəlki şəkil"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 min-w-[48px] min-h-[48px] rounded-full bg-black/70 hover:bg-[#FF5B00] text-white hover:text-white border border-white/10 flex items-center justify-center backdrop-blur-md transition-all active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Növbəti şəkil"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 min-w-[48px] min-h-[48px] rounded-full bg-black/70 hover:bg-[#FF5B00] text-white hover:text-white border border-white/10 flex items-center justify-center backdrop-blur-md transition-all active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Miniatürlər (Thumbnails Strip: Rahat toxunulan miniatürlər) */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative min-w-[60px] min-h-[60px] w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all p-1 bg-[#121212] cursor-pointer ${
                currentIndex === idx
                  ? 'border-[#FF5B00] ring-2 ring-[#FF5B00]/40 scale-105'
                  : 'border-[#222222] opacity-60 hover:opacity-100 hover:border-neutral-500'
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.node.url}
                  alt={img.node.altText || `${title} miniatür ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

