/**
 * Electrolify - Dinamik Məhsul Rəng və Dizayn Mövzuları (Product Theming)
 * Hər bir məhsulun öz vizual rənglərinə və şəkillərindəki vurğulara uyğun unikal rəng sxemi.
 */

export const PRODUCT_THEMES = {
  // ClarifyPro - Qara Nöktə Vakum Cihazı (Şəkildəki "50% ENDİRİM" canlı magenta / fuchsia rəngi)
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

  // Standart / Fallback Electrolify Narıncısı
  default: {
    id: 'default',
    name: 'Electrolify Default',
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
