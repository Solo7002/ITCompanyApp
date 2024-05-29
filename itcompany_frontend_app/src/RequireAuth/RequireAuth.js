import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { tempStorage } from "./tempStorage";
const RequireAuth = ({ children }) => {
    const { setToken }=useAuth();
    const token = tempStorage.getItem('token');
    if (!token)
        return <Navigate to='/login' />

    setToken(token);
    return children;

}
export { RequireAuth };
