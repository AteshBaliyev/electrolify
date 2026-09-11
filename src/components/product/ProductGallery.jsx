'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        className="relative aspect-square w-full rounded-3xl bg-white border border-neutral-200 overflow-hidden group select-none shadow-sm touch-pan-y"
      >

        {/* Şəkil Sayğacı */}
        <div className="absolute top-3.5 right-3.5 z-20 bg-neutral-900/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white font-mono">
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
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 min-w-[48px] min-h-[48px] rounded-full bg-white/90 hover:bg-[#FF5B00] text-neutral-800 hover:text-white border border-neutral-200 shadow-md flex items-center justify-center backdrop-blur-md transition-all active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Növbəti şəkil"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 min-w-[48px] min-h-[48px] rounded-full bg-white/90 hover:bg-[#FF5B00] text-neutral-800 hover:text-white border border-neutral-200 shadow-md flex items-center justify-center backdrop-blur-md transition-all active:scale-90 cursor-pointer"
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
              className={`relative min-w-[60px] min-h-[60px] w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all p-1 bg-white cursor-pointer ${
                currentIndex === idx
                  ? 'border-[#FF5B00] ring-2 ring-[#FF5B00]/40 scale-105'
                  : 'border-neutral-200 hover:border-neutral-400'
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

