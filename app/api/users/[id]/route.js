import { getServerSession } from "next-auth";
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    // استخراج معرف السؤال من الـ params
    const { id: userId } = await params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء عرض بيانات المستخدم" }, { status: 500 });
    }
}
