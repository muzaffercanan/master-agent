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
