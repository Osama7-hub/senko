import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/lib/nextAuth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// تعديل إجابة
export async function PUT(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });

    const { id } = params;
    const { content, isOfficial } = await req.json();

    try {
        const updatedAnswer = await prisma.answer.update({
            where: { id },
            data: { content, isOfficial },
        });

        return NextResponse.json(updatedAnswer);
    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء تعديل الإجابة" }, { status: 500 });
    }
}

// حذف إجابة
export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });

    const { id } = params;

    try {
        await prisma.answer.delete({
            where: { id },
        });

        return NextResponse.json({ message: "تم حذف الإجابة بنجاح" });
    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء حذف الإجابة" }, { status: 500 });
    }
}
