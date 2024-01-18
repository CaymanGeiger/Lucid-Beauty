"use client"
import styles from "./services.module.css"
import Link from "next/link";

type AppointmentButtonProps = {
    service: any
}

const AppointmentButton: React.FC<AppointmentButtonProps> = ({ service }:any) => {

    const handleClick = () => {
        const cartString = localStorage.getItem('cart');
        let currentCart = cartString ? JSON.parse(cartString) : [];
        const isServiceInCart = currentCart.find((item: any) => item.id === service.id);

        if (!isServiceInCart) {
            currentCart.push(service);
            localStorage.setItem('cart', JSON.stringify(currentCart));
            console.log("Adding to cart:", service);
        } else {
            console.log("Service already in cart:", service);
        }
    };

    // `/appointment/service/${service.id}`

    return (
        <div className={styles.appointmentLink}>
            <Link
                onClick={handleClick}
                href={""}
                className={styles.button}>
                Book This Service
                <div className={styles.button__horizontal}></div>
                <div className={styles.button__vertical}></div>
            </Link>
        </div>
    )
}
export default AppointmentButton;
