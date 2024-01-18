"use client"
import { ServicesData } from './getServices';
import styles from "./services.module.css"
import Link from "next/link";
import styles2 from '@/page.module.css'
import AppointmentButton from "./AppointmentButton";
import React, { useEffect, useState } from "react";
import Image from 'next/image';

const ServicesPage: React.FC = () => {
    const [servicesData, setServicesData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ServicesData();
                setServicesData(data);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchData();
    }, []);


    return (
        <div className={styles.mainDiv}>
            {servicesData.map((service: any) => {
                return (
                    <div key={service.id}>
                    <div className={styles.mainChild}>
                        <div className={styles.homeTopPhotoDiv} >
                            <Image
                            className={styles.servicePhoto}
                            src={`http://localhost:8080${service.image}`}
                            alt='service image'
                            width={250}
                            height={300}
                            />
                        </div>
                        <div className={styles.serviceInfoDiv}>
                            <p className={styles.name}>{service.name}</p>
                            <div className={styles.descriptionDiv}>
                                <h5 className={styles.descriptionTitle}>
                                    Description:
                                </h5>
                                <p className={styles.description}>{service.description}</p>
                            </div>
                                <AppointmentButton service={service} />
                        </div>
                    </div>
                    <hr className={styles2.styleEight}></hr>
                    </div>
                )
            })}
        </div>
    );
}

export default ServicesPage;
