# Prompt 3: Hesap mantığı ve testler

Bu adımda agent uygulamanın "beynini" yazar: profiline göre uygunluk (ALES puan türü, dil seviyesi, portfolyo, diploma uyumu…), yıllık maliyet, sıradaki son tarih, filtreler, takvim ve takvim dosyası. Bunlar arayüzden ayrı, test edilen saf fonksiyonlardır. Böylece arayüz değişse de hesaplar bozulmaz.

Bitince `npm test` çalışır ve testler geçer.

Aşağıdaki kutunun içini kopyalayıp agent'a yapıştır:

````text
CLAUDE.md'yi oku. Şimdi src/lib/ altındaki saf mantığı ve testlerini yazacağız. Kural: arayüz hesap yapmaz, lib'i çağırır. Önce src/lib/lib.test.ts'e testleri yaz, çalıştır ve kırıldığını gör; sonra kodu yaz ve testleri geçir.

## Modüller

dates.ts
- parseD("YYYY-AA-GG") yerel saatle Date; today() (saat sıfırlanmış); daysBetween(a, b).
- fmt (örn. "15 Ocak 2027"), fmtRange ("15 Kas – 15 Oca 2027"), AYLAR (Türkçe ay adları).
- countdown(s, e?, T) → { days, past, active } (pencere açık mı, kaç gün kaldı).
- urgency(days) → "hot" (≤7) | "soon" (≤21) | "later" | "past".
- windowProgress(open, deadline, T) → 0–1 (başvuru penceresinin ne kadarı geçti).

money.ts
- perYear(m): semester ×2, month ×12, year ×1; total ve once için null.
- convert(amount, from, to, fx) (fx.perEUR üzerinden; kur yoksa null).
- fmtMoney (tr-TR biçimi, "1.500 €", "45.000 TL").

text.ts
- norm(s): Türkçe duyarlı arama normalleştirme (İ/ı/I, ş, ğ, ç, ö, ü; Almanca/İtalyanca aksanlar; küçük harf).
- TERM_LABEL, LANG_LABEL, LEVEL_LABEL, ALES_LABEL gibi Türkçe etiketler.

rank.ts
- rankPos("=143") → 143, "51–100" → 51, "2001+" → 2001, geçersiz → undefined.

programs.ts
- ProgramView { key: "<okulId>/<programId>", uni, program, country, intakes, requirements, costs, scholarships (program + okul), nationalScholarships (ülke) }.
- buildViews(dataset): program.intakes varsa okulunkini tamamen ezer; requirements okul + program birleşimi (program alanı okulunkini ezer, bir seviye derin); costs program ?? okul.
- offeredTerms(intakes) → { yes, no, unknown }.
- singleTermOnly(intakes): tam olarak bir dönemde "yes" ve en az bir dönemde açıkça "no".
- nextDeadline(intakes, T): offered "no" olanları ve geçmiş tarihleri atla; en yakın son günü döndür; son gün yoksa açılış tarihini ("open") döndür.

eligibility.ts
- Profile {
    degree?: string (lisans bölümü, örn. "Mimarlık"),
    totalEcts?: number, semesters?: number,
    gpa?, gpaScale: 4 | 100,
    ales: Partial<Record<AlesType, number>>,
    ielts?, toefl?, yds?, yokdil?,
    languages: Partial<Record<Lang, Cefr>> (İngilizce dışı diller),
    portfolio: "none" | "draft" | "ready",
    practiceMonths?,
    nonEU: boolean (Türk vatandaşı yurt dışında AB dışı; varsayılan true),
    ects: Record<string, number> (alan başına tamamlanan ECTS),
    interests: string[] (fields.json anahtarları),
    greQ?
  }
  EMPTY_PROFILE ver.
- checkRequirements(req, profile, country?) → { overall, items[] }. Her item: { key, label, status: "ok" | "near" | "fail" | "unknown" | "na", need (ne isteniyor), detail? (senin durumun) }.
  - GNO: aynı ölçekteyse karşılaştır; 4'lükte 0,1 altı "near"; 100'lükte 3 puan altı "near". Ölçek farklıysa "unknown" + "Ölçek farklı".
  - Alman notu (deMax): ülkenin gpaConversion'ı ile Bavyera formülü: 1 + 3·(Nmax − GNO)/(Nmax − Nmin), 1,0–4,0 aralığına sıkıştır, 2 ondalık. 0,2 fazlası "near". Dönüşüm kuralı yoksa "unknown".
  - ALES: notRequired → "na". Aksi halde programın kabul ettiği türlerdeki puanlarımın en yükseğini kullan. Kademeli eşikte GNO'ya göre eşik bul; GNO tüm kademelerin altındaysa "fail". 5 puan altı "near". Kabul edilen türlerde hiç puanım yoksa "unknown" ve hangi türlerin kabul edildiğini yaz.
  - İngilizce: kabul edilen sınavlardan herhangi biri yeterse "ok". Tolerans: IELTS 0,5, TOEFL 5, YDS/YÖKDİL 5 → "near". Karşılaştırılacak puan yoksa "unknown"; MOI kabul ediliyorsa detail'de belirt.
  - Diğer diller: her otherLanguages kaydı için CEFR sırası A1<A2<B1<B2<C1<C2. Seviyem yeterse "ok", bir seviye altıysa "near", daha düşükse "fail", hiç yoksa "unknown". when "kayıtta" ya da "1. yıl sonunda" ise detail'de söyle (başvuru anında şart değil).
  - Portfolyo: policy "required" → ready "ok", draft "near", none "fail". "recommended" → ready "ok", diğerleri "near". "no" → item ekleme.
  - Önceki diploma: closedToArchitects → "fail". accepted listesi varsa ve bölümüm listede değilse "fail"; bölümüm yoksa "unknown". minEcts varsa: totalEcts yeterse "ok", 30 ECTS'ye kadar eksikse "near" (detail: "eksik ders / şartlı kabul olabilir"), fazlasıysa "fail".
  - Ders uyumu: her areas kaydı için ≥ min "ok", ≥ %80 "near", altı "fail", alan profilde yoksa "unknown".
  - İş deneyimi: months varsa practiceMonths ile karşılaştır; yoksa "unknown".
  - GRE: yalnızca policy "required" ise kontrol et.
  - overall: "na" dışındaki en kötü durum (fail > near > unknown > ok). Hiç kriter yoksa "none".
- isProfileEmpty(profile): not ve puanların hiçbiri girilmemişse true.

cost.ts
- yearlyCost(view, fx, nonEU) → { eurPerYear (öğrenim ücreti bilinmiyorsa null), free, lines: { label, eurPerYear, note? }[], hasRegionalFee }.
  Satırlar: öğrenim ücreti (nonEU ve feeNonEU varsa onu kullan, etiket "Öğrenim ücreti (AB dışı)"), dönem katkı payı, bölgesel ücret (appliesTo "all" ya da nonEU iken "non-eu" ise). free = öğrenim ücretsiz ve toplam 0.

filters.ts (program gezgini; durum adres çubuğunda saklanır)
- Filters: scope ("" | "tr" | "abroad"), country[], city[], uni[], field[], level[], lang[], term[], single (tek dönem alanlar), due (N gün içinde son başvuru), elig ("" | "ok" | "okNear"), free, maxEur, regional ("" | "yes" | "no"), schol (burs var), noAles, alesType[] (bu puan türlerinden birini kabul edenler), noPortfolio (portfolyo zorunlu olmayanlar), noExam (sınav/mülakat olmayanlar), englishOnly (yalnızca İngilizce, başka dil şartı yok), licensure (meslek odası yolu "yes" olanlar), maxIelts, maxGpa, top (benim seçtiğim okullar), rank (QS mimarlık sırası en fazla N; bantlar en iyi konumla sayılır; top ve rank ikisi birden açıksa okulun birine uyması yeter), mine (ilgi alanlarım), sl (kısa listem), q (metin araması), sort ("deadline" | "cost" | "name" | "uni").
- parseFilters(URLSearchParams) ve serializeFilters(Filters) birbirinin tersi olmalı; varsayılan değerler URL'ye yazılmamalı. Yeni filtre eklenirse ikisi birden güncellenir (CLAUDE.md'ye bu kuralı yaz).
- derive(views, { profile, fx, T }) → her program için { view, next, cost, check }.
- applyFilters(items, f, { shortlist, interests, T }) ve sıralama (son tarih yoksa sona; eşitlikte ada göre, Türkçe).
- matchesQuery: program adı, orijinal adı, derece, notlar, okul adı/kısa adı, şehir, bölge, ülke, hocalar; her kelime geçmeli (norm ile).

calendar.ts
- buildCalendar(views, countries, fundings) → CalEvent[] { uid, s, e?, t, d?, k, country?, hosts?, href?, keys (ilgili program anahtarları), kind: "general" | "application" | "step" | "scholarship" }.
  - Ülke takvimi olayları "general".
  - Okul geneli turlar okul başına bir olay (aynı turu paylaşan programlar keys'e eklenir); program kendi intakes'ini tanımladıysa program başına bir olay. offered "no" atlanır.
  - Step'ler (portfolyo, sınav, mülakat, sonuç) "step" olayı.
  - Burs çağrıları "scholarship" olayı (Prompt 8'de veri gelecek; fonksiyon şimdiden hazır olsun).
  - Başlığa okul kısa adı, dönem adı (ülkenin terms etiketinden), cycle ve tur adı ("normal" değilse) girsin.

ics.ts
- buildIcs(events, stamp): RFC 5545, tüm gün olaylar; DTEND bir sonraki gün (dışlayıcı); virgül, noktalı virgül, ters bölü ve satır sonu kaçışı; 75 oktet satır katlama; CRLF.
- downloadText(filename, text, mime).

scholarships.ts (Prompt 8'de kullanılacak ama şimdi yaz)
- CATEGORY_LABEL, LEVEL_LABEL, TUITION_LABEL, BLOCKED_LABEL, TURKISH_LABEL, FIELDFIT_LABEL.
- allCalls(f) (alt programların çağrıları dahil, bursu "no" olanlar hariç), nextCall(f, T), hostsOf(f), eurPerMonth(money, fx) (toplam ve bir kez için null), fundingCheck(f, profile).
- FundingFilters { q, cat, host, full, ba (bloke hesabın yerine geçer), fit (mimarlığa uygun), tr (Türk vatandaşına açık), open (ileride çağrısı var) } + parse/serialize + matchFunding + sortFundings (Türk vatandaşına açık önce, sonra tam burs, sonra aylık tutar büyükten küçüğe, sonra ad).

## Durum deposu (src/state/)

store.tsx: React context + localStorage.
- Anahtar "maa_v1_user"; içerik { profile, shortlist: string[], compare: string[] (en fazla 4), tracker: Record<programKey, { status, docs: Record<belge, boolean>, notes, updated }> }.
- TRACK_STATUSES: "araştırılıyor", "hazırlanıyor", "başvuruldu", "sınav/mülakat", "kabul", "ret", "vazgeçildi".
- Yüklerken eksik alanları varsayılanlarla birleştir (ileride yeni alan eklenince eski veri bozulmasın); okunamazsa boş başla, hiçbir zaman sessizce silme.
- exportJson() (version alanıyla) ve importJson(text) (geçersiz dosyada Türkçe hata).
- localStorage erişilemezse bellekte devam et.
data.ts: views = buildViews(data), countries, vb. türetilmiş, bir kez hesaplanan görünümler.

## Testler (en az bunlar)

- ALES: tek eşik; kademeli eşik (GNO kademeleri arasında doğru eşik, en alt kademenin altı fail, GNO yoksa default); puan türü (SAY ve EA kabul eden programda EA puanım kullanılır; yalnızca SÖZ puanım varsa unknown); notRequired sonucu etkilemez.
- Bavyera: (4, 4, 1) → 1,0; (1, 4, 1) → 4,0; (3,0, 4, 1) → 2,0; deMax karşılaştırmasında ok / near / fail.
- İngilizce: herhangi bir sınav yeter; tolerans near; puan yoksa unknown.
- CEFR: C1 isteyen programda B2 near, B1 fail, C2 ok; when "kayıtta" detail'e yazılır.
- Portfolyo: required + draft near, required + none fail, recommended + none near.
- Diploma: accepted listesinde olmayan bölüm fail; 240 ECTS'li profil 300 isteyen programda fail, 270 near.
- nextDeadline geçmiş turları ve offered "no" dönemleri atlar; singleTermOnly yalnızca kış alan programı yakalar, tek kayıtlı listeyi yakalamaz.
- yearlyCost: AB dışı ücret seçimi, bölgesel ücretin yalnızca AB dışına uygulanması, öğrenim ücreti bilinmiyorsa toplam null.
- parseFilters(serializeFilters(f)) eşitliği (dolu bir örnekle) ve varsayılanların URL'ye yazılmaması.
- rankPos bant ve "=" biçimleri; norm("İSTANBUL") ile norm("istanbul") eşit.
- buildIcs: DTEND bir gün sonra, uzun satır katlanır, virgül kaçışlı.
- buildCalendar: okul geneli tur tek olay ve iki programın anahtarını taşır; step olayları üretilir; offered "no" olay üretmez.

## Bitirirken

npm test, npm run typecheck, npm run check geçmeli. CLAUDE.md'nin 4. bölümüne lib modüllerini ve "filtre eklersen parse + serialize ikisini birden güncelle" kuralını, localStorage anahtarlarını ve "yapıyı değiştirirsen eski veriyi geriye uyumlu oku" kuralını ekle. Commit at. Bana uygunluk kurallarını tablo halinde özetle; değiştirmek istediğim bir eşik var mı diye sor.
````
