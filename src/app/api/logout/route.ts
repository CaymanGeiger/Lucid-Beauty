import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
    try {
        // Create a response
        const response = new NextResponse(null, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Set cookies to expire in the past, effectively deleting them
        response.headers.append('Set-Cookie', 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure');
        response.headers.append('Set-Cookie', 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure');

        // Send the response
        return response;
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}
