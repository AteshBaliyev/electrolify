'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap,
  ShoppingBag,
  ArrowRight,
  Check,
  Truck,
  Plus,
  Minus,
  X,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import StickyAddToCart from '@/components/product/StickyAddToCart';

export default function ProductPurchaseClient({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const variants = product.variants?.edges?.map((e) => e.node) || [];
  const hasMultipleRealVariants =
    variants.length > 1 &&
    !variants.every((v) =>
      ['default title', 'standart', 'standard'].includes((v.title || '').trim().toLowerCase())
    );
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const currentPrice =
    selectedVariant?.price?.amount || product.priceRange?.minVariantPrice?.amount || '0.00';
  const comparePrice =
    selectedVariant?.compareAtPrice?.amount ||
    product.compareAtPriceRange?.minVariantPrice?.amount;
  const discountPercent =
    comparePrice && Number(comparePrice) > Number(currentPrice)
      ? Math.round(((Number(comparePrice) - Number(currentPrice)) / Number(comparePrice)) * 100)
      : null;

  const handleOrderNow = (e) => {
    e?.preventDefault?.();
    addToCart(product, selectedVariant, quantity, true);
  };

  return (
    <>
      {/* Sürüşmədən asılı olmayaraq dərhal görünən sabit alt sifariş zolağı */}
      <StickyAddToCart
        product={product}
        selectedVariant={selectedVariant}
        onOrderClick={() => {
          addToCart(product, selectedVariant, quantity, true);
        }}
      />

      {/* Dinamik Qiymət Bloku */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span
            className="text-3xl sm:text-4xl font-black text-[#FF5B00] tracking-tight"
            style={{
              WebkitTextStroke: '0.8px #000000',
              paintOrder: 'stroke fill',
            }}
          >
            {(Number(currentPrice) * quantity).toFixed(2)} AZN
          </span>
          {comparePrice && (
            <span className="text-base sm:text-lg text-neutral-400 line-through font-semibold">
              {(Number(comparePrice) * quantity).toFixed(2)} AZN
            </span>
          )}
          {quantity > 1 && (
            <span className="text-xs text-neutral-500 font-bold">
              ({Number(currentPrice).toFixed(2)} AZN / ədəd)
            </span>
          )}
        </div>
        {discountPercent && discountPercent > 0 && (
          <span className="text-xs font-black text-white bg-[#10B981] px-2.5 py-1 rounded-lg uppercase tracking-wider shrink-0 shadow-xs">
            -{discountPercent}% ENDİRİM
          </span>
        )}
      </div>

      {/* Yığcam Variant Seçimi (Yalnız fərqli real variantlar olduqda göstərilir) */}
      {hasMultipleRealVariants && (
        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-700">
              Variant: <span className="text-[#FF5B00] font-black">{selectedVariant?.title}</span>
            </span>
            <span className="text-[#10B981] font-semibold text-[11px] flex items-center gap-1">
              <Check className="w-3 h-3" /> Stokda var
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF5B00] text-white border-[#FF5B00] shadow-sm font-black'
                      : 'bg-neutral-100 text-neutral-800 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-200/60'
                  }`}
                >
                  <span>{v.title}</span>
                  {v.price?.amount && (
                    <span
                      className={`text-[11px] font-mono ${
                        isSelected ? 'text-white/90 font-bold' : 'text-neutral-500'
                      }`}
                    >
                      {v.price.amount} AZN
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 1 və 2 Məhsul Paketi Seçimi (2 məhsul alanda Pulsuz Karqo) */}
      <div className="flex flex-col gap-2 p-3 sm:p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between text-xs mb-0.5">
          <span className="font-bold text-neutral-800">
            Sayı Seçin:
          </span>
          {quantity >= 2 ? (
            <span className="text-[#10B981] font-bold text-xs flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#10B981]" /> Pulsuz Karqo Aktivdir!
            </span>
          ) : (
            <span className="text-neutral-500 text-[11px]">
              2 ədəd alanda <strong className="text-[#FF5B00]">Pulsuz Karqo</strong>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* 1 Ədəd */}
          <button
            type="button"
            onClick={() => setQuantity(1)}
            className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
              quantity === 1
                ? 'border-[#FF5B00] bg-orange-50/50 ring-2 ring-[#FF5B00]/20 shadow-sm'
                : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-xs sm:text-sm text-neutral-900">
                1 Ədəd
              </span>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  quantity === 1
                    ? 'border-[#FF5B00] bg-[#FF5B00] text-white'
                    : 'border-neutral-300'
                }`}
              >
                {quantity === 1 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <span className="text-[11px] text-neutral-500 mt-0.5">Tək Sifariş</span>
            <span className="text-xs sm:text-sm font-black text-neutral-900 mt-2">
              {Number(currentPrice).toFixed(2)} AZN
            </span>
          </button>

          {/* 2 Ədəd (Pulsuz Karqo ilə) */}
          <button
            type="button"
            onClick={() => setQuantity(2)}
            className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
              quantity === 2
                ? 'border-[#FF5B00] bg-orange-50/50 ring-2 ring-[#FF5B00]/20 shadow-sm'
                : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            {/* Pulsuz Karqo Nişanı */}
            <span className="absolute -top-2.5 right-2 bg-gradient-to-r from-emerald-600 to-[#10B981] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm tracking-wide">
              🚚 Pulsuz Karqo
            </span>

            <div className="flex items-center justify-between">
              <span className="font-black text-xs sm:text-sm text-neutral-900">
                2 Ədəd
              </span>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  quantity === 2
                    ? 'border-[#FF5B00] bg-[#FF5B00] text-white'
                    : 'border-neutral-300'
                }`}
              >
                {quantity === 2 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold mt-0.5">Çatdırılma Pulsuz</span>
            <span
              className="text-xs sm:text-sm font-black text-[#FF5B00] mt-2"
              style={{
                WebkitTextStroke: '0.4px #000000',
                paintOrder: 'stroke fill',
              }}
            >
              {(Number(currentPrice) * 2).toFixed(2)} AZN
            </span>
          </button>
        </div>
      </div>

      {/* SİFARİŞ DÜYMƏSİ (Say seçici və Böyük Əsas Düymə) */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-white border border-neutral-200 shadow-sm rounded-2xl p-1 shrink-0 h-[52px]">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
            aria-label="Sayı azalt"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-sm font-black text-neutral-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
            aria-label="Sayı artır"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          id="main-order-button"
          onClick={handleOrderNow}
          className="flex-1 min-h-[52px] py-3.5 px-4 rounded-2xl bg-[#FF5B00] hover:bg-[#E64D00] text-white font-black text-sm sm:text-base tracking-wide uppercase flex items-center justify-center gap-2 shadow-xl shadow-[#FF5B00]/30 transition-all active:scale-[0.98] glow-orange cursor-pointer"
        >
          <Zap className="w-5 h-5 fill-white text-white shrink-0" />
          <span>İNDİ SİFARİŞ VER</span>
          <ArrowRight className="w-4 h-4 shrink-0 text-white" />
        </button>
      </div>

      {/* Sürətli Qapıda Sifariş Təsdiq Modalı (Saf CSS ilə) */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative text-neutral-900">
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-center text-neutral-900">
              Sifarişiniz Qəbul Edildi!
            </h3>
            <p className="text-xs text-neutral-600 text-center mt-1 leading-relaxed">
              Təbrik edirik! Operatorumuz 5 dəqiqə ərzində sizinlə əlaqə saxlayaraq çatdırılma ünvanını təsdiqləyəcək.
            </p>

            <div className="my-5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
              <div className="flex justify-between text-neutral-600 mb-1">
                <span>Məhsul:</span>
                <strong className="text-neutral-900 truncate max-w-[200px]">{product.title}</strong>
              </div>
              <div className="flex justify-between text-neutral-600 mb-1">
                <span>Variant:</span>
                <strong className="text-neutral-900">{selectedVariant?.title}</strong>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Məbləğ (Qapıda):</span>
                <strong className="text-[#FF5B00] font-black text-sm">
                  {parseInt(currentPrice) * quantity} AZN
                </strong>
              </div>
            </div>

            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-3.5 rounded-xl bg-[#FF5B00] hover:bg-[#E64D00] text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Alış-verişə Davam Et
            </button>
          </div>
        </div>
      )}
    </>
  );
}
