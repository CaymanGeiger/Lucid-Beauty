import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';



const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';

export async function POST(request: NextRequest) {
    try {
        // Parse the request body to get credentials
        const reqBody = await request.json();
        const { email, password } = reqBody;

        // Validate credentials
        // ...

        // If valid, create access and refresh tokens
        const accessToken = jwt.sign(
            { userEmail: email },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' } // short expiry for access token
        );

        const refreshToken = jwt.sign(
            { userEmail: email },
            REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' } // longer expiry for refresh token
        );

        // Return both tokens in the response
        const response = new NextResponse(JSON.stringify({ message: "Tokens set in cookies" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        response.headers.append('Set-Cookie', `accessToken=${accessToken}; HttpOnly; Secure; Path=/; SameSite=None; Max-Age=900`);
        response.headers.append('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; SameSite=None; Max-Age=604800`);
        return response;

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}


// export async function GET(request: NextRequest, response: NextResponse) {
//     // Construct and return a NextResponse object
//     return new NextResponse(JSON.stringify({ message: "Hello World" }), {
//         status: 200,
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
// }
