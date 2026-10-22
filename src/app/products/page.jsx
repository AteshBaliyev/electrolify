import React from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { getProducts, MOCK_PRODUCTS } from '@/lib/shopify';
import { searchStoreProducts } from '@/lib/searchHelper';
import ProductCard from '@/components/home/ProductCard';

export const metadata = {
  title: 'Bütün Məhsullar | Trendim — Seçilmiş Trend Məhsullar',
  description:
    'Trendim mağazasının bütün məhsul kataloqu. Dəri qulluğu vakum cihazları, masaj alətləri və ağıllı qadcetlər. 24 saatda sürətli çatdırılma və qapıda ödəniş.',
};

export default async function AllProductsPage({ searchParams }) {
  const query = (searchParams?.q || searchParams?.search || '').trim();
  let products = MOCK_PRODUCTS;

  try {
    const fetched = await getProducts(50);
    if (fetched && fetched.length > 0) {
      products = fetched;
    }
  } catch (err) {
    console.warn('[AllProductsPage]: Fallback məhsulları istifadə edildi', err);
  }

  const displayProducts = query ? searchStoreProducts(query, products) : products;

  return (
    <div className="bg-[#F8F9FA] text-neutral-900 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* 1. Breadcrumb Naviqasiya (SSR) */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6 overflow-x-auto whitespace-nowrap pb-1">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Ana Səhifə
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="text-neutral-900 font-bold">Bütün Məhsullar</span>
        </nav>

        {/* 2. Kataloq Başlığı və Təsvir */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-xs">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              Bütün Məhsullar
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 max-w-2xl leading-relaxed">
              Ən çox tələbat görən dəri qulluğu, vakum cihazları və ağıllı qadcetlərin tam siyahısı. Bütün sifarişlərdə qapıda ödəniş və 24 saat ərzində çatdırılma imkanı.
            </p>
          </div>

          {/* Sürətli Filter Pill-ləri */}
          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <Link
              href="/products"
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold whitespace-nowrap shadow-xs"
            >
              Hamısı ({products.length})
            </Link>
            <Link
              href="/category/deri-qullugu"
              className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold whitespace-nowrap transition-colors"
            >
              Dəri Qulluğu & Vakum
            </Link>
            <Link
              href="/category/bayram"
              className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold whitespace-nowrap transition-colors"
            >
              🎄 Bayram & İşıqlar
            </Link>
            <Link
              href="/category/masaj"
              className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold whitespace-nowrap transition-colors"
            >
              Masaj & Sağlamlıq
            </Link>
            <Link
              href="/#flashsales"
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold whitespace-nowrap transition-colors flex items-center gap-1 border border-rose-200"
            >
              🔥 Günün Fürsətləri
            </Link>
          </div>

          {/* Əgər Axtarış Edilibsə: Axtarış Bildirişi */}
          {query && (
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900">
                  Axtarış sorğusu: <span className="text-[#111827]">"{query}"</span>
                </span>
                <span className="text-neutral-500">
                  ({displayProducts.length} məhsul tapıldı)
                </span>
              </div>
              <Link
                href="/products"
                className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 font-bold hover:bg-neutral-50 transition-colors self-start sm:self-auto text-center"
              >
                Filtri Təmizlə ✕
              </Link>
            </div>
          )}
        </div>

        {/* 3. Məhsul Şəbəkəsi (Mobildə 2-li Grid, Desktopda 4-lü Grid) */}
        {displayProducts && displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
            {displayProducts.map((prod, idx) => (
              <ProductCard
                key={prod.id}
                product={prod}
                badge={idx === 0 ? 'Top 1' : idx === 1 ? 'Populyar' : null}
                discount={idx % 2 === 0 ? '-44%' : '-40%'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-[#111827] flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              {query ? `"${query}" üzrə heç bir məhsul tapılmadı` : 'Hazırda məhsul tapılmadı'}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              {query
                ? 'Fərqli sözlərlə (məsələn: Clarify, İstiƏl, Lumify) axtarmağı yoxlayın.'
                : 'Zəhmət olmasa bir az sonra yenidən yoxlayın.'}
            </p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center justify-center py-2.5 px-6 rounded-xl bg-[#111827] hover:bg-[#1f2937] text-white font-black text-xs uppercase tracking-wider transition-colors"
            >
              Bütün Məhsulları Göstər
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
