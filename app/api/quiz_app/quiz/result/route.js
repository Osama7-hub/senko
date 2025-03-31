import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { userId, score, questionIds } = await req.json();

        const quizSession = await prisma.quizSession.create({
            data: {
                userId,
                score,
                questions: JSON.stringify(questionIds), // تخزين IDs الأسئلة كمصفوفة
            },
        });

        return NextResponse.json({ success: true, quizSession }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'حدث خطأ ما' }, { status: 500 });
    }
}
