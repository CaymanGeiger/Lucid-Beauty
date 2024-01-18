"use client"
import styles from "../appointment.module.css"

export default function Benefits() {
    return (
        <div className={styles.benefitsMainChildTwo}>
            <div className={styles.benefitsMainChildTwoHeaderDiv}>
                <h4 className={styles.benefitsMainChildTwoHeader}>
                    Login or Signup:
                </h4>
            </div>
            <h5 className={styles.benefitsMainChildTwoText}>
                See Your Appointments In Your Portal!
            </h5>
            <h5 className={styles.benefitsMainChildTwoText}>
                Get Notifications For Deals And New Services!
            </h5>
            <h5 className={styles.benefitsMainChildTwoText}>
                Receive Reminders For Your Appointments!
            </h5>
        </div>
    )
}
