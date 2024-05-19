import { useContext } from "react";
import { AuthContext } from "../RequireAuth/AuthProvider";

export function useAuth(){
    return useContext(AuthContext);
}