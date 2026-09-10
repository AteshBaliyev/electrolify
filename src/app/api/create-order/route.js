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
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-04';

    let shopifyOrderId = null;

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
            line_items: items.map((item) => ({
              title: item.title,
              quantity: item.quantity,
              price: item.price,
              name: `${item.title} - ${item.variantTitle || 'Standart'}`,
            })),
            customer: {
              first_name: firstName,
              last_name: lastName,
              phone: phone,
              email: email || undefined,
            },
            shipping_address: {
              first_name: firstName,
              last_name: lastName,
              address1: fullAddress,
              city: city,
              zip: postalCode,
              phone: phone,
              country: 'Azerbaijan',
            },
            financial_status: 'pending', // Qapıda ödəniş olduğu üçün gözləmədə
            gateway: 'Cash on Delivery (Qapıda Ödəniş)',
            note: `Electrolify.az COD Sifarişi. Çatdırılma: ${shippingMethod}. Ödəniş üsulu: ${paymentType}`,
            tags: 'COD, Electrolify, Azerbaijan',
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
          console.log(`[Shopify Admin API]: Sifariş Shopify-a yazıldı! ID: ${shopifyOrderId}`);
        } else {
          console.warn('[Shopify Admin API]: Xəbərdarlıq:', shopifyJson);
        }
      } catch (adminErr) {
        console.error('[Shopify Admin API Xətası]:', adminErr.message);
      }
    } else {
      console.log(
        '[Electrolify Backend]: Shopify Admin API tokeni daxil edilməyib, daxili emal rejimində icra edildi.'
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
