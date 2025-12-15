import React from "react";

import Header from "../component/Header";
import "../css/Header.css";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="anasayfa-container">
            <Header />
            <Outlet />
        </div> 
        );
            
}
