import React from "react";
import AnaSayfa from "./component/AnaSayfa.jsx";
import Layout from "./container/Layout.jsx";
import AuthLayout from "./container/AuthLayout.jsx";
import LoginRegister from "./component/LoginRegister.jsx";
import AccountLayout from "./component/AccountLayout.jsx";
import Profilim from "./component/Profilim.jsx";
import Ilanlarim from "./component/Isilanlarim.jsx";
import Basvurularim from "./component/IsBasvurularim.jsx";
import SifremiUnuttum from "./component/SifremiUnuttum.jsx";
import SifreSifirlama from "./component/SifreSifirlama.jsx";
import TamamlananIsler from "./component/TamamlananIsler.jsx";
import IlanDuzenle from "./component/IlanDuzenle.jsx";
import "boxicons/css/boxicons.min.css";
import { Routes, Route, Navigate} from "react-router-dom";
import RequireAuth from "./component/RequireAuth.jsx";
import { useNavigate } from "react-router-dom";
import IlanYayinla from "./component/IlanYayinla.jsx";
import BasvuranProfil from "./component/BasvuranProfil.jsx";
import IsIlanlariGoster from "./component/IsIlanlariGoster.jsx";
import FreelancerGoster from "./component/FreelancerGoster.jsx";
import FreelancerProfil from "./component/FreelancerProfil.jsx";



function App() {
  const [message, setMessage]= React.useState(null);
  const [messageType, setMessageType]= React.useState(null);
  const [email, setEmail]= React.useState("");
  const [password, setPassword]= React.useState("");
  const navigate= useNavigate();
  const handleSubmit= async(e)=> {
    e.preventDefault();
    setMessage(null);
    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });
        const data = await response.json();
        
        if (!response.ok) {
            setMessageType("error");
            setMessage(data.message || 'Giriş başarısız oldu.');
        } else {
            setMessageType("success");
            setMessage('Giriş başarılı.');
            const hedef= sessionStorage.getItem('redirectPath') || "/";
            sessionStorage.removeItem('redirectPath');
            setTimeout(() => {
                navigate(hedef, { replace: true });
            }, 1500);
        }
    } catch (error) {
        setMessageType("error");
        setMessage('Bir hata oluştu. Lütfen tekrar deneyiniz. (Backend çalışıyor mu?)');
    }
  }

return (
  <Routes>
    <Route path="/login" element={<LoginRegister />} />
    <Route path="/sifremi-unuttum" element={<SifremiUnuttum />} />
    <Route path="/sifre-sifirlama" element={<SifreSifirlama />} />

    <Route element={<Layout />}>
      <Route path="/" element={<AnaSayfa />} />
      
      <Route element={<RequireAuth />}>
        <Route path="/is_ilanlari" element={<IsIlanlariGoster />} />
        <Route path="/ilan-yayinla" element={<IlanYayinla />} />
        <Route path="/freelancer_bul" element={<FreelancerGoster />} />
        <Route path="/freelancer/:userId" element={<FreelancerProfil />} />
        <Route path="/ilan-duzenle/:id" element={<IlanDuzenle />} />
        <Route path="/ilan/:jobId/basvuran/:userId" element={<BasvuranProfil />} />

        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<Navigate to="/account/profil" replace />} />
          <Route path="profil" element={<Profilim />} />
          <Route path="ilanlar" element={<Ilanlarim />} />
          <Route path="basvurular" element={<Basvurularim />} />
          <Route path="tamamlananisler" element={<TamamlananIsler />} />
        </Route>

        <Route
          path="/search"
          element={<div style={{ padding: "24px 32px" }}>Arama Sonuçları</div>}
        />
      </Route>
    </Route>
  </Routes>
);

}

export default App;
