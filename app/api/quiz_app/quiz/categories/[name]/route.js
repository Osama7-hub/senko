import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
    const { name } = await params;
    
    try {
        // التحقق مما إذا كانت الفئة مرتبطة بأسئلة
        const questionsWithCategory = await prisma.quizQuestion.count({
            where: { categoryName: name },
        });

        if (questionsWithCategory > 0) {
            return NextResponse.json({ error: "لا يمكن حذف الفئة لأنها تحتوي على أسئلة." }, { status: 400 });
        }

        await prisma.category.delete({ where: { name } });

        return NextResponse.json({ message: "تم حذف الفئة بنجاح" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}