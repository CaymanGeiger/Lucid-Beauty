"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';
import "./load.css"


type LoadingContextType = {
    isLoading: boolean;
    toggleIsLoading: () => void;
};


const defaultContextValue: LoadingContextType = {
    isLoading: false,
    toggleIsLoading: () => {},
};

const LoadingContext = createContext<LoadingContextType>(defaultContextValue);


export const useLoading = () => useContext(LoadingContext);


interface LoadingProviderProps {
    children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toggleIsLoading = () => {
        // setIsLoading(prevMode => !prevMode);
    };

    return (
        <LoadingContext.Provider value={{ isLoading, toggleIsLoading }}>
            {isLoading && (
                <div className="loadingio-spinner-spin-jowxixoccyp"><div className="ldio-acpkmkk0guo">
                    <div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div>
                </div></div>

            )}
            {children}
        </LoadingContext.Provider>
    );
};
