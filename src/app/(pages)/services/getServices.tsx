'use server';

export async function ServicesData() {
    const res = await fetch('http://back-end-api:8000/api/services/');
    if (!res.ok) {
        throw new Error('Failed to fetch services');
    }
    return res.json();
}
