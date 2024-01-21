import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const allAdditonalServices = await prisma.additionalService.findMany();
        return new NextResponse(JSON.stringify(allAdditonalServices), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
