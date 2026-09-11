import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Banknote,
  MessageCircle,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-100 border-t border-neutral-200 text-neutral-600 text-xs mt-auto">
      {/* 1. Üst Zolaq: Etibar və Təhlükəsizlik Nişanları */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {/* Çatdırılma */}
          <div className="flex items-start gap-3 p-3 sm:p-0 rounded-xl bg-neutral-50 sm:bg-transparent border border-neutral-200 sm:border-0">
            <div className="w-10 h-10 rounded-xl bg-[#FF5B00]/10 flex items-center justify-center text-[#FF5B00] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-neutral-900 font-bold text-sm">Sürətli Çatdırılma</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Bakı daxili 24 saat, rayonlara 2-3 gün ərzində
              </p>
            </div>
          </div>

          {/* Qapıda Ödəniş */}
          <div className="flex items-start gap-3 p-3 sm:p-0 rounded-xl bg-neutral-50 sm:bg-transparent border border-neutral-200 sm:border-0">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981] shrink-0">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-neutral-900 font-bold text-sm">Qapıda Ödəniş</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Məhsulu yoxlayıb, nağd və ya kartla ödəyin
              </p>
            </div>
          </div>

          {/* Zəmanət */}
          <div className="flex items-start gap-3 p-3 sm:p-0 rounded-xl bg-neutral-50 sm:bg-transparent border border-neutral-200 sm:border-0">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-neutral-900 font-bold text-sm">100% Orijinallıq</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Rəsmi istehsalçı zəmanəti və keyfiyyət
              </p>
            </div>
          </div>

          {/* 14 Gün Qaytarma */}
          <div className="flex items-start gap-3 p-3 sm:p-0 rounded-xl bg-neutral-50 sm:bg-transparent border border-neutral-200 sm:border-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-neutral-900 font-bold text-sm">14 Gün İadə</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Bəyənmədiyiniz halda dərhal dəyişmə və ya iadə
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Əsas Footer Bölməsi */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Şirkət Haqqında */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl bg-neutral-950 border border-orange-500/30 overflow-hidden shadow-sm flex items-center justify-center shrink-0">
              <Image
                src="/logo-icon.png"
                alt="Electrolify Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-black text-xl text-neutral-900 tracking-tight">
              ELECTROLIFY
            </span>
          </div>

          <p className="text-neutral-600 text-xs leading-relaxed max-w-sm">
            Electrolify — Azərbaycanın ən sürətli və güvənli elektronika mağazasıdır. Biz yalnız sınaqdan keçmiş, yüksək keyfiyyətli qadcetləri birbaşa qapınıza çatdırırıq.
          </p>

          {/* WhatsApp ilə Birbaşa Sifariş Düyməsi */}
          <div>
            <a
              href="https://wa.me/994556422545"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 min-h-[48px] bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs sm:text-sm py-3 px-5 rounded-2xl shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>WhatsApp ilə əlaqə saxlayın</span>
            </a>
          </div>
        </div>

        {/* Kateqoriyalar */}
        <div>
          <h4 className="text-neutral-900 font-bold text-sm mb-4">Populyar Bölmələr</h4>
          <ul className="flex flex-col gap-2.5 text-neutral-600">
            <li>
              <Link href="/category/deri-qullugu" className="hover:text-[#FF5B00] transition-colors">
                Dəri Qulluğu & Vakum
              </Link>
            </li>
            <li>
              <Link href="/category/masaj" className="hover:text-[#FF5B00] transition-colors">
                Masaj & Sağlamlıq
              </Link>
            </li>
            <li>
              <Link href="/#bestsellers" className="hover:text-[#FF5B00] transition-colors">
                Bütün Məhsullar
              </Link>
            </li>
            <li>
              <Link href="/#flashsales" className="text-[#FF5B00] font-semibold hover:underline">
                🔥 Günün Fürsətləri
              </Link>
            </li>
          </ul>
        </div>

        {/* Müştəri Xidmətləri */}
        <div>
          <h4 className="text-neutral-900 font-bold text-sm mb-4">Müştəri Dəstəyi</h4>
          <ul className="flex flex-col gap-2.5 text-neutral-600">
            <li>
              <Link href="/support" className="hover:text-[#FF5B00] transition-colors">
                Tez-tez Verilən Suallar (FAQ)
              </Link>
            </li>
            <li>
              <Link href="/support#catdirilma" className="hover:text-[#FF5B00] transition-colors">
                Çatdırılma Qaydaları
              </Link>
            </li>
            <li>
              <Link href="/support#qapida-odenis" className="hover:text-[#FF5B00] transition-colors">
                Qapıda Ödəniş Necə İşləyir?
              </Link>
            </li>
            <li>
              <Link href="/support#zemanet" className="hover:text-[#FF5B00] transition-colors">
                14 Gün İadə və Zəmanət
              </Link>
            </li>
            <li>
              <Link href="/support#izleme" className="hover:text-[#FF5B00] transition-colors">
                Sifarişin İzlənməsi (WhatsApp)
              </Link>
            </li>
          </ul>
        </div>

        {/* Əlaqə və Ünvan */}
        <div>
          <h4 className="text-neutral-900 font-bold text-sm mb-4">Bizimlə Əlaqə</h4>
          <ul className="flex flex-col gap-3 text-neutral-600">
            <li className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#FF5B00] shrink-0" />
              <a href="tel:+994556422545" className="hover:text-neutral-900 transition-colors font-medium">
                055 642 25 45
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FF5B00] shrink-0" />
              <a href="mailto:destek@electrolify.com" className="hover:text-neutral-900 transition-colors">
                destek@electrolify.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#FF5B00] shrink-0 mt-0.5" />
              <span>Bakı ş., Nizami küç. 42 (Mərkəzi Anbar)</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Hər gün: 09:00 - 22:00</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Aşağı Zolaq: Copyright və Ödəniş Üsulları */}
      <div className="border-t border-neutral-200 bg-neutral-200/60">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-neutral-500 text-center sm:text-left">
            © 2026 <strong className="text-neutral-800">Electrolify</strong> — Bütün hüquqlar qorunur. Azərbaycan bazarı üçün xüsusi olaraq optimallaşdırılmışdır.
          </p>

          {/* Qəbul Olunan Ödənişlər */}
          <div className="flex items-center gap-2 text-[10px] text-neutral-600">
            <span className="px-2 py-1 rounded bg-white border border-neutral-300 font-semibold text-neutral-800 shadow-sm">
              Qapıda Nağd
            </span>
            <span className="px-2 py-1 rounded bg-white border border-neutral-300 font-semibold text-neutral-800 shadow-sm">
              Qapıda Kart (POS)
            </span>
            <span className="px-2 py-1 rounded bg-white border border-neutral-300 font-semibold text-neutral-800 shadow-sm">
              Visa / MasterCard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
