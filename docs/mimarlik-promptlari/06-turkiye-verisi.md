# Prompt 6: Türkiye verisi

Bu adımda agent Türkiye'deki mimarlık ve ilgili alanlardaki yüksek lisans programlarını araştırıp ekler. İş uzundur, partiler halinde ilerler. Önce aday okul listesini sana gösterir; sen onaylarsın.

Burada en çok dikkat edilecek şey: her programın **ALES puan türü** (SAY / EA / SÖZ), **güz ve bahar dönemleri ayrı ayrı**, ve mimarlık mezununa açık olup olmadığı.

Aşağıdaki kutunun içini kopyalayıp agent'a yapıştır:

````text
CLAUDE.md'yi ve docs/research-notes.md'yi oku. Şimdi Türkiye verisini ekleyeceğiz. CLAUDE.md'deki doğrulama protokolüne harfiyen uy: resmi kaynakta görmediğin hiçbir tarihi kesin yazma, bilmediğin alanı boş bırak.

## 1. Ülke dosyası (data/countries/tr.json)

- terms: fall = Güz (Eylül/Ekim), spring = Bahar (Şubat).
- summary ve facts: lisansüstü başvurunun genel işleyişi (enstitü ilanı, ALES/YDS, değerlendirme, mülakat), tezli/tezsiz farkı, tezsizin genelde ücretli olması, vakıf üniversitesi ücretleri, ALES'in geçerlilik süresi ve eşdeğer sınavlar (GRE/GMAT) için YÖK kuralı. YÖK Lisansüstü Eğitim ve Öğretim Yönetmeliği'ndeki genel alt sınırları resmi metinden kontrol edip yaz; ezberden sayı yazma.
- timeline: ÖSYM'nin ALES, YDS ve YÖKDİL sınav ve sonuç tarihleri (ÖSYM'nin yayımlanmış sınav takvimi; henüz yayımlanmamış yıl için geçen yılın takvimi "tahmin"). TÜBİTAK burs çağrıları burada değil, Prompt 8'de burs kaydı olarak girecek.
- scholarships: TÜBİTAK 2210 (kısa kayıt; ref Prompt 8'de bağlanacak).
- profession: Türkiye'de mimar olarak çalışma (Mimarlar Odası üyeliği); yüksek lisansın buna etkisi yoksa öyle yaz.

## 2. Aday listesi (önce bana göster)

Bir tablo hazırla: okul, şehir, tür (devlet/vakıf), mimarlık ve ilgili alanlarda hangi YL programları var (adlarıyla), eğitim dili, kaynak linki. Kaynak: enstitülerin program sayfaları ve YÖK'ün program listeleri. Aşağıdaki adlar yalnızca ipucudur, ezberden yazıldı; her birini doğrula, programı olmayanı ele, listede olmayan ama programı olan okulları ekle:
- Devlet: İTÜ, ODTÜ, YTÜ, Mimar Sinan Güzel Sanatlar, Gazi, Dokuz Eylül, İYTE, KTÜ, Konya Teknik, Erciyes, Bursa Uludağ, Trakya, Çukurova, Abdullah Gül.
- Vakıf: Bilkent, Özyeğin, Kadir Has, Bahçeşehir, Yeditepe, İstanbul Bilgi, MEF, TOBB ETÜ, Çankaya, Atılım, TED, İstanbul Kültür, Yaşar, İzmir Ekonomi.
Bazı okullarda tek bölüm altında çok sayıda program vardır (mimari tasarım, restorasyon, mimarlık tarihi, yapı bilgisi, mimari tasarımda bilişim, kentsel tasarım, peyzaj, iç mimarlık, gayrimenkul geliştirme…). Her biri ayrı program kaydıdır.

Tabloyu CLAUDE.md'deki ilgi alanlarıma ve hedef şehirlerime göre öncelik sırasına koy. Bana sor:
- Hangi okulları "benim seçtiğim güçlü okullar" (topTier) listesine koyalım?
- İlk partide hangi okullarla başlayalım?
Onayımı bekle.

## 3. Program başına toplanacak bilgi

Kaynak: ilgili dönemin enstitü ilanı ve kontenjan tablosu (çoğu zaman PDF), program sayfası, enstitü yönetmeliği/uygulama esasları.
- Ad, derece (tezli YL / tezsiz YL / doktora), eğitim dili, süre.
- ALES: kabul edilen puan türleri (types), taban puan, GNO'ya bağlı kademe varsa tiers; tezsizde ALES aranmıyorsa notRequired.
- Yabancı dil: YDS / YÖKDİL / eşdeğer (IELTS, TOEFL) taban puanları; İngilizce programlarda daha yüksek olabilir.
- GNO tabanı ve ölçek.
- Kabul edilen lisans bölümleri (priorDegree.accepted). Mimarlık mezununa kapalıysa closedToArchitects: true ve eklemeyi bana sor. Bilimsel hazırlık / eksik ders koşulu (prep).
- Değerlendirme formülü (scoring), mülakat / yazılı sınav / portfolyo / proje sunumu (exams, portfolio), varsa portfolyo biçimi.
- Kontenjan (quota), kurum içi/dışı, yabancı uyruklu ayrımı varsa notta.
- Dönemler: güz ve bahar ayrı Intake kayıtları. Program bahar döneminde öğrenci almıyorsa offered: "no". Başvuru turları (rounds) ve adımlar (steps: mülakat/sınav günü, sonuç ilanı, kesin kayıt).
- Ücret: devlet tezliler genelde ücretsiz/harçlı, tezsizler ücretli; vakıf üniversitelerinde dönem ya da kredi başına ücret; para birimi TRY; per doğru olsun (dönem / yıl / toplam). Okul burs ve indirim oranları (scholarships).
- Bağlantılar (program sayfası, ilan, kontenjan PDF'i) ve sources; verifiedAt.

## 4. Tarihler

- Mezuniyet tarihime göre ilk girebileceğim dönemden başla (CLAUDE.md'de yazıyor; yoksa bana sor).
- Yayımlanmış ilan varsa kesin. Yoksa geçen yılın aynı dönem takvimini bir yıl kaydırıp tahmin yaz; note'a "2026 ilanından kaydırıldı" gibi kaynağını belirt.
- PDF ilanları indirip metne çevirerek oku. Sayfa açılmazsa "doğrulanmadı" diye not düş; uydurma.

## 5. Partiler

- Her partide 4–6 okul. Her partiden sonra: npm run check, typecheck, test; commit (örn. "Add Turkey data: İTÜ, YTÜ, MSGSÜ"); bana kısa özet:
  - eklenen okul ve program sayısı,
  - kesin / tahmin dağılımı,
  - doğrulanamayanlar (madde madde, nedeniyle),
  - dikkat çeken bulgular (örn. "bahar döneminde öğrenci almıyor", "yalnızca EA kabul ediyor", "portfolyo + çizim sınavı var").
- Sonra "sıradaki partiye geçeyim mi?" diye sor.
- docs/research-notes.md'ye yöntem, kaynaklar ve doğrulanamayanları yaz; CLAUDE.md 7. bölümü güncelle.

## 6. Türkiye rehberi (src/content/TurkeyGuide.tsx)

Tüm partiler bitince Türkiye ülke sayfasında görünecek kısa bir rehber yaz. Bölümler: Başvuru nasıl işler; ALES puan türleri ve hangi programın hangisini istediği (veriden özet); İngilizce şartları; tezli mi tezsiz mi; mülakat, portfolyo ve proje sunumuna hazırlık; mimarlık dışı alanlara (planlama, peyzaj, gayrimenkul) geçerken bilimsel hazırlık; burs ve finansman (TÜBİTAK, okul bursları); bahar döneminde başlamak isteyenler için hangi programlar bahar alıyor (veriden). Genel tavsiye kısmında sayı uydurma; sayılar veriden gelsin.

Arayüzde Türkiye programlarına bak (ekran görüntüsü) ve göze batan bir sorun varsa düzelt.
````
