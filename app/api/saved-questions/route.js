import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/nextAuth";

const prisma = new PrismaClient();

// ✅ حفظ أو إلغاء حفظ السؤال
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });

  const { questionId } = await req.json();
  const userId = session.user.id;

  try {
    // تحقق مما إذا كان السؤال محفوظًا بالفعل
    const existing = await prisma.savedQuestion.findUnique({
      where: { userId_questionId: { userId, questionId } },
    });

    if (existing) {
      // إذا كان موجودًا، احذفه (إلغاء الحفظ)
      await prisma.savedQuestion.delete({
        where: { userId_questionId: { userId, questionId } },
      });
      return NextResponse.json({ message: "تم إلغاء حفظ السؤال" });
    } else {
      // إذا لم يكن موجودًا، احفظه
      await prisma.savedQuestion.create({
        data: { userId, questionId },
      });
      return NextResponse.json({ message: "تم حفظ السؤال" });
    }
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ عند حفظ السؤال" }, { status: 500 });
  }
}

// ✅ جلب جميع الأسئلة المحفوظة للمستخدم الحالي
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });

  const userId = session.user.id;

  try {
    const savedQuestions = await prisma.savedQuestion.findMany({
      where: { userId },
      include: {
        question: true, // افترض أن لديك علاقة بين `savedQuestion` و `question`
      },
    });

    return NextResponse.json(savedQuestions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ عند جلب الأسئلة المحفوظة" }, { status: 500 });
  }
}
