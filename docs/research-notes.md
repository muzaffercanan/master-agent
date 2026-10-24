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

- Almanya: kullanıcının Claude sohbetindeki iki artifact'i (paylaşım linki bekleniyor) + resmi kaynaklardan doğrulama.
- İtalya ve Avusturya: araştırma.
- İncelenmeyen TR üniversiteleri: İstanbul Üni., Bilgi, Işık, Medipol, İzmir Ekonomi, Yaşar, Çankaya, Başkent, TED, Kocaeli, Erciyes, Atatürk, Çukurova, Akdeniz, Pamukkale, OMÜ.
- `npm run links` (24 Ekim 2026): Boğaziçi aday sayfaları ve Gazi ilanları 404. Yeni adresleri bulunmalı. Koç 403 veriyor (bot engeli; tarayıcıda açılıyor olabilir).
