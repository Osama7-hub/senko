"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QuestionTable({ questions, setQuestions }) {
    const router = useRouter();
    const handleEdit = (id) => {
        router.push(`/admin/questions/edit/${id}`); // الانتقال إلى صفحة التعديل
    };

    const handleDelete = async (id) => {
        if (confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
            try {
                await axios.delete(`/api/questions/${id}`);
                setQuestions(questions.filter((question) => question.id !== id)); // تحديث القائمة بعد الحذف
            } catch (error) {
                console.error("خطاء في حذف السؤال:", error);
            }
        }
    };

    return (
        <table className="bg-white dark:bg-gray-800 shadow mt-4 border border-gray-300 dark:border-gray-700 w-full border-collapse">
            <thead>
                <tr className="bg-gray-200 dark:bg-gray-900 dark:border-gray-700 text-center">
                    <th className="p-2 border dark:border-gray-700">#</th>
                    <th className="p-2 border dark:border-gray-700">السؤال</th>
                    <th className="p-2 border dark:border-gray-700">عدد الإجابات</th>
                    <th className="p-2 border dark:border-gray-700">إجراءات</th>
                </tr>
            </thead>
            <tbody>
                {questions.map((question, index) => (
                    <tr key={question.id} className="text-center">
                        <td className="p-2 border dark:border-gray-700">{index + 1}</td>
                        <td className="p-2 border dark:border-gray-700 hover:text-primary hover:underline">
                            <Link href={`/question/${question.id}`}>{question.title}</Link>
                        </td>
                        <td className="p-2 border dark:border-gray-700">{question.answers.length || 0}</td>
                        <td className="p-2 border dark:border-gray-700">
                            <button onClick={() => handleEdit(question.id)} className="bg-green-700 hover:bg-green-600 my-1 px-3 py-1 rounded text-white">تعديل</button>
                            <button onClick={() => handleDelete(question.id)} className="bg-red-500 hover:bg-red-600 mx-2 px-3 py-1 rounded text-white">حذف</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
