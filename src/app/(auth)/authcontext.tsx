"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';



interface AuthContextType {
    login: (userId?: number, userFirstName?: string) => void;
    logout: () => void;
    isLoggedIn?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    async function verifyToken() {
        const response = await fetch('http://localhost:8080/api/token/verify/', {
            method: 'GET',
            credentials: "include",
        });
        if (response.ok) {
            console.log("token is valid");
            return;
        } if (response.status <= 500 && isLoggedIn) {
            logout();
        } if (!response.ok && isLoggedIn) {
            const refreshToken = Cookies.get('refresh_token');
            if (refreshToken) {
                const refreshResponse = await fetch('http://localhost:8080/api/token/refresh/', {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh: refreshToken }),
                });
                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    Cookies.set('access_token', data.access);
                    return;
                }
                logout();
            }
        }
    }


    useEffect(() => {
        const userIdFromCookie = Cookies.get('user_id');
        if (userIdFromCookie) {
            setIsLoggedIn(true);
        }
        if (isLoggedIn) {
            verifyToken();
        }
    }, [isLoggedIn, verifyToken])

    const login = (userId?: number, userFirstName?: string) => {
        setIsLoggedIn(true);

        if (userId) {
            Cookies.set('user_id', userId.toString());
        }
        if (userFirstName) {
            Cookies.set('user_first_name', userFirstName);
        }
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:8080/api/account/logout/', {
                method: 'POST',
                credentials: 'include',
            });

            setIsLoggedIn(false);
            Cookies.remove('user_first_name');
            Cookies.remove('user_id');
            router.push("/");
        } catch (error) {
            console.error('Logout error:', error);
            Cookies.remove('user_first_name');
            Cookies.remove('user_id');
            Cookies.remove('refresh_token');
            Cookies.remove('access_token');
            Cookies.remove('csrftoken');
            Cookies.remove('sessionid');
            setIsLoggedIn(false);
        }
    };



    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
