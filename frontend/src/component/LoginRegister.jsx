import React, { useState } from "react";
import "../css/LoginRegister.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import TogglePanel from "./Panel";

const LoginRegister = () => {
  const [active, setActive] = useState(false);

  return (
    <div className="auth-page">
    <div className={active ? "container active" : "container"}>
      <LoginForm />
      <RegisterForm />

      <TogglePanel
        setActive={setActive}
      />
    </div>
    </div>
  );
};

export default LoginRegister;