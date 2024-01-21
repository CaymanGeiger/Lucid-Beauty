"use server"

export async function AdditionalServicesData() {
    const res = await fetch(`${process.env.WEBSITE_URL}/api/additionalservices`);
    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
}
