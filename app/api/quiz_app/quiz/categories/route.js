import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// إنشاء API لإضافة قسم جديد
export async function POST(req) {
    try {
        const { name } = await req.json();

        if (!name.trim()) return NextResponse.json({ error: "اسم الفئة مطلوب" }, { status: 400 });

        const category = await prisma.category.create({ data: { name } });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// جلب جميع الأقسام
export async function GET() {
    try {
        const categories = await prisma.category.findMany();
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
