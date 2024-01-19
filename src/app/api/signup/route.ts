import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { firstName, lastName, email, password } = reqBody;

        try {
            const existingUser = await prisma.account.findUnique({
                where: {
                    email: email,
                },
            });

            if (existingUser) {
                return new NextResponse(JSON.stringify({ error: 'User already exists' }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {
            return new NextResponse(JSON.stringify({ error: 'User existence check failed' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        let hashedPassword;
        try {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        } catch (error) {
            return new NextResponse(JSON.stringify({ error: 'Password hashing failed' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        let newUserId;
        try {
            const newUser = await prisma.account.create({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashedPassword,
                },
            });
            newUserId = newUser.id;
        } catch (error) {
            return new NextResponse(JSON.stringify({ error: 'Account creation failed' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        let accessToken, refreshToken;
        try {
            accessToken = jwt.sign(
                { userEmail: email },
                ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            refreshToken = jwt.sign(
                { userEmail: email },
                REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
        } catch (error) {
            return new NextResponse(JSON.stringify({ error: 'Token generation failed' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        const response = new NextResponse(JSON.stringify({
            message: "User authenticated successfully",
            userId: newUserId,
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
        console.error('Error details:', error);
        return new NextResponse(JSON.stringify({ error: 'Unknown error occurred', details: error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
