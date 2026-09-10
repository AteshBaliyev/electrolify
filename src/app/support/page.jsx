import React from 'react';
import Link from 'next/link';
import { PhoneCall, MessageCircle } from 'lucide-react';
import FaqClient from '@/components/support/FaqClient';

export const metadata = {
  title: 'Müştəri Dəstəyi və FAQ | Electrolify.com',
  description: 'Çatdırılma, qapıda nağd/kartla ödəniş, 14 gün şərtsiz iadə və zəmanət şərtləri haqqında bütün suallarınıza operativ cavablar.',
};

export default function SupportPage() {
  return (
    <div className="bg-[#F8F9FA] text-neutral-900 min-h-screen py-8 md:py-14">
      <div className="max-w-4xl mx-auto px-4">
        {/* Başlıq Bloku (SSR) */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF5B00] font-black bg-[#FF5B00]/10 px-3 py-1 rounded-full">
            Müştəri Xidmətləri
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight mt-3">
            Tez-tez Verilən Suallar (FAQ)
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
            Çatdırılma, qapıda ödəniş, 14 gün iadə və zəmanət qaydaları haqqında bütün suallarınıza ətraflı cavablar.
          </p>
        </div>

        {/* Canlı Əlaqə Kartı (SSR) */}
        <div className="p-5 rounded-3xl bg-white border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 shadow-sm">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5B00]/15 text-[#FF5B00] flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Sualınız cavabsız qaldı? Bizə birbaşa yazın!
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                Dəstək xidməti hər gün 09:00 - 22:00 saatlarında aktivdir.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href="tel:+994556422545"
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs font-bold text-neutral-900 flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#FF5B00]" />
              <span>055 642 25 45</span>
            </a>

            <a
              href="https://wa.me/994556422545"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp ilə Yaz</span>
            </a>
          </div>
        </div>

        {/* İnteraktiv Axtarış və Akordion (İzolyasiya olunmuş Client Component) */}
        <FaqClient />

        {/* Geri Qayıt Düyməsi */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 border border-neutral-200 font-bold text-xs transition-colors shadow-sm"
          >
            <span>Ana Səhifəyə Qayıt</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
