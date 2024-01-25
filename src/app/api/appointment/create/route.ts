import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();

        let appointment;
        if (reqBody.accountId) {
            const { accountId, appointmentDate, appointmentTime, service, additionalServices } = reqBody;
            appointment = await prisma.appointment.create({
                data: {
                    appointmentDate: new Date(appointmentDate),
                    appointmentTime: new Date(appointmentTime),
                    serviceId: parseInt(service),
                    accountId: accountId,
                    additionalServices: {
                        connect: additionalServices.map((id: number) => ({ id }))
                    }
                }
            });
        } else {
            const { appointmentDate, appointmentTime, service, guestFirstName, guestLastName, guestEmail, guestPhoneNumber, additionalServices } = reqBody;
            appointment = await prisma.appointment.create({
                data: {
                    appointmentDate: new Date(appointmentDate),
                    appointmentTime: new Date(appointmentTime),
                    serviceId: parseInt(service),
                    guestFirstName: guestFirstName,
                    guestLastName: guestLastName,
                    guestEmail: guestEmail,
                    guestPhoneNumber: guestPhoneNumber,
                    additionalServices: {
                        connect: additionalServices.map((id: number) => ({ id }))
                    }
                }
            });
        }

        return new NextResponse(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Detailed error:", error);
        return new NextResponse(JSON.stringify({ error: 'An error occurred while creating the appointment', details: error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}
