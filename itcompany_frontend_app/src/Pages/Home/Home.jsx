import { useEffect, useState } from "react";
import "./Home.css";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import keys from "../../config/keys";
const Home=()=>{
    const {token}=useAuth();
    const {signOut}=useAuth();
    console.log(token);
       const handlerInfo=()=>{
        if(token){
            try {
                const decoded=jwtDecode(token);
                console.log(decoded);
                
               
            } catch (error) {
                console.log(error);
            }
        }
       }
        
    
    const handlerLoad=()=>{
        console.log('ssas');
        if(token){
        axios.get(`${keys.ServerConnection}/AccessLevel`,{headers:{
            Authorization:`Bearer ${token}`
        }}).then(res=>{
            console.log(res);
        }).catch(err=>{
            if(err.response.status===401)
                signOut();
        })
    }
    }
    return(
        <div className="homeContainer">
            <h1>Home</h1>
            <button className="btn btn-danger" onClick={()=>handlerLoad()}>Load info AccessLevel</button>
            <button className="btn btn-info" onClick={()=>handlerInfo()}>Load info user</button>
        </div>
    )
};

export{Home};