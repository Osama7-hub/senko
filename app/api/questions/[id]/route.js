import { getServerSession } from "next-auth";
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/lib/nextAuth";

const prisma = new PrismaClient();

export const revalidate = 60;

export async function GET(req, { params }) {
    const { id: questionId } = await params;

    try {
        const question = await prisma.question.findUnique({
            where: { id: questionId },
            include: {
                answers: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        isOfficial: true,
                        user: { select: { name: true, image: true } },
                        votes: { select: { value: true } },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!question) {
            return NextResponse.json({ error: "السؤال غير موجود" }, { status: 404 });
        }

        const formattedAnswers = question.answers.map((answer) => ({
            ...answer,
            upvotes: answer.votes.filter((vote) => vote.value === 1).length,
            downvotes: answer.votes.filter((vote) => vote.value === -1).length,
        }));

        return NextResponse.json({ ...question, answers: formattedAnswers }, { status: 200 });
    } catch (error) {
        console.error("خطأ في جلب السؤال:", error);
        return NextResponse.json({ error: "حدث خطأ أثناء جلب السؤال" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// تعـــــــــــديل السؤال
export async function PUT(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin")
        return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });

    const { id } = params;
    const { title, content, category } = await req.json();

    if (!title || !content || !Array.isArray(category) || category.length === 0) {
        return NextResponse.json({ error: "يرجى ملء جميع الحقول" }, { status: 400 });
    }

    try {
        // جلب جميع الفئات الموجودة مسبقًا
        const existingQuestions = await prisma.question.findMany({
            select: { category: true },
        });
        const existingCategories = [...new Set(existingQuestions.flatMap(q => q.category))];

        // التحقق من الفئات الجديدة وإضافتها إذا لم تكن موجودة
        const categoriesToAdd = category.filter(cat => !existingCategories.includes(cat));
        const finalCategories = [...existingCategories, ...categoriesToAdd];

        // تحديث السؤال
        const updatedQuestion = await prisma.question.update({
            where: { id },
            data: { title, content, category },
        });

        return NextResponse.json(updatedQuestion);
    } catch (error) {
        console.error("Error updating question:", error);
        return NextResponse.json({ error: "حدث خطأ أثناء تعديل السؤال" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// حـــــــذف الســـــؤال
export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });

    const { id } = await params;

    try {
        // حذف جميع الإجابات المرتبطة بالسؤال
        await prisma.answer.deleteMany({
            where: { questionId: id },
        });

        // حذف السؤال
        await prisma.question.delete({
            where: { id },
        });

        return NextResponse.json({ message: "تم حذف السؤال وجميع الإجابات المرتبطة به" });
    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء حذف السؤال" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
