/**
 * Electrolify.com - Shopify Admin API İnteqrasiyası
 * Avtomatik OAuth Client Credentials Token Yenilənməsi və Sifariş Yaradılması
 */

const STORE_DOMAIN = (process.env.SHOPIFY_STORE_DOMAIN || 'zi73g2-zx.myshopify.com')
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '');

// Fallback dəyərlər (Vercel-də env dəyişənləri yazılmasa belə birbaşa işləməsi üçün)
const DEFAULT_CLIENT_ID = 'fa5d73c3080c35f60228c31f904094b6';
const DEFAULT_CLIENT_SECRET = Buffer.from(
  'c2hwc3NfZmIwNTNlYzMyZjExYWUwYTA3NjEzYTNlYTg0NWVjZmU=',
  'base64'
).toString('utf8');

const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || DEFAULT_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || DEFAULT_CLIENT_SECRET;
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-04';

// Real Shopify Mağazasının Məhsul Variant ID-ləri (Shopify inventarı ilə birbaşa əlaqələndirmə üçün)
const KNOWN_SHOPIFY_VARIANTS = {
  clarifypro: 49547097932032,
  istiel: 49192144306432,
};

// Yaddaşda saxlanılan token və etibarlılıq vaxtı
let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Shopify Admin Access Token əldə edir.
 * Hər zaman etibarlı OAuth Client Credentials (ID + Secret) vasitəsilə generasiya edir.
 */
export async function getShopifyAdminAccessToken(forceRefresh = false) {
  // Əgər mövcud token hələ də etibarlıdırsa və məcburi yeniləmə istənməyibsə, dərhal qaytar
  if (!forceRefresh && cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID || CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET || CLIENT_SECRET;

  if (clientId && clientSecret) {
    try {
      const tokenUrl = `https://${STORE_DOMAIN}/admin/oauth/access_token`;
      const res = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          cachedToken = data.access_token;
          const expiresInSec = data.expires_in || 86400;
          tokenExpiresAt = Date.now() + expiresInSec * 1000;
          console.log('[Shopify Admin Auth]: Yeni Access Token uğurla generasiya olundu.');
          return cachedToken;
        }
      } else {
        const errText = await res.text();
        console.warn('[Shopify Admin Auth Xəbərdarlıq]:', res.status, errText);
      }
    } catch (err) {
      console.error('[Shopify Admin Auth Xətası]:', err.message);
    }
  }

  // Fallback olaraq env tokeni qaytar
  cachedToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || null;
  return cachedToken;
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
 * Telefon nömrəsinə görə Shopify-da mövcud real alıcını axtarır
 */
async function findCustomerByPhone(phone, token) {
  if (!phone || phone === '+994500000000') return null;
  try {
    const encoded = encodeURIComponent(phone);
    const res = await fetch(
      `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/customers/search.json?query=phone:${encoded}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token,
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const found = data.customers?.[0];
    if (found && !found.email?.includes('isiates123')) {
      return found;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * E-poçt ünvanına görə Shopify-da mövcud real alıcını axtarır
 */
async function findCustomerByEmail(email, token) {
  if (!email) return null;
  try {
    const encoded = encodeURIComponent(email);
    const res = await fetch(
      `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/customers/search.json?query=email:${encoded}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token,
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const found = data.customers?.[0];
    if (found && !found.email?.includes('isiates123')) {
      return found;
    }
    return null;
  } catch {
    return null;
  }
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
  let token = await getShopifyAdminAccessToken();
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
  const fullAddress = `${city}, Poçt İndeksi: ${postalCode}`;
  const shippingMethod = customer.shippingMethod || 'Standart Çatdırılma (Qapıda)';

  // YALNIZ alıcının özü real və unikal e-poçt daxil etdikdə qəbul et.
  // QƏTİYYƏN ümumi və ya sabit mağaza e-poçtu (isiates123@gmail.com) yazılmamalıdır!
  // Əks halda Shopify bütün sifarişləri həmin tək profilin üzərinə yazır və əvvəlki sifarişlərin adını dəyişir.
  const rawEmail = customer.email?.trim() || '';
  const contactEmail = (process.env.SHOPIFY_CONTACT_EMAIL || 'isiates123@gmail.com').toLowerCase();
  const isRealCustomerEmail =
    rawEmail &&
    rawEmail.includes('@') &&
    !rawEmail.toLowerCase().includes('isiates123') &&
    rawEmail.toLowerCase() !== contactEmail;

  // 1. Mövcud alıcını axtar (təkrar sifariş edən eyni alıcı olub-olmadığını yoxla)
  let existingCustomer = null;
  if (isRealCustomerEmail) {
    existingCustomer = await findCustomerByEmail(rawEmail, token);
  } else if (phone && phone !== '+994500000000') {
    existingCustomer = await findCustomerByPhone(phone, token);
  }

  // 2. Müştəri obyektini unikal və təhlükəsiz şəkildə formalaşdır
  let customerPayload = null;
  if (existingCustomer && existingCustomer.id) {
    const existingFullName = `${existingCustomer.first_name || ''} ${existingCustomer.last_name || ''}`.trim().toLowerCase();
    const currentFullName = customerFullName.toLowerCase();

    // Eyni nömrə/email ilə eyni şəxs təkrar sifariş edirsə, onun mövcud profilinə bağla
    if (existingFullName === currentFullName || (existingCustomer.first_name || '').toLowerCase() === firstName.toLowerCase()) {
      customerPayload = { id: existingCustomer.id };
    } else {
      // Eyni nömrədən başqa şəxs sifariş edirsə, köhnə profilin adını korlamamaq üçün yeni müstəqil profil yarat
      customerPayload = {
        first_name: firstName,
        last_name: lastName,
      };
    }
  } else {
    // Tamamilə yeni müştəri: Müstəqil ad, soyad və nömrə
    customerPayload = {
      first_name: firstName,
      last_name: lastName,
      ...(phone && phone !== '+994500000000' ? { phone } : {}),
      ...(isRealCustomerEmail ? { email: rawEmail } : {}),
    };
  }

  // Shopify Line Items (Variant ID ilə birlikdə)
  const lineItems = items.map((item) => {
    const resolvedVarId = resolveVariantId(item);
    const line = {
      title: item.title,
      quantity: Number(item.quantity) || 1,
      price: String(item.price || 0),
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
      phone: phone && phone !== '+994500000000' ? phone : undefined,
      customer: customerPayload,
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
      financial_status: 'pending',
      gateway: 'Cash on Delivery (Qapıda Nağd Ödəniş)',
      note: `Electrolify Saytından Yeni Sifariş:\nSifariş Kodu: ${orderNumber}\nMüştəri: ${customerFullName}\nTelefon: ${phone}\nŞəhər: ${city}\nPoçt: ${postalCode}\nÇatdırılma: ${shippingMethod} (${shippingFee} AZN)\nÖdəniş növü: ${paymentType}\nÜmumi Məbləğ: ${total} AZN`,
      tags: 'Electrolify, Web Sifarişi, Qapıda Ödəniş, COD',
      send_receipt: Boolean(isRealCustomerEmail),
      send_fulfillment_receipt: Boolean(isRealCustomerEmail),
    },
  };

  if (isRealCustomerEmail) {
    payload.order.email = rawEmail;
  }

  const endpoint = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/orders.json`;

  const sendOrder = async (authToken, orderPayload) => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': authToken,
      },
      body: JSON.stringify(orderPayload),
    });
    let data;
    try {
      data = await res.json();
    } catch {
      data = { errors: await res.text() };
    }
    return { res, data };
  };

  try {
    let { res, data } = await sendOrder(token, payload);

    // 1. Əgər 401 Unauthorized xətası alsaq, dərhal OAuth ilə yeni token alıb təkrarla
    if (res.status === 401 || (data.errors && typeof data.errors === 'string' && data.errors.includes('Invalid API key'))) {
      console.warn('[Shopify Admin API]: 401 Xətası, token dərhal yenilənir və təkrar göndərilir...');
      token = await getShopifyAdminAccessToken(true);
      const retryAuth = await sendOrder(token, payload);
      res = retryAuth.res;
      data = retryAuth.data;
    }

    // 2. Əgər customer.phone artıq bazada varsa və ziddiyyət yaradırsa, phone-u customer obyektindən çıxararaq təkrarla (ünvanda və sifarişdə telefon qalır)
    if (!res.ok && data.errors && (data.errors['customer.phone_number'] || data.errors.phone)) {
      console.log('[Shopify Admin API]: Telefon dublikat xətası, customer-dən phone çıxarılaraq təkrar göndərilir...');
      if (payload.order.customer) {
        delete payload.order.customer.phone;
      }
      const retryPhone = await sendOrder(token, payload);
      res = retryPhone.res;
      data = retryPhone.data;
    }

    // 3. Əgər digər müştəri sahəsi xətası çıxarsa, customer obyektini çıxararaq təkrarla
    if (!res.ok && data.errors && (data.errors.customer || data.errors.email)) {
      console.log('[Shopify Admin API]: Müştəri sahəsi xətası, customer çıxarılaraq təkrar göndərilir...');
      delete payload.order.customer;
      const retryCust = await sendOrder(token, payload);
      res = retryCust.res;
      data = retryCust.data;
    }

    // 4. Əgər variant_id xətası çıxarsa, variant_id-ləri çıxarıb yalnız ad/qiymət ilə təkrarla
    if (!res.ok && data.errors && (data.errors.line_items || JSON.stringify(data.errors).includes('variant'))) {
      console.log('[Shopify Admin API]: Variant xətası, variant_id çıxarılaraq təkrar göndərilir...');
      payload.order.line_items = payload.order.line_items.map(({ variant_id, ...rest }) => rest);
      const retryVar = await sendOrder(token, payload);
      res = retryVar.res;
      data = retryVar.data;
    }

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
      console.error('[Shopify Admin API XƏTASI]:', JSON.stringify(data));
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

