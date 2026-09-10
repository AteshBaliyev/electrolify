'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap,
  ShoppingBag,
  ArrowRight,
  Check,
  MessageCircle,
  PhoneCall,
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
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const currentPrice =
    selectedVariant?.price?.amount || product.priceRange?.minVariantPrice?.amount || '0.00';
  const comparePrice =
    selectedVariant?.compareAtPrice?.amount ||
    product.compareAtPriceRange?.minVariantPrice?.amount;

  const handleOrderNow = (e) => {
    e?.preventDefault?.();
    addToCart(product, selectedVariant, quantity, false);
    router.push('/checkout');
  };

  const handleAddToCart = (e) => {
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
          addToCart(product, selectedVariant, quantity, false);
          router.push('/checkout');
        }}
      />

      {/* Dinamik Qiymət Bloku */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0D0D0D] border border-[#222222] flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="text-3xl sm:text-4xl font-black text-[#FF5B00] tracking-tight">
            {currentPrice} AZN
          </span>
          {comparePrice && (
            <span className="text-base sm:text-lg text-neutral-500 line-through font-semibold">
              {comparePrice} AZN
            </span>
          )}
        </div>
        {comparePrice && (
          <span className="text-xs font-black text-black bg-[#10B981] px-2.5 py-1 rounded-lg uppercase tracking-wider shrink-0">
            QƏNAƏT: {Math.max(0, parseInt(comparePrice) - parseInt(currentPrice))} AZN
          </span>
        )}
      </div>

      {/* Yığcam Variant Seçimi (Pill Design - Yan-yana kompakt düymələr) */}
      {variants.length > 0 && (
        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#0C0C0C] border border-[#1E1E1E]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-300">
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
                      ? 'bg-[#FF5B00] text-white border-[#FF5B00] shadow-md shadow-[#FF5B00]/25 font-black'
                      : 'bg-[#141414] text-neutral-200 border-[#262626] hover:border-[#444444]'
                  }`}
                >
                  <span>{v.title}</span>
                  {v.price?.amount && (
                    <span
                      className={`text-[11px] font-mono ${
                        isSelected ? 'text-white/90 font-bold' : 'text-neutral-400'
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

      {/* SİFARİŞ DÜYMƏLƏRİ (Mobil prioriteti - Ekranda dərhal görünən böyük CTA) */}
      <div className="flex flex-col gap-2.5">
        {/* Say seçici və Əsas COD Sifariş Düyməsi */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#121212] border border-[#242424] rounded-2xl p-1 shrink-0 h-[52px]">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] text-white flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
              aria-label="Sayı azalt"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-black text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] text-white flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
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
            <span className="truncate">İNDİ SİFARİŞ ET</span>
            <ArrowRight className="w-4 h-4 shrink-0 text-white" />
          </button>
        </div>

        {/* İkinci dərəcəli: Səbətə At və WhatsApp ilə Əlaqə */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            className="min-h-[46px] py-2.5 px-3 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#2E2E2E] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-98 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#FF5B00] shrink-0" />
            <span className="truncate">Səbətə At</span>
          </button>

          <a
            href={`https://wa.me/994556422545?text=Salam,%20"${encodeURIComponent(
              product.title
            )}"%20(Variant:%20${encodeURIComponent(
              selectedVariant?.title || ''
            )})%20sifari%C5%9F%20etm%C9%99k%20ist%C9%99yir%C9%99m.`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[46px] py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-black shrink-0" />
            <span className="truncate">WhatsApp</span>
          </a>
        </div>

        {/* Mikro güvən xətti */}
        <div className="py-1.5 px-3 rounded-xl bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-between text-[11px] text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#10B981]" /> Qeydiyyatsız Qapıda Ödəniş
          </span>
          <span className="flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-[#FF5B00]" /> 5 dəqiqəyə zəng
          </span>
        </div>
      </div>

      {/* Sürətli Qapıda Sifariş Təsdiq Modalı (Saf CSS ilə) */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0F0F0F] border border-[#262626] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-center text-white">
              Sifarişiniz Qəbul Edildi!
            </h3>
            <p className="text-xs text-neutral-400 text-center mt-1 leading-relaxed">
              Təbrik edirik! Operatorumuz 5 dəqiqə ərzində sizinlə əlaqə saxlayaraq çatdırılma ünvanını təsdiqləyəcək.
            </p>

            <div className="my-5 p-3.5 rounded-2xl bg-[#141414] border border-[#222222] text-xs">
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Məhsul:</span>
                <strong className="text-white truncate max-w-[200px]">{product.title}</strong>
              </div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Variant:</span>
                <strong className="text-white">{selectedVariant?.title}</strong>
              </div>
              <div className="flex justify-between text-neutral-400">
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
