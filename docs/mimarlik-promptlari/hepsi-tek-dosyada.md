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


---

# Prompt 1: Tanışma, hedef ve proje kuralları

Bu adımda kod yazılmaz. Agent sana sorular sorar (GNO, sınavlar, portfolyo, ülkeler, bütçe, ilgi alanları), sonra projenin kural dosyasını (`CLAUDE.md`) yazar. Bu dosya sonraki bütün adımların temelidir; agent her oturumda onu okur.

Bilmediğin sorulara "bilmiyorum" de. Kararsız olduğun konularda (hangi alan, hangi ülke) geniş tut; daraltmayı uygulama kurulduktan sonra yaparsın.

Aşağıdaki kutunun içini kopyalayıp agent'a yapıştır:

````text
Merhaba. Benim için "Mimarlık Master Atlası" adlı, yalnızca bilgisayarımda çalışan bir web uygulaması kuracağız. Bu ilk adımda kod yazma. Önce beni tanı, sonra projenin kurallarını CLAUDE.md'ye yaz. Benimle her zaman Türkçe konuş.

## Proje ne olacak

Türkiye ve yurt dışındaki, mimarlık mezununun başvurabileceği yüksek lisans programlarını araştırmak için bir araç. Ben mimarlık son sınıf öğrencisiyim. Hangi alanda yüksek lisans yapacağım henüz net değil; uygulama seçenekleri göstermeli ve daraltmama yardım etmeli. Önemli kural: uygulamaya yalnızca mimarlık lisans diplomasıyla gerçekten başvurulabilen programlar girer. Bir program yalnızca başka bölüm mezunlarını alıyorsa eklenmez ya da "mimarlara kapalı" diye işaretlenir.

Uygulama şunları yapabilmeli:
- Türkiye ve yurt dışı ayrı ayrı; ülkeye, şehre/bölgeye ve okula göre gruplanıp filtrelenebilmeli.
- Okul okul ve program program şartlara bakılabilmeli.
- Şartlar liste halinde filtrelenebilmeli: başvuru tarihleri (her dönem ayrı ayrı; yalnızca tek dönem öğrenci alan programlar ayrıca belirtilmeli), ALES (puan türüyle: SAY/EA/SÖZ), YDS/YÖKDİL/IELTS/TOEFL, Almanca/İtalyanca vb. dil seviyesi, GNO, portfolyo şartı ve biçimi, mülakat / çizim sınavı / tasarım ödevi, lisans diplomasının kabul edilip edilmediği (mimarlık, iç mimarlık, peyzaj, şehir planlama…), gereken toplam ECTS ve ders uyumu, ücret var mı ve ne kadar, bölgesel/eyalet ücreti, burslar.
- Profilime göre her yerde uygunluk etiketi çıkmalı: uyuyor / sınırda / uymuyor / eksik bilgi.
- Bir yüksek lisansın o ülkede mimar olarak meslek odasına kayıt yolunda işe yarayıp yaramadığı görülebilmeli; bilinmiyorsa "bilinmiyor" yazmalı.
- "Alanlar" sayfası: her uzmanlık alanını (kentsel tasarım, restorasyon, bilişimsel tasarım…) anlatmalı ve o alandaki programlara götürmeli.
- Takvim (.ics olarak dışa aktarma), kısa liste, karşılaştırma (en fazla 4 program), başvuru takibi (belge listesi, portfolyo dahil).

Teknik çerçeve (değiştirme; daha iyi bir önerin varsa önce sor): Vite 5 + React 18 + TypeScript, react-router (HashRouter), zod, vitest. Sunucu ve veritabanı yok. Araştırma verisi data/**/*.json dosyalarında durur ve derleme anında yüklenir. Benim kişisel verim (profil, kısa liste, karşılaştırma, takip) yalnızca tarayıcının localStorage'ında durur.

## Önce bana sor

Soru sorma aracın (AskUserQuestion gibi) varsa onu kullan, yoksa soruları numaralı liste halinde tek mesajda sor. "Bilmiyorum" dediğim yerde makul bir varsayılan öner ve bunu not al.

1. Üniversitem, bölümüm (Mimarlık / İç Mimarlık / …), lisans süresi (genelde 4 yıl, 8 dönem, 240 ECTS; transkriptime göre) ve beklenen mezuniyet tarihim.
2. GNO'm ve ölçeği (4'lük / 100'lük).
3. Sınavlar: ALES (hangi puan türleri ve puanları), YDS/YÖKDİL, IELTS/TOEFL; varsa Almanca, İtalyanca veya başka dil seviyem (A1–C2). Henüz girmediysem ne zaman girmeyi düşündüğüm.
4. Portfolyom ne durumda (yok / taslak / hazır). Staj ya da ofis deneyimim (ay olarak). Kullandığım yazılımlar (isteğe bağlı).
5. Hangi ülkeler. Varsayılan: Türkiye, Almanya, İtalya, Avusturya. Eklemek istediklerim olabilir (Hollanda, İsviçre, İspanya, Portekiz, Polonya…). Her aday ülke için eğitim dili ve kabaca maliyet durumunu birer cümleyle söyle ama sayı uydurma; emin olmadığını "doğrulanacak" diye belirt.
6. Bütçe: öğrenim ücreti ödeyebilir miyim, yılda en fazla ne kadar; burs şart mı; vize için istenen geçim kanıtını (Almanya'da bloke hesap) karşılayabilir miyim.
7. İlgi alanlarım (çoklu seçim). Her alanı bana tek cümleyle açıkla. "Hepsi açık kalsın, sonra daraltırız" da bir seçenek olsun:
   - Mimari tasarım (genel mimarlık yüksek lisansı)
   - Kentsel tasarım / urbanism
   - Şehir ve bölge planlama
   - Restorasyon, koruma, kültürel miras
   - Mimarlık tarihi, kuram, eleştiri
   - Yapı bilgisi, yapı teknolojisi, cephe, yapı fiziği
   - Sürdürülebilir / ekolojik / enerji etkin mimarlık, iklim
   - Bilişimsel tasarım, dijital üretim, mimari bilişim (parametrik tasarım, robotik üretim, BIM)
   - Peyzaj mimarlığı
   - İç mimarlık, mekân ve sergi tasarımı
   - Proje ve yapım yönetimi, gayrimenkul geliştirme
   - Diğer (aydınlatma, akustik, afet ve dayanıklı yapılar…)
8. Hedefim: akademi/doktora, uzmanlaşıp sektörde çalışmak, yurt dışında yaşayıp mimar olarak çalışmak, ya da henüz belirsiz.
9. Başlamak istediğim dönem(ler). Mezuniyet tarihime göre ilk girebileceğim dönemi sen hesapla ve bana söyle.
10. Tezli / tezsiz tercihim; çalışarak okumak isteyip istemediğim.

Cevaplarımı aldıktan sonra kısa bir özet çıkar ve "doğru mu?" diye sor. Onaylarsam devam et.

## Sonra şunları yap

1. Bu klasörde git deposu başlat (dal adı main). .gitignore: node_modules, dist, .DS_Store.
2. Aşağıdaki iskelete göre CLAUDE.md yaz. Başlıkları koru, içeriği benim cevaplarıma göre doldur. 3. ve 4. bölümler sonraki adımda dolacak; şimdilik "Prompt 2'de doldurulacak" yaz.
3. docs/research-notes.md oluştur: "Yöntem", "Açık işler", "Doğrulanamayanlar" başlıklarıyla boş iskelet.
4. Kalıcı hafıza özelliğin varsa profilimin kısa özetini oraya da yaz.
5. Commit at (mesaj İngilizce, emir kipinde, örn. "Add project rules"). Bana CLAUDE.md'nin özetini ve hangi varsayılanları kullandığını göster.

## CLAUDE.md iskeleti

# Mimarlık Master Atlası: Claude için proje rehberi
Bu dosyayı her oturumun başında oku. Buradaki kurallar kullanıcıyla birlikte belirlendi; bozmadan çalış.

## 1. Proje nedir
(Yukarıdaki "Proje ne olacak" bölümünün özeti. Kapsamdaki ülkeler. Uygulamanın yapabilmesi gerekenler madde madde.)

## 2. Kullanıcı ve iletişim
- Her zaman Türkçe konuş. Kod, dosya adı ve commit mesajı hariç kullanıcıya dönük her metin Türkçe; arayüz metinleri de Türkçe.
- Kullanıcı profili: (bölüm, üniversite, GNO ve ölçek, sınavlar, diller, portfolyo durumu, deneyim, hedef, bütçe, ilgi alanları, hedef dönem).
- Kısa, açık cümlelerle yaz. Süslü anlatım, abartı ve tahmin dolu özet yok.
- Raporlarken dürüst ol: yapılmayanı yapılmış, doğrulanmayanı doğrulanmış gibi sunma. "Doğrulandı" demeden önce gerçekten resmi kaynağa bakmış ol.
- Kullanıcı bir araştırma raporu, dosya veya ekran görüntüsü verirse içindeki her sayıyı yeniden kontrol et ve düzeltmeleri açıkça söyle.
- Büyük bir yönü değiştirmeden önce sor; küçük ve geri alınabilir işi sormadan yap.

## 3. Komutlar
(Prompt 2'de doldurulacak.)

## 4. Mimari
(Prompt 2'de doldurulacak.)

## 5. Veri kuralları
- Önce şemayı güncelle (src/schema/index.ts), sonra veriyi, sonra arayüzü. Şema dışı alan ekleme.
- JSON biçimi: 2 boşluk girinti, UTF-8, sonda satır sonu, Türkçe karakterler kaçışsız, satır sonları LF. Python ile toplu düzenleme yaparsan PYTHONIOENCODING=utf-8 ayarla ve dosyayı newline='\n' ile yaz.
- Dönemler: Türkiye ve İtalya güz/bahar, Almanya ve Avusturya kış/yaz (WiSe/SoSe). Bir program o dönemde öğrenci almıyorsa offered: "no" yaz; bilmiyorsan "unknown"; uydurma. Program kendi dönem listesini tanımlarsa okulunkini tamamen ezer; bu yüzden program düzeyinde iki dönemi de yaz.
- Erken / normal / geç / ek tur ve AB dışı pencereler ayrı ayrı girilir. Portfolyo yükleme, çizim sınavı, mülakat ve sonuç tarihleri başvuru turundan ayrı "adım" olarak girilir.
- kesin = yayımlanmış resmi ilan. tahmin = geçen yılın takvimi, üçüncü taraf kaynak ya da çelişen kaynaklar. Resmi kaynaktan doğrulanmayan hiçbir tarih kesin yazılmaz. Çelişkide erken (güvenli) tarihi yaz, note alanına hangi kaynağın ne dediğini yaz. İlan çıkınca tahmin'i kesin'e çevir.
- Her okul kaydında verifiedAt var. Yalnızca kaynağa gerçekten baktığında güncelle. 90 günden eski kayıt arayüzde "doğrulanmadı" etiketi alır.
- Para: tutar + para birimi + periyot (dönem / yıl / ay / toplam / bir kez). Öğrenim ücreti, dönem katkı payı (Semesterbeitrag, ÖH, tassa regionale) ve bölgesel/eyalet ücreti ayrı alanlardır; karıştırma. Ücretsiz görünen bir okulun eyalet ücreti olabilir; mutlaka bak. AB dışı ücret farklıysa ayrı yaz (Türk vatandaşı yurt dışında AB dışı sayılır).
- Bilinmeyen değeri boş bırak ya da unknown/varies yaz. Uydurma sayı yazma.

## 6. Doğrulama protokolü
Kaynak sırası:
1. Üniversitenin / enstitünün resmi ilanı, program sayfası, kontenjan tablosu, başvuru kılavuzu, yönetmelik PDF'i.
2. Resmi kurumlar: ÖSYM, YÖK, TÜBİTAK, DAAD, uni-assist, Universitaly, CIMEA, OeAD, büyükelçilik ve konsolosluklar, meslek odaları (Mimarlar Odası, Architektenkammer, Ordine degli Architetti, Kammer der Ziviltechniker).
3. Üçüncü taraf siteler (MastersPortal, bloglar, forumlar, yapay zekâ raporları) yalnızca ipucudur; buradan gelen sayı tek başına kesin olamaz.

Kurallar:
- Bir sayfa yüklenmezse (PDF, bot engeli) o veriyi "doğrulanmadı" diye işaretle; ezber sayıyla doldurma. Web özet araçları hata yapabilir; kritik sayıları (ücret, son gün, dil şartı) sayfanın kendisinden teyit et. PDF'leri indirip metne çevirerek oku.
- Bağlantı denetimi betiği bot isteklerine 403/404 dönen siteleri kırık sanabilir; böyle bir bağlantıyı tarayıcıda açıp bak.
- Kullanıcıya özet verirken doğrulanamayanları ayrıca say.

Bu tür projelerde sık görülen hatalar (yeni kayıt eklerken ve rapor doğrularken bunları ara):
- Eğitim dili yanlış: İngilizce sanılan program aslında Almanca/İtalyanca ya da karışık. Almanya ve Avusturya'da mimarlık yüksek lisanslarının çoğu Almanca; programın kendi sayfasına bak.
- Son tarih yanlış: "açık kabul" ya da "Mayıs–Temmuz" denen başvurunun aslında Ocak'ta kapanması. AB dışı adaylar ve uni-assist üzerinden başvuranlar için pencere çoğu zaman daha erken.
- Tek dönem: program yalnızca kışın (ya da yalnızca güzün) öğrenci alıyor ama "iki dönem" yazılmış.
- Gizli ücretler: başvuru ücreti, AB dışı servis ücreti, eyalet ücreti (Baden-Württemberg AB dışı öğrenciden dönem başına 1.500 € alıyor; Ekim 2026'da doğrulandı), okul bazında AB dışı öğrenim ücreti.
- Dönem katkı payının öğrenim ücretiyle karıştırılması.
- İngilizce eğitim belgesinin (MOI) kabul edilmediği programlarda kabul ediliyor yazılması.
- Zorunlu bir şartın atlanması: GRE, APS belgesi, anabin statüsü, ön değerlendirme, yetenek sınavı.
Mimarlığa özgü olanlar:
- Portfolyonun son günü başvurunun son gününden önce olabilir; biçim şartları (sayfa sayısı, MB sınırı, A3/A4, tek PDF) programdan programa değişir.
- 4 yıllık (8 dönem, 240 ECTS) Türk lisansıyla bazı yurt dışı programlar daha uzun (ya da daha kısa) sürer; bazıları toplam 300 ECTS'ye tamamlamayı şart koşar.
- Bir yüksek lisans meslek odasına kayıt yolunda sayılmayabilir: "konsekutif mimarlık" masterı ile uzmanlaşma masterı (kentsel tasarım, bilişimsel tasarım…) farklıdır. Emin değilsen "bilinmiyor" yaz.
- Türkiye'de ALES puan türü (SAY/EA/SÖZ) programdan programa değişir; yalnızca taban puanı yazmak yetmez. Mimarlık dışı mezunlara bilimsel hazırlık verilebilir; mimarlık mezununa açık mı, ilandan bak.

## 7. Durum ve açık işler
(Her adımın sonunda güncelle: ne bitti, ne kaldı, neyi doğrulayamadın.)

## 8. Arayüz kuralları
- Arayüz bir araştırma aracı: sakin, yoğun ama okunur; pazarlama sayfası değil. Gradient'li büyük başlık alanı, bölüm başlarında emoji, her şeyin ortalanması, her kutuda yuvarlak köşe + gölge gibi klişelerden kaçın.
- Stil yalnızca tasarım tokenlarıyla. Açık tema :root'ta tam tanımlı; koyu tema @media (prefers-color-scheme: dark) içinde :root:not([data-theme="light"]) korumasıyla ve ayrıca :root[data-theme="dark"] altında yeniden tanımlanır. Her renk iki temada da okunmalı. Gövdeye açık bir arka plan token'ı ver.
- Sayı sütunlarında tabular-nums.
- Mobilde (360 px) yatay sayfa kaydırması olmamalı; yalnızca tablolar kendi kapsayıcısında kayabilir.
- Klavye odağı görünür kalmalı, prefers-reduced-motion desteklenmeli, kontrast en az 4,5:1.
- kesin / tahmin / eksik bilgi gibi durum etiketleri tutarlı ve sade olmalı. Bir bilgi tahminse kullanıcı bunu bir bakışta görebilmeli.
- Arayüz değişikliğinden sonra ekran görüntüsü al ve bak: masaüstü + mobil + koyu tema. Konsolda hata olmamalı.
- Test için tarayıcıya profil yüklersen işin bitince temizle; kullanıcının kendi verisini silme.

## 9. Git
- Dal main. Kullanıcı istemeden dışarıya push etme, uzak depo ekleme.
- Küçük, tek amaçlı commit'ler; mesaj İngilizce, emir kipinde, ilk satırı kısa.
- dist/ ve node_modules/ git'e girmez. Geçici dosyalar depoya değil, geçici bir klasöre.
- Yıkıcı işlem (reset --hard, dosya silme, veri kaybettiren toplu dönüşüm) kullanıcıya sormadan yapılmaz. Toplu dönüşümden önce her şeyin commit'li olduğundan emin ol.

## 10. İş başlamadan önce kontrol listesi
1. Bu dosyayı ve docs/research-notes.md'yi oku. git status ve git log ile son durumu gör.
2. Veriye dokunacaksan: şemayı oku, kaynağı resmi sayfadan aç, kesin/tahmin kararını ver, note ve verifiedAt'i yaz.
3. Mantığa dokunacaksan: önce teste ekle.
4. Arayüze dokunacaksan: tokenlara bağlı kal, iki tema + mobil kontrol et.
5. Bitirirken: check, typecheck, test; gerekirse build; sonra commit; kullanıcıya neyin yapıldığını, neyin doğrulanamadığını ve neyin kaldığını söyle.
````


---

# Prompt 2: Proje iskeleti, veri şeması ve veri doğrulama

Bu adımda agent projeyi kurar ve uygulamanın kalbini yazar: **veri şeması**. Şema, bir programın hangi bilgileri taşıyacağını (ALES puan türü, portfolyo biçimi, dil seviyesi, dönemler, ücretler…) tanımlar. Her JSON dosyası bu şemaya göre denetlenir; yanlış ya da eksik girilen veri yakalanır.

Bitince `npm run check` komutu çalışır ve "Veri geçerli" der. Henüz görünen bir arayüz yok.

Aşağıdaki kutunun içini kopyalayıp agent'a yapıştır:

````text
CLAUDE.md'yi oku. Şimdi proje iskeletini, veri şemasını ve veri doğrulama betiğini kuracağız. Arayüz bu adımda yok (yalnızca boş bir sayfa).

## 1. Kurulum

- package.json (type: module, engines node >=20). Bağımlılıklar: react 18.3, react-dom 18.3, react-router-dom 6.30, zod 3.25. Geliştirme: vite 5.4, @vitejs/plugin-react 4, typescript 5.9, vitest 2.1, tsx 4, @types/react, @types/react-dom, @types/node 20.
- Komutlar:
  - dev: vite (http://localhost:5173)
  - check: tsx scripts/check.ts (data/ altındaki her JSON'u şemaya ve çapraz referanslara göre doğrular)
  - test: vitest run
  - typecheck: tsc --noEmit
  - build: npm run check && tsc --noEmit && vite build
  - links: tsx scripts/links.ts (verideki bağlantıları dener; Prompt 9'da yazılacak, şimdilik boş betik)
- tsconfig: strict, moduleResolution bundler, jsx react-jsx.
- vite.config.ts: base "./" (dosyadan ya da statik hostingden açılabilsin).
- index.html: lang="tr", başlık "Mimarlık Master Atlası". Tema bayrağını (localStorage "maa_theme") React yüklenmeden önce küçük bir satır içi betikle <html data-theme> olarak uygula; böylece açılışta tema yanıp sönmez.
- .gitattributes: * text=auto eol=lf.
- Geliştirme sunucusunu başlatma aracın bir yapılandırma dosyası istiyorsa (örn. .claude/launch.json) "mimarlik-atlasi" adıyla npm run dev, port 5173 tanımla.

## 2. Klasör yapısı

data/
  countries/{tr,de,it,at,...}.json      ülke düzeyi bilgi (dosya adı = ülke kodu)
  universities/{ülke}/{okul-id}.json    okul + programları (okul başına bir dosya)
  scholarships/{id}.json                burs kayıtları (dosya adı = id)
  fields.json                           alan sözlüğü
  fx.json                               döviz kuru (EUR bazlı, tarihli)
src/
  schema/index.ts                       zod şeması: verinin tek doğruluk kaynağı
  data/dataset.ts                       saf: ham JSON → tipli veri + çapraz denetim (tarayıcıda, betikte ve testte çalışır)
  data/index.ts                         import.meta.glob ile JSON yükleme (eager)
  lib/                                  saf mantık (Prompt 3)
  state/                                localStorage deposu ve türetilmiş görünümler (Prompt 3)
  pages/ components/ content/           arayüz (Prompt 4–5)
  styles/                               tasarım tokenları ve stiller (Prompt 4)
scripts/check.ts, scripts/links.ts
docs/research-notes.md

## 3. Şema (src/schema/index.ts)

Aşağıdaki taslağı zod ile yaz. Alan adlarını İngilizce tut, her alanın üstüne ne işe yaradığını anlatan kısa bir yorum koy. Taslakta eksik ya da çelişkili bir şey görürsen yazmadan önce bana söyle.

Ortak tipler
- DateStr: "YYYY-AA-GG" regex.
- Status: "kesin" | "tahmin".
- Term: "fall" | "spring" | "winter" | "summer".
- Currency: EUR, TRY, USD, CHF, GBP (yeni ülke eklendikçe genişlet; fx.json'da kuru olmalı).
- Per: "semester" | "year" | "month" | "total" | "once".
- Audience: "all" | "eu" | "non-eu" | "tr".
- Lang: "tr" | "en" | "de" | "it" | "fr" | "nl" | "es" | "pt" (gerektikçe ekle).
- Cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2".
- AlesType: "SAY" | "EA" | "SÖZ".
- Money { amount (≥0), currency, per }.
- Link { label, url }.

Dönemler
- Round { name (varsayılan "normal"; örn. "erken", "geç", "ek tur", "AB dışı"), open?, deadline?, audience (varsayılan "all") }
- Step { label (örn. "Portfolyo yükleme", "Çizim sınavı", "Mülakat", "Sonuç ilanı", "Kesin kayıt"), date, end?, note? }
- Intake { term, cycle (örn. "2027-28"), offered: "yes" | "no" | "unknown", rounds: Round[] (varsayılan []), steps: Step[] (varsayılan []), status, note? }

Şartlar (Requirements)
- gpa? { min?, scale: 4 | 100 (varsayılan 4), deMax? (Alman notu tavanı 1.0–4.0, düşük iyi), note? }
- english? { ielts?, toefl?, yds?, yokdil?, cambridge?, moiAccepted? (İngilizce eğitim belgesi yerine geçer mi), note? }
- otherLanguages: { lang, min: Cefr, tests? (örn. "TestDaF 4×4, DSH-2, Goethe C1"), when? (örn. "başvuruda", "kayıtta", "1. yıl sonunda"), note? }[] (varsayılan [])
- ales? { types: AlesType[] (kabul edilen puan türleri), min?: AlesMin, notRequired?, note? }
  AlesMin = sayı | { default, tiers: { gpa, ales }[] } (GNO'ya bağlı kademe; ilk "gpa <= başvuranın GNO'su" kademesi geçerli; kademeler büyük GNO'dan küçüğe sıralı)
- gre? { policy: "required" | "recommended" | "optional" | "no", minQuant?, note? } (mimarlıkta nadir ama bazı programlarda var)
- portfolio? { policy: "required" | "recommended" | "no", format? (örn. "tek PDF, A3 yatay"), maxPages?, maxMB?, contents?: string[] (örn. "3 stüdyo projesi", "el çizimleri", "staj işleri"), note? }
- exams: { kind (örn. "çizim sınavı", "tasarım ödevi", "yazılı sınav", "mülakat", "yetenek sınavı / Aufnahmeprüfung"), note? }[] (varsayılan [])
- priorDegree? { accepted?: string[] (kabul edilen lisans bölümleri, örn. ["Mimarlık", "İç Mimarlık"]), closedToArchitects?: boolean, minEcts? (örn. 240 ya da 300), minSemesters?, prep? (bilimsel hazırlık / eksik ders koşulu), note? }
- ects? { total?, areas: { area, min }[] (örn. "Mimari tasarım stüdyosu: 60"), note? }
- workExperience? { months?, note? }
- scoring? (değerlendirme formülü, örn. "ALES %50 + GNO %30 + mülakat %20")
- documents?: string[] (programa özel belgeler)
- portal? (doğrudan, uni-assist, Universitaly, okulun portalı…)
- advisorLetter?: "required" | "recommended"
- note?

Ücretler
- Tuition { kind: "free" | "paid" | "covered" | "varies" | "unknown", fee?, feeNonEU?, note? }
- RegionalFee { region, fee, appliesTo: Audience, status, note? }
- Costs { tuition, semesterFee? (dönem katkı payı; öğrenim ücretinden ayrı), regionalFee?, applicationFee?, livingPerMonth?, note? }

Burs (kısa kayıt, program/okul/ülke içinde)
- Scholarship { name, provider, coverage, amount?, deadline?, audience (varsayılan "all"), link?, status (varsayılan "kesin"), ref? (data/scholarships içindeki tam kaydın id'si) }

Program
- id (yalnızca a-z 0-9 -), name, nameLocal? (orijinal dildeki adı), degree (insan okunur: "Tezli YL", "M.Sc.", "M.A.", "Laurea Magistrale (LM-4)"…)
- levels: ("master-thesis" | "master-nonthesis" | "master" | "phd")[] en az 1
- fields: string[] (fields.json anahtarları) en az 1
- languages: Lang[] en az 1 (eğitim dili)
- durationSemesters?, durationNote? (örn. "8 dönemlik lisansla 4 dönem, 6 dönemlik lisansla 6 dönem"), ects?
- licensure? { value: "yes" | "no" | "partial" | "unknown", note? } (o ülkede meslek odasına kayıt yolunda sayılıyor mu)
- intakes? (varsa okulunkini tamamen ezer), requirements?, costs?
- scholarships: Scholarship[] (varsayılan []), quota?, notes?, links: Link[] (varsayılan [])

University
- id, country (2 harf), name, short, city, region?, type: "state" | "foundation" | "private"
- kind: "university" | "technical" | "uas" (Fachhochschule/HAW) | "art" (sanat akademisi / güzel sanatlar üniversitesi)
- topTier (varsayılan false): kullanıcının kendi seçtiği güçlü okullar listesi (bir sıralama değil)
- languages: Lang[]
- rankings (varsayılan {}): { qsArch?: { year, rank: string } (QS konu sıralaması "Architecture & Built Environment"; "51–100" gibi bantlar metin olarak), theWorld?: { year, rank: string } }
- intakes: Intake[] (okul geneli; varsayılan []), requirements?, costs?, scholarships: Scholarship[]
- admissionsSummary?, fundingSummary?, people: string[] (öne çıkan hocalar, stüdyolar, araştırma grupları)
- links: Link[], sources: Link[], verifiedAt: DateStr
- programs: Program[] en az 1

Country
- code, name, flag (emoji ya da kısa metin), currency
- terms: Term → { name (örn. "Güz", "Wintersemester"), starts (örn. "Ekim") }
- summary
- gpaConversion? { method: "bavarian", nMax, nMin, status, note } (Almanya ve gerekiyorsa Avusturya için)
- languageNote? (o ülkede mimarlık programlarının dil durumu)
- profession? { body (meslek odası), path (yabancı diplomayla mimar olarak kayıt yolu), foreignDegree (Türk diplomasının durumu), status, source: Link }
- facts: { label, value, status (varsayılan "kesin") }[]
- proofOfFunds? { kind: "blocked-account" | "own-funds", amounts: { label, money }[], accepted: string[], note?, status, source: Link }
- regionalFees: RegionalFee[], scholarships: Scholarship[] (ulusal burslar)
- timeline: { s, e?, t, d?, k: Status, uni? }[] (sınavlar: ALES, YDS, TestDaF; ulusal burs çağrıları; vize dönemleri)
- sources: Link[], verifiedAt

Funding (data/scholarships/<id>.json; tam burs kaydı)
- id, name, provider, category: "tr" | "eu" | "de" | "it" | "at" | "other", hostCountries: string[] (iki küçük harf), hostNote?, summary
- level: "full" | "partial" | "small"
- tuition: "covered" | "waived" | "partial" | "free" | "not-covered" | "varies", tuitionNote?
- stipend?: Money, stipendNote?, extras: string[]
- blockedAccount: "replaces" | "partial" | "no" | "unknown" | "na", blockedAccountNote?
- turkish: "yes" | "no" | "conditional" (Türk vatandaşına açık mı)
- fieldFit: "yes" | "limited" | "no", fieldNote? (mimarlık ve ilgili alanlarda yüksek lisansı destekliyor mu)
- requirements?: Requirements, ageMax?, obligation? (zorunlu hizmet, geri ödeme)
- calls: { cycle, name?, open?, deadline?, status, note? }[]
- howToApply: string[], notes: string[]
- programs: { id, name, short, fields, countries, partners, scholarships: "yes" | "no" | "unknown", calls, stipend?, selfFundedFee?, requirements? (metin), note?, link }[] (Erasmus Mundus gibi çatı programların alt programları)
- links, sources (en az 1), verifiedAt

Diğer
- Fields: kayıt { n (ad), d (ne olduğu), note (kime uygun / dikkat) }
- Fx { date, source, perEUR: Currency → sayı (1 EUR kaç birim) }

Her tip için `export type X = z.infer<typeof X>` ver.

## 4. Çapraz denetimler (src/data/dataset.ts)

parseDataset(raw) saf bir fonksiyon olsun (fs ve Vite kullanmasın); { dataset, errors } dönsün. Hatalı dosyalar atlansın, hata mesajları Türkçe ve "dosya → alan yolu: mesaj" biçiminde olsun. Denetle:
- Ülke dosyasının adı ülke koduyla aynı; burs dosyasının adı id ile aynı.
- Okul id'leri tekil; okulun ülkesi için ülke dosyası var; okul içinde program id'leri tekil.
- Program fields değerleri fields.json'da var.
- Her turda ve adımda bitiş başlangıçtan önce değil.
- Kullanılan her para birimi fx.json'da var (öğrenim, AB dışı, dönem, bölgesel, başvuru ücretleri, burs tutarları, geçim kanıtı).
- ALES kademeleri büyük GNO'dan küçüğe sıralı; ales.min varsa ales.types boş değil.
- Ülke takvimindeki uni referansları gerçek bir okula işaret ediyor.
- Kısa burs kayıtlarındaki ref gerçek bir burs dosyasına işaret ediyor.
- Okulları ülke → şehir → kısa ada göre sırala (Türkçe karşılaştırma).

src/data/index.ts: data/countries/*.json, data/universities/*/*.json, data/scholarships/*.json, fields.json, fx.json dosyalarını import.meta.glob (eager) ile yükleyip parseDataset'e ver; `data` ve `dataErrors` dışa aktar.

scripts/check.ts: aynı dosyaları fs ile okuyup parseDataset çalıştırsın. Hata varsa listeleyip çıkış kodu 1 versin; yoksa "✓ Veri geçerli — N okul, M program (tr: x okul, de: y okul…), K burs" yazsın.

## 5. Başlangıç verisi

- data/fields.json: şu anahtarlarla yaz ve her birine Türkçe n / d / note doldur. note'ta "mimarlık mezunu için dikkat" bilgisini ver (örn. planlama programlarının bir kısmı planlama lisansı isteyebilir). Genel bilgi yaz; belirli okul adı ya da sayı yazma.
  design (Mimari tasarım), urban (Kentsel tasarım), planning (Şehir ve bölge planlama), heritage (Restorasyon / koruma / kültürel miras), history (Mimarlık tarihi ve kuramı), tech (Yapı bilgisi / yapı teknolojisi / yapı fiziği), sustain (Sürdürülebilir mimarlık / iklim), computational (Bilişimsel tasarım / dijital üretim / BIM), landscape (Peyzaj), interior (İç mimarlık / mekân / sergi), management (Proje ve yapım yönetimi / gayrimenkul), other (Diğer). CLAUDE.md'deki ilgi alanlarımla uyuşmayan bir şey varsa söyle.
- data/fx.json: Bugünün EUR bazlı kurları. TRY için TCMB'yi, diğerleri için ECB referans kurunu kaynak göster, tarihi yaz. Kaynağa ulaşamazsan bana sor; uydurma.
- data/countries/tr.json ve CLAUDE.md'deki ülkelerden biri için en az iskelet ülke dosyası (terms, summary, currency, verifiedAt). Bilmediğin alanı boş bırak; ayrıntıyı Prompt 6–7'de dolduracağız.
- Bir Türkiye ve bir yurt dışı programını gerçekten resmi sayfasından doğrulayıp ekle (şemanın gerçek veriyle çalıştığını görmek için). Doğrulayamadığın alanı boş bırak, tarih tahminse "tahmin" yaz.

## 6. Bitirirken

- npm install, npm run check, npm run typecheck geçmeli.
- CLAUDE.md'nin 3. (Komutlar tablosu) ve 4. (Mimari: klasör yapısı + "ProgramView okul/ülke varsayılanlarını birleştirir: intakes, requirements, costs program düzeyinde yoksa okuldan miras alınır") bölümlerini doldur. 5. bölüme şemaya özgü kuralları ekle: id biçimi, fields anahtarları listesi, ALES kademelerinin sırası ve types zorunluluğu, Alman notu için Bavyera formülü (1 + 3·(Nmax − GNO)/(Nmax − Nmin); Nmax/Nmin Türk üniversitesine göre değişir, bağlayıcı değer uni-assist VPD'sinde çıkar), para birimlerinin fx.json'da olması.
- Commit at. Bana şemayı kısaca anlat ve eklediğin iki programın kaynak linklerini ver.
````


---

# Prompt 3: Hesap mantığı ve testler

Bu adımda agent uygulamanın "beynini" yazar: profiline göre uygunluk (ALES puan türü, dil seviyesi, portfolyo, diploma uyumu…), yıllık maliyet, sıradaki son tarih, filtreler, takvim ve takvim dosyası. Bunlar arayüzden ayrı, test edilen saf fonksiyonlardır. Böylece arayüz değişse de hesaplar bozulmaz.

Bitince `npm test` çalışır ve testler geçer.

Aşağıdaki kutunun içini kopyalayıp agent'a yapıştır:

````text
CLAUDE.md'yi oku. Şimdi src/lib/ altındaki saf mantığı ve testlerini yazacağız. Kural: arayüz hesap yapmaz, lib'i çağırır. Önce src/lib/lib.test.ts'e testleri yaz, çalıştır ve kırıldığını gör; sonra kodu yaz ve testleri geçir.

## Modüller

dates.ts
- parseD("YYYY-AA-GG") yerel saatle Date; today() (saat sıfırlanmış); daysBetween(a, b).
- fmt (örn. "15 Ocak 2027"), fmtRange ("15 Kas – 15 Oca 2027"), AYLAR (Türkçe ay adları).
- countdown(s, e?, T) → { days, past, active } (pencere açık mı, kaç gün kaldı).
- urgency(days) → "hot" (≤7) | "soon" (≤21) | "later" | "past".
- windowProgress(open, deadline, T) → 0–1 (başvuru penceresinin ne kadarı geçti).

money.ts
- perYear(m): semester ×2, month ×12, year ×1; total ve once için null.
- convert(amount, from, to, fx) (fx.perEUR üzerinden; kur yoksa null).
- fmtMoney (tr-TR biçimi, "1.500 €", "45.000 TL").

text.ts
- norm(s): Türkçe duyarlı arama normalleştirme (İ/ı/I, ş, ğ, ç, ö, ü; Almanca/İtalyanca aksanlar; küçük harf).
- TERM_LABEL, LANG_LABEL, LEVEL_LABEL, ALES_LABEL gibi Türkçe etiketler.

rank.ts
- rankPos("=143") → 143, "51–100" → 51, "2001+" → 2001, geçersiz → undefined.

programs.ts
- ProgramView { key: "<okulId>/<programId>", uni, program, country, intakes, requirements, costs, scholarships (program + okul), nationalScholarships (ülke) }.
- buildViews(dataset): program.intakes varsa okulunkini tamamen ezer; requirements okul + program birleşimi (program alanı okulunkini ezer, bir seviye derin); costs program ?? okul.
- offeredTerms(intakes) → { yes, no, unknown }.
- singleTermOnly(intakes): tam olarak bir dönemde "yes" ve en az bir dönemde açıkça "no".
- nextDeadline(intakes, T): offered "no" olanları ve geçmiş tarihleri atla; en yakın son günü döndür; son gün yoksa açılış tarihini ("open") döndür.

eligibility.ts
- Profile {
    degree?: string (lisans bölümü, örn. "Mimarlık"),
    totalEcts?: number, semesters?: number,
    gpa?, gpaScale: 4 | 100,
    ales: Partial<Record<AlesType, number>>,
    ielts?, toefl?, yds?, yokdil?,
    languages: Partial<Record<Lang, Cefr>> (İngilizce dışı diller),
    portfolio: "none" | "draft" | "ready",
    practiceMonths?,
    nonEU: boolean (Türk vatandaşı yurt dışında AB dışı; varsayılan true),
    ects: Record<string, number> (alan başına tamamlanan ECTS),
    interests: string[] (fields.json anahtarları),
    greQ?
  }
  EMPTY_PROFILE ver.
- checkRequirements(req, profile, country?) → { overall, items[] }. Her item: { key, label, status: "ok" | "near" | "fail" | "unknown" | "na", need (ne isteniyor), detail? (senin durumun) }.
  - GNO: aynı ölçekteyse karşılaştır; 4'lükte 0,1 altı "near"; 100'lükte 3 puan altı "near". Ölçek farklıysa "unknown" + "Ölçek farklı".
  - Alman notu (deMax): ülkenin gpaConversion'ı ile Bavyera formülü: 1 + 3·(Nmax − GNO)/(Nmax − Nmin), 1,0–4,0 aralığına sıkıştır, 2 ondalık. 0,2 fazlası "near". Dönüşüm kuralı yoksa "unknown".
  - ALES: notRequired → "na". Aksi halde programın kabul ettiği türlerdeki puanlarımın en yükseğini kullan. Kademeli eşikte GNO'ya göre eşik bul; GNO tüm kademelerin altındaysa "fail". 5 puan altı "near". Kabul edilen türlerde hiç puanım yoksa "unknown" ve hangi türlerin kabul edildiğini yaz.
  - İngilizce: kabul edilen sınavlardan herhangi biri yeterse "ok". Tolerans: IELTS 0,5, TOEFL 5, YDS/YÖKDİL 5 → "near". Karşılaştırılacak puan yoksa "unknown"; MOI kabul ediliyorsa detail'de belirt.
  - Diğer diller: her otherLanguages kaydı için CEFR sırası A1<A2<B1<B2<C1<C2. Seviyem yeterse "ok", bir seviye altıysa "near", daha düşükse "fail", hiç yoksa "unknown". when "kayıtta" ya da "1. yıl sonunda" ise detail'de söyle (başvuru anında şart değil).
  - Portfolyo: policy "required" → ready "ok", draft "near", none "fail". "recommended" → ready "ok", diğerleri "near". "no" → item ekleme.
  - Önceki diploma: closedToArchitects → "fail". accepted listesi varsa ve bölümüm listede değilse "fail"; bölümüm yoksa "unknown". minEcts varsa: totalEcts yeterse "ok", 30 ECTS'ye kadar eksikse "near" (detail: "eksik ders / şartlı kabul olabilir"), fazlasıysa "fail".
  - Ders uyumu: her areas kaydı için ≥ min "ok", ≥ %80 "near", altı "fail", alan profilde yoksa "unknown".
  - İş deneyimi: months varsa practiceMonths ile karşılaştır; yoksa "unknown".
  - GRE: yalnızca policy "required" ise kontrol et.
  - overall: "na" dışındaki en kötü durum (fail > near > unknown > ok). Hiç kriter yoksa "none".
- isProfileEmpty(profile): not ve puanların hiçbiri girilmemişse true.

cost.ts
- yearlyCost(view, fx, nonEU) → { eurPerYear (öğrenim ücreti bilinmiyorsa null), free, lines: { label, eurPerYear, note? }[], hasRegionalFee }.
  Satırlar: öğrenim ücreti (nonEU ve feeNonEU varsa onu kullan, etiket "Öğrenim ücreti (AB dışı)"), dönem katkı payı, bölgesel ücret (appliesTo "all" ya da nonEU iken "non-eu" ise). free = öğrenim ücretsiz ve toplam 0.

filters.ts (program gezgini; durum adres çubuğunda saklanır)
- Filters: scope ("" | "tr" | "abroad"), country[], city[], uni[], field[], level[], lang[], term[], single (tek dönem alanlar), due (N gün içinde son başvuru), elig ("" | "ok" | "okNear"), free, maxEur, regional ("" | "yes" | "no"), schol (burs var), noAles, alesType[] (bu puan türlerinden birini kabul edenler), noPortfolio (portfolyo zorunlu olmayanlar), noExam (sınav/mülakat olmayanlar), englishOnly (yalnızca İngilizce, başka dil şartı yok), licensure (meslek odası yolu "yes" olanlar), maxIelts, maxGpa, top (benim seçtiğim okullar), rank (QS mimarlık sırası en fazla N; bantlar en iyi konumla sayılır; top ve rank ikisi birden açıksa okulun birine uyması yeter), mine (ilgi alanlarım), sl (kısa listem), q (metin araması), sort ("deadline" | "cost" | "name" | "uni").
- parseFilters(URLSearchParams) ve serializeFilters(Filters) birbirinin tersi olmalı; varsayılan değerler URL'ye yazılmamalı. Yeni filtre eklenirse ikisi birden güncellenir (CLAUDE.md'ye bu kuralı yaz).
- derive(views, { profile, fx, T }) → her program için { view, next, cost, check }.
- applyFilters(items, f, { shortlist, interests, T }) ve sıralama (son tarih yoksa sona; eşitlikte ada göre, Türkçe).
- matchesQuery: program adı, orijinal adı, derece, notlar, okul adı/kısa adı, şehir, bölge, ülke, hocalar; her kelime geçmeli (norm ile).

calendar.ts
- buildCalendar(views, countries, fundings) → CalEvent[] { uid, s, e?, t, d?, k, country?, hosts?, href?, keys (ilgili program anahtarları), kind: "general" | "application" | "step" | "scholarship" }.
  - Ülke takvimi olayları "general".
  - Okul geneli turlar okul başına bir olay (aynı turu paylaşan programlar keys'e eklenir); program kendi intakes'ini tanımladıysa program başına bir olay. offered "no" atlanır.
  - Step'ler (portfolyo, sınav, mülakat, sonuç) "step" olayı.
  - Burs çağrıları "scholarship" olayı (Prompt 8'de veri gelecek; fonksiyon şimdiden hazır olsun).
  - Başlığa okul kısa adı, dönem adı (ülkenin terms etiketinden), cycle ve tur adı ("normal" değilse) girsin.

ics.ts
- buildIcs(events, stamp): RFC 5545, tüm gün olaylar; DTEND bir sonraki gün (dışlayıcı); virgül, noktalı virgül, ters bölü ve satır sonu kaçışı; 75 oktet satır katlama; CRLF.
- downloadText(filename, text, mime).

scholarships.ts (Prompt 8'de kullanılacak ama şimdi yaz)
- CATEGORY_LABEL, LEVEL_LABEL, TUITION_LABEL, BLOCKED_LABEL, TURKISH_LABEL, FIELDFIT_LABEL.
- allCalls(f) (alt programların çağrıları dahil, bursu "no" olanlar hariç), nextCall(f, T), hostsOf(f), eurPerMonth(money, fx) (toplam ve bir kez için null), fundingCheck(f, profile).
- FundingFilters { q, cat, host, full, ba (bloke hesabın yerine geçer), fit (mimarlığa uygun), tr (Türk vatandaşına açık), open (ileride çağrısı var) } + parse/serialize + matchFunding + sortFundings (Türk vatandaşına açık önce, sonra tam burs, sonra aylık tutar büyükten küçüğe, sonra ad).

## Durum deposu (src/state/)

store.tsx: React context + localStorage.
- Anahtar "maa_v1_user"; içerik { profile, shortlist: string[], compare: string[] (en fazla 4), tracker: Record<programKey, { status, docs: Record<belge, boolean>, notes, updated }> }.
- TRACK_STATUSES: "araştırılıyor", "hazırlanıyor", "başvuruldu", "sınav/mülakat", "kabul", "ret", "vazgeçildi".
- Yüklerken eksik alanları varsayılanlarla birleştir (ileride yeni alan eklenince eski veri bozulmasın); okunamazsa boş başla, hiçbir zaman sessizce silme.
- exportJson() (version alanıyla) ve importJson(text) (geçersiz dosyada Türkçe hata).
- localStorage erişilemezse bellekte devam et.
data.ts: views = buildViews(data), countries, vb. türetilmiş, bir kez hesaplanan görünümler.

## Testler (en az bunlar)

- ALES: tek eşik; kademeli eşik (GNO kademeleri arasında doğru eşik, en alt kademenin altı fail, GNO yoksa default); puan türü (SAY ve EA kabul eden programda EA puanım kullanılır; yalnızca SÖZ puanım varsa unknown); notRequired sonucu etkilemez.
- Bavyera: (4, 4, 1) → 1,0; (1, 4, 1) → 4,0; (3,0, 4, 1) → 2,0; deMax karşılaştırmasında ok / near / fail.
- İngilizce: herhangi bir sınav yeter; tolerans near; puan yoksa unknown.
- CEFR: C1 isteyen programda B2 near, B1 fail, C2 ok; when "kayıtta" detail'e yazılır.
- Portfolyo: required + draft near, required + none fail, recommended + none near.
- Diploma: accepted listesinde olmayan bölüm fail; 240 ECTS'li profil 300 isteyen programda fail, 270 near.
- nextDeadline geçmiş turları ve offered "no" dönemleri atlar; singleTermOnly yalnızca kış alan programı yakalar, tek kayıtlı listeyi yakalamaz.
- yearlyCost: AB dışı ücret seçimi, bölgesel ücretin yalnızca AB dışına uygulanması, öğrenim ücreti bilinmiyorsa toplam null.
- parseFilters(serializeFilters(f)) eşitliği (dolu bir örnekle) ve varsayılanların URL'ye yazılmaması.
- rankPos bant ve "=" biçimleri; norm("İSTANBUL") ile norm("istanbul") eşit.
- buildIcs: DTEND bir gün sonra, uzun satır katlanır, virgül kaçışlı.
- buildCalendar: okul geneli tur tek olay ve iki programın anahtarını taşır; step olayları üretilir; offered "no" olay üretmez.

## Bitirirken

npm test, npm run typecheck, npm run check geçmeli. CLAUDE.md'nin 4. bölümüne lib modüllerini ve "filtre eklersen parse + serialize ikisini birden güncelle" kuralını, localStorage anahtarlarını ve "yapıyı değiştirirsen eski veriyi geriye uyumlu oku" kuralını ekle. Commit at. Bana uygunluk kurallarını tablo halinde özetle; değiştirmek istediğim bir eşik var mı diye sor.
````


---

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


---

# Prompt 5: Arayüz 2 — Bugün, Takvim, Karşılaştır, Takip, Ülkeler, Alanlar

Bu adımda kalan sayfalar kurulur. En önemlisi **Alanlar** sayfası: kafanda net bir alan yoksa, uzmanlıkları burada okuyup ilgini çekenleri profiline eklersin; uygulama da o alanlardaki programları öne çıkarır.

Aşağıdaki kutunun içini kopyalayıp agent'a yapıştır:

````text
CLAUDE.md'yi oku. Arayüzün ikinci kısmını kuracağız. Prompt 4'teki tokenlara, bileşenlere ve kurallara bağlı kal; yeni renk ya da yazı tipi ekleme.

## /  (Bugün)

Uygulamayı her açtığımda ilk bakacağım sayfa.
- Önümüzdeki 45 gün içindeki son başvurular. Aynı okulun aynı gündeki programları tek satırda ("+3 program daha"). Satırda: gün/ay kutusu, program adı, okul, bayrak, tahminse etiket, uygunluk rozeti, geri sayım, pencere çubuğu. 7 gün içindekiler en çok, 21 gün içindekiler orta düzeyde vurgulu. Kısa listemdeki ya da takibimdeki programlar "listemde" işaretiyle önce.
- Kısa bir sayı satırı: 21 gün içinde kaç son tarih var, profilime kaç program uyuyor (profil boşsa "profili doldur" bağlantısı).
- Yaklaşan genel olaylar (90 gün): ALES/YDS/YÖKDİL sınav ve sonuç tarihleri, dil sınavları, burs çağrıları, portfolyo/sınav adımları.
- Takibimdeki programlar: durum, sıradaki tarih, belge ilerlemesi (örn. 5/9).
- Boş durumlar sade olsun: "Önümüzdeki 45 günde son tarih yok" gibi.

## /takvim

- Ay ay gruplanmış olay listesi (geçmiş aylar katlı). Her olayda tarih ya da tarih aralığı, başlık, ülke bayrağı, tür (başvuru / adım / sınav ve genel / burs), kesin/tahmin, ilgili sayfaya bağlantı.
- Filtreler: ülke, tür, yalnızca kısa listem + takibim, yalnızca kesin olanlar. Filtreler URL'de.
- ".ics indir" düğmesi: o an filtrelenmiş olayları takvim dosyası olarak indirir (dosya adı tarihli).

## /karsilastir

- En fazla 4 program yan yana tablo. Satırlar: okul ve şehir, derece ve süre, dil, uygunluk, her şart (ALES türü ve eşiği, GNO, İngilizce, diğer dil, portfolyo, sınav/mülakat, diploma uyumu), dönemler ve sıradaki son tarih, yıllık maliyet (satır satır), meslek odası yolu, burslar, bağlantı.
- Satırlar arasında fark olan hücreler hafifçe vurgulansın. Programı listeden çıkarma düğmesi, "hepsini temizle".
- Mobilde tablo kendi kabında yatay kaysın; ilk sütun sabit kalsın.
- Boşken: "Program listesinden en fazla 4 program seç" ve Programlar'a bağlantı.

## /takip

- Takibe aldığım programlar; duruma göre gruplu (araştırılıyor, hazırlanıyor, başvuruldu, sınav/mülakat, kabul, ret, vazgeçildi). Durum seçici, notlar alanı, son güncelleme tarihi, takipten çıkar (onayla).
- Belge listesi: docsFor(view) fonksiyonunu src/lib'e (testli) yaz. Her programda: transkript, diploma / mezuniyet belgesi, CV, niyet mektubu, referans mektubu 1 ve 2; portfolyo (policy required ya da recommended ise); İngilizce belgesi (şart varsa); ALES sonuç belgesi (ales şartı varsa ve notRequired değilse); her otherLanguages için dil belgesi; GRE (required ise); danışman kabul mektubu (required ise); ülkeye göre: Almanya'da APS sertifikası ve uni-assist VPD (portal uni-assist ise), İtalya'da Universitaly ön kaydı ve DOV ya da CIMEA belgesi; ve programın documents listesi. Her belge işaretlenebilir; ilerleme "5/9".
- Sıradaki son tarihe göre sıralı. Boşken programlardan "Takibe al" ile eklenebileceğini söyle.

## /ulkeler ve /ulke/:kod

- Ülkeler: Türkiye ve yurt dışı; her ülkede bayrak, ad, okul ve program sayısı, bir cümlelik özet, öğrenim ücreti durumu, geçim kanıtı türü (bloke hesap / kendi hesabın).
- Ülke detay: özet; temel bilgiler (facts, kesin/tahmin etiketli); eğitim dili notu (languageNote); dönemler (terms); not dönüşümü (gpaConversion: formül, Nmax/Nmin, profilimdeki GNO'nun karşılığı, durumu ve notu); bölgesel/eyalet ücretleri; ulusal burslar; geçim kanıtı (tutarlar, kabul edilen yollar, kaynak); "Meslek ve tanınma" bölümü (profession: meslek odası, yabancı diplomayla kayıt yolu, Türk diplomasının durumu, kaynak; yoksa "henüz araştırılmadı"); ülke takvimi; o ülkedeki okullar; kaynaklar; StaleBadge.
- Uzun rehber metinleri için src/content/ altında ülke başına bir bileşen (TurkeyGuide, GermanyGuide…) için yer aç; içerik Prompt 6–7'de dolacak.

## /alanlar

- fields.json'daki her alan için bir bölüm: ad, ne olduğu (d), kime uygun / dikkat (note), o alanda kaç program var (Türkiye / yurt dışı ayrı), "bu alandaki programlar" bağlantısı (/programlar?field=<anahtar>), profilimde ilgi alanıysa işaret ve "ilgi alanlarıma ekle/çıkar" düğmesi.
- Sayfanın başında kısa bir açıklama: "Hangi alanda yüksek lisans yapacağın net değilse buradan başla. İlgini çeken alanları işaretle; Programlar sayfasında 'ilgi alanlarım' filtresiyle yalnızca onları görürsün."
- İçerik genel bilgi olsun; belirli okul adı ya da sayı yazma (o bilgi programlarda).

## Kontrol

- Bugün, Takvim, Karşılaştır, Takip ve Alanlar sayfalarını tarayıcıda aç, konsolda hata olmasın. Masaüstü + mobil + koyu tema ekran görüntüsü al ve bak.
- .ics dosyasını indirip içeriğine bak (en az bir olay, DTEND doğru).
- Test verisini temizle ("maa_v1_user").
- npm run check, typecheck, test geçmeli; docsFor için test ekle. Commit at.
- CLAUDE.md'nin 7. bölümünü güncelle: arayüz bitti, sıradaki iş veri. Bilinen küçük arayüz sorunları varsa oraya yaz.
````


---

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


---

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


---

# Prompt 8: Burslar ve geçim kanıtı

Bu adımda agent mimarlık yüksek lisansını destekleyen bursları araştırır ve bir **Burslar** sayfası kurar. Her bursta şunlar net görünür: Türk vatandaşına açık mı, mimarlık için uygun mu, öğrenim ücretini ve yaşam masrafını karşılıyor mu, vize için istenen bloke hesabın yerine geçiyor mu, ne zaman başvurulur.

Aşağıdaki kutunun içini kopyalayıp agent'a yapıştır:

````text
CLAUDE.md'yi ve docs/research-notes.md'yi oku. Şimdi burs kayıtlarını, geçim kanıtı kurallarını ve Burslar sayfasını ekleyeceğiz. Şema (Funding) Prompt 2'de, mantık (src/lib/scholarships.ts) Prompt 3'te hazır; eksik bir şey görürsen önce şemayı ve testi güncelle.

## 1. Aday burs listesi (önce bana göster)

Bir tablo hazırla: burs, veren kurum, hangi ülkelerde okumayı destekler, Türk vatandaşına açık mı, mimarlık için uygun mu, kapsam (tam / kısmi / destek), kaynak linki. Aşağıdakiler ipucudur; her birini resmi sayfadan doğrula, uygun olmayanı "uygun değil" diye işaretle (kayıt yine girebilir; neden uygun olmadığını görmek işime yarar):
- Türkiye kaynaklı: TÜBİTAK BİDEB lisansüstü burslar (2210 yurt içi; yurt dışı programların yüksek lisansı kapsayıp kapsamadığına bak), MEB YLSY (mimarlık ve ilgili alanlarda kontenjan var mı, zorunlu hizmet), Jean Monnet Burs Programı, TEV ve diğer vakıflar (GNO şartlarına bak), okulların kendi bursları.
- Almanya: DAAD (Türkiye'ye açık yüksek lisans programları; başka bir alan için yapılan araştırmada DAAD'ın genel yüksek lisans bursunun Türkiye'ye açık olmadığı çıktı, mimarlık için yeniden kontrol et), Deutschlandstipendium, siyasi vakıflar (Heinrich Böll, Konrad Adenauer, Friedrich Ebert, Rosa Luxemburg…), Avicenna, okul bursları.
- İtalya: bölgesel DSU bursları (Lombardia, Piemonte, Veneto, Lazio, Toscana, Emilia-Romagna…; ISEE parificato şartı ve ücret muafiyeti), MAECI devlet bursu, Invest Your Talent in Italy, okulların başarı bursları (PoliMi, PoliTo, IUAV, Padova…).
- Avusturya: OeAD burs veritabanı, okul bursları.
- AB: Erasmus Mundus ortak yüksek lisansları. EACEA kataloğunda mimarlık, kentsel çalışmalar, planlama, kültürel miras, tarihi yapılar, peyzaj ve sürdürülebilir yapılı çevre konularındaki programları tara; her birini programın kendi sitesinden doğrula (2027 alımında burs veriyor mu, son tarih, mimar kabul ediyor mu). Her uygun program Erasmus Mundus kaydının programs[] listesine girer.
- Başka ülkeler (benim seçtiğim ülkeler varsa): o ülkenin devlet bursları.

Önceliği bütçeme göre ver (CLAUDE.md). Onayımı bekle.

## 2. Burs kaydı (data/scholarships/<id>.json)

Her kayıt için: kapsam (level), öğrenim ücreti (tuition: burs mu öder, okul mu muaf tutar, zaten ücretsiz mi), aylık tutar (stipend) ve para birimi, ek ödemeler (extras: yol, sigorta, dil kursu), bloke hesap yerine geçer mi (blockedAccount + not), Türk vatandaşına açık mı (turkish), mimarlığa uygunluk (fieldFit + fieldNote), şartlar (requirements: GNO, dil, yaş sınırı ageMax), yükümlülükler (obligation: zorunlu hizmet, geri ödeme, ülkeye dönüş), çağrılar (calls: cycle, açılış, son gün, kesin/tahmin), nasıl başvurulur (howToApply adım adım), notlar, kaynaklar, verifiedAt.
- Çağrı tarihi yayımlanmamışsa geçen yılın takvimini bir yıl kaydırıp tahmin yaz, note'a kaynağını yaz.
- Tutarı bulamazsan stipend'i boş bırak ve stipendNote'a "doğrulanmadı" yaz.
- Ülke dosyalarındaki kısa burs kayıtlarını (scholarships[].ref) tam kayda bağla; check bilinmeyen ref'i yakalar.

## 3. Geçim kanıtı (countries/<kod>.json → proofOfFunds)

Her ülke için vize/oturum izninde istenen geçim kanıtını resmi kaynaktan (büyükelçilik, konsolosluk, dışişleri bakanlığı, OeAD gibi) doğrula. Başka bir proje için Ekim 2026'da resmi kaynaktan doğrulanan değerler (yeniden kontrol et, değişmiş olabilir):
- Almanya: bloke hesap 11.904 €/yıl. Almanya Dışişleri SSS'si alternatif olarak taahhütname (Verpflichtungserklärung), Alman kamu ya da tanınmış kuruluş bursu ve bazı başka yolları da sayıyor; Ankara Büyükelçiliği'nin Türkçe sayfası daha az yol yazıyor. İkisini de oku, farkı note'a yaz.
- İtalya: bloke hesap yok; 2026/27–2027/28 için 10.179,85 €/yıl, öğrencinin kendi hesabında.
- Avusturya: bloke hesap yok; 2026 için 24 yaş altı 722,58 €/ay, 24 yaş ve üstü 1.308,39 €/ay (OeAD).

## 4. Arayüz

/burslar
- Kategoriye göre gruplu liste (Türkiye kaynaklı, AB, Almanya, İtalya, Avusturya, diğer). Her bursta: ad, veren kurum, kapsam etiketi, aylık tutar (EUR karşılığıyla), öğrenim ücreti durumu, bloke hesap etiketi, Türk vatandaşına açık mı, mimarlığa uygunluk, sıradaki çağrı tarihi + geri sayım (tahminse etiket), profilime göre uygunluk.
- Filtreler (URL'de): arama, kategori, okunacak ülke, yalnızca tam burs, bloke hesabın yerine geçenler, mimarlığa uygun olanlar, Türk vatandaşına açık olanlar, çağrısı açık/yaklaşan olanlar.
- Sıralama: Türk vatandaşına açık önce, sonra tam burs, sonra aylık tutar, sonra ad.

/burs/:id
- Özet, kapsam tablosu, şartlar ve uygunluğum, çağrılar (dönem dönem), nasıl başvurulur, yükümlülükler, notlar, alt programlar (Erasmus Mundus: program adı, ortak okullar, ülkeler, 2027'de burs var mı, son tarih, bursuz ücret), kaynaklar, StaleBadge.

/burslar/bloke-hesap
- Ülke ülke geçim kanıtı karşılaştırması (tür, tutar, yıllık EUR, kabul edilen yollar, kaynak) ve hangi bursların bloke hesabın yerine geçtiği. Kısa ve net açıklama: "bloke hesap nedir, ne zaman açılır" (resmi kaynaktan).

Takvim ve Bugün sayfası: burs çağrıları buildCalendar üzerinden "burs" türüyle görünsün (Prompt 3'te hazır; veriyi bağla).
Program detayındaki burs bölümü: kısa kayıt ref ile tam kayda bağlanıyorsa "ayrıntı" bağlantısı.

## 5. Bitirirken

- npm run check, typecheck, test geçmeli; yeni mantık eklediysen test ekle.
- Sayfaları tarayıcıda aç; masaüstü + mobil + koyu tema ekran görüntüsü; konsolda hata yok; test verisini temizle.
- Commit at (veri ve arayüz ayrı commit'ler olabilir).
- docs/research-notes.md'ye "Burslar ve geçim kanıtı" bölümü: yöntem, önemli bulgular, doğrulanamayanlar, henüz yayımlanmamış çağrılar.
- Bana özet: benim profilime ve bütçeme göre en uygun 5 burs, her biri için neden ve sıradaki tarih; Türk vatandaşına kapalı çıkan ya da mimarlığı desteklemeyen ama beklediğim bursları ayrıca say.
````


---

# Prompt 9: Son kontrol, kalite denetimi ve README

Bu adımda agent bütün veriyi ve arayüzü denetler: kırık bağlantılar, eski kayıtlar, unutulmuş eyalet ücretleri, yanlış eğitim dili gibi hataları arar ve bir örneklemi baştan doğrular. Sonunda projeyi nasıl kullanıp güncelleyeceğini anlatan bir README yazar.

Aşağıdaki kutunun içini kopyalayıp agent'a yapıştır:

````text
CLAUDE.md'yi ve docs/research-notes.md'yi oku. Projenin genel denetimini yapacağız. Bulduğun her sorunu önce listele; küçük ve kesin düzeltmeleri yap, kararımı gerektirenleri bana sor.

## 1. Bağlantı denetimi (scripts/links.ts)

- Verideki bütün URL'leri (okullar, programlar, ülkeler, burslar) topla, her birine sınırlı eşzamanlılıkla HEAD/GET isteği at (zaman aşımı, yönlendirmeleri izle), sonucu tablo olarak yaz: çalışan / yönlendiren / hata.
- Bu tür betikler bot isteklerine 403/404 dönen siteleri kırık sanabilir. Hata veren her bağlantıyı tarayıcıda açıp bak; açılıyorsa sorun yok. Gerçekten kırık olanları düzelt (yeni adresi resmi siteden bul) ya da bana bildir. Sonucu CLAUDE.md'ye "bot isteklerini engelleyen siteler" listesi olarak yaz.

## 2. Veri denetimi

Önce otomatik tarama yap (gerekirse küçük bir betikle, geçici klasörde) ve şunları listele:
- verifiedAt 90 günden eski kayıtlar.
- Bir dönemi hiç tanımlanmamış programlar (örn. Almanya'da yalnızca kış kaydı var, yaz için ne "yes" ne "no").
- Kesin işaretli ama sources ya da links'te resmi kaynağı olmayan kayıtlar.
- Almanya/Avusturya'da eğitim dili "en" görünen programlar (dil yanlışı en sık hata; her birini programın kendi sayfasından yeniden kontrol et).
- Baden-Württemberg gibi eyalet ücreti olan bölgelerdeki okullarda regionalFee eksik mi.
- Öğrenim ücreti "unknown" olan kayıtlar.
- ALES şartı olup types alanı boş olan Türkiye programları.
- portfolio.policy boş olan programlar (mimarlıkta çoğu programda bu bilgi olmalı).
- licensure boş olan yurt dışı programları.
Sonra rastgele bir örneklem seç (her ülkeden programların yaklaşık beşte biri, en az 3) ve son tarih, ücret, dil şartı ve portfolyo şartını resmi sayfadan baştan doğrula. Bulduğun farkları tablo halinde göster: kayıtta ne yazıyor / kaynak ne diyor / link.

## 3. Arayüz denetimi

- Her sayfayı aç: Bugün, Programlar, Okullar, bir okul, bir program, Ülkeler, bir ülke, Alanlar, Burslar, bir burs, bloke hesap, Takvim, Karşılaştır (dolu), Takip (dolu), Profil.
- Masaüstü, mobil (360 px) ve koyu temada ekran görüntüsü al. Yatay sayfa kaydırması, taşan metin, okunmayan renk, görünmeyen odak halkası var mı bak. Klavyeyle filtre panelinde gezinmeyi dene.
- Konsolda hata/uyarı var mı bak.
- Bir filtre kombinasyonunun linkini kopyalayıp yeni sekmede aç; aynı görünüm gelmeli.
- Profili dışa aktarıp içe aktarmayı dene.
- Test verisini temizle ("maa_v1_user").

## 4. Derleme

- npm run build geçmeli. Paket boyutu uyarısı çıkarsa sayfa bazında kod bölme (React.lazy) öner; zorunlu değil.

## 5. README.md

Türkçe, kısa:
- Bu nedir, ne yapar (madde madde).
- Kurulum ve çalıştırma (Node 20+, npm install, npm run dev, adres).
- Komutlar tablosu.
- Veri nasıl güncellenir: hangi dosya neyi tutar, kesin/tahmin, verifiedAt, npm run check.
- Kişisel verin nerede durur (localStorage) ve nasıl yedeklenir (Profil → dışa aktar).
- "Bu uygulamadaki bilgiler resmi kaynaklardan derlendi ama hata olabilir; başvurmadan önce programın resmi sayfasına bak" uyarısı.

## 6. Bitirirken

- npm run check, typecheck, test, build geçmeli. Commit at.
- CLAUDE.md 7. bölümü baştan yaz: güncel sayılar (okul, program, burs), ülke ülke doğrulanmamış kalanlar, henüz yayımlanmamış ilanlar ve beklenen yayın ayları, bilinen arayüz sorunları, düşünülen ama yapılmayan işler.
- Bana: düzeltilen hatalar, doğrulanamayanlar ve önümüzdeki 60 gündeki son tarihlerim.
- GitHub'a ya da internete yayınlamak istersem önce bana sor; CLAUDE.md'de kişisel bilgilerim olduğunu hatırlat.
````


---

# Ek A (isteğe bağlı): claude.ai'da ülke araştırma raporu istemek

Bir ülkeyi geniş taramak için claude.ai sohbetinde **Research (Araştırma)** modunu kullanabilirsin. Çıkan rapor uygulamaya doğrudan girmez; Ek B ile agent'ına doğrulattırırsın. Bu tür raporlarda dil, son tarih ve ücret bilgileri sık sık yanlış çıkar, o yüzden doğrulama adımını atlama.

Bu prompt Claude Code'a değil, **claude.ai sohbetine** verilir. Raporu bitince `.md` olarak indir ve proje klasörüne ya da İndirilenler'e kaydet.

````text
Türk vatandaşı, 4 yıllık (8 dönem, yaklaşık 240 ECTS) mimarlık lisans mezunu bir aday için [ÜLKE]'deki yüksek lisans programlarını araştır. Mezuniyet: [AY YIL]. GNO: [GNO]/[ÖLÇEK]. Dil: İngilizce [SEVİYE / SINAV PUANI], [DİĞER DİL VE SEVİYE]. İlgi alanları: [ALANLAR]. Bütçe: [BÜTÇE / BURS ŞART MI].

Kapsam: mimarlık, kentsel tasarım, planlama, restorasyon ve kültürel miras, yapı teknolojisi, sürdürülebilir mimarlık, bilişimsel tasarım, peyzaj ve iç mimarlık alanlarındaki, mimarlık mezununun başvurabildiği yüksek lisans programları.

Her program için bir tablo satırı ver:
okul | şehir | program (orijinal adıyla) | eğitim dili | süre ve ECTS | dil şartı (sınav ve puan / CEFR) | portfolyo şartı ve biçimi | sınav veya mülakat | kabul edilen lisans ve ECTS şartı | not şartı | başlangıç dönemleri (yalnızca biri mi) | AB dışı aday için son başvuru tarihi | öğrenim ücreti (AB dışı) | dönem katkı payı ve bölgesel ücret | başvuru ücreti | meslek odası kaydında sayılıyor mu | resmi kaynak linki.

Kurallar:
- Her satırda programın resmi sayfasına link zorunlu. Bulamadığın bilgiyi tahmin etme; hücreye "doğrulanmadı" yaz.
- Eğitim dilini programın kendi sayfasından al; İngilizce sanılan ama Almanca/İtalyanca öğretilen programları ayrıca belirt.
- Tarih, geçen yıla aitse "geçen yıl" diye işaretle.
- Üçüncü taraf sitelerden (MastersPortal vb.) gelen bilgiyi "üçüncü taraf" diye işaretle.

Sonunda ayrı bölümler: (1) ülkenin genel başvuru süreci ve diploma tanıma adımları, (2) AB dışı öğrenciler için ücret kuralları, (3) vize için geçim kanıtı, (4) yabancı diplomayla mimar olarak meslek odasına kayıt yolu, (5) bu profile uygun burslar, (6) emin olamadığın noktaların listesi.
````


---

# Ek B: Getirdiğin bir raporu doğrulatıp eklemek

Elinde bir araştırma raporu, bir arkadaşının listesi ya da bir web sayfasından kopyaladığın tablo varsa bu promptu kullan. Agent rapordaki her bilgiyi resmi kaynaktan kontrol eder, yanlışları sana tablo halinde gösterir ve **senin onayınla** uygulamaya ekler.

Bu prompt Claude Code'a (proje klasöründe) verilir. `[DOSYA YOLU]` yerine raporun tam yolunu yaz (örn. `C:\Users\ad\Downloads\almanya-raporu.md`).

````text
CLAUDE.md'yi ve docs/research-notes.md'yi oku. Şu dosyada bir araştırma raporu var: [DOSYA YOLU]. Bunu doğrulayıp verimize ekleyeceğiz. Rapordaki hiçbir bilgiyi doğrulamadan veriye yazma.

1. Raporu baştan sona oku. İçindeki her programı, sayıyı ve tarihi çıkar.
2. Verimizde zaten olanlarla karşılaştır: aynı program varsa hangi bilgiler farklı?
3. Her bilgiyi resmi kaynaktan kontrol et (CLAUDE.md doğrulama protokolü). Özellikle CLAUDE.md'deki "sık görülen hatalar" listesini ara: eğitim dili, son tarih, tek dönem, gizli ücretler, eyalet ücreti, dönem katkı payı karışıklığı, MOI, atlanmış zorunlu şartlar, portfolyo son günü ve biçimi, 240/300 ECTS, meslek odası yolu, ALES puan türü.
4. Bana bir tablo göster: program | raporda ne yazıyor | resmi kaynak ne diyor | link | sonuç (doğru / yanlış / eksik / doğrulanamadı). Ardından:
   - rapordaki yanlışların kısa listesi,
   - raporda olmayan ama bulduğun önemli şartlar,
   - doğrulayamadıkların ve nedeni,
   - verimizde rapor sayesinde düzeltilmesi gerekenler.
5. Onayımı bekle. Onaylarsam ekle ya da düzelt: kesin/tahmin kararını ver, note alanına raporun yanlış yazdığı noktayı kısaca yaz (örn. "rapor 'İngilizce' diyordu; program sayfası Almanca"), verifiedAt'i güncelle.
6. npm run check, typecheck, test; commit. docs/research-notes.md'ye "<rapor adı> doğrulaması (tarih)" bölümü ekle; CLAUDE.md'nin doğrulama bölümüne bu raporda bulunan yeni hata türlerini ekle (bir sonraki rapor için).
````


---

# Ek C: Dönemsel güncelleme (ilanlar çıktıkça)

Başvuru ilanları yıl içinde parça parça çıkar. Türkiye'de güz ilanları çoğunlukla bahar sonu ve yaz başında, bahar ilanları Kasım–Aralık'ta yayımlanır; yurt dışı okulları ve burslar kendi takvimlerine göre açılır. Bu promptu ayda bir ya da önemli bir dönem yaklaşırken ver.

````text
CLAUDE.md'yi ve docs/research-notes.md'yi oku. Bugünün tarihine göre dönemsel güncelleme yapacağız.

1. Takipteki ve kısa listemdeki programları öğrenmek için bana localStorage'daki listemi sor (ya da Profil → dışa aktar ile verdiğim JSON'u oku). Önceliği bunlara ver.
2. "tahmin" durumundaki tarihlerden ilanı yayımlanmış olabilecekleri bul (önümüzdeki 120 gün içindeki ve geçen yıl bu zamana kadar ilan edilmiş olanlar). Her birinin resmi sayfasına bak; ilan çıktıysa tarihi düzelt, kesin yap, note'u güncelle.
3. verifiedAt 90 günden eski kayıtları listele; önce takibimdekileri, sonra diğerlerini yeniden doğrula.
4. Burs çağrıları: yayımlanmamış 2027/2028 çağrılarından çıkanları ekle (Erasmus Mundus programları, ulusal burslar, DSU, okul bursları).
5. Döviz kurlarını (fx.json) güncelle, tarihini ve kaynağını yaz.
6. ÖSYM sınav takvimi ve dil sınavı tarihlerinde değişiklik var mı bak.
7. npm run check, typecheck, test; commit ("Update announcements: <ay yıl>").
8. Bana özet: kesin'e çevrilen tarihler, değişen tarihler (eski → yeni), yeni eklenen burs çağrıları, önümüzdeki 60 gündeki son tarihlerim, hâlâ ilan bekleyenler ve beklenen ay.
````

İpucu: Claude Code'da zamanlanmış görevler (örneğin `/schedule`) kullanabiliyorsan bu promptu ayda bir otomatik çalışacak şekilde kurabilirsin. Kurmadan önce agent'a nasıl çalıştığını sor.


---

