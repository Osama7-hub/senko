"use client";

import MainLayout from "@/app/layouts/MainLayout";
import QuestionsClient from "./QuestionsClient.js";
import { Suspense } from "react";

export const dynamic = "force-dynamic"; // ⬅️ هذا السطر يمنع Next.js من معالجة الصفحة أثناء الـ build

export default function QuestionsPage() {
    return (
        <Suspense fallback={<div>Loading ...</div>}>
            <MainLayout header={<span className="mb-4 font-bold text-2xl">إدارة الأسئلة</span>}>
                <QuestionsClient />
            </MainLayout>
        </Suspense>
    );
}
