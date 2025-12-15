import { useLocation , Navigate, Outlet} from "react-router-dom";
import React,{useState, useEffect} from "react";
export default function RequireAuth() {
    const location= useLocation();
    const [loading , setLoading]= useState(true);
    const [isAuth, setIsAuth]= useState(false);


    useEffect(()=>{
        const checkAuth= async()=>{
            try{
                const response= await fetch("http://localhost:5000/api/check_session",{
                    method: "GET",
                    credentials: "include",
                });
                setIsAuth(response.ok);
            }catch(error){
                setIsAuth(false);
            }finally{
                setLoading(false);
            }
        };
        checkAuth();
    },[]);
    if(loading) {
        return <div>Yükleniyor...</div>;
    }
    if(!isAuth){
        sessionStorage.setItem('redirectPath', location.pathname+ location.search);
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <Outlet />;
}