"use client"
import Select from 'react-select';
import styles from "../appointment.module.css"
import React, { useState, useEffect } from 'react';


interface Service {
    id: number;
    name: string;
    price: number;
}

interface OnServiceChangeProps {
    onServiceChange: (event: { target: { name: string; value: any; price: any; } }) => void;
    serviceId?: number;
    serviceType?: string;
    isMissing?: boolean;
}

const ServiceSelect: React.FC<OnServiceChangeProps> = ({ onServiceChange, serviceId, serviceType, isMissing }) => {
    const [service, setService] = useState<Service[]>([]);
    const [selectedOption, setSelectedOption] = useState<any>(null);




    useEffect(() => {
        const fetchServices = async () => {
            const response = await fetch('http://localhost:8080/api/services/');
            if (response.ok) {
                const data = await response.json();
                const formattedServices = data.map((service: Service) => ({
                    value: service,
                    label: service.name,
                    price: service.price
                }));
                setService(formattedServices);
                if (serviceType === "service") {
                    const selectedService = formattedServices.find((service: any) => service.value.id === serviceId);
                    if (selectedService) {
                        setSelectedOption(selectedService);
                    }
                }
            }
        }
        fetchServices();
    }, [serviceId, serviceType]) 


    if (selectedOption) {

    }
    const handleChange = (selectedOption: any) => {
        setSelectedOption(selectedOption);
        const event = {
            target: {
                name: "service",
                value: selectedOption,
                price: selectedOption
            }
        };
        onServiceChange(event);
    };



    return (
        <div className={styles.selectDiv}>
            <label className={styles.selectLabel} htmlFor="Service">
                Service
            </label>
            <Select
                className={`${styles.select} ${isMissing && !selectedOption ? styles.errorBorder : ""}`}
                name="service"
                options={service}
                onChange={handleChange}
                value={selectedOption}
                placeholder="Select One"
                isClearable
            />
        </div>
    )
}

export default ServiceSelect;
