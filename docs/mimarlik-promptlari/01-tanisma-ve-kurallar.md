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
