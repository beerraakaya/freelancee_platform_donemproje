import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/IlanYayinla.css"; // mevcut form stilini kullanabilirsin

export default function IlanDuzenle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [baslik, setBaslik] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [ucretTutar, setUcretTutar] = useState("");
  const [paraBirimi, setParaBirimi] = useState("TRY");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`, { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "İlan alınamadı.");

        if (data.tamamlandi) {
          alert("Bu ilan tamamlanmış. Düzenlenemez.");
          navigate("/account/tamamlananisler", { replace: true });
          return;
        }

        setBaslik(data.baslik || "");
        setAciklama(data.aciklama || "");
        setUcretTutar(data.ucret_tutar ?? "");
        setParaBirimi(data.ucret_para_birimi || "TRY");
      } catch (e) {
        alert(e.message);
        navigate("/account/ilanlar", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  const kaydet = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const payload = {
        baslik: baslik.trim(),
        aciklama: aciklama.trim(),
        ucret_tutar: ucretTutar === "" ? null : Number(ucretTutar),
        ucret_para_birimi: ucretTutar === "" ? null : paraBirimi,
      };

      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Güncellenemedi.");

      alert("İlan güncellendi.");
      navigate("/account/ilanlar", { replace: true });
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Yükleniyor...</div>;

  return (
    <div className="jobpost-page">
      <div className="jobpost-shell">
        <div className="jobpost-head">
          <div>
            <h2>İlanı Düzenle</h2>
            <p>İlan ID: <b>{id}</b></p>
          </div>
        </div>

        <form className="jobpost-card" onSubmit={kaydet}>
          <div className="field">
            <label>İş Başlığı</label>
            <input value={baslik} onChange={(e) => setBaslik(e.target.value)} />
          </div>

          <div className="field">
            <label>Açıklama</label>
            <textarea value={aciklama} onChange={(e) => setAciklama(e.target.value)} />
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
            <button type="button" className="btn-ghost" onClick={() => navigate(-1)} disabled={saving}>
              Geri
            </button>

            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
