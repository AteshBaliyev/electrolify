import React from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { getProducts, MOCK_PRODUCTS } from '@/lib/shopify';
import ProductCard from '@/components/home/ProductCard';

export const metadata = {
  title: 'Bütün Məhsullar | Electrolify.com',
  description:
    'Electrolify mağazasının bütün məhsul kataloqu. Dəri qulluğu vakum cihazları, masaj alətləri və ağıllı qadcetlər. 24 saatda sürətli çatdırılma və qapıda ödəniş.',
};

export default async function AllProductsPage() {
  let products = MOCK_PRODUCTS;

  try {
    const fetched = await getProducts(50);
    if (fetched && fetched.length > 0) {
      products = fetched;
    }
  } catch (err) {
    console.warn('[AllProductsPage]: Fallback məhsulları istifadə edildi', err);
  }

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5B00] font-bold bg-orange-50 px-3 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5B00]" />
                Rəsmi Mağaza Kataloqu
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
                Bütün Məhsullar
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 max-w-2xl leading-relaxed">
                Ən çox tələbat görən dəri qulluğu, vakum cihazları və ağıllı qadcetlərin tam siyahısı. Bütün sifarişlərdə qapıda ödəniş və 24 saat ərzində çatdırılma imkanı.
              </p>
            </div>

            {/* Sayğac və Qısa Zəmanət */}
            <div className="flex items-center gap-3 self-start md:self-center shrink-0">
              <div className="px-4 py-2.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
                <span className="block text-xl font-black text-neutral-900 font-mono">
                  {products.length}
                </span>
                <span className="text-[10px] text-neutral-500 font-bold uppercase">
                  Məhsul Mövcuddur
                </span>
              </div>
            </div>
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
              href="/category/masaj"
              className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold whitespace-nowrap transition-colors"
            >
              Masaj & Sağlamlıq
            </Link>
            <Link
              href="/#flashsales"
              className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5B00] font-bold whitespace-nowrap transition-colors flex items-center gap-1 border border-orange-200"
            >
              🔥 Günün Fürsətləri
            </Link>
          </div>
        </div>

        {/* 3. Məhsul Şəbəkəsi (Mobildə 2-li Grid, Desktopda 4-lü Grid) */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
            {products.map((prod, idx) => (
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
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF5B00] flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Hazırda məhsul tapılmadı</h3>
            <p className="text-xs text-neutral-500 mt-1">Zəhmət olmasa bir az sonra yenidən yoxlayın.</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center justify-center py-2.5 px-6 rounded-xl bg-[#FF5B00] hover:bg-[#E64D00] text-white font-black text-xs uppercase tracking-wider transition-colors"
            >
              Ana Səhifəyə Qayıt
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
