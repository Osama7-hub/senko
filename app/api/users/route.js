import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    let totalUsers;
    const users = await prisma.user.findMany();
    // حساب العدد الكلي للمستخدمين
    totalUsers = await prisma.user.count();

    return NextResponse.json({users, totalUsers}); // استخدام NextResponse لإرجاع الاستجابة
  } catch (error) {
    return NextResponse.json({ error: 'فشل في عرض المستخدمين' }, { status: 500 }); // تحديد الكود 500 مع NextResponse
  }
}
