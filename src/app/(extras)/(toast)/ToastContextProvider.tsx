"use client"
import React, { ReactNode } from 'react';
import { toast, ToastOptions } from 'react-toastify';
import { ToastContext } from './ToastCreateContext';


type ToastProviderProps = {
    children: ReactNode;
};

type ToastFunction = (message: string, type?: 'default' | 'error' | 'success') => void;


export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const triggerToast: ToastFunction = (message, type = "default") => {
        const commonOptions: ToastOptions = {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        };

        switch(type) {
            case "error":
                toast.error(message, commonOptions);
                break;
            case "success":
                toast.success(message, commonOptions);
                break;
            default:
                toast(message);
        }
    };

    return (
        <ToastContext.Provider value={triggerToast}>
            {children}
        </ToastContext.Provider>
    );
};
