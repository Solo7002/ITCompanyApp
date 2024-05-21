import { useContext } from "react";
import { AuthContext } from "../RequireAuth/AuthProvider";

export function useAuth(){
    try{
        return useContext(AuthContext);
    }
    catch (e){
        throw e;
    }
}