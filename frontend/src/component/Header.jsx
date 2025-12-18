import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { BsClipboard2PlusFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function Header() {
     const navigate = useNavigate();
    
        const [isLoggedIn, setIsLoggedIn] = useState(false);
    
        const [showMenu, setShowMenu] = useState(false);
        
        const[searchQuery,setSearchQuery]=useState(""); 
    
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
                    await response.json();
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
                await fetch("http://localhost:5000/api/logout", {
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

        const handleİsVermeClick=()=>{
            if(!isLoggedIn) {
                sessionStorage.setItem("redirectPath", "/ilan-yayinla");
                navigate("/login");
                return;
            }
            navigate("/ilan-yayinla");

        };
    
        const handleSearchSubmit=(e)=>{
            e.preventDefault();
            const q= searchQuery.trim();
            if(!q) return;
            navigate(`/search?query=${encodeURIComponent(q)}`);
        }

        const goAccount=(subPath)=>{
            setShowMenu(false);
            navigate(`/account/${subPath}`);
        };
        
        return (
            <div className="ana-header">
                    <h2 className="logo" onClick={()=> navigate("/")}>Freelance Platform</h2>
                    <form className="search-bar" onSubmit={handleSearchSubmit}>
                        <input type="text"
                        placeholder="Arama Yapınız"
                        value={searchQuery}
                        onChange={(e)=> setSearchQuery(e.target.value)}
                        />
                        <button type="submit" aria-label="Ara">🔍</button>
                    </form>

                    <div className="header-right">

                         <BsClipboard2PlusFill className="plus-icon" onClick={handleİsVermeClick}/>
                    
                    <div className="user-area">
                        <FaUser className="user-icon" onClick={handleIconLoginClick} />
                        {showMenu && (
                            <div className="menu-dropdown">
                                {isLoggedIn ? (
                                    <>
                                        <div className="menu-item" onClick={() => goAccount("profil")}>Profilim</div>
                                        <div className="menu-item" onClick={() => goAccount("ilanlar")}>İş İlanlarım</div>
                                        <div className="menu-item" onClick={() => goAccount("basvurular")}>İş Başvurularım</div>
                                        <div className="menu-item" onClick={()=> goAccount("tamamlananisler")}>Tamamlanan İşler</div>
                                        <div className="menu-item" onClick={handleLogout}>Çıkış Yap</div>
                                    </>
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
