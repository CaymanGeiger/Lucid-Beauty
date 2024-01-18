"use client";
import React, { useEffect, useState, ReactNode } from 'react';
import { DarkModeContext } from './DarkModeCreateContext';


interface DarkModeProviderProps {
    children: ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const darkModeActive = localStorage.getItem('isDarkMode') === 'true' ? true : false
        setIsDarkMode(darkModeActive);
        const backgroundColor = isDarkMode ? '#333' : 'rgb(240, 239, 239)';
        const backgroundColorPurple = isDarkMode ? '#484848' : '#ede8ee';
        const textColor = isDarkMode ? '#fff' : '#343434';
        const textColorLightBlack = isDarkMode ? '#fff' : 'rgb(54, 54, 54)';
        document.documentElement.style.setProperty('--background-darkmode-purple', backgroundColorPurple);
        document.documentElement.style.setProperty('--background-darkmode', backgroundColor);
        document.documentElement.style.setProperty('--text-color-darkmode', textColor);
        document.documentElement.style.setProperty('--text-color-lightblack-darkmode', textColorLightBlack);

    }, [isDarkMode]);

    const toggleDarkMode = () => {
        localStorage.getItem('isDarkMode') === 'true' ? localStorage.setItem('isDarkMode', 'false') : localStorage.setItem('isDarkMode', 'true');
        setIsDarkMode(prevMode => !prevMode);
    };

    const contextValue = {
        isDarkMode,
        toggleDarkMode,
    };

    return (
        <DarkModeContext.Provider value={contextValue}>
            {children}
        </DarkModeContext.Provider>
    );
};
