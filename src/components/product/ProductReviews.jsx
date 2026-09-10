import React from 'react';
import { Star, CheckCircle, ThumbsUp, ShieldCheck, MessageSquare } from 'lucide-react';

export default function ProductReviews() {
  const reviews = [
    {
      id: 1,
      name: 'Rəşad Məmmədov',
      city: 'Bakı',
      date: '2 gün əvvəl',
      rating: 5,
      title: 'Gözlədiyimdən qat-qat keyfiyyətli və sürətli kuryer!',
      comment:
        'Sifariş verdikdən 24 saat tamam olmamış kuryer birbaşa qapıma çatdırdı. Qapıda kartla ödəniş etdim, kuryer aparat gətirmişdi. Məhsulun keyfiyyəti, ekran parlaqlığı və materialı inanılmaz dərəcədə premiumdur. Qutuda rəsmi zəmanət talonu da var idi.',
      verified: true,
      helpful: 24,
      avatarColor: 'bg-emerald-500',
    },
    {
      id: 2,
      name: 'Aysel Qasımova',
      city: 'Sumqayıt',
      date: '4 gün əvvəl',
      rating: 5,
      title: '100% orijinal, səs və dizayn mükəmməldir',
      comment:
        'Açığı əvvəlcə onlayn sifariş etməkdən bir az çəkinirdim, lakin qapıda yoxlayıb təhvil aldıqdan sonra bütün şübhələrim aradan qalxdı. Qablaşdırma tam toxunulmaz və orijinal idi. Qulaqlığın dərin bası və səs izolyasiyası sözün əsl mənasında möhtəşəmdir!',
      verified: true,
      helpful: 19,
      avatarColor: 'bg-[#FF5B00]',
    },
    {
      id: 3,
      name: 'Elvin Tağıyev',
      city: 'Gəncə',
      date: '1 həftə əvvəl',
      rating: 5,
      title: 'Rayona cəmi 2 günə çatdırıldı, zəmanətli məhsul',
      comment:
        'Gəncəyə sürətli poçtla cəmi 2 günə gəldi. Batareya ömrü tam deyildiyi kimidir, günlərlə şarj etmədən istifadə edirəm. Qiymətinə görə Azərbaycanda ala biləcəyiniz ən yaxşı elektronika məhsuludur. Təşəkkürlər Electrolify!',
      verified: true,
      helpful: 15,
      avatarColor: 'bg-blue-500',
    },
    {
      id: 4,
      name: 'Nərmin Əliyeva',
      city: 'Bakı',
      date: '10 gün əvvəl',
      rating: 5,
      title: 'Hədiyyə üçün almışdım, çox razı qaldıq',
      comment:
        'Hədiyyəlik qutusu və korpusu o qədər zərif və bahalı görünür ki, hamı heyran qaldı. WhatsApp operatoru da sifariş zamanı çox kömək etdi və bütün detalları izah etdi. Hər kəsə tərəddüdsüz tövsiyə edirəm.',
      verified: true,
      helpful: 11,
      avatarColor: 'bg-purple-500',
    },
  ];

  return (
    <section className="w-full mt-16 pt-10 border-t border-[#1F1F1F]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#1A1A1A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-[#FF5B00]" />
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Müştəri Rəyləri və Təcrübələri
            </h2>
          </div>
          <p className="text-xs text-neutral-400">
            Yalnız məhsulu təhvil almış real və təsdiqlənmiş alıcıların rəyləri
          </p>
        </div>

        {/* Ümumi Reytinq Kartı */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0D0D0D] border border-[#222222] shrink-0">
          <div className="text-center">
            <span className="text-3xl font-black text-white block">4.9</span>
            <div className="flex text-yellow-400 gap-0.5 justify-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
              ))}
            </div>
            <span className="text-[10px] text-neutral-500 mt-0.5 block">184 Rəy əsasında</span>
          </div>

          <div className="h-10 w-[1px] bg-[#222222]" />

          <div className="flex flex-col gap-1 text-[11px] text-neutral-300">
            <div className="flex items-center gap-1.5 font-bold text-[#10B981]">
              <CheckCircle className="w-3.5 h-3.5" /> 99.4% Müsbət Rəy
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> 100% Təsdiqlənmiş Alıcı
            </div>
          </div>
        </div>
      </div>

      {/* Rəy Kartları Şəbəkəsi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-[#0E0E0E] border border-[#222222] hover:border-[#333333] transition-all flex flex-col justify-between shadow-sm"
          >
            <div>
              {/* Rəy Başlığı & Ulduzlar */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full ${rev.avatarColor} text-black font-black text-xs flex items-center justify-center shrink-0`}
                  >
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
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
              <h5 className="text-xs font-bold text-neutral-200 mb-1.5">{rev.title}</h5>
              <p className="text-xs text-neutral-400 leading-relaxed">{rev.comment}</p>
            </div>

            {/* Faydalılıq Nişanı */}
            <div className="pt-4 mt-4 border-t border-[#1A1A1A] flex items-center justify-between text-[11px] text-neutral-500">
              <span className="text-[10px] text-neutral-400">Rəsmi Qapıda Ödənişlə alınıb</span>
              <button className="flex items-center gap-1.5 hover:text-white transition-colors">
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
