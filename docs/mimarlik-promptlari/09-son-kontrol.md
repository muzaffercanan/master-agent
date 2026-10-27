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
