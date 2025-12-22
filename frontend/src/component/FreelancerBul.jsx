import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import "../css/IsBul.css"

const LISTE2=[
    "Yazılım Geliştirme Uzmanı",
    "Yazılım Test Uzmanı",
    "Backend Developer",
    "Mali Müşavir",
    "AI Product Intern",
    "IT Uzmanı",

];



export default function FreelancerBul(){
    const navigate=useNavigate();
    const wrapRef= useRef(null);
    const [open,setOpen]= useState(false);
    

    useEffect(()=>{
        const onDown=(e)=>{
            if(wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)

        };
        document.addEventListener("mousedown", onDown);
        return()=> document.removeEventListener("mousedown", onDown);
    },[]);

    const gitBul=()=>{
        setOpen(false);
        navigate("/freelancer_bul");
    };

    return (
    <div className="isbul-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`isbul-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        Freelancer İşe Alın <span className="caret">▾</span>
      </button>

      {open && (
        <div className="isbul-dropdown">
            <div className="isbul-title">İş Kategorileri</div>
          <div className="isbul-list">
            {LISTE2.map((text) => (
              <button
                key={text}
                type="button"
                className="isbul-item"
                onClick={gitBul}
              >
                {text}
              </button>
            ))}
          </div>

          <button type="button" className="isbul-all" onClick={gitBul}>
            Daha fazla görüntüle →
          </button>
        </div>
      )}
    </div>
  );
}