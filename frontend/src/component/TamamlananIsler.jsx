import React, { useEffect, useState } from "react";
import "../css/TamamlananIsler.css";

export default function TamamlananIsler() {
  const [ilanlar, setIlanlar] = useState([]);
  const [loading, setLoading] = useState(true);

  const yukle = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/jobs/mine?status=completed", { credentials: "include" });
    const data = await res.json().catch(() => []);
    setIlanlar(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { yukle(); }, []);

  if (loading) return <div style={{ padding: 24 }}>Yükleniyor...</div>;

  return (
    <div className="done-wrap">
      <h2 className="done-title">Tamamlanan İşler</h2>

      {ilanlar.length === 0 ? (
        <div className="done-empty">Henüz tamamlanan iş yok.</div>
      ) : (
        <div className="done-list">
          {ilanlar.map((j) => (
            <div className="done-card" key={j.id}>
              <div className="done-head">
                <div className="done-baslik">{j.baslik}</div>
                <div className="done-badge">Tamamlandı</div>
              </div>

              <div className="done-desc">{j.aciklama}</div>

              {j.ucret_tutar != null && j.ucret_para_birimi ? (
                <div className="done-pay">
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
