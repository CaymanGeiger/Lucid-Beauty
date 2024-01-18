"use client"
import { useContext} from 'react';
import { ToastContext } from './ToastCreateContext';

type ToastFunction = (message: string, type?: 'default' | 'error' | 'success') => void;

export const useToast = (): ToastFunction => {
    return useContext(ToastContext);
};
