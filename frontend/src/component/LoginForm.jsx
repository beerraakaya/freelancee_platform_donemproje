import React, {useState} from "react";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                setMessageType("error");
                setMessage(data.message || 'Giriş başarısız oldu.');
            } else {
                setMessageType("success");
                setMessage('Giriş başarılı.');
            }
        } catch (error) {
            setMessageType("error");
            setMessage('Bir hata oluştu. Lütfen tekrar deneyiniz. (Backend çalışıyor mu?)');
        }
    };

const googleIleGiris=()=>{
    window.location.href = 'http://127.0.0.1:5000/api/sosyal/google';
}

const githubIleGiris=()=>{
  window.location.href = 'http://127.0.0.1:5000/api/sosyal/github';
}

const linkedinIleGiris=()=>{
  window.location.href = 'http://127.0.0.1:5000/api/sosyal/linkedin';
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
          <a href="#"> Şifreni mi Unuttun?</a>
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
