# Prompt 4: Arayüz 1 — tasarım, program gezgini, okul ve program sayfaları, profil

Bu adımda uygulamayı ilk kez tarayıcıda görürsün. Agent önce sana görünüm konusunda birkaç seçenek gösterir; tasarımcı sensin, beğenmediğini söyle. Sonra en çok kullanacağın sayfaları kurar: filtreli program listesi, okul ve program detayı, profil.

Bitince `npm run dev` ile `http://localhost:5173` adresinde uygulamayı açabilirsin.

Aşağıdaki kutunun içini kopyalayıp agent'a yapıştır:

````text
CLAUDE.md'yi oku, özellikle 8. bölümü (arayüz kuralları). Şimdi arayüzün birinci kısmını kuracağız.

## 1. Önce görünüm kararı

Ben mimarlık öğrencisiyim; görünüm benim için önemli. Kod yazmadan önce bana 3 görünüm seçeneği öner. Her biri için: renk paleti (açık ve koyu tema), başlık / metin / sayı yazı tipleri (Google Fonts), bir cümlelik karakter tarifi. Örnek yönler:
- Sıcak kâğıt: krem zemin, lacivert mürekkep, bakır vurgu; Source Serif 4 başlık, IBM Plex Sans metin, IBM Plex Mono sayı.
- Teknik pafta: beyaz/açık gri zemin, ince çizgiler, ızgara hissi, tek güçlü vurgu rengi; grotesk metin, mono sayılar.
- Senin önerin.
Mümkünse her seçeneği küçük bir örnek sayfa (bir program satırı + bir etiket + bir düğme) olarak gösterip ekran görüntüsünü paylaş. Ben seçince devam et. Hangi seçenek olursa olsun CLAUDE.md'deki "yapay zekâ klişesi yok, sakin araştırma aracı" kuralı geçerli.

## 2. Tasarım tokenları (src/styles/base.css)

- Renkler yalnızca token olarak: --bg, --paper, --sunk, --ink, --ink-2, --muted, --line, --line-2, --accent, --accent-ink, --accent-soft, --ok, --ok-soft, --warn, --warn-soft, --bad, --bad-soft, --focus ve gerekenler. Yazı tipleri --display, --sans, --mono. Köşe yarıçapları küçük (--r-s, --r-m). Boşluk --gutter (clamp ile).
- Açık tema :root'ta tam; koyu tema @media (prefers-color-scheme: dark) içinde :root:not([data-theme="light"]) altında ve ayrıca :root[data-theme="dark"] altında aynı değerlerle. body'ye var(--bg) arka plan.
- Kontrast en az 4,5:1 (metin ve etiketler her iki temada). Odak halkası görünür. prefers-reduced-motion'da geçişleri kapat. Sayılarda font-variant-numeric: tabular-nums.
- Ortak parçalar: düğmeler (primary, ghost, küçük), çipler (aria-pressed), etiketler (pill: ok / warn / bad / muted), kart yerine çoğunlukla çizgiyle ayrılmış listeler, tablo kabı (yatay kayan).

## 3. Yerleşim (components/Layout.tsx)

- Üst çubuk: marka ("Mimarlık Master Atlası"; dar ekranda kısaltma), ana menü: Bugün, Programlar, Okullar, Ülkeler, Alanlar, Burslar, Takvim, Karşılaştır (sayı rozeti), Takip (sayı rozeti), Profil. Henüz yapılmamış sayfalar için basit "yakında" sayfası koy; Prompt 5 ve 8'de dolacak.
- Detay sayfalarında ilgili sekme seçili görünsün: /okul/:id → Okullar, /program/... → Programlar, /ulke/:kod → Ülkeler, /burs/:id → Burslar.
- Arama kutusu: Enter'da /programlar?q=… adresine gitsin.
- Kısa liste simgesi (sayıyla) → /programlar?sl=1. Tema düğmesi (açık/koyu; seçimi "maa_theme" anahtarına yaz).
- Profil boşsa üstte ince bir bant: "Profilin boş; programlarda Eksik bilgi görünüyor. Profili doldur / Şimdilik gizle".
- dataErrors varsa üstte hata bandı (ilk 8 hata + "npm run check çalıştır").
- Mobilde menü yatay kaysın ya da açılır menüye dönsün; sayfa yatay kaymasın.
- Sayfa değişince en üste kaydır. HashRouter kullan.
- Tema değişirken renk geçiş animasyonu olmasın (bütün sayfa yavaşça renk değiştirmesin).

## 4. Ortak bileşenler (components/bits.tsx vb.)

StatusPill (kesin / tahmin; tahmin bir bakışta fark edilmeli), EligBadge (uyuyor / sınırda / uymuyor / eksik bilgi; kısa ve uzun hali), Flag, Countdown ("12 gün kaldı", "bugün son gün", "kapandı"), DeadlineBar (başvuru penceresinin ne kadarı geçti), Money, StaleBadge (verifiedAt 90 günden eskiyse "doğrulanmadı").

ProgramRow: program adı (+ orijinal adı küçük), okul kısa adı, şehir, bayrak, eğitim dilleri, derece; sıradaki son tarih + geri sayım (+ tahminse etiket); kısa şart etiketleri (ALES türü ve eşiği, "Portfolyo", "Almanca C1", "Sınav/mülakat"); yıllık maliyet (EUR; Türkiye'de TL de); uygunluk rozeti; kısa liste yıldızı; karşılaştırma onay kutusu; "Takibe al". Mobilde uzun etiketler düğmeleri alt satıra itmesin; düzeni 360 px'te kontrol et.

## 5. Sayfalar

/programlar (program gezgini)
- Solda filtre paneli (mobilde aç/kapa düğmesiyle). Gruplar katlanabilir, içinde seçili filtre varsa açık başlasın, her grupta "temizle". Seçeneklerin yanında kaç program olduğu yazsın. Seçenekler üst seçime göre daralsın: kapsam (Türkiye / yurt dışı) → ülke → şehir → okul.
- Gruplar: Kapsam; Ülke; Şehir; Okul (benim seçtiğim okullar ve QS mimarlık sırası dahil); Alan (+ "ilgi alanlarım" kısayolu); Derece (tezli / tezsiz / doktora); Eğitim dili (+ "yalnızca İngilizce"); Dönem (+ "tek dönem alanlar"); Son başvuru (N gün içinde); Uygunluk (bana uyanlar / uyan + sınırda); Şartlar (ALES istemeyen, ALES puan türü, portfolyo zorunlu olmayan, sınav/mülakat olmayan, IELTS şartı en fazla, GNO şartı en fazla); Ücret (ücretsiz, yıllık en fazla €, bölgesel ücret var/yok, burs var); Meslek odası yolu açık olanlar; Kısa listem.
- Üstte aktif filtre çipleri (tıklayınca kalkar), sonuç sayısı, sıralama (son tarih / maliyet / ad / okul). Bütün durum URL'de; link paylaşılınca aynı görünüm açılır.
- Sonuç yoksa hangi filtrenin daralttığını söyleyen boş durum.

/okullar
- Türkiye ve yurt dışı ayrı; ülke → şehir gruplu liste. Her okulda: kısa ad, tür (devlet/vakıf, üniversite/teknik/uygulamalı bilimler/sanat akademisi), program sayısı, QS mimarlık sırası (varsa), benim seçtiğim okullardan mı. Ülke ve tür filtresi.

/okul/:id
- Başlık, şehir/bölge, tür, sıralamalar, StaleBadge. Programlar listesi (ProgramRow). Okul geneli takvim (dönemler tablosu). Genel şartlar. Ücret ve burs. Öne çıkan hocalar/stüdyolar. Resmi sayfalar ve kaynaklar.

/program/:uni/:prog
- Başlık (ad, orijinal ad, derece, okul, şehir, dil, süre + durationNote, ECTS), kısa liste / karşılaştır / takip düğmeleri.
- Başvuru şartları: her kriter satır satır, "ne isteniyor" ve "senin durumun" yan yana, durum rengiyle. Portfolyo biçimi ve içeriği, sınav/mülakat türleri, kabul edilen lisans bölümleri, değerlendirme formülü, belgeler, portal.
- Dönemler ve tarihler: her dönem ayrı satır; offered "no" olan dönem üstü çizili ve "bu dönem öğrenci almıyor" yazılı; turlar (erken/normal/AB dışı) ve adımlar (portfolyo, sınav, mülakat, sonuç); kesin/tahmin etiketi; note.
- Ücret: AB dışı / AB vatandaşı seçimi profilden; satır satır ve yıllık toplam EUR; bilinmeyen satır "bilinmiyor".
- Meslek odası yolu: licensure değeri ve notu; ülke sayfasındaki ayrıntıya bağlantı.
- Burslar: programa özel, okula ait, ulusal (ülke) ayrı başlıklarla.
- Notlar, bağlantılar, StaleBadge.

/profil
- Alanlar: lisans bölümü, toplam ECTS, dönem sayısı, GNO ve ölçek, ALES (SAY / EA / SÖZ ayrı ayrı), YDS, YÖKDİL, IELTS, TOEFL, diğer diller (dil + CEFR seviyesi; ekle/sil), portfolyo durumu (yok / taslak / hazır), staj/ofis deneyimi (ay), vatandaşlık (AB dışı / AB), ilgi alanları (fields.json'dan çoklu seçim), ders uyumu (alan adı + ECTS; ekle/sil; transkriptteki ECTS sütununu kullan notu).
- Her alanın yanında kısa ipucu. "Bu bilgiler yalnızca bu tarayıcıda saklanır" açıklaması.
- JSON olarak dışa aktar / içe aktar; "profili sıfırla" (onay sorarak).
- Değişiklik anında kaydedilir; uygunluk etiketleri her yerde güncellenir.

Ayrıca: 404 sayfası ve hata sayfası (errorElement).

## 6. Kontrol

- Geliştirme sunucusunu başlat. Tarayıcı/önizleme aracın varsa sayfaları kendin aç: konsolda hata olmamalı.
- Ekran görüntüsü al ve bak: masaüstü, mobil (360–375 px), koyu tema. Programlar sayfasında filtre paneli, program detayında şart listesi, profil formu.
- Test için profil doldurursan işin bitince localStorage'dan "maa_v1_user" anahtarını sil.
- npm run check, npm run typecheck, npm test geçmeli. Commit at.
- Bana ekran görüntülerini göster; düzeltmek istediğim bir şey var mı diye sor.
````
