import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;


        const user = await prisma.account.findUnique({
            where: {
                email: email
            }
        });
        const userId = user?.id;
        const firstName = user?.firstName;

        if (!user) {
            return new NextResponse(JSON.stringify({ error: 'Invalid email credentials' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return new NextResponse(JSON.stringify({ error: 'Invalid password credentials' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const accessToken = jwt.sign(
            { userEmail: email },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '60m' }
        );

        const refreshToken = jwt.sign(
            { userEmail: email },
            REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        const response = new NextResponse(JSON.stringify({
            message: "User authenticated successfully",
            userId: userId,
            firstName: firstName
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        response.headers.append('Set-Cookie', `accessToken=${accessToken}; HttpOnly; Secure; Path=/; SameSite=None; Max-Age=900`);
        response.headers.append('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; SameSite=None; Max-Age=604800`);
        return response;

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error }), {
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
