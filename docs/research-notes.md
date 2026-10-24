# Araştırma notları

## Yöntem

- Tarihler: üniversite enstitü ilanları, kontenjan tabloları (İTÜ SİS, Hacettepe PDF, GTÜ ilan PDF'i), ÖSYM 2026 takvimi.
- Finansman: TÜBİTAK 2210 burs miktarları sayfası ve 2210-A 2026 çağrı metni.
- Araştırma gücü: YÖK Araştırma Üniversiteleri 2025; CSRankings `generated-author-info.csv` (adjustedcount, 2016–2026 ve 2021–2026 pencereleri).
- Kur: `data/fx.json` (TCMB, 23 Ekim 2026).

## v2 taşıma (Ekim 2026)

- v1'deki serbest metin tarihler, okul başına `intakes` kayıtlarına çevrildi. Güz 2027-28 turları 2026 takviminin bir yıl kaydırılmasıyla tahmin edildi (`tahmin`).
- v1 takvimindeki okul başvuru pencereleri `intakes`'e taşındığı için ülke takviminden çıkarıldı. Ülke takviminde yalnızca sınavlar ve TÜBİTAK kaldı.
- v1 "Puanım yetiyor mu?" satırları program `requirements` alanlarına dağıtıldı.

## Açık işler

- İtalya ve Avusturya: araştırma.
- İncelenmeyen TR üniversiteleri: İstanbul Üni., Bilgi, Işık, Medipol, İzmir Ekonomi, Yaşar, Çankaya, Başkent, TED, Kocaeli, Erciyes, Atatürk, Çukurova, Akdeniz, Pamukkale, OMÜ.
- `npm run links` (24 Ekim 2026): 116 bağlantıdan 19'u betikte hata veriyor, ancak tarayıcıyla tek tek kontrol edildi: Boğaziçi, Gazi, KTÜ, BTÜ, Koç ve Özyeğin sayfaları açılıyor (bu siteler otomatik isteklere 404/403 dönüyor). Gerçek sorunlar: Hacettepe enstitü siteleri şu an bir portala yönleniyor (geçici olabilir); AGÜ (`fbe.agu.edu.tr`) açılmıyor; PoliMi otomatik erişimi engelliyor.
- Bahar 2026-27 ilanları (24 Ekim 2026 kontrolü): Boğaziçi 14–21 Aralık, Koç 5 Aralık, Özyeğin 14 Ekim–22 Kasım, Sabancı 27 Kasım. ODTÜ, İTÜ, Gazi, YTÜ ve Atılım henüz ilan etmedi; Hacettepe sitesi erişilemedi.
- Almanya: kullanıcının birinci raporu doğrulanarak eklendi. Kalan doğrulanmamışlar: Frankfurt UAS kış son tarihi ve IT (M.Eng.) programı, Mannheim Social Data Science şartları, RWTH dönem ücreti. İkinci rapor ("Bilgisayar Mühendisi Profili İçin Kapsamlı Araştırma") bekleniyor.
