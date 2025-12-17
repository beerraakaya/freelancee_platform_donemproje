import React, {useEffect, useState}from "react";
import { useNavigate } from "react-router-dom";
import "../css/IlanYayinla.css"
import { FaTimes } from "react-icons/fa";


export default function IlanYayinla(){
    const navigate=useNavigate();
    const [loading, setLoading] = useState(true);
    const [profilAdSoyad, setProfilAdSoyad] = useState("");

    const [baslik, setBaslik] = useState("");
    const [aciklama, setAciklama] = useState("");
    const [ucretTutar, setUcretTutar] = useState("");
    const [paraBirimi, setParaBirimi] = useState("TRY");

    const [saving, setSaving] = useState(false);


    useEffect(()=> {
        const init=async()=>{
            try{
                const s= await fetch("http://localhost:5000/api/check_session", {
                    method: "GET",
                    credentials: "include",
                });
                if(!s.ok) {
                    sessionStorage.setItem("redirectPath", "/ilan-yayinla");
                    navigate("/login", { replace: true });
                    return;
                }
                const res = await fetch("http://localhost:5000/api/profile", {
                    method: "GET",
                    credentials: "include",
                    });
                if (!res.ok) throw new Error("Profil alınamadı");
                const data = await res.json();

                const ad = (data.ad || "").trim();
                const soyad = (data.soyad || "").trim();
                if (!ad || !soyad) {
                    alert("İlan yayınlamak için önce Profilim kısmında ad-soyad doldurmalısın.");
                    navigate("/account/profil", { replace: true });
                    return;
                }
                setProfilAdSoyad(`${ad} ${soyad}`);

            }catch (e) {
                console.log(e);
                alert("Bir hata oldu. Lütfen tekrar deneyin.");
            }finally {
                setLoading(false);
            }  
        };

        init();
    },[navigate]);

    const yayinla = async (e) => {
    e.preventDefault();
    if (!baslik.trim() || !aciklama.trim()) {
      alert("Başlık ve açıklama zorunlu.");
      return;
    }

    const payload = {
      baslik: baslik.trim(),
      aciklama: aciklama.trim(),
      ucret_tutar: ucretTutar ? Number(ucretTutar) : null,
      ucret_para_birimi: ucretTutar ? paraBirimi : null,
    };

    try {
      setSaving(true);
      const res = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "İlan yayınlanamadı");

      alert("İlan yayınlandı.");
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
      alert(err.message || "İlan yayınlarken hata oldu.");
    } finally {
      setSaving(false);
    }

    };
    if (loading) return <div style={{ padding: "24px 32px" }}>Yükleniyor...</div>;
return (
  <div className="jobpost-page">
    <div className="jobpost-shell">
      <div className="jobpost-head">
        <div>
          <h2>İş İlanı Yayınla</h2>
          <p>
            Yayınlayan: <b>{profilAdSoyad}</b>
          </p>
        </div>

        
          
        
      </div>

      <form className="jobpost-card" onSubmit={yayinla}>

        <button
          type="button"
          className="btn-ghost jobpost-close"
          onClick={() => navigate(-1)}
          disabled={saving}
          aria-label="Kapat"
        >
          <FaTimes />
        </button>
        
        <div className="field">
          <label>İş Başlığı</label>
          <input
            value={baslik}
            onChange={(e) => setBaslik(e.target.value)}
            placeholder="Örn: React ile arayüz geliştirme"
          />
        </div>

        <div className="field">
          <label>Açıklama</label>
          <textarea
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
            placeholder="Ne yapılacak, teslim tarihi, beklentiler..."
          />
          <div className="hint">Beklentileri ve teslim kriterlerini net yaz.</div>
        </div>

        <div className="row">
          <div className="field">
            <label>Ücret Tutarı</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={ucretTutar}
              onChange={(e) => setUcretTutar(e.target.value)}
              placeholder="Örn: 2500"
            />
          </div>

          <div className="field">
            <label>Para Birimi</label>
            <select value={paraBirimi} onChange={(e) => setParaBirimi(e.target.value)}>
              <option value="TRY">TRY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <div className="actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Yayınlanıyor..." : "Yayınla"}
          </button>
        </div>
      </form>
    </div>
  </div>
);
}

