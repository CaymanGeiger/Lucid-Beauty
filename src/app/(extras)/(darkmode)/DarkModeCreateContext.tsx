"use client"
import { createContext } from 'react';

interface DarkModeContextProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export const DarkModeContext = createContext<DarkModeContextProps>({
    isDarkMode: false,
    toggleDarkMode: () => { },
});
