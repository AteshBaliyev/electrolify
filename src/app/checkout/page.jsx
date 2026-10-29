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
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { trackPurchase } from '@/lib/metaPixel';
import { trackShopifyPurchase } from '@/lib/shopifyAnalytics';

export default function CheckoutPage() {
  const { items, subtotal, subtotalNumber, isFreeShipping, hasTwoOrMoreItems, clearCart } = useCart();

  // Tələb olunan xanalar: Yalnız Ad, Mobil Nömrə, Şəhər/Rayon
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  // Çatdırılma seçimi: 'metro' | 'door' | 'post'
  const [shippingOption, setShippingOption] = useState('door');
  const paymentType = 'Qapıda Nağd (COD)';

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
    if (!phone.trim() || phone.length < 9) {
      setErrorMsg('Zəhmət olmasa düzgün mobil telefon nömrəsi daxil edin.');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Zəhmət olmasa çatdırılma şəhərini və ya rayonunu daxil edin.');
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
        lastName: '',
        name: firstName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        postalCode: '',
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

        // Meta Pixel Purchase Hadisəsi
        trackPurchase({
          orderId: data.shopifyOrderName || data.orderNumber || `ORD-${Date.now()}`,
          value: totalAmount,
          currency: 'AZN',
          items: orderSnapshot.items,
        });

        // Shopify Analytics Purchase Hadisəsi
        trackShopifyPurchase({
          orderNumber: data.shopifyOrderName || data.orderNumber,
          total: totalAmount,
          items: orderSnapshot.items,
        });
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
  // 1. RƏSMİ SİFARİŞ ÇEKİ EKRANI (Sifariş Tamamlandıqda Görsənən Ekran)
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

    const whatsappMessage = `Salam! Trendim.store saytından sifarişimi təsdiq edirəm:
🧾 Sifariş Çeki: ${orderNumberDisplay}
👤 Müştəri: ${submittedDetails.customer.name}
📞 Telefon: ${submittedDetails.customer.phone}
📍 Ünvan: ${submittedDetails.customer.city}
🚚 Çatdırılma: ${submittedDetails.customer.shippingMethod}

📦 Məhsullar:
${itemsListText}

💰 Yekun Qapıda Ödəniş: ${submittedDetails.total} AZN

Zəhmət olmasa sifarişimi qəbul edin və çatdırılmanı başladın.`;

    const whatsappLink = `https://wa.me/994559031176?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    return (
      <div className="min-h-screen bg-[#F1F5F9] text-slate-900 py-8 sm:py-12 px-3 sm:px-4 flex items-center justify-center font-sans">
        <div className="max-w-md w-full bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative">
          
          {/* Uğur Başlığı */}
          <div className="text-center pb-6 border-b border-dashed border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3.5 shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300 inline-block shadow-xs">
              ✓ Sifarişiniz Uğurla Qeydə Alındı!
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2.5 tracking-tight">
              Rəsmi Sifariş Çeki
            </h1>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Çatdırılmanın dərhal başlaması üçün WhatsApp ilə təsdiq edin
            </p>
          </div>

          {/* WHATSAPP TƏSDİQ DÜYMƏSİ */}
          <div className="my-5">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-[#25D366]/35 transition-all transform active:scale-95 text-center cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white shrink-0" />
              <span>WhatsApp İlə Sifarişi Təsdiqlə</span>
            </a>
            <span className="text-xs text-slate-500 font-semibold text-center block mt-2">
              ⚡ Operatorumuzla birbaşa əlaqə saxlayaraq kuryeri təsdiqləyin
            </span>
          </div>

          {/* ÇEK KARTI (Rəsmi Format) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3 font-sans">
            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300 text-xs">
              <span className="text-slate-500 font-semibold">Çek № / Kod:</span>
              <span className="font-mono font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-xs">
                {orderNumberDisplay}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300 text-xs">
              <span className="text-slate-500 font-semibold">Tarix:</span>
              <span className="font-bold text-slate-900">
                {submittedDetails.date}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300 text-xs">
              <span className="text-slate-500 font-semibold">Müştəri:</span>
              <strong className="text-slate-900 font-extrabold">
                {submittedDetails.customer.name}
              </strong>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300 text-xs">
              <span className="text-slate-500 font-semibold">Əlaqə Nömrəsi:</span>
              <strong className="text-slate-900 font-mono font-bold">
                {submittedDetails.customer.phone}
              </strong>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300 text-xs">
              <span className="text-slate-500 font-semibold">Çatdırılma Ünvanı:</span>
              <span className="text-slate-900 font-bold text-right max-w-[200px] truncate">
                {submittedDetails.customer.city}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300 text-xs">
              <span className="text-slate-500 font-semibold">Çatdırılma Növü:</span>
              <span className="text-emerald-700 font-extrabold">
                {submittedDetails.customer.shippingMethod}
              </span>
            </div>

            {/* Sifariş Edilən Məhsullar Siyahısı */}
            <div className="pt-1">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-2">
                Sifariş Olunan Məhsullar:
              </span>
              <div className="space-y-2">
                {submittedDetails.items.map((item) => (
                  <div
                    key={item.lineId}
                    className="flex items-center justify-between gap-2.5 text-xs bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 truncate block">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          {item.variantTitle || 'Standart'} • {item.quantity} ədəd
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-slate-900 shrink-0 whitespace-nowrap">
                      {(item.price * item.quantity).toFixed(2)} AZN
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Yekun Qapıda Ödəniləcək Cəm */}
            <div className="pt-3 border-t-2 border-dashed border-slate-300 flex justify-between items-baseline gap-3">
              <div className="min-w-0">
                <span className="text-xs font-black text-slate-900 block truncate">
                  Qapıda Ödəniləcək:
                </span>
                <span className="text-[11px] text-slate-500 font-medium block truncate">
                  Nağd və ya kartla kuryerə
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-mono font-black text-slate-900 shrink-0 whitespace-nowrap">
                {submittedDetails.total} AZN
              </span>
            </div>
          </div>

          {/* Alt Düymə */}
          <div className="mt-5">
            <Link
              href="/"
              className="w-full py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center transition-colors text-center"
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
      <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans">
        <div className="bg-white border-b border-slate-200 py-3.5 px-4 shadow-xs">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri qayıt</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#111827] flex items-center justify-center text-white shadow-xs">
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-black text-sm tracking-wider text-slate-900">TRENDİM</span>
            </Link>
            <div className="w-10" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white border-2 border-slate-200 rounded-3xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-xs">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Səbətiniz Boşdur</h2>
            <p className="text-xs text-slate-600 font-medium mt-2 mb-6">
              Sifariş vermək üçün zəhmət olmasa bəyəndiyiniz məhsulu seçin.
            </p>
            <Link
              href="/"
              className="w-full py-4 px-6 rounded-2xl bg-[#111827] text-white font-black text-xs uppercase tracking-wider inline-flex items-center justify-center shadow-md hover:bg-[#1f2937] transition-all active:scale-95"
            >
              Məhsullara Bax
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. ƏSAS SİFARİŞ SƏHİFƏSİ
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans">
      {/* 1. Minimal Üst Başlıq */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Alış-verişə qayıt</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-[#111827] flex items-center justify-center text-white shadow-xs shrink-0">
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-black text-sm tracking-wider text-slate-900">TRENDİM</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full shadow-xs">
            <Lock className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
            <span>Təhlükəsiz</span>
          </div>
        </div>
      </header>

      {/* 2. GERİ SAYIM ZOLAĞI (Endirim Taymeri) */}
      <div className="bg-slate-950 text-white py-2.5 px-3 sm:px-4 text-center border-b border-slate-800 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-center gap-2 text-xs font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="text-slate-200 font-bold">Xüsusi Endirim 5 Dəqiqə Ərzində Bitir:</span>
          <span className="bg-rose-600 text-white px-2.5 py-0.5 rounded-md font-mono font-black tracking-wider text-xs shadow-xs">
            {timerMinutes}:{timerSeconds}
          </span>
        </div>
      </div>

      {/* 3. ƏSAS MƏZMUN */}
      <main className="flex-1 py-4 sm:py-6 px-3 sm:px-4">
        <div className="max-w-xl mx-auto space-y-4">
          
          {/* XƏTA BİLDİRİŞİ (Varsa) */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-xs text-red-700 font-bold flex items-center gap-2 shadow-xs">
              <span className="text-base">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* =========================================================================
              A. ƏLAQƏ VƏ ÇATDIRILMA FORMU
              ========================================================================= */}
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-4 sm:p-7 shadow-lg shadow-slate-200/60">
            <div className="mb-4 pb-3 border-b border-slate-100">
              <span className="text-[11px] font-black uppercase tracking-wider text-white bg-[#111827] px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2 shadow-xs">
                <Truck className="w-3.5 h-3.5 text-white" />
                Qapıda Ödəniş Formu
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Çatdırılma və Əlaqə Məlumatları
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                Zəhmət olmasa məlumatları doldurun. Əvvəlcədən heç bir ödəniş tələb olunmur.
              </p>
            </div>

            <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Adınız */}
              <div>
                <label className="block text-xs font-black text-slate-900 mb-1.5 flex items-center justify-between">
                  <span>Adınız <span className="text-rose-600">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Məs: Rəşad Məmmədov"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-50/60 border-2 border-slate-200 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 rounded-2xl h-12 px-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-xs"
                />
              </div>

              {/* Mobil Telefon Nömrəsi */}
              <div>
                <label className="block text-xs font-black text-slate-900 mb-1.5 flex items-center justify-between">
                  <span>Mobil Telefon Nömrəsi <span className="text-rose-600">*</span></span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="Məs: 050 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50/60 border-2 border-slate-200 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 rounded-2xl h-12 pl-4 pr-11 text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-xs"
                  />
                  <PhoneCall className="w-4 h-4 text-slate-600 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className="text-xs text-slate-500 font-medium mt-1.5 block">
                  Kuryer çatdırılmadan əvvəl bu nömrəyə zəng edəcək.
                </span>
              </div>

              {/* Şəhər / Rayon */}
              <div>
                <label className="block text-xs font-black text-slate-900 mb-1.5 flex items-center justify-between">
                  <span>Şəhər / Rayon <span className="text-rose-600">*</span></span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Məs: Bakı, Gəncə, Sumqayıt..."
                    value={city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full bg-slate-50/60 border-2 border-slate-200 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 rounded-2xl h-12 pl-4 pr-11 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-xs"
                  />
                  <Building className="w-4 h-4 text-slate-600 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* ÇATDIRILMA SEÇİMİ */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-slate-900" />
                    <span>Çatdırılma Növü</span>
                  </label>
                  {isFreeShipping && (
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      {hasTwoOrMoreItems ? '2 Məhsul: PULSUZ' : '50 AZN+: PULSUZ'}
                    </span>
                  )}
                </div>

                {!hasCity ? (
                  <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-900 shrink-0" />
                    <span>
                      Çatdırılma variantlarını görmək üçün yuxarıda <strong>Şəhər</strong> xanasını doldurun (Məs: Bakı).
                    </span>
                  </div>
                ) : isBaku ? (
                  /* BAKI ÜÇÜN SEÇİMLƏR */
                  <div className="grid grid-cols-2 gap-2.5">
                    <div
                      onClick={() => setShippingOption('metro')}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        shippingOption === 'metro'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            shippingOption === 'metro'
                              ? 'border-white bg-white'
                              : 'border-slate-400 bg-white'
                          }`}
                        >
                          {shippingOption === 'metro' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className={`text-xs font-black block truncate ${shippingOption === 'metro' ? 'text-white' : 'text-slate-900'}`}>
                            Metroya
                          </span>
                          <span className={`text-[10px] block truncate font-medium ${shippingOption === 'metro' ? 'text-slate-300' : 'text-slate-500'}`}>
                            Metrostansiyaya
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 whitespace-nowrap">
                        {isFreeShipping ? (
                          <div className="flex flex-col items-end leading-none">
                            <span className="text-[10px] text-slate-400 line-through font-mono whitespace-nowrap">
                              2.00 AZN
                            </span>
                            <span className="text-xs font-black text-emerald-400 whitespace-nowrap">
                              Pulsuz
                            </span>
                          </div>
                        ) : (
                          <span className={`text-xs font-black font-mono whitespace-nowrap ${shippingOption === 'metro' ? 'text-white' : 'text-slate-900'}`}>
                            2 AZN
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      onClick={() => setShippingOption('door')}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        shippingOption === 'door'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            shippingOption === 'door'
                              ? 'border-white bg-white'
                              : 'border-slate-400 bg-white'
                          }`}
                        >
                          {shippingOption === 'door' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className={`text-xs font-black block truncate ${shippingOption === 'door' ? 'text-white' : 'text-slate-900'}`}>
                            Qapıya
                          </span>
                          <span className={`text-[10px] block truncate font-medium ${shippingOption === 'door' ? 'text-slate-300' : 'text-slate-500'}`}>
                            Birbaşa ünvana
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 whitespace-nowrap">
                        {isFreeShipping ? (
                          <div className="flex flex-col items-end leading-none">
                            <span className="text-[10px] text-slate-400 line-through font-mono whitespace-nowrap">
                              5.00 AZN
                            </span>
                            <span className="text-xs font-black text-emerald-400 whitespace-nowrap">
                              Pulsuz
                            </span>
                          </div>
                        ) : (
                          <span className={`text-xs font-black font-mono whitespace-nowrap ${shippingOption === 'door' ? 'text-white' : 'text-slate-900'}`}>
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
                    className="p-3.5 rounded-2xl border-2 bg-slate-900 text-white border-slate-900 shadow-md flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full border-2 border-white bg-white flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-white block">
                          Poçtla Çatdırılma (Bütün Rayonlar)
                        </span>
                        <span className="text-[11px] text-slate-300 font-medium">
                          Azərpoçt və ya rayon kuryeri ilə 2-3 günə təhvil
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 whitespace-nowrap">
                      {isFreeShipping ? (
                        <div className="flex flex-col items-end leading-none">
                          <span className="text-[10px] text-slate-400 line-through font-mono whitespace-nowrap">
                            4.00 AZN
                          </span>
                          <span className="text-xs font-black text-emerald-400 whitespace-nowrap">
                            0 AZN (Pulsuz)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-black text-white font-mono whitespace-nowrap">
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
              B. SİFARİŞ OLUNACAQ MƏHSULLAR VƏ HESABAT
              ========================================================================= */}
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-4 sm:p-7 shadow-lg shadow-slate-200/60 space-y-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
                  <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider truncate">
                  Sifariş Olunacaq Məhsullar ({totalQuantity} ədəd)
                </h3>
              </div>
              <span className="text-sm font-mono font-black text-slate-900 shrink-0 whitespace-nowrap">
                {subtotal} AZN
              </span>
            </div>

            {/* Kompakt Məhsul Siyahısı */}
            <div className="divide-y divide-slate-100 space-y-2.5">
              {items.map((item) => (
                <div
                  key={item.lineId}
                  className="pt-2.5 first:pt-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 shadow-xs">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                      <span className="absolute bottom-0 right-0 bg-slate-900 text-white text-[10px] font-black px-1.5 py-0.2 rounded-tl-md font-mono">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate max-w-[190px] sm:max-w-xs leading-tight">
                        {item.title}
                      </h4>
                      <span className="text-xs text-slate-500 font-semibold block truncate mt-0.5">
                        {item.variantTitle || 'Standart'} • {item.quantity} ədəd
                      </span>
                    </div>
                  </div>

                  <span className="text-sm font-black text-slate-900 font-mono shrink-0 whitespace-nowrap">
                    {(item.price * item.quantity).toFixed(2)} AZN
                  </span>
                </div>
              ))}
            </div>

            {/* Məbləğ Detalları */}
            <div className="mt-4 pt-3.5 border-t border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between items-center gap-2">
                <span className="font-bold text-slate-600">Məhsulların Məbləği:</span>
                <span className="font-mono font-black text-slate-900 text-sm shrink-0 whitespace-nowrap">{subtotal} AZN</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="font-bold text-slate-600">Çatdırılma:</span>
                <div className="shrink-0 whitespace-nowrap">
                  {isFreeShipping ? (
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span className="text-slate-400 line-through font-mono text-xs whitespace-nowrap">
                        {(baseShippingFee > 0 ? baseShippingFee : 5.0).toFixed(2)} AZN
                      </span>
                      <span className="text-emerald-700 font-black text-xs uppercase bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 whitespace-nowrap">
                        Pulsuz
                      </span>
                    </div>
                  ) : effectiveShippingFee > 0 ? (
                    <span className="font-mono font-black text-slate-900 text-sm whitespace-nowrap">
                      {effectiveShippingFee.toFixed(2)} AZN
                    </span>
                  ) : (
                    <span className="text-slate-400 italic font-medium whitespace-nowrap">Şəhər seçin</span>
                  )}
                </div>
              </div>

              {isFreeShipping && (
                <div className="p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm mt-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-200 shrink-0" />
                  <span>
                    {hasTwoOrMoreItems
                      ? '🎉 2 ədəd məhsul aksiyası: Karqo tamamilə PULSUZDUR!'
                      : '🎉 50 AZN aksiyası: Karqo tamamilə PULSUZDUR!'}
                  </span>
                </div>
              )}

              {/* Yekun Qapıda Ödəniləcək Qutu (Ağ Arxa Fon) */}
              <div className="mt-3.5 p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-200 flex justify-between items-center gap-3 shadow-xs">
                <div className="min-w-0 flex-1">
                  <span className="font-black text-sm sm:text-base block tracking-tight text-slate-900">
                    Qapıda Ödəniləcək:
                  </span>
                  <span className="text-xs text-slate-500 font-medium block mt-0.5">
                    Bütün xərclər daxildir • Kuryerə ödəniş
                  </span>
                </div>
                <div className="text-right shrink-0 whitespace-nowrap">
                  <span className="font-black text-2xl sm:text-3xl font-mono text-slate-900 tracking-tight whitespace-nowrap">
                    {totalAmount} AZN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              C. GÜVƏN VƏ SİFARİŞİ TƏSDİQLƏ DÜYMƏSİ
              ========================================================================= */}
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-4 sm:p-7 shadow-lg shadow-slate-200/60 space-y-4">
            {/* Qapıda Ödəniş Zəmanəti Qutusu */}
            <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 text-slate-800 flex items-start gap-3 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs sm:text-sm font-black text-slate-900 block">
                  Qapıda Təhvil və Ödəniş Zəmanəti
                </strong>
                <span className="text-xs text-slate-700 font-medium leading-relaxed mt-0.5 block">
                  Əvvəlcədən kart və ya ödəniş tələb olunmur. Məhsulu qapıda kuryerdən təhvil alarkən nağd və ya kartla ödəyə bilərsiniz.
                </span>
              </div>
            </div>

            {/* Sifarişi Tamamla Düyməsi */}
            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full min-h-[58px] sm:min-h-[64px] py-4.5 sm:py-5 px-5 sm:px-6 rounded-2xl bg-[#111827] hover:bg-[#1f2937] active:bg-black text-white font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 sm:gap-3 shadow-xl shadow-slate-900/30 transition-all transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-yellow-400 text-yellow-400 shrink-0" />
              <span className="text-center leading-snug">
                {isSubmitting
                  ? 'SİFARİŞ GÖNDƏRİLİR...'
                  : 'QAPIDA ÖDƏNİŞLƏ SİFARİŞİ TƏSDİQLƏ'}
              </span>
            </button>

            <div className="text-center pt-1">
              <span className="text-xs font-bold text-slate-500">
                🔒 256-Bit SSL Şifrələnmə • 100% Təhlükəsiz Qapıda Sifariş • 14 Gün Zəmanət
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
