import React from 'react';
import { Truck, ShieldCheck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#111827] text-white py-2 sm:py-2.5 px-3 text-center text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 relative z-50 shadow-sm select-none border-b border-slate-800">
      <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="tracking-tight">
        50 Manatdan Çox Alış-verişdə Pulsuz Çatdırılma
      </span>
      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full font-medium ml-2 border border-white/20">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Qapıda Ödəniş
      </span>
    </div>
  );
}
