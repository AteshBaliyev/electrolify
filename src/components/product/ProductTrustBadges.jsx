import React from 'react';
import { Truck, Banknote, ShieldCheck } from 'lucide-react';

export default function ProductTrustBadges() {
  const badges = [
    {
      title: 'Sürətli Çatdırılma',
      icon: Truck,
      color: 'text-[#FF5B00]',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Qapıda Ödəniş',
      icon: Banknote,
      color: 'text-[#10B981]',
      borderColor: 'border-emerald-200',
    },
    {
      title: '100% Zəmanət',
      icon: ShieldCheck,
      color: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 w-full my-2.5">
      {badges.map((b, idx) => {
        const Icon = b.icon;
        return (
          <div
            key={idx}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white border ${b.borderColor} text-center shadow-sm`}
          >
            <Icon className={`w-3.5 h-3.5 ${b.color} shrink-0`} />
            <span className="text-[10px] sm:text-xs font-bold text-neutral-800 truncate">
              {b.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}

