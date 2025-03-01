// LoginContext.js
import React, { createContext, useState, useContext } from 'react';

const LoginContext = createContext();

export const useLogin = () => {
    return useContext(LoginContext);
};

export const LoginProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <LoginContext.Provider value={{ user, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};
