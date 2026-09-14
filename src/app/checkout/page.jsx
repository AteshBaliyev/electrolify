'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Zap,
  PhoneCall,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  MapPin,
  Building,
  Clock,
  Printer,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { items, subtotal, subtotalNumber, isFreeShipping, hasTwoOrMoreItems, clearCart } = useCart();

  // Tələb olunan xanalar: Ad, Soyad, Mobil Nömrə, Şəhər, Poçt İndeksi (Gmail tamamilə silindi)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Çatdırılma seçimi: 'metro' | 'door' | 'post'
  const [shippingOption, setShippingOption] = useState('door');
  const paymentType = 'Qapıda Nağd (COD)'; // Qapıda seçim silindi, defolt olaraq COD

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderResult, setOrderResult] = useState(null);
  const [submittedDetails, setSubmittedDetails] = useState(null);

  // 5 Dəqiqəlik (300 saniyə) Geri Sayım Taymeri
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timerMinutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const timerSeconds = (timeLeft % 60).toString().padStart(2, '0');

  // Şəhərin Bakı olub-olmadığını yoxlayan dəqiq funksiya
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
    baseShippingFee = 5.0;
    shippingMethodLabel = 'Qapıya Çatdırılma (5 AZN)';
  }

  const effectiveShippingFee = isFreeShipping ? 0 : baseShippingFee;
  const totalAmount = (subtotalNumber + effectiveShippingFee).toFixed(2);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

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
    if (!phone.trim() || phone.length < 9) {
      setErrorMsg('Zəhmət olmasa düzgün mobil telefon nömrəsi daxil edin.');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Zəhmət olmasa çatdırılma şəhərini və ya rayonunu daxil edin.');
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

    const orderSnapshot = {
      customer: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        phone: phone.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        shippingMethod: isFreeShipping ? `${shippingMethodLabel} (PULSUZ)` : shippingMethodLabel,
        paymentType,
      },
      items: [...items],
      subtotal: subtotalNumber.toFixed(2),
      shippingFee: effectiveShippingFee.toFixed(2),
      total: totalAmount,
      date: new Date().toLocaleString('az-AZ', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: orderSnapshot.customer,
          items: orderSnapshot.items,
          subtotal: subtotalNumber,
          shippingFee: effectiveShippingFee,
          total: totalAmount,
          paymentType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmittedDetails(orderSnapshot);
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

  // =========================================================================
  // 1. RƏSMİ SİFARİŞ ÇEKİ EKRANI (Sifariş Tamamlandıqda Pramoy Görsənən Yer)
  // =========================================================================
  if (orderResult && submittedDetails) {
    const orderNumberDisplay =
      orderResult.shopifyOrderName || orderResult.orderNumber || 'EL-SİFARİŞ';

    const itemsListText = submittedDetails.items
      .map(
        (i) =>
          `• ${i.title} (${i.variantTitle || 'Standart'}) x${i.quantity} = ${(i.price * i.quantity).toFixed(2)} AZN`
      )
      .join('\n');

    const whatsappMessage = `Salam! Electrolify.com saytından sifarişimi təsdiq edirəm:
🧾 Sifariş Çeki: ${orderNumberDisplay}
👤 Müştəri: ${submittedDetails.customer.name}
📞 Telefon: ${submittedDetails.customer.phone}
📍 Ünvan: ${submittedDetails.customer.city} (${submittedDetails.customer.postalCode})
🚚 Çatdırılma: ${submittedDetails.customer.shippingMethod}

📦 Məhsullar:
${itemsListText}

💰 Yekun Qapıda Ödəniş: ${submittedDetails.total} AZN

Zəhmət olmasa sifarişimi qəbul edin və çatdırılmanı başladın.`;

    const whatsappLink = `https://wa.me/994556422545?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    return (
      <div className="min-h-screen bg-[#F4F5F7] text-neutral-900 py-6 sm:py-10 px-3 sm:px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-neutral-200 rounded-3xl p-5 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative">
          
          {/* Uğur Başlığı */}
          <div className="text-center pb-5 border-b border-dashed border-neutral-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Sifarişiniz Uğurla Qeydə Alındı!
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 mt-2">
              Rəsmi Sifariş Çeki
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Çatdırılmanın dərhal başlaması üçün WhatsApp ilə təsdiq edin
            </p>
          </div>

          {/* ƏN ƏSAS VƏ BÖYÜK: WHATSAPP TƏSDİQ DÜYMƏSİ (İstifadəçinin dərhal basması üçün ən üstdə) */}
          <div className="my-5">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-[#25D366]/30 transition-all transform active:scale-95 text-center"
            >
              <MessageCircle className="w-5 h-5 fill-white shrink-0" />
              <span>WhatsApp İlə Sifarişi Təsdiqlə</span>
            </a>
            <span className="text-[11px] text-neutral-500 text-center block mt-2">
              ⚡ Operatorumuzla birbaşa əlaqə saxlayaraq kuryeri təsdiqləyin
            </span>
          </div>

          {/* ÇEK KARTI (Dizaynı Rəsmi Çek Formatında) */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-3 font-sans">
            {/* Çek Başlıq Məlumatları */}
            <div className="flex justify-between items-center pb-2 border-b border-dashed border-neutral-300 text-[11px]">
              <span className="text-neutral-500">Çek № / Kod:</span>
              <span className="font-mono font-black text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
                {orderNumberDisplay}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-dashed border-neutral-300 text-[11px]">
              <span className="text-neutral-500">Tarix:</span>
              <span className="font-semibold text-neutral-800">
                {submittedDetails.date}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-dashed border-neutral-300 text-[11px]">
              <span className="text-neutral-500">Müştəri:</span>
              <strong className="text-neutral-900">
                {submittedDetails.customer.name}
              </strong>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-dashed border-neutral-300 text-[11px]">
              <span className="text-neutral-500">Əlaqə Nömrəsi:</span>
              <strong className="text-neutral-900 font-mono">
                {submittedDetails.customer.phone}
              </strong>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-dashed border-neutral-300 text-[11px]">
              <span className="text-neutral-500">Çatdırılma Ünvanı:</span>
              <span className="text-neutral-800 font-medium text-right max-w-[200px] truncate">
                {submittedDetails.customer.city} ({submittedDetails.customer.postalCode})
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-dashed border-neutral-300 text-[11px]">
              <span className="text-neutral-500">Çatdırılma Növü:</span>
              <span className="text-emerald-700 font-bold">
                {submittedDetails.customer.shippingMethod}
              </span>
            </div>

            {/* Sifariş Edilən Məhsullar Siyahısı */}
            <div className="pt-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Sifariş Olunan Məhsullar:
              </span>
              <div className="space-y-2">
                {submittedDetails.items.map((item) => (
                  <div
                    key={item.lineId}
                    className="flex items-center justify-between gap-2 text-[11px] bg-white p-2 rounded-xl border border-neutral-200"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-neutral-900 truncate block">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-neutral-500 block">
                          {item.variantTitle || 'Standart'} • {item.quantity} ədəd
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-neutral-900 shrink-0">
                      {(item.price * item.quantity).toFixed(2)} AZN
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Yekun Qapıda Ödəniləcək Cəm */}
            <div className="pt-2 border-t-2 border-dashed border-neutral-300 flex justify-between items-baseline">
              <div>
                <span className="text-xs font-bold text-neutral-900 block">
                  Qapıda Ödəniləcək Məbləğ:
                </span>
                <span className="text-[10px] text-neutral-500">
                  Nağd və ya POS terminal ilə
                </span>
              </div>
              <span className="text-xl font-mono font-black text-[#FF5B00]">
                {submittedDetails.total} AZN
              </span>
            </div>
          </div>

          {/* Alt Düymələr */}
          <div className="mt-5 flex flex-col gap-2">
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 font-bold text-xs uppercase tracking-wide flex items-center justify-center transition-colors text-center"
            >
              Ana Səhifəyə Qayıt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. SƏBƏT BOŞ OLDUQDA
  // =========================================================================
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 flex flex-col">
        {/* Minimal Başlıq */}
        <div className="bg-white border-b border-neutral-200 py-3 px-4">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1.5 text-xs text-neutral-600">
              <ArrowLeft className="w-4 h-4" />
              <span>Geri</span>
            </Link>
            <span className="font-black text-sm tracking-wider text-neutral-900">ELECTROLIFY</span>
            <div className="w-10" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white border border-neutral-200 rounded-3xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF5B00] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-neutral-900">Səbətiniz Boşdur</h2>
            <p className="text-xs text-neutral-500 mt-2 mb-6">
              Sifariş vermək üçün zəhmət olmasa bəyəndiyiniz məhsulu seçin.
            </p>
            <Link
              href="/"
              className="w-full py-3.5 px-6 rounded-xl bg-[#FF5B00] text-white font-black text-xs uppercase tracking-wider inline-flex items-center justify-center shadow-md hover:bg-[#e05000] transition-colors"
            >
              Məhsullara Bax
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. ƏSAS SİFARİŞ SƏHİFƏSİ (FORM ƏN YUXARIDA, KOMPAKT MƏHSUL VƏ QAPIDA COD)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 flex flex-col">
      {/* 1. Yalnız Sifariş Üçün Minimal Başlıq (Başqa Heç Nə Olmasın) */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-[#FF5B00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Alış-verişə qayıt</span>
          </Link>

          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-950 flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4 fill-[#FF5B00] text-[#FF5B00]" />
            </div>
            <span className="font-black text-sm tracking-wider text-neutral-900">ELECTROLIFY</span>
          </Link>

          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Təhlükəsiz</span>
          </div>
        </div>
      </header>

      {/* 2. GERİ SAYIM ZOLAĞI (Xüsusi Endirim 5 Dəqiqə Ərzində Bitir) */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white py-2 px-3 sm:px-4 text-center border-b border-neutral-800 shadow-sm">
        <div className="max-w-xl mx-auto flex items-center justify-center gap-2 text-xs font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5B00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5B00]"></span>
          </span>
          <span className="text-neutral-200">Xüsusi Endirim 5 Dəqiqə Ərzində Bitir:</span>
          <span className="bg-[#FF5B00] text-white px-2 py-0.5 rounded font-mono font-black tracking-wider text-xs shadow-xs">
            {timerMinutes}:{timerSeconds}
          </span>
        </div>
      </div>

      {/* 3. ƏSAS MƏZMUN: TƏMİZ VƏ DİQQƏT YAYINDIRMAYAN VAHİD SÜTUN */}
      <main className="flex-1 py-4 sm:py-6 px-3 sm:px-4">
        <div className="max-w-xl mx-auto space-y-4">
          
          {/* XƏTA BİLDİRİŞİ (Varsa) */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* =========================================================================
              A. FORM ƏN YUXARIDA (Ad, Soyad, Mobil, Şəhər, Poçt İndeksi)
              ========================================================================= */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-4 sm:p-6 shadow-sm">
            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5B00] font-black bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200 inline-block mb-1">
                Qapıda Ödəniş Formu
              </span>
              <h2 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">
                Çatdırılma və Əlaqə Məlumatları
              </h2>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Zəhmət olmasa məlumatları doldurun. Əvvəlcədən heç bir ödəniş tələb olunmur.
              </p>
            </div>

            <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-3.5">
              {/* Ad və Soyad */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Adınız <span className="text-[#FF5B00]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Məs: Rəşad"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white border border-neutral-200 focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/20 rounded-xl h-11 px-3.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Soyadınız <span className="text-[#FF5B00]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Məs: Məmmədov"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white border border-neutral-200 focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/20 rounded-xl h-11 px-3.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Mobil Telefon Nömrəsi */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Mobil Telefon Nömrəsi <span className="text-[#FF5B00]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="Məs: 050 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-neutral-200 focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/20 rounded-xl h-11 pl-3.5 pr-10 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all font-mono shadow-xs"
                  />
                  <PhoneCall className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Kuryer çatdırılmadan əvvəl bu nömrəyə zəng edəcək.
                </span>
              </div>

              {/* Şəhər və Poçt İndeksi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1 flex items-center justify-between">
                    <span>Şəhər / Rayon <span className="text-[#FF5B00]">*</span></span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Məs: Bakı, Gəncə..."
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full bg-white border border-neutral-200 focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/20 rounded-xl h-11 pl-3.5 pr-9 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all shadow-xs"
                    />
                    <Building className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Poçt İndeksi <span className="text-[#FF5B00]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Məs: AZ1000"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-white border border-neutral-200 focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/20 rounded-xl h-11 pl-3.5 pr-9 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all font-mono shadow-xs"
                    />
                    <MapPin className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* DİNAMİK ÇATDIRILMA SEÇİMİ */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-neutral-800 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#FF5B00]" />
                    <span>Çatdırılma Növü</span>
                  </label>
                  {isFreeShipping && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      {hasTwoOrMoreItems ? '2 Məhsul: PULSUZ' : '50 AZN+: PULSUZ'}
                    </span>
                  )}
                </div>

                {!hasCity ? (
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-500 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#FF5B00] shrink-0" />
                    <span>
                      Çatdırılma variantlarını görmək üçün yuxarıda <strong>Şəhər</strong> xanasını doldurun (Məs: Bakı).
                    </span>
                  </div>
                ) : isBaku ? (
                  /* BAKI ÜÇÜN SEÇİMLƏR */
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      onClick={() => setShippingOption('metro')}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        shippingOption === 'metro'
                          ? 'bg-orange-50/70 border-[#FF5B00] ring-1 ring-[#FF5B00]'
                          : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            shippingOption === 'metro'
                              ? 'border-[#FF5B00] bg-[#FF5B00]'
                              : 'border-neutral-400 bg-white'
                          }`}
                        >
                          {shippingOption === 'metro' && (
                            <div className="w-1 h-1 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-neutral-900 block truncate">
                            Metroya
                          </span>
                          <span className="text-[9px] text-neutral-500 block truncate">
                            Metrostansiyaya
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {isFreeShipping ? (
                          <div className="flex flex-col items-end leading-none">
                            <span className="text-[9px] text-neutral-400 line-through font-mono">
                              2.00 AZN
                            </span>
                            <span className="text-[11px] font-black text-emerald-600">
                              Pulsuz
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-black text-neutral-900 font-mono">
                            2 AZN
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      onClick={() => setShippingOption('door')}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        shippingOption === 'door'
                          ? 'bg-orange-50/70 border-[#FF5B00] ring-1 ring-[#FF5B00]'
                          : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            shippingOption === 'door'
                              ? 'border-[#FF5B00] bg-[#FF5B00]'
                              : 'border-neutral-400 bg-white'
                          }`}
                        >
                          {shippingOption === 'door' && (
                            <div className="w-1 h-1 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-neutral-900 block truncate">
                            Qapıya
                          </span>
                          <span className="text-[9px] text-neutral-500 block truncate">
                            Birbaşa ünvana
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {isFreeShipping ? (
                          <div className="flex flex-col items-end leading-none">
                            <span className="text-[9px] text-neutral-400 line-through font-mono">
                              5.00 AZN
                            </span>
                            <span className="text-[11px] font-black text-emerald-600">
                              Pulsuz
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-black text-neutral-900 font-mono">
                            5 AZN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* BAKI XARİCİ RAYONLAR */
                  <div
                    onClick={() => setShippingOption('post')}
                    className="p-3 rounded-xl border bg-orange-50/70 border-[#FF5B00] ring-1 ring-[#FF5B00] flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full border border-[#FF5B00] bg-[#FF5B00] flex items-center justify-center shrink-0">
                        <div className="w-1 h-1 rounded-full bg-white" />
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
                        <div className="flex flex-col items-end leading-none">
                          <span className="text-[9px] text-neutral-400 line-through font-mono">
                            4.00 AZN
                          </span>
                          <span className="text-xs font-black text-emerald-600">
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
            </form>
          </div>

          {/* =========================================================================
              B. SİFARİŞ OLUNACAQ MALLAR (KOMPAKT ŞƏKİLDƏ)
              ========================================================================= */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#FF5B00]" />
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                  Sifariş Olunacaq Məhsullar ({totalQuantity} ədəd)
                </h3>
              </div>
              <span className="text-xs font-mono font-black text-[#FF5B00]">
                {subtotal} AZN
              </span>
            </div>

            {/* Kompakt Məhsul Siyahısı */}
            <div className="divide-y divide-neutral-100 space-y-2">
              {items.map((item) => (
                <div
                  key={item.lineId}
                  className="pt-2 first:pt-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                      <span className="absolute bottom-0 right-0 bg-neutral-900 text-white text-[9px] font-black px-1 rounded-tl-md font-mono">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-neutral-900 truncate max-w-[180px] sm:max-w-xs">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-neutral-500 block truncate">
                        {item.variantTitle || 'Standart'} • {item.quantity} ədəd
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-neutral-900 font-mono shrink-0">
                    {(item.price * item.quantity).toFixed(2)} AZN
                  </span>
                </div>
              ))}
            </div>

            {/* Məbləğ Detalları */}
            <div className="mt-3 pt-3 border-t border-neutral-200 space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Məhsulların Məbləği:</span>
                <span className="font-mono font-bold text-neutral-900">{subtotal} AZN</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Çatdırılma:</span>
                <div>
                  {isFreeShipping ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-400 line-through font-mono text-[11px]">
                        {(baseShippingFee > 0 ? baseShippingFee : 5.0).toFixed(2)} AZN
                      </span>
                      <span className="text-emerald-700 font-black text-xs uppercase bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Pulsuz
                      </span>
                    </div>
                  ) : effectiveShippingFee > 0 ? (
                    <span className="font-mono font-bold text-neutral-900">
                      {effectiveShippingFee.toFixed(2)} AZN
                    </span>
                  ) : (
                    <span className="text-neutral-400 italic text-[11px]">Şəhər seçin</span>
                  )}
                </div>
              </div>

              {isFreeShipping && (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {hasTwoOrMoreItems
                      ? '🎉 2 ədəd məhsul aksiyası: Karqo tamamilə PULSUZDUR!'
                      : '🎉 50 AZN aksiyası: Karqo tamamilə PULSUZDUR!'}
                  </span>
                </div>
              )}

              {/* Yekun Məbləğ */}
              <div className="pt-2.5 border-t border-neutral-200 flex justify-between items-baseline">
                <div>
                  <span className="font-black text-neutral-900 text-sm block">
                    Qapıda Ödəniləcək:
                  </span>
                  <span className="text-[10px] text-neutral-500">Bütün xərclər daxildir</span>
                </div>
                <span className="font-black text-[#FF5B00] text-xl sm:text-2xl font-mono">
                  {totalAmount} AZN
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              C. QAPIDA ÖDƏNİŞ ZƏMANƏTİ VƏ ƏSAS TƏSDİQ DÜYMƏSİ
              ========================================================================= */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
            {/* Qapıda Ödəniş Bildirişi (POS/Nağd seçimi ləğv edildi, rahat zəmanət qoyuldu) */}
            <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-200/80 text-[11px] text-neutral-700 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block font-bold">
                  Qapıda Təhvil və Ödəniş
                </strong>
                <span>
                  Əvvəlcədən kart və ya ödəniş tələb olunmur. Məhsulu qapıda kuryerdən təhvil alarkən nağd və ya kartla ödəyə bilərsiniz.
                </span>
              </div>
            </div>

            {/* Sifarişi Tamamla Düyməsi */}
            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full h-14 rounded-2xl bg-[#FF5B00] hover:bg-[#E64D00] text-white font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-[#FF5B00]/30 transition-all transform active:scale-[0.98] glow-orange disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-white text-white shrink-0" />
              <span>
                {isSubmitting
                  ? 'SİFARİŞ GÖNDƏRİLİR...'
                  : 'QAPIDA ÖDƏNİŞLƏ SİFARİŞİ TAMAMLA'}
              </span>
            </button>

            <div className="text-center">
              <span className="text-[10px] text-neutral-400">
                🔒 256-Bit SSL Şifrələnmə • 100% Təhlükəsiz Qapıda Sifariş
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
