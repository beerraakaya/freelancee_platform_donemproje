import React,{useEffect, useRef, useState} from "react";
import "../css/Profilim.css"
import Cropper from "react-easy-crop";
import {getResimKirpma} from "../utils/cropImage";

export default function Profilim(){ 
    const fotoInput= useRef(null);

    const [loading, setLoading]= useState(true);
    const [saving, setSaving]= useState(false);
    const [uploadingCv, setUploadingCv]= useState(false);
    const [uploadingFoto, setUploadingFoto]= useState(false);

    const [cropOpen, setCropOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const [profil, setProfil]= useState({
        ad: "",
        soyad: "",
        github: "",
        linkedin: "",
        profil_foto: null,
        cv_dosya: null,
        cv_dosya_adi: null,
    });

    const [fotoPreview, setFotoPreview]= useState(null);
    const [cvFile, setCvFile]= useState(null);

    useEffect(()=> {
        const fetchProfil=async()=>{
            try{
                const res= await fetch("http://localhost:5000/api/profile",{
                    method: "GET",
                    credentials: "include",
                });
                if(!res.ok) throw new Error("Profil Getirilemedi");
                const data= await res.json();

                setProfil({

                    ad: data.ad || "",
                    soyad: data.soyad || "",
                    github: data.github || "",
                    linkedin: data.linkedin || "",
                    profil_foto: data.profil_foto || null,
                    cv_dosya: data.cv_dosya || null,
                    cv_dosya_adi: data.cv_dosya_adi || null,
                });
                if(data.profil_foto){
                  const url= "http://localhost:5000" + data.profil_foto;
                  setFotoPreview(url+"?v="+ Date.now());
                }
            }catch(e){
                console.log(e);
            }finally{
                setLoading(false);
            }
        };

        fetchProfil();
    },[]);

    const onChangeField= (key)=>(e)=> {
        setProfil((p)=>({...p, [key]: e.target.value}));
    };

    const onFotoSec= async(e)=>{
        const file=e.target.files?.[0];
        if(!file) return;

        const url= URL.createObjectURL(file);
        setImageSrc(url);

        setCrop({ x: 0, y: 0 });
        setZoom(1);
      
        setCroppedAreaPixels(null);

        setCropOpen(true);
      };

    const onCropComplete=(_,croppedPixels)=>{
      setCroppedAreaPixels(croppedPixels);
    };

    const uploadFotoFile= async(file)=>{
      setUploadingFoto(true);
      try{
        const fd = new FormData();
        fd.append("photo", file);

    const res = await fetch("http://localhost:5000/api/profile/photo", {
      method: "POST",
      credentials: "include",
      body: fd, 
      
    });const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Foto yüklenmedi");

    if (data.profil_foto) {
      const url = "http://localhost:5000" + data.profil_foto + "?v=" + Date.now();
      setFotoPreview(url);
      setProfil((p) => ({ ...p, profil_foto: data.profil_foto }));
    }

    alert("Profil fotoğrafı güncellendi.");
  } catch (err) {
    console.log(err);
    alert("Fotoğraf yüklemede hata oldu.");
  } finally {
    setUploadingFoto(false);
  }
};
    
const cropKaydetVeYukle = async () => {
  if (!imageSrc || !croppedAreaPixels) return;

  try {
    setUploadingFoto(true);
    const blob = await getResimKirpma(imageSrc, croppedAreaPixels);
    const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

    await uploadFotoFile(file);

    setCropOpen(false);
  } catch (e) {
    console.log(e);
    alert("Kırpma/yükleme sırasında hata oldu.");
  } 
};

    const onCvSec = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFile(file);
  };
    
    const cvYukle = async () => {
    if (!cvFile) return alert("Önce CV (PDF) seçmelisin.");

    try {
      setUploadingCv(true);

      const fd = new FormData();
      fd.append("cv", cvFile);

      const res = await fetch("http://localhost:5000/api/profile/cv", {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "CV yüklenemedi");

      setProfil((p) => ({
        ...p,
        cv_dosya: data.cv_dosya || p.cv_dosya,
        cv_dosya_adi: data.cv_dosya_adi || p.cv_dosya_adi,
      }));

      alert("CV yüklendi.");
    } catch (err) {
      console.log(err);
      alert("CV yüklemede hata oldu.");
    } finally {
      setUploadingCv(false);
    }
  };

  const kaydet = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ad: profil.ad,
        soyad: profil.soyad,
        github: profil.github,
        linkedin: profil.linkedin,
      };

      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Profil kaydedilemedi");

      alert("Profil kaydedildi.");
    } catch (err) {
      console.log(err);
      alert("Kaydetmede hata oldu.");
    } finally {
      setSaving(false);
    }
  };
  const mevcutFotoyuDuzenle = () => {
  if (fotoPreview) {
    setImageSrc(fotoPreview);   
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCropOpen(true);
  } else {
    fotoInput.current?.click(); 
  }
};

  if (loading) return <div style={{ padding: "24px 32px" }}>Yükleniyor...</div>;

  return(
    <div className="profil-page">
      <div className="profil-title">
        <h2>Profilim</h2>
        <p>Bilgilerini güncelle, bağlantılarını ekle ve CV’ni yükle.</p>
      </div>

      <form className="profil-card" onSubmit={kaydet}>
        <div className="profil-left">
          <div className="avatar-box">
            <div className="avatar">
              {fotoPreview ? <img src={fotoPreview} alt="Profil" /> : <span>Foto</span>}
              </div>
               <button
                type="button"
                className="avatar-edit-btn"
                onChange={onFotoSec}
                ref={fotoInput}
                onClick={()=> fotoInput.current?.click()}
                disabled={uploadingFoto}
                title="Düzenle"
              >
                <span className="avatar-edit-ico">✎</span>
                <span className="avatar-edit-text">Edit</span>
              </button>
            
           

            <div className="avatar-actions">
              <input
                type="file"
                accept="image/*"
                onChange={onFotoSec}
                style={{ display: "none" }}
                ref={fotoInput}
              />
              <button
                type="button"

                className="avatar-edit-btn"
                onClick={() => fotoInput.current?.click()}
                disabled={uploadingFoto}
              > 
              <span className="avatar-edit-ico">✎</span>
              <span className="avatar-edit-text">Edit</span>
              </button>
            </div>

            <div className="mini-info">
              <div className="name">
                {(profil.ad || "Ad")} {(profil.soyad || "Soyad")}
              </div>
              
            </div>
          </div>
        </div>


        <div className="profil-right">
          <div className="grid">
            <div className="field">
              <label>Ad</label>
              <input value={profil.ad} onChange={onChangeField("ad")} />
            </div>

            <div className="field">
              <label>Soyad</label>
              <input value={profil.soyad} onChange={onChangeField("soyad")} />
            </div>

            <div className="field full">
              <label>GitHub Linki</label>
              <input value={profil.github} onChange={onChangeField("github")} placeholder="https://github.com/..." />
            </div>

            <div className="field full">
              <label>LinkedIn Linki</label>
              <input value={profil.linkedin} onChange={onChangeField("linkedin")} placeholder="https://linkedin.com/in/..." />
            </div>

            <div className="field full">
              <label>CV (PDF)</label>
              <div className="cv-row">
                <input type="file" accept="application/pdf" onChange={onCvSec} />
                <button type="button" className="btn-outline" onClick={cvYukle} disabled={uploadingCv}>
                  {uploadingCv ? "Yükleniyor..." : "CV Yükle"}
                </button>
              </div>

              {profil.cv_dosya && (
                <div className="cv-link">
                  <a
                    href={"http://localhost:5000" + profil.cv_dosya}
                    target="_blank"
                    rel="noreferrer"
                  >
                    CV’yi Görüntüle {profil.cv_dosya_adi ? `(${profil.cv_dosya_adi})` : ""}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      </form>

      {cropOpen && (
      <div className="crop-modal-overlay" onClick={() => !uploadingFoto && setCropOpen(false)}>
      <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
      <div className="crop-header">
        <h3>Fotoğrafı Ayarla</h3>
        <button
          type="button"
          className="crop-close"
          onClick={() => !uploadingFoto && setCropOpen(false)}
        >
          ✕
        </button>
      </div>

      <div className="crop-area">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}                 
          cropShape="round"          
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="crop-controls">
        <label>
          Zoom
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="crop-actions">
        <button
          type="button"
          className="btn-outline"
          onClick={() => setCropOpen(false)}
          disabled={uploadingFoto}
        >
          İptal
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={cropKaydetVeYukle}
          disabled={uploadingFoto}
        >
          {uploadingFoto ? "Yükleniyor..." : "Kaydet ve Yükle"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
