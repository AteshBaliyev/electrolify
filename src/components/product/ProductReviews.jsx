'use client';

import React from 'react';
import { Star, CheckCircle, ThumbsUp, ShieldCheck, MessageSquare } from 'lucide-react';
import { getProductReviews } from '@/data/productReviews';
import CustomerSalesBadge from './CustomerSalesBadge';

export default function ProductReviews({ product }) {
  const reviews = getProductReviews(product);

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
            {product?.title ? `"${product.title}" üçün yalnız təhvil almış təsdiqlənmiş alıcıların rəyləri` : 'Yalnız məhsulu təhvil almış real və təsdiqlənmiş alıcıların rəyləri'}
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
              <span className="text-[10px] text-neutral-500 mt-0.5 block">184 Rəy əsasında</span>
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

      {/* Rəy Kartları Şəbəkəsi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all flex flex-col justify-between shadow-sm"
          >
            <div>
              {/* Rəy Başlığı & Ulduzlar */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full ${rev.avatarColor} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      {rev.name}
                      {rev.verified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#10B981] bg-[#10B981]/10 px-2 py-0.2 rounded-full">
                          <CheckCircle className="w-2.5 h-2.5" /> Təsdiqlənmiş Alıcı
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
              <button className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer">
                <ThumbsUp className="w-3 h-3 text-neutral-400" />
                <span>Bu rəy faydalı oldu ({rev.helpful})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
