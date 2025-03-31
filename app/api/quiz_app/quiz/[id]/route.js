import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// حذف السؤال
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        await prisma.quizQuestion.delete({ where: { id: id } });
        return NextResponse.json({ message: "تم حذف السؤال بنجاح" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// إنشاء API لجلب بيانات السؤال
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const question = await prisma.quizQuestion.findUnique({
            where: { id },
            include: {
                options: true, // جلب خيارات الاختيار من متعدد
                matchingPairs: true, // جلب بيانات المطابقة بين القائمتين
            },
        });

        if (!question) return NextResponse.json({ error: "السؤال غير موجود" }, { status: 404 });

        return NextResponse.json(question);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// إنشاء API لتحديث السؤال
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const { text, type, categoryName, options, matchingPairs } = await req.json();

        let updateData = { text, type, categoryName };

        if (type === "MULTIPLE_CHOICE") {
            updateData.options = {
                deleteMany: {}, // حذف الخيارات القديمة
                create: options.map((opt) => ({
                    text: opt.text,
                    isCorrect: opt.isCorrect,
                })),
            };
        } else if (type === "MATCHING") {
            updateData.matchingPairs = {
                deleteMany: {}, // حذف الأزواج القديمة
                create: matchingPairs.map((pair) => ({
                    leftItem: pair.leftItem,
                    rightItem: pair.rightItem,
                })),
            };
        }

        const updatedQuestion = await prisma.quizQuestion.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedQuestion);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
