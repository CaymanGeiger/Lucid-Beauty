"use client"
import GetAdditionalServicesData from "./getAdditionalServices"
import styles from "../services/services.module.css"
import styles2 from '../../page.module.css'
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLoading } from '@/(extras)/(loading)/LoadingContext';


export default function ServicesPage() {
    const [additionalServicesData, setAdditionalServicesData] = useState<any>([]);
    const { toggleIsLoading } = useLoading();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetAdditionalServicesData();
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
                    <>
                        <div className={styles.mainChild} key={service.id}>
                            <div className={styles.homeTopPhotoDiv} >
                                <img className={styles.servicePhoto} src={`http://localhost:8080${service.image}`} alt="service image"/>
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
                        </div>
                        <hr className={styles2.styleEight}></hr>
                    </>
                )
            })}
        </div>
    );
}
