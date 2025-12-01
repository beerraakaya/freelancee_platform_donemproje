import React, {useState} from "react";

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                setMessageType("error");
                setMessage(data.message || 'Kayıt başarısız oldu.');
            } else {
                setMessageType("success");
                setMessage('Kayıt başarılı. Giriş yapabilirsiniz.');
            }
        } catch (error) {
            setMessageType("error");
            setMessage('Bir hata oluştu. Lütfen tekrar deneyiniz. (Backend çalışıyor mu?)');
        }
    };
const googleIleGiris = () => {
  window.location.href = "http://localhost:5000/api/sosyal/google";
};
const githubIleGiris = () => {
  window.location.href = "http://localhost:5000/api/sosyal/github";
}
const linkedinIleGiris = () => {
  window.location.href = "http://localhost:5000/api/sosyal/linkedin";
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
          <a href="button" onClick={googleIleGiris}><i className='bx bxl-google'></i></a>
          <a href="button"><i className='bx bxl-facebook'></i></a>
          <a href="button" onClick={githubIleGiris}><i className='bx bxl-github'></i></a>
          <a href="button" onClick={linkedinIleGiris}><i className='bx bxl-linkedin'></i></a>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
