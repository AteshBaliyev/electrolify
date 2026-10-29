/**
 * Trendim - Dinamik Məhsul Rəng və Dizayn Mövzuları (Product Theming)
 * Hər bir məhsulun öz vizual rənglərinə və şəkillərindəki vurğulara uyğun unikal rəng sxemi.
 */

export const PRODUCT_THEMES = {
  // ClarifyPro - Qara Nöqtə Vakum Cihazı (Şəkildəki "50% ENDİRİM" canlı magenta / fuchsia rəngi)
  clarify: {
    id: 'clarify',
    name: 'ClarifyPro Magenta',
    primary: '#F524AD',
    primaryHover: '#D61293',
    primaryActive: '#B80B7C',
    primaryLight: '#FDF2F8',         // pink-50 (Açıq zərif fon)
    primaryLightHover: '#FCE7F3',    // pink-100
    primaryBorder: '#FBCFE8',        // pink-200 (Zərif kənar)
    primaryBorderStrong: '#F524AD',  // Əsas kənar
    primaryText: '#F524AD',
    primaryGlow: 'rgba(245, 36, 173, 0.35)',
    ring: 'rgba(245, 36, 173, 0.25)',
    gradient: 'from-[#F524AD] to-[#D61293]',
    urgencyBg: 'bg-pink-50/80',
    urgencyBorder: 'border-pink-200/90',
    urgencyText: 'text-pink-900',
    urgencyIcon: 'text-[#F524AD]',
    tickerBadgeBg: 'bg-[#F524AD]/20',
    tickerBadgeText: 'text-[#F524AD]',
    tickerStar: 'text-[#F524AD]',
    accentBadgeBg: 'bg-[#FDF2F8]',
    accentBadgeText: 'text-[#F524AD]',
    accentBadgeBorder: 'border-[#FBCFE8]',
  },

  // İstiƏl - İstilikli Masaj Cihazı (İstilik/Termal hissi verən alovlu narıncı)
  istiel: {
    id: 'istiel',
    name: 'İstiƏl Warm Orange',
    primary: '#FF5B00',
    primaryHover: '#E64D00',
    primaryActive: '#CC4400',
    primaryLight: '#FFF7ED',         // orange-50
    primaryLightHover: '#FFEDD5',    // orange-100
    primaryBorder: '#FED7AA',        // orange-200
    primaryBorderStrong: '#FF5B00',
    primaryText: '#FF5B00',
    primaryGlow: 'rgba(255, 91, 0, 0.35)',
    ring: 'rgba(255, 91, 0, 0.25)',
    gradient: 'from-[#FF5B00] to-[#E64D00]',
    urgencyBg: 'bg-amber-50/80',
    urgencyBorder: 'border-amber-200/90',
    urgencyText: 'text-amber-900',
    urgencyIcon: 'text-amber-600',
    tickerBadgeBg: 'bg-[#FF5B00]/20',
    tickerBadgeText: 'text-[#FF5B00]',
    tickerStar: 'text-[#FF5B00]',
    accentBadgeBg: 'bg-[#FFF7ED]',
    accentBadgeText: 'text-[#FF5B00]',
    accentBadgeBorder: 'border-[#FED7AA]',
  },

  // Lumify Pro - Sehrli Bayram İşıqları (Gözoxşayan Sehrli Kosmik Bənövşəyi / İndiqo İşıq mövzusu)
  lumify: {
    id: 'lumify',
    name: 'Lumify Pro Festive Indigo',
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    primaryActive: '#4338CA',
    primaryLight: '#EEF2FF',         // indigo-50
    primaryLightHover: '#E0E7FF',    // indigo-100
    primaryBorder: '#C7D2FE',        // indigo-200
    primaryBorderStrong: '#6366F1',
    primaryText: '#4F46E5',
    primaryGlow: 'rgba(99, 102, 241, 0.35)',
    ring: 'rgba(99, 102, 241, 0.25)',
    gradient: 'from-[#6366F1] via-[#7C3AED] to-[#4F46E5]',
    urgencyBg: 'bg-indigo-50/80',
    urgencyBorder: 'border-indigo-200/90',
    urgencyText: 'text-indigo-950',
    urgencyIcon: 'text-[#6366F1]',
    tickerBadgeBg: 'bg-[#6366F1]/20',
    tickerBadgeText: 'text-[#4F46E5]',
    tickerStar: 'text-[#6366F1]',
    accentBadgeBg: 'bg-[#EEF2FF]',
    accentBadgeText: 'text-[#4F46E5]',
    accentBadgeBorder: 'border-[#C7D2FE]',
  },

  // Glowify Pro - Ağıllı Rəngarəng Atmosfer və Hava Nəmləndirici (Canlı Kiber Siyan / Neon Okean RGB Mövzusu)
  glowify: {
    id: 'glowify',
    name: 'Glowify Pro Ambient Cyan',
    primary: '#0891B2',              // cyan-600
    primaryHover: '#0E7490',         // cyan-700
    primaryActive: '#155E75',        // cyan-800
    primaryLight: '#ECFEFF',         // cyan-50
    primaryLightHover: '#CFFAFE',    // cyan-100
    primaryBorder: '#A5F3FC',        // cyan-200
    primaryBorderStrong: '#0891B2',
    primaryText: '#0891B2',
    primaryGlow: 'rgba(8, 145, 178, 0.35)',
    ring: 'rgba(8, 145, 178, 0.25)',
    gradient: 'from-[#06B6D4] via-[#0891B2] to-[#0E7490]',
    urgencyBg: 'bg-cyan-50/80',
    urgencyBorder: 'border-cyan-200/90',
    urgencyText: 'text-cyan-950',
    urgencyIcon: 'text-[#0891B2]',
    tickerBadgeBg: 'bg-[#0891B2]/20',
    tickerBadgeText: 'text-[#0891B2]',
    tickerStar: 'text-[#0891B2]',
    accentBadgeBg: 'bg-[#ECFEFF]',
    accentBadgeText: 'text-[#0891B2]',
    accentBadgeBorder: 'border-[#A5F3FC]',
  },

  // Standart / Fallback Trendim
  default: {
    id: 'default',
    name: 'Trendim Default',
    primary: '#FF5B00',
    primaryHover: '#E64D00',
    primaryActive: '#CC4400',
    primaryLight: '#FFF7ED',
    primaryLightHover: '#FFEDD5',
    primaryBorder: '#FED7AA',
    primaryBorderStrong: '#FF5B00',
    primaryText: '#FF5B00',
    primaryGlow: 'rgba(255, 91, 0, 0.35)',
    ring: 'rgba(255, 91, 0, 0.25)',
    gradient: 'from-[#FF5B00] to-[#E64D00]',
    urgencyBg: 'bg-amber-50/80',
    urgencyBorder: 'border-amber-200/90',
    urgencyText: 'text-amber-900',
    urgencyIcon: 'text-amber-600',
    tickerBadgeBg: 'bg-[#FF5B00]/20',
    tickerBadgeText: 'text-[#FF5B00]',
    tickerStar: 'text-[#FF5B00]',
    accentBadgeBg: 'bg-[#FFF7ED]',
    accentBadgeText: 'text-[#FF5B00]',
    accentBadgeBorder: 'border-[#FED7AA]',
  },
};

/**
 * Verilmiş məhsula və ya handle-a uyğun dizayn mövzusunu qaytarır
 */
export function getProductTheme(productOrHandle) {
  if (!productOrHandle) return PRODUCT_THEMES.default;

  const handle = (
    typeof productOrHandle === 'string'
      ? productOrHandle
      : productOrHandle?.handle || productOrHandle?.title || ''
  ).toLowerCase();

  const title = (
    typeof productOrHandle === 'object' ? productOrHandle?.title || '' : ''
  ).toLowerCase();

  // Glowify Pro Ağıllı Hava Nəmləndirici (Canlı Kiber Siyan / RGB Atmosfer)
  if (
    handle.includes('glowify') ||
    handle.includes('nemlendirici') ||
    handle.includes('nəmləndirici') ||
    handle.includes('humidifier') ||
    handle.includes('diffuzor') ||
    title.includes('glowify') ||
    title.includes('nəmləndirici') ||
    title.includes('hava')
  ) {
    return PRODUCT_THEMES.glowify;
  }

  // Lumify Pro Sehrli Bayram İşıqları (Sehrli İndiqo / Bənövşəyi tonu)
  if (
    handle.includes('lumify') ||
    handle.includes('bayram') ||
    handle.includes('i̇siqlari') ||
    handle.includes('isiq') ||
    handle.includes('işıq') ||
    handle.includes('proyektor') ||
    title.includes('lumify') ||
    title.includes('bayram') ||
    title.includes('işıq')
  ) {
    return PRODUCT_THEMES.lumify;
  }

  // Clarify Pro Vakum Cihazı (Şəkildəki çəhrayı/magenta 50% ENDİRİM tonu)
  if (
    handle.includes('clarify') ||
    handle.includes('vakum') ||
    handle.includes('qara') ||
    title.includes('clarify') ||
    title.includes('vakum') ||
    title.includes('qara')
  ) {
    return PRODUCT_THEMES.clarify;
  }

  // İstiƏl Masaj Cihazı (İstilik/Termal narıncı tonu)
  if (
    handle.includes('isti') ||
    handle.includes('masaj') ||
    title.includes('isti') ||
    title.includes('masaj')
  ) {
    return PRODUCT_THEMES.istiel;
  }

  return PRODUCT_THEMES.default;
}
