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
