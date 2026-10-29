/**
 * Electrolify.com - Headless Shopify Storefront API Müştərisi
 * Shopify Storefront GraphQL API ilə əlaqə qurur və məhsul/səbət əməliyyatlarını idarə edir.
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN || '';
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-04';

// Real API konfiqurasiyasının olub-olmadığını yoxlayır
export const isShopifyConfigured = () => {
  return (
    Boolean(domain) &&
    Boolean(storefrontAccessToken) &&
    !domain.includes('your-store-name') &&
    !storefrontAccessToken.includes('your_storefront_access_token')
  );
};

/**
 * Təməl Shopify GraphQL Sorğu İcraçısı
 */
export async function shopifyFetch({ query, variables = {}, cache = 'force-cache', tags = [] }) {
  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  if (!isShopifyConfigured()) {
    console.warn(
      '[Electrolify Shopify API]: Real Shopify API parametrləri təyin edilməyib. Mock/Fallback rejimində işləyir.'
    );
    return { data: null, error: 'SHOPIFY_NOT_CONFIGURED' };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      next: { tags, revalidate: cache === 'no-store' ? 0 : 60 },
    });

    const json = await response.json();

    if (json.errors) {
      console.error('[Shopify GraphQL Xətası]:', json.errors);
      throw new Error(json.errors[0]?.message || 'Shopify GraphQL sorğusu xəta ilə nəticələndi');
    }

    return { data: json.data, error: null };
  } catch (error) {
    console.error('[Shopify Fetch Xətası]:', error);
    return { data: null, error: error.message };
  }
}

// -------------------------------------------------------------
// GraphQL Sorğuları (Queries)
// -------------------------------------------------------------

export const PRODUCTS_QUERY = /* GraphQL */ `
  query GetProducts($first: Int = 20) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const CREATE_CART_MUTATION = /* GraphQL */ `
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 20) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// -------------------------------------------------------------
// Köməkçi API Funksiyaları (Helpers)
// -------------------------------------------------------------

/**
 * Shopify REST/JSON məhsulunu Headless GraphQL formatına çevirir
 */
export function transformShopifyJsonProduct(p) {
  const minPrice = p.variants?.[0]?.price || '0';
  const maxPrice = p.variants?.[p.variants.length - 1]?.price || minPrice;
  const comparePrice = p.variants?.[0]?.compare_at_price || null;

  return {
    id: String(p.id),
    title: p.title,
    handle: p.handle,
    description: p.body_html ? p.body_html.replace(/<[^>]*>?/gm, '').trim() : '',
    descriptionHtml: p.body_html || '',
    availableForSale: p.variants ? p.variants.some((v) => v.available !== false) : true,
    priceRange: {
      minVariantPrice: { amount: String(minPrice), currencyCode: 'AZN' },
      maxVariantPrice: { amount: String(maxPrice), currencyCode: 'AZN' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: String(comparePrice || minPrice), currencyCode: 'AZN' },
    },
    images: {
      edges: (p.images && p.images.length > 0
        ? p.images
        : [{ src: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80' }]
      ).map((img) => ({
        node: {
          url: typeof img === 'string' ? img : img.src,
          altText: (typeof img === 'object' && img.alt) || p.title,
          width: (typeof img === 'object' && img.width) || 800,
          height: (typeof img === 'object' && img.height) || 800,
        },
      })),
    },
    variants: {
      edges: (p.variants || []).map((v) => ({
        node: {
          id: String(v.id),
          title: v.title === 'Default Title' ? 'Standart' : v.title,
          availableForSale: v.available !== false,
          price: { amount: String(v.price), currencyCode: 'AZN' },
          compareAtPrice: v.compare_at_price
            ? { amount: String(v.compare_at_price), currencyCode: 'AZN' }
            : null,
        },
      })),
    },
  };
}

/**
 * Shopify mağazasından canlı məhsulları (products.json) çəkir
 */
export async function fetchLiveShopifyProducts() {
  try {
    const rawStoreDomain =
      process.env.SHOPIFY_STORE_DOMAIN || 'zi73g2-zx.myshopify.com';
    const cleanDomain = rawStoreDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const res = await fetch(`https://${cleanDomain}/products.json?limit=250`, {
      next: { revalidate: 60, tags: ['products'] },
      headers: { 'User-Agent': 'Trendim-NextJS/1.0' },
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.products && Array.isArray(data.products) && data.products.length > 0) {
      return data.products.map(transformShopifyJsonProduct);
    }
    return null;
  } catch (err) {
    console.warn('[Live Shopify Fetch Error]:', err.message);
    return null;
  }
}

/**
 * Mağazadakı məhsulları əldə edir (MOCK və canlı Shopify məlumatlarını birləşdirərək heç bir məhsulun itməməsini təmin edir)
 */
export async function getProducts(first = 20) {
  if (isShopifyConfigured()) {
    const { data, error } = await shopifyFetch({
      query: PRODUCTS_QUERY,
      variables: { first },
    });
    if (!error && data?.products?.edges && data.products.edges.length > 0) {
      return data.products.edges.map((edge) => edge.node);
    }
  }

  // Shopify mağazasından canlı məhsulları çək
  const live = await fetchLiveShopifyProducts();
  const liveList = Array.isArray(live) ? live : [];

  // MOCK_PRODUCTS ilə başlayırıq (bütün 4 məhsul: Glowify Pro, Lumify Pro, Clarify Pro, İstiƏl)
  const result = [...MOCK_PRODUCTS];

  // Əgər live-da hər hansı məhsul varsa, qiymət və id-ni canlı Shopify məlumatları ilə yenilə
  for (const liveProd of liveList) {
    const existingIndex = result.findIndex((p) => {
      const pHandle = (p.handle || '').toLowerCase();
      const lHandle = (liveProd.handle || '').toLowerCase();
      const pTitle = (p.title || '').toLowerCase();
      const lTitle = (liveProd.title || '').toLowerCase();
      return (
        String(p.id) === String(liveProd.id) ||
        pHandle === lHandle ||
        (pHandle.includes('glowify') && (lHandle.includes('glowify') || lTitle.includes('glowify'))) ||
        (pHandle.includes('clarify') && (lHandle.includes('clarify') || lTitle.includes('clarify'))) ||
        (pHandle.includes('lumify') && (lHandle.includes('lumify') || lTitle.includes('lumify'))) ||
        (pHandle.includes('isti') && (lHandle.includes('isti') || lTitle.includes('masaj')))
      );
    });

    if (existingIndex >= 0) {
      result[existingIndex] = {
        ...result[existingIndex],
        id: String(liveProd.id || result[existingIndex].id),
        availableForSale: liveProd.availableForSale,
        priceRange: liveProd.priceRange || result[existingIndex].priceRange,
        compareAtPriceRange: liveProd.compareAtPriceRange || result[existingIndex].compareAtPriceRange,
      };
    } else {
      result.push(liveProd);
    }
  }

  return result.slice(0, first);
}

/**
 * Handle əsasında tək məhsul məlumatını əldə edir
 */
export async function getProductByHandle(handle) {
  const decodedHandle = decodeURIComponent(handle || '').toLowerCase().trim();

  if (isShopifyConfigured()) {
    const { data, error } = await shopifyFetch({
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle: decodedHandle },
    });
    if (!error && data?.product) {
      return data.product;
    }
  }

  // Bütün birləşdirilmiş məhsullar arasından axtar (həm live, həm mock)
  const productList = await getProducts(50);

  const match = productList.find((p) => {
    const pHandle = decodeURIComponent(p.handle || '').toLowerCase();
    const pTitle = (p.title || '').toLowerCase();
    return (
      pHandle === decodedHandle ||
      String(p.id) === String(handle) ||
      (decodedHandle.includes('glowify') && (pHandle.includes('glowify') || pTitle.includes('glowify'))) ||
      ((decodedHandle.includes('nemlendirici') || decodedHandle.includes('nəmləndirici') || decodedHandle.includes('humidifier') || decodedHandle.includes('hava') || decodedHandle.includes('diffuzor')) &&
        (pHandle.includes('glowify') || pTitle.includes('glowify') || pTitle.includes('nəmləndirici'))) ||
      (decodedHandle.includes('clarify') && (pHandle.includes('clarify') || pTitle.includes('clarify'))) ||
      (decodedHandle.includes('lumify') && (pHandle.includes('lumify') || pTitle.includes('lumify'))) ||
      ((decodedHandle.includes('bayram') || decodedHandle.includes('isiq') || decodedHandle.includes('işıq')) &&
        (pHandle.includes('lumify') || pTitle.includes('lumify') || pHandle.includes('bayram'))) ||
      ((decodedHandle.includes('isti') || decodedHandle.includes('masaj')) &&
        (pHandle.includes('isti') || pHandle.includes('masaj') || pTitle.includes('masaj')))
    );
  });

  return match || productList[0];
}

/**
  * Kateqoriyaya görə məhsulları əldə edir (Server kəşləməsi ilə)
  */
export async function getProductsByCategory(categorySlug, first = 20) {
  const allProducts = await getProducts(first);
  if (!categorySlug) return allProducts;

  const slug = categorySlug.toLowerCase();
  const filtered = allProducts.filter((p) => {
    const handle = (p.handle || '').toLowerCase();
    const title = (p.title || '').toLowerCase();
    if (slug.includes('masaj') || slug.includes('saglamliq')) {
      return handle.includes('masaj') || handle.includes('isti') || title.includes('masaj');
    }
    if (slug.includes('deri') || slug.includes('vakum') || slug.includes('qulluq')) {
      return handle.includes('clarify') || handle.includes('vakum') || title.includes('vakum') || title.includes('qara');
    }
    if (slug.includes('bayram') || slug.includes('isiq') || slug.includes('işıq') || slug.includes('dekor')) {
      return handle.includes('lumify') || handle.includes('bayram') || handle.includes('isiq') || title.includes('lumify');
    }
    if (slug.includes('hava') || slug.includes('nemlendirici') || slug.includes('nəmləndirici') || slug.includes('atmosfer') || slug.includes('ev')) {
      return handle.includes('glowify') || handle.includes('nemlendirici') || handle.includes('nəmləndirici') || title.includes('glowify');
    }
    return true;
  });

  return filtered.length > 0 ? filtered : allProducts;
}

/**
 * Yeni səbət yaradır və Shopify Checkout linki qaytarır
 */
export async function createCart(lines = []) {
  const { data, error } = await shopifyFetch({
    query: CREATE_CART_MUTATION,
    variables: { lines },
    cache: 'no-store',
  });

  if (error) throw new Error(error);
  return data?.cartCreate?.cart;
}

// -------------------------------------------------------------
// Real Shopify Mağazası Məlumatları (Yalnız Admin Paneldə olan məhsullar)
// -------------------------------------------------------------
export const MOCK_PRODUCTS = [
  {
    id: '10264817926400',
    title: 'Glowify Pro™ – Rəngarəng Atmosfer və Ağıllı Hava Nəmləndirici',
    handle: 'glowify-pro™-rəngarəng-atmosfer-və-agilli-hava-nəmləndirici',
    description:
      'Evinizdə və ofisinizdə quru havadan xilas olun, eyni zamanda vizual zövq yaşayın! 6 güclü sprey buxar çıxışı, musiqi və səsə reaksiya verən dinamik RGB ritmik işıq şousu, 900ml böyük su çəni və Type-C şarjlı naqilsiz dizayn. Suya sevdiyiniz efir yağlarını damladaraq aromaterapiya təcrübəsi əldə edin. Ultra-səssiz ultrasəs işləmə rejimi ilə yuxunuzu pozmaz.',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '28.99', currencyCode: 'AZN' },
      maxVariantPrice: { amount: '28.99', currencyCode: 'AZN' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '46.99', currencyCode: 'AZN' },
    },
    images: {
      edges: [
        {
          node: {
            url: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/R_ngar_ngBuxarEffektliDiffuzor.png?v=1793287963',
            altText: 'Glowify Pro™ Rəngarəng Buxar Effektli Diffuzor',
          },
        },
        {
          node: {
            url: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/S_ssizN_ml_ndirm_RahatMuhit.png?v=1793287964',
            altText: 'Glowify Pro™ Səssiz Nəmləndirmə və Rahat Mühit',
          },
        },
        {
          node: {
            url: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/GLOWIFY_PRO___R_ngar_ng_N_ml_ndirici.png?v=1793287977',
            altText: 'Glowify Pro™ Rəngarəng Nəmləndirici və Ritmik RGB',
          },
        },
        {
          node: {
            url: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/R_ngliAtmosfer_GLOWIFYPRO.png?v=1793287963',
            altText: 'Glowify Pro™ Rəngli Atmosfer və Aromaterapiya',
          },
        },
        {
          node: {
            url: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/GLOWIFYPROTamD_stHumidifikator.png?v=1793287963',
            altText: 'Glowify Pro™ Tam Dəst Humidifikator və Type-C Kabel',
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: '50832151445760',
            title: 'Standart',
            availableForSale: true,
            price: { amount: '28.99', currencyCode: 'AZN' },
            compareAtPrice: { amount: '46.99', currencyCode: 'AZN' },
          },
        },
      ],
    },
  },
  {
    id: '10234502316288',
    title: 'Lumify Pro – Sehrli Bayram İşıqları! 🎄',
    handle: 'lumify-pro-sehrli-bayram-i̇siqlari-🎄',
    description:
      'Evinizdə bayram ab-havasını bir düymə ilə yaradın! 16 fərqli canlı işıq naxışı (qar dənələri, Şaxta baba, maral və bayram fiqurları), 270° tənzimlənən fırlanan bucaq və USB ilə rahat enerji təchizatı. Yeni il, Milad və digər bayramlar üçün ideal hədiyyə və sehrli dekorasiya.',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '24.90', currencyCode: 'AZN' },
      maxVariantPrice: { amount: '24.90', currencyCode: 'AZN' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '39.90', currencyCode: 'AZN' },
    },
    images: {
      edges: [
        {
          node: {
            url: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/08338e9d-3bbf-4cc4-9130-2bdee2893246.jpg?v=1792431154',
            altText: 'Lumify Pro – Sehrli Bayram İşıqları!',
          },
        },
        {
          node: {
            url: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/512d6254-ad6a-4fe4-8264-667b8d575652.jpg?v=1792430765',
            altText: 'Lumify Pro 16 Fərqli Bayram Naxışı',
          },
        },
        {
          node: {
            url: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/723f2d20-65e0-4cf7-9266-cc3c25ae69e4.jpg?v=1792430728',
            altText: 'Lumify Pro 270 Dərəcə Tənzimlənən Bucağı',
          },
        },
        {
          node: {
            url: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/9fc531f6-7586-4131-9986-b0fc813cc3b6.jpg?v=1792430752',
            altText: 'Lumify Pro USB Güclü Lazer LED Proyektor',
          },
        },
        {
          node: {
            url: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/723c70d6-dbe9-49f2-98ce-b10759a195b5.jpg?v=1792430737',
            altText: 'Lumify Pro Otaqda Sehrli Yeni İl Mənzərəsi',
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: '50691530293504',
            title: 'Standart',
            availableForSale: true,
            price: { amount: '24.90', currencyCode: 'AZN' },
            compareAtPrice: { amount: '39.90', currencyCode: 'AZN' },
          },
        },
      ],
    },
  },
  {
    id: '9625190498560',
    title: 'ClarifyPro - Qara Nöqtə Təmizləyici Vakum Cihazı',
    handle: 'clarifypro-qara-noktə-təmizləyici-vakum-cihazi',
    description:
      'Dəridəki qara nöqtələri, məsamələri və artıq yağı dərini zədələmədən dərindən təmizləyən 3 rejimli güclü vakum cihazı. Dəyişdirilə bilən 3 xüsusi ucluq və uzunömürlü akkumulyator ilə ev şəraitində peşəkar dəri qulluğu.',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '24.99', currencyCode: 'AZN' },
      maxVariantPrice: { amount: '24.99', currencyCode: 'AZN' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '49.98', currencyCode: 'AZN' },
    },
    images: {
      edges: [
        {
          node: {
            url: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/ChatGPTImage26Agu202603_24_34.png?v=1787700289',
            altText: 'ClarifyPro - Qara Nöqtə Təmizləyici Vakum Cihazı',
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: '49547097932032',
            title: 'Standart',
            availableForSale: true,
            price: { amount: '24.99', currencyCode: 'AZN' },
            compareAtPrice: { amount: '49.98', currencyCode: 'AZN' },
          },
        },
      ],
    },
  },
  {
    id: '9612405702912',
    title: 'İstiƏl — İstilikli Boyun, Bel və Çiyin Masajı',
    handle:
      'i̇stiəl-masaj-aparati-i̇stilikli-verən-və-avtomatik-sixaraq-masaj-edən-boyun-bel-və-ciyin-masaj-cihazi',
    description:
      'İstilik verən və avtomatik sıxaraq dərindən masaj edən boyun, bel və çiyin masaj cihazı. Gərgin əzələləri rahatladır, qan dövranını yaxşılaşdırır və günün yorğunluğunu dərhal aradan qaldırır.',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '45.00', currencyCode: 'AZN' },
      maxVariantPrice: { amount: '45.00', currencyCode: 'AZN' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '85.00', currencyCode: 'AZN' },
    },
    images: {
      edges: [
        {
          node: {
            url: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/ChatGPT_Image_16_Agu_2026_00_10_34.png?v=1786880634',
            altText: 'İstiƏl — İstilikli Boyun, Bel və Çiyin Masajı',
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: '49192144306432',
            title: 'Standart',
            availableForSale: true,
            price: { amount: '45.00', currencyCode: 'AZN' },
            compareAtPrice: { amount: '85.00', currencyCode: 'AZN' },
          },
        },
      ],
    },
  },
];
