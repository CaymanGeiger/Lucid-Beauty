"use server"
export default async function GetAdditionalServicesData() {
    const res = await fetch('http://back-end-api:8000/api/additionalservices/');
    if (!res.ok) {
        throw new Error('Failed to fetch services');
    }
    return res.json();
}
