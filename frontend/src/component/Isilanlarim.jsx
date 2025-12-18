import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Isilanlarim.css"

export default function Isilanlarim() {
  const navigate = useNavigate();
  const [ilanlar, setIlanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const yukle = async () => {
    setLoading(true);
    try{
      const res = await fetch("http://localhost:5000/api/jobs/mine?status=active", { credentials: "include" });
      
      const data = await res.json().catch(() => []);
      if(!res.ok){
        console.log("mine hatası:", res.status,data)
        setIlanlar([]);
        return;
      }
    setIlanlar(Array.isArray(data) ? data : []);
    
    }catch(e){
      console.log(e);
      setIlanlar([]);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => { yukle(); }, []);

  const tamamla = async (id) => {
    const ok = window.confirm("Bu işi tamamlandı olarak işaretlemek istiyor musun?");
    if (!ok) return;

    try {
      setBusyId(id);
      const res = await fetch(`http://localhost:5000/api/jobs/${id}/complete`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Tamamlanamadı.");

      setIlanlar((prev) => prev.filter((x) => x.id !== id));
      alert("Tamamlandı olarak işaretlendi.");
    } catch (e) {
      alert(e.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Yükleniyor...</div>;

  return (
    <div className="myjobs-wrap">
      <h2 className="myjobs-title">İş İlanlarım</h2>

      {ilanlar.length === 0 ? (
        <div className="myjobs-empty">Aktif ilanın yok.</div>
      ) : (
        <div className="myjobs-list">
          {ilanlar.map((j) => (
            <div className="myjobs-card" key={j.id}>
              <div className="myjobs-head">
                <div className="myjobs-baslik">{j.baslik}</div>

                <div className="myjobs-actions">
                  <button className="myjobs-edit" onClick={() => navigate(`/ilan-duzenle/${j.id}`)}>
                    Düzenle
                  </button>

                  <button
                    className="myjobs-done"
                    onClick={() => tamamla(j.id)}
                    disabled={busyId === j.id}
                  >
                    {busyId === j.id ? "İşleniyor..." : "İş Tamamlandı"}
                  </button>
                </div>
              </div>

              <div className="myjobs-desc">{j.aciklama}</div>

              {j.ucret_tutar != null && j.ucret_para_birimi ? (
                <div className="myjobs-pay">
                  Ücret: <b>{j.ucret_tutar}</b> {j.ucret_para_birimi}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
