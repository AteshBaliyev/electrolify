'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, ShieldCheck, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { getProductReviews } from '@/data/productReviews';
import CustomerSalesBadge from './CustomerSalesBadge';

const COLOR_MAP = {
  'bg-emerald-500': '#10B981',
  'bg-[#FF5B00]': '#FF5B00',
  'bg-blue-500': '#3B82F6',
  'bg-purple-500': '#A855F7',
  'bg-pink-500': '#EC4899',
  'bg-indigo-500': '#6366F1',
  'bg-teal-500': '#14B8A6',
  'bg-rose-500': '#F43F5E',
  'bg-amber-500': '#F59E0B',
  'bg-emerald-600': '#059669',
  'bg-cyan-600': '#0891B2',
  'bg-violet-500': '#8B5CF6',
  'bg-blue-600': '#2563EB',
  'bg-fuchsia-500': '#D946EF',
  'bg-stone-600': '#57534E',
  'bg-teal-600': '#0D9488',
  'bg-orange-500': '#F97316',
  'bg-red-500': '#EF4444',
  'bg-sky-600': '#0284C7',
  'bg-pink-600': '#DB2777',
  'bg-indigo-600': '#4F46E5',
  'bg-purple-600': '#9333EA',
  'bg-emerald-700': '#047857',
  'bg-rose-600': '#E11D48',
  'bg-amber-600': '#D97706',
  'bg-stone-700': '#44403C',
  'bg-orange-600': '#EA580C',
  'bg-violet-600': '#7C3AED',
  'bg-red-600': '#DC2626',
  'bg-rose-700': '#BE123C',
  'bg-blue-700': '#1D4ED8',
  'bg-fuchsia-600': '#C026D3',
};

const PALETTE = ['#FF5B00', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#14B8A6', '#6366F1', '#06B6D4', '#F43F5E'];

function getAvatarBg(rev) {
  if (rev?.avatarColor && COLOR_MAP[rev.avatarColor]) {
    return COLOR_MAP[rev.avatarColor];
  }
  const name = rev?.name || 'User';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function ProductReviews({ product }) {
  const reviews = getProductReviews(product);
  const [showAll, setShowAll] = useState(false);
  const [helpfulCounts, setHelpfulCounts] = useState({});

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const handleHelpful = (id, baseHelpful) => {
    setHelpfulCounts((prev) => {
      if (prev[`${id}_clicked`]) return prev;
      const current = prev[id] !== undefined ? prev[id] : baseHelpful;
      return {
        ...prev,
        [id]: current + 1,
        [`${id}_clicked`]: true,
      };
    });
  };

  return (
    <section className="w-full mt-16 pt-10 border-t border-neutral-200">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-[#FF5B00]" />
            <h2 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">
              Müştəri Rəyləri və Təcrübələri
            </h2>
          </div>
          <p className="text-xs text-neutral-600">
            {product?.title
              ? `"${product.title}" üçün yalnız təhvil almış təsdiqlənmiş alıcıların rəyləri`
              : 'Yalnız məhsulu təhvil almış real və təsdiqlənmiş alıcıların rəyləri'}
          </p>
        </div>

        {/* Ümumi Reytinq və Real Alış Statistikası Kartı */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm shrink-0">
            <div className="text-center">
              <span className="text-3xl font-black text-neutral-900 block">4.9</span>
              <div className="flex text-yellow-400 gap-0.5 justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                ))}
              </div>
              <span className="text-[10px] text-neutral-500 mt-0.5 block">240+ Rəy əsasında</span>
            </div>

            <div className="h-10 w-[1px] bg-neutral-200" />

            <div className="flex flex-col gap-1 text-[11px] text-neutral-600">
              <div className="flex items-center gap-1.5 font-bold text-[#10B981]">
                <CheckCircle className="w-3.5 h-3.5" /> 99.4% Müsbət Rəy
              </div>
              <div className="flex items-center gap-1.5 text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> 100% Təsdiqlənmiş Alıcı
              </div>
            </div>
          </div>

          <CustomerSalesBadge product={product} />
        </div>
      </div>

      {/* Rəy Kartları - 3 dənəsi alt-alta göstərilir */}
      <div className="flex flex-col gap-3.5 mt-8 max-w-4xl mx-auto">
        {displayedReviews.map((rev) => {
          const currentHelpful = helpfulCounts[rev.id] !== undefined ? helpfulCounts[rev.id] : rev.helpful;
          const isClicked = helpfulCounts[`${rev.id}_clicked`];
          const avatarBg = getAvatarBg(rev);
          const initialLetter = rev.name ? rev.name.trim().charAt(0).toUpperCase() : 'A';

          return (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Rəy Başlığı & Ulduzlar */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white"
                      style={{ backgroundColor: avatarBg }}
                    >
                      {initialLetter}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5 flex-wrap">
                        <span>{rev.name}</span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#10B981] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-2.5 h-2.5 text-[#10B981]" /> Təsdiqlənmiş Alıcı
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-neutral-500">
                        {rev.city} • {rev.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex text-yellow-400 gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* Rəy Mətni */}
                <h5 className="text-xs font-bold text-neutral-900 mb-1.5">{rev.title}</h5>
                <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
              </div>

              {/* Faydalılıq Nişanı */}
              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="text-[10px] text-neutral-500">Rəsmi Qapıda Ödənişlə alınıb</span>
                <button
                  type="button"
                  onClick={() => handleHelpful(rev.id, rev.helpful)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isClicked ? 'text-[#FF5B00] font-bold' : 'hover:text-neutral-900'
                  }`}
                >
                  <ThumbsUp className={`w-3 h-3 ${isClicked ? 'text-[#FF5B00] fill-[#FF5B00]' : 'text-neutral-400'}`} />
                  <span>Bu rəy faydalı oldu ({currentHelpful})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ətraflı Bax Düyməsi */}
      {reviews.length > 3 && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-200 hover:border-[#FF5B00] hover:text-[#FF5B00] shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4 text-[#FF5B00] transition-transform group-hover:-translate-y-0.5" />
                <span>Daha Az Göstər</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 text-[#FF5B00]" />
                <span>Ətraflı Bax ({reviews.length - 3} digər rəy)</span>
                <ChevronDown className="w-4 h-4 text-[#FF5B00] transition-transform group-hover:translate-y-0.5" />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}

