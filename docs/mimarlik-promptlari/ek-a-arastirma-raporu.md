# Ek A (isteğe bağlı): claude.ai'da ülke araştırma raporu istemek

Bir ülkeyi geniş taramak için claude.ai sohbetinde **Research (Araştırma)** modunu kullanabilirsin. Çıkan rapor uygulamaya doğrudan girmez; Ek B ile agent'ına doğrulattırırsın. Bu tür raporlarda dil, son tarih ve ücret bilgileri sık sık yanlış çıkar, o yüzden doğrulama adımını atlama.

Bu prompt Claude Code'a değil, **claude.ai sohbetine** verilir. Raporu bitince `.md` olarak indir ve proje klasörüne ya da İndirilenler'e kaydet.

````text
Türk vatandaşı, 4 yıllık (8 dönem, yaklaşık 240 ECTS) mimarlık lisans mezunu bir aday için [ÜLKE]'deki yüksek lisans programlarını araştır. Mezuniyet: [AY YIL]. GNO: [GNO]/[ÖLÇEK]. Dil: İngilizce [SEVİYE / SINAV PUANI], [DİĞER DİL VE SEVİYE]. İlgi alanları: [ALANLAR]. Bütçe: [BÜTÇE / BURS ŞART MI].

Kapsam: mimarlık, kentsel tasarım, planlama, restorasyon ve kültürel miras, yapı teknolojisi, sürdürülebilir mimarlık, bilişimsel tasarım, peyzaj ve iç mimarlık alanlarındaki, mimarlık mezununun başvurabildiği yüksek lisans programları.

Her program için bir tablo satırı ver:
okul | şehir | program (orijinal adıyla) | eğitim dili | süre ve ECTS | dil şartı (sınav ve puan / CEFR) | portfolyo şartı ve biçimi | sınav veya mülakat | kabul edilen lisans ve ECTS şartı | not şartı | başlangıç dönemleri (yalnızca biri mi) | AB dışı aday için son başvuru tarihi | öğrenim ücreti (AB dışı) | dönem katkı payı ve bölgesel ücret | başvuru ücreti | meslek odası kaydında sayılıyor mu | resmi kaynak linki.

Kurallar:
- Her satırda programın resmi sayfasına link zorunlu. Bulamadığın bilgiyi tahmin etme; hücreye "doğrulanmadı" yaz.
- Eğitim dilini programın kendi sayfasından al; İngilizce sanılan ama Almanca/İtalyanca öğretilen programları ayrıca belirt.
- Tarih, geçen yıla aitse "geçen yıl" diye işaretle.
- Üçüncü taraf sitelerden (MastersPortal vb.) gelen bilgiyi "üçüncü taraf" diye işaretle.

Sonunda ayrı bölümler: (1) ülkenin genel başvuru süreci ve diploma tanıma adımları, (2) AB dışı öğrenciler için ücret kuralları, (3) vize için geçim kanıtı, (4) yabancı diplomayla mimar olarak meslek odasına kayıt yolu, (5) bu profile uygun burslar, (6) emin olamadığın noktaların listesi.
````
