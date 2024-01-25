"use client"
import React, { useState, useEffect, Suspense } from 'react';
import styles from './myappointments1.module.css';
import Cookies from 'js-cookie';
import { useModal } from '@/(accounts)/loginmodal';
import dayjs from 'dayjs';
import * as Popover from '@radix-ui/react-popover';
import 'dayjs/locale/en';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useAuth } from '../../(auth)/authcontext';
import Image from 'next/image';

const DeleteMessage = React.lazy(() => import('./DeleteAppointment'));
dayjs.extend(customParseFormat);

function formatDate(dateString: string) {
    return dayjs(dateString).format("dddd, MMMM YYYY");
}

function formatTime(timeString: string) {
    return dayjs(timeString, 'HH:mm:ss').format("h:mm A");
}

type AdditonalOpened = {
    index: string
    opened: boolean
}

const MyAppointments: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const [myAppointments, setMyAppointments] = useState<any>([]);
    const [userId, setUserId] = useState<string>("");
    const [userFirstName, setUserFirstName] = useState<string>("");
    const [currentAdditionalClicked, setCurrentAdditionalClicked] = useState<AdditonalOpened>({ index: "", opened: false });
    const { openModal } = useModal();
    console.log(myAppointments)

    const url = process.env.WEBSITE_URL ? process.env.WEBSITE_URL : process.env.NEXT_PUBLIC_WEBSITE_URL;

    const fetchAppointments = async (userId?: string) => {
        try {
            const response = await fetch(`${url}/api/myappointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
            if (response.ok) {
                const data = await response.json();
                const updatedData = data.appointments.map((appointment: any) => {
                    const totalPriceAdditional = appointment.additionalServices.reduce((acc: any, additional: any) => {
                        return acc + (additional.price);
                    }, 0);
                    const totalPrice = parseFloat(totalPriceAdditional) + parseFloat(appointment.service.price);
                    return { ...appointment, totalPrice };
                });
                setMyAppointments(updatedData);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };



    useEffect(() => {
        const userIdFromCookie = Cookies.get('userId');
        const firstNameFromCookie = Cookies.get('firstName');
        if (userIdFromCookie) {
            fetchAppointments(userIdFromCookie);
            setUserId(userIdFromCookie)
        }
        if (firstNameFromCookie) {
            setUserFirstName(firstNameFromCookie)
        }
    }, []);


    const toggleAdditionalServices = (index: string) => {
        setCurrentAdditionalClicked({ index: index, opened: !currentAdditionalClicked.opened })
    };


    if (!isLoggedIn) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: "40px",
                    height: "300px",
                }}>
                <h1
                    className={styles.loginHeader}
                    style={{ textAlign: "center" }}>
                    Please Log In To View Appointments!
                </h1>
                <button className={styles.loginButtonAppt} onClick={openModal}>
                    Login
                </button>
            </div>
        )
    }
    return (
        <div className={styles.main}>
            <div className={styles.mainChild}>
                <div className={styles.mainChildHeader}>
                    <h1>
                        {userFirstName}&apos;s Appointments
                    </h1>
                </div>
                {myAppointments.map((appointment: any, index: string) => {
                    const totalQuantity = appointment.additionalServices.reduce((acc: any, additional: any) => {
                        return acc + additional.quantity;
                    }, 0);
                    const noLetterS = totalQuantity === 1 ? "Additional Service" : "Additional Services"
                    const formattedDate = formatDate(appointment.appointmentDate)
                    const formattedTime = formatTime(appointment.appointmentTime)
                    return (
                        <div
                            className={styles.myAppointmentDiv}
                            key={appointment.id}
                        >
                            <div className={styles.myAppointmentDivOne}>
                                <div>
                                    <Image
                                        className={styles.myAppointmentPhoto}
                                        src={appointment.service.image}
                                        alt='additonal service image'
                                        width={125}
                                        height={125}
                                    />
                                </div>
                                <div className={styles.myAppointmentDivChildOne}>
                                    <div className={styles.myAppointmentDivChildOneHeaderDiv}>
                                        <h1 className={styles.myAppointmentDivChildOneHeader} >
                                            {appointment.service.name}
                                        </h1>
                                        <h4 className={styles.date}>{formattedDate}</h4>
                                        <h4 className={styles.time}>{formattedTime}</h4>
                                    </div>
                                    <div className={styles.deleteMessage}>
                                        <DeleteMessage
                                        fetchAppointments={fetchAppointments}
                                        appointmentId={appointment}
                                        />
                                    </div>
                                    <div className={styles.PopoverDiv}>
                                        <Popover.Root
                                            open={currentAdditionalClicked.index === index && currentAdditionalClicked.opened === true}
                                            onOpenChange={() => toggleAdditionalServices(index)}>
                                            <Popover.Trigger asChild>
                                                <button className={styles.myAppointmentButton}>
                                                    {currentAdditionalClicked.index === index &&
                                                        currentAdditionalClicked.opened === true ?
                                                        `Hide ${totalQuantity} ${noLetterS}` : `View ${totalQuantity} ${noLetterS}`}
                                                </button>
                                            </Popover.Trigger>
                                            <Popover.Portal>
                                                <Popover.Content className={styles.PopoverContent} sideOffset={5}>
                                                    <table
                                                        id="responsive-table"
                                                        className={`${styles.additonalServicesTable}`}
                                                    >
                                                        <thead>
                                                            <tr className={`${styles.tableText}`}>
                                                                <th>Service</th>
                                                                <th>Price</th>
                                                            </tr>
                                                        </thead>
                                                        {appointment.additionalServices.map((additional: any) => (
                                                            <tbody key={additional.id}>
                                                                <tr className={`${styles.tableText}`}>
                                                                    <td>{additional.name}</td>
                                                                    <td>${additional.price}</td>
                                                                    <td><button className={`${styles.Button} ${styles.red}`}>Remove</button></td>
                                                                </tr>
                                                            </tbody>
                                                        ))}
                                                    </table>
                                                    <Popover.Arrow className={styles.PopoverArrow} />
                                                </Popover.Content>
                                            </Popover.Portal>
                                        </Popover.Root>
                                    </div>
                                    <h5 className={styles.totalPrice}>Total Price: <strong>${appointment.totalPrice}</strong></h5>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
export default MyAppointments;
