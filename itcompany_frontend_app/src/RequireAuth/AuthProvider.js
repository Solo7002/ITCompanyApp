import {  createContext, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import  keys from '../config/keys'
import { tempStorage } from "./tempStorage";
export const AuthContext=createContext(null);

export const AuthProvider=({children})=>{
    const navigete=useNavigate();
    const [token, setToken] = useState(() => tempStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            tempStorage.setItem('token',token,1000*60*120);
        } else {
            tempStorage.removeItem('token');
        }
    }, [token]);

    const signIn = async (newUser) => {
        try {
           
            const res = await axios.post(`${keys.ServerConnection}/Auth/login`, { login: newUser.login, password: newUser.password });
            tempStorage.setItem('token',res.data.token,1000*60*120);
            setToken(res.data.token);
        } catch (err) {
            throw new Error('Login failed');
        }
    };
    const signOut=()=>{
        setToken(null);
        tempStorage.removeItem('token');
        navigete('/login');
    }
    const value={token,signIn,signOut,setToken };

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}