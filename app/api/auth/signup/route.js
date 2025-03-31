import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "يرجى إدخال جميع الحقول" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json({ error: "المستخدم مسجل بالفعل جرب ادخال بريد الكتروني اخر" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ message: "تم إنشاء الحساب بنجاح", user: newUser }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "خطأ في تسجيل المستخدم" }, { status: 500 });
    }
}
