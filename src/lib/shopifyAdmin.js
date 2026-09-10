/**
 * Electrolify.com - Shopify Admin API İnteqrasiyası
 * Avtomatik OAuth Client Credentials Token Yenilənməsi və Sifariş Yaradılması
 */

const STORE_DOMAIN = (process.env.SHOPIFY_STORE_DOMAIN || 'zi73g2-zx.myshopify.com')
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '');

const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-04';

// Real Shopify Mağazasının Məhsul Variant ID-ləri (Shopify inventarı ilə birbaşa əlaqələndirmə üçün)
const KNOWN_SHOPIFY_VARIANTS = {
  clarifypro: 49547097932032,
  istiel: 49192144306432,
};

// Yaddaşda saxlanılan token və etibarlılıq vaxtı
let memoryToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || null;
let tokenExpiresAt = 0;

/**
 * Shopify Admin Access Token əldə edir.
 * Token bitdikdə avtomatik olaraq Client Credentials (ID + Secret) vasitəsilə yeniləyir.
 */
export async function getShopifyAdminAccessToken() {
  // Əgər mövcud token hələ də etibarlıdırsa, dərhal qaytar
  if (memoryToken && Date.now() < tokenExpiresAt - 300000) {
    return memoryToken;
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID || CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET || CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return memoryToken || process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || null;
  }

  try {
    const tokenUrl = `https://${STORE_DOMAIN}/admin/oauth/access_token`;
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.access_token) {
        memoryToken = data.access_token;
        const expiresInSec = data.expires_in || 86400;
        tokenExpiresAt = Date.now() + expiresInSec * 1000;
        console.log('[Shopify Admin Auth]: Yeni Access Token uğurla generasiya olundu.');
        return memoryToken;
      }
    } else {
      const errText = await res.text();
      console.warn('[Shopify Admin Auth Xəbərdarlıq]:', res.status, errText);
    }
  } catch (err) {
    console.error('[Shopify Admin Auth Xətası]:', err.message);
  }

  // Fallback olaraq ilkin tokeni qaytar
  return memoryToken || process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
}

/**
 * Məhsul üçün uyğun Shopify Variant ID-sini təyin edir
 */
function resolveVariantId(item) {
  if (item.variantId) {
    const numeric = String(item.variantId).replace(/\D/g, '');
    if (numeric.length > 5) return Number(numeric);
  }

  const searchKey = `${item.handle || ''} ${item.title || ''}`.toLowerCase();
  if (searchKey.includes('clarify') || searchKey.includes('vakum') || searchKey.includes('qara')) {
    return KNOWN_SHOPIFY_VARIANTS.clarifypro;
  }
  if (searchKey.includes('istiəl') || searchKey.includes('istiel') || searchKey.includes('masaj')) {
    return KNOWN_SHOPIFY_VARIANTS.istiel;
  }

  return undefined;
}

/**
 * Telefon nömrəsini beynəlxalq E.164 (+994) formatına gətirir
 */
function formatPhone(phone) {
  if (!phone) return '+994500000000';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('994')) return `+${digits}`;
  if (digits.startsWith('0')) return `+994${digits.slice(1)}`;
  if (digits.length === 9) return `+994${digits}`;
  return `+${digits}`;
}

/**
 * Saytda tamamlanan sifarişi birbaşa Shopify Admin Panelinə yazır
 */
export async function createShopifyAdminOrder({
  customer = {},
  items = [],
  subtotal = 0,
  shippingFee = 0,
  total = 0,
  paymentType = 'Qapıda Nağd Ödəniş (COD)',
  orderNumber = '',
}) {
  const token = await getShopifyAdminAccessToken();
  if (!token) {
    return {
      success: false,
      error: 'Shopify Admin Access Token əldə edilə bilmədi.',
    };
  }

  const firstName = customer.firstName?.trim() || 'Müştəri';
  const lastName = customer.lastName?.trim() || '';
  const customerFullName = `${firstName} ${lastName}`.trim();
  const phone = formatPhone(customer.phone);
  const city = customer.city?.trim() || 'Bakı';
  const postalCode = customer.postalCode?.trim() || 'AZ1000';
  const email = customer.email?.trim() || 'isiates123@gmail.com';
  const shippingMethod = customer.shippingMethod || 'Standart Çatdırılma (Qapıda)';
  const fullAddress = `${city}, Poçt İndeksi: ${postalCode}`;

  // Shopify Line Items (Variant ID ilə birlikdə)
  const lineItems = items.map((item) => {
    const resolvedVarId = resolveVariantId(item);
    const line = {
      title: item.title,
      quantity: Number(item.quantity) || 1,
      price: String(item.price),
      name: `${item.title} - ${item.variantTitle || 'Standart'}`,
    };

    if (resolvedVarId) {
      line.variant_id = resolvedVarId;
    }

    return line;
  });

  const payload = {
    order: {
      line_items: lineItems,
      customer: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        email: email,
      },
      shipping_address: {
        first_name: firstName,
        last_name: lastName,
        address1: fullAddress,
        city: city,
        zip: postalCode,
        phone: phone,
        country: 'Azerbaijan',
        country_code: 'AZ',
      },
      billing_address: {
        first_name: firstName,
        last_name: lastName,
        address1: fullAddress,
        city: city,
        zip: postalCode,
        phone: phone,
        country: 'Azerbaijan',
        country_code: 'AZ',
      },
      shipping_lines: [
        {
          title: shippingMethod,
          price: String(shippingFee || 0),
          code: 'COD_SHIPPING',
        },
      ],
      financial_status: 'pending', // Qapıda ödəniş olduğu üçün gözləmədə
      gateway: 'Cash on Delivery (Qapıda Nağd Ödəniş)',
      note: `Electrolify Saytından Yeni Sifariş:\nSifariş Kodu: ${orderNumber}\nMüştəri: ${customerFullName}\nTelefon: ${phone}\nŞəhər: ${city}\nPoçt: ${postalCode}\nÇatdırılma: ${shippingMethod} (${shippingFee} AZN)\nÖdəniş növü: ${paymentType}\nÜmumi Məbləğ: ${total} AZN`,
      tags: 'Electrolify, Web Sifarişi, Qapıda Ödəniş, COD',
      send_receipt: true, // Müştəriyə və mağaza sahibinə rəsmi bildiriş
      send_fulfillment_receipt: true,
    },
  };

  try {
    const endpoint = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/orders.json`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok && data.order?.id) {
      console.log(
        `[Shopify Admin UĞURLU]: Sifariş Shopify-a yazıldı! Sifariş Nömrəsi: ${data.order.name}, ID: ${data.order.id}`
      );
      return {
        success: true,
        order: data.order,
        shopifyOrderId: data.order.id,
        shopifyOrderName: data.order.name,
      };
    } else {
      console.warn('[Shopify Admin API Cavabı]:', JSON.stringify(data));
      return {
        success: false,
        error: data.errors || 'Shopify sifarişi qəbul etmədi.',
        details: data,
      };
    }
  } catch (err) {
    console.error('[Shopify Sifariş Yaradılma Xətası]:', err.message);
    return {
      success: false,
      error: err.message,
    };
  }
}
