import React from "react";
import AnaSayfa from "./component/AnaSayfa.jsx";
import LoginRegister from "./component/LoginRegister.jsx";
import "boxicons/css/boxicons.min.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AnaSayfa />} />
      <Route path="/login" element={<LoginRegister />} />
    </Routes>
  );
}

export default App;
