"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Tip Tanımlamaları
interface Deneme {
  tarih: string;
  tytToplam: number;
  aytToplam: number;
  bolum: string;
}

interface Profil {
  isim: string;
  gecmis: Deneme[];
}

export default function Home() {
  // --- PROFIL STATE'LERI ---
  const [profiller, setProfiller] = useState<Profil[]>([]);
  const [aktifProfil, setAktifProfil] = useState<Profil | null>(null);
  const [yeniIsim, setYeniIsim] = useState("");

  // --- TYT NETLERI ---
  const [tytTurkce, setTytTurkce] = useState("");
  const [tytSosyal, setTytSosyal] = useState("");
  const [tytFen, setTytFen] = useState("");
  const [tytMatematik, setTytMatematik] = useState("");

  // --- AYT ALANI VE NETLERI ---
  const [bolum, setBolum] = useState("");
  const [aytSayMat, setAytSayMat] = useState("");
  const [aytSayGeo, setAytSayGeo] = useState("");
  const [aytFizik, setAytFizik] = useState("");
  const [aytKimya, setAytKimya] = useState("");
  const [aytBiyo, setAytBiyo] = useState("");
  const [aytEaMat, setAytEaMat] = useState("");
  const [aytEdebiyat, setAytEdebiyat] = useState("");
  const [aytTarih1, setAytTarih1] = useState("");
  const [aytCografya1, setAytCografya1] = useState("");
  const [aytTarih2, setAytTarih2] = useState("");
  const [aytCografya2, setAytCografya2] = useState("");
  const [aytFelsefe, setAytFelsefe] = useState("");
  const [aytDin, setAytDin] = useState("");

  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Başlangıçta profilleri yükle
  useEffect(() => {
    const saved = localStorage.getItem("yks_mikro_profiller");
    if (saved) setProfiller(JSON.parse(saved));
  }, []);

  const profilOlustur = () => {
    if (!yeniIsim) return;
    const yeni: Profil = { isim: yeniIsim, gecmis: [] };
    const güncel = [...profiller, yeni];
    setProfiller(güncel);
    localStorage.setItem("yks_mikro_profiller", JSON.stringify(güncel));
    setAktifProfil(yeni);
    setYeniIsim("");
  };

  const profilSil = (silinecekIsim: string) => {
    const güncelProfiller = profiller.filter(p => p.isim !== silinecekIsim);
    setProfiller(güncelProfiller);
    localStorage.setItem("yks_mikro_profiller", JSON.stringify(güncelProfiller));
  };

  const oturumuKapat = () => {
    setAktifProfil(null);
    setAiResponse("");
  };

  const resetAytInputs = () => {
    setAytSayMat(""); setAytSayGeo(""); setAytFizik(""); setAytKimya(""); setAytBiyo("");
    setAytEaMat(""); setAytEdebiyat(""); setAytTarih1(""); setAytCografya1("");
    setAytTarih2(""); setAytCografya2(""); setAytFelsefe(""); setAytDin("");
  };

  const askOllama = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aktifProfil) return;
    setLoading(true);
    setAiResponse("");

    // Toplamları ve detayları hesapla
    const tytToplam = Number(tytTurkce) + Number(tytSosyal) + Number(tytMatematik) + Number(tytFen);
    let aytToplam = 0;
    let aytDetay = "";

    if (bolum === "Sayısal") {
      aytToplam = Number(aytSayMat) + Number(aytSayGeo) + Number(aytFizik) + Number(aytKimya) + Number(aytBiyo);
      aytDetay = `Matematik: ${aytSayMat}/30, Geometri: ${aytSayGeo}/10, Fizik: ${aytFizik}/14, Kimya: ${aytKimya}/13, Biyoloji: ${aytBiyo}/13`;
    } else if (bolum === "Eşit Ağırlık") {
      aytToplam = Number(aytEaMat) + Number(aytEdebiyat) + Number(aytTarih1) + Number(aytCografya1);
      aytDetay = `Matematik Testi Toplam: ${aytEaMat}/40, Edebiyat: ${aytEdebiyat}/24, Tarih-1: ${aytTarih1}/10, Coğrafya-1: ${aytCografya1}/6`;
    } else if (bolum === "Sözel") {
      aytToplam = Number(aytEdebiyat) + Number(aytTarih1) + Number(aytCografya1) + Number(aytTarih2) + Number(aytCografya2) + Number(aytFelsefe) + Number(aytDin);
      aytDetay = `Edebiyat: ${aytEdebiyat}/24, Tarih-1: ${aytTarih1}/10, Coğrafya-1: ${aytCografya1}/6, Tarih-2: ${aytTarih2}/11, Coğrafya-2: ${aytCografya2}/11, Felsefe Grubu: ${aytFelsefe}/12, Din Kültürü: ${aytDin}/6`;
    }

    const yeniDeneme: Deneme = {
      tarih: new Date().toLocaleDateString("tr-TR"),
      tytToplam,
      aytToplam,
      bolum
    };

    const gecmisMetni = aktifProfil.gecmis.map((d, i) => 
      `${i+1}. Deneme (${d.tarih}) - ${d.bolum}: TYT Toplam ${d.tytToplam}, AYT Toplam ${d.aytToplam}`
    ).join("\n");

    const prompt = `AŞAĞIDAKİ BİLGİLERE KESİNLİKLE SADECE TÜRKÇE YANIT VER.
    Sen ${aktifProfil.isim} isimli öğrencinin analitik ve profesyonel YKS rehberlik koçusun. 
    
    ÖĞRENCİNİN GEÇMİŞ DENEME SEYRİ:
    ${gecmisMetni || "Bu ilk denemesi."}

    BUGÜNKÜ DETAYLI DENEME NETLERİ:
    Öğrencinin Seçtiği Alan: ${bolum}
    TYT Netleri: Türkçe ${tytTurkce}/40, Sosyal ${tytSosyal}/20, Matematik ${tytMatematik}/40, Fen ${tytFen}/20.
    AYT Detaylı Netleri: ${aytDetay}.
    
    ÇOK ÖNEMLİ DİKKAT ETMEN GEREKEN KURALLAR:
    1. EĞER ÖĞRENCİ BİR DERSTE TAM NET (FULLEMİŞ) VEYA TAMA ÇOK YAKIN YAPMIŞSA, O DERS İÇİN SADECE TEBRİK ET. Kesinlikle o ders için "şunu çalış", "eksiğini kapat" gibi sözler söyleme!
    2. SADECE neti düşük olan, eksiği olan veya negatif (-) netlere düşmüş dersleri tespit et ve SADECE onlara yönelik çalışma tavsiyesi ver.
    3. HEDEF BELİRLEME: Bu netler ve "${bolum}" alanına göre Türkiye'den 3 veya 4 adet gerçekçi üniversite/bölüm tavsiyesi ver. (Geçen yıl ortalama EN SON KAÇ TYT VE KAÇ AYT NETİ ile aldıklarını mutlaka belirt).
    4. Adım adım ve motive edici bir eylem planı sun.`;

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama3", prompt: prompt, stream: false }),
      });
      const data = await response.json();
      setAiResponse(data.response);

      // Başarılı olursa geçmişe kaydet
      const güncelProfil = { ...aktifProfil, gecmis: [...aktifProfil.gecmis, yeniDeneme] };
      const güncelProfiller = profiller.map(p => p.isim === aktifProfil.isim ? güncelProfil : p);
      setProfiller(güncelProfiller);
      setAktifProfil(güncelProfil);
      localStorage.setItem("yks_mikro_profiller", JSON.stringify(güncelProfiller));

    } catch (error) {
      console.error(error);
      setAiResponse("Hata: Ollama bağlantısı kurulamadı. Terminalde 'ollama run llama3' komutunun açık olduğundan emin ol.");
    } finally {
      setLoading(false);
    }
  };

  // GRAFİK VERİSİ HAZIRLAMA (Eski denemeden yeni denemeye doğru sıralı)
  const chartData = aktifProfil?.gecmis.map((d, index) => ({
    name: `Deneme ${index + 1}`,
    tarih: d.tarih,
    TYT: d.tytToplam,
    AYT: d.aytToplam
  })) || [];

  // --- GİRİŞ EKRANI ---
  if (!aktifProfil) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-md w-full bg-[#0f172a] rounded-[3rem] shadow-2xl p-10 border border-slate-800 text-center">
          <h1 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 italic uppercase">YKS LABORATUVARI</h1>
          <p className="text-slate-500 text-xs font-bold mb-8 uppercase tracking-[0.2em]">Oturum Seçimi</p>
          
          <div className="space-y-4">
            {profiller.length > 0 && (
              <div className="space-y-3 mb-8">
                <p className="text-xs text-slate-400 uppercase font-bold text-left pl-2">Kayıtlı Öğrenciler</p>
                {profiller.map(p => (
                  <div key={p.isim} className="flex gap-2 items-center">
                    <button onClick={() => setAktifProfil(p)} className="flex-1 p-4 bg-[#1e293b] rounded-2xl hover:bg-cyan-600 transition-all font-bold border border-transparent hover:border-cyan-400 text-left">
                      👤 {p.isim}
                    </button>
                    <button onClick={() => profilSil(p.isim)} className="p-4 bg-[#1e293b] hover:bg-red-500/80 rounded-2xl transition-all border border-transparent hover:border-red-400 flex items-center justify-center group" title="Profili Sil">
                      <span className="text-red-400 group-hover:text-white font-black text-lg">🗑️</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-400 uppercase font-bold mb-2 text-left pl-2">Yeni Öğrenci Ekle</p>
              <input type="text" placeholder="İsminizi Girin..." value={yeniIsim} onChange={e => setYeniIsim(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-2xl outline-none mb-4 border border-slate-700 focus:border-purple-500 transition-all font-bold" />
              <button onClick={profilOlustur} className="w-full p-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-black shadow-lg hover:brightness-110 transition-all">SİSTEME GİRİŞ YAP</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // --- ANA LABORATUVAR EKRANI ---
  return (
    <main className="min-h-screen bg-[#020617] py-10 px-4 flex flex-col items-center font-sans text-white">
      <div className="max-w-6xl w-full">
        {/* Üst Bilgi Barı */}
        <div className="flex justify-between items-center mb-8 bg-[#0f172a] p-6 rounded-3xl border border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 italic uppercase">YKS MİKRO ANALİZ</h1>
            <p className="text-slate-400 font-medium text-sm mt-1">Öğrenci: <span className="text-purple-400 font-bold">{aktifProfil.isim}</span> | Kayıtlı Deneme: {aktifProfil.gecmis.length}</p>
          </div>
          <button onClick={oturumuKapat} className="text-xs bg-slate-800 px-5 py-3 rounded-xl hover:bg-red-500/80 transition-all font-bold border border-slate-700">OTURUMU KAPAT</button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* SOL TARAF: FORM GİRİŞLERİ */}
          <div className="lg:col-span-2">
            <form onSubmit={askOllama} className="space-y-6 bg-[#0f172a] p-8 rounded-[3rem] border border-slate-800 shadow-2xl">
              
              {/* TYT BÖLÜMÜ */}
              <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-700/50">
                <h2 className="text-cyan-400 font-bold mb-5 uppercase tracking-widest text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></span> TYT NETLERİ (Ondalıklı & Eksi)
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Türkçe (40)</label><input type="number" step="0.25" max="40" min="-10" value={tytTurkce} onChange={(e)=>setTytTurkce(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-cyan-500 border border-transparent" required /></div>
                  <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Sosyal (20)</label><input type="number" step="0.25" max="20" min="-5" value={tytSosyal} onChange={(e)=>setTytSosyal(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-cyan-500 border border-transparent" required /></div>
                  <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Matematik (40)</label><input type="number" step="0.25" max="40" min="-10" value={tytMatematik} onChange={(e)=>setTytMatematik(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-cyan-500 border border-transparent" required /></div>
                  <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Fen (20)</label><input type="number" step="0.25" max="20" min="-5" value={tytFen} onChange={(e)=>setTytFen(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-cyan-500 border border-transparent" required /></div>
                </div>
              </div>

              {/* AYT BÖLÜMÜ */}
              <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-700/50">
                <h2 className="text-purple-400 font-bold mb-5 uppercase tracking-widest text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_#a855f7]"></span> AYT ALANI VE NETLERİ
                </h2>
                <select value={bolum} onChange={(e) => { setBolum(e.target.value); resetAytInputs(); }} className="w-full p-4 mb-6 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500 font-bold text-slate-200" required>
                  <option value="" disabled>Hedef Alanınızı Seçin</option>
                  <option value="Sayısal">Sayısal</option>
                  <option value="Eşit Ağırlık">Eşit Ağırlık</option>
                  <option value="Sözel">Sözel</option>
                </select>

                {bolum === "Sayısal" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Matematik (30)</label><input type="number" step="0.25" max="30" min="-7.5" value={aytSayMat} onChange={(e)=>setAytSayMat(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Geometri (10)</label><input type="number" step="0.25" max="10" min="-2.5" value={aytSayGeo} onChange={(e)=>setAytSayGeo(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Fizik (14)</label><input type="number" step="0.25" max="14" min="-3.5" value={aytFizik} onChange={(e)=>setAytFizik(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Kimya (13)</label><input type="number" step="0.25" max="13" min="-3.25" value={aytKimya} onChange={(e)=>setAytKimya(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Biyoloji (13)</label><input type="number" step="0.25" max="13" min="-3.25" value={aytBiyo} onChange={(e)=>setAytBiyo(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                    </div>
                  </div>
                )}

                {bolum === "Eşit Ağırlık" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase pl-2">Matematik Testi (40)</label>
                      <input type="number" step="0.25" max="40" min="-10" value={aytEaMat} onChange={(e)=>setAytEaMat(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Edebiyat (24)</label><input type="number" step="0.25" max="24" min="-6" value={aytEdebiyat} onChange={(e)=>setAytEdebiyat(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Tarih-1 (10)</label><input type="number" step="0.25" max="10" min="-2.5" value={aytTarih1} onChange={(e)=>setAytTarih1(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Coğrafya-1 (6)</label><input type="number" step="0.25" max="6" min="-1.5" value={aytCografya1} onChange={(e)=>setAytCografya1(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                    </div>
                  </div>
                )}

                {bolum === "Sözel" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Edebiyat (24)</label><input type="number" step="0.25" max="24" min="-6" value={aytEdebiyat} onChange={(e)=>setAytEdebiyat(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Tarih-1 (10)</label><input type="number" step="0.25" max="10" min="-2.5" value={aytTarih1} onChange={(e)=>setAytTarih1(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Coğrafya-1 (6)</label><input type="number" step="0.25" max="6" min="-1.5" value={aytCografya1} onChange={(e)=>setAytCografya1(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Tarih-2 (11)</label><input type="number" step="0.25" max="11" min="-2.75" value={aytTarih2} onChange={(e)=>setAytTarih2(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Coğrafya-2 (11)</label><input type="number" step="0.25" max="11" min="-2.75" value={aytCografya2} onChange={(e)=>setAytCografya2(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Felsefe (12)</label><input type="number" step="0.25" max="12" min="-3" value={aytFelsefe} onChange={(e)=>setAytFelsefe(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                      <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase pl-2">Din (6)</label><input type="number" step="0.25" max="6" min="-1.5" value={aytDin} onChange={(e)=>setAytDin(e.target.value)} className="w-full p-4 bg-[#1e293b] rounded-xl outline-none focus:border-purple-500" required /></div>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 disabled:opacity-50 transition-all uppercase tracking-widest text-lg">
                {loading ? "GELİŞİMİN ANALİZ EDİLİYOR..." : "KAYDET VE ANALİZ İSTE"}
              </button>
            </form>
          </div>

          {/* SAĞ TARAF: GRAFİKLER, GEÇMİŞ VE SONUÇLAR */}
          <div className="space-y-6">
            
            {/* GELİŞİM GRAFİĞİ (RECHARTS) */}
            {chartData.length > 0 && (
              <div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800 shadow-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                  <span className="text-lg">📊</span> Net Gelişim Grafiği
                </h3>
                <div className="h-64 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px' }} 
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Line type="monotone" name="TYT Neti" dataKey="TYT" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" name="AYT Neti" dataKey="AYT" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* GEÇMİŞ LİSTESİ */}
            <div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                <span className="text-lg">📝</span> Gelişim Geçmişin ({aktifProfil.gecmis.length})
              </h3>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {aktifProfil.gecmis.length === 0 ? (
                  <p className="text-slate-600 text-sm italic text-center py-4">Henüz kayıtlı deneme yok.</p>
                ) : (
                  aktifProfil.gecmis.slice().reverse().map((d, i) => (
                    <div key={i} className="p-4 bg-[#1e293b] rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-xs font-bold">{d.tarih}</span>
                        <span className="text-[10px] px-2 py-1 bg-slate-800 rounded-md text-slate-300">{d.bolum}</span>
                      </div>
                      <div className="flex justify-between font-black text-sm">
                        <span className="text-cyan-400">TYT: {d.tytToplam}</span>
                        <span className="text-purple-400">AYT: {d.aytToplam}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI ANALİZ RAPORU */}
            {aiResponse && (
              <div className="bg-slate-900/90 p-6 rounded-3xl border border-purple-500/40 animate-in fade-in slide-in-from-bottom-4 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                <h3 className="text-purple-400 font-black mb-4 text-xs uppercase tracking-widest flex items-center gap-3 border-b border-slate-800 pb-3">
                   <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
                   Koçun Raporu
                </h3>
                <div className="text-slate-300 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}