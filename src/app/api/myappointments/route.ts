import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';


export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { userId } = reqBody;

        const appointments = await prisma.appointment.findMany({
            where: {
                accountId: parseInt(userId)
            },
            include: {
                service: true,
                additionalServices: true,
            }
        });

        const response = new NextResponse(JSON.stringify({
            message: "User appointments fetched successfully",
            appointments: appointments
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

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
