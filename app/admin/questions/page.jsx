"use client";

import MainLayout from "@/app/layouts/MainLayout";
import QuestionsClient from "./QuestionsClient.js";

export default function QuestionsPage() {
    return (
        <MainLayout header={<span className="mb-4 font-bold text-2xl">إدارة الأسئلة</span>}>
            <QuestionsClient />
        </MainLayout>
    );
}
