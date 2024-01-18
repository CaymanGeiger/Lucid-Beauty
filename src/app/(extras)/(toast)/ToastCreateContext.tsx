"use client"
import { createContext } from 'react';

type ToastFunction = (message: string, type?: 'default' | 'error' | 'success') => void;

export const ToastContext = createContext<ToastFunction>(() => {});
