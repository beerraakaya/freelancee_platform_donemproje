import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AnaSayfa(){
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appliedIds, setAppliedIds] = useState(new Set());

  const fetchJobs = async () => {
    const res = await fetch("http://localhost:5000/api/jobs");
    const data = await res.json();
    setJobs(Array.isArray(data) ? data : []);
  };

  const checkSessionAndApplied = async () => {
    try {
      const s = await fetch("http://localhost:5000/api/check_session", {
        method: "GET",
        credentials: "include",
      });

      if (!s.ok) {
        setIsLoggedIn(false);
        setAppliedIds(new Set());
        return;
      }

      setIsLoggedIn(true);

      const a = await fetch("http://localhost:5000/api/my_applications/ids", {
        method: "GET",
        credentials: "include",
      });

      if (a.ok) {
        const adata = await a.json();
        setAppliedIds(new Set(adata.job_ids || []));
      }
    } catch (e) {
      setIsLoggedIn(false);
      setAppliedIds(new Set());
    }
  };

  useEffect(() => {
    fetchJobs();
    checkSessionAndApplied();
  }, []);

  const apply = async (jobId) => {
    if (!isLoggedIn) {
      sessionStorage.setItem("redirectPath", "/");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/apply`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Başvuru başarısız");

      // UI güncelle
      setAppliedIds((prev) => new Set([...prev, jobId]));
      alert("Başvurun alındı.");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ padding: "24px 32px" }}>
      <h2>İş İlanları</h2>

      <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
        {jobs.map((j) => {
          const applied = appliedIds.has(j.id);

          return (
            <div key={j.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0 }}>{j.baslik}</h3>
                  <div style={{ opacity: 0.8, marginTop: 6 }}>
                    {j.yayinlayan_ad} {j.yayinlayan_soyad}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  {j.ucret_tutar != null && j.ucret_para_birimi ? (
                    <div style={{ fontWeight: 700 }}>
                      {j.ucret_tutar} {j.ucret_para_birimi}
                    </div>
                  ) : (
                    <div style={{ opacity: 0.7 }}>Ücret belirtilmedi</div>
                  )}
                </div>
              </div>

              <p style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{j.aciklama}</p>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => apply(j.id)}
                  disabled={applied}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    cursor: applied ? "not-allowed" : "pointer",
                  }}
                >
                  {applied ? "Başvuruldu" : "Başvur"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
