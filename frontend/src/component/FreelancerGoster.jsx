import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/FreelancerGoster.css";

export default function FreelancerGoster() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/freelancers",{credentials:"include", });
        const data = await res.json().catch(() => []);
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const fotoUrl = (p) =>
    p.profil_foto ? `http://localhost:5000${p.profil_foto}?v=${Date.now()}` : null;

  if (loading) return <div style={{ padding: 24 }}>Yükleniyor...</div>;

  return (
    <div className="fr-page">
      <div className="fr-title">Freelancerlar</div>

      {items.length === 0 ? (
        <div className="fr-empty">Henüz profilini dolduran freelancer yok.</div>
      ) : (
        <div className="fr-list">
          {items.map((p) => (
            <div className="fr-row" key={p.user_id}>
              <div className="fr-left">
                <div className="fr-avatar">
                  {fotoUrl(p) ? (
                    <img src={fotoUrl(p)} alt="Profil" />
                  ) : (
                    <span>{(p.ad?.[0] || "K") + (p.soyad?.[0] || "")}</span>
                  )}
                </div>

                <div className="fr-name">
                  {p.ad} {p.soyad}
                </div>
              </div>

              <button
                className="fr-btn"
                onClick={() => navigate(`/freelancer/${p.user_id}`)}
              >
                Profili Görüntüle
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
