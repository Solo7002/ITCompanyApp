import { Outlet } from "react-router-dom";
import Sidebar from '../../../Components/UI/Sidebar/Sidebar.js';
import './MainLayout.css';


const MainLayout = () => {
    return (
        <div>
            <div>
                <Sidebar />
            </div>
            <div className="main-container">
                <Outlet />
            </div>
            <div>
                footer
            </div>
        </div>
    );
}

export {MainLayout};