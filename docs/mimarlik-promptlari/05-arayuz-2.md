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
