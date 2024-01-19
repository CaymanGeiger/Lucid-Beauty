"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCartShopping, faComment } from '@fortawesome/free-solid-svg-icons';
import styles from './appointment.module.css';
const ChatBox = React.lazy(() => import('../(chatbox)/ChatBox'));

const AppointmentCart: React.FC = () => {
    const [cart, setCart] = useState<any[]>([]);
    const [cartOpened, setCartOpened] = useState<boolean>(false);
    const [chatOpened, setChatOpened] = useState<boolean>(false);
    const [chatInitialized, setChatInitialized] = useState<boolean>(false);


    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    const removeFromCart = (productId: any) => {
        const storedCart = localStorage.getItem('cart') || "[]";
        let currentCart = JSON.parse(storedCart);

        currentCart = currentCart.filter((item: any) => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(currentCart));
        setCart(currentCart);
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const openChat = () => {
        setChatOpened(true);
        setChatInitialized(true);
    };

    return (
        <div className={styles.appointmentCart}>
            <div className={`${styles.onScreenDiv} ${cartOpened || chatOpened ? styles.closeScreens : ''}`}>
                <div
                    className={styles.appointmentCartChild}
                    onClick={() => {setChatOpened(true), setChatInitialized(true)}}>
                    <FontAwesomeIcon className={styles.fixedIcons} width={20} height={20} icon={faComment} />
                </div>
                <div
                    className={styles.appointmentCartChild}
                    onClick={() => setCartOpened(true)}>
                    <FontAwesomeIcon className={styles.fixedIcons} width={20} height={20} icon={faCartShopping} />
                </div>
            </div>
            <div className={`${styles.appointmentCartOpened} ${cartOpened ? styles.open : styles.cartClosed}`}>
                <div className={styles.container}>
                    <div
                        onClick={() => { setCartOpened(false), setChatOpened(false) }}
                        className={styles.bg}
                    >
                    </div>
                    <div
                        onClick={() => { setCartOpened(false), setChatOpened(false) }}
                        className={styles.button}
                    >
                        <FontAwesomeIcon
                            className={styles.icon}
                            icon={faAngleDown}
                            onClick={() => { setCartOpened(false), setChatOpened(false) }}
                        />
                    </div>
                </div>
                <div className={cartOpened ? styles.cartHeaderDivOpen : styles.cartHeaderDivClose}>
                    <button
                        className={styles.clearCartButton}
                        onClick={clearCart}>
                        Clear Cart
                    </button>
                    <h2
                        className={styles.cartHeader}>
                        Appointment
                    </h2>
                </div>
                <div className={styles.cartItemsDivParent}>
                    <div className={styles.cartItemsDiv}>
                        <div>
                            <h2 className={styles.cartItemsDivHeaders}>
                                Service
                            </h2>
                        </div>
                        <div className={styles.cartItemsServices}>
                            <div>
                                <h5 className={styles.cartItems}>
                                    Nails
                                </h5>
                                <h5 className={styles.cartItems}>
                                    Lashes
                                </h5>
                            </div>
                            <div>
                                <h5 className={styles.cartItems}>
                                    $64
                                </h5>
                                <h5 className={styles.cartItems}>
                                    $30
                                </h5>
                            </div>
                        </div>
                    </div>
                    <div className={styles.cartItemsDiv}>
                        <div>
                            <h2 className={styles.cartItemsDivHeaders}>
                                Additional
                            </h2>
                        </div>
                        <div className={styles.cartItemsAdditionalServices}>
                            <div>
                                <h5 className={styles.cartItems}>
                                    Warm Towel
                                </h5>
                            </div>
                            <div>
                                <h5 className={styles.cartItems}>
                                    $12
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles.chatOpened} ${chatOpened ? styles.chatOpen : ''}`}>
                <div className={styles.container}>
                    <div
                        onClick={() => setChatOpened(false)}
                        className={styles.bg}
                    >
                    </div>
                    <div
                        onClick={() => setChatOpened(false)}
                        className={styles.button}
                    >
                        <FontAwesomeIcon
                            className={styles.icon}
                            icon={faAngleDown}
                            onClick={() => setChatOpened(false)}
                        />
                    </div>
                </div>
                <div className={chatOpened ? styles.chatDivOpen : styles.chatDivClosed}>
                    <Suspense fallback={<div>Loading...</div>}>
                        {chatInitialized && <ChatBox />}
                    </Suspense>
                </div>
                </div>
            </div>
    )
}
export default AppointmentCart;
