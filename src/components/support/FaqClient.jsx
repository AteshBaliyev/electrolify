'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  Banknote,
  ShieldCheck,
  Search,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Package,
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 'catdirilma',
    question: 'Çatdırılma necə həyata keçirilir və neçə gün çəkir?',
    category: 'Çatdırılma',
    icon: Truck,
    iconColor: 'text-[#FF5B00]',
    answer: `
      Electrolify.az olaraq bütün Azərbaycan ərazisinə operativ və güvənli çatdırılma təşkil edirik:

      • Bakı şəhəri: Sifarişiniz təsdiqləndikdən sonra 24 saat ərzində birbaşa qapınıza çatdırılır. Əksər hallarda günorta saat 15:00-dək verilən sifarişlər elə həmin gün təhvil verilir.
      • Sumqayıt və Abşeron: Eyni gün və ya ən geci növbəti gün çatdırılır.
      • Bütün Azərbaycan Rayonları: Azərpoçt və ya təcili rayon kuryer marşrutları vasitəsilə 2-3 iş günü ərzində qoruyucu xüsusi bağlamada zədəsiz çatdırılır.
      • Pulsuz Çatdırılma: 100 AZN və daha yuxarı bütün sifarişlər üçün çatdırılma TAM PULSUZDUR! 100 AZN-dən aşağı sifarişlər üçün standart şəhərdaxili kuryer haqqı cəmi 5 AZN təşkil edir.
    `,
  },
  {
    id: 'qapida-odenis',
    question: 'Qapıda ödəniş necə işləyir?',
    category: 'Ödəniş',
    icon: Banknote,
    iconColor: 'text-[#10B981]',
    answer: `
      Bizim əsas prinsipimiz müştərinin 100% təhlükəsizliyi və rahatlığıdır:

      • Əvvəlcədən Heç Bir Ödəniş Yoxdur: Saytımızda sifariş edərkən bank kartı məlumatı və ya beh tələb olunmur.
      • Məhsulu Yoxlayıb Ödəmə: Kuryer bağlamanı gətirdikdə siz məhsulun qutusunu, görünüşünü və bütövlüyünü şəxsən yoxlayırsınız.
      • Ödəniş Üsulları:
        1. Nağd Pul ilə: Kuryerə nağd təhvil verə bilərsiniz.
        2. Kartla (POS-Terminal): Kuryerlərimiz mobil POS-terminalla gəlir. İstənilən bank kartı (Visa, MasterCard, Birbank, Leobank, Tamkart və s.) ilə kontaktsız ödəyə bilərsiniz.
    `,
  },
  {
    id: 'zemanet',
    question: '14 gün iadə və zəmanət şərtləri nələrdir?',
    category: 'Zəmanət',
    icon: ShieldCheck,
    iconColor: 'text-blue-600',
    answer: `
      Electrolify.az-dan aldığınız hər bir məhsul rəsmi qanunvericilik və daxili keyfiyyət standartlarımızla qorunur:

      • 14 Gün Şərtsiz İadə / Dəyişmə: Məhsulu təhvil aldığınız tarixdən etibarən 14 gün ərzində bəyənmədiyiniz halda dərhal başqa modellə dəyişdirə və ya 100% pulunuzu geri ala bilərsiniz.
      • Qaytarma Qaydası: Məhsulun əmtəə görünüşü, zavod qutusu və aksesuarları zədələnməmiş vəziyyətdə olmalıdır.
      • Texniki Zəmanət: Bütün elektronika avadanlıqlarına rəsmi istehsalçı zəmanəti təqdim olunur. Hər hansı texniki qüsur aşkarlandıqda servisimiz tərəfindən dərhal həll edilir.
    `,
  },
  {
    id: 'izleme',
    question: 'Sifarişimin statusunu necə öyrənə bilərəm?',
    category: 'İzləmə',
    icon: Package,
    iconColor: 'text-purple-600',
    answer: `
      Sifarişinizin hər mərhələsi haqqında operativ məlumat verilir:

      • WhatsApp Bildirişi: Sifarişinizi tamamlayan kimi sistemimiz qeyd etdiyiniz nömrəyə təsdiq mesajı və unikal sifariş kodunu göndərir.
      • Canlı Operator Zəngi: 5-10 dəqiqə ərzində satış menecerimiz sizinlə əlaqə saxlayıb çatdırılma vaxtını dəqiqləşdirir.
      • WhatsApp Dəstək Xətti: İstənilən vaxt birbaşa 055 642 25 45 nömrəsinə yazaraq kuryerin harada olduğunu və dəqiq gəliş saatını canlı öyrənə bilərsiniz.
    `,
  },
  {
    id: 'orijinalliq',
    question: 'Məhsulların orijinal olduğuna necə əmin ola bilərəm?',
    category: 'Məhsul',
    icon: CheckCircle2,
    iconColor: 'text-amber-600',
    answer: `
      Electrolify.az yalnız yoxlanılmış və beynəlxalq sertifikatlara (CE, RoHS, FCC) malik orijinal qadcetlərin satışını həyata keçirir:

      • Hər bir məhsul zavod qablaşdırmasında, toxunulmaz qoruyucu lentlərlə təqdim edilir.
      • Smart saatlar və qulaqlıqlar rəsmi tətbiqlər (məs. Wearfit Pro, FitCloudPro və s.) vasitəsilə smartfona problemsiz qoşulur və proqram təminatı yenilənmələrini dəstəkləyir.
    `,
  },
];

export default function FaqClient() {
  const [openId, setOpenId] = useState('catdirilma');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && FAQ_ITEMS.some((item) => item.id === hash)) {
        setOpenId(hash);
        const elem = document.getElementById(hash);
        if (elem) {
          setTimeout(() => {
            elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 200);
        }
      }
    }
  }, []);

  const filteredItems = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* Sürətli Axtarış Zolağı */}
      <div className="relative mt-6 max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="Sualınızı axtarın (çatdırılma, ödəniş, zəmanət...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-neutral-200 focus:border-[#FF5B00] rounded-2xl py-3 pl-11 pr-4 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none transition-colors shadow-sm"
        />
        <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Akordion (FAQ Accordion List) */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isOpen = openId === item.id;
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              id={item.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-white border-[#FF5B00] shadow-md ring-1 ring-[#FF5B00]/20'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'
              }`}
            >
              {/* Akordion Başlığı */}
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left transition-colors select-none cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center ${item.iconColor} shrink-0 border border-neutral-200`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">
                      {item.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 mt-0.5">
                      {item.question}
                    </h3>
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180 text-[#FF5B00]' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Akordion Gövdəsi */}
              {isOpen && (
                <div className="border-t border-neutral-100 px-4 sm:px-5 py-4 bg-neutral-50/60 animate-in fade-in duration-200">
                  <div className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line space-y-2">
                    {item.answer.trim()}
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>Bu məlumat sizin üçün faydalı oldu?</span>
                    <a
                      href={`https://wa.me/994556422545?text=Salam,%20"${encodeURIComponent(
                        item.question
                      )}"%20haqq%C4%B1nda%20əlavə%20sualım%20var.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF5B00] hover:underline font-semibold flex items-center gap-1"
                    >
                      Əlavə sual ver <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
