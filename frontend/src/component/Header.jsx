import React, { useEffect, useState, useRef} from "react";
import { FaUser } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { BsClipboard2PlusFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import IsBulDropdown from "./IsBulDropdown";
import FreelancerBul from "./FreelancerBul";
import logo from "../resimler/freelancer.png"

export default function Header() {
     const navigate = useNavigate();
     const bildirimRef= useRef(null);
     const userRef= useRef(null);
    
        const [isLoggedIn, setIsLoggedIn] = useState(false);
    
        const [showMenu, setShowMenu] = useState(false);
        
        const[searchQuery,setSearchQuery]=useState(""); 

        const [bildirimAc, setbildirimAc] = useState(false);
        const [bildirimler, setbildirimler] = useState([]);
        const [unreadCount, setUnreadCount] = useState(0);

        useEffect(()=>{
            const handleClickOut=(e)=>{
                if (bildirimRef.current && !bildirimRef.current.contains(e.target)){
                    setbildirimAc(false)
                }

                if (userRef.current&& !userRef.current.contains(e.target)){
                    setShowMenu(false);
                }
            };
            document.addEventListener("mousedown", handleClickOut);
            return ()=> document.removeEventListener("mousedown", handleClickOut);
        },[])
        

    
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
            setbildirimAc(false);
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
    
        const handleBildirimClick=async()=>{
            setShowMenu(false);

            await checkLoginStatus();

            if(!isLoggedIn){
                sessionStorage.setItem("bildirim","/");
                setbildirimAc(false);
                navigate("/login");
                return;
            }
            setbildirimAc((v)=>!v);
            fetchBildirim();

        }
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

        const fetchBildirim= async()=>{
            try{
                const res= await fetch ("http://localhost:5000/api/bildirim?only_unread=0", {
                    credentials:"include",
                });
                const data= await res.json().catch(()=>({}));
                if(!res.ok) return;

                setbildirimler(data.bildirimler||[]);
                setUnreadCount(data.unreadCount||0);
            }catch(e){
                console.log(e);
            }
        };
        useEffect(()=>{
            fetchBildirim();
            const t= setInterval(fetchBildirim,15000);
            return()=> clearInterval(t);
        },[]);

        const okundu_isaretle = async (id) => {
            try {
                await fetch(`http://localhost:5000/api/bildirim/${id}/read`, {
                method: "PATCH",
                credentials: "include",
            });
            fetchBildirim();
            } catch (e) {
                console.log(e);
            }
        };

        
        return (
            <div className="ana-header"> 
                    <div className="header-left">
                        <img
                            src={logo}
                            alt="Freelance Platform"
                            className="logo-img"
                            onClick={() => navigate("/")}
                            />
                        <IsBulDropdown />
                        <FreelancerBul/>


                        
                    </div>
                    <form className="search-bar" onSubmit={handleSearchSubmit}>
                        <input type="text"
                        placeholder="Arama Yapınız"
                        value={searchQuery}
                        onChange={(e)=> setSearchQuery(e.target.value)}
                        />
                        <button type="submit" aria-label="Ara">🔍</button>
                    </form>
                  <div className="header-right">
                    <div ref={bildirimRef} className="notif-area">

                <button
                    type="button"
                    className="notif-btn"
                    onClick={handleBildirimClick}
                    aria-label="Bildirimler"
                >
                    <FaBell />
                    {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </button>

                {bildirimAc && (
                    <div className="notif-dropdown">
                    <div className="notif-title">Bildirimler</div>

                    {bildirimler.length === 0 ? (
                        <div className="notif-empty">Bildirim yok.</div>
                    ) : (
                        <div className="notif-list">
                        {bildirimler.map((n) => (
                            <div
                            key={n.id}
                            className={`notif-item ${n.is_read ? "read" : "unread"}`}
                            onClick={() => okundu_isaretle(n.id)}
                            role="button"
                            tabIndex={0}
                            >
                            {n.message}
                            </div>
                        ))}
                        </div>
                    )}
                    </div>
                )}
                </div>

                <BsClipboard2PlusFill className="plus-icon" onClick={handleİsVermeClick} />
                    
                    <div className="user-area" ref={userRef}>
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
