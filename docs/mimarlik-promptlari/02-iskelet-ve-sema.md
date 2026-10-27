# Prompt 2: Proje iskeleti, veri şeması ve veri doğrulama

Bu adımda agent projeyi kurar ve uygulamanın kalbini yazar: **veri şeması**. Şema, bir programın hangi bilgileri taşıyacağını (ALES puan türü, portfolyo biçimi, dil seviyesi, dönemler, ücretler…) tanımlar. Her JSON dosyası bu şemaya göre denetlenir; yanlış ya da eksik girilen veri yakalanır.

Bitince `npm run check` komutu çalışır ve "Veri geçerli" der. Henüz görünen bir arayüz yok.

Aşağıdaki kutunun içini kopyalayıp agent'a yapıştır:

````text
CLAUDE.md'yi oku. Şimdi proje iskeletini, veri şemasını ve veri doğrulama betiğini kuracağız. Arayüz bu adımda yok (yalnızca boş bir sayfa).

## 1. Kurulum

- package.json (type: module, engines node >=20). Bağımlılıklar: react 18.3, react-dom 18.3, react-router-dom 6.30, zod 3.25. Geliştirme: vite 5.4, @vitejs/plugin-react 4, typescript 5.9, vitest 2.1, tsx 4, @types/react, @types/react-dom, @types/node 20.
- Komutlar:
  - dev: vite (http://localhost:5173)
  - check: tsx scripts/check.ts (data/ altındaki her JSON'u şemaya ve çapraz referanslara göre doğrular)
  - test: vitest run
  - typecheck: tsc --noEmit
  - build: npm run check && tsc --noEmit && vite build
  - links: tsx scripts/links.ts (verideki bağlantıları dener; Prompt 9'da yazılacak, şimdilik boş betik)
- tsconfig: strict, moduleResolution bundler, jsx react-jsx.
- vite.config.ts: base "./" (dosyadan ya da statik hostingden açılabilsin).
- index.html: lang="tr", başlık "Mimarlık Master Atlası". Tema bayrağını (localStorage "maa_theme") React yüklenmeden önce küçük bir satır içi betikle <html data-theme> olarak uygula; böylece açılışta tema yanıp sönmez.
- .gitattributes: * text=auto eol=lf.
- Geliştirme sunucusunu başlatma aracın bir yapılandırma dosyası istiyorsa (örn. .claude/launch.json) "mimarlik-atlasi" adıyla npm run dev, port 5173 tanımla.

## 2. Klasör yapısı

data/
  countries/{tr,de,it,at,...}.json      ülke düzeyi bilgi (dosya adı = ülke kodu)
  universities/{ülke}/{okul-id}.json    okul + programları (okul başına bir dosya)
  scholarships/{id}.json                burs kayıtları (dosya adı = id)
  fields.json                           alan sözlüğü
  fx.json                               döviz kuru (EUR bazlı, tarihli)
src/
  schema/index.ts                       zod şeması: verinin tek doğruluk kaynağı
  data/dataset.ts                       saf: ham JSON → tipli veri + çapraz denetim (tarayıcıda, betikte ve testte çalışır)
  data/index.ts                         import.meta.glob ile JSON yükleme (eager)
  lib/                                  saf mantık (Prompt 3)
  state/                                localStorage deposu ve türetilmiş görünümler (Prompt 3)
  pages/ components/ content/           arayüz (Prompt 4–5)
  styles/                               tasarım tokenları ve stiller (Prompt 4)
scripts/check.ts, scripts/links.ts
docs/research-notes.md

## 3. Şema (src/schema/index.ts)

Aşağıdaki taslağı zod ile yaz. Alan adlarını İngilizce tut, her alanın üstüne ne işe yaradığını anlatan kısa bir yorum koy. Taslakta eksik ya da çelişkili bir şey görürsen yazmadan önce bana söyle.

Ortak tipler
- DateStr: "YYYY-AA-GG" regex.
- Status: "kesin" | "tahmin".
- Term: "fall" | "spring" | "winter" | "summer".
- Currency: EUR, TRY, USD, CHF, GBP (yeni ülke eklendikçe genişlet; fx.json'da kuru olmalı).
- Per: "semester" | "year" | "month" | "total" | "once".
- Audience: "all" | "eu" | "non-eu" | "tr".
- Lang: "tr" | "en" | "de" | "it" | "fr" | "nl" | "es" | "pt" (gerektikçe ekle).
- Cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2".
- AlesType: "SAY" | "EA" | "SÖZ".
- Money { amount (≥0), currency, per }.
- Link { label, url }.

Dönemler
- Round { name (varsayılan "normal"; örn. "erken", "geç", "ek tur", "AB dışı"), open?, deadline?, audience (varsayılan "all") }
- Step { label (örn. "Portfolyo yükleme", "Çizim sınavı", "Mülakat", "Sonuç ilanı", "Kesin kayıt"), date, end?, note? }
- Intake { term, cycle (örn. "2027-28"), offered: "yes" | "no" | "unknown", rounds: Round[] (varsayılan []), steps: Step[] (varsayılan []), status, note? }

Şartlar (Requirements)
- gpa? { min?, scale: 4 | 100 (varsayılan 4), deMax? (Alman notu tavanı 1.0–4.0, düşük iyi), note? }
- english? { ielts?, toefl?, yds?, yokdil?, cambridge?, moiAccepted? (İngilizce eğitim belgesi yerine geçer mi), note? }
- otherLanguages: { lang, min: Cefr, tests? (örn. "TestDaF 4×4, DSH-2, Goethe C1"), when? (örn. "başvuruda", "kayıtta", "1. yıl sonunda"), note? }[] (varsayılan [])
- ales? { types: AlesType[] (kabul edilen puan türleri), min?: AlesMin, notRequired?, note? }
  AlesMin = sayı | { default, tiers: { gpa, ales }[] } (GNO'ya bağlı kademe; ilk "gpa <= başvuranın GNO'su" kademesi geçerli; kademeler büyük GNO'dan küçüğe sıralı)
- gre? { policy: "required" | "recommended" | "optional" | "no", minQuant?, note? } (mimarlıkta nadir ama bazı programlarda var)
- portfolio? { policy: "required" | "recommended" | "no", format? (örn. "tek PDF, A3 yatay"), maxPages?, maxMB?, contents?: string[] (örn. "3 stüdyo projesi", "el çizimleri", "staj işleri"), note? }
- exams: { kind (örn. "çizim sınavı", "tasarım ödevi", "yazılı sınav", "mülakat", "yetenek sınavı / Aufnahmeprüfung"), note? }[] (varsayılan [])
- priorDegree? { accepted?: string[] (kabul edilen lisans bölümleri, örn. ["Mimarlık", "İç Mimarlık"]), closedToArchitects?: boolean, minEcts? (örn. 240 ya da 300), minSemesters?, prep? (bilimsel hazırlık / eksik ders koşulu), note? }
- ects? { total?, areas: { area, min }[] (örn. "Mimari tasarım stüdyosu: 60"), note? }
- workExperience? { months?, note? }
- scoring? (değerlendirme formülü, örn. "ALES %50 + GNO %30 + mülakat %20")
- documents?: string[] (programa özel belgeler)
- portal? (doğrudan, uni-assist, Universitaly, okulun portalı…)
- advisorLetter?: "required" | "recommended"
- note?

Ücretler
- Tuition { kind: "free" | "paid" | "covered" | "varies" | "unknown", fee?, feeNonEU?, note? }
- RegionalFee { region, fee, appliesTo: Audience, status, note? }
- Costs { tuition, semesterFee? (dönem katkı payı; öğrenim ücretinden ayrı), regionalFee?, applicationFee?, livingPerMonth?, note? }

Burs (kısa kayıt, program/okul/ülke içinde)
- Scholarship { name, provider, coverage, amount?, deadline?, audience (varsayılan "all"), link?, status (varsayılan "kesin"), ref? (data/scholarships içindeki tam kaydın id'si) }

Program
- id (yalnızca a-z 0-9 -), name, nameLocal? (orijinal dildeki adı), degree (insan okunur: "Tezli YL", "M.Sc.", "M.A.", "Laurea Magistrale (LM-4)"…)
- levels: ("master-thesis" | "master-nonthesis" | "master" | "phd")[] en az 1
- fields: string[] (fields.json anahtarları) en az 1
- languages: Lang[] en az 1 (eğitim dili)
- durationSemesters?, durationNote? (örn. "8 dönemlik lisansla 4 dönem, 6 dönemlik lisansla 6 dönem"), ects?
- licensure? { value: "yes" | "no" | "partial" | "unknown", note? } (o ülkede meslek odasına kayıt yolunda sayılıyor mu)
- intakes? (varsa okulunkini tamamen ezer), requirements?, costs?
- scholarships: Scholarship[] (varsayılan []), quota?, notes?, links: Link[] (varsayılan [])

University
- id, country (2 harf), name, short, city, region?, type: "state" | "foundation" | "private"
- kind: "university" | "technical" | "uas" (Fachhochschule/HAW) | "art" (sanat akademisi / güzel sanatlar üniversitesi)
- topTier (varsayılan false): kullanıcının kendi seçtiği güçlü okullar listesi (bir sıralama değil)
- languages: Lang[]
- rankings (varsayılan {}): { qsArch?: { year, rank: string } (QS konu sıralaması "Architecture & Built Environment"; "51–100" gibi bantlar metin olarak), theWorld?: { year, rank: string } }
- intakes: Intake[] (okul geneli; varsayılan []), requirements?, costs?, scholarships: Scholarship[]
- admissionsSummary?, fundingSummary?, people: string[] (öne çıkan hocalar, stüdyolar, araştırma grupları)
- links: Link[], sources: Link[], verifiedAt: DateStr
- programs: Program[] en az 1

Country
- code, name, flag (emoji ya da kısa metin), currency
- terms: Term → { name (örn. "Güz", "Wintersemester"), starts (örn. "Ekim") }
- summary
- gpaConversion? { method: "bavarian", nMax, nMin, status, note } (Almanya ve gerekiyorsa Avusturya için)
- languageNote? (o ülkede mimarlık programlarının dil durumu)
- profession? { body (meslek odası), path (yabancı diplomayla mimar olarak kayıt yolu), foreignDegree (Türk diplomasının durumu), status, source: Link }
- facts: { label, value, status (varsayılan "kesin") }[]
- proofOfFunds? { kind: "blocked-account" | "own-funds", amounts: { label, money }[], accepted: string[], note?, status, source: Link }
- regionalFees: RegionalFee[], scholarships: Scholarship[] (ulusal burslar)
- timeline: { s, e?, t, d?, k: Status, uni? }[] (sınavlar: ALES, YDS, TestDaF; ulusal burs çağrıları; vize dönemleri)
- sources: Link[], verifiedAt

Funding (data/scholarships/<id>.json; tam burs kaydı)
- id, name, provider, category: "tr" | "eu" | "de" | "it" | "at" | "other", hostCountries: string[] (iki küçük harf), hostNote?, summary
- level: "full" | "partial" | "small"
- tuition: "covered" | "waived" | "partial" | "free" | "not-covered" | "varies", tuitionNote?
- stipend?: Money, stipendNote?, extras: string[]
- blockedAccount: "replaces" | "partial" | "no" | "unknown" | "na", blockedAccountNote?
- turkish: "yes" | "no" | "conditional" (Türk vatandaşına açık mı)
- fieldFit: "yes" | "limited" | "no", fieldNote? (mimarlık ve ilgili alanlarda yüksek lisansı destekliyor mu)
- requirements?: Requirements, ageMax?, obligation? (zorunlu hizmet, geri ödeme)
- calls: { cycle, name?, open?, deadline?, status, note? }[]
- howToApply: string[], notes: string[]
- programs: { id, name, short, fields, countries, partners, scholarships: "yes" | "no" | "unknown", calls, stipend?, selfFundedFee?, requirements? (metin), note?, link }[] (Erasmus Mundus gibi çatı programların alt programları)
- links, sources (en az 1), verifiedAt

Diğer
- Fields: kayıt { n (ad), d (ne olduğu), note (kime uygun / dikkat) }
- Fx { date, source, perEUR: Currency → sayı (1 EUR kaç birim) }

Her tip için `export type X = z.infer<typeof X>` ver.

## 4. Çapraz denetimler (src/data/dataset.ts)

parseDataset(raw) saf bir fonksiyon olsun (fs ve Vite kullanmasın); { dataset, errors } dönsün. Hatalı dosyalar atlansın, hata mesajları Türkçe ve "dosya → alan yolu: mesaj" biçiminde olsun. Denetle:
- Ülke dosyasının adı ülke koduyla aynı; burs dosyasının adı id ile aynı.
- Okul id'leri tekil; okulun ülkesi için ülke dosyası var; okul içinde program id'leri tekil.
- Program fields değerleri fields.json'da var.
- Her turda ve adımda bitiş başlangıçtan önce değil.
- Kullanılan her para birimi fx.json'da var (öğrenim, AB dışı, dönem, bölgesel, başvuru ücretleri, burs tutarları, geçim kanıtı).
- ALES kademeleri büyük GNO'dan küçüğe sıralı; ales.min varsa ales.types boş değil.
- Ülke takvimindeki uni referansları gerçek bir okula işaret ediyor.
- Kısa burs kayıtlarındaki ref gerçek bir burs dosyasına işaret ediyor.
- Okulları ülke → şehir → kısa ada göre sırala (Türkçe karşılaştırma).

src/data/index.ts: data/countries/*.json, data/universities/*/*.json, data/scholarships/*.json, fields.json, fx.json dosyalarını import.meta.glob (eager) ile yükleyip parseDataset'e ver; `data` ve `dataErrors` dışa aktar.

scripts/check.ts: aynı dosyaları fs ile okuyup parseDataset çalıştırsın. Hata varsa listeleyip çıkış kodu 1 versin; yoksa "✓ Veri geçerli — N okul, M program (tr: x okul, de: y okul…), K burs" yazsın.

## 5. Başlangıç verisi

- data/fields.json: şu anahtarlarla yaz ve her birine Türkçe n / d / note doldur. note'ta "mimarlık mezunu için dikkat" bilgisini ver (örn. planlama programlarının bir kısmı planlama lisansı isteyebilir). Genel bilgi yaz; belirli okul adı ya da sayı yazma.
  design (Mimari tasarım), urban (Kentsel tasarım), planning (Şehir ve bölge planlama), heritage (Restorasyon / koruma / kültürel miras), history (Mimarlık tarihi ve kuramı), tech (Yapı bilgisi / yapı teknolojisi / yapı fiziği), sustain (Sürdürülebilir mimarlık / iklim), computational (Bilişimsel tasarım / dijital üretim / BIM), landscape (Peyzaj), interior (İç mimarlık / mekân / sergi), management (Proje ve yapım yönetimi / gayrimenkul), other (Diğer). CLAUDE.md'deki ilgi alanlarımla uyuşmayan bir şey varsa söyle.
- data/fx.json: Bugünün EUR bazlı kurları. TRY için TCMB'yi, diğerleri için ECB referans kurunu kaynak göster, tarihi yaz. Kaynağa ulaşamazsan bana sor; uydurma.
- data/countries/tr.json ve CLAUDE.md'deki ülkelerden biri için en az iskelet ülke dosyası (terms, summary, currency, verifiedAt). Bilmediğin alanı boş bırak; ayrıntıyı Prompt 6–7'de dolduracağız.
- Bir Türkiye ve bir yurt dışı programını gerçekten resmi sayfasından doğrulayıp ekle (şemanın gerçek veriyle çalıştığını görmek için). Doğrulayamadığın alanı boş bırak, tarih tahminse "tahmin" yaz.

## 6. Bitirirken

- npm install, npm run check, npm run typecheck geçmeli.
- CLAUDE.md'nin 3. (Komutlar tablosu) ve 4. (Mimari: klasör yapısı + "ProgramView okul/ülke varsayılanlarını birleştirir: intakes, requirements, costs program düzeyinde yoksa okuldan miras alınır") bölümlerini doldur. 5. bölüme şemaya özgü kuralları ekle: id biçimi, fields anahtarları listesi, ALES kademelerinin sırası ve types zorunluluğu, Alman notu için Bavyera formülü (1 + 3·(Nmax − GNO)/(Nmax − Nmin); Nmax/Nmin Türk üniversitesine göre değişir, bağlayıcı değer uni-assist VPD'sinde çıkar), para birimlerinin fx.json'da olması.
- Commit at. Bana şemayı kısaca anlat ve eklediğin iki programın kaynak linklerini ver.
````
