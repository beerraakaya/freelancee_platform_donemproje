import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IsIlanlariGoster(){
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());

  const fetchJobs = async () => {
    const res = await fetch("http://localhost:5000/api/jobs", { credentials:"include",});
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
    const init = async () => {
      setLoading(true);
      try {
        await fetchJobs();
        await checkSessionAndApplied();
      } finally {
        setLoading(false);
      }
    };
    init();
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

      setAppliedIds((prev) => new Set([...prev, jobId]));
      alert("Başvurun alındı.");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>İş İlanları</h1>

      {jobs.length === 0 ? (
        <div>Henüz ilan yok.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {jobs.map((job) => {
            const isClosed = !!job.tamamlandi; // ✅ ilan kapalı mı?
            const isApplied = appliedIds.has(job.id); // ✅ başvuruldu mu?

            const ucretText =
              job.ucret_tutar != null
                ? `${job.ucret_tutar} ${job.ucret_para_birimi || ""}`
                : "";

            return (
              <div
                key={job.id}
                style={{
                  background: "rgba(255,255,255,0.35)",
                  borderRadius: 14,
                  padding: 18,
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>
                      {job.baslik}
                    </div>
                    <div style={{ marginTop: 6, opacity: 0.8 }}>
                      {job.yayinlayan_ad} {job.yayinlayan_soyad}
                    </div>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: 18 }}>
                    {ucretText}
                  </div>
                </div>

                <div style={{ marginTop: 14, lineHeight: 1.6 }}>
                  {job.aciklama}
                </div>

                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {/* ✅ ÖNCELİK: ilan kapalıysa her durumda "İlan kapatılmış" */}
                  {isClosed ? (
                    <span
                      style={{
                        padding: "10px 14px",
                        borderRadius: 999,
                        fontWeight: 700,
                        background: "#e8f6f3",
                        color: "#1f8a70",
                        border: "1px solid #bfe8de",
                      }}
                    >
                      İlan kapatılmış
                    </span>
                  ) : isApplied ? (
                    <button
                      disabled
                      style={{
                        padding: "10px 16px",
                        borderRadius: 12,
                        border: "none",
                        fontWeight: 700,
                        cursor: "not-allowed",
                        background: "#38c172",
                        color: "white",
                        opacity: 0.9,
                      }}
                    >
                      Başvuruldu
                    </button>
                  ) : (
                    <button
                      onClick={() => apply(job.id)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 12,
                        border: "none",
                        fontWeight: 700,
                        cursor: "pointer",
                        background: "#2563eb",
                        color: "white",
                      }}
                    >
                      Başvur
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}