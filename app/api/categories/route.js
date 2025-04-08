import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // جلب جميع الأسئلة
        // const questions = await prisma.question.findMany({
        //     select: {
        //         category: true, // جلب حقل الفئات فقط
        //     },
        // });

        // جلب جميع الأسئلة
        const questions = await prisma.question.findMany({
            select: { category: true },
        });

        const categoryMap = new Map();

        questions.forEach((q) => {
            q.category.forEach((cat) => {
                categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
            });
        });

        const result = [...categoryMap.entries()].map(([name, count]) => ({ name, count }));

        // استخراج الفئات الفريدة في مصفوفة واحدة 
        // const uniqueCategories = [...new Set(questions.flatMap((q) => q.category))];
        
        return NextResponse.json(result, { status: 200 });


        // return NextResponse.json(uniqueCategories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء جلب الفئات" }, { status: 500 });
    }
}
