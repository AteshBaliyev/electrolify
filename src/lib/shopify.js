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
      headers: { 'User-Agent': 'Electrolify-NextJS/1.0' },
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
 * Mağazadakı məhsulları əldə edir (YALNIZ Shopify Admin Panelində olan real məhsullar)
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

  // Shopify mağazasından yalnız real məhsulları çək
  const live = await fetchLiveShopifyProducts();
  if (live && live.length > 0) {
    return live.slice(0, first);
  }

  // Fallback olaraq yalnız real mağaza məhsulları
  return MOCK_PRODUCTS.slice(0, first);
}

/**
 * Handle əsasında tək məhsul məlumatını əldə edir
 */
export async function getProductByHandle(handle) {
  const decodedHandle = decodeURIComponent(handle || '').toLowerCase();

  if (isShopifyConfigured()) {
    const { data, error } = await shopifyFetch({
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle: decodedHandle },
    });
    if (!error && data?.product) {
      return data.product;
    }
  }

  const live = await fetchLiveShopifyProducts();
  const productList = live && live.length > 0 ? live : MOCK_PRODUCTS;

  const match = productList.find((p) => {
    const pHandle = decodeURIComponent(p.handle || '').toLowerCase();
    const pTitle = (p.title || '').toLowerCase();
    return (
      pHandle === decodedHandle ||
      String(p.id) === String(handle) ||
      (decodedHandle.includes('clarify') && (pHandle.includes('clarify') || pTitle.includes('clarify'))) ||
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
    id: '9625190498560',
    title: 'ClarifyPro - Qara Nöktə Təmizləyici Vakum Cihazı',
    handle: 'clarifypro-qara-noktə-təmizləyici-vakum-cihazi',
    description:
      'Dəridəki qara nöqtələri, məsamələri və artıq yağı dərini zədələmədən dərindən təmizləyən 3 rejimli güclü vakum cihazı. Dəyişdirilə bilən 3 xüsusi ucluq və uzunömürlü akkumulyator ilə ev şəraitində peşəkar dəri qulluğu.',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '24.99', currencyCode: 'AZN' },
      maxVariantPrice: { amount: '24.99', currencyCode: 'AZN' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '49.00', currencyCode: 'AZN' },
    },
    images: {
      edges: [
        {
          node: {
            url: 'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/ChatGPTImage26Agu202603_24_34.png?v=1787700289',
            altText: 'ClarifyPro - Qara Nöktə Təmizləyici Vakum Cihazı',
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
            compareAtPrice: { amount: '49.00', currencyCode: 'AZN' },
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
