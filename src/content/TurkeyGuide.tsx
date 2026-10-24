// Turkey-specific guide prose carried over from the v1 single-page report.
import { Link } from "react-router-dom";
import { data, views } from "../state/data";

function CsrTable() {
  const max = Math.max(...data.csr.map(r => r.a));
  const bar = (x: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span className="num" style={{ width: 34 }}>{x.toFixed(1)}</span>
      <div className="bar" style={{ flex: 1 }}><i style={{ width: `${((x / max) * 100).toFixed(1)}%` }} /></div>
    </div>
  );
  return (
    <div className="tbl-wrap">
      <table>
        <thead><tr><th>Kurum</th><th>2016–2026</th><th>2021–2026</th><th>Makale (2021–26)</th><th>Öne çıkan araştırmacılar (alan)</th></tr></thead>
        <tbody>
          {data.csr.map(r => (
            <tr key={r.i}><td><b>{r.i}</b></td><td>{bar(r.a)}</td><td>{bar(r.b)}</td><td className="num">{r.p}</td><td className="small">{r.people}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FieldsGuide() {
  const tr = views.filter(v => v.uni.country === "tr");
  return (
    <div className="fields">
      {Object.entries(data.fields).map(([k, F]) => {
        const byCity = new Map<string, string[]>();
        for (const v of tr) if (v.program.fields.includes(k)) byCity.set(v.uni.city, [...(byCity.get(v.uni.city) ?? []), `${v.uni.short}: ${v.program.name}`]);
        const total = [...byCity.values()].reduce((a, b) => a + b.length, 0);
        return (
          <div className="fcard" key={k}>
            <div style={{ display: "grid", gap: 7, alignContent: "start" }}>
              <h3>{F.n}</h3>
              <p className="small">{F.d}</p>
              <p className="small muted"><b>CS mezunu için:</b> {F.note}</p>
              <Link className="eyebrow" to={`/programlar?scope=tr&field=${k}`}>{total} program kaydı →</Link>
            </div>
            <div className="where">
              {[...byCity.entries()].map(([city, list]) => <div key={city}><b>{city}</b> · {list.join(" · ")}</div>)}
              {!total && <span className="muted">Bu raporda kayıt yok.</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TurkeyGuide() {
  return (
    <>
      <section id="sartlar" style={{ paddingBottom: 0 }}>
        <div className="sec-head">
          <div className="eyebrow">Türkiye · ortak kurallar</div>
          <h2>Başvuru şartları</h2>
          <p className="lede">YÖK'ün Lisansüstü Eğitim ve Öğretim Yönetmeliği asgari şartları koyar, üniversiteler bunun üstüne kendi eşiklerini ekler. Bir CS mezunu bilgisayar programlarının çoğunda "alan içi" sayılır ve bilimsel hazırlık almaz.</p>
        </div>
        <div className="grid2">
          <div className="box">
            <h3>ALES (veya GRE/GMAT)</h3>
            <ul>
              <li>Tezli yüksek lisansta yasal alt sınır: ilgili puan türünde <b className="num">55</b>. Güçlü bölümler çok daha yüksek ister: ODTÜ Bilgisayar ve Koç <b className="num">80</b>, İTÜ Bilgisayar <b className="num">80–85</b>, Boğaziçi ve Galatasaray <b className="num">70</b>, Sabancı <b className="num">65</b>.</li>
              <li>Bilgisayar ve mühendislik programları çoğunlukla <b>Sayısal (SAY)</b> puan ister. Bazı bilişim/YZ programları EA ve SÖZ de kabul eder (Hacettepe Bilişim YZ, Ankara Üni. YZ Enstitüsü, GTÜ YBS).</li>
              <li>Tezsiz programların büyük kısmında ALES aranmaz (Boğaziçi Yazılım, Hacettepe Bilişim tezsizleri, Sabancı IT ve Veri Analitiği, YTÜ, Atılım).</li>
              <li>ALES ve GRE sonuçları 5 yıl geçerli. Değerlendirmede ALES'in ağırlığı en az %50'dir.</li>
            </ul>
          </div>
          <div className="box">
            <h3>ALES ↔ GRE Sayısal karşılıkları</h3>
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>ALES SAY</th><th>GRE Quant. (yeni)</th><th>Nerede geçer</th></tr></thead>
                <tbody>
                  <tr><td className="num">55</td><td className="num">149</td><td>YÖK alt sınırı, Bilkent (yabancılar için GRE 157)</td></tr>
                  <tr><td className="num">65</td><td className="num">≈151</td><td>Sabancı tezli (GRE 153 istiyor)</td></tr>
                  <tr><td className="num">70</td><td className="num">153</td><td>Boğaziçi, Galatasaray, GTÜ</td></tr>
                  <tr><td className="num">75</td><td className="num">155</td><td>ODTÜ Veri Bilişimi</td></tr>
                  <tr><td className="num">80</td><td className="num">156</td><td>ODTÜ Bilgisayar, Koç, İTÜ</td></tr>
                  <tr><td className="num">85</td><td className="num">158</td><td>İTÜ (GNO 2.60–2.74 ise), ODTÜ doktora</td></tr>
                </tbody>
              </table>
            </div>
            <p className="small muted">Kaynak: ODTÜ ve İTÜ dönüşüm tabloları; ≈ işaretli satır aradeğerdir. Her üniversite kendi tablosunu kullanır.</p>
          </div>
          <div className="box">
            <h3>İngilizce</h3>
            <ul>
              <li>ÖSYM sınavları: YDS / e-YDS / YÖKDİL tipik eşik <b className="num">50–80</b> (DEÜ 50, Hacettepe YZ 55, İTÜ ve Sabancı 65, Galatasaray 70, AGÜ 73, Koç 80). YDS 5 yıl geçerli.</li>
              <li>TOEFL iBT: <b className="num">78–87</b> (İTÜ ve Sabancı 78, Boğaziçi 79 + yazma 22, Koç 80, Bilkent ve AGÜ 87). Ocak 2026'dan itibaren TOEFL yeni 1–6 ölçeğine geçti: İTÜ 4, Bilkent 4,5 istiyor. TOEFL 2 yıl geçerli.</li>
              <li>IELTS 6.5 çoğu yerde geçer, <b>Koç IELTS kabul etmiyor</b>.</li>
              <li>Kurum sınavları: ODTÜ EPE (65), Boğaziçi BUEPT (C), İTÜ YDY (65), GTÜ İngilizce (60), TOBB ETÜ sınavı.</li>
              <li>Boğaziçi ve İTÜ'ye dil belgesi olmadan başvurulabiliyor; belgeyi kayıttan (İTÜ'de ders almadan) önce getirmek gerekiyor.</li>
            </ul>
          </div>
          <div className="box">
            <h3>Not ortalaması ve değerlendirme</h3>
            <ul>
              <li>İlan edilen GNO eşikleri 2.00–2.80/4.00 arası (ODTÜ Bilgisayar 2.60, Boğaziçi 2.50, Hacettepe Bilgisayar 2.80, Atılım tezli 2.50). Rekabetçi programlarda kabul edilenlerin ortalaması eşiğin belirgin üstündedir.</li>
              <li>Ağırlıklar programa göre değişir. ODTÜ Bilgisayar: %50 ALES + %30 GNO + %20 komisyon, mülakat yok. Hacettepe Bilişim YZ: %50 ALES + %10 dil + %10 GNO + %30 mülakat. Atılım tezli: %50 ALES + %50 GNO.</li>
              <li>Yazılı ya da sözlü bilimsel değerlendirme yapan yerlerde (Hacettepe, Gazi, Ankara Üni.) sınavdan 100 üzerinden en az 50 almak gerekir. Hacettepe Bilgisayar'ın yazılı sınavı bütün lisans müfredatını kapsar.</li>
            </ul>
          </div>
          <div className="box">
            <h3>Belgeler</h3>
            <ul>
              <li>Transkript ve diploma ya da mezuniyet belgesi (e-Devlet barkodlu).</li>
              <li>ALES/GRE sonuç belgesi ve İngilizce belgesi.</li>
              <li>Niyet mektubu (statement of purpose). Hacettepe Bilgisayar en fazla 500 kelimelik İngilizce metin istiyor.</li>
              <li>En az 2 referans mektubu (İTÜ'de biri akademik olmalı), CV, fotoğraf.</li>
              <li>Bazı yerlerde başvuru ücreti var (TOBB ETÜ 300 TL, ODTÜ program başına).</li>
            </ul>
          </div>
          <div className="box">
            <h3>Danışman kabul mektubu</h3>
            <ul>
              <li><b>İTÜ Bilgisayar Mühendisliği</b>: programdaki bir öğretim üyesinden kabul mektubu <b>zorunlu</b>, yoksa başvuru reddediliyor.</li>
              <li><b>İTÜ Bilgisayar Bilimleri</b>: destek mektubu öneriliyor.</li>
              <li><b>Hacettepe Bilgisayar</b>: bölüm yönergesi, çalışılacak öğretim üyesinden kabul mektubu alınmasını istiyor.</li>
              <li><b>GTÜ doktora</b> ve <b>Boğaziçi Yazılım (tezliye geçiş)</b>: öğretim üyesiyle önceden görüşme bekleniyor.</li>
              <li>Diğer yerlerde zorunlu değil, ama başvurudan önce 1–2 hocaya kısa ve somut bir e-posta atmak kabul şansını belirgin artırır.</li>
            </ul>
          </div>
          <div className="box">
            <h3>Tezli mi, tezsiz mi?</h3>
            <ul>
              <li><b>Tezli</b>: genelde 4 dönem (azami 6), 7 ders + seminer + tez. Doktora ve akademi için gerekli. Devlet üniversitelerinde normal sürede harç alınmaz. Vakıf üniversitelerinde çoğunlukla ücret muafiyeti ve aylık burs ya da asistanlık verilir.</li>
              <li><b>Tezsiz</b>: 10 ders + dönem projesi, 3 dönem civarı. Çoğu akşam veya hibrit ve ücretli. Genelde ALES istenmez. Çalışanlar için uygundur ama doktoraya doğrudan kapı açmaz.</li>
              <li>Aynı anda yalnızca bir tezli programa kayıtlı olunabilir. Tezsiz programlar bu kuralın dışındadır.</li>
            </ul>
          </div>
          <div className="box">
            <h3>"Bilgisayar Bilimleri" diploman varsa</h3>
            <ul>
              <li>Diploman "Bilgisayar Mühendisliği" değil de "Bilgisayar Bilimleri" ise her programın <i>başvurabilecek bölümler</i> listesine bak.</li>
              <li>İTÜ Bilgisayar Bilimleri ve Bilgisayar Mühendisliği listelerinde Bilgisayar Bilimleri açıkça var.</li>
              <li>YTÜ Yapay Zeka ve Veri Müh. programı Bilgisayar Bilimleri'ni <i>alan dışı</i> sayıyor. GTÜ Bilgisayar Müh. 1. şube yalnızca Mühendislik Fakültesi Bilgisayar Müh. mezunlarını alıyor; diğerleri en fazla 5 kişilik 2. şubeye giriyor ve bilimsel hazırlık alabiliyor.</li>
            </ul>
          </div>
          <div className="box">
            <h3>Burs ve finansman</h3>
            <ul>
              <li><b>TÜBİTAK 2210</b> (1 Ocak 2026 tutarları): 2210-A tam burs <b className="num">16.500 TL/ay</b>. 2210-C (öncelikli alanlar, <b>yapay zekâ</b> ve yeni nesil haberleşme dahil) ve 2210-D (sanayi) <b className="num">19.000 TL/ay</b>. TÜBİTAK projesinde çalışana <b className="num">22.500 TL/ay</b>, süre 24 ay. Yılda iki çağrı var. Başvurmak için bir YL programına kayıtlı olmak (en geç 3. dönem), <b>ALES ≥80</b> ve <b>YDS ≥80</b> gerekir (2210-A).</li>
              <li><b>Vakıf üniversiteleri</b>: Bilkent'te kabul edilen herkese öğrenim bursu verilir. Koç'ta ücret muafiyeti, aylık burs, konut, sağlık sigortası ve seyahat desteği var. Sabancı ve Özyeğin'de ücret muafiyeti ve/veya aylık burs. TOBB ETÜ'de tam burs veya %150 özel başarı bursu.</li>
              <li><b>Sektör iş birlikleri</b>: ASELSAN Akademi kontenjanları (Hacettepe Bilgisayar 30, GTÜ YZ 20; ASELSAN çalışanlarına yönelik), ODTÜ YZ Mühendisliği için Yandex bursu (2025), Koç KUIS AI bursu.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="hocalar" style={{ paddingBottom: 0 }}>
        <div className="sec-head">
          <div className="eyebrow">Öğretim üyesi kalitesi</div>
          <h2>Hocalar ve araştırma gücü</h2>
          <p className="lede">"İyi hoca"yı tek bir sayı ölçmez. Burada iki bağımsız gösterge var: YÖK'ün kurum geneli araştırma performansı ve CSRankings'in bilgisayar bilimine özel, öğretim üyesi bazlı yayın verisi. İkisini birlikte oku, sonra danışman adaylarının kendi sayfalarına bak.</p>
        </div>
        <div className="grid2" style={{ marginBottom: 22 }}>
          <div className="box">
            <h3>YÖK Araştırma Üniversiteleri 2025</h3>
            <p className="small muted">Kurum genelinde (tüm alanlar) araştırma performansı. Parantezdeki sayı 23 üniversite içindeki sıradır.</p>
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Grup</th><th>Üniversiteler</th></tr></thead>
                <tbody>
                  <tr><td><span className="pill kesin">A1</span></td><td>Koç (1), Sabancı (2), ODTÜ (3), İTÜ (4), Boğaziçi (5)</td></tr>
                  <tr><td><span className="pill na">A2</span></td><td>YTÜ (6), Bilkent (7), Hacettepe (8), İYTE (9), Ankara (10), İstanbul (11), Ege (12), Gazi (13), Erciyes (14), Sakarya (15), Atatürk (16), İÜ-Cerrahpaşa (17)</td></tr>
                  <tr><td><span className="pill na">A3</span></td><td>Marmara (18), Gebze Teknik (19), Çukurova (20), Fırat (21), KTÜ (22), Bursa Uludağ (23)</td></tr>
                  <tr><td><span className="pill tahmin">Aday</span></td><td>2025'te ilk kez aday: TOBB ETÜ, Özyeğin, İstinye, Medipol, RTEÜ. İzlemede: Akdeniz, Dokuz Eylül, Kocaeli, Ondokuz Mayıs, Selçuk</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="box">
            <h3>İyi bir danışmanı nasıl anlarsın?</h3>
            <ul>
              <li>Son 3 yılda yayını var mı? Google Scholar veya DBLP'de kontrol et.</li>
              <li>Aktif projesi var mı (TÜBİTAK 1001, ARDEB, AB/ERC, sanayi)? Proje, bursiyerlik ve maaş demek.</li>
              <li>Kaç öğrencisi var, mezunları nereye gitti? Laboratuvar sayfasında "alumni" kısmına bak.</li>
              <li>Hocaya konu önerisi, kısa CV ve bir iki cümlelik ilgi alanı içeren kısa bir e-posta at. İTÜ ve Hacettepe'de bu adım zaten başvurunun parçası.</li>
              <li>Mümkünse mevcut öğrencilerinden biriyle konuş. Danışman ilişkisi, üniversitenin sıralamasından daha belirleyicidir.</li>
            </ul>
          </div>
        </div>
        <h3 style={{ margin: "10px 0 8px" }}>CSRankings verisine göre Türk bilgisayar bölümleri</h3>
        <p className="small muted" style={{ maxWidth: "80ch", marginBottom: 14 }}>Yalnızca seçici üst düzey konferanslardaki makaleler sayılır (NeurIPS, CVPR, ACL, ICSE, IEEE S&amp;P, ISCA gibi). Her makale yazar sayısına bölünür ("ağırlıklı yayın"). Veri, CSRankings açık veri setinden 26 Eylül 2026'da çekildi. Dergi yayınlarını ve bu listede olmayan konferansları kapsamaz; kurum listesi de eksik olabilir (örneğin GTÜ ve Bahçeşehir listede yok).</p>
        <CsrTable />
      </section>

      <section id="strateji" style={{ paddingBottom: 0 }}>
        <div className="sec-head">
          <div className="eyebrow">Profiline göre</div>
          <h2>Strateji önerileri</h2>
        </div>
        <div className="grid2">
          <div className="box">
            <h3>Akademi veya yurt dışı doktora hedefi</h3>
            <p className="small muted">Tezli, araştırma yoğun, danışman odaklı</p>
            <ul>
              <li>Hedef liste: Koç, ODTÜ, Bilkent, Boğaziçi, Sabancı, İTÜ, Hacettepe. Buna İYTE ve Özyeğin'i ekle.</li>
              <li>ALES 80+ (GRE Q 156+) ve TOEFL 80+ ya da YDS 80+ ile hepsinin eşiğini geçersin. YDS 80 aynı zamanda TÜBİTAK 2210-A şartı.</li>
              <li>Sıralama: Koç erken (Şubat) → ODTÜ (Şubat–Mart) → Sabancı erken (Nisan) → Boğaziçi ve İTÜ (Nisan–Haziran) → Bilkent (1 Haziran).</li>
              <li>Başvurudan 1–2 ay önce danışman adaylarına yaz. İTÜ Bilgisayar'da bu zorunlu.</li>
            </ul>
          </div>
          <div className="box">
            <h3>ALES 60–75 aralığındaysan</h3>
            <p className="small muted">Tezli ama eşiği daha erişilebilir programlar</p>
            <ul>
              <li>70 ve üstü: Boğaziçi Bilgisayar (70, GNO 2.50), Galatasaray (70), GTÜ Bilgisayar ve Siber Güvenlik (70), ODTÜ Veri Bilişimi (75).</li>
              <li>60–69: Sabancı (65), Ankara Üni. YZ ve Robotik (65), Hacettepe Bilişim YZ (60), GTÜ YZ (60).</li>
              <li>55–59: YTÜ YZ ve Veri Müh. (55), Bilkent (asgari 55, ama rekabetçi), DEÜ (55), ESTÜ (55), Atılım (55).</li>
            </ul>
          </div>
          <div className="box">
            <h3>Çalışarak okumak istiyorsan</h3>
            <p className="small muted">Tezsiz, akşam veya hibrit, çoğunlukla ALES'siz</p>
            <ul>
              <li>Boğaziçi Yazılım Mühendisliği II. öğretim: ALES yok, GNO 2.00, İngilizce şart, 50 kişi.</li>
              <li>Hacettepe Bilişim Enstitüsü tezsizleri: Yazılım, Veri ve Bilgi Müh., Bilgi Güvenliği, Oyun. ALES ve dil yok; %30 GNO + %70 mülakat.</li>
              <li>ODTÜ Enformatik tezsizleri: Siber Güvenlik, Bilişim Sistemleri, Yazılım Yönetimi, Modelleme ve Simülasyon, Online.</li>
              <li>İTÜ Büyük Veri ve İş Analitiği II. öğretim; Sabancı Bilgi Teknolojileri ve Veri Analitiği; MEF Büyük Veri; Bahçeşehir, Kadir Has ve GTÜ YBS II. öğretim.</li>
            </ul>
          </div>
          <div className="box">
            <h3>Bahar döneminde başlamak istiyorsan</h3>
            <p className="small muted">Bahar alımı yapan yerler</p>
            <ul>
              <li><b>Sabancı</b>: 2026-27 baharı için son başvuru 27 Kasım 2026 (kesin). Bilgisayar, Siber Güvenlik ve Veri Bilimi dahil.</li>
              <li>İTÜ, ODTÜ, Gazi, Hacettepe, Boğaziçi (sınırlı program), Atılım, Özyeğin, Ege UBE ve KTÜ de baharda alım yapıyor. Güncel tarihler için <Link to="/programlar?scope=tr&term=spring">bahar alımı olan programlar</Link>.</li>
              <li>Bahar başvurularında ALES'in elinde olmalı: ALES/3 sonucu 17 Aralık'ta açıklanıyor, Kasım'da kapanan başvurulara yetişmiyor.</li>
            </ul>
          </div>
        </div>
        <div className="callout" style={{ marginTop: 18 }}>Farklı üniversitelere aynı anda başvurabilirsin. Bazı üniversiteler kendi içinde program sayısını sınırlar: Ankara Üni. 1 program, Hacettepe Bilişim en fazla 3, Ege 1 tek disiplinli + 1 disiplinlerarası + 1 tezsiz. 6–10 başvuruluk dengeli bir liste (2–3 iddialı, 3–4 hedef, 2–3 güvenli) iyi bir başlangıçtır.</div>
      </section>

      <section id="alanlar" style={{ borderBottom: 0 }}>
        <div className="sec-head">
          <div className="eyebrow">CS mezunu olarak seçenekler</div>
          <h2>Alan alan: Türkiye'de nerede ne okuyabilirsin?</h2>
        </div>
        <FieldsGuide />
      </section>
    </>
  );
}
