/**
 * Electrolify.com - Shopify Headless Storefront Analytics İnteqrasiyası
 * 
 * Bu modul Shopify Admin Panelində (Live View - Canlı Baxış, Onlayn Mağaza Seansları
 * və E-ticarət Konversiyaları) istifadəçilərin real-time görünməsini təmin edir.
 */

export const SHOPIFY_SHOP_ID = 85294186752;
export const SHOPIFY_THEME_ID = 165263671552;
export const SHOPIFY_STORE_DOMAIN = 'zi73g2-zx.myshopify.com';
export const MONORAIL_PRODUCE_URL = 'https://monorail-edge.shopifysvc.com/v1/produce';

/**
 * UUID v4 generatoru (Shopify _shopify_y və _shopify_s tokenləri üçün)
 */
export function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Brauzer kuki oxuyucusu
 */
export function getCookie(name) {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : '';
}

/**
 * Brauzer kuki yazıcısı
 */
export function setCookie(name, value, maxAgeSeconds = 1800) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

/**
 * Shopify seans və müştəri kukilərinin mövcudluğunu təmin edir
 */
export function ensureShopifyCookies() {
  if (typeof window === 'undefined') return { buyerToken: '', sessionToken: '' };

  let buyerToken = getCookie('_shopify_y');
  if (!buyerToken) {
    buyerToken = generateUUID();
    setCookie('_shopify_y', buyerToken, 31536000); // 1 il
  }

  let sessionToken = getCookie('_shopify_s');
  if (!sessionToken) {
    sessionToken = generateUUID();
    setCookie('_shopify_s', sessionToken, 1800); // 30 dəqiqə
  } else {
    // Hər aktiv hərəkətdə seansı 30 dəqiqə uzat
    setCookie('_shopify_s', sessionToken, 1800);
  }

  return { buyerToken, sessionToken };
}

/**
 * Shopify Monorail Edge servisinə real-time hadisə (beacon) göndərir.
 * Shopify Live View ("Canlı Baxış") məhz bu siqnallar əsasında real vaxtda ziyarətçini xəritədə göstərir.
 */
export function sendMonorailBeacon(schemaId, payload) {
  if (typeof window === 'undefined') return;

  try {
    const now = Date.now();
    const eventBody = JSON.stringify({
      schema_id: schemaId,
      payload: {
        shop_id: SHOPIFY_SHOP_ID,
        ...payload,
      },
      metadata: {
        event_created_at_ms: now,
        event_sent_at_ms: now,
      },
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([eventBody], { type: 'text/plain' });
      navigator.sendBeacon(MONORAIL_PRODUCE_URL, blob);
    } else {
      fetch(MONORAIL_PRODUCE_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: eventBody,
      }).catch(() => {});
    }
  } catch (err) {
    // Analytics səssiz işləməlidir
  }
}

/**
 * Shopify Trekkie kitabxanasına təhlükəsiz zəng
 */
const safeTrekkie = (method, ...args) => {
  if (typeof window === 'undefined') return;
  try {
    if (window.ShopifyAnalytics?.lib?.[method]) {
      window.ShopifyAnalytics.lib[method](...args);
    } else if (window.trekkie?.[method]) {
      window.trekkie[method](...args);
    }
  } catch (err) {
    // Səssiz xəta idarəetməsi
  }
};

/**
 * 1. Shopify Səhifə Baxışı (PageView)
 * Sayta daxil olanda və hər marşrut dəyişəndə Shopify Live View və Sessions sayğacını artırır.
 */
export function trackShopifyPageView(pathname = '/') {
  if (typeof window === 'undefined') return;

  const { sessionToken } = ensureShopifyCookies();

  let pageType = 'home';
  if (pathname.startsWith('/products/')) {
    pageType = 'product';
  } else if (pathname.startsWith('/checkout')) {
    pageType = 'checkout';
  } else if (pathname.startsWith('/cart')) {
    pageType = 'cart';
  } else if (pathname !== '/') {
    pageType = 'page';
  }

  // 1. Shopify Trekkie Storefront Page event
  safeTrekkie('page', null, {
    pageType,
    shopifyEmitted: true,
  });

  // 2. Monorail Edge Buyer Heartbeat Beacon (Canlı Baxış üçün)
  const navStart = performance?.timing?.navigationStart || Date.now();
  sendMonorailBeacon('online_store_buyer_site_abandonment/1.1', {
    url: window.location.href,
    navigation_start: navStart,
    duration: Math.max(10, Date.now() - navStart),
    session_token: sessionToken,
    page_type: pageType === 'home' ? 'index' : pageType,
  });
}

/**
 * 2. Shopify Məhsul Baxışı (Viewed Product)
 */
export function trackShopifyViewContent(product) {
  if (!product || typeof window === 'undefined') return;

  try {
    ensureShopifyCookies();
    const rawPrice =
      product.price ||
      product.priceRange?.minVariantPrice?.amount ||
      0;
    const price = typeof rawPrice === 'string' ? parseFloat(rawPrice) : Number(rawPrice);

    safeTrekkie('track', 'Viewed Product', {
      id: String(product.id || product.handle || ''),
      name: product.title || '',
      price: isNaN(price) ? 0 : price,
      currency: 'AZN',
    });
  } catch (err) {}
}

/**
 * 3. Shopify Səbətə At Hadisəsi (Added Product)
 */
export function trackShopifyAddToCart(product, quantity = 1, variant = null) {
  if (!product || typeof window === 'undefined') return;

  try {
    ensureShopifyCookies();
    const rawPrice = variant?.price || product.price || 0;
    const price = typeof rawPrice === 'string' ? parseFloat(rawPrice) : Number(rawPrice);

    safeTrekkie('track', 'Added Product', {
      id: String(variant?.id || product.id || product.handle || ''),
      name: product.title || '',
      quantity: Number(quantity) || 1,
      price: isNaN(price) ? 0 : price,
      currency: 'AZN',
    });
  } catch (err) {}
}

/**
 * 4. Shopify Sifariş Tamamlandı (Completed Order)
 */
export function trackShopifyPurchase({ orderNumber, total, items = [] }) {
  if (typeof window === 'undefined') return;

  try {
    ensureShopifyCookies();
    const totalNum = typeof total === 'string' ? parseFloat(total) : Number(total);

    safeTrekkie('track', 'Completed Order', {
      orderId: String(orderNumber || ''),
      total: isNaN(totalNum) ? 0 : totalNum,
      currency: 'AZN',
      products: items.map((it) => ({
        id: String(it.variantId || it.id || ''),
        name: it.title || '',
        quantity: Number(it.quantity) || 1,
        price: Number(it.price) || 0,
      })),
    });
  } catch (err) {}
}
