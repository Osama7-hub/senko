// "use client";

// import { useState, useEffect, useCallback, memo, Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import axios from "axios";
// import MainLayout from "@/app/layouts/MainLayout";
// import MatchingQuestion from "@/app/_components/quiz/MatchingQuestion";
// import MultipleChoiceQuestion from "@/app/_components/quiz/MultipleChoiceQuestion";
// import QuizResult from "@/app/_components/quiz/QuizResult";
// import { SkeletonStartQuiz } from "@/app/_components/Skeletons";
// import { FormattedMessage } from "react-intl";

// export const dynamic = "force-dynamic"; // ⬅️ إجبار الصفحة على أن تكون ديناميكية بالكامل

// const QuizPage = () => {
//     const searchParams = useSearchParams();
//     const categoryName = searchParams.get("category") || "all";

//     const [questions, setQuestions] = useState([]);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [score, setScore] = useState(0);
//     const [quizFinished, setQuizFinished] = useState(false);
//     const [progress, setProgress] = useState(0);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const numberOfQuiz = 3;

//     const fetchData = useCallback(async () => {
//         setIsLoading(true);
//         setError(null);
//         try {
//             const { data } = await axios.get(`/api/quiz_app/quiz?category=${encodeURIComponent(categoryName)}`, {
//                 timeout: 5000,
//             });
//             const [quiz] = data || [];
//             setQuestions(quiz || []);
//         } catch (err) {
//             console.error("خطاء في جلب اسئلة الاختبار:", err);
//             setError("خطاء في جلب اسئلة الاختبار , قم بالتجربة مرة اخري.");
//             setQuestions([]);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [categoryName]);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const handleAnswer = useCallback((isCorrect) => {
//         setScore((prevScore) => (isCorrect ? prevScore + 1 : prevScore));

//         if (currentIndex < numberOfQuiz - 1) {
//             setCurrentIndex((prevIndex) => {
//                 const nextIndex = prevIndex + 1;
//                 setProgress((nextIndex / numberOfQuiz) * 100);
//                 return nextIndex;
//             });
//         } else {
//             setQuizFinished(true);
//             setProgress(100);
//         }
//     }, [currentIndex, numberOfQuiz]);

//     if (isLoading) {
//         return (
//             <Suspense fallback={<SkeletonStartQuiz />}>
//                 <MainLayout>
//                     <SkeletonStartQuiz />
//                 </MainLayout>
//             </Suspense>
//         )
//     }

//     if (error) {
//         return (
//             <MainLayout>
//                 <Suspense fallback={<SkeletonStartQuiz />}>
//                     <div className="flex flex-col items-center mx-auto px-4 max-w-5xl h-screen text-center">
//                         <p className="mt-16 text-red-500">{error}</p>
//                     </div>
//                 </Suspense>
//             </MainLayout>
//         );
//     }

//     return (
//         <MainLayout>
//             <Suspense fallback={<SkeletonStartQuiz />}>
//                 <div className="flex flex-col items-center mx-auto px-4 max-w-5xl h-screen text-center">
//                     <div className="bg-gray-300 dark:bg-gray-700 mt-4 rounded-full w-full h-2 overflow-hidden">
//                         <div
//                             className="bg-primary h-full transition-all duration-500"
//                             style={{ width: `${progress}%` }}
//                         ></div>
//                     </div>

//                     {quizFinished ? (
//                         <QuizResult score={score} totalQuestions={numberOfQuiz} />
//                     ) : questions.length > 0 ? (
//                         <div className="mt-16 p-10 rounded-lg w-full">
//                             <h2 className="mb-4 font-bold text-gray-700 dark:text-gray-200 text-xl">
//                                 {questions[currentIndex]?.text}
//                             </h2>
//                             {questions[currentIndex]?.type === "MULTIPLE_CHOICE" ? (
//                                 <MultipleChoiceQuestion
//                                     question={questions[currentIndex]}
//                                     onAnswer={handleAnswer}
//                                 />
//                             ) : (
//                                 <MatchingQuestion
//                                     question={questions[currentIndex]}
//                                     onAnswer={handleAnswer}
//                                 />
//                             )}
//                             <p className="mt-6 text-gray-500 text-sm">
//                                 {currentIndex + 1} / {numberOfQuiz}
//                             </p>
//                         </div>
//                     ) : (
//                         <p className="mt-16 text-gray-500"><FormattedMessage id="no.questionsForCategory" /></p>
//                     )}
//                 </div>
//             </Suspense>
//         </MainLayout>
//     );
// };

// export default memo(QuizPage);

"use client";

import { useState, useEffect, useCallback, memo, Suspense } from "react";
import axios from "axios";
import MainLayout from "@/app/layouts/MainLayout";
import MatchingQuestion from "@/app/_components/quiz/MatchingQuestion";
import MultipleChoiceQuestion from "@/app/_components/quiz/MultipleChoiceQuestion";
import QuizResult from "@/app/_components/quiz/QuizResult";
import { SkeletonStartQuiz } from "@/app/_components/Skeletons";
import { FormattedMessage } from "react-intl";
import ClientSearchParams from "./ClientSearchParams"; // ⬅️ استيراد المكون الجديد

export const dynamic = "force-dynamic"; // ⬅️ إجبار الصفحة على أن تكون ديناميكية بالكامل

const QuizPage = () => {
    const [categoryName, setCategoryName] = useState("all"); // ⬅️ سيتم تحديثه من `ClientSearchParams`
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const numberOfQuiz = 3;

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(`/api/quiz_app/quiz?category=${encodeURIComponent(categoryName)}`, {
                timeout: 5000,
            });
            const [quiz] = data || [];
            setQuestions(quiz || []);
        } catch (err) {
            console.error("خطاء في جلب اسئلة الاختبار:", err);
            setError("خطاء في جلب اسئلة الاختبار , قم بالتجربة مرة اخري.");
            setQuestions([]);
        } finally {
            setIsLoading(false);
        }
    }, [categoryName]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAnswer = useCallback((isCorrect) => {
        setScore((prevScore) => (isCorrect ? prevScore + 1 : prevScore));

        if (currentIndex < numberOfQuiz - 1) {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                setProgress((nextIndex / numberOfQuiz) * 100);
                return nextIndex;
            });
        } else {
            setQuizFinished(true);
            setProgress(100);
        }
    }, [currentIndex, numberOfQuiz]);

    if (isLoading) {
        return (
            <Suspense fallback={<SkeletonStartQuiz />}>
                <MainLayout>
                    <SkeletonStartQuiz />
                </MainLayout>
            </Suspense>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <Suspense fallback={<SkeletonStartQuiz />}>
                    <div className="flex flex-col items-center mx-auto px-4 max-w-5xl h-screen text-center">
                        <p className="mt-16 text-red-500">{error}</p>
                    </div>
                </Suspense>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <ClientSearchParams setCategory={setCategoryName} /> {/* ⬅️ استخدام المكون الجديد */}
            <Suspense fallback={<SkeletonStartQuiz />}>
                <div className="flex flex-col items-center mx-auto px-4 max-w-5xl h-screen text-center">
                    <div className="bg-gray-300 dark:bg-gray-700 mt-4 rounded-full w-full h-2 overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {quizFinished ? (
                        <QuizResult score={score} totalQuestions={numberOfQuiz} />
                    ) : questions.length > 0 ? (
                        <div className="mt-16 p-10 rounded-lg w-full">
                            <h2 className="mb-4 font-bold text-gray-700 dark:text-gray-200 text-xl">
                                {questions[currentIndex]?.text}
                            </h2>
                            {questions[currentIndex]?.type === "MULTIPLE_CHOICE" ? (
                                <MultipleChoiceQuestion
                                    question={questions[currentIndex]}
                                    onAnswer={handleAnswer}
                                />
                            ) : (
                                <MatchingQuestion
                                    question={questions[currentIndex]}
                                    onAnswer={handleAnswer}
                                />
                            )}
                            <p className="mt-6 text-gray-500 text-sm">
                                {currentIndex + 1} / {numberOfQuiz}
                            </p>
                        </div>
                    ) : (
                        <p className="mt-16 text-gray-500">
                            <FormattedMessage id="no.questionsForCategory" />
                        </p>
                    )}
                </div>
            </Suspense>
        </MainLayout>
    );
};

export default memo(QuizPage);
