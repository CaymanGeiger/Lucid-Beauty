"use client"
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';



interface AuthContextType {
    login: (userId?: number, firstName?: string) => void;
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
    const url = process.env.NEXT_PUBLIC_WEBSITE_URL ? process.env.NEXT_PUBLIC_WEBSITE_URL : process.env.NEXT_PUBLIC_WEBSITE_URL;

    const logout = async () => {
        try {
            const response = await fetch(`${url}/api/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setIsLoggedIn(false);
            Cookies.remove('firstName');
            Cookies.remove('userId');
            router.push("/");
        } catch (error) {
            console.error('Logout error:', error);
            Cookies.remove('firstName');
            Cookies.remove('userId');
            setIsLoggedIn(false);
        }
    }


        const verifyToken = useCallback(() => {
            return new Promise<void>(async (resolve, reject) => {
                try {
                    const response = await fetch(`${url}/api/verifytoken`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const data = await response.json();
                    if (response.ok) {
                        setIsLoggedIn(true);
                        console.log("token is valid");
                        resolve();
                        return;
                    } else {
                        logout()
                        console.error('Token verification failed', data.message);
                    }
                } catch (error) {
                    logout();
                    console.error(error);
                    reject(error);
                }
            });
        }, [setIsLoggedIn, logout]);


    useEffect(() => {
        const userIdFromCookie = Cookies.get('userId');
        if (userIdFromCookie) {
            setIsLoggedIn(true);
        }
        if (isLoggedIn) {
            verifyToken();
        }
    }, [isLoggedIn, verifyToken])


    const login = (userId?: number, firstName?: string) => {
        setIsLoggedIn(true);

        if (userId) {
            Cookies.set('userId', userId.toString());
        }
        if (firstName) {
            Cookies.set('firstName', firstName);
        }
    };





    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
