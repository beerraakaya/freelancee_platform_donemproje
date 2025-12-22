import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/AnaSayfa.css";
import Reveal from "./Reveal";

export default function AnaSayfa() {
  const navigate = useNavigate();

  return (
    <div className="home-wrap">
      <div className="section hero">
        <div className="hero-grid">
          <div>
            <Reveal>
              <h1>
                Herhangi bir iş için, en iyi <span className="accent">freelancer</span>’ları bul.
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p>
                Profilini dolduran gerçek kullanıcıları keşfet, projeni yayınla veya iş ilanlarına göz at.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div className="hero-actions">
                <button className="btn primary" onClick={() => navigate("/freelancer_bul")}>
                  Bir Freelancer işe alın
                </button>
                <button className="btn" onClick={() => navigate("/is_ilanlari")}>
                  İş bul
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal className="right" delay={200}>
            <div className="hero-card">
              <div className="mini"><span className="dot" /><div className="line" /></div>
              <div className="mini"><span className="dot" /><div className="line" /></div>
              <div className="mini"><span className="dot" /><div className="line" /></div>
              <div style={{ color: "var(--muted)", marginTop: 10 }}>
                ⚡ 
              </div>
            </div>
          </Reveal>
        </div>
      </div>


      <div className="section">
        <Reveal><h2 style={{ margin: "0 0 16px" }}>Neden burası?</h2></Reveal>

        <div className="grid-3">
          <Reveal delay={0}>
            <div className="card">
              <h3>En yetenekliler</h3>
              <p>Profilini doldurmuş freelancer’ları listele ve profillerine bak.</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="card">
              <h3>Hızlı teklifler</h3>
              <p>İlanları gör, başvur, bildirimlerle anında haberdar ol.</p>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="card">
              <h3>Kontrol sende</h3>
              <p>Projeni yayınla, başvuruları incele, işi tamamlandı olarak işaretle.</p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="section">
        <Reveal><h2 style={{ margin: "0 0 16px" }}>Nasıl çalışır?</h2></Reveal>

        <div className="split">
          <Reveal className="left">
            <div className="step">
              <div className="num">1</div>
              <div>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Profilini doldur</div>
                <div style={{ color: "var(--muted)" }}>Ad-soyad, GitHub/LinkedIn ve CV ekle.</div>
              </div>
            </div>
          </Reveal>

          <Reveal className="right" delay={120}>
            <div className="step">
              <div className="num">2</div>
              <div>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Freelancer’ları görüntüle</div>
                <div style={{ color: "var(--muted)" }}>Freelancer listesine git, profilleri incele.</div>
              </div>
            </div>
          </Reveal>

          <Reveal className="left" delay={220}>
            <div className="step">
              <div className="num">3</div>
              <div>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>İlanlara göz at</div>
                <div style={{ color: "var(--muted)" }}>İş ilanlarını görüntüle ve başvur.</div>
              </div>
            </div>
          </Reveal>

          <Reveal className="right" delay={320}>
            <div className="step">
              <div className="num">4</div>
              <div>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Projeni yayınla</div>
                <div style={{ color: "var(--muted)" }}>İlan yayınla ekranına git ve ilan ekle.</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="section footer">
        <div className="footer-grid">
          <div>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Freelance Platform</div>
            <div>Güvenli, hızlı, modern bir iş platformu.</div>
          </div>
          <div>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Keşfet</div>
            <div><a href="/freelancer_bul">Freelancerlar</a></div>
            <div><a href="/is_ilanlari">İş ilanları</a></div>
          </div>
          <div>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Hesap</div>
            <div><a href="/account/profil">Profilim</a></div>
            <div><a href="/ilan-yayinla">İlan yayınla</a></div>
          </div>
          <div>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Destek</div>
            <div><span>Yardım & Destek</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
