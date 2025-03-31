import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // جلب جميع الأسئلة
        const questions = await prisma.question.findMany({
            select: {
                category: true, // جلب حقل الفئات فقط
            },
        });

        // استخراج الفئات الفريدة في مصفوفة واحدة 
        const uniqueCategories = [...new Set(questions.flatMap((q) => q.category))];

        return NextResponse.json(uniqueCategories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء جلب الفئات" }, { status: 500 });
    }
}