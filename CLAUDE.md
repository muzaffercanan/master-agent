# Master Atlası: Claude için proje rehberi

Bu dosyayı her oturumun başında oku. Burada yazanlar, projenin kurulduğu uzun konuşmada kullanıcıyla birlikte oturmuş kurallardır; bozmadan çalış.

## 1. Proje nedir

Türkiye ve yurt dışındaki yüksek lisans programlarını araştırmak için kullanıcının **yerel çalışan** web uygulaması. Vite 5 + React 18 + TypeScript, `react-router` (HashRouter), `zod`. Sunucu ve veritabanı yok: veri `data/**/*.json` dosyalarında, derleme anında yüklenir. Kullanıcıya ait veri (profil, kısa liste, karşılaştırma, takip) yalnızca tarayıcının `localStorage`'ında durur.

Uygulama şunları yapabilmeli (kullanıcının istediği, bozulmamalı):

- Türkiye ve yurt dışı ayrı ayrı; ülkeye, şehre/bölgeye ve okula göre gruplanıp filtrelenebilmeli.
- Okul okul şartlara bakılabilmeli.
- Şartlar liste halinde filtrelenebilmeli: başvuru tarihleri (her dönem ayrı ayrı ele alınmalı; yalnızca tek dönem alan programlar da belirtilmeli), başvuru koşulları (IELTS/TOEFL/YDS, GNO, ders/ECTS uyumu, GRE, ALES…), ücret var mı ve ne kadar, bölgesel/eyalet/şehir ücreti, burslar.
- Kullanıcının profiline göre her yerde uygunluk etiketi çıkmalı.

Kapsam: Türkiye, Almanya, İtalya, Avusturya. Yeni ülke eklenirse aynı şemayla eklenir.

**Türkiye'de yalnızca şu 10 okul tutulur** (kullanıcının kararı, 28 Ekim 2026): Bilkent, ODTÜ, Hacettepe, TOBB ETÜ, Boğaziçi, Galatasaray, İTÜ, Koç, Özyeğin, Sabancı. Diğer Türk üniversitelerini ekleme; rehber metninde örnek olarak da anma.

## 2. Kullanıcı ve iletişim

- **Her zaman Türkçe konuş.** Kod, dosya adı ve commit mesajı hariç kullanıcıya dönük her metin Türkçe. Arayüz metinleri de Türkçe.
- Kullanıcı bir CS mezunu (Özyeğin Üniversitesi, GNO 2.75/4.00, Temmuz 2026 mezunu, junior backend developer). Hedefi Türkiye, Almanya (ana), İtalya, Avusturya. TUM'u yüksek ücret nedeniyle eledi. Ayrıntı hafızada.
- Kısa, açık cümlelerle yaz. Süslü anlatım, abartı ve tahmin dolu özet yok.
- **Raporlarken dürüst ol:** yapılmayanı yapılmış gibi, doğrulanmayanı doğrulanmış gibi sunma. "Doğrulandı" demeden önce gerçekten resmi kaynağa bakmış ol.
- Kullanıcı bir araştırma raporu, artifact veya dosya verirse içindeki **her sayıyı yeniden kontrol et** ve düzeltmeleri açıkça söyle. Kullanıcı bunu özellikle istedi ("verileri kontrol etmeyi unutma").
- Büyük bir yönü değiştirmeden önce sor; küçük ve geri alınabilir işi sormadan yap.

## 3. Komutlar

Gerekli: Node.js 20+. Proje klasörü: `C:\Users\muzca\Desktop\muzo-genel\DEV\master-atlasi`. Windows'tasın; Bash ve PowerShell ikisi de var.

| Komut                 | Ne yapar                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`       | Geliştirme sunucusu, `http://localhost:5173`. `.claude/launch.json` içinde `master-atlasi` adıyla tanımlı. |
| `npm run check`     | `data/` altındaki her JSON'u zod şemasına ve çapraz referanslara göre doğrular.                               |
| `npm test`          | `src/lib/lib.test.ts` (uygunluk, not dönüşümü, maliyet, tarih, takvim, `.ics`).                              |
| `npm run typecheck` | `tsc --noEmit`.                                                                                                     |
| `npm run build`     | check + typecheck + `vite build` (`dist/` git'te yok).                                                            |
| `npm run links`     | Verideki resmi bağlantıları dener. Sonuçlarına körü körüne güvenme (bkz. 6.4).                              |

**Her değişiklikten sonra**, bitirdim demeden önce şunlar geçmeli: `npm run check`, `npm run typecheck`, `npm test`. Arayüz değiştiyse ayrıca tarayıcıda gör (bkz. 8).

## 4. Mimari

```
data/
  countries/{tr,de,it,at}.json         ülke düzeyi bilgi, bölgesel ücretler, ulusal burslar, geçim kanıtı (proofOfFunds), takvim (sınavlar)
  universities/{ülke}/{okul-id}.json   okul + programları (okul başına bir dosya)
  scholarships/{id}.json               burs kayıtları (Funding): kapsam, bloke hesap, çağrılar, alt programlar (Erasmus Mundus)
  checklist.json                       /yapilacaklar: başvuru adımları (aşama, ülke veya iz [tracks: Erasmus Mundus = "em"], ipucu türü); ipuçları src/lib/checklist.ts'te kısa liste + profilden hesaplanır
  rankings/{ülke}.json                 /rankingler tablosu: o ülkenin okulları × sıralama listeleri (THE, QS, ARWU, U.S. News, CS konu sıralamaları, CSRankings)
  fields.json                          alan sözlüğü
  fx.json                              kur (EUR bazlı, tarihli)
  tr/csrankings.json                   Türkiye araştırma gücü tablosu
src/
  schema/index.ts                      zod şeması: VERİNİN TEK DOĞRULUK KAYNAĞI
  data/                                JSON yükleme (import.meta.glob) + çapraz doğrulama (dataset.ts)
  lib/                                 saf mantık: eligibility, cost, filters, calendar, dates, money, ics, programs, scholarships
  state/                               store.tsx (localStorage), data.ts (türetilmiş görünümler)
  pages/ components/ content/          arayüz; content/ içinde TurkeyGuide ve GermanyGuide uzun rehber metinleri
  styles/base.css, app.css             tasarım tokenları ve bileşen stilleri
scripts/check.ts, links.ts
docs/research-notes.md                araştırma yöntemi ve açık işler
```

- Mantık `src/lib/` içinde saf fonksiyonlardır ve testlidir. Arayüz hesap yapmaz, `lib`'i çağırır.
- `ProgramView` (`src/lib/programs.ts`) bir programı okul/ülke varsayılanlarıyla birleştirir: `intakes`, `requirements`, `costs` program düzeyinde yoksa okuldan miras alınır; ülke burslarına `nationalScholarships` olarak ayrıca erişilir.
- Filtreler URL'de saklanır (`src/lib/filters.ts`: `parseFilters` / `serializeFilters`). Yeni filtre eklersen ikisini birden güncelle, yoksa link paylaşımı bozulur.
- `localStorage` anahtarları: `mla_v2_user` (profil, kısa liste, karşılaştırma, takip, yapılacaklar işaretleri), `mla_theme`. Bu yapıyı değiştirirsen eski veriyi sessizce silme; geriye uyumlu oku.

## 5. Veri kuralları (en önemli bölüm)

### 5.1 Şema ve dosyalar

- **Önce şemayı güncelle** (`src/schema/index.ts`), sonra veriyi, sonra arayüzü. Şema dışı alan ekleme.
- Okul dosyası: `data/universities/<ülke kodu>/<id>.json`. `id` yalnızca `a-z 0-9 -`. Ülke dosyasının adı ülke koduyla aynı olmalı (`de.json`); `check` bunu denetler.
- Program `fields` değerleri `fields.json` anahtarlarından olmalı: `core, ai, data, sec, swe, is, game, bio, cogsci, comp, robo, comm, fin, or, other`.
- JSON biçimi: 2 boşluk girinti, UTF-8, sonunda satır sonu, Türkçe karakterler kaçışsız (`ensure_ascii=False`). Satır sonları LF (`.gitattributes`).
- Python ile toplu düzenleme yaparsan `PYTHONIOENCODING=utf-8` ayarla ve dosyayı `newline='\n'` ile yaz.

### 5.2 Dönemler (`intakes`)

- `term`: `fall`, `spring` (Türkiye, İtalya), `winter`, `summer` (Almanya WiSe/SoSe, Avusturya). Ülkenin hangi dönem adlarını kullandığı `countries/<kod>.json` içinde `terms` alanında.
- `offered`: `yes` / `no` / `unknown`. **Bir program o dönemde öğrenci almıyorsa `no` yaz** (arayüz üstünü çizer ve "tek dönem alanlar" filtresi buna dayanır). Bilmiyorsan `unknown`, uydurma.
- Okul düzeyinde `intakes` varsayılandır; program kendi `intakes`'ini tanımlarsa okulunkini **tamamen** ezer. Bu yüzden program override'ında hem güz hem bahar kaydını yaz.
- `rounds[]`: erken / normal / geç / ek tur ayrı ayrı. `audience`: `all`, `eu`, `non-eu`, `tr`. AB dışı pencere farklıysa ayrı tur olarak gir.
- Tarih biçimi `YYYY-AA-GG`.

### 5.3 `kesin` ve `tahmin`

- **`kesin`**: yayımlanmış, resmi ilan. **`tahmin`**: geçen yılın takvimi, üçüncü taraf kaynak veya kaynaklar çelişkili.
- Resmi kaynaktan doğrulanmayan hiçbir tarihi `kesin` yazma. Çelişen kaynaklarda `tahmin` yaz ve `note` alanına hangi kaynağın ne dediğini yaz (JKU Linz ve UniBo örneklerine bak).
- Bir ilan çıkınca `tahmin`'i `kesin`'e çevir ve tarihi güncelle.
- Her okul kaydında `verifiedAt` var. Veriye dokunduğunda ve kaynağa gerçekten baktığında güncelle; bakmadan güncelleme. 90 günden eski kayıt arayüzde "doğrulanmadı" etiketi alır.

### 5.4 Şartlar ve ücretler

- ALES eşiği GNO'ya bağlıysa kademe olarak yaz: `{default, tiers:[{gpa, ales}]}`, **büyük GNO'dan küçüğe sıralı** (`check` denetler). `notRequired: true` = ALES aranmıyor.
- Almanya not tavanı `gpa.deMax` (Alman notu, düşük iyi). Dönüşüm ülke dosyasındaki `gpaConversion` ile yapılır: Bavyera formülü `1 + 3·(Nmax − GNO)/(Nmax − Nmin)`. Özyeğin için DHBW tablosu (Haziran 2026) "System 3": Nmax=4, Nmin=1, yani 2.75 → 2.25. Başka Türk üniversiteleri farklı sistemde olabilir (System 1'de en düşük geçer not 0.70); bağlayıcı değer uni-assist VPD'sinde çıkar.
- Para: `{amount, currency, per}`; `per` = `semester | year | month | total | once`. Kullandığın para birimi `fx.json`'da olmalı. Yıllık maliyet EUR'a çevrilip gösterilir; kuru tarihli güncelle.
- Öğrenim ücreti `kind`: `free | paid | covered | varies | unknown`. AB dışı ücret farklıysa `feeNonEU`. **Dönem katkı payı (`semesterFee`) öğrenim ücretinden ayrıdır**, ikisini karıştırma.
- Bölgesel/eyalet ücreti (`regionalFee`) ayrı alandır (Baden-Württemberg 1.500 €/dönem gibi); ücretsiz görünen bir okulun bölgesel ücreti olabilir, mutlaka bak.
- Burslar: program, okul ve ülke düzeyinde tanımlanabilir. Ülke düzeyindekiler (TÜBİTAK, DAAD, Deutschlandstipendium) "ulusal burs" olarak ayrı gösterilir.
- Hesaplanamayan veya bilinmeyen değeri boş bırak ya da `unknown/varies` yaz. Uydurma sayı yazma.

## 6. Doğrulama protokolü

### 6.1 Kaynak sırası

1. Üniversitenin / enstitünün resmi ilan veya program sayfası, kontenjan tabloları, çağrı PDF'leri.
2. Resmi kurumlar: ÖSYM, YÖK, TÜBİTAK, DAAD, uni-assist, Auswärtiges Amt, bakanlıklar, DHBW not tablosu.
3. Üçüncü taraf (MastersPortal, mygermanuniversity, Collegedunia, blog vb.) **yalnızca ipucudur.** Bu sitelerden gelen sayıyı tek başına `kesin` yapma; sık sık eski ya da yanlış çıkıyorlar.

### 6.2 Kullanıcının getirdiği raporlar

Kullanıcının Almanya raporu doğrulanınca şu hatalar çıktı. Yeni bir rapor geldiğinde aynı türden hataları ara:

- Mannheim Data Science: AB dışı için GRE Quant ≥162 ve Verbal ≥151 **zorunlu**, seçim yalnızca GRE'ye göre. Raporda yoktu.
- Stuttgart "AI and Data Science" **Almanca** öğretiliyor. Raporda İngilizce yazıyordu.
- Stuttgart CS ve INFOTECH kış başvurusu 15 Ocak'ta kapanıyor ("Mayıs–Temmuz" yanlıştı); ikisi de "açık kabul" değil.
- TH Deggendorf AI & DS yalnızca yaz döneminde alıyor ve AB dışı için 500 €/dönem servis ücreti + 60 € başvuru ücreti var. Raporda "harçsız, iki dönem" yazıyordu.
- Saarland dönem ücreti 412,30 € (rapor ~280 €); İngilizce eğitim belgesi (MOI) kabul edilmiyor.
- Goethe MSQ'da GRE zorunlu değil, önerilen. TUM ücreti 2027/28 kışından itibaren 4.600/6.800 €. TUM Information Systems yalnızca Wirtschaftsinformatik lisanslıları kabul ediyor.
- Passau: anabin'de "H+" statüsü ve A1 Almanca (ilk yıl sonuna kadar) gerekiyor.

### 6.3 Kurallar

- Çelişkili kaynakta erken (güvenli) tarihi göster ve çelişkiyi `note`'a yaz.
- Bir sayfa yüklenmezse (PDF, bot engeli) o veriyi "doğrulanmadı" diye işaretle; eski/ezber sayıyla doldurma. `WebFetch` kısa özet verir ve hata yapabilir; kritik sayıları (ücret, son gün) sayfanın kendisinden teyit et.
- PDF için: `curl` ile indirip `pypdf` ile metne çevirmek işe yarıyor (`PYTHONIOENCODING=utf-8`).
- Kullanıcıya özet verirken doğrulanamayanları ayrıca say.

### 6.4 `npm run links` hakkında

Betik, bot isteklerine 403/404 dönen siteleri "kırık" sanıyor (Boğaziçi, Koç, Özyeğin, PoliMi, MastersPortal). Kırık raporu gelince bağlantıyı **uygulama içi tarayıcıda** (`mcp__Claude_Browser__*`) aç; açılıyorsa sorun yoktur. Gerçekten sorunlu olan: Hacettepe enstitü siteleri (portala yönleniyor).

## 7. Durum ve açık işler (24 Ekim 2026 itibarıyla)

Güncel sayılar için `npm run check` çıktısına bak. Açık işler:

- **İkinci Almanya raporu** ("Bilgisayar Mühendisi Profili İçin Kapsamlı Araştırma"): kullanıcı Claude sohbetinden `.md` olarak indirip yolunu verecek. Gelince 6.2'deki gibi kontrol edip ekle. (Downloads'taki "Almanya'da İngilizce Yüksek Lisans… Rehberi.md" birinci rapordur ve zaten işlendi.)
- Almanya'da hâlâ doğrulanmamış: Frankfurt UAS kış son tarihi ve M.Eng. Information Technology programı, Mannheim Social Data Science şartları, RWTH dönem ücreti.
- İtalya ve Avusturya yalnızca birkaç programla başladı (PoliMi, UniBo, TU Wien, JKU). Sapienza, Padova, PoliTo, TU Graz, Viyana Üniversitesi gibi okullar eklenebilir. PoliMi sitesi bot engelliyor; şartlar üçüncü taraftan geldi, doğrulanmalı.
- Bahar 2026-27 ilanları: Boğaziçi, Koç, Özyeğin, Sabancı işlendi. ODTÜ, İTÜ, Hacettepe, Bilkent, TOBB ETÜ, Galatasaray ilan edince güncelle (Boğaziçi Bilgisayar Müh.'in bahar kontenjanı belirsiz).
- Güz 2027-28 tarihleri çoğunlukla 2026 takviminin kaydırılmasıyla yazılmış `tahmin`'lerdir; ilan çıktıkça `kesin`'e çevir.
- Bilinen küçük arayüz sorunları: detay sayfalarında üst menüde sekme seçili görünmüyor; mobilde uygunluk etiketi uzunsa "Takibe al" alt satıra iniyor; tema değişiminde 150 ms'lik geçiş; derleme 500 kB uyarısı veriyor.
- Burslar (`/burslar`, 26 Ekim 2026): Erasmus Mundus programlarının çoğunun 2027 tarihleri Kasım–Aralık 2026'da yayımlanacak; çıkınca `programs[].calls`'a ekle. IYT, MAECI, Padova ve YLSY 2027 çağrıları henüz yok. Doğrulanamayanlar `docs/research-notes.md` → "Burslar ve geçim kanıtı".
- Rankingler (`/rankingler`, 28 Ekim 2026): yalnızca Almanya. Sıralar yayımlandığı gibi metin olarak durur ("=143", "301–325"); en az bir listede ilk 500'deki kurumlar alındı. THE CS sütunu 2026 baskısı (2027 konu sıralaması henüz yok), QS CS de 2026; yenileri çıkınca `data/rankings/de.json`'u güncelle. CSRankings canlı veridir, değişir. İtalya/Avusturya/Türkiye için aynı şemayla `data/rankings/<kod>.json` eklenebilir.
- Düşünülen ama yapılmayan: kırık bağlantıları otomatik tespit eden CI, GitHub Pages ile yayın.

## 8. Arayüz kuralları

- Arayüz bir **araştırma aracı**: sakin, yoğun ama okunur, pazarlama sayfası değil. Gradient'li hero, bölüm başlarında emoji, her şeyin ortalanması, her kutuda yuvarlak köşe + gölge gibi "yapay zekâ" klişelerinden kaçın.
- Stil yalnızca **tasarım tokenlarıyla** (`src/styles/base.css`). Açık tema `:root`'ta tam tanımlı; koyu tema `@media (prefers-color-scheme: dark)` içinde `:root:not([data-theme="light"])` korumasıyla ve ayrıca `:root[data-theme="dark"]` altında yeniden tanımlanır. Bu yapıyı bozma; her renk iki temada da okunmalı. Gövdeye açık arka plan token'ı ver.
- Yazı tipleri: Source Serif 4 (başlık), IBM Plex Sans (metin), IBM Plex Mono (sayı/veri). Sayı sütunlarında `tabular-nums`.
- Mobilde (360 px) yatay sayfa kaydırması olmamalı; sadece tablo ve kod kutuları kendi kapsayıcısında kayabilir.
- Klavye odağı görünür kalmalı, `prefers-reduced-motion` desteklenmeli, kontrast en az 4,5:1.
- `kesin` / `tahmin` / `Eksik bilgi` gibi durum etiketleri tutarlı ve sade olmalı. Bir bilgi tahminse bunu kullanıcı bir bakışta görebilmeli.
- Arayüz değişikliğinden sonra **ekran görüntüsü al ve bak**: masaüstü + mobil (`resize_window` preset `mobile`) + koyu tema. Konsolda hata olmamalı (`read_console_messages`).
- Test için tarayıcıya profil yüklersen işin bitince `localStorage.removeItem("mla_v2_user")` ile temizle; kullanıcının kendi verisini silme.
- `ProgramRow`, `details.tsx` ve filtre paneli sık kullanılan, düzeni elle ayarlanmış bileşenler. Davranışı değil görünümü değiştirmen gerekiyorsa mantığa (`src/lib`) dokunma.

## 9. Git

- Dal: `main`. Bu dizin zaten bir git deposu. Kullanıcı istemeden dışarıya push etme, uzak depo ekleme.
- Küçük, tek amaçlı commit'ler; mesaj İngilizce, emir kipinde, ilk satırı kısa, gerekirse madde madde gövde. Oturumun istediği `Co-Authored-By` satırını mesajın sonuna ekle.
- `dist/` ve `node_modules/` git'te yok; ekleme. Geçici dosyaları scratchpad'e yaz, depoya değil.
- Yıkıcı işlem yapma (`reset --hard`, dosya silme, veri kaybettiren dönüşüm) kullanıcıya sormadan. Toplu veri dönüşümü yapacaksan önce commit'li olduğundan emin ol.

## 10. İş başlamadan önce kontrol listesi

1. Bu dosyayı ve `docs/research-notes.md`'yi oku. `git status` ve `git log` ile son durumu gör.
2. Veriye dokunacaksan: şemayı oku, kaynağı resmi sayfadan aç, `kesin`/`tahmin` kararını ver, `note` ve `verifiedAt`'i yaz.
3. Mantığa dokunacaksan: önce `lib.test.ts`'e test ekle.
4. Arayüze dokunacaksan: tokenlara bağlı kal, iki tema + mobil kontrol et.
5. Bitirirken: `check`, `typecheck`, `test`, gerekirse `build`; sonra commit; kullanıcıya neyin yapıldığını, neyin **doğrulanamadığını** ve neyin kaldığını söyle.
