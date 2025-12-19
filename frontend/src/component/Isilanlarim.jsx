import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Isilanlarim.css"

export default function Isilanlarim() {
  const navigate = useNavigate();
  const [ilanlar, setIlanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [openApplicantsJobId, setOpenApplicantsJobId] = useState(null);
  const [applicantsMap, setApplicantsMap] = useState({});
  const [loadingApplicantsId, setLoadingApplicantsId] = useState(null);

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

  const basvuranlari_getir=async (jobId)=>{
    if (openApplicantsJobId === jobId) {
    setOpenApplicantsJobId(null);
    return;
  }
  setOpenApplicantsJobId(jobId);
  if (applicantsMap[jobId]) return;

   try {
    setLoadingApplicantsId(jobId);
    const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/applicants`, {
      credentials: "include",
    });

    const data = await res.json().catch(() => []);
    if (!res.ok) throw new Error(data.message || "Başvuranlar alınamadı.");

    setApplicantsMap((prev) => ({ ...prev, [jobId]: Array.isArray(data) ? data : [] }));
  } catch (e) {
    alert(e.message);
  } finally {
    setLoadingApplicantsId(null);
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
                <button
                  className="myjobs-edit"
                  onClick={() => navigate(`/ilan-duzenle/${j.id}`)}
                >
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

            <div className="myjobs-foot">
              <button
                className="myjobs-applicants"
                onClick={() => basvuranlari_getir(j.id)}
              >
                {loadingApplicantsId === j.id
                  ? "Yükleniyor..."
                  : openApplicantsJobId === j.id
                  ? "Kapat"
                  : "Başvuranları Gör"}
              </button>
            </div>

            {openApplicantsJobId === j.id && (
              <div className="applicants-panel">
                <div className="applicants-title">Başvuranlar</div>

                {(applicantsMap[j.id] || []).length === 0 ? (
                  <div className="applicants-empty">Henüz başvuran yok.</div>
                ) : (
                  <div className="applicants-list">
                    {(applicantsMap[j.id] || []).map((u) => {
                      const fotoUrl = u.profil_foto
                        ? `http://localhost:5000${u.profil_foto}?v=${Date.now()}`
                        : null;

                      return (
                        <div key={u.id} className="applicant-item">
                          <div className="applicant-avatar">
                            {fotoUrl ? (
                              <img src={fotoUrl} alt="profil" />
                            ) : (
                              <span>
                                {(u.ad?.[0] || "K")}
                                {(u.soyad?.[0] || "")}
                              </span>
                            )}
                          </div>

                          <div key={u.user_id} className="applicant-name">
                            {(u.ad || "İsimsiz")} {(u.soyad || "")}
                          </div>

                          <button
                            className="applicant-view"
                            onClick={() => navigate(`/ilan/${j.id}/basvuran/${u.user_id}`)}
                          >
                            Profili Görüntüle
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);
}