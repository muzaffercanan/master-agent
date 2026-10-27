# Prompt 7: Yurt dışı verisi (her ülke için ayrı ayrı)

Bu promptu **her ülke için bir kez** verirsin. Başındaki `[ÜLKE]` yerine ülke adını yaz (örn. "Almanya"). İlk ülke bitmeden ikinciye geçme.

Yurt dışında en çok yanlış çıkan bilgiler: **eğitim dili** (Almanya ve Avusturya'da mimarlık yüksek lisanslarının çoğu Almanca), **son başvuru tarihi** (AB dışı adaylar için daha erken), **portfolyo şartları** ve **gizli ücretler**. Agent bunları özellikle programın kendi sayfasından kontrol edecek.

Aşağıdaki kutunun içini kopyalayıp agent'a yapıştır (ülke adını doldurmayı unutma):

````text
CLAUDE.md'yi ve docs/research-notes.md'yi oku. Şimdi şu ülkenin verisini ekleyeceğiz: [ÜLKE]. CLAUDE.md'deki doğrulama protokolüne ve "sık görülen hatalar" listesine harfiyen uy.

## 1. Ülke dosyası (data/countries/<kod>.json)

Resmi kaynaklardan doldur; her bilgi için kesin/tahmin kararı ver, kaynak linkini sources'a ekle:
- terms (dönem adları ve başlangıç ayları), currency, summary.
- languageNote: bu ülkede mimarlık ve ilgili alanlarda yüksek lisansların eğitim dili durumu; İngilizce program sayısı az mı çok mu.
- facts: AB dışı (Türk vatandaşı) için öğrenim ücreti kuralları; başvuru portalı ve ön koşullar; diploma tanıma ve not dönüşümü; vize türü ve vize başvurusu için ne zaman hazır olmak gerektiği; tipik son başvuru dönemi.
- gpaConversion (gerekiyorsa): Almanya için Bavyera formülü. Benim üniversitemin hangi not sisteminde değerlendirildiğini (uni-assist / anabin / ilgili resmi tablo) araştır; Nmax ve Nmin'i ona göre yaz, status ve note'u doldur. Bağlayıcı değerin uni-assist VPD'sinde çıktığını note'a yaz.
- regionalFees: eyalet/bölge ücretleri.
- proofOfFunds: vize için geçim kanıtı (tutar, kabul edilen yollar, kaynak). Prompt 8'de ayrıca gözden geçireceğiz; burada temel kaydı oluştur.
- profession: bu ülkede yabancı diplomayla mimar olarak meslek odasına kaydolmanın yolu; 4 yıllık (240 ECTS) Türk mimarlık lisansının ve yüksek lisansın bu yolda nasıl sayıldığı; mesleki deneyim şartı. Kaynak meslek odası ya da resmi tanıma kurumu olsun. Emin olamadığın yeri "doğrulanmadı" diye yaz; bu konu yanlış yazılırsa kararlarımı etkiler.
- timeline: dil sınavı dönemleri (gerekiyorsa), vize randevu uyarıları, ulusal burs çağrıları.

## 2. Ülkeye özgü ipuçları

Aşağıdakiler ipucudur; okul ve program adları ezberden yazıldı. Her birini resmi sayfadan doğrula, programı olmayanı ya da mimarlara kapalı olanı ele, listede olmayanları ekle.

Almanya
- Arama: DAAD International Programmes veritabanı, hochschulkompass.de, okul siteleri. DAAD veritabanı eksik olabilir; okulun kendi listesine de bak.
- Aday okullar: Stuttgart (ITECH vb.), Bauhaus-Universität Weimar, HafenCity Universität Hamburg, TU Berlin, TU München, RWTH Aachen, TU Darmstadt, KIT, TU Dresden, Leibniz Universität Hannover, BTU Cottbus-Senftenberg, Hochschule Anhalt (Dessau), TU Braunschweig, Universität der Künste Berlin, uygulamalı bilimler üniversiteleri (HAW/FH).
- Dikkat: Almanca öğretilen programları benim Almanca hedefime göre ekle (CLAUDE.md'ye bak; belirsizse sor). APS sertifikası, uni-assist VPD ve ücreti, anabin'de okulumun statüsü. Konsekutif "M.A./M.Sc. Architektur" ile uzmanlaşma masterları ayrımı (licensure). Kış ve yaz dönemi ayrı; AB dışı son tarih genelde daha erken. Eyalet ücretleri: Baden-Württemberg AB dışı öğrenciden dönem başına 1.500 € alıyor (Ekim 2026'da doğrulandı; yine kontrol et). TUM AB dışı öğrenciden öğrenim ücreti alıyor (Ekim 2026'da doğrulanan: yüksek lisansta 4.000 veya 6.000 €/dönem, 2027/28 kışından itibaren yeni başlayanlara 4.600 veya 6.800 €/dönem; mimarlık programının hangi kademede olduğuna bak). Dönem katkı payı (Semesterbeitrag) okula göre değişir ve öğrenim ücreti değildir.

İtalya
- Arama: Universitaly, okul siteleri. Mimarlıkta "Laurea Magistrale" sınıfı LM-4 (ve planlama için LM-48, peyzaj için LM-3; doğrula).
- Aday okullar: Politecnico di Milano, Politecnico di Torino, IUAV Venezia, Sapienza Roma, Università di Firenze, Federico II Napoli, Bologna, Genova, Roma Tre, Palermo.
- Dikkat: Universitaly ön kaydı ve vize takvimi; Dichiarazione di Valore (DOV) ya da CIMEA belgesi; okulların ön değerlendirme (pre-evaluation) son tarihleri (genelde çok erken ve birden fazla tur); portfolyo ve niyet mektubu; İngilizce ve İtalyanca öğretilen programlar ayrı; öğrenim ücretinin ISEE / ISEE parificato'ya göre hesaplanması ve AB dışı öğrenciler için sabit ücret uygulaması (okula göre değişir); bölgesel vergi (tassa regionale) ayrı satır. Bazı okulların siteleri otomatik okumayı engelliyor; tarayıcıda aç. Erişemediğin bilgiyi üçüncü taraftan alırsan tahmin yaz.

Avusturya
- Arama: studyinaustria.at, okul siteleri, OeAD.
- Aday okullar: TU Wien, TU Graz, Universität Innsbruck, Universität für angewandte Kunst Wien, Akademie der bildenden Künste Wien, Kunstuniversität Linz.
- Dikkat: Kamu üniversitelerinde AB dışı öğrenim ücreti (Ekim 2026'da doğrulanan: dönem başına 726,72 €, ÖH ücreti ayrı); sanat akademilerinde giriş sınavı (Aufnahmeprüfung) ve portfolyo, tarihleri çok erken olabilir; Almanca seviye şartı (bazen kayıtta, bazen ilk yıl sonunda); önceki eğitim uyumu (eksik ECTS ek ders olarak verilebilir).

Başka bir ülke
- Ülkenin resmi yükseköğretim portalı ve okul siteleri. AB dışı öğrenim ücreti (bazı ülkelerde çok yüksek), dil, portfolyo, vize geçim kanıtı. Ücret yüksekse bunu ülke özetinde açıkça yaz.

## 3. Aday listesi (önce bana göster)

Tablo: okul, şehir, tür (üniversite / teknik / uygulamalı bilimler / sanat akademisi), program adı (orijinal adıyla), alan (fields anahtarı), eğitim dili, mimarlara açık mı, kaynak linki. İlgi alanlarıma, dil durumuma ve bütçeme göre öncelik sırasına koy. "Benim seçtiğim okullar" (topTier) listesine hangilerini koyalım diye sor. Hangi partiyle başlayacağımızı sor ve onayımı bekle.

## 4. Program başına toplanacak bilgi

Kaynak: programın kendi sayfası, başvuru sayfası, kabul yönetmeliği (Zulassungsordnung, bando, Studienplan), okulun ücret sayfası.
- Ad, orijinal ad, derece, eğitim dili (her zaman programın kendi sayfasından), süre ve ECTS. Türk 4 yıllık lisansla süre farklıysa durationNote.
- Dil şartları: İngilizce (IELTS, TOEFL, Cambridge; MOI kabul ediliyor mu), diğer diller (CEFR seviyesi, kabul edilen sertifikalar, ne zaman gerektiği).
- Portfolyo: zorunlu mu, biçim (tek PDF, sayfa sayısı, MB sınırı, kâğıt boyutu), içerik beklentisi, ayrı son tarih varsa step olarak.
- Sınav/mülakat/tasarım ödevi (exams), varsa tarihleri step olarak.
- Kabul edilen lisans bölümleri, gerekli toplam ECTS (240 / 300), ders alanı şartları (örn. tasarım stüdyosu ECTS'i), mesleki deneyim.
- Not şartı: Almanya'da Alman notu tavanı (deMax), başka ülkelerde ne istendiği.
- Dönemler: her dönem ayrı Intake. Yalnızca kışın (ya da güzün) alıyorsa öteki döneme offered: "no". AB dışı pencere ayrı tur (audience "non-eu"). Ön değerlendirme turları ayrı tur.
- Portal (uni-assist, Universitaly, okulun portalı).
- Ücretler: öğrenim ücreti (AB dışı ayrı), dönem katkı payı, bölgesel/eyalet ücreti, başvuru ücreti, servis ücreti; per doğru olsun.
- licensure: konsekutif mimarlık masterı mı, uzmanlaşma masterı mı; meslek odası yolunda sayılıyor mu (bilinmiyorsa unknown).
- Burslar (okulun kendi bursları; ulusal burslar ülke dosyasında).
- Bağlantılar, sources, verifiedAt.

## 5. Partiler

- Her partide 3–5 okul. Her partiden sonra: npm run check, typecheck, test; commit; bana kısa özet: eklenenler, kesin/tahmin dağılımı, doğrulanamayanlar (nedeniyle), dikkat çeken bulgular (örn. "eğitim dili aslında Almanca", "yalnızca kış dönemi", "portfolyo son günü başvurudan 1 ay önce", "AB dışı 1.500 €/dönem eyalet ücreti"). Sonra "sıradaki partiye geçeyim mi?" diye sor.
- Almanca öğretildiği için eklemediğin ama ileride eklenebilecek programları okul özetinde (admissionsSummary) "eklenmedi: …" diye yaz ve research-notes'a listele.
- docs/research-notes.md'ye yöntem, kaynaklar, doğrulanamayanlar; CLAUDE.md 7. bölümü güncelle.

## 6. Ülke rehberi (src/content/<Ülke>Guide.tsx)

Ülke bitince ülke sayfasında görünecek kısa bir rehber yaz: başvuru takvimi özeti (veriden), dil durumu, portfolyo ipuçları (bu ülkenin programlarının ortak beklentileri), maliyet özeti (veriden), meslek ve tanınma özeti, ve benim profilime göre bir başvuru portföyü önerisi: "güvenli / orta / hayal" diye üçe ayrılmış program listesi, her biri için neden. Öneride sayılar veriden gelsin.

Arayüzde bu ülkenin programlarına bak (ekran görüntüsü) ve göze batan sorun varsa düzelt.
````
