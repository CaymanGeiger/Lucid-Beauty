import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';


function verifyJwt(token: string, secret: string): Promise<any> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) reject(err);
            else resolve(decodedToken);
        });
    });
}

export async function POST(request: NextRequest) {
    try {
        const tokenObject = request.cookies.get('accessToken');
        if (!tokenObject) {
            return new NextResponse(JSON.stringify({ message: 'No token provided' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        const token = typeof tokenObject === 'string' ? tokenObject : tokenObject.value;

        const decoded = await verifyJwt(token, process.env.ACCESS_TOKEN_SECRET as string);

        return new NextResponse(JSON.stringify({ message: 'Token is valid', user: decoded }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return new NextResponse(JSON.stringify({ message: 'Failed to authenticate token', error: error }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        return new NextResponse(JSON.stringify({ message: 'Internal server error', error: error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
