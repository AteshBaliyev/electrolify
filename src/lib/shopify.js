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
 * Mağazadakı məhsulları əldə edir
 */
export async function getProducts(first = 20) {
  if (!isShopifyConfigured()) {
    return MOCK_PRODUCTS;
  }

  const { data, error } = await shopifyFetch({
    query: PRODUCTS_QUERY,
    variables: { first },
  });

  if (error || !data?.products?.edges) {
    return MOCK_PRODUCTS;
  }

  return data.products.edges.map((edge) => edge.node);
}

/**
 * Handle əsasında tək məhsul məlumatını əldə edir
 */
export async function getProductByHandle(handle) {
  if (!isShopifyConfigured()) {
    return MOCK_PRODUCTS.find((p) => p.handle === handle) || MOCK_PRODUCTS[0];
  }

  const { data, error } = await shopifyFetch({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });

  if (error || !data?.product) {
    return MOCK_PRODUCTS.find((p) => p.handle === handle) || null;
  }

  return data.product;
}

/**
  * Kateqoriyaya görə məhsulları əldə edir (Server kəşləməsi ilə)
  */
export async function getProductsByCategory(categorySlug, first = 20) {
  const allProducts = await getProducts(first);
  if (!categorySlug) return allProducts;

  const slug = categorySlug.toLowerCase();
  return allProducts.filter((p) => {
    const handle = (p.handle || '').toLowerCase();
    const title = (p.title || '').toLowerCase();
    if (slug.includes('saat') || slug.includes('watch')) {
      return handle.includes('watch') || title.includes('watch') || title.includes('saat');
    }
    if (slug.includes('qulaq') || slug.includes('audio') || slug.includes('aurapod')) {
      return handle.includes('aurapod') || handle.includes('audio') || title.includes('qulaqlıq');
    }
    if (slug.includes('sarj') || slug.includes('magsafe') || slug.includes('charge')) {
      return handle.includes('magsafe') || handle.includes('voltpulse') || title.includes('şarj');
    }
    return true;
  });
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
// Fallback / Mock Məlumatlar (Shopify açarları daxil edilənə qədər)
// -------------------------------------------------------------
export const MOCK_PRODUCTS = [
  {
    id: 'mock-1',
    title: 'Electrolify Pro Watch Series 9 (Ultra Edition)',
    handle: 'electrolify-pro-watch-series-9',
    description: 'Titanium korpus, AMOLED super-ekran, ürək döyüntüsü və qan təzyiqi sensorları. IP68 suya davamlı premium smart saat. 7 gün batareya ömrü və zənglərə cavab vermə funksiyası.',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '129.00', currencyCode: 'AZN' },
      maxVariantPrice: { amount: '159.00', currencyCode: 'AZN' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '229.00', currencyCode: 'AZN' },
    },
    images: {
      edges: [
        {
          node: {
            url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
            altText: 'Electrolify Pro Watch - Space Black Ön Görünüş',
          },
        },
        {
          node: {
            url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
            altText: 'Electrolify Pro Watch - Qolda Görünüş',
          },
        },
        {
          node: {
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            altText: 'Electrolify Pro Watch - Detal və Kəmər',
          },
        },
        {
          node: {
            url: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80',
            altText: 'Electrolify Pro Watch - Ekran interfeysi',
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: 'variant-1-1',
            title: 'Qara (Space Black) / 45mm',
            color: 'Qara',
            size: '45mm',
            availableForSale: true,
            price: { amount: '129.00', currencyCode: 'AZN' },
            compareAtPrice: { amount: '229.00', currencyCode: 'AZN' },
          },
        },
        {
          node: {
            id: 'variant-1-2',
            title: 'Qara (Space Black) / 49mm Ultra',
            color: 'Qara',
            size: '49mm Ultra',
            availableForSale: true,
            price: { amount: '149.00', currencyCode: 'AZN' },
            compareAtPrice: { amount: '249.00', currencyCode: 'AZN' },
          },
        },
        {
          node: {
            id: 'variant-1-3',
            title: 'Gümüşü (Titanium Silver) / 45mm',
            color: 'Gümüşü',
            size: '45mm',
            availableForSale: true,
            price: { amount: '139.00', currencyCode: 'AZN' },
            compareAtPrice: { amount: '239.00', currencyCode: 'AZN' },
          },
        },
        {
          node: {
            id: 'variant-1-4',
            title: 'Narıncı İdman (Alpine Orange) / 49mm Ultra',
            color: 'Narıncı',
            size: '49mm Ultra',
            availableForSale: true,
            price: { amount: '159.00', currencyCode: 'AZN' },
            compareAtPrice: { amount: '269.00', currencyCode: 'AZN' },
          },
        },
      ],
    },
  },
  {
    id: 'mock-2',
    title: 'AuraPod ANC Pro Simsiz Qulaqlıq (Spatial Audio)',
    handle: 'aurapod-anc-pro',
    description: 'Aktiv küy boğma (ANC), 48 saatlıq batareya ömrü, dərin bas və kristal təmiz səs keyfiyyəti. Şəffaf rejim və toxunma idarəetməsi.',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '79.00', currencyCode: 'AZN' },
      maxVariantPrice: { amount: '89.00', currencyCode: 'AZN' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '149.00', currencyCode: 'AZN' },
    },
    images: {
      edges: [
        {
          node: {
            url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
            altText: 'AuraPod ANC Pro Qara',
          },
        },
        {
          node: {
            url: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&q=80',
            altText: 'AuraPod ANC Pro Keys',
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: 'variant-2-1',
            title: 'Mat Qara',
            color: 'Mat Qara',
            size: 'Standart',
            availableForSale: true,
            price: { amount: '79.00', currencyCode: 'AZN' },
            compareAtPrice: { amount: '149.00', currencyCode: 'AZN' },
          },
        },
        {
          node: {
            id: 'variant-2-2',
            title: 'Kvars Ağ',
            color: 'Ağ',
            size: 'Standart',
            availableForSale: true,
            price: { amount: '89.00', currencyCode: 'AZN' },
            compareAtPrice: { amount: '159.00', currencyCode: 'AZN' },
          },
        },
      ],
    },
  },
  {
    id: 'mock-3',
    title: 'VoltPulse 3-ü 1-də MagSafe Sürətli Şarj Stansiyası (15W)',
    handle: 'voltpulse-3in1-magsafe',
    description: 'iPhone, Apple Watch və AirPods-u eyni vaxtda simsiz və sürətli şarj edin. Qatlanan alüminium dizayn, həddindən artıq qızmaya qarşı ağıllı çip.',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '59.00', currencyCode: 'AZN' },
      maxVariantPrice: { amount: '69.00', currencyCode: 'AZN' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '99.00', currencyCode: 'AZN' },
    },
    images: {
      edges: [
        {
          node: {
            url: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&q=80',
            altText: 'VoltPulse 3-in-1 Wireless Charger',
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: 'variant-3-1',
            title: 'Titanium Grey',
            color: 'Boz',
            size: '15W',
            availableForSale: true,
            price: { amount: '59.00', currencyCode: 'AZN' },
            compareAtPrice: { amount: '99.00', currencyCode: 'AZN' },
          },
        },
      ],
    },
  },
];
