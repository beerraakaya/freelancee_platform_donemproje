import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/SifreSifirlama.css";

export default function SifreSifirlama() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get("token");
  }, [location.search]);

  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState(null); // "success" | "error"
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setType(null);

    if (!token) {
      setType("error");
      setMsg("Link hatalı (token yok).");
      return;
    }
    if (p1.length < 6) {
      setType("error");
      setMsg("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (p1 !== p2) {
      setType("error");
      setMsg("Şifreler uyuşmuyor.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, new_password: p1 }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setType("error");
        setMsg(data.message || "Şifre güncellenemedi.");
        return;
      }

      setType("success");
      setMsg("Şifre güncellendi. Giriş sayfasına yönlendiriliyorsun...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setType("error");
      setMsg("Bir hata oluştu. Backend çalışıyor mu?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h1>Şifre Sıfırlama</h1>
        <p className="reset-desc">Yeni şifreni iki kez gir ve yenile.</p>

        <form onSubmit={submit}>
          <div className="input-box">
            <input
              type="password"
              placeholder="Yeni Şifre"
              value={p1}
              onChange={(e) => setP1(e.target.value)}
            />
            <i className="bx bxs-lock-alt" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Yeni Şifre (Tekrar)"
              value={p2}
              onChange={(e) => setP2(e.target.value)}
            />
            <i className="bx bxs-lock-alt" />
          </div>

          

          {msg && (
            <p className={type === "error" ? "error-text" : "success-text"}>
              {msg}
            </p>
          )}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Güncelleniyor..." : "Yenile"}
          </button>

          <div className="reset-bottom">
            <Link to="/login">Giriş sayfasına dön</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
