# Bilgisayar Master Atlası

Türkiye'de bilgisayar bilimleri mezunları için yüksek lisans programları, güz/bahar başvuru takvimleri, başvuru şartları ve araştırma gücü rehberi.

- Canlı sayfa: https://claude.ai/artifact/TDQSei9aMwaf6bSnmJhwTj
- Veri durumu: Eylül 2026 ilanları (kesin) + geçen yıla dayalı tahminler (tahmin etiketli)

## Yapı

```
src/index.html   Tek sayfalık uygulama (HTML + CSS + JS, harici bağımlılık yok; yalnızca Google Fonts)
data/            Ayrıştırılmış veri dosyaları (planlanan: üniversite, program, takvim JSON'ları)
docs/            Araştırma notları ve kaynak arşivi
```

## Sayfa içeriği

1. Geri sayımlı başvuru/sınav takvimi (ÖSYM, üniversiteler)
2. Güz / bahar karşılaştırma tablosu
3. Ortak başvuru şartları (ALES, GRE, İngilizce, GNO, belgeler, burslar)
4. "Puanım yetiyor mu?" kontrolü
5. Şehir ve alan filtreli üniversite kartları
6. Alan rehberi (15 alan)
7. Hocalar ve araştırma gücü (YÖK 2025, CSRankings)
8. Profile göre strateji

## Güncelleme

Veriler `src/index.html` içindeki `UNIS`, `CHECK`, `TIMELINE`, `CSR`, `SOURCES` dizilerinde. Bir ilan çıktığında ilgili kaydın `k` alanını `tahmin` → `kesin` yap ve tarihi güncelle.
