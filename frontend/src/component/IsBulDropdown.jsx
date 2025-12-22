import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import "../css/IsBul.css";
const LISTE=[
    "Web Sitesi İşleri", 
    "Yazılım Geliştirme İşleri",
    "Veri Girişi İşleri",
    "Hukuk İşleri",
    "E-Ticaret İşleri",
    "Mobil Uygulama İşleri",
    "Siber Güvenlik İşleri",
];

export default function IsBulDropdown(){
    const navigate= useNavigate();
    const wrapRef= useRef(null);
    const [open,setOpen]=useState(false);

    useEffect(()=>{
        const onDown=(e)=>{
            if(wrapRef.current&& !wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return()=> document.removeEventListener("mousedown",onDown);
    },[]);

    const gitIsIlanlari=()=>{
        setOpen(false);
        navigate("/is_ilanlari");
    };

    return (
    <div className="isbul-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`isbul-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        İş Bulun <span className="caret">▾</span>
      </button>

      {open && (
        <div className="isbul-dropdown">
          <div className="isbul-title">Popüler işler</div>

          <div className="isbul-list">
            {LISTE.map((text) => (
              <button
                key={text}
                type="button"
                className="isbul-item"
                onClick={gitIsIlanlari}
              >
                {text}
              </button>
            ))}
          </div>

          <button type="button" className="isbul-all" onClick={gitIsIlanlari}>
            Daha fazla görüntüle →
          </button>
        </div>
      )}
    </div>
  );
}