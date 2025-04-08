"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import MainLayout from "@/app/layouts/MainLayout";
import Breadcrumb from "@/app/_components/Breadcrumb";
import { FormattedMessage } from "react-intl";
import { ConfirmAlert } from "@/app/_components/Alert";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function QuestionsPage() {
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]); // قائمة الفئات
    const [categoryFilter, setCategoryFilter] = useState(""); // الفئة المحددة
    const [page, setPage] = useState(1); // رقم الصفحة
    const [totalPages, setTotalPages] = useState(1); // إجمالي عدد الصفحات
    const [showConfirm, setShowConfirm] = useState(false); // للتحكم في ظهور التنبيه
    const [selectedQuestionId, setSelectedQuestionId] = useState(null); // تخزين ID السؤال المحدد للحذف

    const router = useRouter();

    // 📌 تحميل الأسئلة والفئات عند تغيير `categoryFilter` أو `page`
    useEffect(() => {
        axios.get(`/api/quiz_app/quiz/admin?page=${page}&categoryName=${categoryFilter}`)
            .then((res) => {
                setQuestions(res.data.questions);
                setTotalPages(res.data.totalPages);
            })
            .catch((err) => console.error(err));
    }, [page, categoryFilter]);

    // 📌 تحميل جميع الفئات
    useEffect(() => {
        axios.get("/api/quiz_app/quiz/categories")
            .then((res) => setCategories(res.data))
            .catch((err) => console.error(err));
    }, []);

    // 📌 حذف سؤال
    const handleDelete = async () => {
        try {
            await axios.delete(`/api/quiz_app/quiz/${selectedQuestionId}`);
            setQuestions(questions.filter((q) => q.id !== selectedQuestionId));
            setShowConfirm(false); // إغلاق التنبيه بعد الحذف
        } catch (error) {
            console.error("حدث خطأ أثناء الحذف:", error);
        }
    }

    return (
        <MainLayout header={<span className="font-bold text-2xl"><FormattedMessage id="manageQuiz" /></span>}>
            {/* ✅ عرض التنبيه عند الحاجة فقط */}
            {showConfirm && (
                <ConfirmAlert
                    title={<FormattedMessage id="confirmDelete" />}
                    content={<FormattedMessage id="scureToDelete" />}
                    action={handleDelete}
                    onCancel={() => setShowConfirm(false)} // لإغلاق التنبيه عند الإلغاء
                />
            )}

            <div className="p-6">
                <Breadcrumb homelink={'/admin'} homeLinekTxt={<FormattedMessage id='breadcrumbMain' />} link1={'/admin/quiz'} link1Text={<FormattedMessage id='manageQuiz' />} />

                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded w-full sm:w-fit text-white text-sm sm:text-lg"
                        onClick={() => router.push("/admin/quiz/new")}
                    >
                        + إضافة سؤال جديد
                    </button>

                    {/* ✅ قائمة تصفية حسب الفئة */}
                    <div className="sm:flex-grow flex-grow-0 w-full sm:w-fit">
                        <select
                            className="sm:flex-grow flex-grow-0 dark:bg-gray-700 shadow p-2 px-4 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full sm:w-fit md:w-full"
                            value={categoryFilter}
                            onChange={(e) => {
                                setCategoryFilter(e.target.value);
                                setPage(1); // إعادة الصفحة إلى الأولى عند تغيير الفئة
                            }}
                        >
                            <option value="">جميع الفئات</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {
                    questions.length >= 0 ?
                    <div className="overflow-x-scroll">
                        <table className="bg-white dark:bg-gray-800 shadow mt-4 border border-gray-300 dark:border-gray-700 w-full text-sm sm:text-lg border-collapse">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-gray-900 dark:border-gray-700 text-center">
                                    <th className="p-2 border dark:border-gray-700">السؤال</th>
                                    <th className="p-2 border dark:border-gray-700">الفئة</th>
                                    <th className="p-2 border dark:border-gray-700">النوع</th>
                                    <th className="p-2 border dark:border-gray-700">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map((q) => (
                                    <tr key={q.id} className="border text-center">
                                        <td className="p-2 border dark:border-gray-700">{q.text}</td>
                                        <td className="p-2 border dark:border-gray-700">{q.categoryName || "عام"}</td>
                                        <td className="p-2 border dark:border-gray-700">{q.type === "MULTIPLE_CHOICE" ? "اختيار من متعدد" : "مطابقة"}</td>
                                        <td className="p-2 border dark:border-gray-700">
                                            <button
                                                className="bg-green-700 hover:bg-green-600 my-1 px-3 py-1 rounded text-white"
                                                onClick={() => router.push(`/admin/quiz/edit/${q.id}`)}
                                            >
                                                تعديل
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-600 mx-2 px-3 py-1 rounded text-white"
                                                onClick={() => {
                                                    setSelectedQuestionId(q.id); // تخزين ID السؤال المطلوب حذفه
                                                    setShowConfirm(true); // عرض التنبيه
                                                }

                                                }
                                            >
                                                حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                        :
                        <p>لا توجد اسئلة</p>
                }

                {/* ✅ أزرار التنقل بين الصفحات */}
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="bg-gray-200 hover:bg-primary dark:bg-gray-800 disabled:opacity-25 px-3 py-1 rounded hover:text-white"><ArrowRight /></button>
                    <span>الصفحة {page} من {totalPages}</span>
                    <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="bg-gray-200 hover:bg-primary dark:bg-gray-800 disabled:opacity-25 px-3 py-1 rounded hover:text-white"><ArrowLeft /></button>
                </div>
            </div>
        </MainLayout>
    );
}
