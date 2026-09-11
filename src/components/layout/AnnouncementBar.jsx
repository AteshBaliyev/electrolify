import React from 'react';
import { Truck, ShieldCheck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-[#FF5B00] via-[#FF6E1A] to-[#E84E00] text-white py-2 sm:py-2.5 px-3 text-center text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 relative z-50 shadow-sm select-none">
      <Truck className="w-4 h-4 text-yellow-200 shrink-0" />
      <span className="tracking-tight">
        50 Manatdan Çox Alış-verişdə Pulsuz Çatdırılma
      </span>
      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-black/20 px-2.5 py-0.5 rounded-full font-medium ml-2 border border-white/20">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Qapıda Ödəniş
      </span>
    </div>
  );
}
