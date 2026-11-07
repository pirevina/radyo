# 📻 Radyo Kırkyama — Proje Notları & Gelecek Yol Haritası (Roadmap)
**Kurum:** Boğaziçi Koleji  
**Altyapı:** Sıfır Maliyetli (0 TL) Sınırsız Telegram MTProto Müzik Bulutu & Web/PWA Platformu  
**Kanal ID:** `-1004471052728`  
**Canlı Stream URL:** `https://radyo-kirkyama-stream.onrender.com`

---

## 🌟 1. ÖNCELİKLİ GÜNDEM: Telegram Otomatik Kanal Tarayıcı (Auto-Sync Engine)

> **Hedef:** Kullanıcı Telegram müzik kanalına albüm veya tekli parça yüklediğinde; şarkı adı, sanatçı, süre ve kapak görselinin hiçbir manuel JSON düzenlemesi gerektirmeden otomatik olarak web sitesine işlenmesi.

### Çalışma Mantığı & Teknik Tasarım:
1. **GramJS Message Polling & Scan:**
   - Bot kanalda zaten **Yönetici (Admin)** yetkisine sahip.
   - `stream-server` üzerinde gizli bir yönetim rotası açılacak: `GET /api/sync-channel?token=GIZLI_ANAHTAR` veya Telegram kanalına yeni ses atıldığında tetiklenen bir listener.
2. **Telegram ID3 & Audio Attribute Çözümleme:**
   - Telegram'a yüklenen her MP3/FLAC dosyasının `document.attributes` dizisinde `DocumentAttributeAudio` nesnesi bulunur:
     - `title`: Şarkının orijinal başlığı
     - `performer`: Sanatçı / Grup adı
     - `duration`: Saniye cinsinden tam çalma süresi
     - `thumbs`: Eğer MP3 içinde gömülü albüm kapağı varsa Telegram'ın ürettiği küçük resim (cover)
3. **Otomatik JSON / Veritabanı Güncelleme:**
   - Yeni gelen mesaj ID'si taranır (`msg.id`).
   - Eğer kütüphanede yoksa, başlık, sanatçı, süre ve kapak otomatik formatlanıp `songs.json`'a eklenir.
4. **Sonuç:**
   - Kullanıcı Telegram kanalına 20 şarkılık albümü sürükleyip bırakır.
   - 10 saniye sonra web sitesini yenilediğinde albüm tüm şarkılarıyla listede yerini alır!

---

## 🚀 2. BÜYÜME VE PERFORMANS YOL HARİTASI (ÖLÇEKLEME)

Kütüphanedeki parça sayısı on binlere ulaştığında devreye alınacak hazır mimariler:

| Aşama | Şarkı Sayısı | Mimari Strateji | Durum |
| :--- | :--- | :--- | :--- |
| **Faz 1 (Mevcut)** | 1 – 3.000 Şarkı | Saf JSON + Gömülü Fallback Bellek + PWA Cache | **Aktif & Çalışıyor** |
| **Faz 2** | 3.000 – 10.000 Şarkı | Sanal Liste (Virtual Scroll / Lazy Loading) + Kategori Bazlı JSON Parçalama | Planlandı |
| **Faz 3** | 10.000 – 50.000+ Şarkı | Render üzerinde 0 TL Tek Dosyalık `radyo.sqlite` + Canlı Arama Endpoint'i | Planlandı |
