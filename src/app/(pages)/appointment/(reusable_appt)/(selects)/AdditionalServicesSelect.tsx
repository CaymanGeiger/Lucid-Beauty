"use client"
import Select from 'react-select';
import styles from "../appointment.module.css"
import React, { useState, useEffect } from 'react';



interface AdditionalService {
    id?: number;
    name: string;
    price?: number;
}

interface AdditionalServiceSelectProps {
    onAdditionalServiceChange: (e: any) => void;
    serviceId?: number;
    serviceType?: string;
}


const AdditionalServicesSelect: React.FC<AdditionalServiceSelectProps> = ({ onAdditionalServiceChange, serviceId, serviceType }) => {
    const [services, setServices] = useState<AdditionalService[]>([]);
    const [selectedOption, setSelectedOption] = useState<any[]>([]);

    const noneOption = {
        value: 0,
        label: "None",
    };

    const fetchServices = async () => {
        const response = await fetch('http://localhost:8080/api/additionalservices/');
        if (response.ok) {
            const data = await response.json();
            const formattedServices = data.map((service: AdditionalService) => ({
                value: service,
                label: service.name,
            }));
            setServices([noneOption, ...formattedServices]);
            if (serviceType === "additional_service") {
                const selectedService = formattedServices.find((service: any) => service.value.id === serviceId);
                if (selectedService) {
                    setSelectedOption([selectedService]);
                }
            }
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])



    const handleChange = (selectedOption:any) => {
        setSelectedOption(selectedOption);
        const event = {
            target: {
                name: "additional_services",
                value: selectedOption || [],
                price: selectedOption.price
            }
        };
        onAdditionalServiceChange(event);
    };


    return (
        <div className={styles.selectDiv}>
            <label
                className={styles.selectLabel}
                htmlFor="additionalServiceDropdown"
            >
                Additional Services
            </label>
            <Select
                id="additionalServiceDropdown"
                isMulti
                options={services}
                className={styles.select}
                onChange={handleChange}
                value={selectedOption}
                closeMenuOnSelect={false}
                placeholder="Select services..."
            />
        </div>
    )
}

export default AdditionalServicesSelect;
