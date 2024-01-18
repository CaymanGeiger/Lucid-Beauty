"use client"
import React, { useState } from 'react';
import styles from "../appointment.module.css"

const WelcomeMessage = ({ onGuestClick, onAccountClick }: any) => {
    const [showMessage, setShowMessage] = useState(true);

    const handleGuestClick = () => {
        setShowMessage(false);
        onGuestClick();
    };

    const handleAccountClick = () => {
        setShowMessage(false);
        onAccountClick();
    };

    return (
        showMessage && (
            <div className={styles.welcomeMessageMainDiv}>
                <div className={styles.welcomeMessageMainChild}>
                    <div className={styles.welcomeMessageMainChildOne}>
                        <h4 className={styles.welcomeMessageMainChildOneHeader}>
                            How would you like to proceed?
                        </h4>
                        <button className={styles.welcomeMessageMainChildOneButtons} onClick={handleGuestClick}>Proceed as Guest</button>
                        <button className={styles.welcomeMessageMainChildOneButtons} onClick={handleAccountClick}>Login/Signup</button>
                    </div>
                    <div>
                        <div className={styles.welcomeMessageMainChildTwo}>
                            <h4 className={styles.welcomeMessageMainChildTwoHeader}>
                                Login or Signup:
                            </h4>
                            <h5 className={styles.welcomeMessageMainChildTwoText}>
                                See Your Appointments In Your Portal!
                            </h5>
                            <h5 className={styles.welcomeMessageMainChildTwoText}>
                                Get Notifications For Deals And New Services!
                            </h5>
                            <h5 className={styles.welcomeMessageMainChildTwoText}>
                                Receive Reminders For Your Appointments!
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default WelcomeMessage;
