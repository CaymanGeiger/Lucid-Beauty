"use client"
import AppointmentPage from '@reuse_appointment/AppointmentPage';
import React, { useEffect } from 'react';
import { useLoading } from '@/(extras)/(loading)/LoadingContext';

type AppointmentParams = {
    type: string;
    id: number;
};

export default function Appointment({ params }: { params: { id: string[] } }) {
    const { toggleIsLoading } = useLoading();

    useEffect(() => {


    }, []);


    const [type, idString] = params.id;
    const transformedParams: AppointmentParams = {
        type,
        id: parseInt(idString)
    };
    const serviceId = transformedParams.id
    const serviceType = transformedParams.type

    return (
        <AppointmentPage serviceId={serviceId} serviceType={serviceType} />
    );
}
