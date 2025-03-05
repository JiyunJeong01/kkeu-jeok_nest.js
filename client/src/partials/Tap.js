import React from 'react';
import { NavLink } from 'react-router-dom'; // NavLink를 사용합니다.

const Tap = () => {
    return (
        <nav className="fixed left-0 top-[66px] z-20 flex flex-col items-center w-[250px] h-[100vh] border-1 border-[#ced4da]">
            <NavLink to="/" 
                className={({ isActive }) => `hover:bg-[#EAEAEA] hover:text-black flex items-center h-[35px] w-[135px] pl-[10px] mt-[10px] rounded-[10px] ${isActive ? 'bg-[#D7F1FF] text-[#09A7FF]' : 'text-black'}`}>
                <span className="material-symbols-outlined">home</span> 홈
            </NavLink>
            <NavLink to="/bookmark" 
                className={({ isActive }) => `hover:bg-[#EAEAEA] hover:text-black flex items-center h-[35px] w-[135px] pl-[10px] mt-[10px] rounded-[10px] ${isActive ? 'bg-[#D7F1FF] text-[#09A7FF]' : 'text-black'}`}>
                <span className="material-symbols-outlined">kid_star</span> 중요함
            </NavLink>
            <NavLink to="/setting" 
                className={({ isActive }) => `hover:bg-[#EAEAEA] hover:text-black flex items-center h-[35px] w-[135px] pl-[10px] mt-[10px] rounded-[10px] ${isActive ? 'bg-[#D7F1FF] text-[#09A7FF]' : 'text-black'}`}>
                <span className="material-symbols-outlined">settings</span> 설정
            </NavLink>
        </nav>
    );
};

export default Tap;
