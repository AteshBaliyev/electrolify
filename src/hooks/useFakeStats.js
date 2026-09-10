'use client';

import { useState, useEffect } from 'react';

/**
 * Electrolify.com - Yüksək Konversiya və Sosial Sübut (Social Proof) Hook-u
 *
 * Bu hook səhifə açıldıqda və ya məhsul dəyişdikdə psixoloji təkan verən
 * təsadüfi statistikaları generasiya edir və real vaxt rejimində canlı izləyici dalğalanması yaradır.
 *
 * SSR Hidratasiya (Hydration Mismatch) problemlərinin qarşısını almaq üçün
 * client-side montajdan (mounted) sonra aktivləşir.
 *
 * @param {Object} options - Tənzimləmələr
 * @param {string|number} options.productId - Məhsul identifikatoru (sabitlik üçün əlavə edilə bilər)
 * @param {boolean} options.liveViewers - Canlı izləyici sayının zamanla dəyişməsi (default: true)
 */
export function useFakeStats({ productId = '', liveViewers = true } = {}) {
  const [isMounted, setIsMounted] = useState(false);

  // Sabit default dəyərlər (SSR üçün)
  const [stats, setStats] = useState({
    likes: 342,
    viewers: 28,
    soldLast24Hours: 37,
    stockLeft: 4,
    rating: 4.9,
    reviewsCount: 184,
  });

  // Təsadüfi aralıq köməkçisi
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(() => {
    setIsMounted(true);

    // İlk generasiya: Tələb olunan aralıqlar
    // Bəyənilmə: 120 - 500
    // Hazırda baxanlar: 15 - 40
    // Son 24 saatda satılan: 10 - 50
    // Qalan stok: 2 - 7
    const initialLikes = getRandomInt(120, 500);
    const initialViewers = getRandomInt(15, 40);
    const initialSold = getRandomInt(10, 50);
    const initialStock = getRandomInt(2, 7);
    const initialReviews = getRandomInt(95, 280);

    setStats({
      likes: initialLikes,
      viewers: initialViewers,
      soldLast24Hours: initialSold,
      stockLeft: initialStock,
      rating: 4.9,
      reviewsCount: initialReviews,
    });

    if (!liveViewers) return;

    // Real-vaxt canlı izləyici dalğalanması: Hər 4-7 saniyədən bir ±1 və ya ±2 dəyişir (15-40 aralığında qalır)
    const interval = setInterval(() => {
      setStats((prev) => {
        const delta = getRandomInt(-2, 2);
        let newViewers = prev.viewers + delta;
        if (newViewers < 15) newViewers = 16;
        if (newViewers > 40) newViewers = 39;
        return {
          ...prev,
          viewers: newViewers,
        };
      });
    }, getRandomInt(4000, 7000));

    return () => clearInterval(interval);
  }, [productId, liveViewers]);

  return {
    isMounted,
    // Ədədi dəyərlər
    likes: stats.likes,
    viewers: stats.viewers,
    soldLast24Hours: stats.soldLast24Hours,
    stockLeft: stats.stockLeft,
    rating: stats.rating,
    reviewsCount: stats.reviewsCount,

    // Azərbaycan dilində hazır sosial sübut və tələskənlik (FOMO) mətnləri
    texts: {
      viewersText: `Hazırda ${stats.viewers} nəfər bu məhsula baxır`,
      soldText: `Son 24 saatda ${stats.soldLast24Hours} ədəd satıldı`,
      likesText: `${stats.likes} alıcı bu məhsulu bəyəndi`,
      stockText: `Tələsin! Stokda yalnız ${stats.stockLeft} ədəd qaldı!`,
      ratingText: `${stats.rating} / 5.0 (${stats.reviewsCount} rəy)`,
      deliveryBadgeText: '24 saat ərzində sürətli və pulsuz çatdırılma',
      guaranteeText: '14 gün ərzində 100% pulun geri qaytarılması zəmanəti',
    },
  };
}

export default useFakeStats;
