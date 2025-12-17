import React, {useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginForm = () => {
    const location=useLocation();
    const navigate=useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        if (params.get("success") === "true") {
          setMessageType("success");
          setMessage("Sosyal platform ile giriş başarılı. Hoşgeldiniz " + params.get("email"));

          setTimeout(() => {
            const hedef= sessionStorage.getItem('redirectPath') || "/";
            sessionStorage.removeItem('redirectPath');
            navigate(hedef, { replace: true });
            
          }, 1500);
        }
        if (params.get("error") === "no_email") {
          setMessageType("error");
          setMessage("Google hesabınızdan email alınamadı.");
        }
      }, [location]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const handleSubmit = async (e) => {
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
    };

const googleIleGiris=()=>{
  sessionStorage.setItem('redirectPath', location.pathname);
    window.location.href = 'http://localhost:5000/api/sosyal/google';
}

const githubIleGiris=()=>{
  sessionStorage.setItem('redirectPath', location.pathname);
  window.location.href = 'http://localhost:5000/api/sosyal/github';
}

const linkedinIleGiris=()=>{
  window.location.href = 'http://localhost:5000/api/sosyal/linkedin';
}
  return (
    <div className="form-box login">
      <form onSubmit={handleSubmit}>
        <h1>GİRİŞ</h1>

        <div className="input-box">
          <input type="email" placeholder="Email" required value={email} onChange={(e)=>setEmail(e.target.value)} />
          <i className="bx bxs-user" />
        </div>

        <div className="input-box">
          <input type="password" placeholder="Şifre" required 
          value={password} 
          onChange={(e)=>setPassword(e.target.value)} />
          <i className="bx bxs-lock-alt" />
        </div>

        <div className="forgot-link">
          <Link to="/sifremi-unuttum"> Şifreni mi Unuttun?</Link>
        </div>

        {message && (<p className={messageType === "error" ? "error-text" : "success-text"}>{message}</p>)}

        <button type="submit" className="btn">Giriş Yap</button>

        <p>Sosyal platformlarla giriş yap</p>

        <div className="social-icons">
          <button type="button" onClick={googleIleGiris}> <i className='bx bxl-google'></i></button>
          <button type="button"><i className='bx bxl-facebook'></i></button>
          <button type="button" onClick={githubIleGiris}><i className='bx bxl-github'></i></button>
          <button type="button" onClick={linkedinIleGiris}><i className='bx bxl-linkedin'></i></button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
