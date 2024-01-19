'use server';

export async function ServicesData() {
    const res = await fetch('http://localhost:3001/api/services');
    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
}

