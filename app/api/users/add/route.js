import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
    const { name, email } = await req.json(); // الحصول على بيانات المستخدم من الطلب

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
            },
        });
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'فشل في انشاء مستخدم جديد' }, { status: 500 });
    }
}
