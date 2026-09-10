import React from 'react';
import { Truck, Banknote, ShieldCheck } from 'lucide-react';

export default function ProductTrustBadges() {
  const badges = [
    {
      title: 'Sürətli Çatdırılma',
      icon: Truck,
      color: 'text-[#FF5B00]',
      borderColor: 'border-[#FF5B00]/25',
    },
    {
      title: 'Qapıda Ödəniş',
      icon: Banknote,
      color: 'text-[#10B981]',
      borderColor: 'border-[#10B981]/25',
    },
    {
      title: '100% Zəmanət',
      icon: ShieldCheck,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/25',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 w-full my-2.5">
      {badges.map((b, idx) => {
        const Icon = b.icon;
        return (
          <div
            key={idx}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#0D0D0D] border ${b.borderColor} text-center`}
          >
            <Icon className={`w-3.5 h-3.5 ${b.color} shrink-0`} />
            <span className="text-[10px] sm:text-xs font-bold text-neutral-200 truncate">
              {b.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}

