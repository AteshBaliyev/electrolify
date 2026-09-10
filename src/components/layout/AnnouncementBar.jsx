import React from 'react';
import { Flame, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-[#FF5B00] via-[#E84E00] to-[#FF3D00] text-white py-2 px-3 text-center text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 relative z-50 shadow-sm select-none">
      <Flame className="w-4 h-4 text-yellow-300 animate-pulse shrink-0" />
      <span className="truncate sm:overflow-visible">
        🔥 Bütün Azərbaycana Sürətli Çatdırılma | Qapıda Ödəniş İmkanı
      </span>
      <span className="hidden lg:inline-flex items-center gap-1 text-[11px] bg-black/25 px-2 py-0.5 rounded-full font-medium ml-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> 100% Zəmanətli
      </span>
    </div>
  );
}
