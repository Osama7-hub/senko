import { authOptions } from '@/app/lib/nextAuth';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// جلب الإجابة الرسمية المرتبطة بسؤال محدد
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get("questionId");

    try {
        const officialAnswer = await prisma.answer.findFirst({
            where: { questionId, isOfficial: true }, // جلب الإجابة الرسمية فقط
        });

        if (!officialAnswer) {
            return NextResponse.json({ error: "لا توجد إجابة رسمية" }, { status: 404 });
        }

        return NextResponse.json(officialAnswer);
    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء جلب الإجابة الرسمية" }, { status: 500 });
    }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });

  // console.log("userid session ====> ", session.user.id)

  try {
    const { content, questionId, isOfficial} = await req.json(); // استخراج البيانات من الطلب

    if (!content || !questionId) {
      return NextResponse.json({ error: "يرجى ملء جميع الحقول" }, { status: 400 });
    }

    const newAnswer = await prisma.answer.create({
      data: {
        content,
        questionId,
        userId: session.user.id, // أخذ userId من session
        isOfficial
      },
    });

    return NextResponse.json(newAnswer, { status: 201 });
  } catch (error) {
    console.error("خطأ أثناء إضافة الإجابة:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء إضافة الإجابة" }, { status: 500 });
  }
}
