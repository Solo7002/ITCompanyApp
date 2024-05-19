import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
const RequireAuth = ({ children }) => {
    const auth = useAuth();
    const token = auth.token;
    if (!token)
        return <Navigate to='/login' />

    return children;

}
export { RequireAuth };
