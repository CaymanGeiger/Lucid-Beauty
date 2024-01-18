"use client"
import styles from "./services.module.css"
export default function Error() {
    return (
        <div className={styles.errorMainDiv}>
            There was an error fetching the data
        </div>
    )
}
