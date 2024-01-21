"use client"
import { AdditionalServicesData } from "./getAdditionalServices"
import styles from "../services/services.module.css"
import styles2 from '../../page.module.css'
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLoading } from '@/(extras)/(loading)/LoadingContext';
import Image from 'next/image';

export default function ServicesPage() {
    const [additionalServicesData, setAdditionalServicesData] = useState<any>([]);
    const { toggleIsLoading } = useLoading();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await AdditionalServicesData();
                setAdditionalServicesData(data);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={styles.mainDiv}>
            {additionalServicesData.map((service: any) => {
                return (
                    <div className={styles.mainChild} key={service.id}>
                        <div className={styles.homeTopPhotoDiv} >
                            <Image
                            className={styles.servicePhoto}
                            src={service.image}
                            alt="service image"
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
                            <div className={styles.appointmentLink}>
                                <Link href={`/appointment/additional_service/${service.id}`} className={styles.button}>
                                    Book This Service
                                    <div className={styles.button__horizontal}></div>
                                    <div className={styles.button__vertical}></div>
                                </Link>
                            </div>
                        </div>
                        <hr className={styles2.styleEight}></hr>
                    </div>
                )
            })}
        </div>
    );
}
