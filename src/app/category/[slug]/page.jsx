import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { getProductsByCategory } from '@/lib/shopify';
import ProductCard from '@/components/home/ProductCard';

const CATEGORY_NAMES = {
  'deri-qullugu': 'Dəri Qulluğu & Vakum Cihazları',
  'masaj': 'Masaj & Sağlamlıq Cihazları',
  'vakum': 'Qara Nöqtə Vakum Cihazları',
  'saglamliq': 'Masaj & Sağlamlıq',
  'smart-saatlar': 'Bütün Məhsullar',
  'qulaqliqlar': 'Bütün Məhsullar',
  'sarj-cihazlari': 'Bütün Məhsullar',
  'powerbank': 'Bütün Məhsullar',
};

export async function generateMetadata({ params }) {
  const slug = params?.slug || '';
  const title = CATEGORY_NAMES[slug] || 'Elektronika Məhsulları';

  return {
    title: `${title} | Ən Sərfəli Qiymətlər | Electrolify.com`,
    description: `${title} kateqoriyasında ən populyar modellər, 24 saatda sürətli çatdırılma və qapıda nağd/kartla ödəniş.`,
  };
}

export default async function CategoryPage({ params }) {
  const slug = params?.slug || '';
  const categoryTitle = CATEGORY_NAMES[slug] || 'Bütün Məhsullar';

  // Server-side kəşlənmiş sorğu (revalidate: 60)
  const products = await getProductsByCategory(slug, 20);

  return (
    <div className="bg-[#F8F9FA] text-neutral-900 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb (SSR) */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6 overflow-x-auto whitespace-nowrap pb-1">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Ana Səhifə
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="text-neutral-800 font-medium">{categoryTitle}</span>
        </nav>

        {/* Kateqoriya Başlığı */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF5B00] font-bold">
              Kateqoriya
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight mt-1">
              {categoryTitle}
            </h1>
            <p className="text-xs text-neutral-600 mt-1">
              {products.length} məhsul tapıldı • Orijinallıq Zəmanəti • Qapıda Ödəniş
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Səhifəyə Qayıt</span>
          </Link>
        </div>

        {/* Məhsul Şəbəkəsi (Mobildə yan-yana 2-li, planşetdə 2/3, böyük ekranda 4-lü) */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
            {products.map((prod, idx) => (
              <ProductCard
                key={prod.id}
                product={prod}
                badge={idx === 0 ? 'Top 1' : null}
                discount={idx % 2 === 0 ? '-44%' : '-40%'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm">
            <p className="text-neutral-600 text-sm">Bu kateqoriyada hazırda məhsul tapılmadı.</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center justify-center py-2.5 px-6 rounded-xl bg-[#FF5B00] hover:bg-[#E64D00] text-white font-black text-xs uppercase tracking-wider transition-colors"
            >
              Ana Səhifəyə Keç
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
