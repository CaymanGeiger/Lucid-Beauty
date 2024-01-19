import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const verifyJwt = promisify(jwt.verify);

export async function POST(request: NextRequest) {
    try {
        // Extract the token from the request headers or cookies
        const tokenObject = request.cookies.get('accessToken');
        if (!tokenObject) {
            return new NextResponse(JSON.stringify({ message: 'No token provided' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Ensure the tokenObject.value is a string
        const token = typeof tokenObject === 'string' ? tokenObject : tokenObject.value;

        // Verify the token
        const decoded = await verifyJwt(token, process.env.ACCESS_TOKEN_SECRET as string);

        // Token is valid, respond with success
        return new NextResponse(JSON.stringify({ message: 'Token is valid', user: decoded }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        // Handle token verification errors
        if (error instanceof jwt.JsonWebTokenError) {
            return new NextResponse(JSON.stringify({ message: 'Failed to authenticate token', error: error }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Handle other errors
        return new NextResponse(JSON.stringify({ message: 'Internal server error', error: error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
