import React, { useEffect, useState } from "react";
import "./AnaSayfa.css";
import { FaUser } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
const AnaSayfa = () => {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        checkLoginStatus();
    }, []);
    const checkLoginStatus = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/check_session", {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error("Oturum kontrol hatası:", error);
            setIsLoggedIn(false);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/logout", {
                method: "POST",
                credentials: "include",
            });
            setIsLoggedIn(false);
            setShowMenu(false);
            alert("Başarıyla çıkış yapıldı.");
            navigate("/");
        } catch (error) {
            console.error("Çıkış yaparken hata oluştu:", error);
        }
    };

    const handleIconLoginClick = () => {
        setShowMenu(!showMenu);
    };
    return (
        <div className="anasayfa-container">
            <div className="ana-header">
                <h2 className="logo">Freelance Platform</h2>
                <div className="user-area">
                    <FaUser className="user-icon" onClick={handleIconLoginClick} />
                    {showMenu && (
                        <div className="menu-dropdown">
                            {isLoggedIn ? (
                                <div className="menu-item" onClick={handleLogout}>Çıkış Yap</div>
                            ) : (
                                <div className="menu-item" onClick={() => { navigate("/login"); setShowMenu(false); }}>Giriş Yap / Kayıt Ol</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default AnaSayfa;