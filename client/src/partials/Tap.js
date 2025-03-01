import React from 'react';
import { NavLink } from 'react-router-dom'; // NavLink를 사용합니다.

const Tap = () => {
    return (
        <nav className="tap nav display-flex flex-col items-center width-[250px] height-[100] border-[#ced4da]">
            <NavLink to="/" 
                className={({ isActive }) => `link display-flex items-center height-[35px] width-[135px] pl-[10px] mt-[10px] rounded-[10px] ${isActive ? 'active' : ''}`}>
                <span className="material-symbols-outlined">home</span> 홈
            </NavLink>
            <NavLink to="/bookmark" 
                className={({ isActive }) => `link display-flex items-center height-[35px] width-[135px] pl-[10px] mt-[10px] rounded-[10px] ${isActive ? 'active' : ''}`}>
                <span className="material-symbols-outlined">kid_star</span> 중요함
            </NavLink>
            <NavLink to="/setting" 
                className={({ isActive }) => `link display-flex items-center height-[35px] width-[135px] pl-[10px] mt-[10px] rounded-[10px] ${isActive ? 'active' : ''}`}>
                <span className="material-symbols-outlined">settings</span> 설정
            </NavLink>
        </nav>
    );
};

export default Tap;
