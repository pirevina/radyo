/**
 * RADYO KIRKYAMA JOURNAL — BOĞAZİÇİ KOLEJİ
 * Saf Vanilla JavaScript Müzik & Kültür Yayını Motoru
 * Mimari: Editorial Dergi & Sanat Kürasyonu, Telegram MTProto Stream, Media Session API
 */

(function () {
  'use strict';

  // ==========================================================================
  // CANLI YAYIN SUNUCUSU VE BAĞLANTI AYARLARI
  // ==========================================================================
  const LIVE_RENDER_URL = 'https://radyo-kirkyama-stream.onrender.com';
  let initialServerUrl = localStorage.getItem('kirkyama_server_url');
  if (!initialServerUrl || initialServerUrl.includes('localhost')) {
    initialServerUrl = LIVE_RENDER_URL;
    localStorage.setItem('kirkyama_server_url', LIVE_RENDER_URL);
  }

  // ==========================================================================
  // GÖMÜLÜ REPERTUAR LİSTESİ (Çevrimdışı & Yerel file:// Güvencesi)
  // ==========================================================================
  const EMBEDDED_SONGS = [
  {
    "id": 114,
    "messageId": 14,
    "title": "Halil İbrahim Sofrası",
    "artist": "Barış Manço",
    "album": "Halil İbrahim Sofrası",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:43",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Anadolu'nun kadim cömertlik, tevazu ve adalet felsefesini simgeleyen; her dizesi atasözü derinliğinde bir ahlak ve vicdan manifestosu.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/14"
  },
  {
    "id": 115,
    "messageId": 15,
    "title": "İşte Hendek İşte Deve",
    "artist": "Barış Manço",
    "album": "Dünden Bugüne",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:30",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Türk halk edebiyatının hiciv geleneğini sert davul-bas ritimleri ve saykodelik gitar motifleriyle taçlandıran öncü bir parça.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/15"
  },
  {
    "id": 116,
    "messageId": 16,
    "title": "Kara Haber",
    "artist": "Barış Manço",
    "album": "Değmesin Yağlı Boya",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:44",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Hüzün ve ayrılığın melankolisini Barış Manço'nun derin bariton vokali ve dokunaklı klavye düzenlemeleriyle anlatan unutulmaz bir ağıt.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/16"
  },
  {
    "id": 117,
    "messageId": 17,
    "title": "Kara Sevda",
    "artist": "Barış Manço",
    "album": "Darısı Başınıza",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:47",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "80'ler Türk pop-rock döneminin en dinamik hiti; synthesizer riffleri, elektro gitarlar ve tutkulu nakaratıyla nesilleri peşinden sürükleyen bir başyapıt.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/17"
  },
  {
    "id": 118,
    "messageId": 18,
    "title": "Kazma",
    "artist": "Barış Manço",
    "album": "Sözüm Meclisten Dışarı",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:37",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Cehalet ve gösteriş budalalığına karşı kaleme alınmış, neşeli funk altyapısı ve mizahi dizeleriyle düşündüren bir toplumsal taşlama.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/18"
  },
  {
    "id": 119,
    "messageId": 19,
    "title": "Kol Düğmeleri",
    "artist": "Barış Manço",
    "album": "Dünden Bugüne",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:15",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Barış Manço'nun gençlik yıllarında bestelediği ilk şaheser; kavuşamayan iki sevgilinin hikayesini iki sedef kol düğmesiyle ebedileştiren şiirsel bir masal.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/19"
  },
  {
    "id": 120,
    "messageId": 20,
    "title": "Nazar Eyle",
    "artist": "Barış Manço",
    "album": "Saklambaç",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:11",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Geleneksel Anadolu mistisizmini funk-rock tınıları ve Kurtalan Ekspres'in enerjik üflemelileriyle buluşturan büyüleyici bir klasik.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/20"
  },
  {
    "id": 121,
    "messageId": 21,
    "title": "Nick The Chopper",
    "artist": "Barış Manço",
    "album": "Baris Mancho",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:30",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Doğa katliamına ve ormanları yok eden oduncu Nick'e karşı tabiatın başkaldırısını anlatan, progresif rock orkestrasyonuyla dünya çapında ses getirmiş İngilizce eser.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/21"
  },
  {
    "id": 122,
    "messageId": 22,
    "title": "Sarı Çizmeli Mehmet Ağa",
    "artist": "Barış Manço",
    "album": "Yeni Bir Gün",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:59",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "'Yaz dostum, yoksul görsen besle kayır...' dizeleriyle Anadolu hümanizmini ve dayanışma kültürünü nakış gibi işleyen ölümsüz bir başyapıt.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/22"
  },
  {
    "id": 123,
    "messageId": 23,
    "title": "Söyle Zalim Sultan",
    "artist": "Barış Manço",
    "album": "24 Ayar",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:01",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Zulme ve vefasızlığa karşı mağrur bir serzeniş; modern synthesizer altyapısı ve Barış Manço'nun feryat eden vokaliyle derin bir yakarış.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/23"
  },
  {
    "id": 124,
    "messageId": 24,
    "title": "Unutamadım",
    "artist": "Barış Manço",
    "album": "Değmesin Yağlı Boya",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:25",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Türk müziğinin en hüzünlü ve en samimi aşk baladlarından biri; piyano ve yaylıların eşliğinde zamana direnen bir vefa yemini.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/24"
  },
  {
    "id": 125,
    "messageId": 25,
    "title": "Yeni Bir Gün Doğdu Merhaba",
    "artist": "Barış Manço",
    "album": "Yeni Bir Gün",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "08:48",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Türk progresif rock tarihinin zirvesi; Kurtalan Ekspres'in destansı Moog partisyonları ve senfonik geçişleriyle umut dolu bir uyanış süiti.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/25"
  },
  {
    "id": 126,
    "messageId": 26,
    "title": "Ahmet Beyin Ceketi",
    "artist": "Barış Manço",
    "album": "Darısı Başınıza",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "05:41",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Maddi hırslardan arınmış sade bir insanın erdemini anlatan, zengin gitar aranjmanı ve felsefi anlatımıyla kalplere kazınan bir hayat dersi.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/26"
  },
  {
    "id": 127,
    "messageId": 27,
    "title": "Ali Yazar Veli Bozar",
    "artist": "Barış Manço",
    "album": "Sahibinden İhtiyaçtan",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:42",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Kültürümüzün tekerleme ve deyimlerini eğlenceli ve eleştirel bir dille harmanlayan, ritmik ve sürükleyici bir editoryal parça.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/27"
  },
  {
    "id": 128,
    "messageId": 28,
    "title": "Alla Beni Pulla Beni",
    "artist": "Barış Manço",
    "album": "Estağfurullah... Ne Haddimize!",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:05",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Geleneksel kına ve evlilik merasimlerinin samimiyetini neşeli bir düet atmosferinde sunan, Türk pop-rock tarihinin en sevilen klasiklerinden biri.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/28"
  },
  {
    "id": 129,
    "messageId": 29,
    "title": "Anlıyorsun Değil Mi",
    "artist": "Barış Manço",
    "album": "Yeni Bir Gün",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "02:13",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Sessiz bakışmaların ve kelimelere dökülemeyen duyguların içten melodisi; akustik gitarlar ve sade vokalin yarattığı sıcacık bir atmosfer.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/29"
  },
  {
    "id": 130,
    "messageId": 30,
    "title": "Aynalı Kemer",
    "artist": "Barış Manço",
    "album": "Yeni Bir Gün",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:03",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Anadolu gelinlerinin aynalı kemer geleneğini saykodelik synthesizer ve perküsyonlarla buluşturan yüksek enerjili bir şarkı.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/30"
  },
  {
    "id": 131,
    "messageId": 31,
    "title": "Ben Bilirim",
    "artist": "Barış Manço",
    "album": "Dünden Bugüne",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:16",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Kibir ve benlik davasına karşı duran, 'Bir ben bilirim deme, bir bilene danış' öğüdüyle örülü klasik bir Barış Manço bilgeliği.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/31"
  },
  {
    "id": 132,
    "messageId": 32,
    "title": "Benden Öte Benden Ziyade",
    "artist": "Barış Manço",
    "album": "Mega Manço",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "05:12",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Tasavvuf felsefesindeki vahdet-i vücut temasını modern senfonik tınılarla yorumlayan derinlikli ve görkemli bir eser.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/32"
  },
  {
    "id": 133,
    "messageId": 33,
    "title": "Can Bedenden Çıkmayınca",
    "artist": "Barış Manço",
    "album": "Darısı Başınıza",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:13",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Ölümüne sadakatin ve aşkın marşı; güçlü yaylı düzenlemeleri ve Barış Manço'nun yürekten haykırışıyla nesiller boyu dillerden düşmeyen bir başyapıt.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/33"
  },
  {
    "id": 134,
    "messageId": 34,
    "title": "Dağlar Dağlar",
    "artist": "Barış Manço",
    "album": "Dünden Bugüne",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:24",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Barış Manço'ya Altın Plak kazandıran ve adını Türk müzik tarihine altın harflerle yazdıran, kemençe ve akustik gitarın hüznüyle yoğrulmuş efsanevi ağıt.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/34"
  },
  {
    "id": 135,
    "messageId": 35,
    "title": "Domates Biber Patlıcan",
    "artist": "Barış Manço",
    "album": "Darısı Başınıza",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:16",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Bir sokak satıcısının sesiyle bölünmüş bir aşk itirafının trajikomik hikayesi; mizah ile hüznü ustalıkla harmanlayan eşsiz bir anlatım.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/35"
  },
  {
    "id": 136,
    "messageId": 36,
    "title": "Domates, Biber, Patlıcan (Orijinal Kayıt)",
    "artist": "Barış Manço",
    "album": "Darısı Başınıza",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:16",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Türk müzik dinleyicisinin hafızasına kazınmış meşhur sokak nidasıyla başlayan nostaljik ve sıcak orijinal stüdyo kaydı.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/36"
  },
  {
    "id": 137,
    "messageId": 37,
    "title": "Dönence",
    "artist": "Barış Manço & Kurtalan Ekspres",
    "album": "Sözüm Meclisten Dışarı",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "06:48",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Türk saykodelik rock müziğinin zirve noktası; derin felsefi sözleri, dönen Moog synthesizer melodileri ve Kurtalan Ekspres'in virtüöz aranjmanıyla zamanın ötesinde bir şaheser.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/37"
  },
  {
    "id": 138,
    "messageId": 38,
    "title": "Gibi Gibi",
    "artist": "Barış Manço",
    "album": "Değmesin Yağlı Boya",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:55",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Hayatın tezatlarını ve çelişkilerini sorgulayan kıvrak ve düşündürücü sözleriyle dönemin en popüler parçalarından biri.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/38"
  },
  {
    "id": 139,
    "messageId": 39,
    "title": "Gül Bebeğim",
    "artist": "Barış Manço",
    "album": "Müsaadenizle Çocuklar",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "05:18",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Çocuklara ve geleceğe duyulan sonsuz şefkatin melodisi; Barış Manço'nun naif ve koruyucu babacan ses tonunun en güzel yansıması.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/39"
  },
  {
    "id": 140,
    "messageId": 40,
    "title": "Gülpembe",
    "artist": "Barış Manço",
    "album": "Sözüm Meclisten Dışarı",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "05:11",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Büyükannesi Nimet Hanım'ın anısına bestelenmiş, Türk rock tarihinin en dokunaklı, en içten ve ölümsüz ağıt-senfonisi.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/40"
  },
  {
    "id": 141,
    "messageId": 41,
    "title": "Hal Hal",
    "artist": "Barış Manço",
    "album": "Sözüm Meclisten Dışarı",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:33",
    "cover": "assets/baris-manco-artist.jpg",
    "story": "Ayşegül Aldinç düetiyle hafızalara kazınan, halhal takan genç kızın neşeli hikayesini kıpır kıpır bir ritimle anlatan kült bir halk şarkısı uyarlaması.",
    "aura1": "rgba(217, 119, 6, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/41"
  },
  {
    "id": 242,
    "messageId": 42,
    "title": "Deli Kızım Uyan",
    "artist": "Şebnem Ferah",
    "album": "Kadın",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:25",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Koma halindeki bir yakının hayata tutunması için yazılmış, hüznü ve güçlü vokal çığlığıyla Türk rock tarihinin en etkileyici başyapıtlarından biri.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/42"
  },
  {
    "id": 243,
    "messageId": 43,
    "title": "Durma",
    "artist": "Şebnem Ferah",
    "album": "Kadın",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:17",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Durma, Şebnem Ferah'ın Kadın albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/43"
  },
  {
    "id": 244,
    "messageId": 44,
    "title": "Dünya",
    "artist": "Şebnem Ferah",
    "album": "Od",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:39",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Dünya, Şebnem Ferah'ın Od albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/44"
  },
  {
    "id": 245,
    "messageId": 45,
    "title": "Eski",
    "artist": "Şebnem Ferah",
    "album": "Benim Adım Orman",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:59",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Eski, Şebnem Ferah'ın Benim Adım Orman albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/45"
  },
  {
    "id": 246,
    "messageId": 46,
    "title": "Fırtına",
    "artist": "Şebnem Ferah",
    "album": "Kadın",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:14",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Fırtına, Şebnem Ferah'ın Kadın albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/46"
  },
  {
    "id": 247,
    "messageId": 47,
    "title": "Geçmişe Yolculuk",
    "artist": "Şebnem Ferah",
    "album": "Kelimeler Yetse",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:53",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Geçmişe Yolculuk, Şebnem Ferah'ın Kelimeler Yetse albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/47"
  },
  {
    "id": 248,
    "messageId": 48,
    "title": "Gözlerimin Etrafındaki Çizgiler",
    "artist": "Şebnem Ferah",
    "album": "Kelimeler Yetse",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "06:20",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Gözlerimin Etrafındaki Çizgiler, Şebnem Ferah'ın Kelimeler Yetse albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/48"
  },
  {
    "id": 249,
    "messageId": 49,
    "title": "Her Şey İnsanlar İçin",
    "artist": "Şebnem Ferah",
    "album": "Kelimeler Yetse",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:17",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Her Şey İnsanlar İçin, Şebnem Ferah'ın Kelimeler Yetse albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/49"
  },
  {
    "id": 250,
    "messageId": 50,
    "title": "Hoşçakal",
    "artist": "Şebnem Ferah",
    "album": "Can Kırıkları",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:45",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Ayrılığın vakur ve asil hüznünü anlatan, yaylı orkestrasyonu ve patlayan nakaratıyla milyonların hafızasına kazınmış efsanevi bir veda şarkısı.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/50"
  },
  {
    "id": 252,
    "messageId": 52,
    "title": "İnsanlık",
    "artist": "Şebnem Ferah",
    "album": "Benim Adım Orman",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:01",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "İnsanlık, Şebnem Ferah'ın Benim Adım Orman albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/52"
  },
  {
    "id": 253,
    "messageId": 53,
    "title": "İstiklal Caddesi Kadar",
    "artist": "Şebnem Ferah",
    "album": "Benim Adım Orman",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:52",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "İstiklal Caddesi Kadar, Şebnem Ferah'ın Benim Adım Orman albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/53"
  },
  {
    "id": 254,
    "messageId": 54,
    "title": "İyi Gün Dostlarım",
    "artist": "Şebnem Ferah",
    "album": "Kadın",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:17",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "İyi Gün Dostlarım, Şebnem Ferah'ın Kadın albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/54"
  },
  {
    "id": 255,
    "messageId": 55,
    "title": "İyi Kötü",
    "artist": "Şebnem Ferah",
    "album": "Kelimeler Yetse",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:54",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "İyi Kötü, Şebnem Ferah'ın Kelimeler Yetse albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/55"
  },
  {
    "id": 256,
    "messageId": 56,
    "title": "Kalbim Mezar",
    "artist": "Şebnem Ferah",
    "album": "Od",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:39",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Kalbim Mezar, Şebnem Ferah'ın Od albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/56"
  },
  {
    "id": 257,
    "messageId": 57,
    "title": "Kalbim",
    "artist": "Şebnem Ferah",
    "album": "Perdeler",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "03:16",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Kalbim, Şebnem Ferah'ın Perdeler albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/57"
  },
  {
    "id": 258,
    "messageId": 58,
    "title": "Mahalle",
    "artist": "Şebnem Ferah",
    "album": "Benim Adım Orman",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:52",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Mahalle, Şebnem Ferah'ın Benim Adım Orman albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/58"
  },
  {
    "id": 259,
    "messageId": 59,
    "title": "Mayın Tarlası",
    "artist": "Şebnem Ferah",
    "album": "Kelimeler Yetse",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:19",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Kırılgan insan ruhunun mayınlarla dolu hayat yolculuğunu metaforlaştıran, sert gitarlar ve derin dizelerin buluştuğu kült bir eser.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/59"
  },
  {
    "id": 260,
    "messageId": 60,
    "title": "Nereye Kadar",
    "artist": "Şebnem Ferah",
    "album": "Artık Kısa Cümleler Kuruyorum",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:03",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Nereye Kadar, Şebnem Ferah'ın Artık Kısa Cümleler Kuruyorum albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/60"
  },
  {
    "id": 261,
    "messageId": 61,
    "title": "Okyanus",
    "artist": "Şebnem Ferah",
    "album": "Can Kırıkları",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:35",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Okyanus, Şebnem Ferah'ın Can Kırıkları albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/61"
  },
  {
    "id": 262,
    "messageId": 62,
    "title": "Oyunun Sonu",
    "artist": "Şebnem Ferah",
    "album": "Artık Kısa Cümleler Kuruyorum",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:31",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Oyunun Sonu, Şebnem Ferah'ın Artık Kısa Cümleler Kuruyorum albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/62"
  },
  {
    "id": 263,
    "messageId": 63,
    "title": "Özgürce Yaşa",
    "artist": "Şebnem Ferah",
    "album": "Özgürce Yaşa",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:12",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Özgürce Yaşa, Şebnem Ferah'ın Özgürce Yaşa albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/63"
  },
  {
    "id": 264,
    "messageId": 64,
    "title": "Parmak İzi",
    "artist": "Şebnem Ferah",
    "album": "Parmak İzi",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:22",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Parmak İzi, Şebnem Ferah'ın Parmak İzi albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/64"
  },
  {
    "id": 265,
    "messageId": 65,
    "title": "Perdeler",
    "artist": "Şebnem Ferah",
    "album": "Perdeler",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:55",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Perdeler, Şebnem Ferah'ın Perdeler albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/65"
  },
  {
    "id": 266,
    "messageId": 66,
    "title": "Sana Bilmediğin Bir şey Söyleyemem",
    "artist": "Şebnem Ferah",
    "album": "Parmak İzi",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:15",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Sana Bilmediğin Bir şey Söyleyemem, Şebnem Ferah'ın Parmak İzi albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/66"
  },
  {
    "id": 267,
    "messageId": 67,
    "title": "Senin Adın Ne",
    "artist": "Şebnem Ferah",
    "album": "Parmak İzi",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "03:40",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Senin Adın Ne, Şebnem Ferah'ın Parmak İzi albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/67"
  },
  {
    "id": 268,
    "messageId": 68,
    "title": "Serapmış",
    "artist": "Şebnem Ferah",
    "album": "Benim Adım Orman",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:08",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Serapmış, Şebnem Ferah'ın Benim Adım Orman albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/68"
  },
  {
    "id": 269,
    "messageId": 69,
    "title": "Sevmeden Geçer Zaman",
    "artist": "Şebnem Ferah",
    "album": "Perdeler",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:12",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Sevmeden Geçer Zaman, Şebnem Ferah'ın Perdeler albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/69"
  },
  {
    "id": 270,
    "messageId": 70,
    "title": "Sigara",
    "artist": "Şebnem Ferah",
    "album": "Perdeler",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:36",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "'Sigara dumanının altında...' dizesiyle başlayan, melankolinin en samimi ve şiirsel hali; Türk rock antolojisinin zirve şarkılarından.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/70"
  },
  {
    "id": 271,
    "messageId": 71,
    "title": "Sil Baştan",
    "artist": "Şebnem Ferah",
    "album": "Kelimeler Yetse",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:12",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "'Sil baştan başlamak gerek bazen...' felsefesiyle bir neslin yeniden başlama marşı haline gelmiş, umut ve direnç aşılayan ölümsüz bir başyapıt.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/71"
  },
  {
    "id": 272,
    "messageId": 72,
    "title": "Sözlerimi Geri Alamam",
    "artist": "Şebnem Ferah",
    "album": "Parmak İzi",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "03:34",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Sözlerimi Geri Alamam, Şebnem Ferah'ın Parmak İzi albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/72"
  },
  {
    "id": 273,
    "messageId": 73,
    "title": "Şarkılar Yalan Söylemez",
    "artist": "Şebnem Ferah",
    "album": "Kelimeler Yetse",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "03:52",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Şarkılar Yalan Söylemez, Şebnem Ferah'ın Kelimeler Yetse albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/73"
  },
  {
    "id": 274,
    "messageId": 74,
    "title": "Uçurtma",
    "artist": "Şebnem Ferah",
    "album": "Perdeler",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:13",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Uçurtma, Şebnem Ferah'ın Perdeler albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/74"
  },
  {
    "id": 275,
    "messageId": 75,
    "title": "Utangaç",
    "artist": "Şebnem Ferah",
    "album": "Artık Kısa Cümleler Kuruyorum",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "06:07",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Utangaç, Şebnem Ferah'ın Artık Kısa Cümleler Kuruyorum albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/75"
  },
  {
    "id": 276,
    "messageId": 76,
    "title": "Vazgeçtim Dünyadan",
    "artist": "Şebnem Ferah",
    "album": "Kadın",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:44",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Kadın albümünün çıkış şarkısı; 90'lar Türkiye'sinde kadın rock vokalinin devrim niteliğindeki ilk büyük çığlığı.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/76"
  },
  {
    "id": 277,
    "messageId": 77,
    "title": "Vicdan",
    "artist": "Şebnem Ferah",
    "album": "Od",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:00",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Vicdan, Şebnem Ferah'ın Od albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/77"
  },
  {
    "id": 278,
    "messageId": 78,
    "title": "Ya Hep Ya Hiç",
    "artist": "Şebnem Ferah",
    "album": "Od",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:24",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Ya Hep Ya Hiç, Şebnem Ferah'ın Od albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/78"
  },
  {
    "id": 279,
    "messageId": 79,
    "title": "Yağmurlar",
    "artist": "Şebnem Ferah",
    "album": "Kadın",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:51",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Yağmurun arındırıcı ve melankolik hissini melodik rock altyapısıyla birleştiren, naif ve dokunaklı bir klasik.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/79"
  },
  {
    "id": 280,
    "messageId": 80,
    "title": "Yalnız",
    "artist": "Şebnem Ferah",
    "album": "Benim Adım Orman",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:08",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Yalnız, Şebnem Ferah'ın Benim Adım Orman albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/80"
  },
  {
    "id": 281,
    "messageId": 81,
    "title": "Yarım",
    "artist": "Şebnem Ferah",
    "album": "Od",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:28",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Yarım, Şebnem Ferah'ın Od albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/81"
  },
  {
    "id": 282,
    "messageId": 82,
    "title": "Yeniden Doğup Gelsem",
    "artist": "Şebnem Ferah",
    "album": "Kadın",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:12",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Yeniden Doğup Gelsem, Şebnem Ferah'ın Kadın albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/82"
  },
  {
    "id": 283,
    "messageId": 83,
    "title": "Zaman Geçip Gidiyor",
    "artist": "Şebnem Ferah",
    "album": "Can Kırıkları",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:23",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Zaman Geçip Gidiyor, Şebnem Ferah'ın Can Kırıkları albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/83"
  },
  {
    "id": 284,
    "messageId": 84,
    "title": "Anatolia (feat. Sebnem Ferah)",
    "artist": "Pentagram (feat. Şebnem Ferah)",
    "album": "Anatolia (Pentagram)",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:36",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Anatolia (feat. Sebnem Ferah), Şebnem Ferah'ın Anatolia (Pentagram) albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/84"
  },
  {
    "id": 285,
    "messageId": 85,
    "title": "Artık Kısa Cümleler Kuruyorum",
    "artist": "Şebnem Ferah",
    "album": "Artık Kısa Cümleler Kuruyorum",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "03:59",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Az sözle çok şey anlatmanın olgunluğunu sert gitarlar ve tok bir sound ile harmanlayan dönüm noktası bir albüm şarkısı.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/85"
  },
  {
    "id": 286,
    "messageId": 86,
    "title": "Ateşe Yakın",
    "artist": "Şebnem Ferah",
    "album": "Benim Adım Orman",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:42",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Ateşe Yakın, Şebnem Ferah'ın Benim Adım Orman albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/86"
  },
  {
    "id": 287,
    "messageId": 87,
    "title": "Bazı Aşklar",
    "artist": "Şebnem Ferah",
    "album": "Od",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:41",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Bazı Aşklar, Şebnem Ferah'ın Od albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/87"
  },
  {
    "id": 288,
    "messageId": 88,
    "title": "Ben Bir Mülteciyim",
    "artist": "Şebnem Ferah",
    "album": "Kelimeler Yetse",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:56",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Ben Bir Mülteciyim, Şebnem Ferah'ın Kelimeler Yetse albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/88"
  },
  {
    "id": 289,
    "messageId": 89,
    "title": "Ben Şarkımı Söylerken",
    "artist": "Şebnem Ferah",
    "album": "Kelimeler Yetse",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:17",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Müziğin ve sahnenin özgürleştirici gücünü fırtına gibi anlatan, konserlerin en coşkulu marşlarından biri.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/89"
  },
  {
    "id": 290,
    "messageId": 90,
    "title": "Bir Kalp Kırıldığında",
    "artist": "Şebnem Ferah",
    "album": "Parmak İzi",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:04",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Bir Kalp Kırıldığında, Şebnem Ferah'ın Parmak İzi albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/90"
  },
  {
    "id": 291,
    "messageId": 91,
    "title": "Birileri Var",
    "artist": "Şebnem Ferah",
    "album": "Od",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:18",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Birileri Var, Şebnem Ferah'ın Od albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/91"
  },
  {
    "id": 292,
    "messageId": 92,
    "title": "Bu Aşk Fazla Sana",
    "artist": "Şebnem Ferah",
    "album": "Kadın",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:21",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Güçlü, bağımsız ve boyun eğmeyen bir duruşun manifestosu; ritmik enerjisi ve akılda kalıcı gitar riffleriyle bir 90'lar klasiği.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/92"
  },
  {
    "id": 293,
    "messageId": 93,
    "title": "Bugün",
    "artist": "Şebnem Ferah",
    "album": "Artık Kısa Cümleler Kuruyorum",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:37",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "İçsel hesaplaşmaların ve kayıpların ardından gelen dingin kabul; piyano ve vokalin eşsiz uyumu.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/93"
  },
  {
    "id": 294,
    "messageId": 94,
    "title": "Can Kırıkları",
    "artist": "Şebnem Ferah",
    "album": "Can Kırıkları",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:46",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "İnsan ilişkilerinin kırılganlığını ve bıraktığı keskin izleri anlatan, senfonik rock düzenlemesiyle görkemli bir başyapıt.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/94"
  },
  {
    "id": 295,
    "messageId": 95,
    "title": "Çakıl Taşları",
    "artist": "Şebnem Ferah",
    "album": "Can Kırıkları",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:07",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Yollara dökülen taşlar gibi dağılan anıların ardında kalan güçlü bir vokal performansı.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/95"
  },
  {
    "id": 296,
    "messageId": 96,
    "title": "Çocukken Sahip Olduğum Kırmızı Rugan Ayakkabılar",
    "artist": "Şebnem Ferah",
    "album": "Kelimeler Yetse",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "05:24",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Çocukluğun masumiyetine duyulan derin özlem; Barış Manço sedef kol düğmelerine selam duran şiirsel bir monografi.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/96"
  },
  {
    "id": 297,
    "messageId": 97,
    "title": "Çok Yorgunum",
    "artist": "Şebnem Ferah",
    "album": "Od",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "03:06",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Çok Yorgunum, Şebnem Ferah'ın Od albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/97"
  },
  {
    "id": 298,
    "messageId": 98,
    "title": "Delgeç",
    "artist": "Şebnem Ferah",
    "album": "Can Kırıkları",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Alternatif",
    "duration": "04:15",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Delgeç, Şebnem Ferah'ın Can Kırıkları albümünde yer alan, güçlü vokali ve edebi sözleriyle öne çıkan seçkin bir rock eseridir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/98"
  },
  {
    "id": 433,
    "messageId": 133,
    "title": "Silinmeyen Hatıralar",
    "artist": "Erkin Koray",
    "album": "Silinmeyen Hatıralar",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:07",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Silinmeyen Hatıralar, Erkin Koray'ın Silinmeyen Hatıralar albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/133"
  },
  {
    "id": 434,
    "messageId": 134,
    "title": "Şaşkın",
    "artist": "Erkin Koray",
    "album": "Elektronik Türküler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:22",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Arap melodilerini elektro bağlama ve saykodelik rock ritimleriyle harmanlayan, dans ettiren ölümsüz bir Anadolu rock klasiği.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/134"
  },
  {
    "id": 435,
    "messageId": 135,
    "title": "Tek Başına",
    "artist": "Erkin Koray",
    "album": "Silinmeyen Hatıralar",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "05:08",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Tek Başına, Erkin Koray'ın Silinmeyen Hatıralar albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/135"
  },
  {
    "id": 436,
    "messageId": 136,
    "title": "Tutturamazsın",
    "artist": "Erkin Koray",
    "album": "İlla Ki",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:33",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Tutturamazsın, Erkin Koray'ın İlla Ki albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/136"
  },
  {
    "id": 437,
    "messageId": 137,
    "title": "Uzat Serçe Parmağını",
    "artist": "Erkin Koray",
    "album": "Çöpçüler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:18",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Uzat Serçe Parmağını, Erkin Koray'ın Çöpçüler albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/137"
  },
  {
    "id": 438,
    "messageId": 138,
    "title": "Yağmur",
    "artist": "Erkin Koray",
    "album": "Erkin Koray",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:37",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Erkin Koray'ın melankolisini elektro gitar tonlarıyla buluşturan, yağmurlu günlerin hüzünlü ve unutulmaz baladı.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/138"
  },
  {
    "id": 439,
    "messageId": 139,
    "title": "Yalnızlar Rıhtımı",
    "artist": "Erkin Koray",
    "album": "Erkin Koray Tutkusu",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:33",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Terk edilmiş bir sevgilinin rıhtımdaki yalnızlığını anlatan, Türk saykodelik rock döneminin en dokunaklı bestesi.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/139"
  },
  {
    "id": 440,
    "messageId": 140,
    "title": "Yolcu Yolunda Gerek",
    "artist": "Erkin Koray",
    "album": "Benden Sana",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "05:25",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Yolcu Yolunda Gerek, Erkin Koray'ın Benden Sana albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/140"
  },
  {
    "id": 441,
    "messageId": 141,
    "title": "Akrebin Gözleri",
    "artist": "Erkin Koray",
    "album": "Gün Ola Harman Ola",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "07:03",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Akrebin Gözleri, Erkin Koray'ın Gün Ola Harman Ola albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/141"
  },
  {
    "id": 442,
    "messageId": 142,
    "title": "Allah Aşkına",
    "artist": "Erkin Koray",
    "album": "Benden Sana",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "02:36",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Allah Aşkına, Erkin Koray'ın Benden Sana albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/142"
  },
  {
    "id": 443,
    "messageId": 143,
    "title": "Ankara Sokakları",
    "artist": "Erkin Koray",
    "album": "Tek Başına Konser",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "06:12",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Ankara Sokakları, Erkin Koray'ın Tek Başına Konser albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/143"
  },
  {
    "id": 444,
    "messageId": 144,
    "title": "Anlamadım",
    "artist": "Erkin Koray",
    "album": "Çöpçüler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:05",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Anlamadım, Erkin Koray'ın Çöpçüler albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/144"
  },
  {
    "id": 445,
    "messageId": 145,
    "title": "Anma Arkadaş",
    "artist": "Erkin Koray",
    "album": "Erkin Koray",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:05",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Anma Arkadaş, Erkin Koray'ın Erkin Koray albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/145"
  },
  {
    "id": 446,
    "messageId": 146,
    "title": "Arap Saçı",
    "artist": "Erkin Koray",
    "album": "Erkin Koray 2",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:41",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Körpe sevdaların çaresizliğini 'Arap saçı' metaforuyla dillere pelesenk eden efsanevi bir halk şarkısı uyarlaması.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/146"
  },
  {
    "id": 447,
    "messageId": 147,
    "title": "Aşk Oyunu",
    "artist": "Erkin Koray",
    "album": "Silinmeyen Hatıralar",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:08",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Aşk Oyunu, Erkin Koray'ın Silinmeyen Hatıralar albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/147"
  },
  {
    "id": 448,
    "messageId": 148,
    "title": "Aşkımız Bitecek",
    "artist": "Erkin Koray",
    "album": "Erkin Koray",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:19",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Aşkımız Bitecek, Erkin Koray'ın Erkin Koray albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/148"
  },
  {
    "id": 449,
    "messageId": 149,
    "title": "Bu Sana Son Mektubum",
    "artist": "Erkin Koray",
    "album": "Erkin Koray",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "02:30",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Bu Sana Son Mektubum, Erkin Koray'ın Erkin Koray albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/149"
  },
  {
    "id": 450,
    "messageId": 150,
    "title": "Cemalim",
    "artist": "Erkin Koray",
    "album": "Elektronik Türküler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "07:48",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Ürgüplü Cemal'in dramatik ağıtını elektro bağlamanın fuzz tonlarıyla psikedelik bir başyapıta dönüştüren kült kayıt.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/150"
  },
  {
    "id": 451,
    "messageId": 151,
    "title": "Çok Derinlerde",
    "artist": "Erkin Koray",
    "album": "Gün Ola Harman Ola",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "06:01",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Çok Derinlerde, Erkin Koray'ın Gün Ola Harman Ola albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/151"
  },
  {
    "id": 452,
    "messageId": 152,
    "title": "Çöpçüler",
    "artist": "Erkin Koray",
    "album": "Çöpçüler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:47",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "'Kör olası çöpçüler aşkımı süpürmüşler...' dizeleriyle bir dönemin sokak nostaljisini simgeleyen unutulmaz şarkı.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/152"
  },
  {
    "id": 453,
    "messageId": 153,
    "title": "Deli Kadın",
    "artist": "Erkin Koray",
    "album": "İlla Ki",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:56",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Deli Kadın, Erkin Koray'ın İlla Ki albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/153"
  },
  {
    "id": 454,
    "messageId": 154,
    "title": "Estarabim (Radyo Versiyonu)",
    "artist": "Erkin Koray",
    "album": "Erkin Koray Tutkusu",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:40",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Estarabim (Radyo Versiyonu), Erkin Koray'ın Erkin Koray Tutkusu albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/154"
  },
  {
    "id": 455,
    "messageId": 155,
    "title": "Estarabim",
    "artist": "Erkin Koray",
    "album": "Erkin Koray Tutkusu",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "05:11",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Türk rock tarihinin en bilinen, kıvrak ritimli, elektro bağlama riffleriyle coşturan başyapıtı.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/155"
  },
  {
    "id": 456,
    "messageId": 156,
    "title": "Fesupanallah",
    "artist": "Erkin Koray",
    "album": "Elektronik Türküler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:36",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Dünyanın dertlerine karşı neşeli bir tevekkül; Erkin Koray'ın en popüler ve nesiller boyu sevilen eseri.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/156"
  },
  {
    "id": 457,
    "messageId": 157,
    "title": "Fesuphanallah (Orijinal Kayıt)",
    "artist": "Erkin Koray",
    "album": "Elektronik Türküler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:36",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Fesuphanallah (Orijinal Kayıt), Erkin Koray'ın Elektronik Türküler albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/157"
  },
  {
    "id": 458,
    "messageId": 158,
    "title": "Gaddar",
    "artist": "Erkin Koray",
    "album": "İlla Ki",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:33",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Gaddar, Erkin Koray'ın İlla Ki albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/158"
  },
  {
    "id": 459,
    "messageId": 159,
    "title": "Goca Dünya",
    "artist": "Erkin Koray",
    "album": "Erkin Koray 2",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:06",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Kaderin döngüsünü sorgulayan felsefi dizeleriyle saykodelik rock tınılarının zirvesi.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/159"
  },
  {
    "id": 460,
    "messageId": 160,
    "title": "Gökteki Yıldızlar",
    "artist": "Erkin Koray",
    "album": "Silinmeyen Hatıralar",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:30",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Gökteki Yıldızlar, Erkin Koray'ın Silinmeyen Hatıralar albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/160"
  },
  {
    "id": 461,
    "messageId": 161,
    "title": "Gönül Salıncağı",
    "artist": "Erkin Koray",
    "album": "Erkin Koray",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:09",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Gönül Salıncağı, Erkin Koray'ın Erkin Koray albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/161"
  },
  {
    "id": 462,
    "messageId": 162,
    "title": "Gözlerim Her Yerde",
    "artist": "Erkin Koray",
    "album": "Benden Sana",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:38",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Gözlerim Her Yerde, Erkin Koray'ın Benden Sana albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/162"
  },
  {
    "id": 463,
    "messageId": 163,
    "title": "Gün Ola Harman Ola",
    "artist": "Erkin Koray",
    "album": "Gün Ola Harman Ola",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "05:27",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Geleceğe ve adalete olan inancı simgeleyen, ritmik ve vurucu bir Erkin Koray marşı.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/163"
  },
  {
    "id": 464,
    "messageId": 164,
    "title": "Hayat Katarı",
    "artist": "Erkin Koray",
    "album": "Hayat Katarı",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "06:15",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Hayat Katarı, Erkin Koray'ın Hayat Katarı albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/164"
  },
  {
    "id": 465,
    "messageId": 165,
    "title": "İnsafsız",
    "artist": "Erkin Koray",
    "album": "Tamam Artık",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:10",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "İnsafsız, Erkin Koray'ın Tamam Artık albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/165"
  },
  {
    "id": 466,
    "messageId": 166,
    "title": "Karlı Dağlar",
    "artist": "Erkin Koray",
    "album": "Elektronik Türküler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:35",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Karlı Dağlar, Erkin Koray'ın Elektronik Türküler albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/166"
  },
  {
    "id": 467,
    "messageId": 167,
    "title": "Kendim Ettim Kendim Buldum",
    "artist": "Erkin Koray",
    "album": "Elektronik Türküler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:23",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Neşet Ertaş klasiğinin Erkin Koray dehasıyla elektro gitara ve rock harmonilerine uyarlandığı efsanevi sentez.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/167"
  },
  {
    "id": 468,
    "messageId": 168,
    "title": "Kıskanırım Seni Ben",
    "artist": "Erkin Koray",
    "album": "İlla Ki",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:45",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Kıskanırım Seni Ben, Erkin Koray'ın İlla Ki albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/168"
  },
  {
    "id": 469,
    "messageId": 169,
    "title": "Kıskanırım (Orijinal Versiyon)",
    "artist": "Erkin Koray",
    "album": "İlla Ki",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:45",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Kıskanırım (Orijinal Versiyon), Erkin Koray'ın İlla Ki albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/169"
  },
  {
    "id": 470,
    "messageId": 170,
    "title": "Mesafeler",
    "artist": "Erkin Koray",
    "album": "Erkin Koray Tutkusu",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:34",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Mesafeler, Erkin Koray'ın Erkin Koray Tutkusu albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/170"
  },
  {
    "id": 471,
    "messageId": 171,
    "title": "Öfke",
    "artist": "Erkin Koray",
    "album": "Gün Ola Harman Ola",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:47",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Öfke, Erkin Koray'ın Gün Ola Harman Ola albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/171"
  },
  {
    "id": 472,
    "messageId": 172,
    "title": "Öksürük",
    "artist": "Erkin Koray",
    "album": "Gün Ola Harman Ola",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:34",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Öksürük, Erkin Koray'ın Gün Ola Harman Ola albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/172"
  },
  {
    "id": 473,
    "messageId": 173,
    "title": "Öyle Bir Geçer Zaman ki",
    "artist": "Erkin Koray",
    "album": "Benden Sana",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:33",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Zamanın acımasız akışını ve kayıpları anlatan, yüreklere işleyen akustik ve elektrik harmanı derin bir balad.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/173"
  },
  {
    "id": 474,
    "messageId": 174,
    "title": "Sanma",
    "artist": "Erkin Koray",
    "album": "Silinmeyen Hatıralar",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:39",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Sanma, Erkin Koray'ın Silinmeyen Hatıralar albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/174"
  },
  {
    "id": 475,
    "messageId": 175,
    "title": "Sarhoş Gibiyim",
    "artist": "Erkin Koray",
    "album": "Tamam Artık",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "05:05",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Sarhoş Gibiyim, Erkin Koray'ın Tamam Artık albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/175"
  },
  {
    "id": 476,
    "messageId": 176,
    "title": "Sen Yoksun Diye",
    "artist": "Erkin Koray",
    "album": "Erkin Koray",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:15",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Sen Yoksun Diye, Erkin Koray'ın Erkin Koray albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/176"
  },
  {
    "id": 477,
    "messageId": 177,
    "title": "Senden Ayrı",
    "artist": "Erkin Koray",
    "album": "Silinmeyen Hatıralar",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "04:16",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Senden Ayrı, Erkin Koray'ın Silinmeyen Hatıralar albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/177"
  },
  {
    "id": 478,
    "messageId": 178,
    "title": "Seni Her Gördüğümde",
    "artist": "Erkin Koray",
    "album": "Erkin Koray",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "03:19",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Gençlik heyecanının ve ilk görüşte aşkın naif melodisi; dönemin en sevilen nostaljik 45'liklerinden biri.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/178"
  },
  {
    "id": 479,
    "messageId": 179,
    "title": "Sevdiğim",
    "artist": "Erkin Koray",
    "album": "Elektronik Türküler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "07:33",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Sevdiğim, Erkin Koray'ın Elektronik Türküler albümünde yer alan, elektro bağlama ve saykodelik rock harmonileriyle örülü değerli bir eseridir.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/179"
  },
  {
    "id": 480,
    "messageId": 180,
    "title": "Sevince",
    "artist": "Erkin Koray",
    "album": "İlla Ki",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Gitarlar",
    "duration": "05:18",
    "cover": "assets/erkin-koray-artist.jpg",
    "story": "Aşkın insanı saran iyileştirici gücünü coşkulu bir rock altyapısıyla anlatan neşeli bir klasik.",
    "aura1": "rgba(245, 158, 11, 0.26)",
    "aura2": "rgba(147, 51, 234, 0.18)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/180"
  },
  {
    "id": 681,
    "messageId": 181,
    "title": "Sen De Başını Alıp Gitme",
    "artist": "Cem Karaca",
    "album": "Merhaba Gençler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:35",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Nilüfer ile unutulmaz düeti ve solo yorumuyla zihinlere kazınan, vedaların ve derin yalnızlığın anlatıldığı Cem Karaca başyapıtı.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/181"
  },
  {
    "id": 682,
    "messageId": 182,
    "title": "Sevda Kuşun Kanadında",
    "artist": "Cem Karaca",
    "album": "Töre",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "06:57",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Sevda Kuşun Kanadında, Cem Karaca'nın 'Töre' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/182"
  },
  {
    "id": 683,
    "messageId": 183,
    "title": "Tamirci Çırağı",
    "artist": "Cem Karaca",
    "album": "Tamirci Çırağı & Dervişan",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:56",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "'İşçisin sen işçi kal giy dedi tulumları...' repliğiyle sınıfsal çelişkiyi ve platonik bir aşkın acısını tiyatral bir rock operasına dönüştüren efsane.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/183"
  },
  {
    "id": 684,
    "messageId": 184,
    "title": "Unut Beni",
    "artist": "Cem Karaca",
    "album": "Nerde Kalmıştık?",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:06",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Unut Beni, Cem Karaca'nın 'Nerde Kalmıştık?' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/184"
  },
  {
    "id": 685,
    "messageId": 185,
    "title": "Üryan Geldim",
    "artist": "Cem Karaca & Kardaşlar",
    "album": "Kardaşlar Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:19",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Üryan Geldim, Cem Karaca'nın 'Kardaşlar Dönemi' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/185"
  },
  {
    "id": 686,
    "messageId": 186,
    "title": "Yarım Porsiyon Aydınlık",
    "artist": "Cem Karaca",
    "album": "Yiyin Efendiler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "02:49",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Yarım Porsiyon Aydınlık, Cem Karaca'nın 'Yiyin Efendiler' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/186"
  },
  {
    "id": 687,
    "messageId": 187,
    "title": "Yiyin Efendiler",
    "artist": "Cem Karaca",
    "album": "Yiyin Efendiler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:32",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Yiyin Efendiler, Cem Karaca'nın 'Yiyin Efendiler' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/187"
  },
  {
    "id": 688,
    "messageId": 188,
    "title": "Yorgunum Kaptan",
    "artist": "Cem Karaca & Islandman",
    "album": "Islandman Sessions",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:28",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Yorgunum Kaptan, Cem Karaca'nın 'Islandman Sessions' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/188"
  },
  {
    "id": 689,
    "messageId": 189,
    "title": "Zeyno",
    "artist": "Cem Karaca",
    "album": "Nem Kaldı",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:18",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Zeyno, Cem Karaca'nın 'Nem Kaldı' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/189"
  },
  {
    "id": 690,
    "messageId": 190,
    "title": "Adsız",
    "artist": "Cem Karaca",
    "album": "Kardaşlar Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:42",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Adsız, Cem Karaca'nın 'Kardaşlar Dönemi' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/190"
  },
  {
    "id": 691,
    "messageId": 191,
    "title": "Allah Yar",
    "artist": "Cem Karaca",
    "album": "Bindik Bir Alamete",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:38",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Allah Yar, Cem Karaca'nın 'Bindik Bir Alamete' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/191"
  },
  {
    "id": 692,
    "messageId": 192,
    "title": "Ay Karanlık",
    "artist": "Cem Karaca",
    "album": "Töre",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "07:52",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Ahmed Arif'in 'Maviye çalar gözlerin, yangın mavisine' dizelerini Cem Karaca'nın devasa baritonuyla gökyüzüne haykıran saykodelik bir anıt.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/192"
  },
  {
    "id": 693,
    "messageId": 193,
    "title": "Bekle Beni",
    "artist": "Cem Karaca",
    "album": "Bekle Beni",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:22",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Bekle Beni, Cem Karaca'nın 'Bekle Beni' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/193"
  },
  {
    "id": 694,
    "messageId": 194,
    "title": "Beni Siz Delirttiniz",
    "artist": "Cem Karaca & Dervişan",
    "album": "Dervişan Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:01",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Modern kent insanının maruz kaldığı baskı ve delirme eşiğini Dervişan'ın deneysel funk-rock armonileriyle betimleyen kült şarkı.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/194"
  },
  {
    "id": 695,
    "messageId": 195,
    "title": "Bindik Bir Alamete Gideyoz Kıyamete",
    "artist": "Cem Karaca",
    "album": "Bindik Bir Alamete",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:33",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Modern çağın tükenmişliğini ve toplumsal yabancılaşmayı hicveden, vurucu basları ve ritimleriyle Cem Karaca'nın veda albümünün isim parçası.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/195"
  },
  {
    "id": 696,
    "messageId": 196,
    "title": "Bu Biçim",
    "artist": "Cem Karaca",
    "album": "Merhaba Gençler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:31",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Bu Biçim, Cem Karaca'nın 'Merhaba Gençler' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/196"
  },
  {
    "id": 697,
    "messageId": 197,
    "title": "Bu Son Olsun",
    "artist": "Cem Karaca",
    "album": "Apaşlar & Kardaşlar",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "02:49",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "1969 barış çağrısı; 'Gecelerden sonra doğan güneşe, sevgilinin gözündeki neşeye' uzanan, kalplere umut aşılayan naif bir klasik.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/197"
  },
  {
    "id": 698,
    "messageId": 198,
    "title": "Canım Benim",
    "artist": "Cem Karaca",
    "album": "Nerde Kalmıştık?",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "06:06",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Canım Benim, Cem Karaca'nın 'Nerde Kalmıştık?' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/198"
  },
  {
    "id": 699,
    "messageId": 199,
    "title": "Ceviz Ağacı",
    "artist": "Cem Karaca",
    "album": "Merhaba Gençler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "05:49",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Gülhane Parkı'ndaki yalnız bir ceviz ağacının ağzından Nazım Hikmet dizelerini ölümsüzleştiren, Türk müzik tarihinin en parlak bestelerinden biri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/199"
  },
  {
    "id": 700,
    "messageId": 200,
    "title": "Çok Yorgunum",
    "artist": "Cem Karaca",
    "album": "Hasret",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:44",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Nazım Hikmet'in 'Çok yorgunum beni bekleme kaptan' dizelerinin gurbet hüznüyle yoğrulduğu, iç titreten bir Cem Karaca ağıtı.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/200"
  },
  {
    "id": 701,
    "messageId": 201,
    "title": "Çökertme",
    "artist": "Cem Karaca",
    "album": "Apaşlar Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:02",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Çökertme, Cem Karaca'nın 'Apaşlar Dönemi' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/201"
  },
  {
    "id": 702,
    "messageId": 202,
    "title": "Dadaloğlu",
    "artist": "Cem Karaca",
    "album": "Kardaşlar Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:58",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "'Ferman padişahınsa dağlar bizimdir' haykırışıyla Kardaşlar'ın sert gitarlarını ve halk ozanı başkaldırısını birleştiren öncü marş.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/202"
  },
  {
    "id": 703,
    "messageId": 203,
    "title": "Deniz Üstü Köpürür",
    "artist": "Cem Karaca",
    "album": "Kardaşlar Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:10",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Ege türküsünün Kardaşlar ve Cem Karaca tarafından saykodelik rock harmonileriyle yeniden yaratıldığı dinamik bir şaheser.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/203"
  },
  {
    "id": 704,
    "messageId": 204,
    "title": "Emrah",
    "artist": "Cem Karaca",
    "album": "Apaşlar Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:59",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Emrah, Cem Karaca'nın 'Apaşlar Dönemi' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/204"
  },
  {
    "id": 705,
    "messageId": 205,
    "title": "Gecenin Karasını",
    "artist": "Cem Karaca",
    "album": "Bindik Bir Alamete",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:42",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Gecenin Karasını, Cem Karaca'nın 'Bindik Bir Alamete' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/205"
  },
  {
    "id": 706,
    "messageId": 206,
    "title": "Hayat Ne Garip",
    "artist": "Cem Karaca & Mahsun Kırmızıgül",
    "album": "Düetler & Özel Kayıtlar",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:16",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Hayat Ne Garip, Cem Karaca'nın 'Düetler & Özel Kayıtlar' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/206"
  },
  {
    "id": 707,
    "messageId": 207,
    "title": "Hep Kahır",
    "artist": "Cem Karaca",
    "album": "Safinaz",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "05:21",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Hep Kahır, Cem Karaca'nın 'Safinaz' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/207"
  },
  {
    "id": 708,
    "messageId": 208,
    "title": "Herkes Gibisin",
    "artist": "Cem Karaca",
    "album": "Merhaba Gençler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:12",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Gözden düşen sevdaların ardından söylenen en keskin veda: 'Gözlerimin rengi gibiydin, artık herkes gibisin.' Teatral bir anlatım.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/208"
  },
  {
    "id": 709,
    "messageId": 209,
    "title": "Islak Islak",
    "artist": "Cem Karaca",
    "album": "Nerde Kalmıştık?",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:33",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Barış Akarsu'nun da seslendirdiği, yağmurun ve aşkın sırılsıklam halini anlatan, Cem Karaca'nın 90'lar dönüşünün simge şarkısı.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/209"
  },
  {
    "id": 710,
    "messageId": 210,
    "title": "İşçi Marşı",
    "artist": "Cem Karaca",
    "album": "Dervişan Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:13",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "İşçi Marşı, Cem Karaca'nın 'Dervişan Dönemi' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/210"
  },
  {
    "id": 711,
    "messageId": 211,
    "title": "İşte Geldik Gidiyoruz",
    "artist": "Cem Karaca",
    "album": "Nerde Kalmıştık?",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "06:05",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Hayatın geçiciliğini ve fani dünyayı kabullenişi dingin ama bir o kadar heybetli bir müzikaliteyle anlatan derin bir eser.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/211"
  },
  {
    "id": 712,
    "messageId": 212,
    "title": "Kahya Yahya",
    "artist": "Cem Karaca",
    "album": "Yiyin Efendiler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:00",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Kahya Yahya, Cem Karaca'nın 'Yiyin Efendiler' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/212"
  },
  {
    "id": 713,
    "messageId": 213,
    "title": "Kara Sevda",
    "artist": "Cem Karaca",
    "album": "Kardaşlar Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:32",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Kara Sevda, Cem Karaca'nın 'Kardaşlar Dönemi' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/213"
  },
  {
    "id": 714,
    "messageId": 214,
    "title": "Karacaoğlan",
    "artist": "Cem Karaca",
    "album": "Apaşlar Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "02:32",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Karacaoğlan, Cem Karaca'nın 'Apaşlar Dönemi' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/214"
  },
  {
    "id": 715,
    "messageId": 215,
    "title": "Kendim Ettim Kendim Buldum",
    "artist": "Cem Karaca",
    "album": "Apaşlar Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:59",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Kendim Ettim Kendim Buldum, Cem Karaca'nın 'Apaşlar Dönemi' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/215"
  },
  {
    "id": 716,
    "messageId": 216,
    "title": "Kerkük Zindanı",
    "artist": "Cem Karaca",
    "album": "Hasret",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:19",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Kerkük Zindanı, Cem Karaca'nın 'Hasret' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/216"
  },
  {
    "id": 717,
    "messageId": 217,
    "title": "Lümüne",
    "artist": "Cem Karaca",
    "album": "Kardaşlar Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:38",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Lümüne, Cem Karaca'nın 'Kardaşlar Dönemi' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/217"
  },
  {
    "id": 718,
    "messageId": 218,
    "title": "Muhtar",
    "artist": "Cem Karaca",
    "album": "Dervişan Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:46",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Muhtar, Cem Karaca'nın 'Dervişan Dönemi' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/218"
  },
  {
    "id": 719,
    "messageId": 219,
    "title": "Namus Belası",
    "artist": "Cem Karaca",
    "album": "Dervişan Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:24",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Töreyi ve Anadolu gerçeğini elektro bağlama riffleri ve tiyatral çığlıklarla dönemin en çok dinlenen plağına dönüştüren tarihi kayıt.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/219"
  },
  {
    "id": 720,
    "messageId": 220,
    "title": "Nem Kaldı",
    "artist": "Cem Karaca",
    "album": "Dervişan Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:13",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Nem Kaldı, Cem Karaca'nın 'Dervişan Klasikleri' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/220"
  },
  {
    "id": 721,
    "messageId": 221,
    "title": "O Leyli",
    "artist": "Cem Karaca",
    "album": "Apaşlar Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "02:36",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "O Leyli, Cem Karaca'nın 'Apaşlar Dönemi' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/221"
  },
  {
    "id": 722,
    "messageId": 222,
    "title": "Obur Dünya",
    "artist": "Cem Karaca",
    "album": "Kardaşlar Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "02:46",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Obur Dünya, Cem Karaca'nın 'Kardaşlar Dönemi' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/222"
  },
  {
    "id": 723,
    "messageId": 223,
    "title": "Oğluma",
    "artist": "Cem Karaca",
    "album": "Hasret",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "05:25",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Oğluma, Cem Karaca'nın 'Hasret' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/223"
  },
  {
    "id": 724,
    "messageId": 224,
    "title": "Oh Be",
    "artist": "Cem Karaca",
    "album": "Yiyin Efendiler",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:15",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Oh Be, Cem Karaca'nın 'Yiyin Efendiler' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/224"
  },
  {
    "id": 725,
    "messageId": 225,
    "title": "Ömrüm",
    "artist": "Cem Karaca",
    "album": "Bindik Bir Alamete",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "05:14",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Ömrüm, Cem Karaca'nın 'Bindik Bir Alamete' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/225"
  },
  {
    "id": 726,
    "messageId": 226,
    "title": "Raptiye Rap Rap",
    "artist": "Cem Karaca",
    "album": "Nerde Kalmıştık?",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "03:25",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Bürokrasinin tekdüzeliğini ve askerî yürüyüş adımlarını rap-rock tarzında iğneleyen, enerjisi hiç düşmeyen popüler bir hiciv.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/226"
  },
  {
    "id": 727,
    "messageId": 227,
    "title": "Resimdeki Gözyaşı",
    "artist": "Cem Karaca",
    "album": "Apaşlar Dönemi",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:09",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "1968'de Apaşlar ile kaydedilen, Mehmet Soyarslan bestesi; Türk saykodelik rock çağını başlatan en ikonik eserlerden biri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/227"
  },
  {
    "id": 728,
    "messageId": 228,
    "title": "Resimdeki Gözyaşları",
    "artist": "Cem Karaca",
    "album": "Apaşlar Dönemi (Özel Kayıt)",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:09",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "1968 Apaşlar efsanesinin alternatif düzenlemesi; senfonik yaylılar ve gitarların büyüleyici dansı.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/228"
  },
  {
    "id": 729,
    "messageId": 229,
    "title": "Sakın Reddetme",
    "artist": "Cem Karaca",
    "album": "Bindik Bir Alamete",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Klasikler",
    "duration": "04:47",
    "cover": "assets/cem-karaca-artist.webp",
    "story": "Sakın Reddetme, Cem Karaca'nın 'Bindik Bir Alamete' albümünde yer alan, Türk rock ve Anadolu müziğinin güçlü bir eseri.",
    "aura1": "rgba(220, 38, 38, 0.28)",
    "aura2": "rgba(124, 45, 18, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/229"
  },
  {
    "id": 1036,
    "messageId": 236,
    "title": "Namus Belası",
    "artist": "Moğollar & Cem Karaca",
    "album": "Cem Karaca & Moğollar (1974)",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:24",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Namus Belası, Moğollar'ın 'Cem Karaca & Moğollar (1974)' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/236"
  },
  {
    "id": 1037,
    "messageId": 237,
    "title": "Obur Dünya",
    "artist": "Moğollar & Cem Karaca",
    "album": "Cem Karaca & Moğollar",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "02:46",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Obur Dünya, Moğollar'ın 'Cem Karaca & Moğollar' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/237"
  },
  {
    "id": 1044,
    "messageId": 244,
    "title": "Sunum",
    "artist": "Moğollar & Cem Karaca",
    "album": "Cem Karaca & Moğollar (1974)",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "00:35",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Sunum, Moğollar'ın 'Cem Karaca & Moğollar (1974)' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/244"
  },
  {
    "id": 1050,
    "messageId": 250,
    "title": "Ala Geyik Destanı",
    "artist": "Moğollar & Cem Karaca",
    "album": "Cem Karaca & Moğollar",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "10:53",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Ala Geyik Destanı, Moğollar'ın 'Cem Karaca & Moğollar' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/250"
  },
  {
    "id": 1061,
    "messageId": 261,
    "title": "Deniz Üstü Köpürür",
    "artist": "Moğollar & Cem Karaca",
    "album": "Cem Karaca & Moğollar",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:10",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Deniz Üstü Köpürür, Moğollar'ın 'Cem Karaca & Moğollar' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/261"
  },
  {
    "id": 1066,
    "messageId": 266,
    "title": "El Çek Tabip",
    "artist": "Moğollar & Cem Karaca",
    "album": "Cem Karaca & Moğollar",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "05:23",
    "cover": "assets/mogollar-artist.jpg",
    "story": "El Çek Tabip, Moğollar'ın 'Cem Karaca & Moğollar' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/266"
  },
  {
    "id": 1069,
    "messageId": 269,
    "title": "Gel Gel",
    "artist": "Moğollar & Cem Karaca",
    "album": "Cem Karaca & Moğollar",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:15",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Gel Gel, Moğollar'ın 'Cem Karaca & Moğollar' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/269"
  },
  {
    "id": 1075,
    "messageId": 275,
    "title": "İhtiyar Oldum",
    "artist": "Moğollar & Cem Karaca",
    "album": "Cem Karaca & Moğollar",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:22",
    "cover": "assets/mogollar-artist.jpg",
    "story": "İhtiyar Oldum, Moğollar'ın 'Cem Karaca & Moğollar' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/275"
  },
  {
    "id": 1030,
    "messageId": 230,
    "title": "Issızlığın Ortasında",
    "artist": "Moğollar",
    "album": "Moğollar '94",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "05:28",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Cahit Berkay'ın Sivas Madımak hüznünü yaylı tambur ve feryat eden melodilerle notalara döktüğü, Türk müzik tarihinin en sarsıcı ağıtlarından biri.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/230"
  },
  {
    "id": 1031,
    "messageId": 231,
    "title": "Kapalı Çarşı",
    "artist": "Moğollar",
    "album": "Düm-Tek / Klasikler",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "02:24",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Kapalı Çarşı, Moğollar'ın 'Düm-Tek / Klasikler' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/231"
  },
  {
    "id": 1032,
    "messageId": 232,
    "title": "Keyfim Yerinde",
    "artist": "Moğollar",
    "album": "Dört Renk",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:18",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Keyfim Yerinde, Moğollar'ın 'Dört Renk' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/232"
  },
  {
    "id": 1033,
    "messageId": 233,
    "title": "Madımak",
    "artist": "Moğollar",
    "album": "Moğollar '94",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "01:53",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Madımak, Moğollar'ın 'Moğollar '94' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/233"
  },
  {
    "id": 1034,
    "messageId": 234,
    "title": "Mektup",
    "artist": "Moğollar",
    "album": "Moğollar '94",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "01:51",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Mektup, Moğollar'ın 'Moğollar '94' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/234"
  },
  {
    "id": 1035,
    "messageId": 235,
    "title": "Metris'in Önünde",
    "artist": "Moğollar",
    "album": "Yürüdük Durmadan",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:28",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Metris'in Önünde, Moğollar'ın 'Yürüdük Durmadan' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/235"
  },
  {
    "id": 1038,
    "messageId": 238,
    "title": "Peri Bacaları",
    "artist": "Moğollar",
    "album": "Danses et Rythmes de la Turquie",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:24",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Kapadokya'nın masalsı coğrafyasını yaylı tambur ve psikedelik gitarlarla betimleyen, 1971 Académie Charles Cros ödüllü parça.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/238"
  },
  {
    "id": 1039,
    "messageId": 239,
    "title": "Selvi Boylum Al Yazmalım - Live",
    "artist": "Moğollar",
    "album": "Moğollar Canlı",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:09",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Kadir İnanır ve Türkan Şoray'ın başyapıtına can veren, Cahit Berkay'ın unutulmaz cura ve bağlama temasıyla sevginin ve emeğin ölümsüz marşı (Canlı).",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/239"
  },
  {
    "id": 1040,
    "messageId": 240,
    "title": "Selvi Boylum Al Yazmalım D2D Session",
    "artist": "Moğollar",
    "album": "Direct-to-Disc Sessions",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:56",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Selvi Boylum Al Yazmalım'ın doğrudan plağa kesim (Direct-to-Disc) teknolojisiyle kaydedilmiş kristal berraklığındaki stüdyo seansı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/240"
  },
  {
    "id": 1041,
    "messageId": 241,
    "title": "Sen Varsın Orda",
    "artist": "Moğollar",
    "album": "Dört Renk",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "06:59",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Sen Varsın Orda, Moğollar'ın 'Dört Renk' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/241"
  },
  {
    "id": 1042,
    "messageId": 242,
    "title": "Sessiz Gemi",
    "artist": "Moğollar",
    "album": "Moğollar Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "02:48",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Yahya Kemal Beyatlı'nın ölümsüz şiirine atıfta bulunan, dingin deniz dalgaları ve akustik dokusuyla hüzünlü bir Moğollar yorumu.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/242"
  },
  {
    "id": 1043,
    "messageId": 243,
    "title": "Sihirli Ay",
    "artist": "Moğollar",
    "album": "Anadolu Pop",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "02:57",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Sihirli Ay, Moğollar'ın 'Anadolu Pop' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/243"
  },
  {
    "id": 1045,
    "messageId": 245,
    "title": "Umut Yolunu Bulur",
    "artist": "Moğollar",
    "album": "Umut Yolunu Bulur",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "05:27",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Umut Yolunu Bulur, Moğollar'ın 'Umut Yolunu Bulur' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/245"
  },
  {
    "id": 1046,
    "messageId": 246,
    "title": "Yolum Seninle",
    "artist": "Moğollar",
    "album": "Yürüdük Durmadan",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:22",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Yolum Seninle, Moğollar'ın 'Yürüdük Durmadan' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/246"
  },
  {
    "id": 1047,
    "messageId": 247,
    "title": "Yürüdük Durmadan",
    "artist": "Moğollar",
    "album": "Yürüdük Durmadan",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:54",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Yürüdük Durmadan, Moğollar'ın 'Yürüdük Durmadan' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/247"
  },
  {
    "id": 1048,
    "messageId": 248,
    "title": "7 / 8 - 9 / 8",
    "artist": "Moğollar",
    "album": "Anadolu Pop",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:11",
    "cover": "assets/mogollar-artist.jpg",
    "story": "7 / 8 - 9 / 8, Moğollar'ın 'Anadolu Pop' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/248"
  },
  {
    "id": 1049,
    "messageId": 249,
    "title": "Ağrı Dağı Efsanesi",
    "artist": "Moğollar",
    "album": "Danses et Rythmes de la Turquie",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:43",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Fransa'da Académie Charles Cros Büyük Plak Ödülü'nü kazanan 'Danses et Rythmes de la Turquie' albümünün görkemli açılış destanı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/249"
  },
  {
    "id": 1051,
    "messageId": 251,
    "title": "Alageyik Destanı",
    "artist": "Moğollar",
    "album": "Anadolu Pop",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:04",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Alageyik Destanı, Moğollar'ın 'Anadolu Pop' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/251"
  },
  {
    "id": 1052,
    "messageId": 252,
    "title": "Alageyik",
    "artist": "Moğollar",
    "album": "Anadolu Pop",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:04",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Alageyik, Moğollar'ın 'Anadolu Pop' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/252"
  },
  {
    "id": 1053,
    "messageId": 253,
    "title": "Artık Çok Geç",
    "artist": "Moğollar",
    "album": "Dört Renk",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:12",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Artık Çok Geç, Moğollar'ın 'Dört Renk' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/253"
  },
  {
    "id": 1054,
    "messageId": 254,
    "title": "Bi’ Şey Yapmalı D2D Session",
    "artist": "Moğollar",
    "album": "Direct-to-Disc Sessions",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:13",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Direct-to-Disc seansında tek seferde kaydedilmiş, enerjisi ve dinamizmi yüksek bir 'Bi' Şey Yapmalı' performansı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/254"
  },
  {
    "id": 1055,
    "messageId": 255,
    "title": "Birşey Yapmalı",
    "artist": "Moğollar",
    "album": "Moğollar '94",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:24",
    "cover": "assets/mogollar-artist.jpg",
    "story": "'Bir şey yapmalı hey!' haykırışıyla 90'larda Moğollar'ın geri dönüşünü simgeleyen ve toplumsal vicdanı uyandıran efsanevi protest rock marşı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/255"
  },
  {
    "id": 1056,
    "messageId": 256,
    "title": "Bu Dünya Bizim",
    "artist": "Moğollar",
    "album": "Yürüdük Durmadan",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:47",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Bu Dünya Bizim, Moğollar'ın 'Yürüdük Durmadan' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/256"
  },
  {
    "id": 1057,
    "messageId": 257,
    "title": "Bu Nasıl Dünya - Enstrümantal",
    "artist": "Moğollar",
    "album": "Moğollar Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:35",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Bu Nasıl Dünya - Enstrümantal, Moğollar'ın 'Moğollar Klasikleri' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/257"
  },
  {
    "id": 1058,
    "messageId": 258,
    "title": "Çaya Kaç Şeker",
    "artist": "Moğollar",
    "album": "Dört Renk",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:20",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Çaya Kaç Şeker, Moğollar'ın 'Dört Renk' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/258"
  },
  {
    "id": 1059,
    "messageId": 259,
    "title": "Çığrık",
    "artist": "Moğollar",
    "album": "Danses et Rythmes de la Turquie",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:19",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Çığrık, Moğollar'ın 'Danses et Rythmes de la Turquie' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/259"
  },
  {
    "id": 1060,
    "messageId": 260,
    "title": "Dağ Ve Çocuk",
    "artist": "Moğollar",
    "album": "Anadolu Pop (1970)",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:19",
    "cover": "assets/mogollar-artist.jpg",
    "story": "1970'te kaydedilen, Anadolu'nun dağ rüzgarlarını progresif rock ritimleriyle buluşturan öncü bir Moğollar enstrümantali.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/260"
  },
  {
    "id": 1062,
    "messageId": 262,
    "title": "Dinleyiverin Gari",
    "artist": "Moğollar",
    "album": "Moğollar '94",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:26",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Cahit Berkay ve ekibinin Ege zeybeğini ve neşesini modern rock kalıplarıyla yoğurduğu, kıvrak ve coşkulu bir klasik.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/262"
  },
  {
    "id": 1063,
    "messageId": 263,
    "title": "Dinleyiverin Gayri",
    "artist": "Moğollar",
    "album": "Moğollar '94",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:26",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Dinleyiverin Gayri, Moğollar'ın 'Moğollar '94' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/263"
  },
  {
    "id": 1064,
    "messageId": 264,
    "title": "Dörde Özlem",
    "artist": "Moğollar",
    "album": "Dört Renk",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "07:38",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Dörde Özlem, Moğollar'ın 'Dört Renk' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/264"
  },
  {
    "id": 1065,
    "messageId": 265,
    "title": "Düm-Tek",
    "artist": "Moğollar",
    "album": "Düm-Tek (1975)",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "02:42",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Düm-Tek, Moğollar'ın 'Düm-Tek (1975)' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/265"
  },
  {
    "id": 1067,
    "messageId": 267,
    "title": "Gam Yükü",
    "artist": "Moğollar",
    "album": "Yürüdük Durmadan",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:54",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Gam Yükü, Moğollar'ın 'Yürüdük Durmadan' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/267"
  },
  {
    "id": 1068,
    "messageId": 268,
    "title": "Gece Sesleri",
    "artist": "Moğollar",
    "album": "Dört Renk",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "05:20",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Gece Sesleri, Moğollar'ın 'Dört Renk' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/268"
  },
  {
    "id": 1070,
    "messageId": 270,
    "title": "Geri Sar",
    "artist": "Moğollar",
    "album": "Umut Yolunu Bulur",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:34",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Geri Sar, Moğollar'ın 'Umut Yolunu Bulur' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/270"
  },
  {
    "id": 1071,
    "messageId": 271,
    "title": "Günebakan",
    "artist": "Moğollar",
    "album": "Dört Renk",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:32",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Günebakan, Moğollar'ın 'Dört Renk' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/271"
  },
  {
    "id": 1072,
    "messageId": 272,
    "title": "Haliç'te Gün Batımı",
    "artist": "Moğollar",
    "album": "Danses et Rythmes de la Turquie",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:10",
    "cover": "assets/mogollar-artist.jpg",
    "story": "İstanbul'un altın boynuzunu progresif klavye ve yaylı tambur tınılarıyla resmeden, sinematik bir başyapıt.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/272"
  },
  {
    "id": 1073,
    "messageId": 273,
    "title": "Haliç'te Güneşin Batışı",
    "artist": "Moğollar",
    "album": "Anadolu Pop Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "04:22",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Haliç'te Güneşin Batışı, Moğollar'ın 'Anadolu Pop Klasikleri' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/273"
  },
  {
    "id": 1074,
    "messageId": 274,
    "title": "Hudey Hudey",
    "artist": "Moğollar",
    "album": "Anadolu Pop",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:41",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Hudey Hudey, Moğollar'ın 'Anadolu Pop' albümünde yer alan, Anadolu Pop ve progresif rock tarihimizin değerli bir eseridir.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/274"
  },
  {
    "id": 1076,
    "messageId": 276,
    "title": "Iklıg",
    "artist": "Moğollar",
    "album": "Danses et Rythmes de la Turquie",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:07",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Orta Asya kökenli kadim Türk çalgısı ıklığdan ilham alan, otantik ezgilerle Batı rock armonilerini harmanlayan ödüllü kayıt.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/276"
  },
  {
    "id": 1077,
    "messageId": 277,
    "title": "Ilgaz",
    "artist": "Moğollar",
    "album": "Danses et Rythmes de la Turquie",
    "category": "turkce",
    "categoryTitle": "Anadolu Pop & Progresif Rock",
    "duration": "03:01",
    "cover": "assets/mogollar-artist.jpg",
    "story": "Ilgaz Dağı'nın heybetini elektro bağlama ve davul sololarıyla destanlaştıran bir Anadolu Pop anıtı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/277"
  },
  {
    "id": 2099,
    "messageId": 99,
    "title": "Kupa Kızı Ve Sinek Valesi",
    "artist": "Teoman",
    "album": "Gönülçelen",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:29",
    "cover": "assets/teoman-artist.jpg",
    "story": "Göksel ile efsanevi düeti ve yalnız iskambil masalarının metaforuyla örülü, Teoman'ın en derin melodramatik şarkılarından biri.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/99"
  },
  {
    "id": 2100,
    "messageId": 100,
    "title": "Mavi Kuş İle Küçük Kız",
    "artist": "Teoman",
    "album": "İnsanlık Halleri",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "03:59",
    "cover": "assets/teoman-artist.jpg",
    "story": "Mavi Kuş İle Küçük Kız, Teoman'ın 'İnsanlık Halleri' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/100"
  },
  {
    "id": 2101,
    "messageId": 101,
    "title": "Mavi",
    "artist": "Teoman",
    "album": "Teoman (1996)",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "03:40",
    "cover": "assets/teoman-artist.jpg",
    "story": "Mavi, Teoman'ın 'Teoman (1996)' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/101"
  },
  {
    "id": 2102,
    "messageId": 102,
    "title": "Mektup",
    "artist": "Teoman",
    "album": "O",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:12",
    "cover": "assets/teoman-artist.jpg",
    "story": "Mektup, Teoman'ın 'O' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/102"
  },
  {
    "id": 2103,
    "messageId": 103,
    "title": "O",
    "artist": "Teoman",
    "album": "O",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "03:15",
    "cover": "assets/teoman-artist.jpg",
    "story": "O, Teoman'ın 'O' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/103"
  },
  {
    "id": 2104,
    "messageId": 104,
    "title": "Papatya",
    "artist": "Teoman",
    "album": "Teoman (1996)",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:03",
    "cover": "assets/teoman-artist.jpg",
    "story": "90'lar gençliğinin saf naifliğini ve ilk aşkın kırılgan heyecanını anlatan, akustik gitar ritmiyle parlayan bir Teoman klasiği.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/104"
  },
  {
    "id": 2105,
    "messageId": 105,
    "title": "Paramparça",
    "artist": "Teoman",
    "album": "Onyedi",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "03:51",
    "cover": "assets/teoman-artist.jpg",
    "story": "Bir dönemin ruh halini özetleyen; 'Saat 12'ye geliyor, hava karardı yine...' dizeleriyle başlayan nesiller boyu söylenen marş.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/105"
  },
  {
    "id": 2106,
    "messageId": 106,
    "title": "Parti",
    "artist": "Teoman",
    "album": "Aşk & Gurur",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "05:00",
    "cover": "assets/teoman-artist.jpg",
    "story": "Parti, Teoman'ın 'Aşk & Gurur' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/106"
  },
  {
    "id": 2107,
    "messageId": 107,
    "title": "Rapsodi İstanbul",
    "artist": "Teoman",
    "album": "Teoman (2003)",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:39",
    "cover": "assets/teoman-artist.jpg",
    "story": "Rapsodi İstanbul, Teoman'ın 'Teoman (2003)' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/107"
  },
  {
    "id": 2108,
    "messageId": 108,
    "title": "Rüzgar Gülü",
    "artist": "Teoman",
    "album": "Teoman (2003)",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "03:17",
    "cover": "assets/teoman-artist.jpg",
    "story": "Rüzgarın yönüyle savrulan bir aşkın ardından melankoli ve kabulleniş dolu, yaylılarla zenginleştirilmiş sinematik bir parça.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/108"
  },
  {
    "id": 2109,
    "messageId": 109,
    "title": "Senden Önce Senden Sonra",
    "artist": "Teoman",
    "album": "Aşk & Gurur",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:05",
    "cover": "assets/teoman-artist.jpg",
    "story": "Aşkın bitişini ve sonrasındaki boşluğu yalın bir iç döküşle anlatan modern bir Türkçe rock başyapıtı.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/109"
  },
  {
    "id": 2110,
    "messageId": 110,
    "title": "Sus Konuşma",
    "artist": "Teoman",
    "album": "O",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:32",
    "cover": "assets/teoman-artist.jpg",
    "story": "Sus Konuşma, Teoman'ın 'O' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/110"
  },
  {
    "id": 2111,
    "messageId": 111,
    "title": "Sürpriz",
    "artist": "Teoman",
    "album": "O",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "03:34",
    "cover": "assets/teoman-artist.jpg",
    "story": "Sürpriz, Teoman'ın 'O' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/111"
  },
  {
    "id": 2112,
    "messageId": 112,
    "title": "Tesadüfler",
    "artist": "Teoman",
    "album": "Gönülçelen",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:29",
    "cover": "assets/teoman-artist.jpg",
    "story": "Tesadüfler, Teoman'ın 'Gönülçelen' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/112"
  },
  {
    "id": 2113,
    "messageId": 113,
    "title": "Uçurtmalar",
    "artist": "Teoman",
    "album": "Onyedi",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "05:29",
    "cover": "assets/teoman-artist.jpg",
    "story": "Uçurtmalar, Teoman'ın 'Onyedi' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/113"
  },
  {
    "id": 2114,
    "messageId": 114,
    "title": "Uykusuz Her Gece",
    "artist": "Teoman",
    "album": "Onyedi",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "03:50",
    "cover": "assets/teoman-artist.jpg",
    "story": "Uykusuz Her Gece, Teoman'ın 'Onyedi' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/114"
  },
  {
    "id": 2115,
    "messageId": 115,
    "title": "Yağmur",
    "artist": "Teoman",
    "album": "O",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:14",
    "cover": "assets/teoman-artist.jpg",
    "story": "Yağmur, Teoman'ın 'O' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/115"
  },
  {
    "id": 2116,
    "messageId": 116,
    "title": "Yalnız Kalpler Sütunu",
    "artist": "Teoman",
    "album": "Gönülçelen",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "06:45",
    "cover": "assets/teoman-artist.jpg",
    "story": "Yalnız Kalpler Sütunu, Teoman'ın 'Gönülçelen' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/116"
  },
  {
    "id": 2117,
    "messageId": 117,
    "title": "17",
    "artist": "Teoman",
    "album": "Onyedi",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "03:46",
    "cover": "assets/teoman-artist.jpg",
    "story": "On yedi yaşın o delişmen, durdurulamaz ve kırılgan coşkusunu ölümsüzleştiren, elektro gitarların fırtına gibi estiği efsane.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/117"
  },
  {
    "id": 2118,
    "messageId": 118,
    "title": "Anlıyorsun Değil Mi?",
    "artist": "Teoman",
    "album": "Gönülçelen",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "03:28",
    "cover": "assets/teoman-artist.jpg",
    "story": "Anlıyorsun Değil Mi?, Teoman'ın 'Gönülçelen' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/118"
  },
  {
    "id": 2119,
    "messageId": 119,
    "title": "Aşk Kırıntıları",
    "artist": "Teoman",
    "album": "Renkli Rüyalar Oteli",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:34",
    "cover": "assets/teoman-artist.jpg",
    "story": "'Bana biraz renk ver...' çığlığıyla ruhun tükenmişliğini ve sevginin son kırıntılarını arayan dokunaklı bir balad.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/119"
  },
  {
    "id": 2120,
    "messageId": 120,
    "title": "Bazı Yalanlar",
    "artist": "Teoman",
    "album": "O",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:32",
    "cover": "assets/teoman-artist.jpg",
    "story": "Bazı Yalanlar, Teoman'ın 'O' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/120"
  },
  {
    "id": 2121,
    "messageId": 121,
    "title": "Bugün",
    "artist": "Teoman",
    "album": "O",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "05:06",
    "cover": "assets/teoman-artist.jpg",
    "story": "Bugün, Teoman'ın 'O' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/121"
  },
  {
    "id": 2122,
    "messageId": 122,
    "title": "Çoban Yıldızı",
    "artist": "Teoman",
    "album": "İnsanlık Halleri",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:00",
    "cover": "assets/teoman-artist.jpg",
    "story": "Çoban Yıldızı, Teoman'ın 'İnsanlık Halleri' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/122"
  },
  {
    "id": 2123,
    "messageId": 123,
    "title": "Dursun Dünya",
    "artist": "Teoman",
    "album": "Renkli Rüyalar Oteli",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:20",
    "cover": "assets/teoman-artist.jpg",
    "story": "Dursun Dünya, Teoman'ın 'Renkli Rüyalar Oteli' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/123"
  },
  {
    "id": 2124,
    "messageId": 124,
    "title": "En Güzel Hikayem",
    "artist": "Teoman",
    "album": "En Güzel Hikayem",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "07:32",
    "cover": "assets/teoman-artist.jpg",
    "story": "En Güzel Hikayem, Teoman'ın 'En Güzel Hikayem' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/124"
  },
  {
    "id": 2125,
    "messageId": 125,
    "title": "Gemiler",
    "artist": "Teoman",
    "album": "O",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:16",
    "cover": "assets/teoman-artist.jpg",
    "story": "Fikret Kızılok bestesini Teoman'ın karakteristik boğuk vokali ve rock altyapısıyla unutulmaz kıldığı kült deniz şarkısı.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/125"
  },
  {
    "id": 2126,
    "messageId": 126,
    "title": "Gökdelenler",
    "artist": "Teoman",
    "album": "Teoman (2003)",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "03:42",
    "cover": "assets/teoman-artist.jpg",
    "story": "Gökdelenler, Teoman'ın 'Teoman (2003)' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/126"
  },
  {
    "id": 2127,
    "messageId": 127,
    "title": "Gönülçelen",
    "artist": "Teoman",
    "album": "Gönülçelen",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:46",
    "cover": "assets/teoman-artist.jpg",
    "story": "J.D. Salinger'ın Çavdar Tarlasında Çocuklar romanından ilham alan, yalnız çocukların ve hüzünlü kadınların edebi hikayesi.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/127"
  },
  {
    "id": 2128,
    "messageId": 128,
    "title": "Güzel Bir Gün",
    "artist": "Teoman",
    "album": "En Güzel Hikayem",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "05:16",
    "cover": "assets/teoman-artist.jpg",
    "story": "Güzel Bir Gün, Teoman'ın 'En Güzel Hikayem' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/128"
  },
  {
    "id": 2129,
    "messageId": 129,
    "title": "Hayalperest",
    "artist": "Teoman",
    "album": "Teoman (1996)",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "03:09",
    "cover": "assets/teoman-artist.jpg",
    "story": "Hayalperest, Teoman'ın 'Teoman (1996)' albümünde yer alan, modern kent hayatının ve yalnızlığın çarpıcı bir rock anlatımıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/129"
  },
  {
    "id": 2130,
    "messageId": 130,
    "title": "İki Yabancı",
    "artist": "Teoman & Şebnem Ferah",
    "album": "Onyedi",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:06",
    "cover": "assets/sebnem-ferah-artist.webp",
    "story": "Şebnem Ferah ve Teoman'ın Türk rock tarihine kazıdığı, iki eski sevgilinin birbirine yabancılaşmasını anlatan ölümsüz düet.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/130"
  },
  {
    "id": 2131,
    "messageId": 131,
    "title": "İstanbul'da Sonbahar - 2002 Mix",
    "artist": "Teoman",
    "album": "Gönülçelen",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "03:40",
    "cover": "assets/teoman-artist.jpg",
    "story": "Boğaz kıyılarında dökülen sarı yapraklar, hüzünlü yaylılar ve Teoman'ın şiirsel vokaliyle İstanbul'a yazılmış en güzel ağıt.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/131"
  },
  {
    "id": 2132,
    "messageId": 132,
    "title": "İstasyon İnsanları",
    "artist": "Teoman",
    "album": "Gönülçelen",
    "category": "turkce",
    "categoryTitle": "Türk Rock & Kent Ozanı",
    "duration": "04:02",
    "cover": "assets/teoman-artist.jpg",
    "story": "İstasyonda gelip geçen hayatların, ayrılıkların ve kavuşamayanların hüznünü sinematik bir dille anlatan derin bir eser.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/132"
  },
  {
    "id": 3278,
    "messageId": 278,
    "title": "Kızılcıklar Oldumu",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "03:18",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Kızılcıklar Oldumu, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/278"
  },
  {
    "id": 3279,
    "messageId": 279,
    "title": "Mahsus Mahal",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "02:58",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Mahsus Mahal, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/279"
  },
  {
    "id": 3280,
    "messageId": 280,
    "title": "Öpmek İsterdim",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "03:45",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Öpmek İsterdim, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/280"
  },
  {
    "id": 3281,
    "messageId": 281,
    "title": "Öyle Bir Yerdeyim Ki",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:20",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Öyle Bir Yerdeyim Ki, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/281"
  },
  {
    "id": 3282,
    "messageId": 282,
    "title": "Rinna Nay",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:10",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Rinna Nay, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/282"
  },
  {
    "id": 3283,
    "messageId": 283,
    "title": "Sen Olasın",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:58",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Sen Olasın, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/283"
  },
  {
    "id": 3284,
    "messageId": 284,
    "title": "Sevenler Ağlarmış",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "03:50",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Ayrılığın ardından dökülen gözyaşlarını ve çaresizliği Anadolu rock tınılarıyla haykıran klasik bir Haluk Levent eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/284"
  },
  {
    "id": 3285,
    "messageId": 285,
    "title": "Sivas Ellerinde Sazım Çalınır",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:39",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Sivas Ellerinde Sazım Çalınır, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/285"
  },
  {
    "id": 3286,
    "messageId": 286,
    "title": "Şehrimden Şehrine",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "05:02",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Şehrimden Şehrine, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/286"
  },
  {
    "id": 3287,
    "messageId": 287,
    "title": "Şifa Istemem Balından",
    "artist": "Haluk Levent & Cem Adrian",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:35",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Cem Adrian ile birlikte Aşık Veysel dizelerine nefes veren, yaylılar ve iki dev vokal ile büyüleyen bir halk türküsü yorumu.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/287"
  },
  {
    "id": 3288,
    "messageId": 288,
    "title": "Tutki Cildirdim",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "03:56",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Tutki Cildirdim, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/288"
  },
  {
    "id": 3289,
    "messageId": 289,
    "title": "Vazgeçmem",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:13",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Vazgeçmem, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/289"
  },
  {
    "id": 3290,
    "messageId": 290,
    "title": "Vefasız",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:35",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Vefasız, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/290"
  },
  {
    "id": 3291,
    "messageId": 291,
    "title": "Yalan",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:38",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Yalan, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/291"
  },
  {
    "id": 3292,
    "messageId": 292,
    "title": "Yarın Yok",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:07",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Yarın Yok, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/292"
  },
  {
    "id": 3293,
    "messageId": 293,
    "title": "Yeter Artık Deli Gönül",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:31",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Yeter Artık Deli Gönül, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/293"
  },
  {
    "id": 3294,
    "messageId": 294,
    "title": "Yeterki",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "03:57",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Yeterki, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/294"
  },
  {
    "id": 3295,
    "messageId": 295,
    "title": "Yollarda Bulurum Seni",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:29",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Gece yolculuklarının, bitmeyen mesafelerin ve aşığın arayışının marşı; Haluk Levent'in en çok sevilen ikonik şarkısı.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/295"
  },
  {
    "id": 3296,
    "messageId": 296,
    "title": "Zifiri",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "06:05",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Gecenin karanlığına ve yalnızlığa sığınan bir aşığın içsel hesaplaşması; hırçın vokaller ve güçlü gitar soloları.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/296"
  },
  {
    "id": 3297,
    "messageId": 297,
    "title": "Zor Aşk",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:16",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Zor Aşk, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/297"
  },
  {
    "id": 3298,
    "messageId": 298,
    "title": "Acılara Tutunmak",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:11",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Acılara Tutunmak, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/298"
  },
  {
    "id": 3299,
    "messageId": 299,
    "title": "Ah Bir Ateş Ver",
    "artist": "Haluk Levent & Hayko Cepkin",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "05:08",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Hayko Cepkin ile birlikte Çanakkale ve Kurtuluş Savaşı kahramanlarına adanan, dinleyenlerin tüylerini ürperten efsanevi ağıt.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/299"
  },
  {
    "id": 3300,
    "messageId": 300,
    "title": "Akdeniz Akşamları",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:27",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Akdeniz sahillerinde yakılan ateşlerin etrafında kuşaklar boyu söylenen, Türk gençliğinin ortak hafızası haline gelmiş marş.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/300"
  },
  {
    "id": 3301,
    "messageId": 301,
    "title": "Akşam Üstü",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:09",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Akşam Üstü, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/301"
  },
  {
    "id": 3302,
    "messageId": 302,
    "title": "Alışamadım",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:40",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Alışamadım, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/302"
  },
  {
    "id": 3303,
    "messageId": 303,
    "title": "Allı Turnam",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "05:11",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Allı Turnam, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/303"
  },
  {
    "id": 3304,
    "messageId": 304,
    "title": "Ankara",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:33",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Ayazı, sokakları ve gri hüznüyle Ankara'ya adanmış, yürek burkan bir hasret ve sevda şarkısı.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/304"
  },
  {
    "id": 3305,
    "messageId": 305,
    "title": "Anlasana - Live",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:54",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "İlhan İrem'in ölümsüz bestesini Haluk Levent'in sahnede canlı ve coşkulu bir Anadolu rock fırtınasına dönüştürdüğü eşsiz kayıt.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/305"
  },
  {
    "id": 3306,
    "messageId": 306,
    "title": "Aşkın Mapushane",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:59",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Aşkın Mapushane, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/306"
  },
  {
    "id": 3307,
    "messageId": 307,
    "title": "Ayrılık",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:30",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Ayrılık, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/307"
  },
  {
    "id": 3308,
    "messageId": 308,
    "title": "Bahçe Duvarından Aştım",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "03:36",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Bahçe Duvarından Aştım, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/308"
  },
  {
    "id": 3309,
    "messageId": 309,
    "title": "Bir Gece Vakti - Ararım Seni",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "05:19",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Bir Gece Vakti - Ararım Seni, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/309"
  },
  {
    "id": 3310,
    "messageId": 310,
    "title": "Bir Güldün Yar",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:03",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Bir Güldün Yar, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/310"
  },
  {
    "id": 3311,
    "messageId": 311,
    "title": "Bu Aşk Burada Biter",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "03:58",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Ataol Behramoğlu'nun 'Bu aşk burada biter ve ben çekip giderim' dizelerini notalara döken edebi bir başyapıt.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/311"
  },
  {
    "id": 3312,
    "messageId": 312,
    "title": "Bu Son Olsun Bu Son",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:12",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Bu Son Olsun Bu Son, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/312"
  },
  {
    "id": 3313,
    "messageId": 313,
    "title": "Çemberimde Gül Oya",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "02:44",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Çemberimde Gül Oya, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/313"
  },
  {
    "id": 3314,
    "messageId": 314,
    "title": "Dağlar",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "05:31",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Dağlar, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/314"
  },
  {
    "id": 3315,
    "messageId": 315,
    "title": "Dağlara Küstüm",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:21",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Dağlara Küstüm, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/315"
  },
  {
    "id": 3316,
    "messageId": 316,
    "title": "Deliler",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:22",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Deliler, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/316"
  },
  {
    "id": 3317,
    "messageId": 317,
    "title": "Ela Gözlü",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "03:42",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Ela Gözlü, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/317"
  },
  {
    "id": 3318,
    "messageId": 318,
    "title": "Elfida",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "05:33",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Kanserle mücadele eden küçük bir kız çocuğuna adanmış, dinleyen herkesin yüreğini sızlatan Türk rock tarihinin en dokunaklı ağıtı.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/318"
  },
  {
    "id": 3319,
    "messageId": 319,
    "title": "Gönül Çalamazsan Aşkın Sazını",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:43",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Gönül Çalamazsan Aşkın Sazını, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/319"
  },
  {
    "id": 3320,
    "messageId": 320,
    "title": "Gülendam",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "03:39",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Gülendam, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/320"
  },
  {
    "id": 3321,
    "messageId": 321,
    "title": "Gülün Bittiği Yer",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:50",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Gülün Bittiği Yer, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/321"
  },
  {
    "id": 3322,
    "messageId": 322,
    "title": "Hani Benim Olacaktın",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:11",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Aşkın hayal kırıklığını ve verilen sözlerin unutuluşunu sert gitarlarla dile getiren 90'lar Anadolu rock klasiği.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/322"
  },
  {
    "id": 3323,
    "messageId": 323,
    "title": "İçimde Ölen Biri",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "04:02",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "İçimde Ölen Biri, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/323"
  },
  {
    "id": 3324,
    "messageId": 324,
    "title": "Kaçış",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "01:59",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Kaçış, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/324"
  },
  {
    "id": 3325,
    "messageId": 325,
    "title": "Kağızman",
    "artist": "Haluk Levent",
    "album": "Haluk Levent Klasikleri",
    "category": "turkce",
    "categoryTitle": "Anadolu Rock & Halk Müziği",
    "duration": "03:42",
    "cover": "assets/haluk-levent-artist.jpg",
    "story": "Kağızman, Haluk Levent tarafından Anadolu ezgileri ve modern rock ritimleriyle harmanlanmış güçlü bir halk eseri.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/325"
  },
  {
    "id": 4326,
    "messageId": 326,
    "title": "Flying Without Wings (Westlife)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "03:19",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Westlife'ın lirik pop baladının Royal Philharmonic Orchestra yaylıları ve nefeslileriyle zenginleşen sıcak senfonik yorumu.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/326"
  },
  {
    "id": 4327,
    "messageId": 327,
    "title": "Everybody Hurts (R.E.M.)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "04:57",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "R.E.M.'in teselli ve umut marşının derin çello ve keman partisyonlarıyla kalbe dokunan senfonik icrası.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/327"
  },
  {
    "id": 4328,
    "messageId": 328,
    "title": "Every Breath You Take (The Police)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "04:11",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Sting ve The Police'in ikonik gitar rifflerinin senfoni orkestrası yaylılarına ve pizzicato tonlarına uyarlandığı zarif kayıt.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/328"
  },
  {
    "id": 4329,
    "messageId": 329,
    "title": "Let It Be (The Beatles)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "04:58",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "The Beatles ve Paul McCartney'nin barış ve teslimiyet ilahisinin görkemli orkestral zenginlikle yeniden hayat buluşu.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/329"
  },
  {
    "id": 4330,
    "messageId": 330,
    "title": "A Whiter Shade Of Pale (Procol Harum)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "04:29",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Bach'ın Air on the G String melodisine selam duran Procol Harum klasiğinin kraliyet filarmonisinin org ve yaylılarıyla bütünleştiği şaheser.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/330"
  },
  {
    "id": 4331,
    "messageId": 331,
    "title": "Nights In White Satin (The Moody Blues)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "04:15",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Senfonik rockın doğumunu müjdeleyen Moody Blues başyapıtının tam kadro filarmoni ile ulaştığı destansı doruk noktası.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/331"
  },
  {
    "id": 4332,
    "messageId": 332,
    "title": "Candle In The Wind (Elton John)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "04:08",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Elton John ve Bernie Taupin'in hüzünlü ağıtının narin piyano ve yaylı kadanslarıyla işlenen dokunaklı aranjmanı.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/332"
  },
  {
    "id": 4333,
    "messageId": 333,
    "title": "Imagine (John Lennon)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "04:13",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "John Lennon'ın sınırsız ve barış dolu dünya vizyonunun senfonik bir saflık ve dinginlikle yankılanan ölümsüz melodisi.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/333"
  },
  {
    "id": 4334,
    "messageId": 334,
    "title": "Come Away With Me (Norah Jones)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "03:33",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Norah Jones'un caz ve akustik dünyasından süzülen sıcacık aşk fısıltısının yumuşak yaylı dalgalarıyla sarmalanması.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/334"
  },
  {
    "id": 4335,
    "messageId": 335,
    "title": "Here With Me (Dido)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "04:17",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Dido'nun melankolik vokal melodisinin obua, flüt ve yaylılarla sinematik bir atmosfere dönüştürüldüğü etkileyici yorum.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/335"
  },
  {
    "id": 4336,
    "messageId": 336,
    "title": "Millennium (Robbie Williams)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "03:50",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "James Bond 'You Only Live Twice' sample'ı üzerine kurulan Robbie Williams hiti; orkestral pirinç üflemelilerin ihtişamıyla parlıyor.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/336"
  },
  {
    "id": 4337,
    "messageId": 337,
    "title": "Hero (Enrique Iglesias)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "04:16",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Enrique Iglesias'ın romantik baladının crescendo yapan yaylılar ve vurmalılarla destansı bir duygu seline evrilmesi.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/337"
  },
  {
    "id": 4338,
    "messageId": 338,
    "title": "What Can I Do (The Corrs)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "04:06",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Kelt ezgileri ve modern pop-rock tınılarının Royal Philharmonic Orchestra'nın virtüöz yaylılarıyla harmanlandığı enerjik bir icra.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/338"
  },
  {
    "id": 4339,
    "messageId": 339,
    "title": "Beautiful Day (U2)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "04:13",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "U2'nun stadyumları inleten umut marşının filarmoni orkestrası tarafından göğe yükselen yaylı partisyonlarıyla canlandırılması.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/339"
  },
  {
    "id": 4340,
    "messageId": 340,
    "title": "Champagne Supernova (Oasis)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "05:38",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Noel Gallagher'ın saykodelik britpop destanının orkestral derinlik ve dramatik yaylı sololarıyla kazandığı sinematik boyut.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/340"
  },
  {
    "id": 4341,
    "messageId": 341,
    "title": "Handbags & Gladrags (Stereophonics)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "04:52",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Mike d'Abo bestesi ve Rod Stewart/Stereophonics yorumuyla tanınan klasiğin kederli üflemeli ve yaylı dokuması.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/341"
  },
  {
    "id": 4342,
    "messageId": 342,
    "title": "Why Does It Always Rain On Me? (Travis)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "03:29",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "İskoç indie rock grubu Travis'in yağmurlu melankolisinin filarmoni orkestrasının büyüleyici senfonik hüznüyle buluşması.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/342"
  },
  {
    "id": 4343,
    "messageId": 343,
    "title": "Livin' On A Prayer (Bon Jovi)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "05:04",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Bon Jovi'nin 80'ler arena rock marşının dinamik yaylılar, timpaniler ve güçlü bakır üflemelilerle kazandığı senfonik güç.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/343"
  },
  {
    "id": 4344,
    "messageId": 344,
    "title": "Stairway To Heaven (Led Zeppelin)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "06:15",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Rock tarihinin kutsal kasesi; akustik arpejlerden orkestral fırtınaya adım adım tırmanan görkemli bir senfonik şaheser.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/344"
  },
  {
    "id": 4345,
    "messageId": 345,
    "title": "Bat Out Of Hell (Meat Loaf)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "06:27",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Jim Steinman ve Meat Loaf'un teatral rock operasından fırlayan adrenalin dolu temanın orkestral patlaması.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/345"
  },
  {
    "id": 4346,
    "messageId": 346,
    "title": "Run To You (Bryan Adams)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "03:30",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Bryan Adams'ın keskin rock rifflerinin senfonik yaylı staccato'larıyla yeniden biçimlendiği sürükleyici bir tempo.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/346"
  },
  {
    "id": 4347,
    "messageId": 347,
    "title": "China In Your Hand (T'Pau)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "03:44",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "80'lerin lüks pop-rock baladının narin porselen zarafetini senfoni orkestrasının zengin yaylı paletiyle buluşturan yorum.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/347"
  },
  {
    "id": 4348,
    "messageId": 348,
    "title": "Torn (Natalie Imbruglia)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "04:30",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "90'lar pop kültürünün marşlarından Torn'un kırılgan melodisinin yaylı dörtlüsü ve orkestrayla editoryal bir derinlik kazanması.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/348"
  },
  {
    "id": 4349,
    "messageId": 349,
    "title": "Bittersweet Symphony (The Verve)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "03:40",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "The Rolling Stones sample'ından doğan ikonik yaylı motifinin, İngiltere'nin en köklü filarmonisi tarafından orijinal ihtişamıyla seslendirilişi.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/349"
  },
  {
    "id": 4350,
    "messageId": 350,
    "title": "Good Vibrations (The Beach Boys)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "04:35",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Brian Wilson'ın 'cep senfonisi' olarak nitelediği başyapıtının zengin orkestral katmanlar ve neşeli tınılarla kutlanması.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/350"
  },
  {
    "id": 4351,
    "messageId": 351,
    "title": "Bohemian Rhapsody (Queen)",
    "artist": "The Royal Philharmonic Orchestra",
    "album": "Symphonic Rock",
    "category": "classical",
    "categoryTitle": "Klasik & Senfonik Rock",
    "duration": "06:31",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "Freddie Mercury'nin opera ve rock'ı devrimsel şekilde harmanlayan başyapıtının tam kadro Royal Philharmonic ile taçlanan anıtsal zirvesi.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/351"
  },
  {
    "id": 4470,
    "messageId": 470,
    "title": "Four Seasons: Summer (Vivaldi)",
    "artist": "Yavuz Asöcal",
    "album": "Classicals With Oriental",
    "category": "classical",
    "categoryTitle": "Klasik & Doğu-Batı Sentezi",
    "duration": "03:00",
    "cover": "assets/classicals-with-oriental-beats-cover.jpg",
    "story": "Vivaldi'nin Dört Mevsim keman konçertosundan fırtınalı 'Yaz' temasının Doğu darbuka ve ritimleriyle harmanlandığı enerjik füzyon.",
    "aura1": "rgba(30, 58, 138, 0.35)",
    "aura2": "rgba(180, 83, 9, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/470"
  },
  {
    "id": 4471,
    "messageId": 471,
    "title": "Turkish March / Rondo Alla Turca (Mozart)",
    "artist": "Yavuz Asöcal",
    "album": "Classicals With Oriental",
    "category": "classical",
    "categoryTitle": "Klasik & Doğu-Batı Sentezi",
    "duration": "03:46",
    "cover": "assets/classicals-with-oriental-beats-cover.jpg",
    "story": "Mozart'ın mehter ve Osmanlı müziğinden esinlenerek bestelediği ünlü Türk Marşı'nın ney ve perküsyonlarla anavatanına dönüşü.",
    "aura1": "rgba(30, 58, 138, 0.35)",
    "aura2": "rgba(180, 83, 9, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/471"
  },
  {
    "id": 4472,
    "messageId": 472,
    "title": "Wedding March (Mendelssohn)",
    "artist": "Yavuz Asöcal",
    "album": "Classicals With Oriental",
    "category": "classical",
    "categoryTitle": "Klasik & Doğu-Batı Sentezi",
    "duration": "03:46",
    "cover": "assets/classicals-with-oriental-beats-cover.jpg",
    "story": "Mendelssohn'un ölümsüz Düğün Marşı'nın sıcak oryantal yaylılar ve kıvrak ritimlerle yeniden yorumlanışı.",
    "aura1": "rgba(30, 58, 138, 0.35)",
    "aura2": "rgba(180, 83, 9, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/472"
  },
  {
    "id": 4473,
    "messageId": 473,
    "title": "Eine Kleine Nachtmusik (Mozart)",
    "artist": "Yavuz Asöcal",
    "album": "Classicals With Oriental",
    "category": "classical",
    "categoryTitle": "Klasik & Doğu-Batı Sentezi",
    "duration": "03:09",
    "cover": "assets/classicals-with-oriental-beats-cover.jpg",
    "story": "Mozart'ın 'Küçük Bir Gece Müziği' serenade'ının Batı kemanı ve Doğu ritimlerinin dansıyla buluştuğu neşeli icra.",
    "aura1": "rgba(30, 58, 138, 0.35)",
    "aura2": "rgba(180, 83, 9, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/473"
  },
  {
    "id": 4474,
    "messageId": 474,
    "title": "Pre Concerto / Prelude (J.S. Bach)",
    "artist": "Yavuz Asöcal",
    "album": "Classicals With Oriental",
    "category": "classical",
    "categoryTitle": "Klasik & Doğu-Batı Sentezi",
    "duration": "03:48",
    "cover": "assets/classicals-with-oriental-beats-cover.jpg",
    "story": "J.S. Bach'ın polifonik barok derinliğinin mistik oryantal perküsyon katmanlarıyla zenginleşen meditatif yolculuğu.",
    "aura1": "rgba(30, 58, 138, 0.35)",
    "aura2": "rgba(180, 83, 9, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/474"
  },
  {
    "id": 4475,
    "messageId": 475,
    "title": "Vienna In C (Viyana Valsi & Sentez)",
    "artist": "Yavuz Asöcal",
    "album": "Classicals With Oriental",
    "category": "classical",
    "categoryTitle": "Klasik & Doğu-Batı Sentezi",
    "duration": "03:17",
    "cover": "assets/classicals-with-oriental-beats-cover.jpg",
    "story": "Viyana saray valsinin zarafetini Boğaziçi'nin sıcak ezgileriyle harmanlayan lirik bir Doğu-Batı köprüsü.",
    "aura1": "rgba(30, 58, 138, 0.35)",
    "aura2": "rgba(180, 83, 9, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/475"
  },
  {
    "id": 4476,
    "messageId": 476,
    "title": "Symphony No. 40 in G Minor (Mozart)",
    "artist": "Yavuz Asöcal",
    "album": "Classicals With Oriental",
    "category": "classical",
    "categoryTitle": "Klasik & Doğu-Batı Sentezi",
    "duration": "02:26",
    "cover": "assets/classicals-with-oriental-beats-cover.jpg",
    "story": "Mozart'ın en dramatik senfonisinin hüzünlü ana temasının oryantal yaylı süslemeleri ve vuruşlarla yorumu.",
    "aura1": "rgba(30, 58, 138, 0.35)",
    "aura2": "rgba(180, 83, 9, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/476"
  },
  {
    "id": 4477,
    "messageId": 477,
    "title": "Anniversary Waltz (Yıldönümü Valsi)",
    "artist": "Yavuz Asöcal",
    "album": "Classicals With Oriental",
    "category": "classical",
    "categoryTitle": "Klasik & Doğu-Batı Sentezi",
    "duration": "03:02",
    "cover": "assets/classicals-with-oriental-beats-cover.jpg",
    "story": "Klasik vals ritminin kanun ve keman nüanslarıyla Akdeniz sıcaklığında aktığı nostaljik bir dans teması.",
    "aura1": "rgba(30, 58, 138, 0.35)",
    "aura2": "rgba(180, 83, 9, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/477"
  },
  {
    "id": 4478,
    "messageId": 478,
    "title": "Ode To Joy / 9th Symphony (Beethoven)",
    "artist": "Yavuz Asöcal",
    "album": "Classicals With Oriental",
    "category": "classical",
    "categoryTitle": "Klasik & Doğu-Batı Sentezi",
    "duration": "03:38",
    "cover": "assets/classicals-with-oriental-beats-cover.jpg",
    "story": "Beethoven'ın insanlık kardeşliği marşının evrensel melodisini Doğu'nun kucaklayıcı ritimleriyle birleştiren güçlü icra.",
    "aura1": "rgba(30, 58, 138, 0.35)",
    "aura2": "rgba(180, 83, 9, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/478"
  },
  {
    "id": 4479,
    "messageId": 479,
    "title": "Für Elise (Beethoven)",
    "artist": "Yavuz Asöcal",
    "album": "Classicals With Oriental",
    "category": "classical",
    "categoryTitle": "Klasik & Doğu-Batı Sentezi",
    "duration": "02:18",
    "cover": "assets/classicals-with-oriental-beats-cover.jpg",
    "story": "Klasik piyano edebiyatının en bilinen motifi Für Elise'in keman ve oryantal ritimlerle dönüştürüldüğü zarif final.",
    "aura1": "rgba(30, 58, 138, 0.35)",
    "aura2": "rgba(180, 83, 9, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/479"
  },
  {
    "id": 5450,
    "messageId": 450,
    "title": "Vardar Ovası",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "03:00",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Atatürk'ün her dinlediğinde duygulandığı ve bizzat eşlik ettiği, Rumeli topraklarının vatan hasretini haykıran ölümsüz türkü.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/450"
  },
  {
    "id": 5451,
    "messageId": 451,
    "title": "Yanık Ömer",
    "artist": "Safiye Ayla",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "03:27",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Sadettin Kaynak bestesi; Kurtuluş Savaşı kahramanı Yanık Ömer'in destansı fedakârlığını Safiye Ayla'nın dramatik vokal zirvesiyle taçlandıran tarihi kayıt.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/451"
  },
  {
    "id": 5452,
    "messageId": 452,
    "title": "A Benim Mor Çiçeğim",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "02:18",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Ege ve Rumeli zarafetini Müzeyyen Senar'ın neşeli ve kıvrak taş plak yorumuyla buluşturan nostaljik bir halk ezgisi.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/452"
  },
  {
    "id": 5453,
    "messageId": 453,
    "title": "Akşam Oldu Yine Bastı Kareler",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "02:39",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Hüzzam makamının derin hüznüyle akşamın çöküşünü ve ayrılık acısını mısralara döken klasik Türk müziği başyapıtı.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/453"
  },
  {
    "id": 5454,
    "messageId": 454,
    "title": "Alişimin Kaşları Kara",
    "artist": "Safiye Ayla",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "04:03",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Tuna boylarının ve Rumeli türkülerinin en dokunaklısı; Atatürk'ün huzurunda Safiye Ayla'nın büyüleyici yorumuyla icra edilen taş plak klasiği.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/454"
  },
  {
    "id": 5455,
    "messageId": 455,
    "title": "Asker Yolu Beklerim",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "04:00",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Vatan müdafaasında cephedeki Mehmetçiğe duyulan hasret ve vefayı Müzeyyen Senar'ın buğulu sesiyle mühürleyen ağıt.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/455"
  },
  {
    "id": 5456,
    "messageId": 456,
    "title": "Cana Rakibi Handan Edersin",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "02:50",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Klasik Türk musikisinin ağırbaşlı makamlarından; Atatürk'ün derin musiki zevkini yansıtan zarif bir saray ve meclis bestesi.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/456"
  },
  {
    "id": 5457,
    "messageId": 457,
    "title": "Çile Bülbülüm Çile",
    "artist": "Safiye Ayla",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "02:49",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Sadettin Kaynak'ın Safiye Ayla için bestelediği, Çankaya Köşkü'nde Atatürk'ün defalarca 'tekrar oku' dediği 'Allah' feryatlı efsanevi eser.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/457"
  },
  {
    "id": 5458,
    "messageId": 458,
    "title": "Dayler Dayler",
    "artist": "Safiye Ayla",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "04:47",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Balkan dağlarının sisli vadilerinden esen bir hasret fırtınası; Safiye Ayla'nın hüzünlü ve tiz perdeden mükemmel yorumu.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/458"
  },
  {
    "id": 5459,
    "messageId": 459,
    "title": "Değirmene Un Yolladım",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "02:12",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Müzeyyen Senar'ın gençlik ve olgunluk enerjisini taşıyan, neşeli ritimleriyle dinleyeni saran otantik bir halk türküsü.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/459"
  },
  {
    "id": 5460,
    "messageId": 460,
    "title": "Fikrimin İnce Gülü",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "03:03",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Atatürk'ün en sevdiği şarkıların başında gelen, İsmail Hakkı Bey'in nihavend makamındaki zarif ve naif aşk başyapıtı.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/460"
  },
  {
    "id": 5461,
    "messageId": 461,
    "title": "Habugaha Girdim",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "02:35",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Taş plak döneminin otantik sazları ve Müzeyyen Senar'ın tavizsiz icrasıyla kaydedilmiş tarihi bir Türk musikisi eseri.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/461"
  },
  {
    "id": 5462,
    "messageId": 462,
    "title": "Havada Bulut Yok",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "02:33",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Yemen Türküsü olarak bilinen; vatan evlatlarının çöllerdeki fedakârlığına yakılan ve gözleri buğulandıran en derin ağıt.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/462"
  },
  {
    "id": 5463,
    "messageId": 463,
    "title": "İzmirin Kavakları",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "03:54",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Çakıcı Efe'nin ve Ege zeybeklerinin mertliğini Atatürk'ün hayran olduğu Müzeyyen Senar'ın vakur yorumuyla canlandıran destansı türkü.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/463"
  },
  {
    "id": 5464,
    "messageId": 464,
    "title": "Kimseye Etmem Şikayet",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "03:39",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Mennan Beyzade Mehmed Mazhar Bey'in sözleri ve Kemani Sarkis Efendi bestesi; Türk sanat müziğinin en asil ve hüzünlü sitem şarkısı.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/464"
  },
  {
    "id": 5465,
    "messageId": 465,
    "title": "Mani Oluyor",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "02:09",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Müzeyyen Senar'ın kıvrak üslubuyla hayat bulan, neşeli ve muzip klasik şarkı formunun en güzel örneklerinden biri.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/465"
  },
  {
    "id": 5466,
    "messageId": 466,
    "title": "Pencere Açıldı Bilal Oğlan",
    "artist": "Safiye Ayla",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "02:48",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Rumeli'nin sevdalı türkülerinden Bilal Oğlan'ın Safiye Ayla'nın tiz ve pürüzsüz vokal tınılarıyla tarihe geçen kaydı.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/466"
  },
  {
    "id": 5467,
    "messageId": 467,
    "title": "Sigaramın Dumanı",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "02:23",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Hafif dumanlı meyhane ve meclis akşamlarının vazgeçilmez nostaljisi; Müzeyyen Senar'ın dillerden düşmeyen yorumu.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/467"
  },
  {
    "id": 5468,
    "messageId": 468,
    "title": "Şahane Gözler",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "02:57",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Aşkın ve hayranlığın gözlerdeki ışıltısını coşkulu bir ritim ve melodik akışla kutlayan Senar klasiği.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/468"
  },
  {
    "id": 5469,
    "messageId": 469,
    "title": "Şu Dalmadan Geçtin Mi",
    "artist": "Müzeyyen Senar",
    "album": "Atatürk'ün Sevdiği Şarkılar",
    "category": "turkce",
    "categoryTitle": "Türk Sanat Müziği & Taş Plak",
    "duration": "02:39",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Kurtuluş Savaşı'nda Aydın ve Ege dağlarında destan yazan Yörük Ali Efe'nin yiğitliğini ölümsüzleştiren tarihi zeybek türküsü.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/469"
  },
  {
    "id": 5436,
    "messageId": 436,
    "title": "Altın Bişşik",
    "artist": "Emrah Fidan",
    "album": "Anadolu'dan Asya'ya Bir Nefes",
    "category": "turkce",
    "categoryTitle": "Enstrümantal & Etnik Avrasya",
    "duration": "03:10",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "Kazakistan ve Kırgız bozkırlarının efsanevi 'Altın Beşik' temasının kopuz ve kaval ile canlanan dingin ve kadim açılışı.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/436"
  },
  {
    "id": 5437,
    "messageId": 437,
    "title": "Kiye Henni",
    "artist": "Emrah Fidan",
    "album": "Anadolu'dan Asya'ya Bir Nefes",
    "category": "turkce",
    "categoryTitle": "Enstrümantal & Etnik Avrasya",
    "duration": "03:26",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "Orta Asya halk müziğinin otantik ritim ve melodilerini modern etnik aranjmanla buluşturan lirik bir Avrasya esintisi.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/437"
  },
  {
    "id": 5438,
    "messageId": 438,
    "title": "Minigitav",
    "artist": "Emrah Fidan",
    "album": "Anadolu'dan Asya'ya Bir Nefes",
    "category": "turkce",
    "categoryTitle": "Enstrümantal & Etnik Avrasya",
    "duration": "02:45",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "Bozkırın rüzgârını ve at sırtındaki göçebe ruhu yansıtan kıvrak yaylı ve üflemeli teması.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/438"
  },
  {
    "id": 5439,
    "messageId": 439,
    "title": "Ant Entkenmen",
    "artist": "Emrah Fidan",
    "album": "Anadolu'dan Asya'ya Bir Nefes",
    "category": "turkce",
    "categoryTitle": "Enstrümantal & Etnik Avrasya",
    "duration": "03:26",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "Kırım Tatar Milli Marşı olarak da bilinen Noman Çelebicihan'ın 'Ant Etkenmen' (Yemin Ettim) eserinin yüreğe işleyen enstrümantal yorumu.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/439"
  },
  {
    "id": 5440,
    "messageId": 440,
    "title": "Çal Kemençe",
    "artist": "Emrah Fidan",
    "album": "Anadolu'dan Asya'ya Bir Nefes",
    "category": "turkce",
    "categoryTitle": "Enstrümantal & Etnik Avrasya",
    "duration": "03:15",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "Karadeniz'in hırçın dalgalarını ve horon coşkusunu kemençenin kıvrak parmaklarıyla Doğu Asya tınılarıyla birleştiren virtüöz icra.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/440"
  },
  {
    "id": 5441,
    "messageId": 441,
    "title": "Jıldızım",
    "artist": "Emrah Fidan",
    "album": "Anadolu'dan Asya'ya Bir Nefes",
    "category": "turkce",
    "categoryTitle": "Enstrümantal & Etnik Avrasya",
    "duration": "03:32",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "Gece göğündeki kutup yıldızına yakılan Kırgız ezgisinin ney ve kopuzun buğulu tonlarıyla süzüldüğü meditatif kayıt.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/441"
  },
  {
    "id": 5442,
    "messageId": 442,
    "title": "Adige Vig",
    "artist": "Emrah Fidan",
    "album": "Anadolu'dan Asya'ya Bir Nefes",
    "category": "turkce",
    "categoryTitle": "Enstrümantal & Etnik Avrasya",
    "duration": "02:26",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "Kafkasya dağlarının asil Çerkes dansı Adige Vig'in dinamik perküsyonlar ve akordeon tınılarıyla yükselen ateşi.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/442"
  },
  {
    "id": 5443,
    "messageId": 443,
    "title": "Drama Köprüsü",
    "artist": "Emrah Fidan",
    "album": "Anadolu'dan Asya'ya Bir Nefes",
    "category": "turkce",
    "categoryTitle": "Enstrümantal & Etnik Avrasya",
    "duration": "04:01",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "Balkanlar'ın hüzünlü Debreli Hasan destanının; klarnet ve ney ile hüzünlü bir Doğu-Batı ağıtına dönüşen yorumu.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/443"
  },
  {
    "id": 5444,
    "messageId": 444,
    "title": "Bu Bahçe",
    "artist": "Emrah Fidan",
    "album": "Anadolu'dan Asya'ya Bir Nefes",
    "category": "turkce",
    "categoryTitle": "Enstrümantal & Etnik Avrasya",
    "duration": "03:07",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "Geleneksel Türk halk çalgılarının zengin polifonik armonisiyle yeşeren huzurlu bir bahçe tasviri.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/444"
  },
  {
    "id": 5445,
    "messageId": 445,
    "title": "Laçin",
    "artist": "Emrah Fidan",
    "album": "Anadolu'dan Asya'ya Bir Nefes",
    "category": "turkce",
    "categoryTitle": "Enstrümantal & Etnik Avrasya",
    "duration": "03:20",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "Karabağ ve Azerbaycan coğrafyasının zarafet simgesi Laçin türküsünün balaban ve tar esintileriyle bezeli duygusal yorumu.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/445"
  },
  {
    "id": 5446,
    "messageId": 446,
    "title": "Yörük Ali",
    "artist": "Emrah Fidan",
    "album": "Anadolu'dan Asya'ya Bir Nefes",
    "category": "turkce",
    "categoryTitle": "Enstrümantal & Etnik Avrasya",
    "duration": "02:31",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "Ege dağlarının yiğit efesi Yörük Ali'nin mertliğini bağlama ve zeybek ritimleriyle canlandıran otantik icra.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/446"
  },
  {
    "id": 5447,
    "messageId": 447,
    "title": "Suliko",
    "artist": "Emrah Fidan",
    "album": "Anadolu'dan Asya'ya Bir Nefes",
    "category": "turkce",
    "categoryTitle": "Enstrümantal & Etnik Avrasya",
    "duration": "03:31",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "Gürcü halk müziğinin en dokunaklı aşk ağıtı Suliko'nun Kafkas melodileriyle bütünleşen lirik enstrümantal icrası.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/447"
  },
  {
    "id": 5448,
    "messageId": 448,
    "title": "Eniyime",
    "artist": "Emrah Fidan",
    "album": "Anadolu'dan Asya'ya Bir Nefes",
    "category": "turkce",
    "categoryTitle": "Enstrümantal & Etnik Avrasya",
    "duration": "03:43",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "Avrasya steplerinin uçsuz bucaksız ufkuna açılan, kadim Türkistan nefeslerini taşıyan büyüleyici bir parça.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/448"
  },
  {
    "id": 5449,
    "messageId": 449,
    "title": "Entarisi Ala Benziyor",
    "artist": "Emrah Fidan",
    "album": "Anadolu'dan Asya'ya Bir Nefes",
    "category": "turkce",
    "categoryTitle": "Enstrümantal & Etnik Avrasya",
    "duration": "03:13",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "İstanbul ve Rumeli meclislerinin en sevilen klasik halk şarkısının neşeli ve kıvrak enstrümantal kapanış dansı.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/449"
  },
  {
    "id": 6500,
    "messageId": 500,
    "title": "Walk",
    "artist": "Ludovico Einaudi",
    "album": "In a Time Lapse",
    "category": "classical",
    "categoryTitle": "Neoklasik & Çağdaş Piyano",
    "duration": "03:27",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "Hafif adımlarla başlayan, piyano ve yaylıların uyumlu yürüyüşüyle zihni sakinleştiren zarif bir tema.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/500"
  },
  {
    "id": 6501,
    "messageId": 501,
    "title": "Discovery at Night",
    "artist": "Ludovico Einaudi",
    "album": "In a Time Lapse",
    "category": "classical",
    "categoryTitle": "Neoklasik & Çağdaş Piyano",
    "duration": "04:25",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "Gece vakti karanlığın içinde beliren sırları ve içsel keşifleri narin tuş dokunuşlarıyla anlatan meditatif parça.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/501"
  },
  {
    "id": 6502,
    "messageId": 502,
    "title": "Run",
    "artist": "Ludovico Einaudi",
    "album": "In a Time Lapse",
    "category": "classical",
    "categoryTitle": "Neoklasik & Çağdaş Piyano",
    "duration": "05:32",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "Zamanla yarışan bir ritim ve hızlanan piyano arpejleriyle kalp atışlarını andıran dinamik bir koşu.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/502"
  },
  {
    "id": 6503,
    "messageId": 503,
    "title": "Brothers",
    "artist": "Ludovico Einaudi",
    "album": "In a Time Lapse",
    "category": "classical",
    "categoryTitle": "Neoklasik & Çağdaş Piyano",
    "duration": "04:51",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "İki ruhun kardeşliğini ve birbirine bağlılığını dokunaklı çello ve piyano diyaloğuyla hissettiren beste.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/503"
  },
  {
    "id": 6504,
    "messageId": 504,
    "title": "Orbits",
    "artist": "Ludovico Einaudi",
    "album": "In a Time Lapse",
    "category": "classical",
    "categoryTitle": "Neoklasik & Çağdaş Piyano",
    "duration": "02:57",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "Gezegenlerin ve insan hayatlarının görünmez yörüngelerini tasvir eden döngüsel ve hipnotik minimalist motifler.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/504"
  },
  {
    "id": 6505,
    "messageId": 505,
    "title": "Two Trees",
    "artist": "Ludovico Einaudi",
    "album": "In a Time Lapse",
    "category": "classical",
    "categoryTitle": "Neoklasik & Çağdaş Piyano",
    "duration": "06:25",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "Aynı topraktan beslenen iki ağacın mevsimler boyu birbirine uzanan dallarını anlatan pastoral bir şiir.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/505"
  },
  {
    "id": 6506,
    "messageId": 506,
    "title": "Newton's Cradle",
    "artist": "Ludovico Einaudi",
    "album": "In a Time Lapse",
    "category": "classical",
    "categoryTitle": "Neoklasik & Çağdaş Piyano",
    "duration": "07:52",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "Fiziksel sarkaç hareketinden ilham alan; enerjinin aktarımını ve crescendo ile patlayan dramatik yaylıları içeren anıt eser.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/506"
  },
  {
    "id": 6507,
    "messageId": 507,
    "title": "Waterways",
    "artist": "Ludovico Einaudi",
    "album": "In a Time Lapse",
    "category": "classical",
    "categoryTitle": "Neoklasik & Çağdaş Piyano",
    "duration": "04:17",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "Suyun engelleri aşarak yolunu buluşunu piyanodan dökülen duru notalarla resmeden ferahlatıcı bir akış.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/507"
  },
  {
    "id": 6508,
    "messageId": 508,
    "title": "Experience",
    "artist": "Ludovico Einaudi",
    "album": "In a Time Lapse",
    "category": "classical",
    "categoryTitle": "Neoklasik & Çağdaş Piyano",
    "duration": "05:15",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "Einaudi'nin kariyer zirvesi; narin bir piyanodan fırtınalı bir orkestral doruk noktasına tırmanan ölümsüz modern klasik.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/508"
  },
  {
    "id": 6509,
    "messageId": 509,
    "title": "Underwood",
    "artist": "Ludovico Einaudi",
    "album": "In a Time Lapse",
    "category": "classical",
    "categoryTitle": "Neoklasik & Çağdaş Piyano",
    "duration": "04:13",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "Orman tabanındaki yosunların ve gölgelerin huzurunu fısıldayan dingin ve derinlikli bir piyano solosu.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/509"
  },
  {
    "id": 6510,
    "messageId": 510,
    "title": "Burning",
    "artist": "Ludovico Einaudi",
    "album": "In a Time Lapse",
    "category": "classical",
    "categoryTitle": "Neoklasik & Çağdaş Piyano",
    "duration": "05:08",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "Ateşin kıvılcımları gibi yükselen, tutkulu ve yakıcı yaylı pasajlarıyla albümün en yoğun dramatik anlarından biri.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/510"
  },
  {
    "id": 6511,
    "messageId": 511,
    "title": "Corale",
    "artist": "Ludovico Einaudi",
    "album": "In a Time Lapse",
    "category": "classical",
    "categoryTitle": "Neoklasik & Çağdaş Piyano",
    "duration": "02:05",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "Albümün kapısını aralayan, antik bir kilise korosunun saflığını yaylıların dingin nefesiyle sunan giriş.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/511"
  },
  {
    "id": 6512,
    "messageId": 512,
    "title": "Time Lapse",
    "artist": "Ludovico Einaudi",
    "album": "In a Time Lapse",
    "category": "classical",
    "categoryTitle": "Neoklasik & Çağdaş Piyano",
    "duration": "05:31",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "Albümün isim parçası; gün doğumundan gün batımına zamanın hızlandırılmış görsel akışını notalara döken başyapıt.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/512"
  },
  {
    "id": 6513,
    "messageId": 513,
    "title": "Life",
    "artist": "Ludovico Einaudi",
    "album": "In a Time Lapse",
    "category": "classical",
    "categoryTitle": "Neoklasik & Çağdaş Piyano",
    "duration": "04:22",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "Varoluşun ve canlılığın nabzını tutan, umut dolu bir aydınlanmayla dinleyeni kucaklayan lirik bir hayat kutlaması.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/513"
  },
  {
    "id": 6480,
    "messageId": 480,
    "title": "Bemirid (Rumi)",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "04:11",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Mevlânâ Celâleddîn-i Rûmî'nin 'Ölünüz ki dirilesiniz' felsefesini flamenko ve Doğu mistisizminin iç içe geçtiği tutkulu gitar perdeleriyle sunan açılış.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/480"
  },
  {
    "id": 6481,
    "messageId": 481,
    "title": "Dance of the Matador",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "05:13",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Endülüs arena ruhunu ve matadorun zarif adımlarını yüksek tempolu rasgueado vuruşlarıyla hissettiren coşkulu flamenko dansı.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/481"
  },
  {
    "id": 6482,
    "messageId": 482,
    "title": "El-Almo",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "04:26",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "İspanyol topraklarının sıcak esintisini narin arpejler ve kederli Akdeniz armonileriyle taşıyan lirik bir beste.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/482"
  },
  {
    "id": 6483,
    "messageId": 483,
    "title": "Flamenco Infusion",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "03:40",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Geleneksel flamenko kalıplarını modern füzyon ritimleriyle aşılayan, Behzad'ın virtüöz parmak cambazlığı.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/483"
  },
  {
    "id": 6484,
    "messageId": 484,
    "title": "Guitar Twilight",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "04:47",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Akdeniz'de gün batımının gökyüzünü kızıla boyadığı anlarda gitar tellerinden dökülen dingin ve romantik bir alacakaranlık melodisi.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/484"
  },
  {
    "id": 6485,
    "messageId": 485,
    "title": "Gypsy Renaissance",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "04:46",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Çingene ruhunun özgürlük, aşk ve isyan dolu ritmini yeniden doğuran, kıvrak ve ateşli gitar geçişleri.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/485"
  },
  {
    "id": 6486,
    "messageId": 486,
    "title": "Lost in Love",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "05:42",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Aşkın labirentlerinde kayboluşu ve derin melankoliyi hissettiren uzun soluklu, derin duygusal bir flamenko baladı.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/486"
  },
  {
    "id": 6487,
    "messageId": 487,
    "title": "Luna y Sol",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "04:07",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Ay ve güneşin gökyüzündeki sonsuz dansını; ışık ve gölgenin zıtlığını gitarın zengin dinamikleriyle anlatan şaheser.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/487"
  },
  {
    "id": 6488,
    "messageId": 488,
    "title": "Mystic Oasis",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "04:14",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Çölün ortasında saklı bir vaha gibi; Doğu makamlarının İspanyol gitar tınılarıyla serinlediği büyüleyici bir atmosfer.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/488"
  },
  {
    "id": 6489,
    "messageId": 489,
    "title": "Nocturnal Light",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "04:44",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Gecenin sessizliğinde parıldayan ay ışığının rehberliğinde çalınan, içe dönük ve narin bir gece bestesi.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/489"
  },
  {
    "id": 6490,
    "messageId": 490,
    "title": "Progression",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "04:25",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Akustik gitarın bas yürüyüşlerinden tiz perdelere doğru kademe kademe yükselen enerjik ve sürükleyici bir ilerleyiş.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/490"
  },
  {
    "id": 6491,
    "messageId": 491,
    "title": "Rapture of Massy",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "05:20",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Behzad'ın ruhani bir vecd haline ulaştığı, gitarın her telinde derin bir tutkunun yankılandığı etkileyici bir zirve noktası.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/491"
  },
  {
    "id": 6492,
    "messageId": 492,
    "title": "Roots",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "02:51",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Toprağın, köklerin ve kadim Akdeniz geleneklerinin saflığını yansıtan samimi ve köklü bir enstrümantal köprü.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/492"
  },
  {
    "id": 6493,
    "messageId": 493,
    "title": "Simmering Souls",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "06:03",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Közlerin altında yavaş yavaş yanan iki aşık ruhun hikâyesini sabırla işleyen, albümün en uzun ve dokunaklı eseri.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/493"
  },
  {
    "id": 6494,
    "messageId": 494,
    "title": "Solitude at Dawn",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "03:51",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Şafağın ilk ışıklarında dünyanın uyanışını tek bir gitarın yalnız ama huzurlu tınısıyla selamlayan narin bir parça.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/494"
  },
  {
    "id": 6495,
    "messageId": 495,
    "title": "Somewhere in Spain",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "03:14",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Endülüs'ün dar beyaz sokaklarında kaybolmuş hissi veren, tipik İspanyol neşesi ve hüznünü barındıran sıcak bir kartpostal.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/495"
  },
  {
    "id": 6496,
    "messageId": 496,
    "title": "Tears & Sensations",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "04:02",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Gözyaşları ve derin hislerin gitar tellerinde titreştiği; hüznü zarafete dönüştüren lirik bir anlatı.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/496"
  },
  {
    "id": 6497,
    "messageId": 497,
    "title": "The Essence of You",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "04:05",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Sevilen kişinin varlığını ve kokusunu her melodik temada arayan, naif ve samimi bir gitar serenadı.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/497"
  },
  {
    "id": 6498,
    "messageId": 498,
    "title": "Time Flies",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "04:41",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Zamanın akıp giden rüzgârını kıvrak parmak hareketleri ve neşeli arpejlerle kovalayan tempolu bir klasik.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/498"
  },
  {
    "id": 6499,
    "messageId": 499,
    "title": "Your Tranquillity Matilda",
    "artist": "Behzad",
    "album": "Strings of Desire",
    "category": "classical",
    "categoryTitle": "Flamenko & Akdeniz Gitarı",
    "duration": "04:53",
    "cover": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Matilda'nın sükunetine ve masumiyetine adanmış; albümün dinlendirici ve huzur verici kapanış eseri.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/499"
  },
  {
    "id": 7514,
    "messageId": 514,
    "title": "Akşam Şarkıları",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:50",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Günün yorgunluğu kentin üzerine inerken bir vapur güvertesinden İstanbul'a bakışın melankolik ve huzurlu akşam şarkısı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/514"
  },
  {
    "id": 7515,
    "messageId": 515,
    "title": "Alagözlü Yar",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:36",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Azerbaycan halk ezgilerinden esinlenen, sevgilinin ala gözlerine yakılmış sıcacık ve lirik bir Ezginin Günlüğü klasiği.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/515"
  },
  {
    "id": 7516,
    "messageId": 516,
    "title": "Aşk Bitti",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:42",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Bir ilişkinin son durağında kalan kırık dökük anıları ve sessiz kabullenişi dingin bir melodiyle özetleyen dokunaklı beste.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/516"
  },
  {
    "id": 7517,
    "messageId": 517,
    "title": "Aşk İki Kişiliktir",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:59",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Ataol Behramoğlu'nun 'Aşk iki kişiliktir' şiirinin dizesi dizesine müzikal bir manifestoya dönüştüğü unutulmaz eser.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/517"
  },
  {
    "id": 7518,
    "messageId": 518,
    "title": "Aşk Olsun",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:08",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Hayata, aşka ve zamana karşı zarif bir sitem ve tebessüm; grubun neşeli ve kıvrak ritimlerinin en tatlı örneklerinden.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/518"
  },
  {
    "id": 7519,
    "messageId": 519,
    "title": "Aşk Yüzünden",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:53",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Aşkın sebep olduğu tatlı kederi ve çıkmaz sokakları gitar ve nefeslilerin uyumuyla işleyen samimi bir kent anlatısı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/519"
  },
  {
    "id": 7520,
    "messageId": 520,
    "title": "Aşklar Eskir",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:11",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Zamanın acımasız akışında aşınan hisleri ve hatıraların soluşunu felsefi bir derinlikle mırıldanan nostaljik şarkı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/520"
  },
  {
    "id": 7521,
    "messageId": 521,
    "title": "Ayrılık Sarkısı",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:33",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Ayrılık anının donup kaldığı o soğuk dakikaları lirik gitar dokunuşlarıyla ısıtan naif bir ayrılık ezgisi.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/521"
  },
  {
    "id": 7522,
    "messageId": 522,
    "title": "Ayrılıkta Söylenmiş Bir Yaz Türküsü",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "02:59",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Güneşin kavurduğu bir yaz mevsiminde terkedilişin yalnızlığını Akdeniz tınılarıyla harmanlayan özgün bir yaz türküsü.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/522"
  },
  {
    "id": 7523,
    "messageId": 523,
    "title": "Ayşeye Şarkı",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:42",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Çocuksu bir masumiyeti ve Ayşe'ye duyulan şefkati pürüzsüz vokallerle mühürleyen sıcacık bir melodi.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/523"
  },
  {
    "id": 7524,
    "messageId": 524,
    "title": "Bana Kalsın",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:42",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Ayrılıktan geriye kalan acının ve hatıraların sadece bir tarafta saklanmasını dileyen fedakâr ve asil bir aşk şarkısı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/524"
  },
  {
    "id": 7525,
    "messageId": 525,
    "title": "Leyla",
    "artist": "Ezginin Günlüğü & Barış Akarsu",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:39",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Barış Akarsu'nun 'Çeyrek' albümündeki o meşhur, içten ve tutkulu rock vokaliyle yeniden canlanan efsanevi Leyla kaydı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/525"
  },
  {
    "id": 7526,
    "messageId": 526,
    "title": "Bilinmeyen Ülke",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:22",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Uzak diyarların, keşfedilmemiş kıyıların ve hayallerin peşine düşüren masalsı bir yolculuk şarkısı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/526"
  },
  {
    "id": 7527,
    "messageId": 527,
    "title": "Bir Eflatun Ölüm",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:02",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Behçet Aysan'ın derin dizeleri; mor menekşelerin ve eflatun bir hüznün notalara döküldüğü tarihi şiir-beste.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/527"
  },
  {
    "id": 7528,
    "messageId": 528,
    "title": "Delice Zeytin",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:19",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Ege zeytinliklerinin bereketini, rüzgârını ve delice büyüyen aşkını neşeli ritimlerle kutlayan yaşam dolu bir şarkı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/528"
  },
  {
    "id": 7529,
    "messageId": 529,
    "title": "Düşler Sokağı",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:38",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Türk müzik tarihinin en sevilen sokaklarından biri; hüznün ve hayallerin birbirine karıştığı ölümsüz 'Düşler Sokağı'.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/529"
  },
  {
    "id": 7530,
    "messageId": 530,
    "title": "Ebruli",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:27",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Baharı, umudu ve çok renkli duyguları 'Ebruli' bir kumaş gibi hayatımıza dokuyan neşeli bir başyapıt.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/530"
  },
  {
    "id": 7531,
    "messageId": 531,
    "title": "Eksik Bir Şey",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:09",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Gidenlerin ardından insanın göğsünde kalan o tanımsız boşluğu 'Eksik bir şey mi var?' sorusuyla çınlatan kült şarkı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/531"
  },
  {
    "id": 7532,
    "messageId": 532,
    "title": "Eski Arkadaş",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:28",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Yıllar sonra karşılaşılan eski bir dostun gözlerinde maziyi arayan içten ve dostane bir kucaklaşma.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/532"
  },
  {
    "id": 7533,
    "messageId": 533,
    "title": "Küçük Hanımın Şarkısı",
    "artist": "Ezginin Günlüğü & Feyza",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:49",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Feyza Erenmemiş'in berrak ve masalsı sesinden dökülen, kadın zarafetini ve hüznünü taşıyan özel Çeyrek kaydı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/533"
  },
  {
    "id": 7534,
    "messageId": 534,
    "title": "Hişt",
    "artist": "Ezginin Günlüğü & Fuat Saka",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:41",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Karadeniz'in usta sesi Fuat Saka'nın kendine has sıcaklığı ve yorumuyla hayat bulan 'Hişt' düzenlemesi.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/534"
  },
  {
    "id": 7535,
    "messageId": 535,
    "title": "Gemi",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:10",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Limanlardan kalkıp bilinmez ufuklara açılan tahta bir geminin ardında bıraktığı köpükleri anlatan deniz kokulu melodi.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/535"
  },
  {
    "id": 7536,
    "messageId": 536,
    "title": "Hişt",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:00",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Sait Faik'in hikâyelerinden fırlamış gibi; doğanın ve kuşların sesine kulak vermeye çağıran 'Hişt Hişt' şarkısı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/536"
  },
  {
    "id": 7537,
    "messageId": 537,
    "title": "Kadıköy",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:48",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Kadıköy sokaklarını, Moda sahilini ve vapur düdüklerini nostaljik bir aşkın arka planına yerleştiren İstanbul klasiği.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/537"
  },
  {
    "id": 7538,
    "messageId": 538,
    "title": "Kıyısız Deniz",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:30",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Sonsuzluğa uzanan engin suların ve sınırsız duyguların hüznünü dingin yaylılarla aktaran derinlikli bir beste.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/538"
  },
  {
    "id": 7539,
    "messageId": 539,
    "title": "Küçelere Su Serpmişem",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:18",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Gelen sevgilinin yollarına su serpilen kadim Kafkas ve Azerbaycan ezgisinin zengin polifonik kent yorumu.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/539"
  },
  {
    "id": 7540,
    "messageId": 540,
    "title": "Kül Vakti",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:45",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Akşamın küllerinden doğan yalnızlığı ve geceye teslim oluşu flüt ve gitarın hüznüyle mühürleyen bir gece bestesi.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/540"
  },
  {
    "id": 7541,
    "messageId": 541,
    "title": "Leyla",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:09",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Ezginin Günlüğü'nün 'Oyun' albümündeki orijinal, naif ve samimi Leyla kaydı; dillerden düşmeyen bir aşk masalı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/541"
  },
  {
    "id": 7542,
    "messageId": 542,
    "title": "Mutlu Olmak Varken",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "02:50",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Bunca keder ve telaşın içinde 'Mutlu olmak varken' neden acı çektiğimizi sorgulayan felsefi ve duru bir çağrı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/542"
  },
  {
    "id": 7543,
    "messageId": 543,
    "title": "Nazeleme",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:13",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Sevgiliye naz etmenin ve cilvenin en zarif, geleneksel Türk müziği makamlarıyla süslenmiş sevimli yorumu.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/543"
  },
  {
    "id": 7544,
    "messageId": 544,
    "title": "Nazende",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "02:59",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Azerbaycan aşk edebiyatının incisi Nazende Sevgilim'in Ezginin Günlüğü tınılarıyla yeniden hayat bulduğu şaheser.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/544"
  },
  {
    "id": 7545,
    "messageId": 545,
    "title": "Olur Biter",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "02:27",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Kısa ömürde her derdin bir gün gelip geçeceğini hatırlatan ferahlatıcı, neşeli ve felsefi bir nokta.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/545"
  },
  {
    "id": 7546,
    "messageId": 546,
    "title": "Papatya",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "01:11",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Kır papatyalarının narin beyazlığını ve masumiyetini çok kısa ama etkileyici bir gitar dokunuşuyla sunan minyatür parça.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/546"
  },
  {
    "id": 7547,
    "messageId": 547,
    "title": "Gemi",
    "artist": "Ezginin Günlüğü & Sabahat Akkiraz",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "02:54",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Usta halk müziği sanatçısı Sabahat Akkiraz'ın güçlü ve otantik gırtlağıyla 'Gemi' şarkısına kattığı devasa derinlik.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/547"
  },
  {
    "id": 7548,
    "messageId": 548,
    "title": "Sarhoş Balık ile Topal Martı",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "02:58",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Meyhane masasında kafa kafaya veren sarhoş bir balık ile topal bir martının sevimli ve felsefi sohbeti.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/548"
  },
  {
    "id": 7549,
    "messageId": 549,
    "title": "Sen Gidersen",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:12",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Sevgilinin gidişiyle kentin sokaklarının nasıl aniden ıssızlaştığını fısıldayan içe işleyen bir veda şarkısı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/549"
  },
  {
    "id": 7550,
    "messageId": 550,
    "title": "Seni Düşünmek Güzel Şey",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:28",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Nâzım Hikmet'in 'Seni düşünmek güzel şey, ümitli şey' dizelerinin Türk müziğindeki en asil ve duru bestesi.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/550"
  },
  {
    "id": 7551,
    "messageId": 551,
    "title": "Şehir",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:36",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Büyük kentin kalabalığı, betonları ve insan yalnızlığı üzerine yazılmış epik ve vurucu bir kent ağıtı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/551"
  },
  {
    "id": 7552,
    "messageId": 552,
    "title": "Teninle Konuşmak",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:09",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Tensel ve ruhsal yakınlığın kelimelere sığmayan fısıltısını narin gitar arpejleriyle hissettiren tutkulu bir melodi.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/552"
  },
  {
    "id": 7553,
    "messageId": 553,
    "title": "Kül Vakti",
    "artist": "Ezginin Günlüğü & Vasiliki",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "05:28",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Yunan sanatçı Vasiliki'nin buğulu Ege vokaliyle 'Kül Vakti' eserine kattığı sınırları aşan Akdeniz hüznü.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/553"
  },
  {
    "id": 7554,
    "messageId": 554,
    "title": "Ver Elini",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:30",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Dayanışmanın, dostluğun ve sevginin sıcak elini uzatan, umut aşılayan sıcacık bir ortak yürüyüş şarkısı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/554"
  },
  {
    "id": 7555,
    "messageId": 555,
    "title": "Yağma Yağmur",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:15",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Dışarıda yağan yağmura içerideki hüznü katmamayı öğütleyen, pencere kenarında dinlenecek bir sonbahar klasiği.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/555"
  },
  {
    "id": 7556,
    "messageId": 556,
    "title": "Yan Kalbim",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:01",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Aşk ateşinde kavrulan bir yüreğin kendi içine doğru kanayışını dramatik yaylılarla anlatan güçlü bir balad.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/556"
  },
  {
    "id": 7557,
    "messageId": 557,
    "title": "Yastıklı Şarkı",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:06",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Başını yastığa koyduğunda başlayan düşünceler ve uykusuz geceler için yazılmış ninnivari, tatlı bir melodi.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/557"
  },
  {
    "id": 7558,
    "messageId": 558,
    "title": "Ebruli",
    "artist": "Ezginin Günlüğü & Yaşar",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:22",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Popüler müziğin kadife sesi Yaşar'ın Çeyrek albümünde 'Ebruli'ye kattığı Akdenizli, romantik ve coşkulu yorum.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/558"
  },
  {
    "id": 7559,
    "messageId": 559,
    "title": "Zerdaliler",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:21",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Bahar dallarında açan zerdali çiçeklerinin tazeliğini ve çocukluk masumiyetini notalara döken nostaljik bir güzelleme.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/559"
  },
  {
    "id": 7560,
    "messageId": 560,
    "title": "1980",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "04:06",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "1980 askeri darbesinin gölgesinde yitip giden gençliğe ve umutlara adanmış tarihin tanığı vurucu bir Ezginin Günlüğü marşı.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/560"
  },
  {
    "id": 7561,
    "messageId": 561,
    "title": "Ağladığın Geceler",
    "artist": "Ezginin Günlüğü",
    "album": "Ezginin Günlüğü Koleksiyonu",
    "category": "turkce",
    "categoryTitle": "Özgün Müzik & Kent Ozanlığı",
    "duration": "03:48",
    "cover": "assets/ezginin-gunlugu-artist.webp",
    "story": "Karanlık gecelerde sessizce dökülen gözyaşlarını teselli eden, sabaha duyulan inancı fısıldayan umut dolu kapanış.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/561"
  },
  {
    "id": 8352,
    "messageId": 352,
    "title": "Seni Sordum Yıldızlara",
    "artist": "Zeki Müren",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "05:09",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Zeki Müren imzalı 'Seni Sordum Yıldızlara', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/352"
  },
  {
    "id": 8353,
    "messageId": 353,
    "title": "Seninle Bir Dakika",
    "artist": "Semiha Yankı",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:55",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Semiha Yankı imzalı 'Seninle Bir Dakika', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/353"
  },
  {
    "id": 8354,
    "messageId": 354,
    "title": "Sessiz Gemi",
    "artist": "Hümeyra",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:25",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Hümeyra imzalı 'Sessiz Gemi', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/354"
  },
  {
    "id": 8355,
    "messageId": 355,
    "title": "Sev Kardeşim",
    "artist": "Şenay",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:28",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Şenay imzalı 'Sev Kardeşim', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/355"
  },
  {
    "id": 8356,
    "messageId": 356,
    "title": "Sevdan Olmasa",
    "artist": "Erol Evgin",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "04:12",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Erol Evgin imzalı 'Sevdan Olmasa', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/356"
  },
  {
    "id": 8357,
    "messageId": 357,
    "title": "Sevdim Seni Bir Kere",
    "artist": "Hümeyra",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:29",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Hümeyra imzalı 'Sevdim Seni Bir Kere', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/357"
  },
  {
    "id": 8358,
    "messageId": 358,
    "title": "Sevince",
    "artist": "Erkin Koray",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "05:18",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Erkin Koray imzalı 'Sevince', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/358"
  },
  {
    "id": 8359,
    "messageId": 359,
    "title": "Son Verdim Kalbimin İşine",
    "artist": "Seyyal Taner",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:27",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Seyyal Taner imzalı 'Son Verdim Kalbimin İşine', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/359"
  },
  {
    "id": 8360,
    "messageId": 360,
    "title": "Söyle Canım",
    "artist": "Erol Evgin",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "04:04",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Erol Evgin imzalı 'Söyle Canım', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/360"
  },
  {
    "id": 8361,
    "messageId": 361,
    "title": "Sürünüyorum",
    "artist": "Gülden Karaböcek",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "04:02",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Gülden Karaböcek imzalı 'Sürünüyorum', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/361"
  },
  {
    "id": 8362,
    "messageId": 362,
    "title": "Tamirci Çırağı",
    "artist": "Cem Karaca",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "04:56",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Cem Karaca imzalı 'Tamirci Çırağı', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/362"
  },
  {
    "id": 8363,
    "messageId": 363,
    "title": "Tatlı Tatlı",
    "artist": "Nil Burak",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:24",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Nil Burak imzalı 'Tatlı Tatlı', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/363"
  },
  {
    "id": 8364,
    "messageId": 364,
    "title": "Unutama Beni",
    "artist": "Esmeray",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "04:07",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Esmeray imzalı 'Unutama Beni', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/364"
  },
  {
    "id": 8365,
    "messageId": 365,
    "title": "Üzüntüyü Bırak Yaşamaya Bak",
    "artist": "Gönül Turgut",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:23",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Gönül Turgut imzalı 'Üzüntüyü Bırak Yaşamaya Bak', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/365"
  },
  {
    "id": 8366,
    "messageId": 366,
    "title": "Ya Sonra",
    "artist": "Ajda Pekkan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "05:07",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Ajda Pekkan imzalı 'Ya Sonra', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/366"
  },
  {
    "id": 8367,
    "messageId": 367,
    "title": "Yalnızım Ben",
    "artist": "Nil Burak",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:50",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Nil Burak imzalı 'Yalnızım Ben', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/367"
  },
  {
    "id": 8368,
    "messageId": 368,
    "title": "Yıldızların Altında",
    "artist": "Zeki Müren",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:58",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Zeki Müren imzalı 'Yıldızların Altında', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/368"
  },
  {
    "id": 8369,
    "messageId": 369,
    "title": "Zaman Zaman",
    "artist": "Fikret Kızılok",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:42",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Fikret Kızılok imzalı 'Zaman Zaman', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/369"
  },
  {
    "id": 8370,
    "messageId": 370,
    "title": "Affetmem",
    "artist": "Funda",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:54",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Funda imzalı 'Affetmem', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/370"
  },
  {
    "id": 8371,
    "messageId": 371,
    "title": "Ah Nerede",
    "artist": "Füsun Önal",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:50",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Füsun Önal imzalı 'Ah Nerede', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/371"
  },
  {
    "id": 8372,
    "messageId": 372,
    "title": "Anlamazdın",
    "artist": "Ayla Dikmen",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:42",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Ayla Dikmen imzalı 'Anlamazdın', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/372"
  },
  {
    "id": 8373,
    "messageId": 373,
    "title": "Anlıyorsun Değil Mi",
    "artist": "Barış Manço",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:13",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Barış Manço imzalı 'Anlıyorsun Değil Mi', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/373"
  },
  {
    "id": 8374,
    "messageId": 374,
    "title": "Arkadaş",
    "artist": "Melike Demirağ",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:57",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Melike Demirağ imzalı 'Arkadaş', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/374"
  },
  {
    "id": 8375,
    "messageId": 375,
    "title": "Arkadaşımın Aşkısın",
    "artist": "Juanito",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:13",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Juanito imzalı 'Arkadaşımın Aşkısın', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/375"
  },
  {
    "id": 8376,
    "messageId": 376,
    "title": "Aşk Dediğin Laftır",
    "artist": "Gökben",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:16",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Gökben imzalı 'Aşk Dediğin Laftır', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/376"
  },
  {
    "id": 8377,
    "messageId": 377,
    "title": "Aşkın Gözü Kör Mü",
    "artist": "Rana Alagöz",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:31",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Rana Alagöz imzalı 'Aşkın Gözü Kör Mü', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/377"
  },
  {
    "id": 8378,
    "messageId": 378,
    "title": "Aynalı Kemer",
    "artist": "Barış Manço",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:03",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Barış Manço imzalı 'Aynalı Kemer', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/378"
  },
  {
    "id": 8379,
    "messageId": 379,
    "title": "Bak Şu Adama Aşık Oldu",
    "artist": "Ayla Algan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:14",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Ayla Algan imzalı 'Bak Şu Adama Aşık Oldu', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/379"
  },
  {
    "id": 8380,
    "messageId": 380,
    "title": "Bak Yeşil Yeşil",
    "artist": "Emel Sayın",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "04:10",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Emel Sayın imzalı 'Bak Yeşil Yeşil', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/380"
  },
  {
    "id": 8381,
    "messageId": 381,
    "title": "Baksana Talihe",
    "artist": "Ajda Pekkan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:59",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Ajda Pekkan imzalı 'Baksana Talihe', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/381"
  },
  {
    "id": 8382,
    "messageId": 382,
    "title": "Bana Yalan Söylediler",
    "artist": "Semiramis Pekkan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:58",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Semiramis Pekkan imzalı 'Bana Yalan Söylediler', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/382"
  },
  {
    "id": 8383,
    "messageId": 383,
    "title": "Bim Bam Bom",
    "artist": "Yasemin Kumral",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:05",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Yasemin Kumral imzalı 'Bim Bam Bom', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/383"
  },
  {
    "id": 8384,
    "messageId": 384,
    "title": "Bir de Bana Sor",
    "artist": "Erol Evgin",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:59",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Erol Evgin imzalı 'Bir de Bana Sor', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/384"
  },
  {
    "id": 8385,
    "messageId": 385,
    "title": "Birisine Birisine",
    "artist": "Nil Burak",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:25",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Nil Burak imzalı 'Birisine Birisine', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/385"
  },
  {
    "id": 8386,
    "messageId": 386,
    "title": "Boşvermişim Dünyaya",
    "artist": "Ajda Pekkan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:20",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Ajda Pekkan imzalı 'Boşvermişim Dünyaya', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/386"
  },
  {
    "id": 8387,
    "messageId": 387,
    "title": "Böyle Gelmiş Böyle Geçer",
    "artist": "Gönül Akkor",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:58",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Gönül Akkor imzalı 'Böyle Gelmiş Böyle Geçer', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/387"
  },
  {
    "id": 8388,
    "messageId": 388,
    "title": "Bu Ne Dünya",
    "artist": "Yeliz",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:55",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Yeliz imzalı 'Bu Ne Dünya', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/388"
  },
  {
    "id": 8389,
    "messageId": 389,
    "title": "Bu Son Olsun",
    "artist": "Cem Karaca",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:49",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Cem Karaca imzalı 'Bu Son Olsun', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/389"
  },
  {
    "id": 8390,
    "messageId": 390,
    "title": "Büklüm Büklüm",
    "artist": "Tülay Özer",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "05:18",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Tülay Özer imzalı 'Büklüm Büklüm', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/390"
  },
  {
    "id": 8391,
    "messageId": 391,
    "title": "Çalsam Bir Gün Kapını",
    "artist": "Turgay Merih",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "04:07",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Turgay Merih imzalı 'Çalsam Bir Gün Kapını', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/391"
  },
  {
    "id": 8392,
    "messageId": 392,
    "title": "Çapkın Kız",
    "artist": "Gönül Yazar",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:03",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Gönül Yazar imzalı 'Çapkın Kız', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/392"
  },
  {
    "id": 8393,
    "messageId": 393,
    "title": "Çok Yorgunum",
    "artist": "Cem Karaca",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:44",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Cem Karaca imzalı 'Çok Yorgunum', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/393"
  },
  {
    "id": 8394,
    "messageId": 394,
    "title": "Delisin",
    "artist": "Cici Kızlar",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:01",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Cici Kızlar imzalı 'Delisin', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/394"
  },
  {
    "id": 8395,
    "messageId": 395,
    "title": "Dert Ortağım",
    "artist": "Semiramis Pekkan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:39",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Semiramis Pekkan imzalı 'Dert Ortağım', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/395"
  },
  {
    "id": 8396,
    "messageId": 396,
    "title": "Dön Desem Döner Misin",
    "artist": "Barış Manço",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:00",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Barış Manço imzalı 'Dön Desem Döner Misin', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/396"
  },
  {
    "id": 8397,
    "messageId": 397,
    "title": "Duydum Ki Unutmuşsun",
    "artist": "Emel Sayın",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:41",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Emel Sayın imzalı 'Duydum Ki Unutmuşsun', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/397"
  },
  {
    "id": 8398,
    "messageId": 398,
    "title": "Dünya Dönüyor",
    "artist": "Nilüfer",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:38",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Nilüfer imzalı 'Dünya Dönüyor', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/398"
  },
  {
    "id": 8399,
    "messageId": 399,
    "title": "Fabrika Kızı",
    "artist": "Alpay",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:18",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Alpay imzalı 'Fabrika Kızı', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/399"
  },
  {
    "id": 8400,
    "messageId": 400,
    "title": "Fesuphanallah",
    "artist": "Erkin Koray",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:36",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Erkin Koray imzalı 'Fesuphanallah', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/400"
  },
  {
    "id": 8401,
    "messageId": 401,
    "title": "Gençlik Başımda Duman",
    "artist": "Güzin İle Baha",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:46",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Güzin İle Baha imzalı 'Gençlik Başımda Duman', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/401"
  },
  {
    "id": 8402,
    "messageId": 402,
    "title": "Gözleri Aşka Gülen",
    "artist": "Nesrin Sipahi",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:43",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Nesrin Sipahi imzalı 'Gözleri Aşka Gülen', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/402"
  },
  {
    "id": 8403,
    "messageId": 403,
    "title": "Gözüm Sende",
    "artist": "Belkıs Özener",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "01:50",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Belkıs Özener imzalı 'Gözüm Sende', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/403"
  },
  {
    "id": 8404,
    "messageId": 404,
    "title": "Hasretinle Yandı Gönlüm",
    "artist": "Seha Okuş",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:07",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Seha Okuş imzalı 'Hasretinle Yandı Gönlüm', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/404"
  },
  {
    "id": 8405,
    "messageId": 405,
    "title": "Hayat Sevince Güzel",
    "artist": "Belkıs Özener",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:29",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Belkıs Özener imzalı 'Hayat Sevince Güzel', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/405"
  },
  {
    "id": 8406,
    "messageId": 406,
    "title": "Hayırdır İnşallah",
    "artist": "Uğur Akdora",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:31",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Uğur Akdora imzalı 'Hayırdır İnşallah', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/406"
  },
  {
    "id": 8407,
    "messageId": 407,
    "title": "Haykıracak Nefesim Kalmasa Bile",
    "artist": "Ajda Pekkan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:32",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Ajda Pekkan imzalı 'Haykıracak Nefesim Kalmasa Bile', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/407"
  },
  {
    "id": 8408,
    "messageId": 408,
    "title": "Her Akşam \"Sarhoş\"",
    "artist": "Dario Moreno",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:06",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Dario Moreno imzalı 'Her Akşam \"Sarhoş\"', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/408"
  },
  {
    "id": 8409,
    "messageId": 409,
    "title": "Her Şey Seninle Güzel",
    "artist": "Zerrin Özer",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:32",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Zerrin Özer imzalı 'Her Şey Seninle Güzel', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/409"
  },
  {
    "id": 8410,
    "messageId": 410,
    "title": "Hoşgör Sen",
    "artist": "Ajda Pekkan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:24",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Ajda Pekkan imzalı 'Hoşgör Sen', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/410"
  },
  {
    "id": 8411,
    "messageId": 411,
    "title": "İşte Geldik Gidiyoruz",
    "artist": "Cem Karaca",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "06:05",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Cem Karaca imzalı 'İşte Geldik Gidiyoruz', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/411"
  },
  {
    "id": 8412,
    "messageId": 412,
    "title": "İşte Öyle Bir Şey",
    "artist": "Erol Evgin",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "06:10",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Erol Evgin imzalı 'İşte Öyle Bir Şey', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/412"
  },
  {
    "id": 8413,
    "messageId": 413,
    "title": "Kabahat Seni Sevende",
    "artist": "Kamuran Akkor",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "04:23",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Kamuran Akkor imzalı 'Kabahat Seni Sevende', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/413"
  },
  {
    "id": 8414,
    "messageId": 414,
    "title": "Kaç Yıl Geçti Aradan",
    "artist": "Sezen Aksu",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:30",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Sezen Aksu imzalı 'Kaç Yıl Geçti Aradan', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/414"
  },
  {
    "id": 8415,
    "messageId": 415,
    "title": "Kim Ne Derse Desin",
    "artist": "Ajda Pekkan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:42",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Ajda Pekkan imzalı 'Kim Ne Derse Desin', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/415"
  },
  {
    "id": 8416,
    "messageId": 416,
    "title": "Kimler Geldi Kimler Geçti",
    "artist": "Ajda Pekkan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:26",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Ajda Pekkan imzalı 'Kimler Geldi Kimler Geçti', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/416"
  },
  {
    "id": 8417,
    "messageId": 417,
    "title": "Kusura Bakma",
    "artist": "Sezen Aksu",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:43",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Sezen Aksu imzalı 'Kusura Bakma', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/417"
  },
  {
    "id": 8418,
    "messageId": 418,
    "title": "Minik Serçe",
    "artist": "Sezen Aksu",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:16",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Sezen Aksu imzalı 'Minik Serçe', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/418"
  },
  {
    "id": 8419,
    "messageId": 419,
    "title": "Oh Olsun",
    "artist": "Füsun Önal",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:25",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Füsun Önal imzalı 'Oh Olsun', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/419"
  },
  {
    "id": 8420,
    "messageId": 420,
    "title": "Olmaz Böyle Şey",
    "artist": "Yesim",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "04:03",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Yesim imzalı 'Olmaz Böyle Şey', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/420"
  },
  {
    "id": 8421,
    "messageId": 421,
    "title": "Olmaz Bu İş Olamaz",
    "artist": "Semiramis Pekkan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:05",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Semiramis Pekkan imzalı 'Olmaz Bu İş Olamaz', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/421"
  },
  {
    "id": 8422,
    "messageId": 422,
    "title": "Olmaz Olmaz Bu İş Olamaz",
    "artist": "Nermin Candan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:15",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Nermin Candan imzalı 'Olmaz Olmaz Bu İş Olamaz', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/422"
  },
  {
    "id": 8423,
    "messageId": 423,
    "title": "Olmaz Olmaz Deme",
    "artist": "Nil Burak",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:37",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Nil Burak imzalı 'Olmaz Olmaz Deme', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/423"
  },
  {
    "id": 8424,
    "messageId": 424,
    "title": "Ölsem De Kalsam Da Bir",
    "artist": "Banu Kırbağ",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "04:25",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Banu Kırbağ imzalı 'Ölsem De Kalsam Da Bir', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/424"
  },
  {
    "id": 8425,
    "messageId": 425,
    "title": "Öyle Sarhoş Olsam ki",
    "artist": "Tanju Okan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:44",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Tanju Okan imzalı 'Öyle Sarhoş Olsam ki', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/425"
  },
  {
    "id": 8426,
    "messageId": 426,
    "title": "Para Parra Parrra",
    "artist": "Rüçhan Çamay",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:24",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Rüçhan Çamay imzalı 'Para Parra Parrra', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/426"
  },
  {
    "id": 8427,
    "messageId": 427,
    "title": "Param Yok Pulum Yok",
    "artist": "Meral Zuhal",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:40",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Meral Zuhal imzalı 'Param Yok Pulum Yok', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/427"
  },
  {
    "id": 8428,
    "messageId": 428,
    "title": "Rüyalar Gerçek Olsa",
    "artist": "Emel Sayın",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:47",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Emel Sayın imzalı 'Rüyalar Gerçek Olsa', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/428"
  },
  {
    "id": 8429,
    "messageId": 429,
    "title": "Samanyolu",
    "artist": "Berkant",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:59",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Berkant imzalı 'Samanyolu', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/429"
  },
  {
    "id": 8430,
    "messageId": 430,
    "title": "Sana Ne Kime Ne",
    "artist": "Ajda Pekkan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:57",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Ajda Pekkan imzalı 'Sana Ne Kime Ne', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/430"
  },
  {
    "id": 8431,
    "messageId": 431,
    "title": "Sana Neler Edeceğim",
    "artist": "Ajda Pekkan",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "03:05",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Ajda Pekkan imzalı 'Sana Neler Edeceğim', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/431"
  },
  {
    "id": 8432,
    "messageId": 432,
    "title": "Sen Gidince",
    "artist": "White Butterflies/Beyaz Kelebekler/Peter Tetteroo",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:41",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "White Butterflies/Beyaz Kelebekler/Peter Tetteroo imzalı 'Sen Gidince', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/432"
  },
  {
    "id": 8433,
    "messageId": 433,
    "title": "Senden Başka",
    "artist": "Füsun Önal",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:43",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Füsun Önal imzalı 'Senden Başka', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/433"
  },
  {
    "id": 8434,
    "messageId": 434,
    "title": "Seni Gidi Vurdum Duymaz",
    "artist": "Sezen Aksu",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:35",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Sezen Aksu imzalı 'Seni Gidi Vurdum Duymaz', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/434"
  },
  {
    "id": 8435,
    "messageId": 435,
    "title": "Seni Gidi Vurdumduymaz",
    "artist": "Sezen Aksu",
    "album": "Türkçe Klasikler",
    "category": "turkce",
    "categoryTitle": "Türkçe Pop & 45'likler",
    "duration": "02:35",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Sezen Aksu imzalı 'Seni Gidi Vurdumduymaz', Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vurmuş unutulmaz bir 45'lik plağıdır.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/435"
  },
  {
    "id": 9562,
    "messageId": 562,
    "title": "I Know You By Heart",
    "artist": "Eva Cassidy",
    "album": "Songbird",
    "category": "classical",
    "categoryTitle": "Akustik Caz & Vokal",
    "duration": "04:02",
    "cover": "assets/eva-cassidy-songbird-cover.jpg",
    "story": "Ayrılığın ardından kalan sevginin sonsuzluğunu fısıldayan, Eva'nın narin ve berrak vokalinin içe işlediği hüzünlü balad.",
    "aura1": "rgba(245, 158, 11, 0.3)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/562"
  },
  {
    "id": 9563,
    "messageId": 563,
    "title": "Oh, Had I A Golden Thread",
    "artist": "Eva Cassidy",
    "album": "Songbird",
    "category": "classical",
    "categoryTitle": "Akustik Caz & Vokal",
    "duration": "04:52",
    "cover": "assets/eva-cassidy-songbird-cover.jpg",
    "story": "Pete Seeger bestesi; insanları birbirine sevgiyle bağlayan altın bir iplik arzusunu gospel saflığıyla göğe yükselten bir dua.",
    "aura1": "rgba(245, 158, 11, 0.3)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/563"
  },
  {
    "id": 9564,
    "messageId": 564,
    "title": "Over The Rainbow",
    "artist": "Eva Cassidy",
    "album": "Songbird",
    "category": "classical",
    "categoryTitle": "Akustik Caz & Vokal",
    "duration": "04:59",
    "cover": "assets/eva-cassidy-songbird-cover.jpg",
    "story": "Judy Garland klasiğinin sadece bir gitar ve Eva Cassidy'nin meleksi sesiyle tarihin en dokunaklı yorumuna dönüştüğü anıt icra.",
    "aura1": "rgba(245, 158, 11, 0.3)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/564"
  },
  {
    "id": 9565,
    "messageId": 565,
    "title": "People Get Ready",
    "artist": "Eva Cassidy",
    "album": "Songbird",
    "category": "classical",
    "categoryTitle": "Akustik Caz & Vokal",
    "duration": "03:24",
    "cover": "assets/eva-cassidy-songbird-cover.jpg",
    "story": "Curtis Mayfield'ın soul ve sivil haklar marşını akustik blues ve caz ritimleriyle kanatlandıran dinamik ve umut dolu kayıt.",
    "aura1": "rgba(245, 158, 11, 0.3)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/565"
  },
  {
    "id": 9566,
    "messageId": 566,
    "title": "Songbird",
    "artist": "Eva Cassidy",
    "album": "Songbird",
    "category": "classical",
    "categoryTitle": "Akustik Caz & Vokal",
    "duration": "03:45",
    "cover": "assets/eva-cassidy-songbird-cover.jpg",
    "story": "Christine McVie (Fleetwood Mac) bestesi; albüme adını veren, aşkın koruyucu ve iyileştirici kanatlarını açan başyapıt.",
    "aura1": "rgba(245, 158, 11, 0.3)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/566"
  },
  {
    "id": 9567,
    "messageId": 567,
    "title": "Time Is A Healer",
    "artist": "Eva Cassidy",
    "album": "Songbird",
    "category": "classical",
    "categoryTitle": "Akustik Caz & Vokal",
    "duration": "04:17",
    "cover": "assets/eva-cassidy-songbird-cover.jpg",
    "story": "Zamanın tüm yaraları saracağına dair derin bir inanç ve huzur aşılayan, piyano ve vokal birlikteliği.",
    "aura1": "rgba(245, 158, 11, 0.3)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/567"
  },
  {
    "id": 9568,
    "messageId": 568,
    "title": "Wade In The Water",
    "artist": "Eva Cassidy",
    "album": "Songbird",
    "category": "classical",
    "categoryTitle": "Akustik Caz & Vokal",
    "duration": "04:04",
    "cover": "assets/eva-cassidy-songbird-cover.jpg",
    "story": "Geleneksel Afro-Amerikan spiritüelinin caz tınıları ve Eva Cassidy'nin güçlü blues yorumuyla hayat bulduğu etkileyici icra.",
    "aura1": "rgba(245, 158, 11, 0.3)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/568"
  },
  {
    "id": 9569,
    "messageId": 569,
    "title": "Wayfaring Stranger",
    "artist": "Eva Cassidy",
    "album": "Songbird",
    "category": "classical",
    "categoryTitle": "Akustik Caz & Vokal",
    "duration": "04:28",
    "cover": "assets/eva-cassidy-songbird-cover.jpg",
    "story": "Bu fani dünyada bir garip yolcu oluşun hüznünü ve öte dünyaya duyulan özlemi anlatan kadim bir folk ağıtı.",
    "aura1": "rgba(245, 158, 11, 0.3)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/569"
  },
  {
    "id": 9570,
    "messageId": 570,
    "title": "Aline",
    "artist": "Christophe",
    "album": "Aline (Single)",
    "category": "yabanci",
    "categoryTitle": "Fransız Pop & Chanson",
    "duration": "02:49",
    "cover": "assets/eva-cassidy-songbird-cover.jpg",
    "story": "Fransız pop ikonu Christophe'un 1965 tarihli efsanevi chanson klasiği; kumsalda çizilen bir resim ve aşkın feryadı.",
    "aura1": "rgba(59, 130, 246, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/570"
  },
  {
    "id": 9571,
    "messageId": 571,
    "title": "Autumn Leaves",
    "artist": "Eva Cassidy",
    "album": "Songbird",
    "category": "classical",
    "categoryTitle": "Akustik Caz & Vokal",
    "duration": "04:44",
    "cover": "assets/eva-cassidy-songbird-cover.jpg",
    "story": "Joseph Kosma ve Jacques Prévert klasiği 'Les Feuilles Mortes'; dökülen sonbahar yapraklarını gitar telleriyle resmeden eşsiz bir caz standardı.",
    "aura1": "rgba(245, 158, 11, 0.3)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/571"
  },
  {
    "id": 9572,
    "messageId": 572,
    "title": "Fields Of Gold",
    "artist": "Eva Cassidy",
    "album": "Songbird",
    "category": "classical",
    "categoryTitle": "Akustik Caz & Vokal",
    "duration": "04:43",
    "cover": "assets/eva-cassidy-songbird-cover.jpg",
    "story": "Sting'in dahi 'benim bestelediğimden çok daha güzel söyledi' dediği, rüzgârda dalgalanan altın arpa tarlalarının ölümsüz serenadı.",
    "aura1": "rgba(245, 158, 11, 0.3)",
    "aura2": "rgba(180, 83, 9, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/572"
  },
  {
    "id": 9573,
    "messageId": 573,
    "title": "La Vie En Rose",
    "artist": "Madeleine Peyroux",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:21",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Édith Piaf'ın efsanevi başyapıtı La Vie En Rose'un Madeleine Peyroux'nun buğulu, caz dokunuşlu ve melankolik sesiyle hayat bulan büyülü yorumu.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/573"
  },
  {
    "id": 9574,
    "messageId": 574,
    "title": "La vieille",
    "artist": "Michel Sardou",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:21",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Michel Sardou'nun Fransız toplumunun hafızasını ve zamanın acımasız akışını dramatik ve teatral bir lirizmle resmettiği dokunaklı şarkısı.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/574"
  },
  {
    "id": 9575,
    "messageId": 575,
    "title": "L'amitié",
    "artist": "Françoise Hardy",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "02:23",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Françoise Hardy'nin dostluğun aşktan da derin ve kalıcı bağını dingin ve masum bir zarafetle dile getirdiği 60'lar klasiği.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/575"
  },
  {
    "id": 9576,
    "messageId": 576,
    "title": "L'amour c'est comme un jour",
    "artist": "Charles Aznavour",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:43",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Charles Aznavour'un bir günün akışı gibi birdenbire tükenen sevdalara yaktığı, hüznün ve kabullenişin şaheseri.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/576"
  },
  {
    "id": 9577,
    "messageId": 577,
    "title": "L'amour l'amour l'amour",
    "artist": "Mouloudji",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:01",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Mouloudji'nin hayatı ve varoluşu sevginin sonsuz ritminde kutsayan neşeli ve şiirsel bohem valsi.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/577"
  },
  {
    "id": 9578,
    "messageId": 578,
    "title": "Le premier bonheur du jour",
    "artist": "Françoise Hardy",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "01:50",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Françoise Hardy'nin sabahın ilk ışıklarında uyanan aşkın ve taze umutların naif melodisini fısıldadığı nostaljik parçası.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/578"
  },
  {
    "id": 9579,
    "messageId": 579,
    "title": "Le temps des fleurs",
    "artist": "Dalida",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:59",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Dalida'nın Mary Hopkin'in 'Those Were the Days' melodisine Paris'in romantik melankolisini ve gençlik anılarını nakşettiği ölümsüz şanson.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/579"
  },
  {
    "id": 9580,
    "messageId": 580,
    "title": "Le temps est bon",
    "artist": "Isabelle Pierre",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:29",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "İsabelle Pierre'in güneşli bir yaz gününün huzurunu ve aşkın tatlı hafifliğini sinematik yaylılarla buluşturan ikonik eseri.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/580"
  },
  {
    "id": 9581,
    "messageId": 581,
    "title": "Les Champs-Elysées",
    "artist": "Joe Dassin",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "02:37",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Joe Dassin'in Paris'in en ünlü caddesinde rastlantısal bir aşkı ve neşeli kalabalıkları adımlayan, dünyaca ünlü unutulmaz marşı.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/581"
  },
  {
    "id": 9582,
    "messageId": 582,
    "title": "Les moulins de mon coeur",
    "artist": "Michel Legrand",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:28",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Michel Legrand'ın Thomas Crown Affair filmi için bestelediği Oscar ödüllü 'The Windmills of Your Mind' melodisinin Fransızca orijinal şiiri.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/582"
  },
  {
    "id": 9583,
    "messageId": 583,
    "title": "Message personnel",
    "artist": "Françoise Hardy",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "04:16",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Françoise Hardy'nin Serge Gainsbourg bestesiyle birleştiği, kırık bir kalbin en samimi ve fısıltılı vedası niteliğindeki kült eser.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/583"
  },
  {
    "id": 9584,
    "messageId": 584,
    "title": "Mon amie la rose",
    "artist": "Françoise Hardy",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "02:17",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Françoise Hardy'nin bir gülün ömrü üzerinden gençliğin ve güzelliğin geçiciliğini felsefi bir zarafetle anlattığı şiirsel şaheser.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/584"
  },
  {
    "id": 9585,
    "messageId": 585,
    "title": "Moon River",
    "artist": "Henry Mancini & His Orchestra",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "02:41",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Henry Mancini ve Orkestrası'nın 'Breakfast at Tiffany's' filminin rüya gibi melodisi Moon River'a getirdiği Paris gecesi zarafetindeki yorum.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/585"
  },
  {
    "id": 9586,
    "messageId": 586,
    "title": "Mourir d'aimer",
    "artist": "Charles Aznavour",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:57",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Charles Aznavour'un André Cayatte filmine de adını veren, aşk uğruna ölümü göze alan tutkunun doruk noktasındaki aryası.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/586"
  },
  {
    "id": 9587,
    "messageId": 587,
    "title": "Ne me quitte pas",
    "artist": "Jacques Brel",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:49",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Jacques Brel'in giden sevgilinin ayaklarına kapanırcasına bestelediği, müzik tarihinin en tutkulu ve yakıcı ayrılık manifestosu.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/587"
  },
  {
    "id": 9588,
    "messageId": 588,
    "title": "Paris",
    "artist": "Edith Piaf",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "02:42",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Édith Piaf'ın Seine nehri kıyısındaki aşıkları ve sokak lambalarını yüreğinin tüm ateşiyle selamladığı Paris kasidesi.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/588"
  },
  {
    "id": 9589,
    "messageId": 589,
    "title": "Quelqu'un m'a dit",
    "artist": "Carla Bruni",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "02:46",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Carla Bruni'nin fısıltılı vokali ve yalın akustik gitarıyla zamanın ve umulmadık aşkların gelişini anlattığı modern şanson klasiği.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/589"
  },
  {
    "id": 9590,
    "messageId": 590,
    "title": "Sous le ciel de Paris",
    "artist": "Yves Montand",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "02:54",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Yves Montand'ın Paris gökleri altındaki sevdalıları, akordeon seslerini ve köprüleri ölümsüzleştirdiği efsanevi Paris serenadı.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/590"
  },
  {
    "id": 9591,
    "messageId": 591,
    "title": "Tous les garçons et les filles",
    "artist": "Françoise Hardy",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:07",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Françoise Hardy'nin 60'lar gençliğinin sokaklarda el ele yürüyen aşıklara duyduğu yalnızlık ve özlemi anlatan ilk büyük çıkış şarkısı.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/591"
  },
  {
    "id": 9592,
    "messageId": 592,
    "title": "À toi",
    "artist": "Joe Dassin",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "02:50",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Joe Dassin'in hayatın tüm güzelliklerini, kahkahalarını ve gözyaşlarını adadığı sevgiliye sunduğu derin ve samimi bir kadeh kaldırış.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/592"
  },
  {
    "id": 9593,
    "messageId": 593,
    "title": "Coucher de soleil",
    "artist": "Yves Duteil",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "01:17",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Yves Duteil'in gün batımının kızıla boyadığı ufukta kaybolan huzurlu anları akustik gitarın telleriyle resmettiği zarif minyatür.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/593"
  },
  {
    "id": 9594,
    "messageId": 594,
    "title": "Dis, quand reviendras-tu ?",
    "artist": "Barbara",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "02:54",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Barbara'nın tren garlarında beklenen sevgiliye yazdığı, piyanonun hüzünlü akorlarıyla yürek burkan unutulmaz bekleme ağıtı.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/594"
  },
  {
    "id": 9595,
    "messageId": 595,
    "title": "Douce France",
    "artist": "Charles Trenet",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:12",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Charles Trenet'nin İkinci Dünya Savaşı yıllarında Fransız halkına umut ve nostalji aşılayan, çocukluk köylerinin sıcaklığını anlatan milli marş niteliğindeki başyapıtı.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/595"
  },
  {
    "id": 9596,
    "messageId": 596,
    "title": "Elle était si jolie (Kısa Versiyon)",
    "artist": "Alain Barrière",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "01:26",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Alain Barrière'in Eurovision 1963'e damga vuran, giden güzelliğin ardından duyulan pişmanlığı haykıran efsanevi şarkısının kısa versiyonu.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/596"
  },
  {
    "id": 9597,
    "messageId": 597,
    "title": "Elle était si jolie",
    "artist": "Alain Barrière",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "02:55",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Alain Barrière'in unutulmaz sesi ve görkemli orkestrasyonuyla tüm zamanların en sevilen Fransız melodilerinden biri haline gelen tam versiyonu.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/597"
  },
  {
    "id": 9598,
    "messageId": 598,
    "title": "Et si tu n'existais pas",
    "artist": "Joe Dassin",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:26",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Joe Dassin'in 'Sen olmasaydın ben kim olurdum?' sorusuna yanıt arayan, Toto Cutugno bestesiyle taçlanmış ölümsüz aşk yemini.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/598"
  },
  {
    "id": 9599,
    "messageId": 599,
    "title": "Foule sentimentale",
    "artist": "Alain Souchon",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "05:24",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Alain Souchon'un tüketim toplumunun sahte parıltılarına inat insan ruhunun duyguya, aşka ve maneviyata olan ebedi açlığını sorguladığı başyapıt.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/599"
  },
  {
    "id": 9600,
    "messageId": 600,
    "title": "Il faut savoir",
    "artist": "Charles Aznavour",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:08",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Charles Aznavour'un gururla biten bir aşkın ardından başı dik kalabilmeyi ve gözyaşlarını saklamayı öğütleyen sarsıcı klasiği.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/600"
  },
  {
    "id": 9601,
    "messageId": 601,
    "title": "Il jouait du piano debout",
    "artist": "France Gall",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "04:33",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "France Gall'ın Michel Berger bestesiyle, topluma ve önyargılara aldırmadan piyanosunu ayakta çalan Elton John ve Jerry Lee Lewis ruhunu selamladığı enerjik parça.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/601"
  },
  {
    "id": 9602,
    "messageId": 602,
    "title": "Il y a",
    "artist": "Vanessa Paradis",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "02:38",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Vanessa Paradis'nin duru sesiyle hayatın küçük mucizelerini, umudu ve varoluşun gizli güzelliklerini kutladığı melodik şarkı.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/602"
  },
  {
    "id": 9603,
    "messageId": 603,
    "title": "J'ai eu tort",
    "artist": "Christophe",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "01:45",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Christophe'un Aline ve Les Mots Bleus ile tanıdığımız karakteristik ve duygu dolu vokaliyle bir hatayı itiraf ettiği samimi akustik baladı.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/603"
  },
  {
    "id": 9604,
    "messageId": 604,
    "title": "La bohème",
    "artist": "Charles Aznavour",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "04:05",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Charles Aznavour'un Montmartre tepelerindeki bohem gençlik yıllarına, açlığa ve feda edilen resimlere yaktığı müzik tarihinin en büyük şansonu.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/604"
  },
  {
    "id": 9605,
    "messageId": 605,
    "title": "La maladie d'amour",
    "artist": "Michel Sardou",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:30",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Michel Sardou'nun yediden yetmişe herkesi pençesine alan ve çaresi olmayan tek hastalık olan aşkı kutladığı coşkulu ve epik marşı.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/605"
  },
  {
    "id": 9606,
    "messageId": 606,
    "title": "La tendresse",
    "artist": "André Bourvil",
    "album": "Eski Hoş Fransızca Şarkılar",
    "category": "yabanci",
    "categoryTitle": "Fransız Şansonları & Klasikler",
    "duration": "03:09",
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "André Bourvil'in insanlığın en saf ihtiyacı olan şefkati, sevgiyi ve bir sıcak bakışı en içten ve dokunaklı tonda yücelttiği ölümsüz kapanış eseri.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/606"
  },
  {
    "id": 9653,
    "messageId": 653,
    "title": "Kevokê",
    "artist": "Dilşad",
    "album": "Awazê Kurdî",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Keman",
    "duration": "05:56",
    "cover": "assets/dilsad-awaze-kurdi-cover.jpg",
    "story": "Dilşad'ın kemanının hüzünlü ve duru tınılarıyla Mezopotamya göklerine süzülen bir beyaz güvercin gibi yükselen, geleneksel motiflerin klasik keman virtüözlüğüyle buluştuğu lirik bir açılış.",
    "aura1": "rgba(180, 83, 9, 0.3)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/653"
  },
  {
    "id": 9654,
    "messageId": 654,
    "title": "Vaheen",
    "artist": "Dilşad",
    "album": "Awazê Kurdî",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Keman",
    "duration": "04:28",
    "cover": "assets/dilsad-awaze-kurdi-cover.jpg",
    "story": "Albüm kapağındaki notalarda da yer alan, kemanın yayından dökülen neşeli, ritmik ve polifonik varyasyonlarla dinleyiciyi içine çeken hareketli bir başyapıt.",
    "aura1": "rgba(180, 83, 9, 0.3)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/654"
  },
  {
    "id": 9655,
    "messageId": 655,
    "title": "Zardaş",
    "artist": "Dilşad",
    "album": "Awazê Kurdî",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Keman",
    "duration": "04:35",
    "cover": "assets/dilsad-awaze-kurdi-cover.jpg",
    "story": "Dağların heybetini ve derin aşk anlatılarını klasik oda müziği zarafetinde kemanın teline nakşeden etkileyici bir geleneksel varyasyon.",
    "aura1": "rgba(180, 83, 9, 0.3)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/655"
  },
  {
    "id": 9656,
    "messageId": 656,
    "title": "Zigeunerweisen",
    "artist": "Dilşad",
    "album": "Awazê Kurdî",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Keman",
    "duration": "04:08",
    "cover": "assets/dilsad-awaze-kurdi-cover.jpg",
    "story": "Pablo de Sarasate'nin ölümsüz Çingene Havaları eserine Kürt folklorik melodi dokunuşlarıyla getirilen virtüöz keman uyarlaması.",
    "aura1": "rgba(180, 83, 9, 0.3)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/656"
  },
  {
    "id": 9657,
    "messageId": 657,
    "title": "Melli Melli",
    "artist": "Dilşad",
    "album": "Awazê Kurdî",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Keman",
    "duration": "06:01",
    "cover": "assets/dilsad-awaze-kurdi-cover.jpg",
    "story": "Geleneksel halay ve düğün ritimlerinin senfonik yaylılar ve piyano eşliğiyle modern bir oda müziği süitine dönüştüğü büyüleyici eser.",
    "aura1": "rgba(180, 83, 9, 0.3)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/657"
  },
  {
    "id": 9658,
    "messageId": 658,
    "title": "Şivan",
    "artist": "Dilşad",
    "album": "Awazê Kurdî",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Keman",
    "duration": "07:01",
    "cover": "assets/dilsad-awaze-kurdi-cover.jpg",
    "story": "Çobanın kaval sesini kemanın dramatik ve geniş oktavlı tınılarıyla yeniden yorumlayan, pastoral ve mistik bir dağ serenadı.",
    "aura1": "rgba(180, 83, 9, 0.3)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/658"
  },
  {
    "id": 9659,
    "messageId": 659,
    "title": "Soran & Bahdinan",
    "artist": "Dilşad",
    "album": "Awazê Kurdî",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Keman",
    "duration": "08:50",
    "cover": "assets/dilsad-awaze-kurdi-cover.jpg",
    "story": "Soran ve Behdinan bölgelerinin kadim melodilerini yaklaşık 9 dakikalık epik bir rapsodide birleştiren albümün görkemli kapanış suiti.",
    "aura1": "rgba(180, 83, 9, 0.3)",
    "aura2": "rgba(217, 119, 6, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/659"
  },
  {
    "id": 9644,
    "messageId": 644,
    "title": "Gulê mehrumê",
    "artist": "Şivan Perwer",
    "album": "Zembîlfiroş",
    "category": "turkce",
    "categoryTitle": "Anadolu & Mezopotamya Ezgileri",
    "duration": "04:38",
    "cover": "assets/sivan-perwer-zembilfiros-cover.jpg",
    "story": "Sevdanın ve ayrılığın hüznünü dengbêj geleneğinin kadim anlatısıyla buluşturan, Şivan Perwer'in dokunaklı bağlaması ve feryat eden vokaliyle yükselen lirik bir klasik.",
    "aura1": "rgba(217, 119, 6, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/644"
  },
  {
    "id": 9645,
    "messageId": 645,
    "title": "Hoy narê",
    "artist": "Şivan Perwer",
    "album": "Zembîlfiroş",
    "category": "turkce",
    "categoryTitle": "Anadolu & Mezopotamya Ezgileri",
    "duration": "04:08",
    "cover": "assets/sivan-perwer-zembilfiros-cover.jpg",
    "story": "Anadolu ve Mezopotamya halk ezgilerinin ritmik coşkusunu, Gülistan'ın duru sesi ve koro vokallerle zenginleştiren dinamik bir halk türküsü.",
    "aura1": "rgba(217, 119, 6, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/645"
  },
  {
    "id": 9646,
    "messageId": 646,
    "title": "Lawo destê min berde",
    "artist": "Şivan Perwer",
    "album": "Zembîlfiroş",
    "category": "turkce",
    "categoryTitle": "Anadolu & Mezopotamya Ezgileri",
    "duration": "04:25",
    "cover": "assets/sivan-perwer-zembilfiros-cover.jpg",
    "story": "Karşılıksız bir aşkın yakarışını ve genç bir kadının iç sesini kadın ve erkek düetinin teatral estetiğiyle sahneye taşıyan geleneksel diyalog türküsü.",
    "aura1": "rgba(217, 119, 6, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/646"
  },
  {
    "id": 9647,
    "messageId": 647,
    "title": "Narîn",
    "artist": "Şivan Perwer",
    "album": "Zembîlfiroş",
    "category": "turkce",
    "categoryTitle": "Anadolu & Mezopotamya Ezgileri",
    "duration": "02:49",
    "cover": "assets/sivan-perwer-zembilfiros-cover.jpg",
    "story": "Zarif ve narin sevgilinin güzelliğine adanmış, tempolu ve kıvrak saz nağmeleriyle bezeli neşeli bir sevda serenadı.",
    "aura1": "rgba(217, 119, 6, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/647"
  },
  {
    "id": 9648,
    "messageId": 648,
    "title": "Qumrîkê",
    "artist": "Şivan Perwer",
    "album": "Zembîlfiroş",
    "category": "turkce",
    "categoryTitle": "Anadolu & Mezopotamya Ezgileri",
    "duration": "04:10",
    "cover": "assets/sivan-perwer-zembilfiros-cover.jpg",
    "story": "Bir kumru kuşunun masumiyetine sığınan kalbin hasretini, içli melodi ve yanık nağmelerle anlatan albümün en sevilen başyapıtlarından biri.",
    "aura1": "rgba(217, 119, 6, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/648"
  },
  {
    "id": 9649,
    "messageId": 649,
    "title": "Sinanê kiriv",
    "artist": "Şivan Perwer",
    "album": "Zembîlfiroş",
    "category": "turkce",
    "categoryTitle": "Anadolu & Mezopotamya Ezgileri",
    "duration": "05:15",
    "cover": "assets/sivan-perwer-zembilfiros-cover.jpg",
    "story": "Kirvelik ve dostluk bağının kadim töresini, dengbêj anlatıcılığının epik derinliğinde ağıta dönüştüren sarsıcı bir destan.",
    "aura1": "rgba(217, 119, 6, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/649"
  },
  {
    "id": 9650,
    "messageId": 650,
    "title": "Zembîlfiroş",
    "artist": "Şivan Perwer",
    "album": "Zembîlfiroş",
    "category": "turkce",
    "categoryTitle": "Anadolu & Mezopotamya Ezgileri",
    "duration": "05:07",
    "cover": "assets/sivan-perwer-zembilfiros-cover.jpg",
    "story": "Hatun ile sepet örücüsü dervişin (Zembîlfiroş) nefsine yenilmeyen ilahi ve dünyevi aşk çatışmasını anlatan Mezopotamya'nın bin yıllık ölümsüz destanının doruk noktası.",
    "aura1": "rgba(217, 119, 6, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/650"
  },
  {
    "id": 9651,
    "messageId": 651,
    "title": "Bejna Zirav",
    "artist": "Şivan Perwer",
    "album": "Zembîlfiroş",
    "category": "turkce",
    "categoryTitle": "Anadolu & Mezopotamya Ezgileri",
    "duration": "04:54",
    "cover": "assets/sivan-perwer-zembilfiros-cover.jpg",
    "story": "İnce boylu, asil sevgilinin zarafetini ve yürüyüşünü halk şiirinin en saf benzetmeleriyle kutlayan coşkulu ve melodik bir halay türküsü.",
    "aura1": "rgba(217, 119, 6, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/651"
  },
  {
    "id": 9652,
    "messageId": 652,
    "title": "Ez nexweş im",
    "artist": "Şivan Perwer",
    "album": "Zembîlfiroş",
    "category": "turkce",
    "categoryTitle": "Anadolu & Mezopotamya Ezgileri",
    "duration": "04:10",
    "cover": "assets/sivan-perwer-zembilfiros-cover.jpg",
    "story": "Aşkın ve gurbetin dertleriyle hasta düşmüş bir yüreğin son çareyi sevgilinin şefkatli bakışında aradığı içten ve hüzünlü kapanış baladı.",
    "aura1": "rgba(217, 119, 6, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/652"
  },
  {
    "id": 9680,
    "messageId": 680,
    "title": "Becoming One with \"The People\" Becoming One with Neytiri",
    "artist": "James Horner",
    "album": "Avatar Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Sinematik Skor",
    "duration": "07:43",
    "cover": "assets/avatar-soundtrack-cover.jpg",
    "story": "Pandora'nın kutsal ruhu Eywa'nın huzurunda Jake Sully'nin Na'vi halkına kabul edilişini ve Neytiri ile bir oluşunu anlatan derin, polifonik koral başyapıt.",
    "aura1": "rgba(6, 182, 212, 0.3)",
    "aura2": "rgba(59, 130, 246, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/680"
  },
  {
    "id": 9681,
    "messageId": 681,
    "title": "Climbing up \"Iknimaya - The Path to Heaven\"",
    "artist": "James Horner",
    "album": "Avatar Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Sinematik Skor",
    "duration": "03:18",
    "cover": "assets/avatar-soundtrack-cover.jpg",
    "story": "Jake'in cennete giden dik kayalıklara tırmandığı ve İkran'ı evcilleştirmeye hazırlandığı heyecan dolu tırmanış teması.",
    "aura1": "rgba(6, 182, 212, 0.3)",
    "aura2": "rgba(59, 130, 246, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/681"
  },
  {
    "id": 9682,
    "messageId": 682,
    "title": "Gathering All the Na'vi Clans for Battle",
    "artist": "James Horner",
    "album": "Avatar Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Sinematik Skor",
    "duration": "05:14",
    "cover": "assets/avatar-soundtrack-cover.jpg",
    "story": "Toruk Makto haline gelen Jake'in tüm Na'vi klanlarını varoluş mücadelesi için bir araya getirdiği epik ve coşkulu kabile çağrısı.",
    "aura1": "rgba(6, 182, 212, 0.3)",
    "aura2": "rgba(59, 130, 246, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/682"
  },
  {
    "id": 9683,
    "messageId": 683,
    "title": "I See You (Theme from Avatar)",
    "artist": "Leona Lewis",
    "album": "Avatar Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Sinematik Skor",
    "duration": "03:47",
    "cover": "assets/avatar-soundtrack-cover.jpg",
    "story": "James Horner bestesi ve Leona Lewis'in güçlü vokaliyle Avatar'ın kapanışına damga vuran, Altın Küre adayı 'I See You' ana tema şarkısı.",
    "aura1": "rgba(6, 182, 212, 0.3)",
    "aura2": "rgba(59, 130, 246, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/683"
  },
  {
    "id": 9684,
    "messageId": 684,
    "title": "Jake Enters His Avatar World",
    "artist": "James Horner",
    "album": "Avatar Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Sinematik Skor",
    "duration": "05:24",
    "cover": "assets/avatar-soundtrack-cover.jpg",
    "story": "Felçli bir deniz piyadesi olan Jake'in bilincinin ilk kez Avatar bedenine aktarıldığı ve ayaklarını toprağa bastığı büyüleyici ilk anlar.",
    "aura1": "rgba(6, 182, 212, 0.3)",
    "aura2": "rgba(59, 130, 246, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/684"
  },
  {
    "id": 9685,
    "messageId": 685,
    "title": "Jake's First Flight",
    "artist": "James Horner",
    "album": "Avatar Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Sinematik Skor",
    "duration": "04:49",
    "cover": "assets/avatar-soundtrack-cover.jpg",
    "story": "Jake'in göklerin hakimi İkran'ı ile Hallelujah Dağları arasında süzüldüğü, sinema tarihinin en özgürleştirici uçuş sahnelerinden birinin müziği.",
    "aura1": "rgba(6, 182, 212, 0.3)",
    "aura2": "rgba(59, 130, 246, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/685"
  },
  {
    "id": 9686,
    "messageId": 686,
    "title": "Pure Spirits of the Forest",
    "artist": "James Horner",
    "album": "Avatar Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Sinematik Skor",
    "duration": "08:49",
    "cover": "assets/avatar-soundtrack-cover.jpg",
    "story": "Pandora'nın kadim ormanındaki parıldayan tohumların (Atokirina) saf ruhunu ve doğanın kutsal dengesini fısıldayan 8 dakikalık mistik tema.",
    "aura1": "rgba(6, 182, 212, 0.3)",
    "aura2": "rgba(59, 130, 246, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/686"
  },
  {
    "id": 9687,
    "messageId": 687,
    "title": "Quaritch",
    "artist": "James Horner",
    "album": "Avatar Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Sinematik Skor",
    "duration": "05:01",
    "cover": "assets/avatar-soundtrack-cover.jpg",
    "story": "Albay Quaritch'in acımasız askeri gücünü, mekanize savaş ritimlerini ve çelik iradesini temsil eden tehditkar tema.",
    "aura1": "rgba(6, 182, 212, 0.3)",
    "aura2": "rgba(59, 130, 246, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/687"
  },
  {
    "id": 9688,
    "messageId": 688,
    "title": "Scorched Earth",
    "artist": "James Horner",
    "album": "Avatar Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Sinematik Skor",
    "duration": "03:32",
    "cover": "assets/avatar-soundtrack-cover.jpg",
    "story": "İnsanlığın doymak bilmez yıkımının ardından küle dönen kutsal toprakların acısını anlatan dramatik yaylılar.",
    "aura1": "rgba(6, 182, 212, 0.3)",
    "aura2": "rgba(59, 130, 246, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/688"
  },
  {
    "id": 9689,
    "messageId": 689,
    "title": "Shutting Down Grace's Lab",
    "artist": "James Horner",
    "album": "Avatar Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Sinematik Skor",
    "duration": "02:47",
    "cover": "assets/avatar-soundtrack-cover.jpg",
    "story": "İnsan üssünün baskısı karşısında Grace Augustine'in ormandaki gizli biyoloji laboratuvarını koruma çabası.",
    "aura1": "rgba(6, 182, 212, 0.3)",
    "aura2": "rgba(59, 130, 246, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/689"
  },
  {
    "id": 9690,
    "messageId": 690,
    "title": "The Bioluminescence of the Night",
    "artist": "James Horner",
    "album": "Avatar Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Sinematik Skor",
    "duration": "03:37",
    "cover": "assets/avatar-soundtrack-cover.jpg",
    "story": "Güneş battığında Pandora ormanının binbir neon rengiyle aydınlandığı biyolüminesans gece atmosferini resmeden rüya gibi melodi.",
    "aura1": "rgba(6, 182, 212, 0.3)",
    "aura2": "rgba(59, 130, 246, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/690"
  },
  {
    "id": 9691,
    "messageId": 691,
    "title": "The Destruction of Hometree",
    "artist": "James Horner",
    "album": "Avatar Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Sinematik Skor",
    "duration": "01:18",
    "cover": "assets/avatar-soundtrack-cover.jpg",
    "story": "Na'vi halkının bin yıllık yuvası Ev Ağacı'nın (Hometree) yıkılışında duyulan derin keder ve koro feryatları.",
    "aura1": "rgba(6, 182, 212, 0.3)",
    "aura2": "rgba(59, 130, 246, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/691"
  },
  {
    "id": 9692,
    "messageId": 692,
    "title": "War",
    "artist": "James Horner",
    "album": "Avatar Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Sinematik Skor",
    "duration": "11:21",
    "cover": "assets/avatar-soundtrack-cover.jpg",
    "story": "Pandora'nın özgürlüğü için verilen ve 11 dakikayı aşan, dev senfoni orkestrası ile kabile perküsyonlarının çarpıştığı epik nihai savaş süiti.",
    "aura1": "rgba(6, 182, 212, 0.3)",
    "aura2": "rgba(59, 130, 246, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/692"
  },
  {
    "id": 9693,
    "messageId": 693,
    "title": "You Don't Dream in Cryo...",
    "artist": "James Horner",
    "album": "Avatar Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Sinematik Skor",
    "duration": "06:09",
    "cover": "assets/avatar-soundtrack-cover.jpg",
    "story": "Uzay yolculuğunun dondurucu derinliklerinden uyanış ve Pandora'nın eşiğine varışın gizemli açılış teması.",
    "aura1": "rgba(6, 182, 212, 0.3)",
    "aura2": "rgba(59, 130, 246, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/693"
  },
  {
    "id": 9660,
    "messageId": 660,
    "title": "Le Banquet",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "01:31",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Montmartre'ın neşeli karnaval ruhunu ve kalabalık sokak sofralarını akordeonun kıvrak melodisiyle karşılayan neşeli parça.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/660"
  },
  {
    "id": 9661,
    "messageId": 661,
    "title": "La Valse d'Amélie (Version Piano)",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "02:38",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Amélie'nin saf ve çocuksu dünyasını piyanonun berrak tuşlarıyla anlatan, albümün en dokunaklı solo piyano valslerinden biri.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/661"
  },
  {
    "id": 9662,
    "messageId": 662,
    "title": "La Valse des monstres",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "03:39",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Yann Tiersen'in ilk dönem eserlerinden, Amélie'nin hayal gücündeki sevimli canavarlara adanmış karanlık ve oyuncu bir vals.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/662"
  },
  {
    "id": 9663,
    "messageId": 663,
    "title": "J'y suis jamais allé",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "01:34",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Daha önce hiç gidilmemiş diyarlara duyulan merakı ve hayatın beklenmedik başlangıçlarını simgeleyen büyüleyici açılış.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/663"
  },
  {
    "id": 9664,
    "messageId": 664,
    "title": "Les Jours tristes (Instrumental)",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "03:03",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Hüzünlü günlerde yağmurun Paris kaldırımlarına düşüşünü ve içe dönük melankoliyi anlatan etkileyici enstrümantal tema.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/664"
  },
  {
    "id": 9665,
    "messageId": 665,
    "title": "La Valse d'Amélie",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "02:15",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Filmin kalbi sayılan, akordeon ve mandolinlerin neşeli dansıyla hayatın küçük detaylarındaki güzelliği kutsayan ana vals.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/665"
  },
  {
    "id": 9666,
    "messageId": 666,
    "title": "Comptine d'un autre été : L'Après-midi",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "02:20",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Comptine d'un autre été : L'Après-midi; başka bir yazın çocukluğuna götüren, müzik tarihinin en çok sevilen ve çalınan piyano başyapıtı.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/666"
  },
  {
    "id": 9667,
    "messageId": 667,
    "title": "La Noyée",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "02:03",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Suların ve duyguların derinliğinde kaybolan bir kalbin hüznünü akordeonun dalgalı tınılarıyla resmeden parça.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/667"
  },
  {
    "id": 9668,
    "messageId": 668,
    "title": "L'Autre Valse d'Amélie",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "01:33",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Amélie vals temasının oyuncak piyano ve çan sesleriyle zenginleştirilmiş masalsı alternatif versiyonu.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/668"
  },
  {
    "id": 9669,
    "messageId": 669,
    "title": "Guilty",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "03:13",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Al France klasiği Guilty melodisinin nostaljik bir gramofondan yükselircesine Paris kafelerine süzüldüğü atmosferik kayıt.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/669"
  },
  {
    "id": 9670,
    "messageId": 670,
    "title": "À quai",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "03:32",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Rıhtımda bekleyen gemileri, vedaları ve yeni maceraları anlatan geniş orkestrasyonlu deniz esintisi.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/670"
  },
  {
    "id": 9671,
    "messageId": 671,
    "title": "Le Moulin",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "04:27",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Montmartre'ın tarihi rüzgar değirmenlerini ve un değirmeninin sakin ritmini piyanonun hipnotik döngüsüyle anlatan eser.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/671"
  },
  {
    "id": 9672,
    "messageId": 672,
    "title": "Pas si simple",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "01:52",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Aşkın ve insan ilişkilerinin karmaşıklığını 'o kadar da basit değil' diyerek fısıldayan narin bir geçiş melodisi.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/672"
  },
  {
    "id": 9673,
    "messageId": 673,
    "title": "La Valse d'Amélie (Version Orchestrale)",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "02:00",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Valse d'Amélie temasının yaylılar ve tüm orkestrayla zenginleştiği, görkemli ve sinematik orkestral versiyon.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/673"
  },
  {
    "id": 9674,
    "messageId": 674,
    "title": "La Valse des vieux os",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "02:20",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Yaşlı kemiklerin valsi; zamanın geçişine ve yaşlılığın bilge hüznüne oyuncu bir tebessümle bakan parça.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/674"
  },
  {
    "id": 9675,
    "messageId": 675,
    "title": "La Dispute",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "04:15",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "İki aşık arasındaki tatlı çekişmeleri ve anlaşmazlıkları piyano ile akordeonun atışmasıyla canlandıran dinamik eser.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/675"
  },
  {
    "id": 9676,
    "messageId": 676,
    "title": "Si tu n'étais pas là",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "03:29",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Frehel'in 1930'lar Paris'inden kalan nostaljik sesini filmdeki kaset çalardan odaya dolduran tarihi şanson.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/676"
  },
  {
    "id": 9677,
    "messageId": 677,
    "title": "Soir de fête",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "02:55",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Paris gecelerinde sokak lambalarının altında yapılan bir festival gecesinin coşkusunu taşıyan neşeli ritim.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/677"
  },
  {
    "id": 9678,
    "messageId": 678,
    "title": "La Redécouverte",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "01:13",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Kırk yıllık kayıp bir çocukluk kutusunun banyodaki karo taşının altında yeniden keşfedildiği mucizevi anın müziği.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/678"
  },
  {
    "id": 9679,
    "messageId": 679,
    "title": "Sur le fil",
    "artist": "Yann Tiersen",
    "album": "Le Fabuleux Destin d'Amélie Poulain",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Akordeon",
    "duration": "04:23",
    "cover": "assets/amelie-soundtrack-cover.jpg",
    "story": "Bir ipin üzerinde yürürcesine kırılgan ve heyecanlı, keman ve akordeonun baş döndürücü virtüözlüğüyle kapanan başyapıt.",
    "aura1": "rgba(16, 185, 129, 0.3)",
    "aura2": "rgba(239, 68, 68, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/679"
  },
  {
    "id": 9694,
    "messageId": 694,
    "title": "Duduk of the North",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "05:33",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Djivan Gasparyan'ın duduk tınılarıyla Germanya'nın sisli ve karlı ormanlarında yankılanan hüzünlü ve kadim bir nefes.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/694"
  },
  {
    "id": 9695,
    "messageId": 695,
    "title": "Earth",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "03:01",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Maximus'un eline aldığı vatan toprağına, doğaya ve köklerine duyduğu sarsılmaz sadakati anlatan sakin tema.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/695"
  },
  {
    "id": 9696,
    "messageId": 696,
    "title": "Elysium",
    "artist": "Lisa Gerrard & Hans Zimmer",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "02:41",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Antik Roma inancındaki cennet Elysium'un altın başaklı tarlalarını Lisa Gerrard'ın ilahi vokaliyle resmeden ölümsüz melodi.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/696"
  },
  {
    "id": 9697,
    "messageId": 697,
    "title": "Figurines",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "01:14",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Maximus'un ailesini simgeleyen küçük ahşap heykelciklere bakarak dua ettiği anın dokunaklı ve sessiz hüznü.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/697"
  },
  {
    "id": 9698,
    "messageId": 698,
    "title": "Homecoming",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "04:51",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Maximus'un evine, ailesine kavuşma umuduyla çıktığı ancak büyük bir trajediyle karşılaşacağı yolculuğun ağıtı.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/698"
  },
  {
    "id": 9699,
    "messageId": 699,
    "title": "Honor Him",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "01:19",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Arenada şehit düşen bir generale Roma halkının ve lejyonların gösterdiği ebedi saygı marşı.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/699"
  },
  {
    "id": 9700,
    "messageId": 700,
    "title": "Marrakesh Marketplace",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "00:42",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Kuzey Afrika'nın köle pazarlarında esir düşen gladyatörlerin egzotik ve hareketli pazar yeri ritimleri.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/700"
  },
  {
    "id": 9701,
    "messageId": 701,
    "title": "Maximus",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "04:18",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Maximus Decimus Meridius'un generalden köleye, köleden gladyatöre dönüşen çelik iradesinin ana teması.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/701"
  },
  {
    "id": 9702,
    "messageId": 702,
    "title": "Not Yet",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "01:32",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Juba'nın dostu Maximus'un mezarı başında 'Henüz değil, ama bir gün kavuşacağız' diyerek fısıldadığı veda.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/702"
  },
  {
    "id": 9703,
    "messageId": 703,
    "title": "Now We Are Free (Maximus Mix)",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "03:50",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Lisa Gerrard'ın büyüleyici vokali ve Hans Zimmer'in ritmik dokunuşlarıyla 'Now We Are Free'nin genişletilmiş Maximus miksi.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/703"
  },
  {
    "id": 9704,
    "messageId": 704,
    "title": "Now We Are Free",
    "artist": "Lisa Gerrard & Hans Zimmer",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "04:18",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Sinema tarihinin en unutulmaz kapanış eseri; acının, köleliğin ve ölümün ardından gelen ebedi özgürlüğün marşı.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/704"
  },
  {
    "id": 9705,
    "messageId": 705,
    "title": "Patricide",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "04:08",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Commodus'un babası Marcus Aurelius'a sarılarak taht hırsı uğruna işlediği kan donduran ihanetin karanlık draması.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/705"
  },
  {
    "id": 9706,
    "messageId": 706,
    "title": "Progeny",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "02:13",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Roma'nın asil soyunun ve imparatorluğun görkemli geçmişinin orkestral yaylılarla anlatılan asil teması.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/706"
  },
  {
    "id": 9707,
    "messageId": 707,
    "title": "Reunion",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "07:17",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Maximus'un ölümün eşiğinde karısı ve oğluna doğru yürüdüğü Elysium kavuşmasının 7 dakikalık senfonik doruk noktası.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/707"
  },
  {
    "id": 9708,
    "messageId": 708,
    "title": "Rome Is the Light",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "02:43",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Roma'nın bir zamanlar temsil ettiği cumhuriyet ideali ve adalet ışığını anlatan asil melodi.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/708"
  },
  {
    "id": 9709,
    "messageId": 709,
    "title": "Secrets",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "00:42",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Saray entrikaları, fısıltılar ve gizli suikast planlarının arka planındaki gerilimli yaylılar.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/709"
  },
  {
    "id": 9710,
    "messageId": 710,
    "title": "Slaves to Rome",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "01:00",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Arenanın kumlarına dökülen zincirli gladyatörlerin Roma sokaklarındaki sessiz ve gururlu yürüyüşü.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/710"
  },
  {
    "id": 9711,
    "messageId": 711,
    "title": "Sorrow",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "01:26",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Ailesini yitiren bir savaşçının yüreğinde hissettiği derin keder ve kabulleniş ağıtı.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/711"
  },
  {
    "id": 9712,
    "messageId": 712,
    "title": "Strength and Honor",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "02:09",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "'Güç ve Onur' andını lejyonların kalbine kazıyan, Roma askerlerinin sarsılmaz sadakat andı.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/712"
  },
  {
    "id": 9713,
    "messageId": 713,
    "title": "The Battle",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "10:02",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Germanya ormanlarındaki barbar ordularına karşı verilen, sinema tarihinin en görkemli 10 dakikalık savaş müziği.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/713"
  },
  {
    "id": 9714,
    "messageId": 714,
    "title": "The Emperor Is Dead",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "01:21",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "İmparator Marcus Aurelius'un ölümüyle Roma'nın altın çağının kapanışını simgeleyen hüzünlü tınılar.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/714"
  },
  {
    "id": 9715,
    "messageId": 715,
    "title": "The General Who Became a Slave",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "03:03",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "İmparatorluk ordularının başkomutanıyken zincirlere vurulup arenaya satılan bir kahramanın trajedisi.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/715"
  },
  {
    "id": 9716,
    "messageId": 716,
    "title": "The Gladiator Waltz",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "08:25",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Colosseum'un kanlı kumlarında ölümüne savaşan gladyatörlerin valsi; trajedinin ve cesaretin 8 dakikalık dansı.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/716"
  },
  {
    "id": 9717,
    "messageId": 717,
    "title": "The Might of Rome",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "05:18",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Sezar'ın ordularının gücünü, pirinç boruların ve dev timpanilerin yankısıyla hissettiren Roma marşı.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/717"
  },
  {
    "id": 9718,
    "messageId": 718,
    "title": "The Mob",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "02:22",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Colosseum tribünlerini dolduran binlerce Romalının gladyatörlerin dövüşüne eşlik eden çılgın tezahüratları.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/718"
  },
  {
    "id": 9719,
    "messageId": 719,
    "title": "The Protector of Rome",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "01:25",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Roma'nın gerçek koruyucusu Maximus'un halkın gözündeki kahramanlık meşalesini yaktığı an.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/719"
  },
  {
    "id": 9720,
    "messageId": 720,
    "title": "The Slave Who Became a Gladiator",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "06:11",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Kölelikten halkın sevgilisi olan yenilmez gladyatörlüğe yükselişin 6 dakikalık epik gelişimi.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/720"
  },
  {
    "id": 9721,
    "messageId": 721,
    "title": "The Wheat",
    "artist": "Lisa Gerrard & Hans Zimmer",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "03:43",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Rüzgarda dalgalanan sarı buğday başakları arasında gezinen el; sinema tarihinin en lirik görsel şiirinin müziği.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/721"
  },
  {
    "id": 9722,
    "messageId": 722,
    "title": "To Zuccabar",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "03:16",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Zuccabar çöl arenasında ilk kez gladyatör kaskını takan savaşçıların Afrika ritimleriyle imtihanı.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/722"
  },
  {
    "id": 9723,
    "messageId": 723,
    "title": "All That Remains",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "00:54",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Yıkılmış bir hayattan ve küle dönen bir evden geriye kalan tek şeyin anılar olduğu an.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/723"
  },
  {
    "id": 9724,
    "messageId": 724,
    "title": "Am I Not Merciful?",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "06:33",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "'Merhametli değil miyim?' diye soran Commodus'un narsisizmini ve ruhsal çöküşünü resmeden 6 dakikalık karanlık süit.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/724"
  },
  {
    "id": 9725,
    "messageId": 725,
    "title": "Barbarian Horde",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "10:33",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Colosseum'da Kartaca Savaşı'nın yeniden canlandırıldığı ve savaş arabalarının devrildiği 10 dakikalık epik dövüş teması.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/725"
  },
  {
    "id": 9726,
    "messageId": 726,
    "title": "Busy Little Bee",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "03:47",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "Sarayın karanlık koridorlarındaki tuzakların ve fısıltılı oyunların tempolu ritmi.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/726"
  },
  {
    "id": 9727,
    "messageId": 727,
    "title": "Death Smiles at All of Us",
    "artist": "Hans Zimmer & Lisa Gerrard",
    "album": "Gladiator Soundtrack",
    "category": "soundtrack",
    "categoryTitle": "Film Müzikleri & Epik Skor",
    "duration": "02:29",
    "cover": "assets/gladiator-soundtrack-cover.jpg",
    "story": "'Ölüm hepimize gülümser; bir erkeğin yapabileceği tek şey ona karşılık gülümsemektir' felsefesinin asil finali.",
    "aura1": "rgba(202, 138, 4, 0.3)",
    "aura2": "rgba(185, 28, 28, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/727"
  },
  {
    "id": 9632,
    "messageId": 632,
    "title": "West Country Girl",
    "artist": "Nick Cave & The Bad Seeds",
    "album": "The Boatman's Call",
    "category": "yabanci",
    "categoryTitle": "Karanlık Piyano & Gotik Balad",
    "duration": "02:45",
    "cover": "assets/nick-cave-the-boatmans-call-cover.jpg",
    "story": "Batı İngiltere kırsalının rüzgarlı tepelerinde yürüyen asi bir kadına (PJ Harvey) adanmış, ritmik ve tutkulu bir akustik serenat.",
    "aura1": "rgba(30, 41, 59, 0.35)",
    "aura2": "rgba(153, 27, 27, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/632"
  },
  {
    "id": 9633,
    "messageId": 633,
    "title": "Black Hair",
    "artist": "Nick Cave & The Bad Seeds",
    "album": "The Boatman's Call",
    "category": "yabanci",
    "categoryTitle": "Karanlık Piyano & Gotik Balad",
    "duration": "04:14",
    "cover": "assets/nick-cave-the-boatmans-call-cover.jpg",
    "story": "Siyah saçların yastığa dağılışını ve tenin kokusunu piyanonun en kırılgan ve fısıltılı akorlarıyla anlatan hipnotik aşk şiiri.",
    "aura1": "rgba(30, 41, 59, 0.35)",
    "aura2": "rgba(153, 27, 27, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/633"
  },
  {
    "id": 9634,
    "messageId": 634,
    "title": "Idiot Prayer",
    "artist": "Nick Cave & The Bad Seeds",
    "album": "The Boatman's Call",
    "category": "yabanci",
    "categoryTitle": "Karanlık Piyano & Gotik Balad",
    "duration": "04:21",
    "cover": "assets/nick-cave-the-boatmans-call-cover.jpg",
    "story": "Aşkın bittiği yerde insanın kendine ettiği nafile duaları ve pişmanlıkları anlatan, bas ve piyanonun karanlık diyaloğu.",
    "aura1": "rgba(30, 41, 59, 0.35)",
    "aura2": "rgba(153, 27, 27, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/634"
  },
  {
    "id": 9635,
    "messageId": 635,
    "title": "Far From Me",
    "artist": "Nick Cave & The Bad Seeds",
    "album": "The Boatman's Call",
    "category": "yabanci",
    "categoryTitle": "Karanlık Piyano & Gotik Balad",
    "duration": "05:33",
    "cover": "assets/nick-cave-the-boatmans-call-cover.jpg",
    "story": "Ayrılığın ardından mesafelerin sadece coğrafi değil, kalpler arasında da bir uçuruma dönüştüğünü anlatan hüzünlü balad.",
    "aura1": "rgba(30, 41, 59, 0.35)",
    "aura2": "rgba(153, 27, 27, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/635"
  },
  {
    "id": 9636,
    "messageId": 636,
    "title": "Green Eyes",
    "artist": "Nick Cave & The Bad Seeds",
    "album": "The Boatman's Call",
    "category": "yabanci",
    "categoryTitle": "Karanlık Piyano & Gotik Balad",
    "duration": "03:32",
    "cover": "assets/nick-cave-the-boatmans-call-cover.jpg",
    "story": "Yeşil gözlerin derinliğinde kaybolan bir aşığın, sevgilinin bakışlarına yazdığı son derece samimi ve lirik bir itiraf.",
    "aura1": "rgba(30, 41, 59, 0.35)",
    "aura2": "rgba(153, 27, 27, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/636"
  },
  {
    "id": 9637,
    "messageId": 637,
    "title": "Into My Arms",
    "artist": "Nick Cave & The Bad Seeds",
    "album": "The Boatman's Call",
    "category": "yabanci",
    "categoryTitle": "Karanlık Piyano & Gotik Balad",
    "duration": "04:15",
    "cover": "assets/nick-cave-the-boatmans-call-cover.jpg",
    "story": "'Müdahaleci bir Tanrı'ya inanmam ama sana inanırım' diyen; müzik tarihinin en saf, yalın ve dokunaklı piyano aşk ilahisi.",
    "aura1": "rgba(30, 41, 59, 0.35)",
    "aura2": "rgba(153, 27, 27, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/637"
  },
  {
    "id": 9638,
    "messageId": 638,
    "title": "Lime Tree Arbour",
    "artist": "Nick Cave & The Bad Seeds",
    "album": "The Boatman's Call",
    "category": "yabanci",
    "categoryTitle": "Karanlık Piyano & Gotik Balad",
    "duration": "02:56",
    "cover": "assets/nick-cave-the-boatmans-call-cover.jpg",
    "story": "Ihlamur ağaçlarının gölgesinde el ele tutuşan iki aşığın dünyadan soyutlandığı huzurlu ve mistik bir sığınak.",
    "aura1": "rgba(30, 41, 59, 0.35)",
    "aura2": "rgba(153, 27, 27, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/638"
  },
  {
    "id": 9639,
    "messageId": 639,
    "title": "People Ain't No Good",
    "artist": "Nick Cave & The Bad Seeds",
    "album": "The Boatman's Call",
    "category": "yabanci",
    "categoryTitle": "Karanlık Piyano & Gotik Balad",
    "duration": "05:42",
    "cover": "assets/nick-cave-the-boatmans-call-cover.jpg",
    "story": "Kırık bir kalbin ardından dünyanın ve insanlığın kusurlarını melankolik bir kabullenişle sıralayan unutulmaz şaheser.",
    "aura1": "rgba(30, 41, 59, 0.35)",
    "aura2": "rgba(153, 27, 27, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/639"
  },
  {
    "id": 9640,
    "messageId": 640,
    "title": "Brompton Oratory",
    "artist": "Nick Cave & The Bad Seeds",
    "album": "The Boatman's Call",
    "category": "yabanci",
    "categoryTitle": "Karanlık Piyano & Gotik Balad",
    "duration": "04:06",
    "cover": "assets/nick-cave-the-boatmans-call-cover.jpg",
    "story": "Brompton Oratory kilisesinin taş basamaklarında oturup dinsel aşk ile dünyevi aşkın kutsallığını sorgulayan derin tefekkür.",
    "aura1": "rgba(30, 41, 59, 0.35)",
    "aura2": "rgba(153, 27, 27, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/640"
  },
  {
    "id": 9641,
    "messageId": 641,
    "title": "There Is a Kingdom",
    "artist": "Nick Cave & The Bad Seeds",
    "album": "The Boatman's Call",
    "category": "yabanci",
    "categoryTitle": "Karanlık Piyano & Gotik Balad",
    "duration": "04:52",
    "cover": "assets/nick-cave-the-boatmans-call-cover.jpg",
    "story": "İçimizdeki krallığın kapılarını aralayan, org ve piyanonun manevi bir dinginlikte buluştuğu ilahi güzellikteki parça.",
    "aura1": "rgba(30, 41, 59, 0.35)",
    "aura2": "rgba(153, 27, 27, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/641"
  },
  {
    "id": 9642,
    "messageId": 642,
    "title": "(Are You) The One That I've Been Waiting For?",
    "artist": "Nick Cave & The Bad Seeds",
    "album": "The Boatman's Call",
    "category": "yabanci",
    "categoryTitle": "Karanlık Piyano & Gotik Balad",
    "duration": "04:05",
    "cover": "assets/nick-cave-the-boatmans-call-cover.jpg",
    "story": "'Acaba hayatım boyunca beklediğim insan sen misin?' sorusunu sevdanın en saf titreyişiyle soran romantik klasik.",
    "aura1": "rgba(30, 41, 59, 0.35)",
    "aura2": "rgba(153, 27, 27, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/642"
  },
  {
    "id": 9643,
    "messageId": 643,
    "title": "Where Do We Go Now But Nowhere?",
    "artist": "Nick Cave & The Bad Seeds",
    "album": "The Boatman's Call",
    "category": "yabanci",
    "categoryTitle": "Karanlık Piyano & Gotik Balad",
    "duration": "05:46",
    "cover": "assets/nick-cave-the-boatmans-call-cover.jpg",
    "story": "Tükenmiş bir ilişkinin ardından gidilecek hiçbir yer kalmadığında hissedilen boşluğu anlatan etkileyici kapanış baladı.",
    "aura1": "rgba(30, 41, 59, 0.35)",
    "aura2": "rgba(153, 27, 27, 0.22)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/643"
  },
  {
    "id": 9728,
    "messageId": 728,
    "title": "8 Variations on \"Laat ons juichen\" by C.E. Graaf in G, K. 24: Variation VIII",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "01:53",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Graaf'ın Hollanda milli marşı teması üzerine bestelenen varyasyonların Danielle Laval piyanosuyla hayat bulan dingin ve zarif 8. bölümü.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/728"
  },
  {
    "id": 9729,
    "messageId": 729,
    "title": "9 Variations on a Minuet by J.P. Duport in D, K. 573: Variation VI. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "13:55",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Duport'un menüeti üzerine yazılan varyasyonların, uykuya ve sakinliğe davet eden zarif Adagio bölümü. Danielle Laval yorumuyla.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/729"
  },
  {
    "id": 9730,
    "messageId": 730,
    "title": "12 Variations in C Major on \"Ah, vous dirai-je Maman\", K. 265: Variation XI. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "07:50",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Dünyaca bilinen çocuk ninnisi temasının Mozart dehasıyla işlendiği 12 varyasyondan, huzur dolu kadife tuşeli 11. Adagio bölümü.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/730"
  },
  {
    "id": 9731,
    "messageId": 731,
    "title": "12 Variations on 'Je suis Lindor' from 'Le Barbier de Séville', K. 354: Variation VIII. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "02:50",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Sevil Berberi operasındaki Lindor romansı üzerine bestelenen varyasyonların en melankolik ve dinlendirici Adagio dokunuşu.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/731"
  },
  {
    "id": 9732,
    "messageId": 732,
    "title": "12 Variations on 'La belle Françoise' in E-Flat Major, K. 353: Variation XI. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "14:25",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Fransız halk şarkısı temasının Mozart piyanizmindeki masalsı ifadesi; derin bir dinginlik sunan 11. varyasyon.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/732"
  },
  {
    "id": 9733,
    "messageId": 733,
    "title": "12 Variations on a Minuet by J.C. Fischer in C Major, K. 179: Variation XI. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "03:14",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Genç Mozart'ın Fischer menüeti üzerine inşa ettiği 179 Köchel sayılı varyasyonların zarif ve durgun Adagio tınıları.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/733"
  },
  {
    "id": 9734,
    "messageId": 734,
    "title": "Ave verum corpus, K. 618",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "04:11",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Mozart'ın hayatının son aylarında Baden'de bestelediği, ilahi bir sükûnet ve teslimiyet hissi veren eşsiz koro moteti.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/734"
  },
  {
    "id": 9735,
    "messageId": 735,
    "title": "Bassoon Concerto in B-Flat Major, K. 191: II. Andante ma adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "07:39",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Fagotun sıcak ve koyu tınısını Viyana Filarmoni eşliğinde rüya gibi bir gece şarkısına dönüştüren ünlü Andante bölümü.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/735"
  },
  {
    "id": 9736,
    "messageId": 736,
    "title": "Clarinet Concerto in A Major, K. 622: II. Adagio (Arr. Accordion & Strings)",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "01:11",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Mozart'ın ölümsüz Klarnet Konçertosu Adagio'sunun usta akordeonist Richard Galliano tarafından yapılan lirik ve büyüleyici düzenlemesi.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/736"
  },
  {
    "id": 9737,
    "messageId": 737,
    "title": "Clarinet Quintet in A Major, K. 581: II. Larghetto",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "06:06",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Klarnet ve yaylı çalgıların bir araya geldiği en dokunaklı oda müziği başyapıtlarından biri; zamanı durduran Larghetto.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/737"
  },
  {
    "id": 9738,
    "messageId": 738,
    "title": "Concerto for Flute, Harp, and Orchestra in C Major, K. 299: II. Andantino",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "28:57",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Flüt ve arpın kristal berraklığındaki diyaloğuyla Paris'te yazılan, su gibi akan masalsı Andantino bölümü.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/738"
  },
  {
    "id": 9739,
    "messageId": 739,
    "title": "Divertimento No. 2 in D Major, K. 131: II. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "06:10",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Genç Mozart'ın Salzburg geceleri için bestelediği serenat ruhlu Divertimento'nun yaylılar ve nefeslilerle örülü huzurlu Adagio'su.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/739"
  },
  {
    "id": 9740,
    "messageId": 740,
    "title": "Duo for Violin and Viola in G Major, K. 423: II. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "04:54",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "İki virtüöz çalgının, keman ile viyolanın birbirine fısıldarcasına eşlik ettiği samimi ve derin bir Adagio sohbeti.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/740"
  },
  {
    "id": 9741,
    "messageId": 741,
    "title": "Fantasia in D Minor, K. 397",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "05:51",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Mozart'ın melankoli ve içsel arayışla dolu, Chopin ödüllü piyanist Seong-Jin Cho'nun incelikli dokunuşlarıyla parlayan piyano fantezisi.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/741"
  },
  {
    "id": 9742,
    "messageId": 742,
    "title": "Flute Concerto No. 1 in G Major, K. 313: II. Adagio non troppo",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "28:42",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Flütün gökyüzüne süzülen hafifliği ve zarafeti; Irena Grafenauer'in nefesinde huzura kavuşan Adagio non troppo.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/742"
  },
  {
    "id": 9743,
    "messageId": 743,
    "title": "Horn Concerto No. 2 in E-Flat Major, K. 417: II. Andante",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "03:15",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Kornonun kadife ve asil tonlarının Londra Senfoni eşliğinde dinleyeni masalsı bir orman sükûnetine taşıdığı Andante.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/743"
  },
  {
    "id": 9744,
    "messageId": 744,
    "title": "Horn Concerto No. 4 in E-Flat Major, K. 495: II. Romance. Andante cantabile",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "03:56",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Mozart'ın dostu Leutgeb için yazdığı, kornonun şarkı söylediği en içten romantik ezgilerden Romance (Andante cantabile).",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/744"
  },
  {
    "id": 9745,
    "messageId": 745,
    "title": "Piano Concerto No. 6 in B-Flat Major, K. 238: II. Andante un poco adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "06:10",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Efsanevi Mozart yorumcusu Alfred Brendel'in tuşelerinde pırıldayan, çocuksu masumiyet ve derin zarafet taşıyan erken dönem konçerto bölümü.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/745"
  },
  {
    "id": 9746,
    "messageId": 746,
    "title": "Piano Concerto No. 21 in C Major, K. 467: II. Andante",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "07:20",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Elvira Madigan filmiyle efsaneleşen, klasik müzik tarihinin en ünlü, en dingin ve insanı yerçekiminden koparan Andante başyapıtı.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/746"
  },
  {
    "id": 9747,
    "messageId": 747,
    "title": "Piano Concerto No. 23 in A Major, K. 488: II. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "08:03",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Fis minör tonunda yazılmış, Mozart'ın hüznü ve dinginliği en derinden hissettirdiği, siciliana ritmindeki unutulmaz Adagio.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/747"
  },
  {
    "id": 9748,
    "messageId": 748,
    "title": "Piano Quartet No. 2 in E-Flat Major, K. 493: II. Larghetto",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "09:21",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Piyano ve yaylı üçlüsünün mükemmel dengesi; Fauré Quartett yorumuyla sıcak bir kucaklaşma hissi veren Larghetto.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/748"
  },
  {
    "id": 9749,
    "messageId": 749,
    "title": "Piano Sonata No. 4 in E-Flat Major, K. 282: I. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "15:36",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Alışılagelmiş hızlı başlangıçların aksine doğrudan derin ve sakin bir Adagio ile açılan sıra dışı Mozart piyano sonatı.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/749"
  },
  {
    "id": 9750,
    "messageId": 750,
    "title": "Piano Sonata No. 7 in C Major, K. 309: II. Andante, un poco adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "16:10",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Mannheim'da bestelenen ve genç Rosa Cannabich'in zarif karakterini yansıttığı söylenen şiirsel piyano portresi.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/750"
  },
  {
    "id": 9751,
    "messageId": 751,
    "title": "Piano Sonata No. 13 in B-Flat Major, K. 333: II. Andante cantabile",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "20:21",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Büyük piyanist Mitsuko Uchida'nın eşsiz yorumuyla, piyanonun operatik bir arya gibi şarkı söylediği Andante cantabile.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/751"
  },
  {
    "id": 9752,
    "messageId": 752,
    "title": "Piano Sonata No. 17 in B-Flat Major, K. 570: II. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "18:53",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Mozart'ın olgunluk döneminde ulaştığı yalın mükemmelliğin ve duru melodik güzelliğin simgesi olan Adagio bölümü.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/752"
  },
  {
    "id": 9753,
    "messageId": 753,
    "title": "Piano Sonata No. 18 in D Major, K. 576: II. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "14:22",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Mozart'ın son piyano sonatının ('Av' sonatı) Vladimir Ashkenazy yorumuyla geceye dökülen dingin A-dur Adagio bölümü.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/753"
  },
  {
    "id": 9754,
    "messageId": 754,
    "title": "Piano Sonata No. 14 in C Minor, K. 457: II. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "22:05",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Karanlık Do minör fırtınasının ardından gelen, teselli ve sonsuz huzur vadeden muazzam Adagio kantilenası.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/754"
  },
  {
    "id": 9755,
    "messageId": 755,
    "title": "Requiem in D Minor, K. 626: Lacrimosa",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "04:05",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Mozart'ın son nefesinde kaleme aldığı, insan ruhunu derinden sarsan ve gözyaşlarını ebedi bir sükûnete dönüştüren efsanevi ağıt.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/755"
  },
  {
    "id": 9756,
    "messageId": 756,
    "title": "Requiem in D Minor, KV 626: Tuba mirum",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "04:00",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Yaylı dörtlüsü ve konuk solistlerin yaylı düzenlemesiyle Requiem'in Tuba mirum bölümünün içe işleyen lirik yorumu.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/756"
  },
  {
    "id": 9757,
    "messageId": 757,
    "title": "Serenade in B-Flat Major, K. 361 'Gran Partita': III. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "05:56",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Amadeus filminde Salieri'nin 'Bu bir kuşun şarkısı değil, tanrının sesiydi' dediği, nefesli çalgılar tarihinin en kusursuz Adagio'su.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/757"
  },
  {
    "id": 9758,
    "messageId": 758,
    "title": "Serenade in C Minor, K. 388 'Nacht Musik': II. Andante",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "04:19",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Sekiz nefesli çalgı için bestelenen gece müziğinin, Heinz Holliger topluluğunun kusursuz nefesiyle hayat bulan Andante bölümü.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/758"
  },
  {
    "id": 9759,
    "messageId": 759,
    "title": "Sinfonia concertante in E-Flat Major, K. 297b: II. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "30:30",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Obua, klarnet, korno ve fagotun orkestra eşliğinde kurduğu dörtlü armoninin dinleyeni masalsı bir uykuya hazırlayan Adagio'su.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/759"
  },
  {
    "id": 9760,
    "messageId": 760,
    "title": "Sonata for Two Pianos in D Major, K. 448: II. Andante",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "07:55",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Mozart Etkisi araştırmalarının odak noktası olan D-dur sonatın, piyano ve marimba uyarlamasıyla sunulan hipnotik Andante yorumu.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/760"
  },
  {
    "id": 9761,
    "messageId": 761,
    "title": "String Quartet No. 12 in B-Flat Major, K. 172: II. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "05:58",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Efsanevi Quartetto Italiano'nun yaylarından dökülen, genç Mozart'ın İtalyan zarafetini yansıtan dinlendirici Adagio.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/761"
  },
  {
    "id": 9762,
    "messageId": 762,
    "title": "String Quartet No. 14 in G Major, K. 387: III. Andante cantabile",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "07:59",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Haydn'a adanan altı yaylı dörtlüsünün ilki; Emerson Quartet'in pürüzsüz tonlarıyla şarkı söyleyen Andante cantabile.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/762"
  },
  {
    "id": 9763,
    "messageId": 763,
    "title": "String Quartet No. 19 in C Major, K. 465 'Dissonance': II. Andante cantabile",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "29:44",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "'Uyumsuzluk' lakaplı ünlü dörtlüden, gizemli girişin ardından ruhu sarıp sarmalayan huzurlu ve asil Andante cantabile.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/763"
  },
  {
    "id": 9764,
    "messageId": 764,
    "title": "String Quartet No. 21 in D Major, K. 575 'Prussian No. 1': II. Andante",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "04:30",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Prusya Kralı II. Friedrich Wilhelm için bestelenen, çellonun ve yaylıların sıcak melodilerle sohbet ettiği Andante.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/764"
  },
  {
    "id": 9765,
    "messageId": 765,
    "title": "String Quintet No. 3 in G Minor, K. 516: III. Adagio ma non troppo",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "34:37",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "İki viyolanın kattığı derin tınıyla Mozart'ın en yoğun ve dokunaklı oda müziği sayfalarından biri; derin bir sükûnet Adagio'su.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/765"
  },
  {
    "id": 9766,
    "messageId": 766,
    "title": "Symphony No. 36 in C Major, K. 425 'Linz': II. Andante - Poco adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "26:50",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Linz şehrinde sadece birkaç gün içinde bestelenen 36. Senfoni'nin Günter Wand yönetimindeki berrak ve dingin Andante bölümü.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/766"
  },
  {
    "id": 9767,
    "messageId": 767,
    "title": "Symphony No. 40 in G Minor, K. 550: II. Andante",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "07:26",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Büyük Sol minör senfoninin ilk bölümündeki dramatik heyecanı yatıştıran, kalbi yumuşatan ve geceye huzur getiren Andante.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/767"
  },
  {
    "id": 9768,
    "messageId": 768,
    "title": "The London Sketchbook, K. 15a-ss: Adagio in E-Flat Major",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "02:08",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Sekiz yaşındaki dahi çocuk Mozart'ın Londra'da defterine karaladığı eskizlerden orkestraya uyarlanan tatlı bir Adagio rüyası.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/768"
  },
  {
    "id": 9769,
    "messageId": 769,
    "title": "Violin Concerto No. 1 in B-Flat Major, K. 207: II. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "07:38",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Keman virtüözü Anne-Sophie Mutter'in gümüşi keman tonuyla Mozart'ın ilk keman konçertosuna kattığı duru zarafet.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/769"
  },
  {
    "id": 9770,
    "messageId": 770,
    "title": "Violin Concerto No. 3 in G Major, K. 216: II. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "09:01",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Kemanın orkestra üzerinde adeta kanatlanıp uçtuğu, dinleyeni tüm dünyevi kaygılardan arındıran mucizevi Adagio.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/770"
  },
  {
    "id": 9771,
    "messageId": 771,
    "title": "Violin Concerto No. 4 in D Major, K. 218: II. Andante cantabile",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "23:04",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Arthur Grumiaux'nun aristokratik ve pürüzsüz keman tınısıyla ölümsüzleşen, şarkı söyleyen Andante cantabile.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/771"
  },
  {
    "id": 9772,
    "messageId": 772,
    "title": "Violin Concerto No. 5 in A Major, K. 219 'Turkish': II. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "33:29",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "'Türk' konçertosu olarak bilinen 5. Keman Konçertosu'nun Münih Oda Orkestrası eşliğindeki derin, lirik ve dinlendirici Adagio'su.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/772"
  },
  {
    "id": 9773,
    "messageId": 773,
    "title": "Violin Sonata in E Minor, K. 304: II. Tempo di menuetto – Dolce",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "15:31",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "Paris'te annesinin vefatının ardından yazdığı tek Mi minör sonattan; Maria João Pires ve Augustin Dumay'ın yürek titreten tatlı dokunuşu.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/773"
  },
  {
    "id": 9774,
    "messageId": 774,
    "title": "Violin Sonata in E-Flat Major, K. 481: II. Adagio",
    "artist": "Wolfgang Amadeus Mozart",
    "album": "Sleep with Mozart",
    "category": "classical",
    "categoryTitle": "Klasik Müzik & Senfoni",
    "duration": "07:03",
    "cover": "assets/sleep-with-mozart-cover.webp",
    "story": "İki dev müzisyenin, Itzhak Perlman ve Daniel Barenboim'in oda müziğinde zirveye ulaştığı, rüyalara eşlik eden muazzam Adagio.",
    "aura1": "rgba(234, 179, 8, 0.3)",
    "aura2": "rgba(30, 58, 138, 0.25)",
    "demoAudio": "https://radyo-kirkyama-stream.onrender.com/stream/774"
  }
];


  // ==========================================================================
  // SANATÇI ARŞİVİ & MONOGRAFİLER KATALOĞU
  // ==========================================================================
  const ARTISTS_CATALOG = [
  {
    "id": "ezginin-gunlugu",
    "name": "Ezginin Günlüğü",
    "filterKey": "Ezginin Günlüğü",
    "years": "1982 — Günümüz",
    "genre": "Özgün Müzik & Kent Ozanlığı",
    "avatar": "assets/ezginin-gunlugu-artist.webp",
    "story": "1982 yılında Emin İgüs, Hakan Yılmaz ve Nadir Göktürk tarafından kurulan; Nâzım Hikmet, Orhan Veli, Can Yücel ve Behçet Aysan gibi Türk edebiyatının dev şairlerinin dizelerini eşsiz armoniler ve akustik tınılarla besteleyen Türk kent ozanlığı ve çağdaş halk müziğinin en köklü ve zarif topluluğu.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)"
  },
  {
    "id": "behzad",
    "name": "Behzad",
    "filterKey": "Behzad",
    "years": "Flamenko & Akdeniz Gitarı",
    "genre": "Flamenko & Akdeniz Akustik Gitar",
    "avatar": "assets/behzad-strings-of-desire-cover.jpg",
    "story": "Akdeniz'in sıcak sokaklarından İspanyol flamenko ateşine ve Doğu mistisizmine uzanan virtüöz klasik ve akustik gitar ustası Behzad; 'Strings of Desire' albümündeki büyüleyici parmak teknikleri ve lirik besteleriyle enstrümantal gitar edebiyatının en tutkulu seslerinden biridir.",
    "aura1": "rgba(220, 38, 38, 0.32)",
    "aura2": "rgba(217, 119, 6, 0.22)"
  },
  {
    "id": "baris-manco",
    "name": "Barış Manço",
    "filterKey": "Barış Manço",
    "years": "1943 — 1999",
    "genre": "Anadolu Rock & Klasikler",
    "avatar": "assets/baris-manco-artist.jpg",
    "story": "Anadolu ezgilerini modern rock ve evrensel harmonilerle buluşturan Türk müziğinin efsanevi ozanı. Şarkıları kuşaktan kuşağa bir kültür mirası olarak yaşamaya devam ediyor.",
    "aura1": "rgba(217, 119, 6, 0.26)",
    "aura2": "rgba(180, 83, 9, 0.2)"
  },
  {
    "id": "sebnem-ferah",
    "name": "Şebnem Ferah",
    "filterKey": "Şebnem Ferah",
    "years": "1972 — Günümüz",
    "genre": "Türk Rock & Alternatif",
    "avatar": "assets/sebnem-ferah-artist.webp",
    "story": "Türk rock müziğinin tartışmasız kraliçesi; Volvox ile başlayan öncü kadın rock duruşunu 'Kadın', 'Artık Kısa Cümleler Kuruyorum', 'Kelimeler Yetse' ve 'Can Kırıkları' gibi başyapıtlarla zirveye taşıyan, eşsiz vokal gücü ve derin edebi sözleriyle milyonların kalbine dokunan büyük bir efsanedir.",
    "aura1": "rgba(225, 29, 72, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)"
  },
  {
    "id": "cem-karaca",
    "name": "Cem Karaca",
    "filterKey": "Cem Karaca",
    "years": "1945 — 2004",
    "genre": "Saykodelik Rock & Türküler",
    "avatar": "assets/cem-karaca-artist.webp",
    "story": "Güçlü bariton sesi, teatral sahne duruşu ve saykodelik rock tınılarıyla Anadolu'nun kadim sesini dünyaya haykıran büyük usta.",
    "aura1": "rgba(220, 38, 38, 0.24)",
    "aura2": "rgba(124, 45, 18, 0.2)"
  },
  {
    "id": "erkin-koray",
    "name": "Erkin Koray",
    "filterKey": "Erkin Koray",
    "years": "1941 — 2023",
    "genre": "Anadolu Rock & Gitarlar",
    "avatar": "assets/erkin-koray-artist.jpg",
    "story": "Elektro bağlamayı ve sert distortion tonlarını Türk müziğiyle buluşturan Anadolu rock ve saykodelik dönemin kurucu dehası.",
    "aura1": "rgba(245, 158, 11, 0.24)",
    "aura2": "rgba(147, 51, 234, 0.18)"
  },
  {
    "id": "mogollar",
    "name": "Moğollar",
    "filterKey": "Moğollar",
    "years": "1967 — Günümüz",
    "genre": "Anadolu Pop & Progresif Rock",
    "avatar": "assets/mogollar-artist.jpg",
    "story": "1967'de kurulan, Türk müziğinde 'Anadolu Pop' akımının isim babası ve öncüsü olan efsanevi grup. 'Danses et Rythmes de la Turquie' albümüyle Fransa'da Charles Cros Büyük Plak Ödülü'nü kazanan; Cahit Berkay, Taner Öngür ve Engin Yörükoğlu gibi ustaların yaylı tambur, bağlama ve progressive rock birleşimiyle dünya çapında yankı uyandıran köklü bir müzik çınarıdır.",
    "aura1": "rgba(180, 83, 9, 0.28)",
    "aura2": "rgba(20, 184, 166, 0.2)"
  },
  {
    "id": "teoman",
    "name": "Teoman",
    "filterKey": "Teoman",
    "years": "1967 — Günümüz",
    "genre": "Türk Rock & Kent Ozanı",
    "avatar": "assets/teoman-artist.jpg",
    "story": "İstanbul'un melankolisini, yağmurlarını, yalnızlığını ve gençlik hezeyanlarını sinematik bir edebi dille anlatan modern Türk rock müziğinin en büyük hikaye anlatıcısı ve kent ozanıdır.",
    "aura1": "rgba(59, 130, 246, 0.28)",
    "aura2": "rgba(100, 116, 139, 0.22)"
  },
  {
    "id": "haluk-levent",
    "name": "Haluk Levent",
    "filterKey": "Haluk Levent",
    "years": "1968 — Günümüz",
    "genre": "Anadolu Rock & Dayanışma",
    "avatar": "assets/haluk-levent-artist.jpg",
    "story": "Yollarda Bulurum Seni, Elfida ve Akdeniz Akşamları gibi marşlarla 90'lardan bu yana milyonların sesi olan; Anadolu rock mirasını samimi halk türküleri, hırçın vokali ve eşsiz dayanışma ruhuyla yaşatan halk sanatçısı.",
    "aura1": "rgba(234, 88, 12, 0.28)",
    "aura2": "rgba(180, 83, 9, 0.22)"
  }
];

  // ==========================================================================
  // SEVDİĞİM ALBÜMLER & SOUNDTRACK KATALOĞU
  // (Sanatçılar bölümündeki sanatçıların parçaları yalnızca Sanatçılar sekmesinde yer alır)
  // ==========================================================================
  const ALBUMS_CATALOG = [
    {
      id: "sleep-with-mozart",
      title: "Sleep with Mozart",
      artist: "Wolfgang Amadeus Mozart",
      year: "Wiener Philharmoniker",
      sub: "cult",
      badge: "Klasik & Huzur",
      filterKey: "Sleep with Mozart",
      cover: "assets/sleep-with-mozart-cover.webp",
      story: "Wolfgang Amadeus Mozart'ın zihni dinginleştiren, uyku ve derin odaklanmaya eşlik eden en zarif senfoni, konçerto ve serenat kayıtları. Viyana Filarmoni Orkestrası ve dünyaca ünlü solistlerin eşsiz yorumuyla Mozart şaheserleri.",
      aura1: "rgba(234, 179, 8, 0.3)",
      aura2: "rgba(30, 58, 138, 0.25)"
    },
    {
      id: "nick-cave-the-boatmans-call",
      title: "The Boatman's Call",
      artist: "Nick Cave & The Bad Seeds",
      year: "1997",
      sub: "cult",
      badge: "Kült Piyano Balad",
      filterKey: "The Boatman's Call",
      cover: "assets/nick-cave-the-boatmans-call-cover.jpg",
      story: "Nick Cave'in PJ Harvey ile fırtınalı ayrılığının ardından kaleme aldığı, öfke ve distortion'ı bir kenara bırakıp sadece piyano, bas ve kırılgan bir sesle aşkı ve kaybı anlattığı karanlık romantizmin kült başyapıtı. 'Into My Arms' ve 'People Ain't No Good' gibi ölümsüz baladlar.",
      aura1: "rgba(30, 41, 59, 0.35)",
      aura2: "rgba(153, 27, 27, 0.22)"
    },
    {
      id: "gladiator-soundtrack",
      title: "Gladiator Soundtrack",
      artist: "Hans Zimmer & Lisa Gerrard",
      year: "2000",
      sub: "soundtrack",
      badge: "🎬 Soundtrack",
      filterKey: "Gladiator",
      cover: "assets/gladiator-soundtrack-cover.jpg",
      story: "Ridley Scott'ın sinema tarihine geçen başyapıtı Gladyatör için Hans Zimmer ve Lisa Gerrard tarafından bestelenen Altın Küre ödüllü epik film müziği. Djivan Gasparyan'ın duduk tınıları, dev savaş koroları ve 'Now We Are Free'nin cennet tarlalarındaki ebedi yankısı.",
      aura1: "rgba(202, 138, 4, 0.3)",
      aura2: "rgba(185, 28, 28, 0.22)"
    },
    {
      id: "le-fabuleux-destin-damelie-poulain",
      title: "Le Fabuleux Destin d'Amélie Poulain",
      artist: "Yann Tiersen",
      year: "2001",
      sub: "soundtrack",
      badge: "🎬 Soundtrack",
      filterKey: "Amélie",
      cover: "assets/amelie-soundtrack-cover.jpg",
      story: "Jean-Pierre Jeunet'nin masalsı sinema klasiği Amélie için Yann Tiersen tarafından bestelenen Fransız sinema müziği başyapıtı. Akordeon, oyuncak piyano, klavsen ve dokunaklı melodilerle Montmartre sokaklarının ve küçük mutlulukların rüyası.",
      aura1: "rgba(16, 185, 129, 0.3)",
      aura2: "rgba(239, 68, 68, 0.22)"
    },
    {
      id: "avatar-soundtrack",
      title: "Avatar Soundtrack",
      artist: "James Horner",
      year: "2009",
      sub: "soundtrack",
      badge: "🎬 Soundtrack",
      filterKey: "Avatar",
      cover: "assets/avatar-soundtrack-cover.jpg",
      story: "James Cameron'ın sinema tarihini değiştiren bilimkurgu başyapıtı Avatar için James Horner tarafından bestelenen Oscar ve Altın Küre adayı efsanevi film müziği. Etnik korolar, Na'vi dilindeki vokaller ve dev senfoni orkestrasıyla Pandora'nın biyolüminesans rüyası.",
      aura1: "rgba(6, 182, 212, 0.3)",
      aura2: "rgba(59, 130, 246, 0.22)"
    },
    {
      id: "sivan-perwer-zembilfiros",
      title: "Zembîlfiroş",
      artist: "Şivan Perwer",
      year: "1992",
      sub: "cult",
      badge: "Kült Kaset & Destan",
      filterKey: "Zembîlfiroş",
      cover: "assets/sivan-perwer-zembilfiros-cover.jpg",
      story: "Kürt sözlü edebiyatının en görkemli destanlarından biri olan Zembîlfiroş ve Gulhatun efsanesini ölümsüzleştiren tarihi kaset. Şivan Perwer ve Gülistan Perwer'in dengbêj geleneğini modern saz ve orkestrasyonla harmanladığı, Qumrîkê ve Sinanê Kiriv gibi halk hazinelerini barındıran başyapıt.",
      aura1: "rgba(217, 119, 6, 0.3)",
      aura2: "rgba(185, 28, 28, 0.22)"
    },
    {
      id: "dilsad-awaze-kurdi",
      title: "Awazê Kurdî",
      artist: "Dilşad",
      year: "Klasik Keman Varyasyonları",
      sub: "cult",
      badge: "Klasik Keman",
      filterKey: "Awazê Kurdî",
      cover: "assets/dilsad-awaze-kurdi-cover.jpg",
      story: "Dünyaca ünlü keman virtüözü ve besteci Dilşad Seîd'in (Dilshad Said) kadim Kürt ezgilerini Batı klasik keman tekniği ve polifonisinin doruklarında yeniden yarattığı başyapıtı: 'Variations on Kurdish Melodies for Violin'.",
      aura1: "rgba(180, 83, 9, 0.3)",
      aura2: "rgba(217, 119, 6, 0.22)"
    },
  {
    "id": "the-no1-french-classic-songs",
    "title": "Eski Hoş Fransızca Şarkılar",
    "artist": "Çeşitli Sanatçılar (The Legends of France)",
    "year": "Altın Çağ Chanson",
    "sub": "cult",
    "badge": "Fransız Şansonları",
    "filterKey": "Eski Hoş Fransızca Şarkılar",
    "isCompilation": true,
    "cover": "assets/the-no1-french-classics-cover.jpg",
    "story": "Fransız müziğinin efsanevi altın çağına damga vurmuş ölümsüz şansonlar ve melodiler. Édith Piaf, Charles Aznavour, Jacques Brel, Dalida, Joe Dassin, Françoise Hardy, Yves Montand ve Charles Trenet gibi devlerin sesinden Paris sokaklarının nostaljisi.",
    "aura1": "rgba(37, 99, 235, 0.3)",
    "aura2": "rgba(220, 38, 38, 0.22)"
  },
  {
    "id": "eva-cassidy-songbird",
    "title": "Songbird",
    "artist": "Eva Cassidy",
    "year": "1998",
    "sub": "cult",
    "badge": "Akustik Caz & Vokal",
    "filterKey": "Songbird",
    "cover": "assets/eva-cassidy-songbird-cover.jpg",
    "story": "Eva Cassidy'nin zamansız vedasından sonra tüm dünyayı sarsan, saf ve dokunaklı sesiyle Sting'in 'Fields of Gold' ve Fleetwood Mac'in 'Songbird' gibi eserlerini birer dua zarafetinde yeniden yarattığı ölümsüz akustik caz ve folk başyapıtı.",
    "aura1": "rgba(245, 158, 11, 0.3)",
    "aura2": "rgba(180, 83, 9, 0.22)"
  },
  {
    "id": "turkce-klasikler-45likler",
    "title": "Türkçe Klasikler",
    "artist": "Çeşitli Sanatçılar",
    "year": "70'ler & 80'ler",
    "sub": "cult",
    "badge": "Kült 45'likler",
    "filterKey": "Türkçe Klasikler",
    "cover": "assets/turkce-klasikler-45likler-cover.jpg",
    "story": "Türk pop müziğinin ve Yeşilçam sinemasının altın çağına damga vuran 45'lik plaklar antolojisi. Zeki Müren, Ajda Pekkan, Erol Evgin, Sezen Aksu, Tanju Okan, Hümeyra, Nilüfer ve Fikret Kızılok gibi efsanelerin dillerden düşmeyen 84 ölümsüz klasiği tek bir tarihi koleksiyonda.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(225, 29, 72, 0.22)"
  },
  {
    "id": "ludovico-einaudi-in-a-time-lapse",
    "title": "In a Time Lapse",
    "artist": "Ludovico Einaudi",
    "year": "2013",
    "sub": "cult",
    "badge": "Neoklasik Başyapıt",
    "filterKey": "In a Time Lapse",
    "cover": "assets/in-a-time-lapse-cover.jpg",
    "story": "İtalyan piyanist ve besteci Ludovico Einaudi'nin Verona yakınlarındaki bir manastırda kaydettiği; zamanın akışını, hafızayı ve insan ruhunun döngülerini piyano, yaylılar ve elektronik tınılarla anlatan neoklasik başyapıtı. 'Experience' ve 'Time Lapse' ile çağımızın en çok dinlenen klasik albümlerinden biri.",
    "aura1": "rgba(16, 185, 129, 0.28)",
    "aura2": "rgba(220, 38, 38, 0.22)"
  },
  {
    "id": "emrah-fidan-anadoludan-asyaya-bir-nefes",
    "title": "Anadolu'dan Asya'ya Bir Nefes",
    "artist": "Emrah Fidan",
    "year": "2010",
    "sub": "cult",
    "badge": "Enstrümantal Etnik",
    "filterKey": "Anadolu'dan Asya'ya Bir Nefes",
    "cover": "assets/anadoludan-asyaya-bir-nefes-cover.jpg",
    "story": "Emrah Fidan'ın Orta Asya bozkırlarından Anadolu yaylalarına, Kırım ve Kafkasya'dan Balkanlar'a uzanan kadim Türk ve Avrasya coğrafyasının ezgilerini kopuz, kaval, kemençe ve ney ile enstrümantal bir nefese dönüştürdüğü 2010 tarihli etnik başyapıt.",
    "aura1": "rgba(217, 119, 6, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)"
  },
  {
    "id": "muzeyyen-senar-ataturkun-sevdigi-sarkilar",
    "title": "Atatürk'ün Sevdiği Şarkılar",
    "artist": "Müzeyyen Senar & Safiye Ayla",
    "year": "Tarihi Kayıtlar",
    "sub": "cult",
    "badge": "Tarihi Taş Plak",
    "filterKey": "Atatürk'ün Sevdiği Şarkılar",
    "cover": "assets/ataturkun-sevdigi-sarkilar-cover.jpg",
    "story": "Gazi Mustafa Kemal Atatürk'ün Dolmabahçe ve Çankaya sofralarında bizzat huzurunda dinlediği, Cumhuriyet'in iki efsanevi divası Müzeyyen Senar ve Safiye Ayla'nın orijinal taş plak seslerinden Vardar Ovası, Yanık Ömer, Çile Bülbülüm ve Fikrimin İnce Gülü gibi ölümsüz tarihi kayıtlar.",
    "aura1": "rgba(180, 83, 9, 0.32)",
    "aura2": "rgba(120, 53, 15, 0.22)"
  },
  {
    "id": "yavuz-asocal-classicals-with-oriental",
    "title": "Classicals With Oriental",
    "artist": "Yavuz Asöcal",
    "year": "2009",
    "sub": "cult",
    "badge": "Doğu-Batı Sentezi",
    "filterKey": "Classicals With Oriental",
    "cover": "assets/classicals-with-oriental-beats-cover.jpg",
    "story": "Yavuz Asöcal'ın Mozart, Beethoven, Vivaldi, Bach ve Mendelssohn gibi Batı klasik müzik devlerinin ölümsüz başyapıtlarını oryantal perküsyonlar, kanun ve ney tınılarıyla büyüleyici bir Doğu-Batı sentezine dönüştürdüğü 2009 tarihli kült albüm.",
    "aura1": "rgba(30, 58, 138, 0.35)",
    "aura2": "rgba(180, 83, 9, 0.25)"
  },
  {
    "id": "royal-philharmonic-orchestra-symphonic-rock",
    "title": "Symphonic Rock",
    "artist": "The Royal Philharmonic Orchestra",
    "year": "2001",
    "sub": "cult",
    "badge": "Kült Albüm",
    "filterKey": "Symphonic Rock",
    "cover": "assets/symphonic-rock-cover.jpg",
    "story": "The Royal Philharmonic Orchestra'nın rock tarihine yön veren efsanevi besteleri (Queen, Led Zeppelin, The Beatles, Pink Floyd, U2, Oasis, The Verve) görkemli senfoni orkestrasıyla yorumladığı kült albüm.",
    "aura1": "rgba(234, 179, 8, 0.32)",
    "aura2": "rgba(180, 83, 9, 0.22)"
  }
];

  // ==========================================================================
  // UYGULAMA DURUMU (APP STATE)
  // ==========================================================================
  const state = {
    allSongs: [...EMBEDDED_SONGS],
    filteredSongs: [...EMBEDDED_SONGS],
    currentIndex: -1,
    currentSong: null,
    isPlaying: false,
    isShuffle: false,
    repeatMode: 'off', // 'off' | 'all' | 'one'
    queue: [],
    favorites: new Set(JSON.parse(localStorage.getItem('kirkyama_favs') || '[]')),
    currentCategory: 'all',
    currentArtistFilter: null,
    currentAlbumFilter: null,
    albumSubFilter: 'all',
    currentTab: 'tracks', // 'tracks' | 'artists'
    searchQuery: '',
    playbackSpeed: 1,
    speedOptions: [0.75, 1, 1.25, 1.5, 2],
    volume: parseFloat(localStorage.getItem('kirkyama_volume') || '0.85'),
    isMuted: false,
    streamServerUrl: initialServerUrl,
    playMode: localStorage.getItem('kirkyama_play_mode') || 'auto',
    isStudyMode: false,
    isZenFocus: false,
    deferredPrompt: null
  };

  // ==========================================================================
  // DOM ELEMENTLERİ
  // ==========================================================================
  const audio = document.getElementById('audioEngine');

  // Çalar Elementleri
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playSvg = playPauseBtn.querySelector('.play-svg');
  const pauseSvg = playPauseBtn.querySelector('.pause-svg');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const repeatBtn = document.getElementById('repeatBtn');
  const repeatOneIndicator = document.getElementById('repeatOneIndicator');

  const progressBarContainer = document.getElementById('progressBarContainer');
  const progressPlayed = document.getElementById('progressPlayed');
  const progressBuffered = document.getElementById('progressBuffered');
  const progressSeek = document.getElementById('progressSeek');
  const currentTimeEl = document.getElementById('currentTime');
  const totalDurationEl = document.getElementById('totalDuration');

  const playerCover = document.getElementById('playerCover');
  const playerTitle = document.getElementById('playerTitle');
  const playerArtist = document.getElementById('playerArtist');
  const playerFavBtn = document.getElementById('playerFavBtn');

  const volumeBtn = document.getElementById('volumeBtn');
  const volumeHighIcon = document.getElementById('volumeHighIcon');
  const volumeMuteIcon = document.getElementById('volumeMuteIcon');
  const volumeSlider = document.getElementById('volumeSlider');
  const playbackSpeedBtn = document.getElementById('playbackSpeedBtn');

  // Sol Küratör Vitrini Elementleri
  const heroCover = document.getElementById('heroCover');
  const heroTitle = document.getElementById('heroTitle');
  const heroArtist = document.getElementById('heroArtist');
  const heroDesc = document.getElementById('heroDesc');
  const heroPlayBtn = document.getElementById('heroPlayBtn');
  const heroQueueBtn = document.getElementById('heroQueueBtn');
  const curatorEditionText = document.getElementById('curatorEditionText');

  // Sağ Repertuar Listesi & Sekmeler
  const songListEl = document.getElementById('songList');
  const emptyStateEl = document.getElementById('emptyState');
  const songCountEl = document.getElementById('songCount');
  const playAllBtn = document.getElementById('playAllBtn');

  // Sanatçı & Albüm Arşivi & Sekmeler
  const tabTracksView = document.getElementById('tabTracksView');
  const tabArtistsView = document.getElementById('tabArtistsView');
  const tabAlbumsView = document.getElementById('tabAlbumsView');
  const tracksViewWrapper = document.getElementById('tracksViewWrapper');
  const artistsViewWrapper = document.getElementById('artistsViewWrapper');
  const albumsViewWrapper = document.getElementById('albumsViewWrapper');
  const artistsGrid = document.getElementById('artistsGrid');
  const albumsGrid = document.getElementById('albumsGrid');
  const backToArtistsBtn = document.getElementById('backToArtistsBtn');
  const backToAlbumsBtn = document.getElementById('backToAlbumsBtn');
  const artistCountEl = document.getElementById('artistCount');
  const albumCountEl = document.getElementById('albumCount');
  const albumsFilterPills = document.getElementById('albumsFilterPills');

  // Arama & Rozetler (Masaüstü & Mobil)
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const mobileSearchToggleBtn = document.getElementById('mobileSearchToggleBtn');
  const mobileSearchTray = document.getElementById('mobileSearchTray');
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  const mobileSearchClearBtn = document.getElementById('mobileSearchClearBtn');
  const mobileSearchCancelBtn = document.getElementById('mobileSearchCancelBtn');
  const studyModeToggleBtn = document.getElementById('studyModeToggleBtn');
  const queueCountBadge = document.getElementById('queueCountBadge');

  // Çekmece (Queue Drawer)
  const queueDrawer = document.getElementById('queueDrawer');
  const toggleQueueBtn = document.getElementById('toggleQueueBtn');
  const closeQueueBtn = document.getElementById('closeQueueBtn');
  const clearQueueBtn = document.getElementById('clearQueueBtn');
  const queueDrawerBadge = document.getElementById('queueDrawerBadge');
  const queueNowPlaying = document.getElementById('queueNowPlaying');
  const queueItemsList = document.getElementById('queueItemsList');

  // Sunucu Durumu & Ayarlar
  const serverStatusIndicator = document.getElementById('serverStatusIndicator');
  const serverStatusTitle = document.getElementById('serverStatusTitle');
  const serverSettingsBtn = document.getElementById('serverSettingsBtn');
  const serverSettingsModal = document.getElementById('serverSettingsModal');
  const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const serverUrlInput = document.getElementById('serverUrlInput');
  const testServerBtn = document.getElementById('testServerBtn');
  const serverTestResult = document.getElementById('serverTestResult');

  // PWA & Aura
  const installPwaBtn = document.getElementById('installPwaBtn');
  const toastContainer = document.getElementById('toastContainer');
  const auraOrb1 = document.getElementById('auraOrb1');
  const auraOrb2 = document.getElementById('auraOrb2');

  // Apple Music & Spotify Tarzı Tam Ekran Now Playing (Mobil)
  const mobileNowPlayingScreen = document.getElementById('mobileNowPlayingScreen');
  const mnpBackdropImg = document.getElementById('mnpBackdropImg');
  const mnpCloseBtn = document.getElementById('mnpCloseBtn');
  const mnpHeaderCenter = document.getElementById('mnpHeaderCenter');
  const mnpHeaderCategory = document.getElementById('mnpHeaderCategory');
  const mnpQueueBtn = document.getElementById('mnpQueueBtn');
  const mnpQueueBadge = document.getElementById('mnpQueueBadge');
  const mnpArtworkWrapper = document.getElementById('mnpArtworkWrapper');
  const mnpArtworkImg = document.getElementById('mnpArtworkImg');
  const mnpTrackTitle = document.getElementById('mnpTrackTitle');
  const mnpTrackSubtitle = document.getElementById('mnpTrackSubtitle');
  const mnpFavBtn = document.getElementById('mnpFavBtn');
  const mnpScrubSlider = document.getElementById('mnpScrubSlider');
  const mnpScrubPlayed = document.getElementById('mnpScrubPlayed');
  const mnpScrubBuffered = document.getElementById('mnpScrubBuffered');
  const mnpTimeCur = document.getElementById('mnpTimeCur');
  const mnpTimeDur = document.getElementById('mnpTimeDur');
  const mnpShuffleBtn = document.getElementById('mnpShuffleBtn');
  const mnpPrevBtn = document.getElementById('mnpPrevBtn');
  const mnpPlayPauseBtn = document.getElementById('mnpPlayPauseBtn');
  const mnpPlayIcon = mnpPlayPauseBtn ? mnpPlayPauseBtn.querySelector('.mnp-play-icon') : null;
  const mnpPauseIcon = mnpPlayPauseBtn ? mnpPlayPauseBtn.querySelector('.mnp-pause-icon') : null;
  const mnpNextBtn = document.getElementById('mnpNextBtn');
  const mnpRepeatBtn = document.getElementById('mnpRepeatBtn');
  const mnpRepeatOne = document.getElementById('mnpRepeatOne');
  const mnpStoryToggleBtn = document.getElementById('mnpStoryToggleBtn');
  const mnpStorySheet = document.getElementById('mnpStorySheet');
  const mnpStoryCloseBtn = document.getElementById('mnpStoryCloseBtn');
  const mnpStoryBody = document.getElementById('mnpStoryBody');
  const mnpViewArtistBtn = document.getElementById('mnpViewArtistBtn');
  const bottomPlayer = document.getElementById('bottomPlayer');
  const swissPlayerTrigger = document.getElementById('swissPlayerTrigger');

  // Zen Odaklanma Modu (Minimalist Tam Karartma)
  const zenFocusScreen = document.getElementById('zenFocusScreen');
  const zenCloseBtn = document.getElementById('zenCloseBtn');
  const zenSongTitle = document.getElementById('zenSongTitle');
  const zenSongArtist = document.getElementById('zenSongArtist');
  const zenProgressBar = document.getElementById('zenProgressBar');
  const zenProgressPlayed = document.getElementById('zenProgressPlayed');
  const zenTimeCur = document.getElementById('zenTimeCur');
  const zenTimeDur = document.getElementById('zenTimeDur');
  const zenPrevBtn = document.getElementById('zenPrevBtn');
  const zenPlayPauseBtn = document.getElementById('zenPlayPauseBtn');
  const zenPlayIcon = zenPlayPauseBtn ? zenPlayPauseBtn.querySelector('.zen-play-icon') : null;
  const zenPauseIcon = zenPlayPauseBtn ? zenPlayPauseBtn.querySelector('.zen-pause-icon') : null;
  const zenNextBtn = document.getElementById('zenNextBtn');

  // ==========================================================================
  // BAŞLATMA
  // ==========================================================================
  async function init() {
    setupEventListeners();
    setupMediaSession();
    registerServiceWorker();
    initAudioEngine();

    // 1. Önce gömülü veriyi derhal render et
    if (state.allSongs.length > 0) {
      setupFeature(state.allSongs[0]);
      updateMobileNowPlayingUI(state.allSongs[0]);
      renderSongList();
    }

    // 2. Eğer web sunucusu altındaysak güncel songs.json'ı yükle
    try {
      const response = await fetch('./songs.json');
      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json) && json.length > 0) {
          state.allSongs = json;
          state.filteredSongs = [...json];
          setupFeature(state.allSongs[0]);
          updateMobileNowPlayingUI(state.allSongs[0]);
          renderSongList();
        }
      }
    } catch (err) {
      console.warn('Yerel songs.json çekilemedi, gömülü liste kullanılıyor:', err.message);
    }

    renderArtistsGrid();
    renderAlbumsGrid();
    if (artistCountEl) artistCountEl.textContent = ARTISTS_CATALOG.length;
    if (albumCountEl) albumCountEl.textContent = ALBUMS_CATALOG.length;
    checkServerHealthQuiet();
  }

  // ==========================================================================
  // AUDIO MOTORU & DAYANIKLILIK (OTOMATİK KURTARMA & ÖN ISITMA)
  // ==========================================================================
  const audioRecovery = {
    loadToken: 0,
    retryCount: 0,
    consecutiveFailures: 0,
    stallTimer: null,
    lastProgressTime: 0,
    wantsToPlay: false,
    prewarmedMsgIds: new Set(),
    nextShuffleCandidate: null,
    pendingResumeTime: 0
  };

  function clearStallTimer() {
    if (audioRecovery.stallTimer) {
      clearTimeout(audioRecovery.stallTimer);
      audioRecovery.stallTimer = null;
    }
  }

  function armStallTimer(expectedToken) {
    if (audioRecovery.stallTimer) return;
    audioRecovery.stallTimer = setTimeout(() => {
      audioRecovery.stallTimer = null;
      if (expectedToken !== audioRecovery.loadToken) return;
      if (!audioRecovery.wantsToPlay || audio.paused || audio.ended) return;

      console.warn('[Audio Stall] 15 saniyedir akış ilerlemedi, yeniden bağlanılıyor...');
      recoverCurrentTrack('Akış yavaşladı, bağlantı yenileniyor...');
    }, 15000);
  }

  function buildStreamUrl(song, cacheBust = '') {
    const serverUrl = (state.streamServerUrl || LIVE_RENDER_URL).replace(/\/+$/, '');
    const effectiveMsgId = song.messageId || song.telegramMsgId;
    let url = '';

    if (state.playMode === 'demoOnly') {
      url = song.demoAudio || song.url || (effectiveMsgId ? `${serverUrl}/stream/${effectiveMsgId}` : '');
    } else {
      if (effectiveMsgId) {
        url = `${serverUrl}/stream/${effectiveMsgId}`;
      } else if (song.demoAudio) {
        url = song.demoAudio;
      } else if (song.url) {
        url = song.url;
      }
    }

    if (url && cacheBust) {
      url += (url.includes('?') ? '&' : '?') + cacheBust;
    }
    return url;
  }

  function getUpcomingSongCandidate() {
    if (state.queue.length > 0) {
      return state.queue[0];
    }
    const list = state.filteredSongs.length > 0 ? state.filteredSongs : state.allSongs;
    if (list.length === 0) return null;

    if (state.isShuffle) {
      if (!audioRecovery.nextShuffleCandidate || (state.currentSong && audioRecovery.nextShuffleCandidate.id === state.currentSong.id && list.length > 1)) {
        let idx = Math.floor(Math.random() * list.length);
        if (state.currentSong && list[idx].id === state.currentSong.id && list.length > 1) {
          idx = (idx + 1) % list.length;
        }
        audioRecovery.nextShuffleCandidate = list[idx];
      }
      return audioRecovery.nextShuffleCandidate;
    }

    const currentListIndex = list.findIndex(s => s.id === (state.currentSong ? state.currentSong.id : -1));
    let nextIndex = currentListIndex + 1;
    if (nextIndex >= list.length) {
      if (state.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return null;
      }
    }
    return list[nextIndex];
  }

  function prewarmNextTrack() {
    const nextSong = getUpcomingSongCandidate();
    if (!nextSong) return;
    const msgId = nextSong.messageId || nextSong.telegramMsgId;
    if (!msgId || audioRecovery.prewarmedMsgIds.has(msgId)) return;

    audioRecovery.prewarmedMsgIds.add(msgId);
    if (audioRecovery.prewarmedMsgIds.size > 40) {
      const oldest = audioRecovery.prewarmedMsgIds.values().next().value;
      audioRecovery.prewarmedMsgIds.delete(oldest);
    }

    const url = buildStreamUrl(nextSong);
    if (!url) return;

    fetch(url, {
      headers: { Range: 'bytes=0-131071' },
      signal: AbortSignal.timeout(12000)
    }).catch(() => {
      audioRecovery.prewarmedMsgIds.delete(msgId);
    });
  }

  function recoverCurrentTrack(toastMsg) {
    const song = state.currentSong;
    if (!song) return;

    if (audioRecovery.retryCount >= 3) {
      handleUnrecoverableTrack(song, 'Bağlantı zaman aşımına uğradı');
      return;
    }

    audioRecovery.retryCount += 1;
    const resumePos = (!isNaN(audio.currentTime) && audio.currentTime > 2) ? audio.currentTime : 0;
    audioRecovery.pendingResumeTime = resumePos;
    const token = ++audioRecovery.loadToken;

    if (toastMsg) {
      showToast(`${toastMsg} (${audioRecovery.retryCount}/3)`, 'info');
    }

    const retryUrl = buildStreamUrl(song, `retry=${audioRecovery.retryCount}&t=${Date.now()}`);
    audio.src = retryUrl;
    audio.load();
    audio.play().catch(err => {
      if (token === audioRecovery.loadToken) {
        console.warn('[Recover Play Hatası]:', err);
      }
    });
  }

  function handleUnrecoverableTrack(song, reason) {
    clearStallTimer();
    audioRecovery.consecutiveFailures += 1;
    audioRecovery.retryCount = 0;
    audioRecovery.pendingResumeTime = 0;

    if (audioRecovery.consecutiveFailures >= 5) {
      audioRecovery.wantsToPlay = false;
      updatePlayPauseUI(false);
      updateZenPlayPauseIcon(false);
      showToast('Arka arkaya 5 parça yüklenemedi. İnternet bağlantınızı veya formatı kontrol edin.', 'error');
      return;
    }

    showToast(`"${song.title}" atlanıyor (${reason})...`, 'info');
    const tokenAtSchedule = audioRecovery.loadToken;
    setTimeout(() => {
      if (tokenAtSchedule === audioRecovery.loadToken && audioRecovery.wantsToPlay) {
        playNextSong();
      }
    }, 900);
  }

  function initAudioEngine() {
    audio.volume = state.volume;
    volumeSlider.value = state.volume;

    audio.addEventListener('loadedmetadata', () => {
      audio.playbackRate = state.playbackSpeed;
      if (audioRecovery.pendingResumeTime > 2 && !isNaN(audio.duration) && audioRecovery.pendingResumeTime < audio.duration - 2) {
        try {
          audio.currentTime = audioRecovery.pendingResumeTime;
        } catch (_) {}
      }
      audioRecovery.pendingResumeTime = 0;
    });

    audio.addEventListener('playing', () => {
      clearStallTimer();
      audioRecovery.retryCount = 0;
      audioRecovery.consecutiveFailures = 0;
      audio.playbackRate = state.playbackSpeed;
      updateServerStatusUI('connected');
    });

    audio.addEventListener('timeupdate', () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        if (Math.abs(audio.currentTime - audioRecovery.lastProgressTime) > 0.25) {
          audioRecovery.lastProgressTime = audio.currentTime;
          clearStallTimer();
        }

        // Parçanın %70'ine gelindiğinde veya son 25 saniyede bir sonraki şarkıyı önceden ısıt
        const remaining = audio.duration - audio.currentTime;
        if (audio.currentTime > 6 && (remaining <= 25 || (audio.currentTime / audio.duration) >= 0.7)) {
          prewarmNextTrack();
        }

        const percent = (audio.currentTime / audio.duration) * 100;
        progressPlayed.style.width = `${percent}%`;
        progressSeek.value = percent;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalDurationEl.textContent = formatTime(audio.duration);

        // Apple Music & Spotify Tarzı Tam Ekran Çalar Senkronizasyonu
        if (mnpScrubPlayed) mnpScrubPlayed.style.width = `${percent}%`;
        if (mnpScrubSlider) mnpScrubSlider.value = percent;
        if (mnpTimeCur) mnpTimeCur.textContent = formatTime(audio.currentTime);
        if (mnpTimeDur) mnpTimeDur.textContent = formatTime(audio.duration);

        // Zen Odaklanma Modu Senkronizasyonu
        if (zenProgressPlayed) zenProgressPlayed.style.width = `${percent}%`;
        if (zenTimeCur) zenTimeCur.textContent = formatTime(audio.currentTime);
        if (zenTimeDur) zenTimeDur.textContent = formatTime(audio.duration);

        updateMediaSessionPosition();
      }
    });

    audio.addEventListener('progress', () => {
      if (audio.buffered.length > 0 && !isNaN(audio.duration)) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const percent = (bufferedEnd / audio.duration) * 100;
        progressBuffered.style.width = `${percent}%`;
        if (mnpScrubBuffered) mnpScrubBuffered.style.width = `${percent}%`;
      }
    });

    audio.addEventListener('waiting', () => {
      if (audioRecovery.wantsToPlay && !audio.paused) {
        armStallTimer(audioRecovery.loadToken);
      }
    });

    audio.addEventListener('stalled', () => {
      if (audioRecovery.wantsToPlay && !audio.paused) {
        armStallTimer(audioRecovery.loadToken);
      }
    });

    audio.addEventListener('ended', () => {
      clearStallTimer();
      if (state.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(e => console.error(e));
      } else {
        playNextSong();
      }
    });

    audio.addEventListener('play', () => {
      state.isPlaying = true;
      updatePlayPauseUI(true);
      updateZenPlayPauseIcon(true);
      renderPlayingState();
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
    });

    audio.addEventListener('pause', () => {
      clearStallTimer();
      state.isPlaying = false;
      updatePlayPauseUI(false);
      updateZenPlayPauseIcon(false);
      renderPlayingState();
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
    });

    audio.addEventListener('error', async () => {
      clearStallTimer();
      const song = state.currentSong;
      const code = audio.error ? audio.error.code : 0;
      const tokenAtError = audioRecovery.loadToken;
      const failedSrc = audio.src;
      console.warn('[Audio Hatası]:', code, 'Kaynak:', failedSrc);

      if (!song || !audioRecovery.wantsToPlay) {
        updatePlayPauseUI(false);
        return;
      }

      // Kaynağı HEAD isteğiyle hızlıca teşhis et (desteklenmeyen format vs sunucu uyanması)
      let headStatus = 0;
      let headContentType = '';
      try {
        const probe = await fetch(failedSrc, {
          method: 'HEAD',
          signal: AbortSignal.timeout(8000)
        });
        headStatus = probe.status;
        headContentType = (probe.headers.get('content-type') || '').toLowerCase();
      } catch (_) {
        headStatus = 0;
      }

      if (tokenAtError !== audioRecovery.loadToken || !audioRecovery.wantsToPlay) return;

      // 1. Tarayıcının çözemediği format (ör. audio/x-ms-wma) -> Beklemeden sonraki şarkıya geç
      if (headStatus === 200 && headContentType && (headContentType.includes('wma') || headContentType.includes('asf') || (audio.canPlayType && audio.canPlayType(headContentType) === ''))) {
        handleUnrecoverableTrack(song, 'tarayıcı bu ses formatını desteklemiyor');
        return;
      }

      // 2. Render uyanıyor (502/503) veya geçici sunucu/ağ hatası -> kademeli bekleme ile yeniden dene
      if (audioRecovery.retryCount < 3) {
        audioRecovery.retryCount += 1;
        const waitMs = audioRecovery.retryCount * 2200;
        const msg = (headStatus === 503 || headStatus === 502 || headStatus === 0)
          ? `Yayın sunucusu hazırlanıyor, tekrar deneniyor (${audioRecovery.retryCount}/3)...`
          : `Bağlantı yenileniyor (${audioRecovery.retryCount}/3)...`;
        showToast(msg, 'info');

        setTimeout(() => {
          if (tokenAtError !== audioRecovery.loadToken || !audioRecovery.wantsToPlay) return;
          const retryUrl = buildStreamUrl(song, `retry=${audioRecovery.retryCount}&t=${Date.now()}`);
          audio.src = retryUrl;
          audio.load();
          audio.play().catch(() => {});
        }, waitMs);
        return;
      }

      // 3. 3 deneme sonunda hâlâ açılmadıysa akışı durdurma, sonraki şarkıya geç
      handleUnrecoverableTrack(song, `yükleme hatası (Kod: ${code})`);
    });

    // Arka plan sekmesi uyutulduysa sekme tekrar görünür olduğunda çalmayı sürdür
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && audioRecovery.wantsToPlay && audio.paused && !audio.ended && state.currentSong) {
        audio.play().catch(() => {});
      }
    });
  }

  // ==========================================================================
  // ŞARKI YÜKLEME VE ÇALMA
  // ==========================================================================
  function playSong(song, autoPlay = true) {
    if (!song) return;

    clearStallTimer();
    const token = ++audioRecovery.loadToken;
    audioRecovery.retryCount = 0;
    audioRecovery.pendingResumeTime = 0;
    audioRecovery.lastProgressTime = 0;
    audioRecovery.wantsToPlay = !!autoPlay;
    audioRecovery.nextShuffleCandidate = null;

    state.currentSong = song;
    state.currentIndex = state.allSongs.findIndex(s => s.id === song.id);

    const audioSrc = buildStreamUrl(song);

    audio.src = audioSrc;
    audio.load();
    audio.playbackRate = state.playbackSpeed;

    // Alt Swiss Player Bilgilerini Güncelle
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    playerCover.src = song.cover;
    currentTimeEl.textContent = '00:00';
    totalDurationEl.textContent = song.duration || '00:00';
    progressPlayed.style.width = '0%';
    progressBuffered.style.width = '0%';
    progressSeek.value = 0;

    // Sol Küratör Vitrini & Hikayeyi Güncelle
    setupFeature(song);

    // Apple Music & Spotify Tarzı Tam Ekran Çaları Güncelle
    updateMobileNowPlayingUI(song);

    // Zen Odaklanma Ekranı Güncelle
    updateZenFocusUI(song);

    // Dinamik Işık Aurasını Güncelle
    updateEditorialAura(song);

    // Favori Durumu
    updatePlayerFavButton();

    // Kuyruk Paneli
    renderQueueNowPlaying();

    // Media Session
    updateMediaSessionMetadata(song);

    if (autoPlay) {
      armStallTimer(token);
      showToast(`"${song.title}" çalınıyor...`, 'info');
      audio.play().then(() => {
        if (token === audioRecovery.loadToken) {
          console.log('[Play] Akış başladı:', audio.src);
        }
      }).catch(err => {
        if (token !== audioRecovery.loadToken) return;
        if (err && err.name === 'AbortError') return; // Kullanıcı hızlıca başka şarkıya geçti
        console.warn('Oynatma tarayıcı politikasına takıldı:', err);
        if (err && err.name === 'NotAllowedError') {
          audioRecovery.wantsToPlay = false;
          clearStallTimer();
          updatePlayPauseUI(false);
          showToast('Tarayıcı otomatik oynatmayı duraklattı, devam etmek için Çal butonuna dokunun.', 'info');
        }
      });
    }

    renderPlayingState();
  }

  function togglePlayPause() {
    if (!state.currentSong) {
      if (state.filteredSongs.length > 0) {
        playSong(state.filteredSongs[0], true);
      }
      return;
    }

    if (audio.paused) {
      audioRecovery.wantsToPlay = true;
      audio.play().catch(e => console.error('Play hatası:', e));
    } else {
      audioRecovery.wantsToPlay = false;
      clearStallTimer();
      audio.pause();
    }
  }

  function playNextSong() {
    if (state.queue.length > 0) {
      const nextFromQueue = state.queue.shift();
      updateQueueUI();
      playSong(nextFromQueue, true);
      return;
    }

    const list = state.filteredSongs.length > 0 ? state.filteredSongs : state.allSongs;
    if (list.length === 0) return;

    if (state.isShuffle) {
      const candidate = audioRecovery.nextShuffleCandidate && list.some(s => s.id === audioRecovery.nextShuffleCandidate.id)
        ? audioRecovery.nextShuffleCandidate
        : list[Math.floor(Math.random() * list.length)];
      playSong(candidate, true);
      return;
    }

    const currentListIndex = list.findIndex(s => s.id === (state.currentSong ? state.currentSong.id : -1));
    let nextIndex = currentListIndex + 1;

    if (nextIndex >= list.length) {
      if (state.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        audioRecovery.wantsToPlay = false;
        audio.pause();
        return;
      }
    }

    playSong(list[nextIndex], true);
  }

  function playPrevSong() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    const list = state.filteredSongs.length > 0 ? state.filteredSongs : state.allSongs;
    if (list.length === 0) return;

    const currentListIndex = list.findIndex(s => s.id === (state.currentSong ? state.currentSong.id : -1));
    let prevIndex = currentListIndex - 1;

    if (prevIndex < 0) {
      prevIndex = list.length - 1;
    }

    playSong(list[prevIndex], true);
  }

  function updatePlayPauseUI(playing) {
    if (playing) {
      playSvg.style.display = 'none';
      pauseSvg.style.display = 'block';
      if (mnpPlayIcon) mnpPlayIcon.style.display = 'none';
      if (mnpPauseIcon) mnpPauseIcon.style.display = 'block';
      if (mobileNowPlayingScreen) mobileNowPlayingScreen.classList.add('playing');
    } else {
      playSvg.style.display = 'block';
      pauseSvg.style.display = 'none';
      if (mnpPlayIcon) mnpPlayIcon.style.display = 'block';
      if (mnpPauseIcon) mnpPauseIcon.style.display = 'none';
      if (mobileNowPlayingScreen) mobileNowPlayingScreen.classList.remove('playing');
    }
  }

  function updateMobileNowPlayingUI(song) {
    if (!song || !mobileNowPlayingScreen) return;
    const coverUrl = song.cover || 'assets/logo.svg';
    if (mnpBackdropImg) mnpBackdropImg.src = coverUrl;
    if (mnpArtworkImg) mnpArtworkImg.src = coverUrl;
    if (mnpTrackTitle) mnpTrackTitle.textContent = song.title;
    if (mnpTrackSubtitle) mnpTrackSubtitle.textContent = `${song.artist} • ${song.album || 'Radyo Kırkyama'}`;
    if (mnpHeaderCategory) mnpHeaderCategory.textContent = (song.categoryTitle || 'ŞU AN ÇALINIYOR').toUpperCase();

    // Sanatçı Hakkında Kartını Doldur
    if (mnpStoryBody) {
      const matched = ARTISTS_CATALOG.find(a =>
        song.artist.toLowerCase().includes(a.filterKey.toLowerCase()) ||
        a.name.toLowerCase().includes(song.artist.toLowerCase())
      );
      const artistAvatar = matched && matched.avatar ? matched.avatar : coverUrl;
      const artistGenre = matched && matched.genre ? matched.genre : (song.categoryTitle || 'Özel Koleksiyon');
      const artistBio = matched && matched.story ? matched.story : (song.story || `${song.artist}, Boğaziçi Koleji müzik arşivinin seçkin kayıtları arasında yer almaktadır.`);

      mnpStoryBody.innerHTML = `
        <div class="mnp-artist-profile">
          <img class="mnp-artist-avatar" src="${artistAvatar}" alt="${song.artist}">
          <div class="mnp-artist-info">
            <h5 class="mnp-artist-name">${song.artist}</h5>
            <span class="mnp-artist-genre">${artistGenre}</span>
          </div>
        </div>
        <div class="mnp-artist-bio">
          ${artistBio}
        </div>
      `;
    }

    if (mnpTimeCur) mnpTimeCur.textContent = '00:00';
    if (mnpTimeDur) mnpTimeDur.textContent = song.duration || '00:00';
    if (mnpScrubPlayed) mnpScrubPlayed.style.width = '0%';
    if (mnpScrubBuffered) mnpScrubBuffered.style.width = '0%';
    if (mnpScrubSlider) mnpScrubSlider.value = 0;
    updatePlayerFavButton();
    syncMnpControls();
  }

  function syncMnpControls() {
    if (mnpShuffleBtn) {
      mnpShuffleBtn.classList.toggle('active', !!state.isShuffle);
    }
    if (mnpRepeatBtn && mnpRepeatOne) {
      if (state.repeatMode === 'one') {
        mnpRepeatBtn.classList.add('active');
        mnpRepeatOne.classList.add('show');
      } else if (state.repeatMode === 'all') {
        mnpRepeatBtn.classList.add('active');
        mnpRepeatOne.classList.remove('show');
      } else {
        mnpRepeatBtn.classList.remove('active');
        mnpRepeatOne.classList.remove('show');
      }
    }
    if (mnpQueueBadge) {
      mnpQueueBadge.textContent = state.queue.length;
    }
  }

  // ==========================================================================
  // SOL SÜTUN KÜRATÖR VİTRİNİ & LINER NOTES
  // ==========================================================================
  function setupFeature(song) {
    if (!song) return;
    heroTitle.textContent = song.title;
    heroArtist.textContent = `${song.artist} • ${song.album || 'Özel Koleksiyon'}`;
    heroCover.src = song.cover;
    heroDesc.textContent = song.story || `${song.title}, Boğaziçi Koleji müzik arşivinin seçkin kayıtları arasında yer almaktadır.`;
    curatorEditionText.textContent = (song.categoryTitle || 'KÜRATÖR VİTRİNİ').toUpperCase();

    heroPlayBtn.onclick = () => {
      playSong(song, true);
    };

    heroQueueBtn.onclick = () => {
      addToQueue(song);
    };
  }

  function updateEditorialAura(song) {
    if (!auraOrb1 || !auraOrb2) return;
    const c1 = song.aura1 || 'rgba(212, 163, 115, 0.2)';
    const c2 = song.aura2 || 'rgba(99, 102, 241, 0.15)';
    auraOrb1.style.background = c1;
    auraOrb2.style.background = c2;
  }

  // ==========================================================================
  // SAĞ SÜTUN REPERTUAR İNDEKSİ (ŞARKI LİSTESİ)
  // ==========================================================================
  function renderSongList() {
    songListEl.innerHTML = '';
    const list = state.filteredSongs;
    songCountEl.textContent = list.length;

    if (list.length === 0) {
      emptyStateEl.style.display = 'block';
      return;
    }
    emptyStateEl.style.display = 'none';

    list.forEach((song, index) => {
      const isCurrent = state.currentSong && state.currentSong.id === song.id;
      const isLiked = state.favorites.has(song.id);
      const rowNum = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;

      const row = document.createElement('div');
      row.className = `track-manuscript-row ${isCurrent ? 'playing' : ''}`;
      row.dataset.id = song.id;

      row.innerHTML = `
        <div class="row-index-cell">
          <span class="row-num-text">${rowNum}</span>
          <svg class="row-mini-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          <div class="row-mini-bars">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div class="row-title-cell">
          <img src="${song.cover}" alt="${song.title}" class="row-stamp-cover" loading="lazy">
          <div class="row-titles-wrap">
            <span class="row-primary-title">${song.title}</span>
            <span class="row-composer-name">${song.artist}</span>
          </div>
        </div>

        <div class="row-album-cell">${song.album || 'Koleksiyon'}</div>

        <div class="row-genre-cell">
          <span class="edition-tag-mini">${song.categoryTitle || 'Kuşak'}</span>
        </div>

        <div class="row-time-cell">${song.duration || '03:00'}</div>

        <div class="row-actions-cell">
          <button class="action-glyph ${isLiked ? 'liked' : ''}" data-action="favorite" title="Favorilere Ekle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLiked ? '#ef4444' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button class="action-glyph" data-action="queue" title="Sıraya Ekle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      `;

      row.addEventListener('click', (e) => {
        // Favori ve Kuyruk Eylemleri
        const actionBtn = e.target.closest('.action-glyph');
        if (actionBtn) {
          e.stopPropagation();
          const action = actionBtn.dataset.action;
          if (action === 'favorite') {
            toggleFavorite(song.id);
          } else if (action === 'queue') {
            addToQueue(song);
          }
          return;
        }

        // Şarkının herhangi bir yerine dokunulduğunda TEK DOKUNUŞTA OYNAT!
        const isCurrentNow = state.currentSong && state.currentSong.id === song.id;
        if (isCurrentNow) {
          togglePlayPause();
        } else {
          playSong(song, true);
        }
      });

      songListEl.appendChild(row);
    });
  }

  function renderPlayingState() {
    const rows = songListEl.querySelectorAll('.track-manuscript-row');
    rows.forEach(r => {
      const id = parseInt(r.dataset.id, 10);
      if (state.currentSong && state.currentSong.id === id) {
        r.classList.add('playing');
      } else {
        r.classList.remove('playing');
      }
    });
  }

  // ==========================================================================
  // SANATÇI ARŞİVİ & MONOGRAFİ YÖNETİMİ
  // ==========================================================================
  function setupFeatureForArtist(artist) {
    if (!artist) return;
    heroTitle.textContent = artist.name;
    heroArtist.textContent = artist.genre + (artist.years ? ' • ' + artist.years : '');
    heroCover.src = artist.avatar;
    heroDesc.textContent = artist.story || (artist.name + ', Boğaziçi Koleji müzik dergisinin özel monografi arşivinde yer almaktadır.');
    curatorEditionText.textContent = 'SANATÇI MONOGRAFİSİ • ARŞİV DOSYASI';

    if (auraOrb1 && auraOrb2) {
      auraOrb1.style.background = artist.aura1 || 'rgba(212, 163, 115, 0.22)';
      auraOrb2.style.background = artist.aura2 || 'rgba(180, 83, 9, 0.18)';
    }

    heroPlayBtn.onclick = () => {
      const artistTracks = state.allSongs.filter(s =>
        (s.artist || '').toLowerCase().includes(artist.filterKey.toLowerCase()) ||
        (s.composer || '').toLowerCase().includes(artist.filterKey.toLowerCase())
      );
      if (artistTracks.length > 0) {
        playSong(artistTracks[0], true);
      } else {
        showToast(artist.name + ' diskografisi yakında Telegram kanalımıza eklenecektir.', 'info');
      }
    };

    heroQueueBtn.onclick = () => {
      const artistTracks = state.allSongs.filter(s =>
        (s.artist || '').toLowerCase().includes(artist.filterKey.toLowerCase())
      );
      if (artistTracks.length > 0) {
        artistTracks.forEach(s => addToQueue(s));
        showToast(artistTracks.length + ' eser kuyruğa eklendi.', 'success');
      } else {
        showToast('Kuyruğa eklenecek kayıt bulunamadı.', 'info');
      }
    };
  }

  function renderArtistsGrid() {
    if (!artistsGrid) return;
    artistsGrid.innerHTML = '';
    if (artistCountEl) artistCountEl.textContent = ARTISTS_CATALOG.length;

    ARTISTS_CATALOG.forEach(artist => {
      const tracksCount = state.allSongs.filter(s =>
        (s.artist || '').toLowerCase().includes(artist.filterKey.toLowerCase()) ||
        (s.composer || '').toLowerCase().includes(artist.filterKey.toLowerCase())
      ).length;

      const card = document.createElement('div');
      card.className = 'artist-card-box';
      card.dataset.id = artist.id;

      card.innerHTML = [
        '<img class="artist-avatar-circle" src="' + artist.avatar + '" alt="' + artist.name + '" loading="lazy">',
        '<h3 class="artist-card-name">' + artist.name + '</h3>',
        '<span class="artist-card-genre">' + artist.genre + '</span>',
        '<span class="artist-card-pill">' + (tracksCount > 0 ? tracksCount + ' Eser Kayıtlı' : 'Kült Koleksiyon') + '</span>'
      ].join('');

      card.addEventListener('click', () => {
        selectArtist(artist);
      });

      artistsGrid.appendChild(card);
    });
  }

  function selectArtist(artist) {
    state.currentArtistFilter = artist;
    state.currentAlbumFilter = null;
    switchView('tracks');
    setupFeatureForArtist(artist);
    filterSongs();
    if (backToArtistsBtn) {
      backToArtistsBtn.style.display = 'inline-flex';
    }
    if (backToAlbumsBtn) {
      backToAlbumsBtn.style.display = 'none';
    }
    showToast(artist.name + ' monografisi ve diskografisi açıldı.', 'info');
  }

  function setupFeatureForAlbum(album) {
    if (!heroCover) return;
    heroCover.src = album.cover;
    if (curatorEditionText) {
      curatorEditionText.innerHTML = (album.sub === 'soundtrack' ? '🎬 SOUNDTRACK &bull; FİLM SKORU' : 'SEVDİĞİM ALBÜMLER &bull; KÜLT PLAK');
    }
    heroTitle.textContent = album.title;
    heroArtist.textContent = album.artist + ' (' + album.year + ')';
    heroDesc.textContent = album.story;

    if (auraOrb1 && auraOrb2) {
      auraOrb1.style.background = album.aura1 || 'rgba(212, 163, 115, 0.26)';
      auraOrb2.style.background = album.aura2 || 'rgba(180, 83, 9, 0.2)';
    }

    heroPlayBtn.onclick = () => {
      const albumTracks = state.filteredSongs;
      if (albumTracks.length > 0) {
        playSong(albumTracks[0], true);
      } else {
        showToast(album.title + ' eserleri yükleniyor...', 'info');
      }
    };

    heroQueueBtn.onclick = () => {
      const albumTracks = state.filteredSongs;
      if (albumTracks.length > 0) {
        albumTracks.forEach(s => addToQueue(s));
        showToast(albumTracks.length + ' eser kuyruğa eklendi.', 'success');
      } else {
        showToast('Kuyruğa eklenecek kayıt bulunamadı.', 'info');
      }
    };
  }

  function matchSongToAlbum(song, album) {
    if (!song || !album) return false;
    const albumNorm = normalizeSearchText(album.filterKey || album.title || '');
    const artistTokens = normalizeSearchText(album.artist || '').split(/\s+/).filter(t => t.length > 2);
    const sAlbum = normalizeSearchText(song.album || '');
    const sTitle = normalizeSearchText(song.title || '');
    const sArtist = normalizeSearchText(song.artist || '');

    const isCompilation = album.isCompilation || (album.artist && (album.artist.toLowerCase().includes('çeşitli') || album.artist.toLowerCase().includes('various')));
    const artistMatches = (album.sub === 'soundtrack') || isCompilation || (artistTokens.length === 0) || artistTokens.some(token => sArtist.includes(token));

    let albumMatches = false;
    if (albumNorm.length <= 2) {
      albumMatches = sAlbum === albumNorm;
    } else {
      albumMatches = sAlbum.includes(albumNorm) || sTitle.includes(albumNorm);
    }

    return artistMatches && albumMatches;
  }

  function renderAlbumsGrid() {
    if (!albumsGrid) return;
    albumsGrid.innerHTML = '';
    if (albumCountEl) albumCountEl.textContent = ALBUMS_CATALOG.length;

    const currentSub = state.albumSubFilter || 'all';
    const filteredAlbums = currentSub === 'all'
      ? ALBUMS_CATALOG
      : ALBUMS_CATALOG.filter(a => a.sub === currentSub);

    if (filteredAlbums.length === 0) {
      albumsGrid.innerHTML = [
        '<div class="empty-state-editorial" style="grid-column: 1 / -1; padding: 56px 20px; text-align: center;">',
          '<p style="font-family: var(--serif); font-size: 1.25rem; font-style: italic; color: var(--text-pure); margin-bottom: 8px;">Bu kategoriye henüz albüm eklenmedi.</p>',
          '<p style="font-size: 0.88rem; color: var(--text-muted); font-family: var(--sans);">Ekleyeceğiniz yeni albümler ve müzik kayıtları burada sergilenecektir.</p>',
        '</div>'
      ].join('');
      return;
    }

    filteredAlbums.forEach(album => {
      const tracksCount = state.allSongs.filter(s => matchSongToAlbum(s, album)).length;

      const card = document.createElement('div');
      card.className = 'album-card-box';
      card.dataset.id = album.id;

      const isSoundtrack = album.sub === 'soundtrack';
      const badgeClass = isSoundtrack ? 'album-cover-badge soundtrack' : 'album-cover-badge';
      const badgeText = album.badge || (isSoundtrack ? '🎬 Soundtrack' : 'Kült Plak');

      card.innerHTML = [
        '<div class="album-cover-stage">',
          '<img class="album-cover-img" src="' + album.cover + '" alt="' + album.title + '" loading="lazy">',
          '<div class="' + badgeClass + '">' + badgeText + '</div>',
          '<div class="album-play-overlay">',
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
          '</div>',
        '</div>',
        '<div class="album-card-info">',
          '<h3 class="album-card-title">' + album.title + '</h3>',
          '<p class="album-card-artist">' + album.artist + '</p>',
          '<div class="album-card-meta">',
            '<span class="album-card-year">' + album.year + '</span>',
            '<span class="album-card-dot">•</span>',
            '<span class="album-card-count">' + (tracksCount > 0 ? tracksCount + ' Eser' : 'Özel Seçki') + '</span>',
          '</div>',
        '</div>'
      ].join('');

      card.addEventListener('click', () => {
        selectAlbum(album);
      });

      albumsGrid.appendChild(card);
    });
  }

  function selectAlbum(album) {
    state.currentAlbumFilter = album;
    state.currentArtistFilter = null;
    switchView('tracks');
    filterSongs();
    setupFeatureForAlbum(album);
    if (backToAlbumsBtn) {
      backToAlbumsBtn.style.display = 'inline-flex';
    }
    if (backToArtistsBtn) {
      backToArtistsBtn.style.display = 'none';
    }
    showToast(album.title + ' albümü açıldı (' + state.filteredSongs.length + ' eser).', 'info');
  }

  function switchView(viewName) {
    state.currentTab = viewName;
    if (viewName === 'tracks') {
      if (tabTracksView) tabTracksView.classList.add('active');
      if (tabArtistsView) tabArtistsView.classList.remove('active');
      if (tabAlbumsView) tabAlbumsView.classList.remove('active');

      if (tracksViewWrapper) tracksViewWrapper.style.display = 'block';
      if (artistsViewWrapper) artistsViewWrapper.style.display = 'none';
      if (albumsViewWrapper) albumsViewWrapper.style.display = 'none';

      if (playAllBtn) playAllBtn.style.display = 'inline-flex';
      if (backToArtistsBtn) {
        backToArtistsBtn.style.display = state.currentArtistFilter ? 'inline-flex' : 'none';
      }
      if (backToAlbumsBtn) {
        backToAlbumsBtn.style.display = state.currentAlbumFilter ? 'inline-flex' : 'none';
      }
    } else if (viewName === 'artists') {
      if (tabTracksView) tabTracksView.classList.remove('active');
      if (tabArtistsView) tabArtistsView.classList.add('active');
      if (tabAlbumsView) tabAlbumsView.classList.remove('active');

      if (tracksViewWrapper) tracksViewWrapper.style.display = 'none';
      if (artistsViewWrapper) artistsViewWrapper.style.display = 'block';
      if (albumsViewWrapper) albumsViewWrapper.style.display = 'none';

      if (backToArtistsBtn) backToArtistsBtn.style.display = 'none';
      if (backToAlbumsBtn) backToAlbumsBtn.style.display = 'none';
      if (playAllBtn) playAllBtn.style.display = 'none';
      renderArtistsGrid();
    } else if (viewName === 'albums') {
      if (tabTracksView) tabTracksView.classList.remove('active');
      if (tabArtistsView) tabArtistsView.classList.remove('active');
      if (tabAlbumsView) tabAlbumsView.classList.add('active');

      if (tracksViewWrapper) tracksViewWrapper.style.display = 'none';
      if (artistsViewWrapper) artistsViewWrapper.style.display = 'none';
      if (albumsViewWrapper) albumsViewWrapper.style.display = 'block';

      if (backToArtistsBtn) backToArtistsBtn.style.display = 'none';
      if (backToAlbumsBtn) backToAlbumsBtn.style.display = 'none';
      if (playAllBtn) playAllBtn.style.display = 'none';
      renderAlbumsGrid();
    }
  }

  // ==========================================================================
  // ŞARKI KUYRUĞU (UP NEXT DRAWER)
  // ==========================================================================
  function addToQueue(song) {
    state.queue.push(song);
    updateQueueUI();
    showToast(`"${song.title}" sıraya eklendi.`, 'success');
  }

  function updateQueueUI() {
    queueCountBadge.textContent = state.queue.length;
    queueDrawerBadge.textContent = state.queue.length;
    renderQueueNowPlaying();
    renderQueueItems();
    syncMnpControls();
  }

  function renderQueueNowPlaying() {
    if (!state.currentSong) {
      queueNowPlaying.innerHTML = '<div style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">Şu an çalan eser yok.</div>';
      return;
    }
    const song = state.currentSong;
    queueNowPlaying.innerHTML = `
      <div class="drawer-np-box">
        <img src="${song.cover}" alt="${song.title}" class="drawer-np-img">
        <div>
          <div class="drawer-np-tag">ŞU AN ÇALIYOR</div>
          <div class="drawer-np-title">${song.title}</div>
          <div class="drawer-np-artist">${song.artist}</div>
        </div>
      </div>
    `;
  }

  function renderQueueItems() {
    queueItemsList.innerHTML = '';
    if (state.queue.length === 0) {
      queueItemsList.innerHTML = '<div style="font-size:0.82rem; color:var(--text-muted); padding:16px 0; text-align:center; font-style:italic;">Sırada bekleyen eser bulunmuyor.</div>';
      return;
    }

    state.queue.forEach((song, idx) => {
      const item = document.createElement('div');
      item.className = 'drawer-queue-row';
      item.innerHTML = `
        <img src="${song.cover}" alt="${song.title}" class="drawer-queue-img">
        <div style="flex:1; overflow:hidden;">
          <div style="font-size:0.85rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${song.title}</div>
          <div style="font-size:0.75rem; color:var(--text-sub);">${song.artist}</div>
        </div>
        <button class="action-glyph" title="Kaldır" style="color:var(--text-muted);">&times;</button>
      `;

      item.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        state.queue.splice(idx, 1);
        updateQueueUI();
      });

      item.addEventListener('click', () => {
        state.queue.splice(idx, 1);
        updateQueueUI();
        playSong(song, true);
      });

      queueItemsList.appendChild(item);
    });
  }

  // ==========================================================================
  // FAVORİLER YÖNETİMİ
  // ==========================================================================
  function toggleFavorite(songId) {
    if (state.favorites.has(songId)) {
      state.favorites.delete(songId);
      showToast('Favorilerden çıkarıldı.', 'info');
    } else {
      state.favorites.add(songId);
      showToast('Favorilere eklendi!', 'success');
    }

    localStorage.setItem('kirkyama_favs', JSON.stringify([...state.favorites]));
    updatePlayerFavButton();
    renderSongList();
  }

  function updatePlayerFavButton() {
    const isFav = state.currentSong && state.favorites.has(state.currentSong.id);
    if (isFav) {
      playerFavBtn.classList.add('active');
    } else {
      playerFavBtn.classList.remove('active');
    }
    if (mnpFavBtn) {
      mnpFavBtn.classList.toggle('liked', !!isFav);
    }
  }

  // ==========================================================================
  // CANLI FİLTRELEME VE ARAMA
  // ==========================================================================
  function normalizeSearchText(str) {
    if (!str) return '';
    return str
      .toString()
      .replace(/İ/g, 'i')
      .replace(/I/g, 'i')
      .replace(/ı/g, 'i')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u')
      .trim();
  }

  function filterSongs() {
    const rawQuery = state.searchQuery.trim();
    const isSearching = rawQuery.length > 0;
    const normTokens = isSearching ? normalizeSearchText(rawQuery).split(/\s+/).filter(Boolean) : [];
    const category = state.currentCategory;
    const artistFilter = state.currentArtistFilter;
    const albumFilter = state.currentAlbumFilter;

    state.filteredSongs = state.allSongs.filter(song => {
      // 1. Arama Metni Kontrolü (Token tabanlı, çok kelimeli, Türkçe/İngilizce harf toleranslı)
      let matchQuery = true;
      if (isSearching) {
        const searchableText = normalizeSearchText([
          song.title,
          song.artist,
          song.album,
          song.categoryTitle,
          song.story
        ].join(' '));

        matchQuery = normTokens.every(token => searchableText.includes(token));
      }

      // 2. Kategori, Sanatçı ve Albüm Filtresi Kontrolü
      let matchCategory = true;
      let matchArtist = true;
      let matchAlbum = true;

      if (!isSearching) {
        matchCategory = (category === 'all') || (song.category === category);
        if (artistFilter) {
          const key = normalizeSearchText(artistFilter.filterKey || '');
          const name = normalizeSearchText(artistFilter.name || '');
          const artist = normalizeSearchText(song.artist || '');
          matchArtist = artist.includes(key) || artist.includes(name);
        }
        if (albumFilter) {
          matchAlbum = matchSongToAlbum(song, albumFilter);
        }
      }

      return matchQuery && matchCategory && matchArtist && matchAlbum;
    });

    renderSongList();
  }

  // ==========================================================================
  // KUŞAK (KATEGORİ) & KÜTÜPHANE / SESSİZ ÇALIŞMA MODU
  // ==========================================================================
  function selectCategory(cat) {
    state.currentCategory = cat;
    const editionTabs = document.querySelectorAll('.edition-tab');
    editionTabs.forEach(t => t.classList.toggle('active', t.dataset.category === cat));

    if (state.currentTab !== 'tracks') {
      switchView('tracks');
    }

    filterSongs();

    // O kuşağın ilk şarkısını sol vitrine al (sanatçı filtresi yoksa)
    if (!state.currentArtistFilter && state.filteredSongs.length > 0) {
      setupFeature(state.filteredSongs[0]);
    }
  }

  // ==========================================================================
  // ODAKLANMA MODU (ZEN FOCUS SCREEN — TAM KARARTMA & SAF MÜZİK)
  // ==========================================================================
  function openZenFocus() {
    state.isZenFocus = true;
    if (zenFocusScreen) {
      zenFocusScreen.classList.add('active');
      zenFocusScreen.setAttribute('aria-hidden', 'false');
    }
    if (studyModeToggleBtn) {
      studyModeToggleBtn.classList.add('active');
      studyModeToggleBtn.setAttribute('title', 'Odaklanma Modundan Çık');
    }

    // O sırada çalan şarkı varsa KESİNTİSİZ ÇALMAYA DEVAM EDER!
    if (!state.currentSong && state.filteredSongs.length > 0) {
      state.currentSong = state.filteredSongs[0];
    }
    updateZenFocusUI(state.currentSong);

    showToast('🌙 Odaklanma Modu: Ekran karartıldı, müziğe odaklanın.', 'info');
  }

  function closeZenFocus() {
    state.isZenFocus = false;
    if (zenFocusScreen) {
      zenFocusScreen.classList.remove('active');
      zenFocusScreen.setAttribute('aria-hidden', 'true');
    }
    if (studyModeToggleBtn) {
      studyModeToggleBtn.classList.remove('active');
      studyModeToggleBtn.setAttribute('title', 'Odaklanma Modu (Zen Focus)');
    }
  }

  function toggleZenFocus() {
    if (state.isZenFocus) {
      closeZenFocus();
    } else {
      openZenFocus();
    }
  }

  function updateZenFocusUI(song) {
    if (!zenSongTitle || !zenSongArtist) return;
    if (song) {
      zenSongTitle.textContent = song.title;
      zenSongArtist.textContent = song.artist;
      if (zenTimeDur) zenTimeDur.textContent = song.duration || '00:00';
    } else {
      zenSongTitle.textContent = 'Eser Seçilmedi';
      zenSongArtist.textContent = 'Radyo Kırkyama';
      if (zenTimeDur) zenTimeDur.textContent = '00:00';
    }
    updateZenPlayPauseIcon(state.isPlaying);
  }

  function updateZenPlayPauseIcon(isPlaying) {
    if (!zenPlayIcon || !zenPauseIcon) return;
    if (isPlaying) {
      zenPlayIcon.style.display = 'none';
      zenPauseIcon.style.display = 'block';
    } else {
      zenPlayIcon.style.display = 'block';
      zenPauseIcon.style.display = 'none';
    }
  }

  // ==========================================================================
  // MEDIA SESSION API (KİLİT EKRANI & BİLDİRİM ÇUBUĞU)
  // ==========================================================================
  function setupMediaSession() {
    if (!('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.setActionHandler('play', () => togglePlayPause());
      navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
      navigator.mediaSession.setActionHandler('stop', () => {
        audioRecovery.wantsToPlay = false;
        clearStallTimer();
        audio.pause();
        audio.currentTime = 0;
        state.isPlaying = false;
        updatePlayPauseUI(false);
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => playPrevSong());
      navigator.mediaSession.setActionHandler('nexttrack', () => playNextSong());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime && !isNaN(audio.duration)) {
          audio.currentTime = details.seekTime;
        }
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const skip = details.seekOffset || 10;
        audio.currentTime = Math.max(audio.currentTime - skip, 0);
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const skip = details.seekOffset || 10;
        audio.currentTime = Math.min(audio.currentTime + skip, audio.duration || 0);
      });
    } catch (err) {
      console.warn('MediaSession handler ataması uyarısı:', err);
    }
  }

  function updateMediaSessionMetadata(song) {
    if (!('mediaSession' in navigator)) return;

    try {
      const rawCover = song.cover || 'assets/logo.svg';
      const absCover = new URL(rawCover, window.location.href).href;

      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: `${song.artist} • Boğaziçi Koleji`,
        album: song.album || 'Radyo Kırkyama Journal',
        artwork: [
          { src: absCover, sizes: '96x96', type: 'image/jpeg' },
          { src: absCover, sizes: '128x128', type: 'image/jpeg' },
          { src: absCover, sizes: '192x192', type: 'image/jpeg' },
          { src: absCover, sizes: '512x512', type: 'image/jpeg' }
        ]
      });
    } catch (e) {
      console.warn('MediaSession metadata atanamadı:', e);
    }
  }

  function updateMediaSessionPosition() {
    if (!('mediaSession' in navigator) || !('setPositionState' in navigator.mediaSession)) return;
    try {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        navigator.mediaSession.setPositionState({
          duration: audio.duration,
          playbackRate: audio.playbackRate,
          position: audio.currentTime
        });
      }
    } catch (e) {}
  }

  // ==========================================================================
  // PWA SERVICE WORKER
  // ==========================================================================
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('[PWA] Service Worker aktif:', reg.scope))
          .catch(err => console.warn('[PWA] Kayıt hatası:', err));
      });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredPrompt = e;
      installPwaBtn.style.display = 'inline-flex';
    });

    installPwaBtn.addEventListener('click', async () => {
      if (!state.deferredPrompt) return;
      state.deferredPrompt.prompt();
      const { outcome } = await state.deferredPrompt.userChoice;
      console.log(`[PWA] Kurulum sonucu: ${outcome}`);
      state.deferredPrompt = null;
      installPwaBtn.style.display = 'none';
    });
  }

  // ==========================================================================
  // SUNUCU SAĞLIK KONTROLÜ & UYANIK TUTMA (KEEP-ALIVE)
  // ==========================================================================
  let serverKeepAliveTimer = null;

  async function checkServerHealthQuiet(attempt = 0) {
    const serverUrl = (state.streamServerUrl || LIVE_RENDER_URL).replace(/\/+$/, '');
    try {
      const res = await fetch(`${serverUrl}/health`, { signal: AbortSignal.timeout(12000) });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && data.telegramConnected) {
          updateServerStatusUI('connected');
          startServerKeepAlive();
          return;
        }
      }
      updateServerStatusUI('waking');
    } catch (err) {
      updateServerStatusUI('waking');
    }

    // Render Free Tier uyku modundaysa uyanana kadar kademeli tekrar kontrol et
    if (attempt < 4) {
      setTimeout(() => checkServerHealthQuiet(attempt + 1), 4000 * (attempt + 1));
    } else {
      updateServerStatusUI('offline');
      startServerKeepAlive();
    }
  }

  function startServerKeepAlive() {
    if (serverKeepAliveTimer) return;
    serverKeepAliveTimer = setInterval(() => {
      if (document.visibilityState === 'visible' || audioRecovery.wantsToPlay) {
        const serverUrl = (state.streamServerUrl || LIVE_RENDER_URL).replace(/\/+$/, '');
        fetch(`${serverUrl}/health`, { signal: AbortSignal.timeout(10000) })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data && data.status === 'ok' && data.telegramConnected) {
              updateServerStatusUI('connected');
            }
          })
          .catch(() => {});
      }
    }, 4 * 60 * 1000); // Her 4 dakikada bir sunucuyu uyanık tut
  }

  function updateServerStatusUI(status) {
    if (status === 'connected') {
      serverStatusIndicator.style.background = '#10b981';
      serverStatusIndicator.style.boxShadow = '0 0 8px #10b981';
      serverStatusTitle.textContent = 'CANLI YAYIN: AKTİF';
    } else if (status === 'waking') {
      serverStatusIndicator.style.background = '#f59e0b';
      serverStatusIndicator.style.boxShadow = '0 0 8px #f59e0b';
      serverStatusTitle.textContent = 'SUNUCU UYANIYOR...';
    } else {
      serverStatusIndicator.style.background = '#f59e0b';
      serverStatusIndicator.style.boxShadow = '0 0 8px #f59e0b';
      serverStatusTitle.textContent = 'YEDEK DEMO MODU';
    }
  }

  // ==========================================================================
  // KULLANICI ARAYÜZÜ ETKİLEŞİMLERİ (EVENT LISTENERS)
  // ==========================================================================
  function setupEventListeners() {
    // Swiss Player Kontrolleri
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNextSong);
    prevBtn.addEventListener('click', playPrevSong);

    function handleToggleShuffle() {
      state.isShuffle = !state.isShuffle;
      audioRecovery.nextShuffleCandidate = null;
      shuffleBtn.classList.toggle('active', state.isShuffle);
      if (mnpShuffleBtn) mnpShuffleBtn.classList.toggle('active', state.isShuffle);
      showToast(state.isShuffle ? 'Karışık çalma açık' : 'Karışık çalma kapalı', 'info');
    }

    function handleToggleRepeat() {
      if (state.repeatMode === 'off') {
        state.repeatMode = 'all';
        repeatBtn.classList.add('active');
        repeatBtn.classList.remove('repeat-one');
        showToast('Tüm liste tekrarlanacak', 'info');
      } else if (state.repeatMode === 'all') {
        state.repeatMode = 'one';
        repeatBtn.classList.add('active', 'repeat-one');
        showToast('Şu anki eser tekrarlanacak', 'info');
      } else {
        state.repeatMode = 'off';
        repeatBtn.classList.remove('active', 'repeat-one');
        showToast('Tekrar kapatıldı', 'info');
      }
      syncMnpControls();
    }

    shuffleBtn.addEventListener('click', handleToggleShuffle);
    repeatBtn.addEventListener('click', handleToggleRepeat);

    // Seek / İlerleme Çubuğu
    progressSeek.addEventListener('input', (e) => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        const percent = parseFloat(e.target.value);
        audio.currentTime = (percent / 100) * audio.duration;
      }
    });

    // Ses Slider
    volumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      state.volume = vol;
      audio.volume = vol;
      state.isMuted = vol === 0;
      updateVolumeIcons();
      localStorage.setItem('kirkyama_volume', vol.toString());
    });

    volumeBtn.addEventListener('click', () => {
      if (state.isMuted) {
        state.isMuted = false;
        audio.volume = state.volume > 0 ? state.volume : 0.85;
        volumeSlider.value = audio.volume;
      } else {
        state.isMuted = true;
        audio.volume = 0;
        volumeSlider.value = 0;
      }
      updateVolumeIcons();
    });

    // Oynatma Hızı
    playbackSpeedBtn.addEventListener('click', () => {
      const currentIdx = state.speedOptions.indexOf(state.playbackSpeed);
      const nextIdx = (currentIdx + 1) % state.speedOptions.length;
      state.playbackSpeed = state.speedOptions[nextIdx];
      audio.playbackRate = state.playbackSpeed;
      playbackSpeedBtn.textContent = `${state.playbackSpeed}x`;
      showToast(`Çalma hızı: ${state.playbackSpeed}x`, 'info');
    });

    // Player Kalp
    playerFavBtn.addEventListener('click', () => {
      if (state.currentSong) {
        toggleFavorite(state.currentSong.id);
      }
    });

    // Baştan Çal
    playAllBtn.addEventListener('click', () => {
      const list = state.filteredSongs.length > 0 ? state.filteredSongs : state.allSongs;
      if (list.length > 0) {
        playSong(list[0], true);
      }
    });

    // ==========================================================================
    // ARAMA KUTUSU (MASAÜSTÜ & MOBİL EŞZAMANLI ENTEGRASYON)
    // ==========================================================================
    function updateSearchState(query) {
      state.searchQuery = query;
      if (searchInput && searchInput.value !== query) searchInput.value = query;
      if (mobileSearchInput && mobileSearchInput.value !== query) mobileSearchInput.value = query;

      const hasQuery = query.trim().length > 0;
      if (clearSearchBtn) clearSearchBtn.style.display = hasQuery ? 'block' : 'none';
      if (mobileSearchClearBtn) mobileSearchClearBtn.style.display = hasQuery ? 'block' : 'none';

      if (hasQuery && state.currentTab !== 'tracks') {
        switchView('tracks');
      }

      filterSongs();
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        updateSearchState(e.target.value);
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        updateSearchState('');
        searchInput.focus();
      });
    }

    // Mobil Arama Çekmecesi & Girişi
    if (mobileSearchToggleBtn && mobileSearchTray) {
      mobileSearchToggleBtn.addEventListener('click', () => {
        const isOpen = mobileSearchTray.classList.toggle('open');
        if (isOpen && mobileSearchInput) {
          mobileSearchInput.value = state.searchQuery;
          mobileSearchInput.focus();
        }
      });
    }

    if (mobileSearchInput) {
      mobileSearchInput.addEventListener('input', (e) => {
        updateSearchState(e.target.value);
      });
    }

    if (mobileSearchClearBtn) {
      mobileSearchClearBtn.addEventListener('click', () => {
        updateSearchState('');
        mobileSearchInput.focus();
      });
    }

    if (mobileSearchCancelBtn && mobileSearchTray) {
      mobileSearchCancelBtn.addEventListener('click', () => {
        mobileSearchTray.classList.remove('open');
        updateSearchState('');
      });
    }

    // Odaklanma Modu (Zen Focus) Butonu & Kontrolleri
    if (studyModeToggleBtn) {
      studyModeToggleBtn.addEventListener('click', () => {
        toggleZenFocus();
      });
    }

    if (zenCloseBtn) {
      zenCloseBtn.addEventListener('click', () => {
        closeZenFocus();
      });
    }

    if (zenPlayPauseBtn) {
      zenPlayPauseBtn.addEventListener('click', () => {
        togglePlayPause();
      });
    }

    if (zenPrevBtn) {
      zenPrevBtn.addEventListener('click', () => {
        playPrevSong();
      });
    }

    if (zenNextBtn) {
      zenNextBtn.addEventListener('click', () => {
        playNextSong();
      });
    }

    // Repertuar, Sanatçılar ve Sevdiğim Albümler Sekme Geçişleri
    if (tabTracksView) {
      tabTracksView.addEventListener('click', () => {
        state.currentArtistFilter = null;
        state.currentAlbumFilter = null;
        if (backToArtistsBtn) backToArtistsBtn.style.display = 'none';
        if (backToAlbumsBtn) backToAlbumsBtn.style.display = 'none';
        filterSongs();
        switchView('tracks');
      });
    }

    if (tabArtistsView) {
      tabArtistsView.addEventListener('click', () => {
        switchView('artists');
      });
    }

    if (tabAlbumsView) {
      tabAlbumsView.addEventListener('click', () => {
        switchView('albums');
      });
    }

    if (backToArtistsBtn) {
      backToArtistsBtn.addEventListener('click', () => {
        state.currentArtistFilter = null;
        filterSongs();
        switchView('artists');
      });
    }

    if (backToAlbumsBtn) {
      backToAlbumsBtn.addEventListener('click', () => {
        state.currentAlbumFilter = null;
        filterSongs();
        switchView('albums');
      });
    }

    // Albüm Alt Bölüm Filtreleri (Tümü | Kült Albümler | Soundtrack)
    if (albumsFilterPills) {
      const pills = albumsFilterPills.querySelectorAll('.album-filter-pill');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          state.albumSubFilter = pill.dataset.sub || 'all';
          renderAlbumsGrid();
        });
      });
    }

    // Çekmece (Queue Drawer)
    toggleQueueBtn.addEventListener('click', () => {
      queueDrawer.classList.toggle('open');
    });
    closeQueueBtn.addEventListener('click', () => {
      queueDrawer.classList.remove('open');
    });
    clearQueueBtn.addEventListener('click', () => {
      state.queue = [];
      updateQueueUI();
      showToast('Kuyruk boşaltıldı.', 'info');
    });

    // Ayarlar Çarkı Modalı
    if (serverSettingsBtn && serverSettingsModal) {
      serverSettingsBtn.addEventListener('click', () => {
        serverSettingsModal.style.display = 'flex';
      });
    }

    if (closeSettingsModalBtn) {
      closeSettingsModalBtn.addEventListener('click', () => {
        serverSettingsModal.style.display = 'none';
      });
    }

    const closeSettingsModalFooterBtn = document.getElementById('closeSettingsModalFooterBtn');
    if (closeSettingsModalFooterBtn) {
      closeSettingsModalFooterBtn.addEventListener('click', () => {
        serverSettingsModal.style.display = 'none';
      });
    }

    if (serverSettingsModal) {
      serverSettingsModal.addEventListener('click', (e) => {
        if (e.target === serverSettingsModal) {
          serverSettingsModal.style.display = 'none';
        }
      });
    }

    // ========================================================================
    // APPLE MUSIC & SPOTIFY TARZI TAM EKRAN ÇALAR (NOW PLAYING SCREEN)
    // ========================================================================
    function openMobileNowPlaying() {
      if (!mobileNowPlayingScreen) return;
      if (state.currentSong) {
        updateMobileNowPlayingUI(state.currentSong);
      }
      mobileNowPlayingScreen.classList.add('open');
      mobileNowPlayingScreen.setAttribute('aria-hidden', 'false');
    }

    function closeMobileNowPlaying() {
      if (!mobileNowPlayingScreen) return;
      mobileNowPlayingScreen.classList.remove('open');
      mobileNowPlayingScreen.setAttribute('aria-hidden', 'true');
      if (mnpStorySheet) mnpStorySheet.classList.remove('open');
    }

    // Alt çubuğa tıklandığında tam ekran çaları aç
    if (swissPlayerTrigger) {
      swissPlayerTrigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 860 && !e.target.closest('#playerFavBtn')) {
          openMobileNowPlaying();
        }
      });
    }

    // Alt çubuktan YUKARI kaydırıldığında tam ekran çaları aç (Swipe-Up)
    if (bottomPlayer) {
      let bTouchStartY = 0;
      let bTouchStartX = 0;

      bottomPlayer.addEventListener('touchstart', (e) => {
        bTouchStartY = e.touches[0].clientY;
        bTouchStartX = e.touches[0].clientX;
      }, { passive: true });

      bottomPlayer.addEventListener('touchend', (e) => {
        const bTouchEndY = e.changedTouches[0].clientY;
        const bTouchEndX = e.changedTouches[0].clientX;
        const diffY = bTouchStartY - bTouchEndY;
        const diffX = Math.abs(bTouchStartX - bTouchEndX);

        // Yukarı doğru en az 25px ve dikey kaydırma baskınsa aç
        if (diffY > 25 && diffY > diffX && window.innerWidth <= 860) {
          openMobileNowPlaying();
        }
        bTouchStartY = 0;
        bTouchStartX = 0;
      }, { passive: true });
    }

    // Tam ekran çalarda AŞAĞI kaydırıldığında kapat (Swipe-Down)
    if (mobileNowPlayingScreen) {
      let mnpTouchStartY = 0;
      let mnpTouchCurrentY = 0;

      mobileNowPlayingScreen.addEventListener('touchstart', (e) => {
        mnpTouchStartY = e.touches[0].clientY;
        mnpTouchCurrentY = e.touches[0].clientY;
      }, { passive: true });

      mobileNowPlayingScreen.addEventListener('touchmove', (e) => {
        mnpTouchCurrentY = e.touches[0].clientY;
      }, { passive: true });

      mobileNowPlayingScreen.addEventListener('touchend', () => {
        const diffY = mnpTouchCurrentY - mnpTouchStartY;
        const isStoryOpen = mnpStorySheet && mnpStorySheet.classList.contains('open');

        // Hikaye açık değilse ve aşağı 55px kaydırılmışsa kapat
        if (diffY > 55 && !isStoryOpen) {
          closeMobileNowPlaying();
        }
        mnpTouchStartY = 0;
        mnpTouchCurrentY = 0;
      }, { passive: true });
    }

    if (mnpCloseBtn) mnpCloseBtn.addEventListener('click', closeMobileNowPlaying);
    if (mnpHeaderCenter) mnpHeaderCenter.addEventListener('click', closeMobileNowPlaying);

    if (mnpPlayPauseBtn) mnpPlayPauseBtn.addEventListener('click', togglePlayPause);
    if (mnpPrevBtn) mnpPrevBtn.addEventListener('click', playPrevSong);
    if (mnpNextBtn) mnpNextBtn.addEventListener('click', playNextSong);
    if (mnpShuffleBtn) mnpShuffleBtn.addEventListener('click', handleToggleShuffle);
    if (mnpRepeatBtn) mnpRepeatBtn.addEventListener('click', handleToggleRepeat);

    if (mnpFavBtn) {
      mnpFavBtn.addEventListener('click', () => {
        if (state.currentSong) {
          toggleFavorite(state.currentSong.id);
        }
      });
    }

    if (mnpQueueBtn) {
      mnpQueueBtn.addEventListener('click', () => {
        if (queueDrawer) queueDrawer.classList.toggle('open');
      });
    }

    if (mnpStoryToggleBtn && mnpStorySheet) {
      mnpStoryToggleBtn.addEventListener('click', () => {
        mnpStorySheet.classList.toggle('open');
      });
    }

    if (mnpStoryCloseBtn && mnpStorySheet) {
      mnpStoryCloseBtn.addEventListener('click', () => {
        mnpStorySheet.classList.remove('open');
      });
    }

    if (mnpViewArtistBtn) {
      mnpViewArtistBtn.addEventListener('click', () => {
        if (!state.currentSong) return;
        closeMobileNowPlaying();

        const matched = ARTISTS_CATALOG.find(a =>
          state.currentSong.artist.toLowerCase().includes(a.filterKey.toLowerCase()) ||
          a.name.toLowerCase().includes(state.currentSong.artist.toLowerCase())
        );

        if (matched) {
          selectArtist(matched);
        } else {
          const tempArtist = {
            id: state.currentSong.artist.toLowerCase().replace(/\s+/g, '-'),
            name: state.currentSong.artist,
            filterKey: state.currentSong.artist,
            genre: state.currentSong.categoryTitle || 'Özel Sanatçı',
            avatar: state.currentSong.cover,
            story: state.currentSong.artist + ', Boğaziçi Koleji müzik dergisi repertuarında yer alan değerli bir sanatçıdır.',
            aura1: state.currentSong.aura1 || 'rgba(212, 163, 115, 0.22)',
            aura2: state.currentSong.aura2 || 'rgba(99, 102, 241, 0.18)'
          };
          selectArtist(tempArtist);
        }
      });
    }

    if (mnpScrubSlider) {
      mnpScrubSlider.addEventListener('input', (e) => {
        if (!isNaN(audio.duration) && audio.duration > 0) {
          const val = parseFloat(e.target.value);
          audio.currentTime = (val / 100) * audio.duration;
          if (mnpScrubPlayed) mnpScrubPlayed.style.width = `${val}%`;
          if (mnpTimeCur) mnpTimeCur.textContent = formatTime(audio.currentTime);
        }
      });
    }

    // Klavye Kısayolları (Space: Play/Pause)
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        if (state.isZenFocus) closeZenFocus();
        if (mobileSearchTray && mobileSearchTray.classList.contains('open')) {
          mobileSearchTray.classList.remove('open');
          updateSearchState('');
        }
      } else if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowRight' && e.ctrlKey) {
        e.preventDefault();
        playNextSong();
      } else if (e.code === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault();
        playPrevSong();
      }
    });
  }

  function updateVolumeIcons() {
    if (state.isMuted || audio.volume === 0) {
      volumeHighIcon.style.display = 'none';
      volumeMuteIcon.style.display = 'block';
    } else {
      volumeHighIcon.style.display = 'block';
      volumeMuteIcon.style.display = 'none';
    }
  }

  // ==========================================================================
  // YARDIMCI METOTLAR: ZAMAN VE TOAST BİLDİRİM
  // ==========================================================================
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-8px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Başlat
  document.addEventListener('DOMContentLoaded', init);
})();
