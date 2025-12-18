import { NavLink, Outlet } from "react-router-dom";
import "../css/Account.css";
import React from "react";



export default function AccountLayout() {
    return (
        <div className="account-wrap">
            <aside className="account-menu">
                <NavLink to="/account/profil" className="account-link">Profilim</NavLink>
                <NavLink to="/account/ilanlar" className="account-link">İş İlanlarım</NavLink>
                <NavLink to="/account/basvurular" className="account-link">İş Başvurularım</NavLink>
                <NavLink to="/account/tamamlananisler" className="account-link">Tamamlanan İşler</NavLink>
            </aside>

            <main className="account-content">
                <Outlet />
            </main>
        </div>
    );
}