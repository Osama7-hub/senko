"use client";

import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { FormattedMessage } from "react-intl";

export default function QuizResult({ score, totalQuestions }) {
    const router = useRouter();

    const data = [
        { name: "إجابات صحيحة", value: score, color: "#17b8a6" },
        { name: "إجابات خاطئة", value: totalQuestions ? totalQuestions - score : 0, color: "#F44336" },
    ];

    // 🔹 تصنيف الأداء بناءً على الدرجة
    const performanceMessage = score === totalQuestions
        ? "🎉 ممتاز! لقد أجبت على جميع الأسئلة بشكل صحيح."
        : score >= totalQuestions * 0.7
            ? "👍 جيد جدًا! استمر في التعلم."
            : score >= totalQuestions * 0.5
                ? "🙂 جيد، ولكن يمكنك التحسن."
                : "😕 تحتاج إلى المراجعة أكثر. لا تيأس!";

    return (
        <div className="flex flex-col justify-center items-center h-screen text-center">
            <h1 className="mb-4 font-bold text-2xl">
                <FormattedMessage id="quiz.finished" />
            </h1>
            <p className="mb-4 text-lg">
                درجتك: {score} / {totalQuestions}
            </p>
            <p className="mb-4 text-lg">{performanceMessage}</p>

            {/* 🎯 رسم بياني دائري باستخدام Recharts */}
            <PieChart width={300} height={300}>
                <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>

            <button
                className="bg-primary hover:bg-secondary mt-6 px-6 py-2 rounded-lg text-white"
                onClick={() => router.push("/quiz")}
            >
                <FormattedMessage id="back.to.quiz" />
            </button>
        </div>
    );
}
