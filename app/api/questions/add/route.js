import { authOptions } from '@/app/lib/nextAuth';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") 
        return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });

    const { title, content, category } = await req.json(); // الحصول على بيانات السؤال من الطلب

    if (!title || !content || !Array.isArray(category) || category.length === 0) {
        return NextResponse.json({ error: "يرجى ملء جميع الحقول" }, { status: 400 });
    }

    try {
        // جلب جميع الفئات الموجودة مسبقًا من جدول الأسئلة
        const existingQuestions = await prisma.question.findMany({
            select: {
                category: true,
            },
        });

        // استخراج جميع الفئات الفريدة الموجودة
        const existingCategories = [...new Set(existingQuestions.flatMap(q => q.category))];

        // التحقق من الفئات الجديدة وإضافتها إذا لم تكن موجودة
        const categoriesToAdd = category.filter(cat => !existingCategories.includes(cat));
        const finalCategories = [...existingCategories, ...categoriesToAdd];

        // إنشاء السؤال مع الفئات (الموجودة والجديدة)
        const question = await prisma.question.create({
            data: {
                title,
                content,
                category, // يتم إضافة الفئات كما هي (موجودة أو جديدة)
            },
        });

        return NextResponse.json(question, { status: 201 });
    } catch (error) {
        console.error("خطأ أثناء إضافة السؤال:", error);
        return NextResponse.json({ error: 'حدث خطأ أثناء إضافة السؤال' }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // إغلاق الاتصال بقاعدة البيانات
    }
}