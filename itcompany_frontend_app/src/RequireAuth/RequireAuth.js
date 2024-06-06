import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { tempStorage } from "./tempStorage";
import { jwtDecode } from "jwt-decode";
const RequireAuth = ({ children,allowedRoles }) => {
    const { setToken }=useAuth();
    
    const token = tempStorage.getItem('token');
    
    if (!token)
        return <Navigate to='/login' />

    const decode=jwtDecode(token);
    if(allowedRoles&&!allowedRoles.includes(decode.actort))
        return <Navigate to="/" />;

    setToken(token);
    return children;

}
export { RequireAuth };
