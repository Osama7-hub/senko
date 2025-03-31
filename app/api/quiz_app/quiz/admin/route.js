import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        // 📌 استخراج `page` و `categoryName` من `query`
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1; // افتراضيًا الصفحة 1
        const pageSize = 10; // عدد العناصر لكل صفحة
        const categoryName = searchParams.get("categoryName"); // الفئة المحددة (إن وجدت)

        // 📌 إعداد شروط البحث حسب الفئة
        const where = categoryName ? { categoryName: categoryName } : {};

        // 📌 جلب الأسئلة مع `pagination` والتصفية
        const questions = await prisma.quizQuestion.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize, // **تخطي الأسئلة حسب الصفحة**
            take: pageSize, // **تحديد عدد الأسئلة لكل صفحة**
        });

        // 📌 حساب إجمالي عدد الأسئلة (لإظهار عدد الصفحات)
        const totalQuestions = await prisma.quizQuestion.count({ where });
        const totalPages = Math.ceil(totalQuestions / pageSize);

        return NextResponse.json({ questions, totalPages });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
