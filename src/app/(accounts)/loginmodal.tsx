"use client"
import React, { createContext, useState, useContext } from 'react';
import LoginPage from './login';
import styles from './accounts.module.css';

const ModalContext = createContext({
    isModalOpen: false,
    openModal: () => {},
    closeModal: () => {},
});


export function useModal() {
    return useContext(ModalContext);
}


function SignInModal({ isModalOpen, closeModal }: any) {
    return (
        <div className={isModalOpen ? `${styles.signInModel} ${styles.show} `: styles.signInModel}>
            <div>
                <LoginPage closeModal={closeModal} />
            </div>
        </div>
    );
}


export function ModalProvider({ children }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
            {children}
            <SignInModal isModalOpen={isModalOpen} closeModal={closeModal} />
        </ModalContext.Provider>
    );
}
