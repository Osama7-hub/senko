"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuestionTable from "./QuestionTable";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useIntl } from "react-intl";
import { FormattedMessage } from 'react-intl';
import Breadcrumb from "@/app/_components/Breadcrumb";
import axios from "axios";

export const dynamic = "force-dynamic"; // ⬅️ هذا السطر يمنع Next.js من معالجة الصفحة أثناء الـ build

export default function QuestionsClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const intl = useIntl();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setPage(parseInt(searchParams.get("page")) || 1);
        setCategory(searchParams.get("category") || "");
        setSearch(searchParams.get("search") || "");
    }, [searchParams]);

    // جلب الفئات من API
    const fetchCategories = useCallback(async () => {
        try {
            const res = await axios.get("/api/categories");
            setCategories(res.data || []);
        } catch (error) {
            console.error("خطاء في جلب الفئات:", error);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        async function fetchQuestions() {
            setLoading(true);
            try {
                const query = new URLSearchParams({ page, limit: 10 });

                if (category) query.set("category", category);
                if (search) query.set("search", search);

                const res = await fetch(`/api/questions?${query.toString()}`);
                const data = await res.json();

                setQuestions(data.questions);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("خطأ في جلب الأسئلة:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchQuestions();
    }, [page, category, search]);

    function updateURL(updatedParams) {
        const params = new URLSearchParams(updatedParams);
        router.push(`/admin/questions?${params.toString()}`);
    }

    return (
        <Suspense fallback={<div>Loading ...</div>}>
            <div className="p-6">
                <Breadcrumb homelink={'/admin'} homeLinekTxt={<FormattedMessage id='breadcrumbMain' />} link1={'/admin/quiz'} link1Text={<FormattedMessage id='manageQuestions' />} />

                <div className="flex md:flex-row flex-col items-center gap-2 mb-4 w-full">
                    <div className="relative w-full md:w-1/2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                updateURL({ page: 1, category, search: e.target.value });
                            }}
                            placeholder={intl.formatMessage({ id: "input.search" })}
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
                        className="flex-grow-0 dark:bg-gray-700 shadow p-2 px-4 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full md:w-fit"
                    >
                        <option value="">كل الفئات</option>
                        {
                            categories.map((cat) => {
                                return (
                                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                                )
                            })
                        }
                    </select>
                </div>

                {loading ? (
                    <p>جارٍ تحميل الأسئلة...</p>
                ) : (
                    <>
                        <div className="overflow-auto">
                            <QuestionTable questions={questions} setQuestions={setQuestions} />
                        </div>

                        <div className="flex md:flex-row flex-col-reverse justify-between items-center">
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
                                onClick={() => router.push("/admin/questions/add")}
                                className="bg-blue-500 hover:bg-blue-600 mt-4 px-4 py-2 rounded text-white"
                            >
                                + إضافة سؤال جديد
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Suspense>
    );
}
