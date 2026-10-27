# Mimarlık Master Atlası: adım adım prompt seti

Bu klasördeki promptlar, bilgisayar mühendisliği için kurulmuş bir "Master Atlası" uygulamasının yapısından çıkarıldı ve mimarlık mezunu için uyarlandı. Promptları kendi Claude agent'ına sırayla verirsen, sana özel bir yüksek lisans araştırma aracı kurar.

## Sonunda elinde ne olacak

Yalnızca senin bilgisayarında çalışan bir web uygulaması:

- Türkiye ve yurt dışındaki, mimarlık mezununun başvurabileceği yüksek lisans programları. Ülkeye, şehre ve okula göre gruplanır.
- Her programın şartları: ALES (puan türüyle), YDS/IELTS/TOEFL, Almanca/İtalyanca seviyesi, GNO, portfolyo ve biçimi, mülakat veya çizim sınavı, lisans diplomanın kabul edilip edilmediği, ECTS.
- Dönem dönem başvuru tarihleri. Yalnızca tek dönem öğrenci alan programlar ayrıca işaretlenir.
- Ücretler (öğrenim ücreti, dönem katkı payı, eyalet ücreti), burslar, vize için geçim kanıtı.
- Profiline göre her programda uygunluk etiketi: uyuyor / sınırda / uymuyor / eksik bilgi.
- Programın o ülkede mimar olarak meslek odasına kayıt yolunda işe yarayıp yaramadığı.
- "Alanlar" sayfası: kentsel tasarım, restorasyon, bilişimsel tasarım gibi uzmanlıkları anlatır. Kafanda net bir alan yoksa buradan başlarsın.
- Takvim (telefon takvimine aktarılabilir), kısa liste, karşılaştırma, başvuru takibi.

## Gerekenler

- **Claude Code.** Masaüstü uygulamasındaki Code sekmesi ya da terminaldeki `claude` komutu. Normal sohbet ekranı (claude.ai sohbeti) dosya yazıp program çalıştıramadığı için yetmez. Agent'ın web araması ve web sayfası okuma izni açık olmalı.
- **Node.js 20 veya üstü** ve **git**. Agent yoksa kurmana yardım eder.
- Boş bir klasör, örneğin `Belgeler/mimarlik-atlasi`. Claude Code'u bu klasörde aç.
- Claude Code'u bulutta (claude.ai/code) kullanırsan da olur. Ama uygulamayı açıp kullanmak için projeyi kendi bilgisayarına indirip `npm run dev` çalıştırman gerekir.

## Nasıl kullanılır

1. Promptları **sırayla** ver. Biri bitmeden diğerine geçme.
2. Her dosyada iki parça var: üstte sana açıklama, altta kod kutusunun içinde **agent'a yapıştıracağın metin**. Yalnızca kutunun içini kopyala.
3. `[KÖŞELİ PARANTEZ]` içindeki yerleri kendin doldur.
4. Agent her adımın sonunda üç şey söylemeli: ne yaptı, neyi **doğrulayamadı**, ne kaldı. Söylemezse sor.
5. Veri adımları (6, 7, 8) uzun sürer. Agent bir partiyi bitirip "devam edeyim mi?" diye sorunca "devam" de. Prompt 7'yi her ülke için ayrı ayrı verirsin.
6. Sohbet çok uzarsa yeni oturum açabilirsin. Kurallar `CLAUDE.md` dosyasında durduğu için agent onu okuyup kaldığı yerden devam eder. Yeni oturumda "CLAUDE.md'yi oku, son commit'lere bak, X adımına devam et" demen yeter.
7. **Sayılara körü körüne güvenme.** Agent her tarihi `kesin` (resmi ilan) ya da `tahmin` diye işaretleyecek. Başvurmadan önce resmi sayfaya bir de kendin bak.

## Sıra

| #  | Dosya                         | Ne yapar                                                     |
| -- | ----------------------------- | ------------------------------------------------------------ |
| 1  | `01-tanisma-ve-kurallar.md` | Agent seni tanır, hedefini sorar, proje kurallarını yazar. Kod yok. |
| 2  | `02-iskelet-ve-sema.md`     | Proje iskeleti, veri şeması, veri doğrulama betiği.         |
| 3  | `03-mantik-ve-testler.md`   | Uygunluk, maliyet, tarih, filtre, takvim hesapları ve testleri. |
| 4  | `04-arayuz-1.md`            | Tasarım, program listesi ve filtreler, okul/program sayfaları, profil. |
| 5  | `05-arayuz-2.md`            | Bugün, Takvim, Karşılaştır, Takip, Ülkeler, Alanlar sayfaları. |
| 6  | `06-turkiye-verisi.md`      | Türkiye'deki programları araştırıp ekler.                    |
| 7  | `07-yurt-disi-verisi.md`    | Bir yurt dışı ülkesini araştırıp ekler. Her ülke için tekrar. |
| 8  | `08-burslar.md`             | Burslar, geçim kanıtı (bloke hesap), Burslar sayfası.       |
| 9  | `09-son-kontrol.md`         | Bütün veriyi ve arayüzü denetler, README yazar.              |
| A  | `ek-a-arastirma-raporu.md`  | İsteğe bağlı: claude.ai'da bir ülke için araştırma raporu istemek. |
| B  | `ek-b-rapor-dogrulama.md`   | Getirdiğin bir raporu doğrulatıp uygulamaya eklemek.        |
| C  | `ek-c-donemsel-guncelleme.md` | Başvuru ilanları çıktıkça veriyi güncellemek.              |

Adım 1–5 birkaç saatte biter. Veri adımları okul sayısına göre günlere yayılabilir; acele etme, partiler halinde ilerle.

## Bilmen gereken birkaç şey

- Promptlarda geçen okul ve program adları **ipucudur**, ezberden yazılmıştır. Agent her birini resmi sayfadan doğrulamadan eklememeli; programı olmayan okulu elemeli.
- Promptlarda tarihli birkaç sayı var (Almanya bloke hesap tutarı, İtalya ve Avusturya geçim kanıtı, Baden-Württemberg AB dışı ücreti). Bunlar Ekim 2026'da başka bir proje için resmi kaynaktan doğrulandı. Yine de agent bunları tekrar kontrol edecek.
- Kişisel bilgilerin (GNO, puanlar) `CLAUDE.md` dosyasına yazılacak. Projeyi ileride GitHub'a açık olarak koyarsan bu dosyayı gözden geçir.
