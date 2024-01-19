"use client"
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import styles from './navbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSpa, faX } from '@fortawesome/free-solid-svg-icons';
import { faMeta, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import useWindowSize from '../(functions)/WindowSize';
import { useAuth } from '../../(auth)/authcontext';
import { useModal } from '../../(accounts)/loginmodal';
import { useDarkModeContext } from '../(darkmode)/useDarkModeContext';
import { useLoading } from '../(loading)/LoadingContext';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export default function Navbar() {
    const { width } = useWindowSize();
    const { isLoggedIn } = useAuth();
    const { toggleIsLoading } = useLoading();
    const { logout } = useAuth();
    const { openModal } = useModal();
    const [menuDisplay, setMenuDisplay] = useState<number>(0)
    const [menuDisplayIndex, setMenuDisplayIndex] = useState<number>(-1)
    const [authChecked, setAuthChecked] = useState(false);
    const [navOpened, setNavOpened] = useState(false)
    const { isDarkMode, toggleDarkMode } = useDarkModeContext();
    const darkModeLogo = isDarkMode ? '/lucidbeautywhite.png' : '/lucidbeautyblack.png';
    const router = useRouter();

    const openMenu = () => {
        setMenuDisplay(1);
        setMenuDisplayIndex(100000);
        setNavOpened(!navOpened);
    };

    const closeMenu = () => {
        setMenuDisplay(0);
        setMenuDisplayIndex(-1);
    };

    const toggleMenu = () => {
        if (menuDisplay === 0) {
            // Menu is currently closed, so open it
            setMenuDisplay(1);
            setMenuDisplayIndex(100000);
        } else {
            // Menu is currently open, so close it
            setMenuDisplay(0);
            setMenuDisplayIndex(-1);
        }

        // Toggle the navOpened state
        setNavOpened(!navOpened);
    };

    const handleButtonClick = () => {
        toggleIsLoading();
    };

    useEffect(() => {
        setAuthChecked(true);
    }, []);



    return (
        <nav className={styles.nav}>
            <div className={styles.account}>
                {authChecked && (
                    <div style={{ display: "flex" }}>
                        {isLoggedIn ? (
                            <button className={styles.logoutButton} onClick={logout}>Logout</button>
                        ) : (
                            <button className={styles.loginButton} onClick={openModal}>Login</button>
                        )}
                        <div className={styles.dotDiv}>
                            <FontAwesomeIcon
                                icon={faSpa}
                                className={`${styles.dot} ${isLoggedIn ? styles.filled : styles.notFilled}`}
                            />
                        </div>
                    </div>
                )}
                {!authChecked && (
                    <h4 style={{ width: "100%", fontSize: "12px" }}>Loading..</h4>
                )}
            </div>
                <div className={styles.logo}>
                    <div className={styles.linkHome} >
                        <Image
                        className={styles.logoImg}
                        src={darkModeLogo}
                        alt="nav bar logo"
                        width={210}
                        height={75}
                        onClick={() => router.push("/")}
                        />
                    </div>
                </div>
            <div
                onClick={toggleMenu}
                className={`${styles["nav-icon3"]} ${navOpened ? styles.open : ''}`}
            >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={styles.mainMenu} style={{ opacity: menuDisplay, zIndex: menuDisplayIndex }}>
                <li>
                    <button onClick={toggleDarkMode} className={styles.darkModebutton}>
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </li>
                <li className={styles.li}>
                    <Link href="/services" onClick={closeMenu} className={styles.link}>Services</Link>
                </li>
                <li className={styles.li}>
                    <Link href="/additional_services" onClick={closeMenu} className={styles.link}>Additional Services </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/appointment" onClick={() => { handleButtonClick(), closeMenu() }} className={styles.link}>Make Appointment</Link>
                </li>
                <li className={styles.li}>
                    <Link href="/myappointments" onClick={closeMenu} className={styles.link}>My Appointments</Link>
                </li>
                <li className={styles.li}>
                    <Link href="/about" onClick={closeMenu} className={styles.link}>About</Link>
                </li>
                {/* <span className={styles.icons}>


                </span> */}
                <ul className={styles.wrapper}>
                    <li className={`${styles.icon} ${styles.facebook}`}>
                        <span className={styles.tooltip}>Facebook</span>
                        <span>
                            <FontAwesomeIcon
                                icon={faMeta}
                                className={styles.mediaIcons}
                            />
                        </span>
                    </li>
                    <li className={`${styles.icon} ${styles.twitter}`}>
                        <span className={styles.tooltip}>Twitter</span>
                        <span>
                            <FontAwesomeIcon
                                icon={faXTwitter}
                                className={styles.mediaIcons}
                            />
                        </span>
                    </li>
                    <li className={`${styles.icon} ${styles.instagram}`}>
                        <span className={styles.tooltip}>
                            Instagram
                        </span>
                        <span>
                            <FontAwesomeIcon
                                icon={faInstagram}
                                className={styles.mediaIcons}
                            />
                        </span>
                    </li>
                </ul>
            </ul>
        </nav>
    );
}
