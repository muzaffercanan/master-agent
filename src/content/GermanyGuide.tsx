// Germany strategy notes from the user's research report, corrected after re-verification (24 Oct 2026).
import { Link } from "react-router-dom";

const p = (uni: string, prog: string, label: string) => <Link to={`/program/${uni}/${prog}`}>{label}</Link>;

export function GermanyGuide() {
  return (
    <>
      <section style={{ paddingBottom: 0 }}>
        <div className="sec-head">
          <div className="eyebrow">Almanya araştırman · doğrulanmış özet</div>
          <h2>Strateji ve portföy</h2>
          <p className="lede">Bu bölüm "Almanya'da İngilizce Yüksek Lisans" raporundan alındı ve her iddia 24 Ekim 2026'da resmi kaynaklarla yeniden kontrol edildi. Düzeltmeler aşağıda ayrıca listeleniyor.</p>
        </div>
        <div className="callout warn" style={{ marginBottom: 16 }}>
          <b>Raporda "Kış 2027/28 başvuruları Mayıs–Temmuz 2027" deniyordu; bu bazı programlar için yanlış.</b> Stuttgart Computer Science ve INFOTECH'in Ekim 2027 başlangıcı için son günü <b>15 Ocak 2027</b>. INFOTECH penceresi 15 Kasım 2026'da açılıyor. RWTH için son gün 1 Mart 2027, Goethe MSQ'nun ilk aşaması 31 Ocak 2027. Ayrıntılar için <Link to="/takvim?c=de">Almanya takvimine</Link> bak.
        </div>
        <div className="grid2">
          <div className="box">
            <h3>Portföy (Kış 2027/28 için, düzeltilmiş)</h3>
            <ul>
              <li><b>İddialı:</b> {p("rwth", "data-science", "RWTH Data Science")} (GRE Quant ≈160+), {p("mannheim", "data-science", "Mannheim Data Science")} (GRE Q ≥162 / V ≥151 zorunlu; raporda "hedef" idi), {p("tu-berlin", "computer-science", "TU Berlin CS")} (teorik CS kredisi), {p("saarland", "computer-science", "Saarland CS")} (C1, MOI kabul edilmiyor), {p("goethe", "quantitative-finance-msq", "Goethe MSQ")}.</li>
              <li><b>Hedef:</b> {p("tu-darmstadt", "computer-science", "TU Darmstadt CS")} (not yerine ders içeriği; IELTS 7.0 / TOEFL 95), {p("stuttgart", "computer-science", "Stuttgart CS")} ve {p("stuttgart", "infotech", "INFOTECH")} (C1; INFOTECH'te seçme süreci var), {p("mannheim", "business-informatics", "Mannheim Business Informatics")} (yalnızca 30 ECTS işletme kredin varsa).</li>
              <li><b>Güvenli:</b> {p("passau", "computer-science", "Passau CS")} (Alman notu ≤ 2.7 şartını 2.25 ile karşılıyorsun; A1 Almanca gerekli), {p("th-deggendorf", "artificial-intelligence-and-data-science", "TH Deggendorf AI & DS")} (online sınav), {p("frankfurt-uas", "general-informatics", "Frankfurt UAS General Informatics")} (not ≤ 2.8).</li>
              <li><b>Listeden çıkan:</b> {p("stuttgart", "artificial-intelligence-and-data-science", "Stuttgart AI & Data Science")} Almanca öğretiliyor. TUM ücret nedeniyle elenmişti; 2027/28'den itibaren ücret 6.800 €/dönem.</li>
            </ul>
          </div>
          <div className="box">
            <h3>Doğrulamada düzeltilenler</h3>
            <ul>
              <li><b>Mannheim Data Science:</b> AB dışı adaylarda GRE Quant ≥162 ve Verbal ≥151 zorunlu, seçim yalnızca GRE puanıyla. Raporda yoktu.</li>
              <li><b>Mannheim Business Informatics:</b> asgari not yok, ama 30 ECTS işletme / iş bilişimi + 30 ECTS bilişim + 18 ECTS matematik-istatistik şartı var.</li>
              <li><b>Stuttgart AI & Data Science:</b> Almanca ("not offered in English").</li>
              <li><b>Stuttgart INFOTECH / CS:</b> "açık kabul" değil; resmi sayfa seçme süreci ve nitelik ölçütleri tarif ediyor.</li>
              <li><b>Saarland:</b> dönem ücreti ~280 € değil, 412,30 €; İngilizce eğitim belgesi kabul edilmiyor.</li>
              <li><b>TU Darmstadt:</b> resmi sayfa dil belgesi olarak IELTS 7.0 / TOEFL 95 / C1 sayıyor; İngilizce eğitim belgesinden söz etmiyor.</li>
              <li><b>Goethe MSQ:</b> GRE zorunlu değil, şiddetle önerilen.</li>
              <li><b>TUM:</b> 2027/28 kışından itibaren yeni öğrencilere 4.600 / 6.800 €/dönem.</li>
              <li><b>Passau:</b> ilk yıl sonuna kadar A1 Almanca belgesi ve anabin'de H+ statüsü gerekiyor.</li>
            </ul>
          </div>
          <div className="box">
            <h3>Doğrulanan temel noktalar</h3>
            <ul>
              <li>Not dönüşümü: Özyeğin, DHBW tablosunda System 3'te (4.00 en iyi, 1.00 en düşük geçer). 2.75 → yaklaşık 2.25 ("gut"). Bağlayıcı değer VPD'de çıkar.</li>
              <li>APS belgesi Türkiye'de alınan diplomalar için gerekmiyor (yalnızca Çin, Vietnam, Hindistan).</li>
              <li>Bloke hesap 2026: yıllık 11.904 € (ayda 992 €).</li>
              <li>uni-assist / VPD: ilk program 75 €, ek her program 30 €; son tarihten en az 8 hafta önce başvur.</li>
              <li>Baden-Württemberg (Stuttgart, Mannheim): AB dışı 1.500 €/dönem. FAU Erlangen-Nürnberg Yaz 2027'den itibaren 1.000–6.000 €/dönem.</li>
            </ul>
          </div>
          <div className="box">
            <h3>Mezuniyet sonrası iş piyasası</h3>
            <ul>
              <li>Almanya'da yüksek lisans bitirenlere 18 aylık iş arama izni (§20 AufenthG; uzatılamaz). Bu sürede nitelikli iş bulup Mavi Kart'a ya da çalışma iznine geçmek gerekiyor.</li>
              <li>Bitkom (Eylül 2026, 853 firma): boş BT pozisyonu yaklaşık 79.000. Bu sayı 2025'te 109.000, 2023'te 149.000 idi. Talep sürüyor ama rekabet artıyor; firmaların %97'si BT pozisyonlarını doldurmakta zorlanıyor.</li>
              <li>Almanca bilmeden en uygun şehirler: Berlin, Münih, Frankfurt, Hamburg. Uzun vadeli kariyer için en az B1 Almanca öneriliyor.</li>
              <li>Quant hedefi için rapordaki öneri: saf quant programı yerine veri bilimi / iş bilişimi + finans seçmelileri, ya da Frankfurt fintech ekosisteminde staj.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
