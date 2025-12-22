import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const navigate=useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    const API = "http://localhost:5000";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', 
            });
            const data = await response.json();

            if (!response.ok) {
                setMessageType("error");
                setMessage(data.message || 'Kayıt başarısız oldu.');
            } else {
                setMessageType("success");
                setMessage('Kayıt başarılı. Ana sayfaya yönlendiriliyorsunuz.');
                
                setTimeout(() => {
                  navigate("/");
                }, 1500);
            }
        } catch (error) {
            setMessageType("error");
            setMessage('Bir hata oluştu. Lütfen tekrar deneyiniz. (Backend çalışıyor mu?)');
        }
    };
const googleIleKayit = (e) => {
  e.preventDefault();
  window.location.href =`${API}/api/sosyal/google`;
};
const githubIleKayit = (e) => {
  e.preventDefault();
  window.location.href = `${API}/api/sosyal/github`;
}
const linkedinIleKayit = (e) => {
  e.preventDefault();
  window.location.href =`${API}/api/sosyal/linkedin`;
}


  return (
    <div className="form-box register">
      <form onSubmit={handleSubmit}>
        <h1>KAYIT</h1>

        <div className="input-box">
          <input type="email" placeholder="Email" 
          required
           value={email} 
           onChange={(e)=>setEmail(e.target.value)} />
          <i className="bx bxs-envelope" />
        </div>

        <div className="input-box">
          <input type="password" 
          placeholder="Şifre" 
          required 
          value={password} 
          onChange={(e)=>setPassword(e.target.value)} />
          <i className="bx bxs-lock-alt" />
        </div>

        {message && (<p className={messageType === "error" ? "error-text" : "success-text"}>{message}</p>)}

        <button type="submit" className="btn">Kayıt Ol</button>
        <p>Sosyal platformlarla kayıt ol</p>

        <div className="social-icons">
          <a href="#" onClick={googleIleKayit}><i className='bx bxl-google'></i></a>
          <a href="#"><i className='bx bxl-facebook'></i></a>
          <a href="#" onClick={githubIleKayit}><i className='bx bxl-github'></i></a>
          <a href="#" onClick={linkedinIleKayit}><i className='bx bxl-linkedin'></i></a>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
