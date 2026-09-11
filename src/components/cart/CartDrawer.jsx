'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Check,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CROSS_SELL_PRODUCTS } from '@/data/crossSellProducts';

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    subtotalNumber,
    totalCount,
    isFreeShipping,
    remainingForFreeShipping,
    freeShippingPercentage,
    addCrossSellItem,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);

  // Səbətdə olmayan tövsiyə edilən məhsulları filtrlə
  const unaddedRecommendations = CROSS_SELL_PRODUCTS.filter(
    (cross) =>
      !items.some(
        (item) =>
          (item.handle && cross.handle && item.handle === cross.handle) ||
          (item.title &&
            cross.title &&
            item.title.toLowerCase().includes(cross.title.toLowerCase().slice(0, 7))) ||
          (item.id && cross.id && String(item.id) === String(cross.id))
      )
  );

  // Mobil cihazlarda səbət açılanda arxa səhifənin sürüşməsini (scroll lock) əngəllə
  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ELECTROLIFY10') {
      setPromoApplied(true);
    } else {
      alert('Zəhmət olmasa düzgün promo kod daxil edin (Məsələn: ELECTROLIFY10)');
    }
  };

  const discountAmount = promoApplied ? (subtotalNumber * 0.1).toFixed(2) : 0;
  const finalTotal = promoApplied
    ? (subtotalNumber * 0.9).toFixed(2)
    : subtotal;

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Arxa Fon (Backdrop) - WhatsApp düyməsindən və hər şeydən üstdə (z-[80]) */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] transition-opacity animate-in fade-in duration-200"
      />

      {/* Sürüşən Səbət Paneli (Mobile-First Drawer - z-[85]) */}
      <div
        className="fixed inset-y-0 right-0 w-full sm:max-w-[440px] bg-white border-l border-neutral-200 z-[85] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
      >
            {/* 1. Səbət Başlığı */}
            <div className="p-4 md:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FF5B00]/15 flex items-center justify-center text-[#FF5B00] shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-neutral-900 text-base tracking-tight flex items-center gap-2">
                    Səbətiniz
                    <span className="text-xs font-bold bg-[#FF5B00] text-white px-2 py-0.5 rounded-full">
                      {totalCount}
                    </span>
                  </h3>
                  <span className="text-[10px] text-neutral-500">
                    Qapıda nağd və ya kartla ödəniş
                  </span>
                </div>
              </div>

              <button
                onClick={closeCart}
                aria-label="Səbəti bağla"
                className="min-w-[48px] min-h-[48px] rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors shadow-sm cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 2. Dinamik Pulsuz Çatdırılma Hədəf Zolağı (Yalnız səbətdə məhsul olduqda göstərilir) */}
            {items.length > 0 && (
              <div className="p-4 bg-orange-50/60 border-b border-orange-200">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  {isFreeShipping ? (
                    <span className="text-[#10B981] flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-4 h-4 text-[#10B981]" />
                      🎉 Təbriklər! Pulsuz çatdırılma qazandınız!
                    </span>
                  ) : (
                    <span className="text-neutral-700 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#FF5B00]" />
                      Pulsuz çatdırılmaya yalnız{' '}
                      <strong className="text-[#FF5B00]">
                        {(Number(remainingForFreeShipping) || 0).toFixed(2)} AZN
                      </strong>{' '}
                      qaldı!
                    </span>
                  )}
                  <span className="text-[11px] text-neutral-600 font-mono">
                    {freeShippingPercentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden p-0.5 border border-neutral-300">
                  <div
                    style={{ width: `${freeShippingPercentage}%` }}
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      isFreeShipping
                        ? 'bg-gradient-to-r from-emerald-500 to-[#10B981] glow-green'
                        : 'bg-gradient-to-r from-yellow-500 to-[#FF5B00]'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* 3. Səbət Məzmunu (Scrollable Body) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-base">Səbətiniz boşdur</h4>
                    <p className="text-xs text-neutral-600 mt-1 max-w-xs">
                      Bəyəndiyiniz qadceti seçin və xüsusi günün endirimlərindən faydalanın!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      closeCart();
                      router.push('/#bestsellers');
                    }}
                    className="py-3 px-6 rounded-xl bg-[#FF5B00] text-white font-black text-xs uppercase tracking-wider hover:bg-[#E64D00] transition-colors cursor-pointer flex items-center gap-2 shadow-md shadow-[#FF5B00]/20 active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Digər Məhsullara Bax</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* ƏSAS SƏBƏT MƏHSULLARI (Vizual olaraq kəskin ayrılmış kartlar) */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-700 px-0.5">
                      <span className="flex items-center gap-1.5 text-neutral-900">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#FF5B00]" />
                        Səbətdəki Məhsullar ({totalCount})
                      </span>
                      <span className="text-[10px] text-[#10B981] font-semibold bg-[#10B981]/10 px-2 py-0.5 rounded-full">
                        Qapıda Ödəniş
                      </span>
                    </div>

                    {items.map((item) => {
                      const productHref = `/products/${item.handle || 'electrolify-pro-watch-series-9'}`;
                      return (
                        <div
                          key={item.lineId}
                          className="p-3.5 rounded-2xl bg-neutral-50 border-l-4 border-l-[#FF5B00] border-y border-r border-neutral-200 hover:border-neutral-300 transition-all flex gap-3 items-center shadow-sm relative"
                        >
                          {/* Şəkil (Kliklənən Link) */}
                          <Link
                            href={productHref}
                            onClick={closeCart}
                            className="relative w-16 h-16 rounded-xl bg-white border border-neutral-200 overflow-hidden shrink-0 block group hover:opacity-85 transition-opacity"
                          >
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="64px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>

                          {/* Məlumat */}
                          <div className="flex-1 min-w-0">
                            {/* Başlıq (Kliklənən Link) */}
                            <Link
                              href={productHref}
                              onClick={closeCart}
                              className="block group"
                            >
                              <h4 className="text-xs font-bold text-neutral-900 truncate group-hover:text-[#FF5B00] transition-colors">
                                {item.title}
                              </h4>
                            </Link>

                            {item.variantTitle &&
                              !['standart', 'default title'].includes(item.variantTitle.toLowerCase()) && (
                                <span className="text-[10px] text-neutral-500 block truncate mt-0.5">
                                  {item.variantTitle}
                                </span>
                              )}

                            <div className="flex items-center justify-between mt-2.5">
                              {/* Say Dəyişdirici */}
                              <div className="flex items-center bg-white border border-neutral-200 rounded-xl p-0.5 shadow-sm">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.lineId, item.quantity - 1)
                                  }
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
                                  aria-label="Sayı azalt"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-7 text-center text-xs font-black text-neutral-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.lineId, item.quantity + 1)
                                  }
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
                                  aria-label="Sayı artır"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Qiymət */}
                              <div className="text-right">
                                <span className="text-xs font-black text-[#FF5B00] block">
                                  {(item.price * item.quantity).toFixed(2)} AZN
                                </span>
                                {item.compareAtPrice > item.price && (
                                  <span className="text-[10px] text-neutral-400 line-through">
                                    {(item.compareAtPrice * item.quantity).toFixed(2)} AZN
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Sil Düyməsi */}
                          <button
                            onClick={() => removeFromCart(item.lineId)}
                            aria-label="Məhsulu sil"
                            className="min-w-[36px] min-h-[36px] rounded-xl flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-neutral-100 transition-colors shrink-0 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* 4. Səbət Daxili Tövsiyə Edilən Məhsullar (Balaca formada və kliklənən) */}
                  {unaddedRecommendations.length > 0 && (
                    <div className="mt-5 p-3 rounded-2xl bg-orange-50/50 border border-dashed border-orange-200 shadow-xs">
                      <div className="flex items-center justify-between mb-2 px-0.5">
                        <span className="text-[11px] font-bold text-neutral-900 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-[#FF5B00] fill-[#FF5B00]" />
                          Önərilən Məhsullar
                        </span>
                        <span className="text-[9px] text-[#FF5B00] font-bold bg-[#FF5B00]/10 px-2 py-0.5 rounded-full">
                          Xüsusi Təklif
                        </span>
                      </div>

                      <div className="space-y-2">
                        {unaddedRecommendations.map((cross) => {
                          const crossHref = `/products/${cross.handle || 'clarifypro-qara-noktə-təmizləyici-vakum-cihazi'}`;
                          return (
                            <div
                              key={cross.id}
                              className="p-2 rounded-xl bg-white border border-neutral-200 hover:border-orange-300 flex items-center justify-between gap-2.5 transition-all shadow-xs"
                            >
                              {/* Şəkil və Başlıq (Kliklənən Link - birbaşa məhsul səhifəsinə aparır) */}
                              <Link
                                href={crossHref}
                                onClick={closeCart}
                                className="flex items-center gap-2.5 min-w-0 flex-1 group"
                              >
                                <div className="relative w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200 group-hover:opacity-85 transition-opacity">
                                  <Image
                                    src={cross.image}
                                    alt={cross.title}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h5 className="text-[11px] font-bold text-neutral-800 truncate group-hover:text-[#FF5B00] transition-colors">
                                    {cross.title}
                                  </h5>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-xs font-black text-[#FF5B00]">
                                      {cross.price.toFixed(2)} AZN
                                    </span>
                                    {cross.compareAtPrice > cross.price && (
                                      <span className="text-[10px] text-neutral-400 line-through">
                                        {cross.compareAtPrice.toFixed(2)} AZN
                                      </span>
                                    )}
                                    {cross.discount && (
                                      <span className="text-[9px] font-black text-white bg-[#10B981] px-1 rounded">
                                        {cross.discount}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Link>

                              {/* Səbətə sürətli əlavə et düyməsi */}
                              <button
                                type="button"
                                onClick={() => addCrossSellItem(cross)}
                                className="shrink-0 py-1.5 px-2.5 rounded-lg bg-orange-50 hover:bg-[#FF5B00] hover:text-white text-[#FF5B00] font-bold text-[11px] flex items-center gap-1 border border-orange-200 transition-all active:scale-95 cursor-pointer"
                                title="Səbətə əlavə et"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Əlavə et</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* 5. Alt Bölmə (Hesablama və Qapıda Sifariş CTA - Safe Area Inset) */}
            {items.length > 0 && (
              <div className="p-4 md:p-5 border-t border-neutral-200 bg-neutral-50 space-y-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shrink-0">
                {/* Promo Kod Sahəsi (Mobildə yer qənaəti üçün kliklə açılan kompakt forma) */}
                {!promoApplied && (
                  <div>
                    {showPromoInput ? (
                      <form onSubmit={handleApplyPromo} className="flex gap-2 animate-in fade-in duration-150">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Kupon kodu (ELECTROLIFY10)"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            autoFocus
                            className="w-full bg-white border border-neutral-200 focus:border-[#FF5B00] rounded-xl min-h-[44px] py-2 pl-9 pr-3 text-sm sm:text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none uppercase font-mono shadow-sm"
                          />
                          <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <button
                          type="submit"
                          className="min-h-[44px] py-2 px-3.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800 transition-colors shrink-0 shadow-sm cursor-pointer"
                        >
                          Tətbiq Et
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowPromoInput(true)}
                        className="text-xs text-neutral-600 hover:text-[#FF5B00] flex items-center gap-1.5 transition-colors py-0.5 cursor-pointer"
                      >
                        <Tag className="w-3.5 h-3.5 text-[#FF5B00]" />
                        <span>Promo kodunuz var? Daxil edin</span>
                      </button>
                    )}
                  </div>
                )}

                {promoApplied && (
                  <div className="flex items-center justify-between text-[11px] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-lg">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Check className="w-4 h-4" /> 10% Xüsusi Endirim Tətbiq Edildi
                    </span>
                    <span className="font-mono font-bold">-{discountAmount} AZN</span>
                  </div>
                )}

                {/* Hesab Xülasəsi */}
                <div className="space-y-1 text-xs text-neutral-600 pt-1 border-t border-neutral-200">
                  <div className="flex justify-between">
                    <span>Məhsulların cəmi:</span>
                    <span className="text-neutral-900 font-bold">{subtotal} AZN</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Çatdırılma:</span>
                    {isFreeShipping ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400 line-through font-mono text-[11px]">
                          5.00 AZN
                        </span>
                        <span className="text-[#10B981] font-bold text-xs bg-[#10B981]/10 px-1.5 py-0.5 rounded">
                          Pulsuz
                        </span>
                      </div>
                    ) : (
                      <span className="text-neutral-700 font-bold">5.00 AZN</span>
                    )}
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-neutral-200">
                    <span className="font-bold text-neutral-900 text-sm">Yekun Məbləğ:</span>
                    <span className="font-black text-[#FF5B00] text-xl">
                      {finalTotal} AZN
                    </span>
                  </div>
                </div>

                {/* Sifariş Düyməsi (Min 52px hündürlükdə) */}
                <button
                  onClick={handleCheckout}
                  className="w-full min-h-[52px] py-4 px-6 rounded-2xl bg-[#FF5B00] hover:bg-[#E64D00] text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-[#FF5B00]/25 transition-all transform active:scale-[0.98] glow-orange cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white text-white" />
                  <span>SİFARİŞİ TAMAMLA (Qapıda Ödəniş)</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                {/* Digər Məhsullara Bax Düyməsi */}
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    router.push('/#bestsellers');
                  }}
                  className="w-full min-h-[46px] py-2.5 px-4 rounded-2xl border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-[#FF5B00]" />
                  <span>Digər Məhsullara Bax</span>
                </button>

                <div className="flex items-center justify-center gap-3 text-[10px] text-neutral-500 text-center">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#10B981]" /> 100% Təhlükəsiz
                  </span>
                  <span>•</span>
                  <span>Qapıda Nağd və ya Kartla</span>
                  <span>•</span>
                  <span>14 Gün İadə</span>
                </div>
              </div>
            )}
          </div>
    </>
  );
}
