import {  createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import  keys from '../config/keys'
export const AuthContext=createContext(null);

export const AuthProvider=({children})=>{
    const navigete=useNavigate();
    const [token,setToken]=useState(null);

    const signIn=(newUser)=>{
        axios.post(`${keys.ServerConnection}/Auth/login`,{login:newUser.login,password:newUser.password}).then(res=>{
            console.log(res.data.token);
            setToken(res.data.token);
            navigete('/');
        }).catch(err=>console.log(err));
    }
    const signOut=()=>{
        setToken(null);
        navigete('/login');
    }
    const value={token,signIn,signOut};

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}