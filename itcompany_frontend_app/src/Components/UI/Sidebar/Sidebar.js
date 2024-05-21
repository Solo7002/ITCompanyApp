import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "../../../hooks/useAuth";

const Sidebar = () => {

    const [isOpened, setIsOpened] = useState(false);
    const { signOut } = useAuth();

    const ChangePropertiesOfSidebar = () => {
        let sideBar = document.querySelector(".sidebar");
        let sideBarMainChildren = Array.from(document.querySelector('.sidebar-main-div').children);
        let headerSpan = document.querySelector(".header-span");
        let headerI = document.querySelector(".header-i");
        let divFog = document.getElementById("div-fogging");

        console.log("let");

        sideBar.style.left = isOpened? '-170px' : '0px';
        sideBarMainChildren.forEach(el => {
            el.firstElementChild.firstElementChild.style.left = isOpened? '178px' : '0px';
        });
        headerSpan.style.opacity = isOpened? '0': '1';
        headerI.classList.toggle("fa-angle-right");
        headerI.classList.toggle("fa-angle-left");
        headerI.style.left = isOpened? '200px': '-50px';
        divFog.style.zIndex = isOpened? '-1' : '100';
        divFog.style.opacity = isOpened? '0' : '0.5';

        setIsOpened(!isOpened);
    }

    const signOutHandler = () => {
        let divFog = document.getElementById("div-fogging");
        divFog.style.zIndex = '-1';
        divFog.style.opacity = '0';
        signOut();
    }
    
    return (
        <div>
            <nav className="sidebar" onMouseEnter={ChangePropertiesOfSidebar} onMouseLeave={ChangePropertiesOfSidebar}>
                <header>
                    <span className="header-span">IT Company Software</span>
                    <i className="fa-solid fa-angle-right header-i"></i>
                </header>
                <br/>
                <br/>
                <div className="sidebar-main-div">
                    <NavLink to="/"><div><i className="fa-solid fa-house"></i> <span>Home</span></div></NavLink>
                    <NavLink to="/profile"><div><i className="fa-solid fa-address-card"></i> <span>Profile</span></div></NavLink>
                    <NavLink to="/tasks"><div><i className="fa-solid fa-list-check"></i> <span>Tasks</span></div></NavLink>
                    <NavLink to="/projects"><div><i className="fa-solid fa-diagram-project"></i> <span>Projects</span></div></NavLink>
                    <NavLink to="/employees"><div><i className="fa-solid fa-users-gear"></i> <span>Employees</span></div></NavLink>
                    <NavLink to="/depsjobs"><div><i className="fa-solid fa-layer-group"></i> <span>Deps/Jobs</span></div></NavLink>
                    <NavLink to="/financies"><div><i className="fa-solid fa-money-bill-transfer"></i> <span>Finances</span></div></NavLink>
                    <NavLink to="/feedbacks"><div><i className="fa-solid fa-comments"></i> <span>Feedbacks</span></div></NavLink>
                    <NavLink to="/settings"><div><i className="fa-solid fa-gear"></i> <span>Settings</span></div></NavLink>
                </div>
                <br />
                <footer>
                    <NavLink href="/login" onClick={() => signOutHandler()}><div><span>Log out</span><i className="fa-solid fa-right-from-bracket"></i></div></NavLink>
                </footer>
            </nav>
        </div>
    );
}

export default Sidebar;



