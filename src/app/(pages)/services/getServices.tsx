'use server';

export async function ServicesData() {
    const res = await fetch(`${process.env.WEBSITE_URL}/api/services`);
    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
}
