import React,{useEffect, useState} from "react";
import { useNavigate,useParams } from "react-router-dom";
import "../css/BasvuranProfil.css"


function normalUrl(url){
    if(!url) return "";
    const t= url.trim();
    if(!t) return "";
    if (t.startsWith("http://") || t.startsWith("https://")) return t;
    return "https://" + t; 
}


export default function BasvuranProfil(){
    const {jobId,userId}=useParams();
    const navigate= useNavigate();

    const [loading, setLoading]=useState();
    const [p,setP]= useState(null);

    useEffect(()=>{
        const load=async()=>{
            setLoading(true);
            try{
                const res=await fetch (`http://localhost:5000/api/jobs/${jobId}/applicants/${userId}/profile`,{ credentials: "include" });

                const data= await res.json().catch(()=> ({}));
                if(!res.ok) throw new Error(data.message|| "Profil alınamadı.");

                setP(data);
            }catch(e){
                alert(e.message);
                navigate("/account/ilanlar", {replace: true});
            }finally{
                setLoading(false);
            }
        };
        load();

    }, [jobId, userId, navigate]);

    if (loading) return <div style={{padding: 24}}>Yükleniyor..</div>;
    if(!p) return null;

    const fotoUrl= p.profil_foto ? `http://localhost:5000${p.profil_foto}?v=${Date.now()}` : null;
    const githuburl=normalUrl(p.github);
    const linkedinurl= normalUrl(p.linkedin);
    const cvurl= p.cv_dosya ? `http://localhost:5000${p.cv_dosya}` : null;

    return (
    <div className="ap-wrap">
      <div className="ap-card">
        <div className="ap-head">
          <button className="ap-back" onClick={() => navigate(-1)}>← Geri</button>
          <div className="ap-title">Başvuran Profili</div>
        </div>

        <div className="ap-body">
          <div className="ap-left">
            <div className="ap-avatar">
              {fotoUrl ? (
                <img src={fotoUrl} alt="Profil" />
              ) : (
                <span>
                  {(p.ad?.[0] || "K")}
                  {(p.soyad?.[0] || "")}
                </span>
              )}
            </div>

            <div className="ap-name">
              {(p.ad || "İsimsiz")} {(p.soyad || "")}
            </div>
          </div>

          <div className="ap-right">
            <div className="ap-row">
              <div className="ap-label">GitHub</div>
              {githuburl ? (
                <a className="ap-link" href={githuburl} target="_blank" rel="noreferrer">
                  {p.github}
                </a>
              ) : (
                <div className="ap-empty">Yok</div>
              )}
            </div>

            <div className="ap-row">
              <div className="ap-label">LinkedIn</div>
              {linkedinurl ? (
                <a className="ap-link" href={linkedinurl} target="_blank" rel="noreferrer">
                  {p.linkedin}
                </a>
              ) : (
                <div className="ap-empty">Yok</div>
              )}
            </div>

            <div className="ap-row">
              <div className="ap-label">CV</div>
              {cvurl ? (
                <a className="ap-link" href={cvurl} target="_blank" rel="noreferrer">
                  CV’yi Aç {p.cv_dosya_adi ? `(${p.cv_dosya_adi})` : ""}
                </a>
              ) : (
                <div className="ap-empty">Yok</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
