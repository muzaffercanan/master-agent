# Ek C: Dönemsel güncelleme (ilanlar çıktıkça)

Başvuru ilanları yıl içinde parça parça çıkar. Türkiye'de güz ilanları çoğunlukla bahar sonu ve yaz başında, bahar ilanları Kasım–Aralık'ta yayımlanır; yurt dışı okulları ve burslar kendi takvimlerine göre açılır. Bu promptu ayda bir ya da önemli bir dönem yaklaşırken ver.

````text
CLAUDE.md'yi ve docs/research-notes.md'yi oku. Bugünün tarihine göre dönemsel güncelleme yapacağız.

1. Takipteki ve kısa listemdeki programları öğrenmek için bana localStorage'daki listemi sor (ya da Profil → dışa aktar ile verdiğim JSON'u oku). Önceliği bunlara ver.
2. "tahmin" durumundaki tarihlerden ilanı yayımlanmış olabilecekleri bul (önümüzdeki 120 gün içindeki ve geçen yıl bu zamana kadar ilan edilmiş olanlar). Her birinin resmi sayfasına bak; ilan çıktıysa tarihi düzelt, kesin yap, note'u güncelle.
3. verifiedAt 90 günden eski kayıtları listele; önce takibimdekileri, sonra diğerlerini yeniden doğrula.
4. Burs çağrıları: yayımlanmamış 2027/2028 çağrılarından çıkanları ekle (Erasmus Mundus programları, ulusal burslar, DSU, okul bursları).
5. Döviz kurlarını (fx.json) güncelle, tarihini ve kaynağını yaz.
6. ÖSYM sınav takvimi ve dil sınavı tarihlerinde değişiklik var mı bak.
7. npm run check, typecheck, test; commit ("Update announcements: <ay yıl>").
8. Bana özet: kesin'e çevrilen tarihler, değişen tarihler (eski → yeni), yeni eklenen burs çağrıları, önümüzdeki 60 gündeki son tarihlerim, hâlâ ilan bekleyenler ve beklenen ay.
````

İpucu: Claude Code'da zamanlanmış görevler (örneğin `/schedule`) kullanabiliyorsan bu promptu ayda bir otomatik çalışacak şekilde kurabilirsin. Kurmadan önce agent'a nasıl çalıştığını sor.
