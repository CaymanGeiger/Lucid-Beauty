"use client"
import AppointmentPage from '@reuse_appointment/AppointmentPage';
import React, { useEffect } from 'react';
import { useLoading } from '@/(extras)/(loading)/LoadingContext';

const Appointment: React.FC = () => {
    const { toggleIsLoading } = useLoading();

    useEffect(() => {

    }, []);

    return (
        <AppointmentPage />
    );
}
export default Appointment;
