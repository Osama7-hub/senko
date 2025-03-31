import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    const { id } = await params; // استخراج id من المعاملات

    try {
        const answers = await prisma.answer.findMany({
            where: { questionId: id },
            include: {
                votes: true, // جلب جميع التصويتات المرتبطة بالإجابة
                user: true, // جلب بيانات المستخدم لكل إجابة
            },
        });

        // حساب عدد الأصوات الإيجابية والسلبية لكل إجابة
        const formattedAnswers = answers.map(answer => ({
            ...answer,
            upvotes: answer.votes.filter(vote => vote.value === 1).length,
            downvotes: answer.votes.filter(vote => vote.value === -1).length,
        }));

        return NextResponse.json(formattedAnswers, { status: 200 });
    } catch (error) {
        console.error("خطاء في جلب الاجابة", error);
        return NextResponse.json({ error: "فشل في جلب الاجابة" }, { status: 500 });
    }
}

