# Bilgisayar Master Atlası

Türkiye'de bilgisayar bilimleri mezunları için yüksek lisans programları, güz/bahar başvuru takvimleri, başvuru şartları ve araştırma gücü rehberi.

- Canlı sayfa: https://claude.ai/artifact/TDQSei9aMwaf6bSnmJhwTj
- Veri durumu: Eylül 2026 ilanları (`kesin`) + geçen yılın takvimine dayalı tahminler (`tahmin`)

## Çalıştırma

Gerekli: Node.js 20+. Harici paket yok, `npm install` gerekmez.

```bash
npm run dev     # http://localhost:5173 — src/ ve data/ değişince otomatik derler, tarayıcı kendini yeniler
npm run check   # yalnızca data/*.json doğrulaması
npm run build   # dist/index.html (tam sayfa) + dist/artifact.html (artifact olarak yayımlamak için)
```

Port doluysa: `PORT=3000 npm run dev` (PowerShell'de `$env:PORT=3000; npm run dev`).

## Yapı

```
data/
  meta.json           başlık, güncelleme tarihi, üst bölümdeki "acil" kutular
  universities.json   üniversiteler ve programları (ana veri)
  eligibility.json    "Puanım yetiyor mu?" tablosunun satırları
  timeline.json       sınav ve başvuru takvimi
  fields.json         15 alanın açıklamaları
  cities.json         şehir sırası
  csrankings.json     araştırma gücü tablosu
  sources.json        kaynak listesi
src/
  head.html           <title>, meta, fontlar, CSS
  body.html           sayfa iskeleti
  app.js              render ve etkileşim kodu (veriyi DATA olarak alır)
scripts/
  lib.mjs             veri yükleme, doğrulama, sayfa birleştirme
  build.mjs           derleme ve --check
  dev.mjs             yerel sunucu + canlı yenileme
docs/
  research-notes.md   yöntem ve açık işler
```

## Veri nasıl güncellenir

Yeni bir ilan çıktığında:

1. `data/universities.json` içinde üniversiteyi bul (`id` ile, ör. `"itu"`).
2. İlgili alanı güncelle; tarih artık kesinse `"k": "tahmin"` → `"k": "kesin"` yap.
3. Takvimde de varsa `data/timeline.json` kaydını güncelle (tarihler `YYYY-AA-GG`).
4. `npm run check` ile doğrula, commit at.

### Şema notları

- **Üniversite:** `id`, `name`, `short`, `city` (cities.json'da olmalı), `type`, `lang`, `yok`, `csr`, `fall {t,k}`, `spring {t,k}`, `next`, `req`, `fund`, `progs[]`, `people[]`, `links[[ad, url]]`
- **Program:** `n` ad, `t` tür (Tezli YL, Tezsiz…), `f` alan anahtarları (fields.json'daki), `d` açıklama
- **Uygunluk satırı:** `u` üniversite id, `p` program, `m` asgari ALES, `g` asgari GNO, `e` İngilizce şartı, `note`.
  `m` GNO'ya bağlıysa: `{"default": 80, "tiers": [{"gpa": 2.75, "ales": 80}, {"gpa": 2.60, "ales": 85}]}` — GNO'nun karşıladığı ilk kademe geçerli olur; hiçbiri karşılanmazsa "GNO eşiğin altında".
  `m: 0` = ALES aranmıyor.
- **Takvim:** `s` başlangıç, `e` bitiş (opsiyonel), `t` başlık, `d` açıklama, `k` kesin|tahmin

Doğrulama hatalı bir alanı dosya ve satır kaydıyla raporlar; `npm run dev` açıkken hatalar tarayıcıda listelenir.
