/**
 * Electrolify.com - Meta (Facebook) Pixel Köməkçi Modulu
 * Pixel ID: 1745100669947802
 * 
 * Bütün hadisələr Next.js SSR mühitinə tam uyğunlaşdırılıb (typeof window !== 'undefined'
 * və window.fbq mövcudluğu yoxlanılır) və ROAS konversiyalarını dəqiq ölçür.
 */

export const FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || '1745100669947802';

/**
 * Təhlükəsiz fbq çağırış köməkçisi
 */
const safeFbq = (...args) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      window.fbq(...args);
    } catch (err) {
      console.warn('[Meta Pixel] Hadisə göndərilərkən xəta:', err);
    }
  }
};

/**
 * 1. Qlobal Səhifə Baxışı (PageView)
 * Bütün səhifələrdə və marşrut dəyişikliklərində avtomatik işə düşür.
 */
export const trackPageView = () => {
  safeFbq('track', 'PageView');
};

/**
 * 2. Məhsul Səhifəsinə Baxış (ViewContent)
 * İstifadəçi məhsul səhifəsinə daxil olduqda məhsulun adı və qiyməti ilə işə düşür.
 * 
 * @param {Object} product - Məhsul obyekti
 */
export const trackViewContent = (product) => {
  if (!product) return;

  try {
    const rawPrice =
      product.price ||
      product.priceRange?.minVariantPrice?.amount ||
      product.variants?.edges?.[0]?.node?.price?.amount ||
      0;
    const priceNum = typeof rawPrice === 'string' ? parseFloat(rawPrice) : Number(rawPrice);
    const contentId = String(product.id || product.handle || 'product');

    safeFbq('track', 'ViewContent', {
      content_name: product.title || '',
      content_ids: [contentId],
      content_type: 'product',
      value: isNaN(priceNum) ? 0 : parseFloat(priceNum.toFixed(2)),
      currency: 'AZN',
    });
  } catch (err) {
    console.warn('[Meta Pixel] ViewContent hadisəsində xəta:', err);
  }
};

/**
 * 3. Səbətə Əlavə Et / İndi Sifariş Et (AddToCart)
 * İstifadəçi 'Səbətə At' və ya 'İndi Sifariş Et' düyməsinə kliklədikdə işə düşür.
 * 
 * @param {Object} product - Məhsul obyekti
 * @param {number} quantity - Ədəd sayı
 * @param {Object} variant - Seçilmiş variant
 */
export const trackAddToCart = (product, quantity = 1, variant = null) => {
  if (!product) return;

  try {
    const rawPrice =
      variant?.price?.amount ||
      product.price ||
      product.priceRange?.minVariantPrice?.amount ||
      product.variants?.edges?.[0]?.node?.price?.amount ||
      0;
    const priceNum = typeof rawPrice === 'string' ? parseFloat(rawPrice) : Number(rawPrice);
    const qty = Number(quantity) || 1;
    const itemTotal = (isNaN(priceNum) ? 0 : priceNum) * qty;
    const contentId = String(variant?.id || product.id || product.handle || 'product');

    safeFbq('track', 'AddToCart', {
      content_name: product.title || '',
      content_ids: [contentId],
      content_type: 'product',
      value: parseFloat(itemTotal.toFixed(2)),
      currency: 'AZN',
    });
  } catch (err) {
    console.warn('[Meta Pixel] AddToCart hadisəsində xəta:', err);
  }
};

/**
 * 4. Sifarişin Uğurla Tamamlanması (Purchase)
 * İstifadəçi Checkout səhifəsində 'Qapıda Ödəniş' formunu uğurla təsdiq etdikdə işə düşür.
 * 
 * @param {Object} options
 * @param {string|number} options.orderId - Sifariş nömrəsi
 * @param {string|number} options.value - Yekun sifariş məbləği (AZN)
 * @param {string} [options.currency='AZN'] - Valyuta
 * @param {Array} [options.items=[]] - Səbətdəki məhsullar
 */
export const trackPurchase = ({ orderId, value, currency = 'AZN', items = [] }) => {
  try {
    const totalVal = typeof value === 'string' ? parseFloat(value) : Number(value);
    const contentIds = Array.isArray(items)
      ? items.map((i) => String(i.productId || i.variantId || i.id || i.handle || ''))
      : [];

    safeFbq('track', 'Purchase', {
      content_name: 'Qapıda Ödəniş Sifarişi',
      content_type: 'product',
      content_ids: contentIds,
      num_items: Array.isArray(items)
        ? items.reduce((acc, cur) => acc + (cur.quantity || 1), 0)
        : 1,
      value: isNaN(totalVal) ? 0 : parseFloat(totalVal.toFixed(2)),
      currency: currency || 'AZN',
      order_id: String(orderId || `ORD-${Date.now()}`),
    });
  } catch (err) {
    console.warn('[Meta Pixel] Purchase hadisəsində xəta:', err);
  }
};

/**
 * Xüsusi fərdiləşdirilmiş Meta hadisəsi
 */
export const trackCustomEvent = (name, options = {}) => {
  safeFbq('trackCustom', name, options);
};
