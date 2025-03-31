import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// API لإضافة الأسئلة
export async function POST(req) {
    try {
        console.log('Raw request body:', req.body);
        const body = await req.json();
        console.log('Parsed body:', body);

        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: 'البيانات المرسلة غير صالحة' }, { status: 400 });
        }

        const { text, type, categoryName, options, matchingPairs } = body;

        if (!text || !type || !categoryName) {
            return NextResponse.json({ error: 'حقول مطلوبة مفقودة' }, { status: 400 });
        }

        if (!['MULTIPLE_CHOICE', 'MATCHING'].includes(type)) {
            return NextResponse.json({ error: 'نوع السؤال غير صالح' }, { status: 400 });
        }

        // التحقق من وجود الفئة
        const categoryExists = await prisma.category.findUnique({
            where: { name: categoryName },
        });
        if (!categoryExists) {
            return NextResponse.json({ error: 'الفئة غير موجودة' }, { status: 400 });
        }
        
        const quizQuestion = await prisma.quizQuestion.create({
            data: {
                text,
                type,
                categoryName,
                options: type === 'MULTIPLE_CHOICE' ? {
                    create: options?.map(opt => ({
                        text: opt.text,
                        isCorrect: opt.isCorrect,
                    }))
                } : undefined,
                matchingPairs: type === 'MATCHING' ? {
                    create: matchingPairs?.map(pair => ({
                        leftItem: pair.leftItem,
                        rightItem: pair.rightItem,
                    }))
                } : undefined,
            },
        });

        return NextResponse.json({ success: true, quizQuestion }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: 'حدث خطأ ما', details: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// API لجلب الأسئلة عشوائيًا
export async function GET(req) {
    let numOfQuiz = 3;
    try {
        const { searchParams } = new URL(req.url);
        const categoryName = searchParams.get("category");

        if (!categoryName) {
            return NextResponse.json({ error: "يجب تحديد الفئة" }, { status: 400 });
        }

        let multipleChoiceQuestions, matchingQuestions, totalQuizQuestions;

        if (categoryName === "all") {
            multipleChoiceQuestions = await prisma.quizQuestion.findMany({
                where: { type: "MULTIPLE_CHOICE" },
                take: numOfQuiz, // جلب عدد معين من الأسئلة
                orderBy: { createdAt: "desc" },
                include: { options: true },
            });

            matchingQuestions = await prisma.quizQuestion.findMany({
                where: { type: "MATCHING" },
                take: numOfQuiz, // جلب عدد معين من أسئلة المطابقة
                orderBy: { createdAt: "desc" },
                include: { matchingPairs: true },
            });

            // حساب العدد الكلي للأسئلة في جميع الفئات
            totalQuizQuestions = await prisma.quizQuestion.count();

        } else {
            multipleChoiceQuestions = await prisma.quizQuestion.findMany({
                where: { categoryName, type: "MULTIPLE_CHOICE" },
                take: numOfQuiz,
                orderBy: { createdAt: "desc" },
                include: { options: true },
            });

            matchingQuestions = await prisma.quizQuestion.findMany({
                where: { categoryName, type: "MATCHING" },
                take: numOfQuiz,
                orderBy: { createdAt: "desc" },
                include: { matchingPairs: true },
            });

            // حساب العدد الكلي للأسئلة ضمن الفئة المحددة
            totalQuizQuestions = await prisma.quizQuestion.count({
                where: { categoryName },
            });
        }

        // دمج الأسئلة العادية مع أسئلة المطابقة في مصفوفة واحدة
        let allQuestions = [...multipleChoiceQuestions, ...matchingQuestions];

        // خلط الأسئلة عشوائيًا بحيث تظهر بتوزيع مختلف
        allQuestions = shuffleArray(allQuestions);

        return NextResponse.json([
            allQuestions,
            totalQuizQuestions
        ]);
    } catch (error) {
        console.error("⚠️ خطأ في جلب الأسئلة:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// دالة خلط العناصر عشوائيًا باستخدام خوارزمية Fisher-Yates Shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // تبديل أماكن العناصر
    }
    return array;
}


