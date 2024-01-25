"use client"
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import styles from './accounts.module.css';
import { useToast } from '@/(extras)/(toast)/useToastContext';
import { useAuth } from "@/(auth)/authcontext"


const LoginPage: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    const [firstNameSignup, setFirstNameSignup] = useState('');
    const [lastNameSignup, setLastNameSignup] = useState('');
    const [emailSignup, setEmailSignup] = useState('');
    const [passwordSignup, setPasswordSignup] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordConfirmationSignup, setPasswordConfirmationSignup] = useState('');
    const { login, logout } = useAuth();
    const [isTyping, setTyping] = useState({
        email: false,
        password: false,
        passwordConfirmation: false,
        firstName: false,
        lastName: false
    });
    const [isLoginVisible, setIsLoginVisible] = useState(true);
    const triggerToast = useToast()
    const url = process.env.WEBSITE_URL ? process.env.WEBSITE_URL : process.env.NEXT_PUBLIC_WEBSITE_URL;


    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        const email = emailLogin
        const password = passwordLogin
        try {
            const response = await fetch(`${url}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const responseData = await response.json();
            const firstName = responseData.firstName
            const userId = responseData.userId
            login(userId, firstName);
            closeModal();
            console.log('Login successful:', response);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        const firstName = firstNameSignup
        const lastName = lastNameSignup
        const email = emailSignup
        const password = passwordSignup
        const passwordConfirmation = passwordConfirmationSignup
        const data = {
            firstName,
            lastName,
            email,
            password,
            passwordConfirmation
        }
        if (password === passwordConfirmation) {
            try {
                const response = await fetch(`${url}/api/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                const responseData = await response.json();
                const userId = responseData.userId
                const firstName = responseData.firstName
                login(userId, firstName);
                closeModal();
                triggerToast(`Welcome, ${firstName}`, "success")
                console.log('Login successful:', response);
            } catch (error) {
                console.error('Login error:', error);
            }
        } else {
            setErrorMessage('Passwords do not match');
        }
    };


    const toggleVisibility = () => {
        setIsLoginVisible(!isLoginVisible);
    };

    const handleFocus = (field: string) => {
        setTyping({ ...isTyping, [field]: true });
    };

    const handleBlur = (field: string) => {
        setTyping({ ...isTyping, [field]: false });
    };

    useEffect(() => {
        setIsLoginVisible(true)
    }, []);

    return (
        <div className={styles.main}>
            <button className={styles.closeButton} onClick={closeModal}>X</button>
            <div className={isLoginVisible ? styles.login : styles.loginShow}>
                <form className={styles.loginForm} onSubmit={handleLogin}>
                    <h3 className={styles.toggleButtonLogin}>Login</h3>
                    <div className={styles.inputContainer}>
                        <label htmlFor="email" className="hidden-label">Email</label>
                        <input
                            className={styles.input}
                            onFocus={() => handleFocus('email')}
                            onBlur={() => handleBlur('email')}
                            value={emailLogin}
                            onChange={(e) => setEmailLogin(e.target.value)}
                            type="email" name="email" id="email"
                            placeholder="Email"
                            required
                        />
                        {emailLogin && isTyping.email && <span className={styles.tooltip}>Email</span>}
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="password" className="hidden-label">Password</label>
                        <input
                            className={styles.input}
                            onFocus={() => handleFocus('password')}
                            onBlur={() => handleBlur('password')}
                            value={passwordLogin}
                            onChange={(e) => setPasswordLogin(e.target.value)}
                            type="password" name="password" id="password"
                            placeholder="Password"
                            required
                        />
                        {passwordLogin && isTyping.password && <span className={styles.tooltip}>Password</span>}
                    </div>
                    <button type="submit" className={styles.button}>Submit</button>
                </form>
            </div>

            <div className={isLoginVisible ? styles.signup : styles.signupShow}>
                <form className={styles.signupForm} onSubmit={handleSignup}>
                    <h3 onClick={toggleVisibility} className={styles.toggleButtonSignup}>Signup</h3>
                    <div className={styles.firstAndLastNameDiv}>
                        <div className={styles.inputContainer}>
                            <label htmlFor="firstName" className="hidden-label">First Name</label>
                            <input
                                className={styles.inputName}
                                onFocus={() => handleFocus('firstName')}
                                onBlur={() => handleBlur('firstName')}
                                value={firstNameSignup}
                                onChange={(e) => setFirstNameSignup(e.target.value)}
                                type="text" name="firstName" id="firstName"
                                placeholder="First Name"
                                required
                            />
                            {firstNameSignup && isTyping.firstName && <span className={styles.tooltipSignup}>First Name</span>}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="lastName" className="hidden-label">Last Name</label>
                            <input
                                className={styles.inputName}
                                onFocus={() => handleFocus('lastName')}
                                onBlur={() => handleBlur('lastName')}
                                value={lastNameSignup}
                                onChange={(e) => setLastNameSignup(e.target.value)}
                                type="text" name="lastName" id="lastName"
                                placeholder="Last Name"
                                required
                            />
                            {lastNameSignup && isTyping.lastName && <span className={styles.tooltipSignup}>Last Name</span>}
                        </div>
                    </div>
                    <div className={styles.emailDiv}>
                        <div className={styles.inputContainer}>
                            <label htmlFor="username" className="hidden-label">Email</label>
                            <input
                                className={styles.inputEmail}
                                onFocus={() => handleFocus('email')}
                                onBlur={() => handleBlur('email')}
                                value={emailSignup}
                                onChange={(e) => setEmailSignup(e.target.value)}
                                type="email" name="username" id="username"
                                placeholder="Email"
                                required
                            />
                            {emailSignup && isTyping.email && <span className={styles.tooltipSignup}>Email</span>}
                        </div>
                    </div>
                    <div className={styles.passwordAndConfirmDiv}>
                        <div className={styles.inputContainer}>
                            <label htmlFor="passwordSignup" className="hidden-label">Password</label>
                            <input
                                className={styles.inputPassword}
                                onFocus={() => handleFocus('password')}
                                onBlur={() => handleBlur('password')}
                                value={passwordSignup}
                                onChange={(e) => setPasswordSignup(e.target.value)}
                                type="password" name="password" id="passwordSignup"
                                placeholder="Password"
                                required
                            />
                            {passwordSignup && isTyping.password && <span className={styles.tooltipSignup}>Password</span>}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="passwordConfirmation" className="hidden-label">Confirm Password</label>
                            <input
                                className={styles.inputPassword}
                                onFocus={() => handleFocus('passwordConfirmation')}
                                onBlur={() => handleBlur('passwordConfirmation')}
                                value={passwordConfirmationSignup}
                                onChange={(e) => setPasswordConfirmationSignup(e.target.value)}
                                type="password" name="passwordConfirmation" id="passwordConfirmation"
                                placeholder="Confirm Password"
                                required
                            />
                            {passwordConfirmationSignup && isTyping.passwordConfirmation && <span className={styles.tooltipSignup}>Confirm</span>}
                        </div>
                        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                    </div>
                    <button type="submit" className={styles.button}>Submit</button>
                </form>
            </div>
        </div>
    );
}
export default LoginPage
