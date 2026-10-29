import { NextResponse } from 'next/server';
import { createShopifyAdminOrder } from '@/lib/shopifyAdmin';

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

    const rawName = (customer.name || customer.firstName || '').trim();
    const nameParts = rawName.split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || 'Müştəri';
    const lastName = nameParts.slice(1).join(' ') || customer.lastName?.trim() || '-';
    const customerFullName = `${firstName} ${lastName === '-' ? '' : lastName}`.trim();
    const phone = customer.phone?.trim() || '';
    const city = customer.city?.trim() || '';
    const postalCode = customer.postalCode?.trim() || '';
    const email = customer.email?.trim() || '';
    const shippingMethod = customer.shippingMethod || 'Standart Çatdırılma';

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

    // Müştərinin şəbəkə və seans məlumatları (Shopify Analytics seanslarını və konversiyanı bağlamaq üçün)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '';
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLanguage = request.headers.get('accept-language') || 'az,en;q=0.9';
    const referringSite = request.headers.get('referer') || 'https://electrolify.com';
    const shopifySessionToken = request.cookies.get('_shopify_s')?.value || customer.sessionToken || '';
    const shopifyBuyerToken = request.cookies.get('_shopify_y')?.value || customer.buyerToken || '';

    // Shopify Admin API inteqrasiyası (Avtomatik token yeniləmə və Shopify panelinə yazma)
    let shopifyOrderId = null;
    let shopifyOrderName = null;

    try {
      const shopifyResult = await createShopifyAdminOrder({
        customer,
        items,
        subtotal,
        shippingFee,
        total,
        paymentType,
        orderNumber,
        clientIp,
        userAgent,
        acceptLanguage,
        referringSite,
        shopifySessionToken,
        shopifyBuyerToken,
      });

      if (shopifyResult.success) {
        shopifyOrderId = shopifyResult.shopifyOrderId;
        shopifyOrderName = shopifyResult.shopifyOrderName;
        console.log(`[Shopify İnteqrasiyası]: Sifariş ${shopifyOrderName} (ID: ${shopifyOrderId}) panelə düşdü!`);
      } else {
        console.error('[Shopify İnteqrasiyası XƏTASI]: Sifariş Shopify panelinə düşmədi:', shopifyResult.error);
        return NextResponse.json(
          {
            success: false,
            error: 'Shopify sistemi sifarişi qəbul etmədi: ' + (typeof shopifyResult.error === 'string' ? shopifyResult.error : JSON.stringify(shopifyResult.error)),
          },
          { status: 502 }
        );
      }
    } catch (shopifyErr) {
      console.error('[Shopify İnteqrasiya Xətası]:', shopifyErr.message);
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
      shopifyOrderName,
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
