import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/SifremiUnuttum.css";

export default function SifremiUnuttum() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState(null); // "success" | "error"
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setType(null);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setType("error");
        setMsg(data.message || "İstek başarısız.");
        return;
      }

      setType("success");
      setMsg(data.message || "Şifre sıfırlama linki mail adresinize gönderildi.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setType("error");
      setMsg("Bir hata oluştu. Backend çalışıyor mu?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pw-page">
      <div className="pw-card">
        <h1>Şifremi Unuttum</h1>
        <p className="pw-desc">
          Kayıtlı email adresini gir. Şifre yenileme linki göndereceğiz.
        </p>

        <form onSubmit={submit}>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className="bx bxs-envelope" />
          </div>

          {msg && (
            <p className={type === "error" ? "error-text" : "success-text"}>
              {msg}
            </p>
          )}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Gönderiliyor..." : "Şifre Yenileme Linki Gönder"}
          </button>

          <div className="pw-bottom">
            <Link to="/login">Giriş sayfasına dön</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

