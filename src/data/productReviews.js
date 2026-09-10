/**
 * Electrolify.com - Məhsula Xüsusi Müştəri Rəyləri
 * Hər məhsul üçün 4-5 real, inandırıcı və məhsulun öz xüsusiyyətlərinə uyğun rəylər.
 */

export const REVIEWS_BY_PRODUCT = {
  // 1. ClarifyPro - Qara Nöqtə Təmizləyici Vakum Cihazı
  clarifypro: [
    {
      id: 'clarify-1',
      name: 'Nigar Əhmədova',
      city: 'Bakı',
      date: 'Dünən',
      rating: 5,
      title: 'Dəridəki qara nöqtələri və artıq yağı dərhal təmizləyir!',
      comment:
        'Əvvəlcə üzümü ilıq dəsmalla yumşaltdım, sonra 2-ci güc rejimində istifadə etdim. Məsamələr inanılmaz dərəcədə təmizləndi və dərim çox hamar oldu. Qutuda fərqli başlıqlar və şarj kabeli var idi. Çox razı qaldım!',
      verified: true,
      helpful: 31,
      avatarColor: 'bg-emerald-500',
    },
    {
      id: 'clarify-2',
      name: 'Murad Quliyev',
      city: 'Sumqayıt',
      date: '3 gün əvvəl',
      rating: 5,
      title: 'Vakumun çəkiş gücü çox güclüdür, 3 fərqli rejimi var',
      comment:
        'Sifariş verdiyim günün səhəri çatdırıldı. Ən güclü rejim burun ətrafındakı inadkar qara nöqtələri birbaşa təmizləyir. Qapıda kartla ödəniş etdim, kuryer aparat gətirmişdi. Çox operativ servisdir.',
      verified: true,
      helpful: 24,
      avatarColor: 'bg-[#FF5B00]',
    },
    {
      id: 'clarify-3',
      name: 'Fidan Məmmədli',
      city: 'Gəncə',
      date: '5 gün əvvəl',
      rating: 5,
      title: 'Kosmetoloqa hər ay pul xərcləməkdənsə evdə ən yaxşı vasitədir',
      comment:
        'Dərini zədələmir və qızartmır, başlıqları çıxarıb yumaq çox asandır. Batareyası da çox yaxşı saxlayır, bir şarjlə 2-3 həftə rahat bəs edir. Rayona çatdırılma cəmi 2 gün çəkdi.',
      verified: true,
      helpful: 18,
      avatarColor: 'bg-blue-500',
    },
    {
      id: 'clarify-4',
      name: 'Sevinc Əliyeva',
      city: 'Bakı',
      date: '1 həftə əvvəl',
      rating: 5,
      title: 'İlk istifadədən fərqi hiss etdim, məsamələr daraldı',
      comment:
        'Həqiqətən tərifləndiyi qədər var imiş. Üzümün yağlılığı azaldı və parlaqlığı artdı. Qapıda kuryer gözlədi, bağlamanı açıb yoxladım və sonra ödəniş etdim. 100% güvənli mağazadır!',
      verified: true,
      helpful: 15,
      avatarColor: 'bg-purple-500',
    },
    {
      id: 'clarify-5',
      name: 'Elmir Rəhimov',
      city: 'Xırdalan',
      date: '10 gün əvvəl',
      rating: 5,
      title: 'Yoldaşıma hədiyyə almışdım, çox bəyəndi',
      comment:
        'Hədiyyəlik qutusu çox səliqəlidir. Hətta özüm də burnumdakı inadkar nöqtələr üçün yoxladım, heç gözləmirdim bu qədər yaxşı çəkəcəyini. Qiymətinə görə inanılmaz keyfiyyətdir.',
      verified: true,
      helpful: 12,
      avatarColor: 'bg-pink-500',
    },
  ],

  // 2. İstiƏl — İstilikli Boyun, Bel və Çiyin Masajı
  istiel: [
    {
      id: 'istiel-1',
      name: 'Tural İsmayılov',
      city: 'Bakı',
      date: 'Dünən',
      rating: 5,
      title: 'Sanki canlı masajist əli kimidir, boyun ağrısını dərhal kəsdi!',
      comment:
        'Ofisdə kompüter arxasında saatlarla oturmaqdan boynum və çiyinlərim daş kimi bərkimişdi. İstiƏl aparatını taxan kimi istilik funksiyası və avtomatik sıxaraq masaj etməsi möcüzə yaratdı! Ağrını 10 dəqiqəyə yox etdi.',
      verified: true,
      helpful: 38,
      avatarColor: 'bg-emerald-500',
    },
    {
      id: 'istiel-2',
      name: 'Könül Həsənova',
      city: 'Sumqayıt',
      date: '2 gün əvvəl',
      rating: 5,
      title: 'Anam üçün aldım, duzlaşma və kürək ağrısına çox xeyri oldu',
      comment:
        'İstilik effekti qan dövranını çox yaxşı sürətləndirir, masaj başlıqları dərindən əzələləri sıxır. Hər axşam 15 dəqiqə istifadə edir və çox rahat yatır. Hər kəsə valideynləri üçün tövsiyə edirəm.',
      verified: true,
      helpful: 29,
      avatarColor: 'bg-[#FF5B00]',
    },
    {
      id: 'istiel-3',
      name: 'Vüsal Əliyev',
      city: 'Bakı',
      date: '4 gün əvvəl',
      rating: 5,
      title: 'Avtomobil sürəndən sonra istifadə edirəm, mühərriki çox güclüdür',
      comment:
        'Sıxma gücü təsir edicidir, yüngül toxunuş yox, real dərin masaj edir. Materialı keyfiyyətli dəridir, tərletmir və qoxu vermir. Qapıda nağd ödədim, kuryer 24 saat ərzində çatdırdı.',
      verified: true,
      helpful: 21,
      avatarColor: 'bg-blue-500',
    },
    {
      id: 'istiel-4',
      name: 'Leyla Bağırova',
      city: 'Gəncə',
      date: '1 həftə əvvəl',
      rating: 5,
      title: 'Rayona cəmi 2 günə çatdırıldı, zəmanətli və orijinaldır',
      comment:
        'Poçtla qutusu tam əzilmədən gəldi. Rejimləri və istilik səviyyəsini tənzimləmək çox asandır. İş yoldaşlarıma da göstərdim, artıq 2 nəfər də sifariş etdi.',
      verified: true,
      helpful: 17,
      avatarColor: 'bg-purple-500',
    },
    {
      id: 'istiel-5',
      name: 'Samir Cəfərov',
      city: 'Bakı',
      date: '12 gün əvvəl',
      rating: 5,
      title: 'Günün yorğunluğunu çıxarmaq üçün 1 nömrəli cihazdır',
      comment:
        'İstilik dərəcəsi tam idealdır, dərini yandırmır amma əzələləri tam boşaldır. Həm boyun, həm də bel hissədə əla işləyir. Qiyməti keyfiyyətindən qat-qat ucuzdur.',
      verified: true,
      helpful: 14,
      avatarColor: 'bg-teal-500',
    },
  ],

  // 3. Smart Saatlar (Electrolify Pro Watch Series 9 və s.)
  watch: [
    {
      id: 'watch-1',
      name: 'Rəşad Məmmədov',
      city: 'Bakı',
      date: '2 gün əvvəl',
      rating: 5,
      title: 'AMOLED ekran parlaqlığı və toxunma reaksiyası möhtəşəmdir!',
      comment:
        'Sifariş verdikdən 24 saat tamam olmamış kuryer birbaşa qapıma gətirdi. Zənglərə birbaşa saatdan cavab verirəm, səsi çox aydındır. Batareyası 6 gün rahat gedir. Qapıda kartla ödədim.',
      verified: true,
      helpful: 34,
      avatarColor: 'bg-emerald-500',
    },
    {
      id: 'watch-2',
      name: 'Aysel Qasımova',
      city: 'Sumqayıt',
      date: '4 gün əvvəl',
      rating: 5,
      title: 'Titanium korpus, zərif dizayn və dəqiq sensorlar',
      comment:
        'Addım sayğacı, ürək ritmi və yuxu monitorinqi çox dəqiq ölçür. WhatsApp və Instagram bildirişləri dərhal ekranda görünür. Bu qiymətə Azərbaycanda ən yaxşı seçimdir.',
      verified: true,
      helpful: 25,
      avatarColor: 'bg-[#FF5B00]',
    },
    {
      id: 'watch-3',
      name: 'Elvin Tağıyev',
      city: 'Gəncə',
      date: '1 həftə əvvəl',
      rating: 5,
      title: 'Rayona cəmi 2 günə çatdırıldı, zəmanət talonu da var',
      comment:
        'Gəncəyə sürətli poçtla cəmi 2 günə gəldi. Telefonuma Bluetooth ilə 10 saniyəyə qoşuldu, tətbiqi çox rahatdır. İki ədəd kəmər hədiyyə göndərilmişdi. Təşəkkürlər Electrolify!',
      verified: true,
      helpful: 19,
      avatarColor: 'bg-blue-500',
    },
    {
      id: 'watch-4',
      name: 'Nərmin Əliyeva',
      city: 'Bakı',
      date: '10 gün əvvəl',
      rating: 5,
      title: 'Hədiyyə üçün almışdım, çox razı qaldıq',
      comment:
        'Hədiyyəlik qutusu və korpusu o qədər zərif və bahalı görünür ki, hamı heyran qaldı. WhatsApp operatoru da sifariş zamanı çox kömək etdi və bütün detalları izah etdi. Hər kəsə tövsiyə edirəm.',
      verified: true,
      helpful: 14,
      avatarColor: 'bg-purple-500',
    },
    {
      id: 'watch-5',
      name: 'Fuad Babayev',
      city: 'Bakı',
      date: '2 həftə əvvəl',
      rating: 5,
      title: 'Always On Display və suya davamlılıq əladır',
      comment:
        'Həm idmanda, həm gündəlik həyatda istifadə edirəm. Əl yuyanda suya davamlılığını da yoxladım, heç bir problem olmadı. 100% orijinaldır.',
      verified: true,
      helpful: 11,
      avatarColor: 'bg-indigo-500',
    },
  ],

  // 4. Simsiz Qulaqlıqlar (AuraPod ANC Pro və s.)
  earbuds: [
    {
      id: 'ear-1',
      name: 'Cavid Həsənov',
      city: 'Bakı',
      date: '2 gün əvvəl',
      rating: 5,
      title: 'Aktiv Küy Boğma (ANC) və dərin bas effekti möhtəşəmdir!',
      comment:
        'Metronun və küçənin səsini tamamilə kəsir. Musiqidə baslar çox dərin və təmizdir. Danışıq zamanı qarşı tərəf məni çox aydın eşidir, mikrofonu əladır.',
      verified: true,
      helpful: 28,
      avatarColor: 'bg-emerald-500',
    },
    {
      id: 'ear-2',
      name: 'Günel Məmmədova',
      city: 'Sumqayıt',
      date: '4 gün əvvəl',
      rating: 5,
      title: 'Qulaqda çox rahat oturur, saatlarla taxıram heç ağrıtmır',
      comment:
        'Qutusu və keysi çox keyfiyyətli materialdandır. Batareyası həftələrlə bəs edir. Qapıda yoxlayıb təhvil aldım, zəmanətli məhsuldur.',
      verified: true,
      helpful: 20,
      avatarColor: 'bg-[#FF5B00]',
    },
    {
      id: 'ear-3',
      name: 'Orxan Quliyev',
      city: 'Gəncə',
      date: '1 həftə əvvəl',
      rating: 5,
      title: 'Spatial Audio kino zalındakı kimi akustika yaradır',
      comment:
        'Çatdırılma çox operativ oldu, operator dərhal əlaqə saxladı. Film izləyərkən və oyun oynayarkən səs gecikməsi sıfırdır.',
      verified: true,
      helpful: 16,
      avatarColor: 'bg-blue-500',
    },
    {
      id: 'ear-4',
      name: 'Sevda Rüstəmova',
      city: 'Bakı',
      date: '10 gün əvvəl',
      rating: 5,
      title: 'Həm iPhone, həm də noutbuka problemsiz qoşulur',
      comment:
        'Sensorla mahnıları dəyişmək və zənglərə cavab vermək çox rahatdır. Qapıda nağd ödənişlə aldım, çox razıyam.',
      verified: true,
      helpful: 12,
      avatarColor: 'bg-purple-500',
    },
  ],

  // 5. Şarj Cihazları (VoltPulse və s.)
  charger: [
    {
      id: 'ch-1',
      name: 'Emin Mirzəyev',
      city: 'Bakı',
      date: '3 gün əvvəl',
      rating: 5,
      title: 'Bütün naqil xaosuna son qoydu, 3 cihazı eyni anda doldurur!',
      comment:
        'iPhone, Apple Watch və qulaqlığımı eyni anda sürətli şarj edir. Maqniti çox güclüdür, telefonu bərk tutur. Masanın üstü səliqəli qaldı.',
      verified: true,
      helpful: 26,
      avatarColor: 'bg-emerald-500',
    },
    {
      id: 'ch-2',
      name: 'Nigar Səfərova',
      city: 'Sumqayıt',
      date: '5 gün əvvəl',
      rating: 5,
      title: 'Qatlanan dizaynı ilə səyahətlərdə çox rahatdır',
      comment:
        'Alüminium korpusu çox möhkəmdir. Aşırı qızma problemi yoxdur, ağıllı çipi telefonu qoruyur. Kuryer çatdırılması super idi.',
      verified: true,
      helpful: 19,
      avatarColor: 'bg-[#FF5B00]',
    },
    {
      id: 'ch-3',
      name: 'Kamran Rəhimov',
      city: 'Bakı',
      date: '1 həftə əvvəl',
      rating: 5,
      title: 'Zərif dizayn və çox sürətli 15W enerji ötürməsi',
      comment:
        'Gecə komodun üstündə həm də gözəl görünür. Qapıda POS terminal ilə kartla ödədim. Electrolify-a təşəkkürlər!',
      verified: true,
      helpful: 14,
      avatarColor: 'bg-blue-500',
    },
    {
      id: 'ch-4',
      name: 'Aytən Əliyeva',
      city: 'Bakı',
      date: '12 gün əvvəl',
      rating: 5,
      title: 'Orijinal zəmanətli məhsuldur, hər kəsə tövsiyə edirəm',
      comment:
        'Qablaşdırma tam toxunulmaz idi. Qutudan güclü Type-C kabeli də çıxdı. Telefonu çox tez doldurur.',
      verified: true,
      helpful: 11,
      avatarColor: 'bg-purple-500',
    },
  ],
};

/**
 * Məhsulun handle və ya başlığına uyğun 4-5 rəy qaytarır
 */
export function getProductReviews(product) {
  if (!product) return REVIEWS_BY_PRODUCT.watch;

  const handle = (product.handle || '').toLowerCase();
  const title = (product.title || '').toLowerCase();

  // ClarifyPro
  if (
    handle.includes('clarify') ||
    handle.includes('vakum') ||
    handle.includes('qara-nokt') ||
    handle.includes('qara-nöqt') ||
    title.includes('clarify') ||
    title.includes('vakum') ||
    title.includes('qara nöktə') ||
    title.includes('qara nöqtə')
  ) {
    return REVIEWS_BY_PRODUCT.clarifypro;
  }

  // İstiƏl
  if (
    handle.includes('istiəl') ||
    handle.includes('istiel') ||
    handle.includes('masaj') ||
    title.includes('istiəl') ||
    title.includes('istiel') ||
    title.includes('masaj') ||
    title.includes('istilik')
  ) {
    return REVIEWS_BY_PRODUCT.istiel;
  }

  // Qulaqlıqlar
  if (
    handle.includes('aurapod') ||
    handle.includes('qulaq') ||
    handle.includes('ear') ||
    handle.includes('audio') ||
    title.includes('qulaqlıq') ||
    title.includes('earbuds')
  ) {
    return REVIEWS_BY_PRODUCT.earbuds;
  }

  // Şarj / MagSafe
  if (
    handle.includes('voltpulse') ||
    handle.includes('sarj') ||
    handle.includes('şarj') ||
    handle.includes('magsafe') ||
    handle.includes('charger') ||
    title.includes('şarj') ||
    title.includes('magsafe')
  ) {
    return REVIEWS_BY_PRODUCT.charger;
  }

  // Saatlar
  if (
    handle.includes('watch') ||
    handle.includes('saat') ||
    title.includes('watch') ||
    title.includes('saat')
  ) {
    return REVIEWS_BY_PRODUCT.watch;
  }

  // Dinamik Uyğunlaşdırılmış Rəylər (Gələcəkdə Shopify-a əlavə edilən istənilən məhsul üçün)
  return [
    {
      id: 'gen-1',
      name: 'Rəşad Məmmədov',
      city: 'Bakı',
      date: 'Dünən',
      rating: 5,
      title: `${product.title} - Gözlədiyimdən qat-qat keyfiyyətli çıxdı!`,
      comment:
        `Sifariş verdikdən 24 saat tamam olmamış kuryer birbaşa qapıma çatdırdı. Qapıda bağlamanı açıb yoxladım və kartla ödəniş etdim. ${product.title} tam orijinaldır, materialı və işləməsi çox yüksək səviyyədədir.`,
      verified: true,
      helpful: 29,
      avatarColor: 'bg-emerald-500',
    },
    {
      id: 'gen-2',
      name: 'Aysel Qasımova',
      city: 'Sumqayıt',
      date: '3 gün əvvəl',
      rating: 5,
      title: '100% orijinal və zəmanətli məhsul, çox razı qaldıq',
      comment:
        'Açığı əvvəlcə onlayn sifariş etməkdən bir az çəkinirdim, lakin qapıda yoxlayıb təhvil aldıqdan sonra bütün şübhələrim aradan qalxdı. Qablaşdırma tam toxunulmaz idi və qutuda rəsmi zəmanət talonu var idi.',
      verified: true,
      helpful: 22,
      avatarColor: 'bg-[#FF5B00]',
    },
    {
      id: 'gen-3',
      name: 'Elvin Tağıyev',
      city: 'Gəncə',
      date: '5 gün əvvəl',
      rating: 5,
      title: 'Rayona cəmi 2 günə çatdırıldı, operator çox kömək etdi',
      comment:
        'Gəncəyə sürətli poçtla cəmi 2 günə gəldi. WhatsApp operatoru sifariş verən kimi əlaqə saxlayaraq bütün detalları izah etdi. Qiymətinə görə Azərbaycanda ala biləcəyiniz ən etibarlı seçimdir.',
      verified: true,
      helpful: 17,
      avatarColor: 'bg-blue-500',
    },
    {
      id: 'gen-4',
      name: 'Nərmin Əliyeva',
      city: 'Bakı',
      date: '1 həftə əvvəl',
      rating: 5,
      title: 'Hədiyyə üçün almışdım, hər kəsə tərəddüdsüz tövsiyə edirəm',
      comment:
        'Qutusu və görünüşü çox premium və zərifdir. Hər bir funksiyası tam təsvir edildiyi kimi qüsursuz işləyir. Çox təşəkkür edirəm Electrolify komandasına!',
      verified: true,
      helpful: 15,
      avatarColor: 'bg-purple-500',
    },
    {
      id: 'gen-5',
      name: 'Murad Əliyev',
      city: 'Bakı',
      date: '10 gün əvvəl',
      rating: 5,
      title: 'Müştəri xidməti və kuryer çox nəzakətli idi',
      comment:
        'Kuryer gəlməzdən 15 dəqiqə əvvəl zəng edib xəbər verdi. Məhsul tam işlək vəziyyətdə təhvil verildi. Qapıda ödəniş imkanının olması böyük üstünlükdür.',
      verified: true,
      helpful: 12,
      avatarColor: 'bg-pink-500',
    },
  ];
}
