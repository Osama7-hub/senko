"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import MainLayout from "../layouts/MainLayout";
import { Trash } from "lucide-react";
import { FormattedMessage } from "react-intl";

export default function Profile() {
    const { data: session } = useSession();
    const [savedQuestions, setSavedQuestions] = useState([]);

    useEffect(() => {
        fetchSavedQuestions();
    }, []);

    async function fetchSavedQuestions() {
        try {
            const res = await axios.get("/api/saved-questions");
            setSavedQuestions(res.data);
        } catch (error) {
            console.error("فشل في جلب الأسئلة المحفوظة:", error);
        }
    }

    // حذف السؤال المحفوظ
    async function removeSavedQuestion(questionId) {
        try {
            await axios.post("/api/saved-questions", { questionId });
            setSavedQuestions(savedQuestions.filter((item) => item.question.id !== questionId));
        } catch (error) {
            console.error("فشل في حذف السؤال:", error);
        }
    }

    // استخراج أول حرف من الاسم
    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : "?";
    };

    return (
        <MainLayout>
            <div className="mx-auto p-6 max-w-7xl h-[100vh]">
                {/* 🟢 قسم معلومات المستخدم */}
                <div className="flex items-center gap-4 mb-6 pb-4 dark:border-gray-700 border-b">
                    {/* صورة المستخدم أو أول حرف من اسمه */}
                    {session?.user.image ? (
                        <img
                            src={session.user.image}
                            alt="صورة المستخدم"
                            className="border border-gray-300 rounded-full w-16 h-16"
                        />
                    ) : (
                        <div className="flex justify-center items-center bg-gray-200 rounded-full w-16 h-16 font-semibold text-gray-700 text-xl">
                            {getInitials(session?.user.name)}
                        </div>
                    )}

                    {/* بيانات المستخدم */}
                    <div>
                        <h2 className="font-semibold text-gray-900 dark:text-gray-50 text-2xl">
                            {session?.user.name || "مستخدم مجهول"}
                        </h2>
                        <p className="text-gray-400 dark:text-gray-400">{session?.user.email || "بريد غير متوفر"}</p>
                    </div>
                </div>

                {/* 🟢 قائمة الأسئلة المحفوظة */}
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-50 text-xl"><FormattedMessage id="saved.questions" /></h3>
                {savedQuestions.length > 0 ? (
                    <ul className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                        {savedQuestions.map((item) => (
                            <li key={item.question.id} className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 shadow p-4 rounded-lg transition cursor-pointer">
                                <Link href={`/question/${item.question.id}`} className="hover:text-secondary hover:underline">
                                    {item.question.content}
                                </Link>
                                <button
                                    onClick={() => removeSavedQuestion(item.question.id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                    title="إزالة السؤال"
                                >
                                    <Trash size={20} />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">لا توجد أسئلة محفوظة بعد.</p>
                )}
            </div>
        </MainLayout>
    );
}
