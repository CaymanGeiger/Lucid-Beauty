"use client"
import { useContext } from 'react';
import { DarkModeContext } from './DarkModeCreateContext';

type DarkModeContextType = {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
};


export const useDarkModeContext = (): DarkModeContextType => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error('useDarkModeContext must be used within a DarkModeProvider');
    }
    return context;
};
