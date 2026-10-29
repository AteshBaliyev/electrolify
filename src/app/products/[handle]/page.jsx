import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Star,
  ChevronRight,
} from 'lucide-react';
import { getProductByHandle, getProducts, MOCK_PRODUCTS } from '@/lib/shopify';
import ProductGallery from '@/components/product/ProductGallery';
import ProductDescription from '@/components/product/ProductDescription';
import ProductPurchaseClient from '@/components/product/ProductPurchaseClient';
import ProductSocialProof from '@/components/product/ProductSocialProof';
import ProductTrustBadges from '@/components/product/ProductTrustBadges';
import ProductTrustTicker from '@/components/product/ProductTrustTicker';
import ProductReviews from '@/components/product/ProductReviews';
import ProductCrossSell from '@/components/product/ProductCrossSell';
import CustomerSalesBadge from '@/components/product/CustomerSalesBadge';
import ClarifyComparisonSection from '@/components/product/ClarifyComparisonSection';
import LumifyComparisonSection from '@/components/product/LumifyComparisonSection';
import GlowifyComparisonSection from '@/components/product/GlowifyComparisonSection';
import { getProductTheme } from '@/lib/productTheme';

export async function generateMetadata({ params }) {
  const handle = params?.handle || 'electrolify-pro-watch-series-9';
  const product = (await getProductByHandle(handle)) || MOCK_PRODUCTS.find((p) => p.handle === handle);

  if (!product) {
    return {
      title: 'Məhsul Tapılmadı | Trendim',
    };
  }

  const price = product.priceRange?.minVariantPrice?.amount || '0.00';

  return {
    title: `${product.title} - ${price} AZN | Qapıda Ödəniş | Trendim`,
    description: product.description?.slice(0, 160) || '24 saat ərzində sürətli çatdırılma və qapıda nağd/kartla ödəniş.',
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 160),
      images: [
        {
          url: product.images?.edges?.[0]?.node?.url || 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }) {
  const handle = params?.handle || 'electrolify-pro-watch-series-9';

  // Server-side məlumatların çəkilməsi (Sıfır gecikmə və 60 saniyəlik kəşləmə)
  let product = await getProductByHandle(handle);

  if (!product) {
    product = MOCK_PRODUCTS.find((p) => p.handle === handle) || MOCK_PRODUCTS[0];
  }

  // Mağazanın digər real məhsullarını çək (Tövsiyə olunan / Cross-sell üçün)
  const allProducts = await getProducts(20);
  const recommendedStoreProducts = (allProducts || []).filter(
    (p) => String(p.id) !== String(product.id) && p.handle !== product.handle
  );

  // Məhsulun xüsusi rəng və dizayn mövzusu (Məs: Clarify Pro üçün canlı "50% ENDİRİM" magenta rəngi, Glowify üçün Neon Cyan)
  const theme = getProductTheme(product);

  // Clarify Pro vakum cihazı üçün xüsusi Qarşılaşdırma və Əvvəl / Sonra bölməsi
  const isClarifyPro =
    String(handle).toLowerCase().includes('clarify') ||
    String(handle).toLowerCase().includes('vakum') ||
    String(product.handle || '').toLowerCase().includes('clarify') ||
    String(product.title || '').toLowerCase().includes('clarify') ||
    String(product.title || '').toLowerCase().includes('vakum') ||
    String(product.title || '').toLowerCase().includes('qara');

  // Lumify Pro bayram işıqları üçün xüsusi Qarşılaşdırma və Vizual Bölmə
  const isLumifyPro =
    String(handle).toLowerCase().includes('lumify') ||
    String(handle).toLowerCase().includes('bayram') ||
    String(handle).toLowerCase().includes('isiq') ||
    String(handle).toLowerCase().includes('işıq') ||
    String(handle).toLowerCase().includes('proyektor') ||
    String(product.handle || '').toLowerCase().includes('lumify') ||
    String(product.title || '').toLowerCase().includes('lumify') ||
    String(product.title || '').toLowerCase().includes('bayram') ||
    String(product.title || '').toLowerCase().includes('işıq');

  // Glowify Pro nəmləndirici üçün xüsusi Qarşılaşdırma və Vizual Bölmə
  const isGlowifyPro =
    String(handle).toLowerCase().includes('glowify') ||
    String(handle).toLowerCase().includes('nemlendirici') ||
    String(handle).toLowerCase().includes('nəmləndirici') ||
    String(handle).toLowerCase().includes('humidifier') ||
    String(handle).toLowerCase().includes('diffuzor') ||
    String(product.handle || '').toLowerCase().includes('glowify') ||
    String(product.title || '').toLowerCase().includes('glowify') ||
    String(product.title || '').toLowerCase().includes('nəmləndirici') ||
    String(product.title || '').toLowerCase().includes('nemlendirici');

  return (
    <div
      className="bg-[#F8F9FA] text-neutral-900 min-h-screen pb-24 sm:pb-20"
      style={{
        '--product-primary': theme.primary,
        '--product-primary-hover': theme.primaryHover,
        '--product-primary-light': theme.primaryLight,
        '--product-primary-border': theme.primaryBorder,
        '--product-primary-glow': theme.primaryGlow,
        '--product-primary-ring': theme.ring,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb Naviqasiya (SSR) */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6 overflow-x-auto whitespace-nowrap pb-1">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Ana Səhifə
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <Link href="/#bestsellers" className="hover:text-neutral-900 transition-colors">
            Elektronika
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="text-neutral-800 font-semibold truncate max-w-xs">
            {product.title}
          </span>
        </nav>

        {/* Əsas Məhsul Görünüşü */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Sol Sütun: Yalnız Məhsul Şəkilləri / Qalereya */}
          <div className="lg:col-span-6 flex flex-col">
            <ProductGallery
              images={product.images?.edges || []}
              title={product.title}
              theme={theme}
            />
          </div>

          {/* Sağ Sütun: Başlıq -> Qiymət -> Variantlar -> SİFARİŞ DÜYMƏLƏRİ -> Statistika -> Güvən Nişanları */}
          <div className="lg:col-span-6 flex flex-col gap-3 sm:gap-4">
            {/* 1. Başlıq, Ulduzlar və 'Read More' Açıqlama (SSR) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold"
                  style={{
                    color: theme.primary,
                    backgroundColor: theme.primaryLight,
                    borderColor: theme.primaryBorder,
                    borderWidth: 1,
                  }}
                >
                  Orijinal Seçim
                </span>
                <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="font-black text-neutral-900">4.9</span>
                  <span className="text-neutral-500 text-[11px]">(240 təsdiqlənmiş rəy)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Rəyin / Başlığın Altında Real Müştəri Statistikası Nişanı */}
              <CustomerSalesBadge product={product} className="my-1" theme={theme} />

              {/* 'Read More' Açıqlama Sistemi */}
              <ProductDescription description={product.description} theme={theme} />
            </div>

            {/* 2. Dinamik Qiymət, Variantlar, Sifariş Düymələri və Qapıda Sifariş Modalı (İzolyasiya olunmuş Client Component) */}
            <ProductPurchaseClient product={product} theme={theme} />

            {/* 3. Kompakt Statistika (Live Social Proof) */}
            <ProductSocialProof product={product} productId={product.id} theme={theme} />

            {/* 4. Horizontal Güvən Nişanları (Təmiz SSR Server Component) */}
            <ProductTrustBadges theme={theme} />

            {/* 5. Horizontal Ticker - Sayt Haqqında 5 Qısa Məlumat (Arxa fonu qara, yazılar ağ) */}
            <ProductTrustTicker theme={theme} />
          </div>
        </div>

        {/* Clarify Pro üçün Əvvəl / Sonra Şəkilləri və Dəqiq Qarşılaşdırma Bölməsi */}
        {isClarifyPro && (
          <ClarifyComparisonSection product={product} theme={theme} />
        )}

        {/* Lumify Pro üçün Xüsusi Qarşılaşdırma və Vizual Xüsusiyyət Bölməsi */}
        {isLumifyPro && (
          <LumifyComparisonSection product={product} theme={theme} />
        )}

        {/* Glowify Pro üçün Xüsusi Qarşılaşdırma və Vizual Xüsusiyyət Bölməsi */}
        {isGlowifyPro && (
          <GlowifyComparisonSection product={product} theme={theme} />
        )}

        {/* Bununla Birlikdə Tez-tez Alınırlar (Mağazanın digər real məhsullarından ibarət dəst) */}
        <ProductCrossSell
          mainProduct={product}
          currentVariant={product.variants?.edges?.[0]?.node}
          recommendedProducts={recommendedStoreProducts}
          theme={theme}
        />

        {/* Müştəri Rəyləri Bölməsi - Məhsula xüsusi rəylər */}
        <ProductReviews product={product} theme={theme} />
      </div>
    </div>
  );
}
