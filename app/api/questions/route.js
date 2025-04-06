import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const categoryFilter = searchParams.get("category");
  const searchQuery = searchParams.get("search"); //  استخراج نص البحث
  const order = searchParams.get("order") || "desc"; // إضافة الترتيب مع افتراضي "desc"
  const page = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("limit")) || 8;
  const skip = (page - 1) * pageSize;

  try {
    let filterConditions = {};

    // 🔹 البحث حسب النص المدخل
    if (searchQuery) {
      filterConditions.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { content: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    // 🔹 فلترة حسب الفئة إن وُجدت
    if (categoryFilter) {
      filterConditions.category = { has: categoryFilter };
    }

    // 🔹 حساب العدد الإجمالي بناءً على البحث أو الفئة
    const totalQuestions = await prisma.question.count({
      where: filterConditions,
    });

    // 🔹 جلب الأسئلة بناءً على البحث أو الفئة
    const questions = await prisma.question.findMany({
      where: filterConditions,
      include: { answers: true },
      skip,
      take: pageSize,
      orderBy: { createdAt: order }, // ترتيب ديناميكي
    });

    // 🔹 إذا لم يتم العثور على نتائج، نعيد رسالة للمستخدم
    if (questions.length === 0) {
      return NextResponse.json({
        questions: [],
        message: "لم يتم العثور على نتائج تطابق البحث",
        page,
        totalPages: 1,
        totalQuestions: 0,
      }, { status: 200 });
    }

    return NextResponse.json({
      questions,
      page,
      totalPages: Math.max(Math.ceil(totalQuestions / pageSize), 1),
      totalQuestions,
    }, { status: 200 });

  } catch (error) {
    console.error("حدث خطأ في جلب الأسئلة:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب الأسئلة" }, { status: 500 });
  }
}
