"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuestionTable from "./QuestionTable";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useIntl } from "react-intl";
import { FormattedMessage } from 'react-intl';
import MainLayout from "@/app/layouts/MainLayout";
import axios from "axios"; // استيراد axios
import Breadcrumb from "@/app/_components/Breadcrumb";

export default function QuestionsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const intl = useIntl(); // استخراج كائن الترجمة

    // 📌 قراءة القيم من الـ URL
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [search, setSearch] = useState(searchParams.get("search") || "");

    useEffect(() => {
        async function fetchQuestions() {
            setLoading(true);
            try {
                const query = new URLSearchParams({ page, limit: 3 });

                if (category) query.set("category", category);
                if (search) query.set("search", search);

                const res = await axios.get(`/api/questions?${query.toString()}`); // استخدام axios هنا
                const data = res.data; // البيانات تكون في res.data

                setQuestions(data.questions);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("خطاء في جلب الاسئلة:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchQuestions();
    }, [page, category, search]);

    // 📌 تحديث URL عند تغيير الفلاتر
    function updateURL(updatedParams) {
        const params = new URLSearchParams(updatedParams);
        router.push(`/admin/questions?${params.toString()}`);
    }

    return (
        <MainLayout header={<span className="mb-4 font-bold text-2xl">إدارة الأسئلة</span>}>
            <div className="p-6">
                <Breadcrumb homelink={'/admin'} homeLinekTxt={<FormattedMessage id='breadcrumbMain' />} link1={'/admin/quiz'} link1Text={<FormattedMessage id='manageQuestions' />} />

                {/* 🔹 البحث وتصنيف الأسئلة */}
                <div className="flex md:flex-row flex-col items-center gap-2 mb-4 w-full">
                    <div className="relative w-full md:w-1/2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                updateURL({ page: 1, category, search: e.target.value });
                            }}
                            placeholder={intl.formatMessage({ id: "input.search" })} // استخدام الترجمة هنا
                            className="dark:bg-gray-700 shadow p-2 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full"
                            required
                        />
                        <span className="absolute inset-y-0 place-content-center grid w-10 text-gray-500 pointer-events-none end-0">
                            <Search size={20} className="text-gray-400" />
                        </span>
                    </div>

                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            updateURL({ page: 1, category: e.target.value, search });
                        }}
                        // className="p-2 border"
                        className="flex-grow-0 dark:bg-gray-700 shadow p-2 px-4 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full md:w-fit"
                    >
                        <option value="">كل الفئات</option>
                        <option value="javascript">JavaScript</option>
                        <option value="react.js">React</option>
                        <option value="nextjs">Next.js</option>
                    </select>
                </div>


                {loading ? (
                    <p>جارٍ تحميل الأسئلة...</p>
                ) : (
                    <>
                        <QuestionTable questions={questions} setQuestions={setQuestions} />

                        <div className="flex md:flex-row flex-col-reverse justify-between items-center">
                            {/* 🔹 التحكم في الترقيم */}
                            <div className="flex items-center gap-2 mt-4">
                                <button
                                    disabled={page === 1}
                                    onClick={() => {
                                        setPage(page - 1);
                                        updateURL({ page: page - 1, category, search });
                                    }}
                                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 disabled:opacity-25 shadow px-4 py-1 border dark:border-gray-700 rounded disabled:cursor-no-drop"
                                >
                                    <ChevronRight size={18} />
                                </button>
                                <span>الصفحة {page} من {totalPages}</span>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => {
                                        setPage(page + 1);
                                        updateURL({ page: page + 1, category, search });
                                    }}
                                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 disabled:opacity-25 shadow px-4 py-1 border dark:border-gray-700 rounded disabled:cursor-no-drop"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                            </div>

                            <button
                                onClick={() => router.push("/admin/questions/add")} // الانتقال إلى صفحة إضافة سؤال
                                className="bg-blue-500 hover:bg-blue-600 mt-4 px-4 py-2 rounded text-white"
                            >
                                 + إضافة سؤال جديد
                            </button>
                        </div>
                        
                    </>
                )}
            </div>
        </MainLayout>
    );
}