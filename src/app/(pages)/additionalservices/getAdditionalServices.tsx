"use server"

const url = process.env.NEXT_PUBLIC_WEBSITE_URL ? process.env.NEXT_PUBLIC_WEBSITE_URL : "https://lucid-beauty.vercel.app";
export async function AdditionalServicesData() {
    const res = await fetch(`${url}/api/additionalservices`);
    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
}
