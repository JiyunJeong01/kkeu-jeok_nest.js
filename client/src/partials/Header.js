import React from 'react';
import { Link } from "react-router-dom";
import { useLogin } from '../contexts/LoginContext';  // useLogin 훅 임포트
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useLogin();

    const handleLogout = async () => {
        try {
            const response = await fetch('/user/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })

            const result = await response.json();

            if (result.success) {
                logout();
                navigate('/');
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    };

    return (
        <nav className="sticky top-0 z-30 bg-blue pt-[0.5rem] pb-[0.5rem]">
            <div className="container-fluid flex items-center justify-between">
                <Link className="navbar-brand" to="/">
                    <img src="header-logo.png" alt="로고 이미지" className="h-[40px] w-auto" />
                </Link>

                <button className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarTogglerDemo02"
                    aria-controls="navbarTogglerDemo02"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {user && (
                    <form className="max-w-md mx-auto" action="#" method="get">
                        <div className="relative">
                            <input
                                type="text"
                                name="search"
                                className="w-full px-4 py-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="검색어를 입력하세요..."
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 18l6-6-6-6M6 12h12"></path>
                                </svg>
                            </button>
                        </div>
                    </form>
                )}

                <div className="right-text">
                    {user ? (
                        <button className="pr-[40px]" onClick={handleLogout}>로그아웃</button>
                    ) : (
                        <Link className="pr-[40px]" to="/login">로그인</Link>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Header;
