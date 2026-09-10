'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export default function GlobalWhatsAppButton() {
  const { isCartOpen } = useCart();

  // Səbət açıq olanda WhatsApp düyməsini gizlət ki, mobil ekranda səbətin üstünə düşməsin
  if (isCartOpen) return null;

  return (
    <div
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[60] flex items-center group pointer-events-auto animate-in fade-in zoom-in-75 duration-300"
    >
      {/* Desktop Tooltip */}
      <span className="hidden sm:inline-flex items-center gap-1.5 mr-2.5 px-3 py-1.5 rounded-full bg-[#111111]/95 text-white text-xs font-semibold border border-[#25D366]/30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        Bizə WhatsApp ilə yazın
      </span>

      {/* Əsas Floating Düymə */}
      <a
        href="https://wa.me/994556422545"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Dəstək Xətti (055 642 25 45)"
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.5)] transition-all duration-300 transform group-hover:scale-110 active:scale-95"
      >
        {/* Pulsasiya edən kənar halqa */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

        {/* Canlı Online Yaşıl Nöqtə */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center border border-neutral-800">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
        </span>

        {/* WhatsApp Rəsmi SVG İkonu */}
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 fill-white relative z-10"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.004 2c-5.518 0-9.998 4.476-9.998 9.992 0 1.763.459 3.484 1.332 5.002L2 22l5.176-1.309c1.472.802 3.13 1.226 4.828 1.226 5.518 0 9.996-4.476 9.996-9.992C22 6.476 17.522 2 12.004 2zm5.82 14.156c-.244.686-1.227 1.258-1.706 1.304-.445.042-1.018.06-3.29-.884-2.731-1.134-4.512-3.896-4.65-4.08-.134-.183-1.1-1.464-1.1-2.793 0-1.328.697-1.981.944-2.247.248-.266.541-.333.722-.333.181 0 .362.002.519.01.168.008.393-.064.615.47.229.551.782 1.91.85 2.05.068.14.113.305.02.489-.092.184-.138.298-.275.457-.138.16-.29.358-.415.48-.138.136-.282.285-.121.562.161.277.717 1.182 1.54 1.914 1.058.943 1.95 1.234 2.227 1.372.277.137.439.115.602-.072.163-.187.697-.811.883-1.089.186-.278.372-.232.624-.139.252.093 1.6.755 1.874.892.274.137.458.205.525.32.068.115.068.665-.176 1.351z" />
        </svg>
      </a>
    </div>
  );
}
