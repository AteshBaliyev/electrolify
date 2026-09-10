'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Banknote,
  CreditCard,
  Zap,
  PhoneCall,
  Clock,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  MapPin,
  Mail,
  Building,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { items, subtotal, subtotalNumber, isFreeShipping, clearCart } = useCart();

  // Yalnız tələb olunan 6 xana: Ad, Soyad, Şəhər, Telefon, Poçt İndeksi, E-poçt (opsional)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [email, setEmail] = useState(''); // Qətiyyən required deyil, tamamilə opsiyonal!

  // Çatdırılma seçimi: 'metro' | 'door' | 'post'
  const [shippingOption, setShippingOption] = useState('door');
  const [paymentType, setPaymentType] = useState('Qapıda Nağd'); // 'Qapıda Nağd' | 'Qapıda Kart (POS)'

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  // Şəhərin Bakı olub-olmadığını yoxlayan dəqiq funksiya (case-insensitive və normalizasiya ilə)
  const isBakuCity = (name) => {
    if (!name) return false;
    const clean = name.trim().toLowerCase();
    return (
      clean === 'baki' ||
      clean === 'bakı' ||
      clean === 'baku' ||
      clean.startsWith('bak')
    );
  };

  const isBaku = isBakuCity(city);
  const hasCity = city.trim().length > 0;

  // Dinamik Çatdırılma Hesablaması
  let baseShippingFee = 0;
  let shippingMethodLabel = '';

  if (hasCity) {
    if (isBaku) {
      if (shippingOption === 'metro') {
        baseShippingFee = 2.0;
        shippingMethodLabel = 'Metroya Çatdırılma (2 AZN)';
      } else {
        baseShippingFee = 5.0;
        shippingMethodLabel = 'Qapıya Çatdırılma (5 AZN)';
      }
    } else {
      baseShippingFee = 4.0;
      shippingMethodLabel = 'Poçtla Çatdırılma (4 AZN)';
    }
  } else {
    baseShippingFee = 0;
    shippingMethodLabel = 'Şəhər qeyd edilməyib';
  }

  // Kritik Şərt: Əgər səbət cəmi 50 AZN-i keçibsə, çatdırılma TAM PULSUZDUR (0 AZN)!
  const effectiveShippingFee = isFreeShipping ? 0 : baseShippingFee;
  const totalAmount = (subtotalNumber + effectiveShippingFee).toFixed(2);

  const handleCityChange = (val) => {
    setCity(val);
    const newIsBaku = isBakuCity(val);
    if (newIsBaku) {
      if (shippingOption === 'post') {
        setShippingOption('door');
      }
    } else if (val.trim().length > 0) {
      setShippingOption('post');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!firstName.trim()) {
      setErrorMsg('Zəhmət olmasa adınızı daxil edin.');
      return;
    }
    if (!lastName.trim()) {
      setErrorMsg('Zəhmət olmasa soyadınızı daxil edin.');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Zəhmət olmasa çatdırılma şəhərini və ya rayonunu daxil edin.');
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      setErrorMsg('Zəhmət olmasa düzgün mobil telefon nömrəsi daxil edin.');
      return;
    }
    if (!postalCode.trim()) {
      setErrorMsg('Zəhmət olmasa poçt indeksinizi daxil edin (Məsələn: AZ1000).');
      return;
    }
    if (items.length === 0) {
      setErrorMsg('Səbətiniz boşdur. Zəhmət olmasa əvvəlcə məhsul seçin.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            firstName,
            lastName,
            city,
            phone,
            postalCode,
            email: email.trim() || null,
            shippingMethod: isFreeShipping ? `${shippingMethodLabel} (PULSUZ)` : shippingMethodLabel,
            paymentType,
          },
          items,
          subtotal: subtotalNumber,
          shippingFee: effectiveShippingFee,
          total: totalAmount,
          paymentType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderResult(data);
        clearCart();
      } else {
        setErrorMsg(data.error || 'Sifariş göndərilərkən xəta baş verdi.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Şəbəkə xətası baş verdi. Zəhmət olmasa yenidən yoxlayın.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Uğurlu Sifariş Təsdiq Ekranı
  if (orderResult) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 py-12 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-xl text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-3xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#10B981]/20">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-[#10B981] font-bold">
            Sifarişiniz Təsdiqləndi!
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-neutral-900 mt-1">
            Təşəkkür edirik, {orderResult.customer?.name}!
          </h1>

          <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
            Sifarişiniz qeydə alındı. Satış operatorumuz <strong>5 dəqiqə ərzində</strong> sizinlə əlaqə saxlayaraq kuryer çatdırılmasını təşkil edəcək.
          </p>

          {/* Sifariş Detalları Qutusu */}
          <div className="my-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-left space-y-2.5">
            <div className="flex justify-between pb-2 border-b border-neutral-200">
              <span className="text-neutral-500">Sifariş Kodu:</span>
              <strong className="text-neutral-900 font-mono font-bold">{orderResult.orderNumber}</strong>
            </div>
            <div className="flex justify-between pb-2 border-b border-neutral-200">
              <span className="text-neutral-500">Telefon:</span>
              <strong className="text-neutral-900">{orderResult.customer?.phone}</strong>
            </div>
            <div className="flex justify-between pb-2 border-b border-neutral-200">
              <span className="text-neutral-500">Şəhər / Poçt İndeksi:</span>
              <strong className="text-neutral-900">
                {orderResult.customer?.city} ({orderResult.customer?.postalCode})
              </strong>
            </div>
            <div className="flex justify-between pb-2 border-b border-neutral-200">
              <span className="text-neutral-500">Çatdırılma Növü:</span>
              <strong className="text-[#10B981]">
                {orderResult.customer?.shippingMethod || 'Qapıda Təhvil'}
              </strong>
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-neutral-700 font-semibold">Qapıda Ödəniləcək Məbləğ:</span>
              <strong className="text-[#FF5B00] font-black text-lg">
                {orderResult.total} AZN
              </strong>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <a
              href={`https://wa.me/994556422545?text=Salam,%20Electrolify.az-dan%20${orderResult.orderNumber}%20sayl%C4%B1%20sifari%C5%9F%20verdim.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp ilə Əlaqə Saxla</span>
            </a>

            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 font-bold text-xs uppercase tracking-wide flex items-center justify-center transition-colors"
            >
              Ana Səhifəyə Qayıt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Başlıq və Geri Naviqasiya */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Alış-verişə davam et</span>
          </Link>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs text-neutral-700 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Sürətli Qapıda Ödəniş (COD) Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sol Tərəf: Kompakt Səbət Özəti + 6 Xanadan İbarət Form */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-5 sm:p-7 md:p-8 shadow-sm">
            
            {/* 1. KOMPAKT SƏBƏT ÖZƏTİ (Formdan Dərhal Yuxarıda) */}
            <div className="mb-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#FF5B00]" />
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Sifariş Olunacaq Məhsullar ({items.reduce((s, i) => s + i.quantity, 0)} ədəd)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#FF5B00] font-black">
                  {subtotal} AZN
                </span>
              </div>

              {items.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-2">Səbətiniz boşdur.</p>
              ) : (
                <div className="divide-y divide-neutral-200 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {items.map((item) => (
                    <div
                      key={item.lineId}
                      className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-10 h-10 rounded-lg bg-white border border-neutral-200 overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-neutral-900 truncate max-w-[170px] sm:max-w-xs">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-neutral-500 truncate block">
                            {item.variantTitle} • <strong className="text-neutral-700">{item.quantity} ədəd</strong>
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#FF5B00] shrink-0 font-mono">
                        {(item.price * item.quantity).toFixed(2)} AZN
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Başlığı */}
            <div className="mb-5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5B00] font-bold">
                Qapıda Ödəniş Formu
              </span>
              <h2 className="text-xl md:text-2xl font-black text-neutral-900 mt-1">
                Çatdırılma və Əlaqə Məlumatları
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Zəhmət olmasa aşağıdakı məlumatları doldurun. Əvvəlcədən heç bir ödəniş tələb olunmur.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* 2. FORM (YALNIZ: Ad, Soyad, Şəhər, Telefon, Poçt İndeksi, E-poçt) */}
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Ad və Soyad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    Adınız <span className="text-[#FF5B00]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Məs: Rəşad"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white border border-neutral-200 focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/20 rounded-xl min-h-[48px] py-3 px-4 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    Soyadınız <span className="text-[#FF5B00]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Məs: Məmmədov"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white border border-neutral-200 focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/20 rounded-xl min-h-[48px] py-3 px-4 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Şəhər və Poçt İndeksi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5 flex items-center justify-between">
                    <span>Şəhər / Rayon <span className="text-[#FF5B00]">*</span></span>
                    {hasCity && (
                      <span className="text-[10px] text-neutral-500">
                        {isBaku ? '📍 Bakı seçildi' : '📍 Rayon seçildi'}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Məs: Bakı, Gəncə, Sumqayıt..."
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full bg-white border border-neutral-200 focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/20 rounded-xl min-h-[48px] py-3 pl-4 pr-10 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all shadow-sm"
                    />
                    <Building className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    Poçt İndeksi <span className="text-[#FF5B00]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Məs: AZ1000"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-white border border-neutral-200 focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/20 rounded-xl min-h-[48px] py-3 pl-4 pr-10 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all font-mono shadow-sm"
                    />
                    <MapPin className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Mobil Telefon Nömrəsi */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Mobil Telefon Nömrəsi <span className="text-[#FF5B00]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="+994 (50) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-neutral-200 focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/20 rounded-xl min-h-[48px] py-3 pl-4 pr-11 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all font-mono shadow-sm"
                  />
                  <PhoneCall className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Kuryer çatdırılmadan əvvəl bu nömrəyə zəng edəcək.
                </span>
              </div>

              {/* E-poçt (Tamamilə opsiyonal - required deyil!) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-neutral-700">
                    E-poçt (Gmail və s.)
                  </label>
                  <span className="text-[10px] text-neutral-500 font-medium">İstəyə bağlı (Opsional)</span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="adiniz@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-neutral-200 focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/20 rounded-xl min-h-[48px] py-3 pl-4 pr-10 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all shadow-sm"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 3. DİNAMİK ÇATDIRILMA SEÇİMİ (Şəhər daxil edildikdə avtomatik açılır) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#FF5B00]" />
                    Çatdırılma Növü
                  </label>
                  {isFreeShipping && (
                    <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      50 AZN üzəri: PULSUZ
                    </span>
                  )}
                </div>

                {!hasCity ? (
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#FF5B00] shrink-0" />
                    <span>
                      Çatdırılma variantlarını görmək üçün yuxarıda <strong>Şəhər</strong> xanasını doldurun (Məsələn: Bakı və ya digər rayonlar).
                    </span>
                  </div>
                ) : isBaku ? (
                  /* BAKI ÜÇÜN 2 SEÇİM: Metroya (2 AZN) və Qapıya (5 AZN) */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* 1. Metroya Çatdırılma */}
                    <div
                      onClick={() => setShippingOption('metro')}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        shippingOption === 'metro'
                          ? 'bg-orange-50/70 border-[#FF5B00] ring-1 ring-[#FF5B00]'
                          : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            shippingOption === 'metro'
                              ? 'border-[#FF5B00] bg-[#FF5B00]'
                              : 'border-neutral-400 bg-white'
                          }`}
                        >
                          {shippingOption === 'metro' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-neutral-900 block">
                            Metroya Çatdırılma
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            İstənilən metro stansiyasına
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {isFreeShipping ? (
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-neutral-400 line-through font-mono">
                              2.00 AZN
                            </span>
                            <span className="text-xs font-black text-[#10B981]">
                              0 AZN (Pulsuz)
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-black text-neutral-900 font-mono">
                            2.00 AZN
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 2. Qapıya Çatdırılma */}
                    <div
                      onClick={() => setShippingOption('door')}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        shippingOption === 'door'
                          ? 'bg-orange-50/70 border-[#FF5B00] ring-1 ring-[#FF5B00]'
                          : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            shippingOption === 'door'
                              ? 'border-[#FF5B00] bg-[#FF5B00]'
                              : 'border-neutral-400 bg-white'
                          }`}
                        >
                          {shippingOption === 'door' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-neutral-900 block">
                            Qapıya Çatdırılma
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            Ünvanınıza birbaşa kuryer
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {isFreeShipping ? (
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-neutral-400 line-through font-mono">
                              5.00 AZN
                            </span>
                            <span className="text-xs font-black text-[#10B981]">
                              0 AZN (Pulsuz)
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-black text-neutral-900 font-mono">
                            5.00 AZN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* BAKI HARİCİ DİGƏR BÜTÜN ŞƏHƏR VƏ RAYONLAR ÜÇÜN: Poçtla Çatdırılma (4 AZN) */
                  <div
                    onClick={() => setShippingOption('post')}
                    className="p-3.5 rounded-xl border bg-orange-50/70 border-[#FF5B00] ring-1 ring-[#FF5B00] flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border border-[#FF5B00] bg-[#FF5B00] flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block">
                          Poçtla Çatdırılma (Bütün Rayonlar)
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          Azərpoçt və ya rayon kuryeri ilə 2-3 günə təhvil
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {isFreeShipping ? (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-neutral-400 line-through font-mono">
                            4.00 AZN
                          </span>
                          <span className="text-xs font-black text-[#10B981]">
                            0 AZN (Pulsuz)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-black text-neutral-900 font-mono">
                          4.00 AZN
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Qapıda Ödəniş Üsulu */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-neutral-700 mb-2">
                  Qapıda Ödəniş Üsulu
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentType('Qapıda Nağd')}
                    className={`min-h-[50px] p-3 rounded-xl border flex items-center gap-3 transition-all text-left cursor-pointer ${
                      paymentType === 'Qapıda Nağd'
                        ? 'bg-orange-50/70 border-[#FF5B00] ring-1 ring-[#FF5B00]'
                        : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#10B981]" />
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">Qapıda Nağd</span>
                      <span className="text-[10px] text-neutral-500">Məhsulu yoxlayıb nağd ödəyin</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('Qapıda Kart (POS)')}
                    className={`min-h-[50px] p-3 rounded-xl border flex items-center gap-3 transition-all text-left cursor-pointer ${
                      paymentType === 'Qapıda Kart (POS)'
                        ? 'bg-orange-50/70 border-[#FF5B00] ring-1 ring-[#FF5B00]'
                        : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">Qapıda Kart (POS)</span>
                      <span className="text-[10px] text-neutral-500">Kuryerin POS terminalı ilə</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 5. Əsas Sifariş Təsdiq Düyməsi */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[54px] py-4 px-6 rounded-2xl bg-[#FF5B00] hover:bg-[#E64D00] text-white font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-[#FF5B00]/30 transition-all transform active:scale-[0.98] glow-orange disabled:opacity-50 cursor-pointer"
                >
                  <Zap className="w-5 h-5 fill-white text-white" />
                  <span>
                    {isSubmitting
                      ? 'SİFARİŞ GÖNDƏRİLİR...'
                      : 'QAPIDA ÖDƏNİŞLƏ SİFARİŞİ TƏSDİQLƏ'}
                  </span>
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 mt-2.5 text-center">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>
                    Əvvəlcədən heç bir ödəniş tələb olunmur • Yalnız qapıda yoxlayıb ödəyin
                  </span>
                </div>
              </div>
            </form>
          </div>

          {/* Sağ Tərəf: Sifariş Xülasəsi (Desktopda Sticky) */}
          <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="font-black text-neutral-900 text-base">Sifariş Xülasəsi</h3>
              <span className="text-xs text-neutral-500">{items.length} çeşid</span>
            </div>

            {/* Maliyyə Hesablaması */}
            <div className="space-y-2.5 text-xs text-neutral-700">
              <div className="flex justify-between">
                <span className="text-neutral-500">Məhsulların Məbləği:</span>
                <span className="text-neutral-900 font-mono font-bold">{subtotal} AZN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Çatdırılma:</span>
                <div>
                  {isFreeShipping ? (
                    <span className="text-[#10B981] font-bold font-mono">
                      0 AZN (Pulsuz)
                    </span>
                  ) : effectiveShippingFee > 0 ? (
                    <span className="text-neutral-900 font-mono font-bold">
                      {effectiveShippingFee.toFixed(2)} AZN
                    </span>
                  ) : (
                    <span className="text-neutral-400 italic">
                      Şəhər daxil edin
                    </span>
                  )}
                </div>
              </div>

              {isFreeShipping && (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>50 AZN hədəfi keçildiyi üçün çatdırılma 0 AZN!</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-3 border-t border-neutral-200">
                <div>
                  <span className="font-bold text-neutral-900 text-sm block">Yekun Qapıda Ödəniş:</span>
                  <span className="text-[10px] text-neutral-500">Bütün vergi və rüsumlar daxildir</span>
                </div>
                <span className="font-black text-[#FF5B00] text-2xl font-mono">
                  {totalAmount} AZN
                </span>
              </div>
            </div>

            {/* Etibar Nişanları */}
            <div className="pt-3 border-t border-neutral-200 grid grid-cols-3 gap-2 text-center text-[10px] text-neutral-600">
              <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                <Truck className="w-4 h-4 text-[#FF5B00] mx-auto mb-1" />
                <span>24 Saatda Çatdırılma</span>
              </div>
              <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                <ShieldCheck className="w-4 h-4 text-[#10B981] mx-auto mb-1" />
                <span>100% Orijinal</span>
              </div>
              <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span>14 Gün İadə</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
