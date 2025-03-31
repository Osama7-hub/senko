import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/nextAuth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "يجب تسجيل الدخول للتصويت" }, { status: 401 });
  }

  const { answerId, value } = await req.json();

  if (!answerId || ![1, -1].includes(value)) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }

  try {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      select: { isOfficial: true },
    });

    if (!answer || answer.isOfficial) {
      return NextResponse.json({ error: "لا يمكنك التصويت على الإجابات الرسمية" }, { status: 403 });
    }

    const existingVote = await prisma.vote.findUnique({
      where: { answerId_userId: { answerId, userId: session.user.id } },
    });

    if (existingVote) {
      if (existingVote.value === value) {
        // إذا كان التصويت موجودًا بنفس القيمة، لا تفعل شيئًا
        return Response.json({ message: "لقد قمت بالفعل بهذا التصويت" }, { status: 200 });
      } else {
        // تحديث التصويت إذا كان مختلفًا
        const updatedVote = await prisma.vote.update({
          where: { id: existingVote.id },
          data: { value },
        });
        return NextResponse.json(updatedVote, { status: 200 });
      }
    } else {
      // إذا لم يصوت من قبل، قم بإضافة تصويت جديد
      const newVote = await prisma.vote.create({
        data: {
          answerId,
          userId: session.user.id,
          value,
        },
      });
      return NextResponse.json(newVote, { status: 201 });
    }
  } catch (error) {
    console.error("خطأ أثناء التصويت:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء التصويت" }, { status: 500 });
  }
}
