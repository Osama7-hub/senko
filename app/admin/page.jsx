"use client";
import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { CircleHelp, Users, ClipboardList, PlusCircle } from "lucide-react";
import axios from "axios";

function Dashboard() {
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [totalQuiz, setTotalQuiz] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    // const [pendingAnswers, setPendingAnswers] = useState(0);


    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
             // جلب عدد الأسئلة العامة
             const questionsRes = await axios.get("/api/questions");
             const questionsData = await questionsRes.data;
             setTotalQuestions(questionsData.totalQuestions);
             
             const userRes = await axios.get("/api/users");
             const userData = await userRes.data;
             setTotalUsers(userData.totalUsers - 1);

             // جلب عدد  المستخدمين
             const quizRes = await axios.get("/api/quiz_app/quiz",  {
                params: { category: "all" }
            });
             const quizData = await quizRes.data;
             setTotalQuiz(quizData[1]);

        } catch (error) {
            // console.error("❌ خطأ في جلب البيانات:", error);
            console.error("❌ خطأ في جلب البيانات:", error.response?.data || error.message);

        }
    }
    
    return (
        <MainLayout header={<span className="block w-full font-bold text-3xl text-center"><FormattedMessage id="dashboard" /></span>}>
            <div className="p-6">

                {/* الإحصائيات */}
                <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 mb-8">
                    <StatCard icon={<CircleHelp size={40} />} label="إجمالي الأسئلة" value={totalQuestions} />
                    <StatCard icon={<ClipboardList size={40} />} label="إجمالي الاختبارات" value={totalQuiz} />
                    <StatCard icon={<Users size={40} />} label="عدد المستخدمين" value={totalUsers} />
                    {/* <StatCard icon={<PlusCircle size={40} />} label="إجابات بانتظار الموافقة" value={pendingAnswers} /> */}
                </div>

                {/* الروابط السريعة */}
                <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
                    <QuickAction href="/admin/questions" title={<FormattedMessage id="manageQuestions" />} description={<FormattedMessage id="descManageQuestions" />} />
                    <QuickAction href="/admin/quiz" title={<FormattedMessage id="manageQuiz" />} description={<FormattedMessage id="descManageQuiz" />} />
                    <QuickAction href="/admin/users" title={<FormattedMessage id="manageUsers" />} description={<FormattedMessage id="descManageUsers" />} />
                    {/* <QuickAction href="/admin/reviews" title="مراجعة الإجابات" description="الموافقة على الإجابات المقترحة" /> */}
                </div>
            </div>
        </MainLayout>
    );
}

// مكون إحصائي
const StatCard = ({ icon, label, value }) => (
    <div className="flex items-center bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg">
        <div className="text-primary text-3xl">{icon}</div>
        <div className="mx-4">
            <p className="font-semibold text-gray-700 dark:text-gray-300">{label}</p>
            <p className="font-bold text-2xl">{value}</p>
        </div>
    </div>
);

// مكون زر الإجراءات السريعة
const QuickAction = ({ href, title, description }) => (
    <Link href={href} className="block bg-gray-50 hover:bg-primary dark:bg-gray-800 dark:hover:bg-primary shadow-md p-6 rounded-lg hover:text-white transition">
        <h3 className="font-bold text-xl">{title}</h3>
        <p>{description}</p>
    </Link>
);

export default Dashboard;
