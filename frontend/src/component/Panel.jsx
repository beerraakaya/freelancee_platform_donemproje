import React from "react";

const TogglePanel = ({ setActive }) => {
  return (
    <div className="toggle-box">

      <div className="toggle-panel toggle-left">
        <h1>Merhaba, Hoşgeldiniz!</h1>
        <p>Hesabınız yok mu?</p>

        <button
          className="btn"
          onClick={() => setActive(true)}
        >
          Kayıt Ol
        </button>
      </div>

      <div className="toggle-panel toggle-right">
        <h1>Tekrar Hoşgeldiniz!</h1>
        <p>Zaten bir hesabınız var mı?</p>

        <button
          className="btn"
          onClick={() => setActive(false)}
        >
          Giriş Yap
        </button>
      </div>

    </div>
  );
};

export default TogglePanel;
