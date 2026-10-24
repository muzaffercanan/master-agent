# Master Atlası

Türkiye ve yurt dışındaki yüksek lisans programlarını araştırmak için yerel web uygulaması. Bir CS mezunu için hazırlandı: dönem dönem başvuru tarihleri, şartlar (GNO, ALES, IELTS/TOEFL/YDS, GRE, ders uyumu), ücretler, bölgesel ücretler ve burslar.

## Çalıştırma

Gerekli: Node.js 20+.

```bash
npm install      # ilk seferde
npm run dev      # http://localhost:5173
```

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu; dosya kaydedince sayfa kendini günceller |
| `npm run check` | `data/` altındaki bütün JSON'ları şemaya ve çapraz referanslara göre doğrular |
| `npm test` | Uygunluk, not dönüşümü, maliyet, tarih ve takvim mantığının testleri |
| `npm run build` | check + tip kontrolü + `dist/` üretimi (statik; her yerde açılır) |
| `npm run links` | Verideki resmi bağlantıları tek tek dener, kırıkları listeler |

## Ekranlar

- **Programlar**: bütün ülkeler tek listede. Filtreler: kapsam (Türkiye / yurt dışı), ülke, şehir/bölge, okul, alan, derece, dil, başvuru dönemi, "tek dönem alanlar", son başvuru aralığı, profiline uygunluk, ALES/GRE/IELTS/GNO eşikleri, ücret, bölgesel ücret, burs. Filtreler adres çubuğunda saklanır.
- **Okullar / Okul sayfası**: okul geneli takvim, şartlar, programlar, burslar, araştırmacılar.
- **Program sayfası**: şart listesi (her satırda senin durumun), dönemler ve turlar, yıllık maliyet dökümü, burslar.
- **Ülkeler**: dönem sistemi, temel bilgiler, not dönüşümü, bölgesel ücretler, ulusal burslar. Türkiye sayfasında eski rehber (şartlar, YÖK/CSRankings, strateji, alan rehberi) var.
- **Takvim**: sınavlar, burs çağrıları ve başvuru turları; `.ics` olarak dışa aktarılabilir.
- **Profil**: GNO, ALES, dil sınavları, GRE, ECTS dağılımı. Bütün uygunluk etiketleri buradan hesaplanır. Yedekle/yükle (JSON).
- **Karşılaştır** (en fazla 4 program) ve **Takip** (durum, belge kontrol listesi, notlar).

Kullanıcı verisi (profil, kısa liste, karşılaştırma, takip) yalnızca tarayıcının `localStorage`'ında durur.

## Veri yapısı

```
data/
  countries/{tr,de,it,at}.json       ülke: dönemler, temel bilgiler, not dönüşümü, bölgesel ücretler, ulusal burslar, takvim
  universities/{ülke}/{okul-id}.json okul + programları (okul başına bir dosya)
  fields.json                        alan sözlüğü (core, ai, data, sec, …)
  fx.json                            kur (EUR bazlı, tarihli)
  tr/csrankings.json                 Türkiye araştırma gücü tablosu
src/
  schema/index.ts                    zod şeması: verinin tek doğruluk kaynağı
  data/                              JSON yükleme + çapraz doğrulama
  lib/                               uygunluk, Bavyera formülü, maliyet, tarih, filtre, takvim (.ics)
  pages/, components/, content/      arayüz
```

### Yeni okul veya program eklemek

1. `data/universities/<ülke>/<okul-id>.json` dosyası oluştur. Mevcut bir dosyayı kopyalamak en kolayı.
2. Okul genelindeki takvimi `intakes` altına yaz. Bir program farklıysa programın kendi `intakes` alanı okulunkini ezer.
3. Şartları `requirements` altına yaz. Okul düzeyindeki şartlar varsayılandır; program düzeyindekiler üstüne yazılır.
4. `npm run check`, sonra commit.

### Önemli alanlar

- **intakes[]**: `term` (fall, spring, winter, summer), `cycle` ("2027-28"), `offered` ("yes", "no", "unknown"; `no` = bu dönemde alım yok), `rounds[]` (`name`, `open`, `deadline`, `audience`: all, eu, non-eu, tr), `status` (kesin, tahmin).
- **requirements**:
  - `gpa {min, scale, deMax}`: `deMax` Alman not tavanıdır (Bavyera formülüyle karşılaştırılır).
  - `english {ielts, toefl, yds, cambridge, moiAccepted}`
  - `ales {min | {default, tiers}, notRequired}`
  - `gre {policy, minQuant}`
  - `ects {areas: [{area, min}]}`
  - `documents`, `portal`, `interview`, `advisorLetter`
- **costs**: `tuition {kind: free | paid | covered | varies | unknown, fee, feeNonEU}`, `semesterFee`, `regionalFee {region, fee, appliesTo}`, `applicationFee`.
- **scholarships[]**: program, okul ve ülke düzeyinde tanımlanabilir. Ülke düzeyindekiler "ulusal burs" olarak ayrı gösterilir.
- Her okulda `verifiedAt` var. 90 günden eski kayıtlar arayüzde "doğrulanmadı" etiketi alır.
