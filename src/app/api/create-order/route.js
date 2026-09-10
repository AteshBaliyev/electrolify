import { NextResponse } from 'next/server';

/**
 * WhatsApp Bildiriş Funksiyası
 * Format: 'Yeni Sifariş: [Ad], [Məhsullar], [Məbləğ], [Telefon]'
 */
async function sendWhatsAppNotification({
  customerName,
  productsText,
  total,
  phone,
  city,
  postalCode,
  shippingMethod,
  email,
  orderNumber,
}) {
  const formattedMessage = `Yeni Sifariş: ${customerName}, [${productsText}], ${total} AZN, ${phone}`;

  console.log('\n=============================================================');
  console.log('📱 [WHATSAPP BİLDİRİŞİ]:');
  console.log(formattedMessage);
  console.log(`📍 Şəhər/Rayon: ${city || 'Bakı'} | Poçt İndeksi: ${postalCode || 'AZ1000'}`);
  console.log(`🚚 Çatdırılma: ${shippingMethod || 'Standart'}`);
  if (email) console.log(`📧 E-poçt: ${email}`);
  console.log(`🏷️ Sifariş Kodu: ${orderNumber}`);
  console.log(`💵 Ödəniş Növü: Qapıda Ödəniş (COD)`);
  console.log('=============================================================\n');

  // Gələcəkdə WhatsApp Business API (UltraMsg, WPPConnect, Twilio, GreenAPI) üçün hazır inteqrasiya
  if (process.env.WHATSAPP_WEBHOOK_URL) {
    try {
      await fetch(process.env.WHATSAPP_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: process.env.WHATSAPP_ADMIN_NUMBER || phone,
          message: formattedMessage,
          city,
          postalCode,
          shippingMethod,
          email,
          orderNumber,
        }),
      });
    } catch (error) {
      console.error('[WhatsApp Webhook Xətası]:', error.message);
    }
  }

  return formattedMessage;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customer = {},
      items = [],
      subtotal = 0,
      shippingFee = 0,
      total = 0,
      paymentType = 'Qapıda Nağd',
    } = body;

    const firstName = customer.firstName?.trim() || 'Müştəri';
    const lastName = customer.lastName?.trim() || '';
    const customerFullName = `${firstName} ${lastName}`.trim();
    const phone = customer.phone?.trim() || '';
    const city = customer.city?.trim() || '';
    const postalCode = customer.postalCode?.trim() || '';
    const email = customer.email?.trim() || '';
    const shippingMethod = customer.shippingMethod || 'Standart Çatdırılma';
    const fullAddress = `${city}, Poçt İndeksi: ${postalCode}`;

    if (!phone || !city) {
      return NextResponse.json(
        { success: false, error: 'Telefon nömrəsi və şəhər məlumatı mütləqdir.' },
        { status: 400 }
      );
    }

    // Məhsulların xülasə mətni
    const productsText = items
      .map((item) => `${item.title} (${item.variantTitle || 'Standart'}) x${item.quantity}`)
      .join(', ') || 'Elektronika Məhsulu';

    // Unikal Sifariş Kodu
    const orderNumber = `EL-${Math.floor(10000 + Math.random() * 90000)}`;

    // Shopify Admin API inteqrasiyası
    const rawStoreDomain = process.env.SHOPIFY_STORE_DOMAIN || 'zi73g2-zx.myshopify.com';
    const storeDomain = rawStoreDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-04';

    // Telefon nömrəsini E.164 (+994) formatına uyğunlaşdırırıq
    const digitsOnly = phone.replace(/\D/g, '');
    let formattedPhone = phone;
    if (digitsOnly.startsWith('994')) {
      formattedPhone = `+${digitsOnly}`;
    } else if (digitsOnly.startsWith('0')) {
      formattedPhone = `+994${digitsOnly.slice(1)}`;
    } else if (digitsOnly.length === 9) {
      formattedPhone = `+994${digitsOnly}`;
    }

    let shopifyOrderId = null;
    let shopifyOrderName = null;

    const isRealAdminConfigured =
      Boolean(storeDomain) &&
      Boolean(adminAccessToken) &&
      !storeDomain.includes('your-store-name') &&
      !adminAccessToken.includes('your_shopify_admin_api_token');

    if (isRealAdminConfigured) {
      try {
        const adminEndpoint = `https://${storeDomain}/admin/api/${apiVersion}/orders.json`;
        const shopifyOrderPayload = {
          order: {
            line_items: items.map((item) => {
              const line = {
                title: item.title,
                quantity: Number(item.quantity) || 1,
                price: String(item.price),
                name: `${item.title} - ${item.variantTitle || 'Standart'}`,
              };
              const numVariant = item.variantId ? String(item.variantId).replace(/\D/g, '') : '';
              if (numVariant && numVariant.length > 5) {
                line.variant_id = Number(numVariant);
              }
              return line;
            }),
            customer: {
              first_name: firstName,
              last_name: lastName,
              phone: formattedPhone,
              email: email || undefined,
            },
            shipping_address: {
              first_name: firstName,
              last_name: lastName,
              address1: fullAddress,
              city: city,
              zip: postalCode || 'AZ1000',
              phone: formattedPhone,
              country: 'Azerbaijan',
            },
            shipping_lines: [
              {
                title: shippingMethod || 'Standart Çatdırılma',
                price: String(shippingFee || 0),
                code: 'COD_SHIPPING',
              },
            ],
            financial_status: 'pending', // Qapıda ödəniş olduğu üçün gözləmədə
            gateway: 'Cash on Delivery (Qapıda Nağd Ödəniş)',
            note: `Electrolify Web COD Sifarişi\nAd: ${customerFullName}\nTelefon: ${formattedPhone}\nŞəhər: ${city}\nPoçt: ${postalCode}\nÇatdırılma: ${shippingMethod} (${shippingFee} AZN)\nÖdəniş: ${paymentType}`,
            tags: 'Electrolify, COD, NextJS, Web',
          },
        };

        const shopifyRes = await fetch(adminEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': adminAccessToken,
          },
          body: JSON.stringify(shopifyOrderPayload),
        });

        const shopifyJson = await shopifyRes.json();
        if (shopifyJson.order?.id) {
          shopifyOrderId = shopifyJson.order.id;
          shopifyOrderName = shopifyJson.order.name;
          console.log(`[Shopify Admin API Uğurlu]: Sifariş Shopify-a yazıldı! ID: ${shopifyOrderId}, Ad: ${shopifyOrderName}`);
        } else {
          console.warn('[Shopify Admin API Xəbərdarlıq]:', JSON.stringify(shopifyJson));
        }
      } catch (adminErr) {
        console.error('[Shopify Admin API Xətası]:', adminErr.message);
      }
    } else {
      console.log(
        '[Electrolify Backend]: SHOPIFY_ADMIN_ACCESS_TOKEN təyin edilməyib. Əgər Shopify Admin -> Develop apps bölməsindən token əlavə etsəniz, sifariş birbaşa Shopify panelinizə düşəcək.'
      );
    }

    // WhatsApp Bildirişini göndər və konsola yaz
    const notificationMessage = await sendWhatsAppNotification({
      customerName: customerFullName,
      productsText,
      total,
      phone,
      city,
      postalCode,
      shippingMethod,
      email,
      orderNumber,
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      shopifyOrderId,
      customer: {
        name: customerFullName,
        phone,
        city,
        postalCode,
        shippingMethod,
        email,
      },
      total,
      notification: notificationMessage,
      message: 'Sifarişiniz uğurla qəbul edildi! Operatorumuz 5 dəqiqə ərzində sizinlə əlaqə saxlayacaq.',
    });
  } catch (error) {
    console.error('[API /api/create-order Xətası]:', error);
    return NextResponse.json(
      { success: false, error: 'Sifariş yaradılarkən server xətası baş verdi.' },
      { status: 500 }
    );
  }
}
