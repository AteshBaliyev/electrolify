import React from 'react';
import HeroSlider from '@/components/home/HeroSlider';
import CategoryCircles from '@/components/home/CategoryCircles';
import FlashSales from '@/components/home/FlashSales';
import BestsellersGrid from '@/components/home/BestsellersGrid';
import HomeComparison from '@/components/home/HomeComparison';
import { getProducts, MOCK_PRODUCTS } from '@/lib/shopify';

export const metadata = {
  title: 'Electrolify.com | Premium Elektronika və Ağıllı Qadcetlər',
  description: 'Günün meqa endirimləri, qapıda nağd və ya kartla ödəniş, 24 saatda sürətli çatdırılma.',
};

export default async function HomePage() {
  // Server-side məlumatların çəkilməsi (SSR - Sıfır gecikmə və yüksək LCP üçün)
  let products = MOCK_PRODUCTS;
  try {
    const fetched = await getProducts(20);
    if (fetched && fetched.length > 0) {
      products = fetched;
    }
  } catch (err) {
    console.warn('[HomePage Server Component]: Fallback məhsulları istifadə edildi');
  }

  return (
    <div className="bg-[#F8F9FA] text-neutral-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 pt-3 sm:pt-4 pb-12 w-full space-y-6 sm:space-y-8">
        {/* 1. Ən Üstdə Slider (Hero Banner) - Kampaniyalar və Endirimlər üçün */}
        <HeroSlider products={products} />

        {/* 2. Dairəvi İkonlarla 'Kateqoriyalar' */}
        <CategoryCircles />

        {/* 3. 'Günün Fürsətləri' (Flash Sales) Bloku - Mobildə 2-li Grid */}
        <FlashSales products={products} />

        {/* 4. 'Çox Satanlar' Grid-i - Mobildə 2-li Grid */}
        <BestsellersGrid products={products} />

        {/* 5. Sayt Üzrə Qarşılaşdırma Cədvəli və Elektrolify Xüsusi Endirim Bloku */}
        <HomeComparison />
      </div>
    </div>
  );
}
