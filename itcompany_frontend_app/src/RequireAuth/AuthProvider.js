import {  createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import  keys from '../config/keys'
export const AuthContext=createContext(null);

export const AuthProvider=({children})=>{
    const navigete=useNavigate();
    const [token,setToken]=useState(null);

    const signIn = async (newUser) => {
        try {
            const res = await axios.post(`${keys.ServerConnection}/Auth/login`, { login: newUser.login, password: newUser.password });
            console.log(res.data.token);
            setToken(res.data.token);
        } catch (err) {
            throw new Error('Login failed');
        }
    };
    
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