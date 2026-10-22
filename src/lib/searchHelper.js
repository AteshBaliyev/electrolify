/**
 * Electrolify.com - Axtarış və Məhsul Yönləndirmə Köməkçisi
 * Azərbaycan şriftləri (ə, ı, ö, ü, ğ, ş, ç) və açar sözlərə görə dəqiq axtarış
 */

export function normalizeSearchText(str) {
  if (!str) return '';
  return str
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ə/g, 'e')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ğ/g, 'g')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const SEARCHABLE_PRODUCTS = [
  {
    id: '10234502316288',
    title: 'Lumify Pro – Sehrli Bayram İşıqları! 🎄',
    shortTitle: 'Lumify Pro Bayram İşıqları',
    handle: 'lumify-pro-sehrli-bayram-i̇siqlari-🎄',
    category: 'Bayram & Ağıllı İşıqlar',
    price: '24.90',
    compareAtPrice: '39.90',
    discount: '-38%',
    image:
      'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/08338e9d-3bbf-4cc4-9130-2bdee2893246.jpg?v=1792431154',
    badge: '🎄 Yeni',
    keywords: [
      'lumify',
      'lumifypro',
      'bayram',
      'isiq',
      'isiqlari',
      'isıq',
      'işıq',
      'işıqlar',
      'işıqları',
      'lampa',
      'proyektor',
      'projector',
      'led',
      'yeni il',
      'yeniil',
      'saxta baba',
      'şaxta baba',
      'maral',
      'qar denesi',
      'qar dənəsi',
      'milad',
      'dekor',
      'hediyye',
      'hədiyyə',
    ],
  },
  {
    id: '9625190498560',
    title: 'ClarifyPro - Qara Nöqtə Təmizləyici Vakum Cihazı',
    shortTitle: 'ClarifyPro Vakum Cihazı',
    handle: 'clarifypro-qara-noktə-təmizləyici-vakum-cihazi',
    category: 'Dəri Qulluğu & Vakum',
    price: '24.99',
    compareAtPrice: '49.98',
    discount: '-50%',
    image:
      'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/ChatGPTImage26Agu202603_24_34.png?v=1787700289',
    badge: 'Hit',
    keywords: [
      'clarify',
      'clarifypro',
      'vakum',
      'vakuum',
      'qara noqte',
      'qara nöqtə',
      'qara nokte',
      'qara nöktə',
      'qaranöqtə',
      'qaranokte',
      'mesame',
      'məsamə',
      'mesameler',
      'məsamələr',
      'deri',
      'dəri',
      'deri qullugu',
      'dəri qulluğu',
      'uz temizleyici',
      'üz təmizləyici',
      'komedon',
      'akne',
      'blackhead',
      'pore vacuum',
    ],
  },
  {
    id: '9612405702912',
    title: 'İstiƏl — İstilikli Boyun, Bel və Çiyin Masajı',
    shortTitle: 'İstiƏl Masaj Aparatı',
    handle:
      'i̇stiəl-masaj-aparati-i̇stilikli-verən-və-avtomatik-sixaraq-masaj-edən-boyun-bel-və-ciyin-masaj-cihazi',
    category: 'Masaj & Sağlamlıq',
    price: '45.00',
    compareAtPrice: '85.00',
    discount: '-47%',
    image:
      'https://cdn.shopify.com/s/files/1/0852/9418/6752/files/ChatGPT_Image_16_Agu_2026_00_10_34.png?v=1786880634',
    badge: 'Trend',
    keywords: [
      'istiel',
      'istiəl',
      'isti el',
      'isti əl',
      'masaj',
      'masajor',
      'masaj aparati',
      'masaj aparatı',
      'boyun',
      'boyun masaji',
      'boyun masajı',
      'bel',
      'bel masaji',
      'bel masajı',
      'ciyin',
      'çiyin',
      'ciyin masaji',
      'çiyin masajı',
      'kurek',
      'kürək',
      'ezele',
      'əzələ',
      'istilikli',
      'terapevtik',
      'massager',
    ],
  },
];

/**
 * Axtarış sorğusuna görə mağazadakı uyğun məhsulları tapır
 */
export function searchStoreProducts(query, productList = SEARCHABLE_PRODUCTS) {
  const cleanQuery = normalizeSearchText(query);
  if (!cleanQuery) return productList;

  const queryTokens = cleanQuery.split(' ').filter(Boolean);

  const scored = productList
    .map((product) => {
      let score = 0;
      const normTitle = normalizeSearchText(product.title);
      const normHandle = normalizeSearchText(product.handle);
      const normCategory = normalizeSearchText(product.category || '');
      const normKeywords = (product.keywords || []).map(normalizeSearchText);

      // Tam uyğunluq
      if (normTitle.includes(cleanQuery)) score += 50;
      if (normHandle.includes(cleanQuery)) score += 30;
      if (normCategory.includes(cleanQuery)) score += 20;

      // Açar sözlərlə uyğunluq
      for (const kw of normKeywords) {
        if (kw === cleanQuery) score += 60;
        else if (kw.includes(cleanQuery)) score += 30;
        else if (cleanQuery.includes(kw)) score += 25;
      }

      // Hər bir axtarış sözünə (token) görə uyğunluq
      for (const token of queryTokens) {
        if (normTitle.includes(token)) score += 15;
        if (normKeywords.some((kw) => kw.includes(token))) score += 15;
        if (normCategory.includes(token)) score += 10;
      }

      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);

  return scored;
}

/**
 * Axtarış sorğusuna ən uyğun tək məhsulu tapır (Birbaşa keçid üçün)
 */
export function findBestMatchProduct(query, productList = SEARCHABLE_PRODUCTS) {
  const results = searchStoreProducts(query, productList);
  return results.length > 0 ? results[0] : null;
}
