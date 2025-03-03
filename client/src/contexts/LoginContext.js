import React, { createContext, useState, useContext, useEffect } from 'react';

const LoginContext = createContext();

export const useLogin = () => {
    return useContext(LoginContext);
};

// 새로고침 후에도 사용자 정보가 남아있게 하기 위해 로컬 스토리지 사용
export const LoginProvider = ({ children }) => {
    const savedUser = localStorage.getItem('user');
    const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    useEffect(() => {
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <LoginContext.Provider value={{ user, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};
