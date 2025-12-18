import React, { useEffect, useState } from "react";
import "../css/IsBasvurularim.css";

export default function IsBasvurularim() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const yukle = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/applications/mine", {
        credentials: "include",
      });

      const data = await res.json().catch(() => []);
      if (!res.ok) {
        console.log("applications/mine hata:", res.status, data);
        setItems([]);
        return;
      }

      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    yukle();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Yükleniyor...</div>;

  return (
    <div className="myapps-wrap">
      <h2 className="myapps-title">İş Başvurularım</h2>

      {items.length === 0 ? (
        <div className="myapps-empty">Henüz bir başvurun yok.</div>
      ) : (
        <div className="myapps-list">
          {items.map((a) => (
            <div className="myapps-card" key={a.id}>
              <div className="myapps-head">
                <div className="myapps-baslik">
                  {a.job_exists ? a.baslik : "İlan kaldırılmış"}
                </div>

                <div className={`myapps-status ${a.job_closed ? "closed" : "open"}`}>
                  {a.job_status_text}
                </div>
              </div>

              {a.job_exists ? (
                <>
                  <div className="myapps-sub">
                    Yayınlayan: <b>{a.yayinlayan_ad} {a.yayinlayan_soyad}</b>
                  </div>

                  <div className="myapps-desc">{a.aciklama}</div>

                  {a.ucret_tutar != null && a.ucret_para_birimi ? (
                    <div className="myapps-pay">
                      Ücret: <b>{a.ucret_tutar}</b> {a.ucret_para_birimi}
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="myapps-desc">
                  Bu ilan kaldırıldığı için detaylar görüntülenemiyor.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
