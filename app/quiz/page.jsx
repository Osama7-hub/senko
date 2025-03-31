"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import { FormattedMessage } from "react-intl";
import { SkeletonQuiz } from "../_components/Skeletons";

const QuizStartPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // جلب الأقسام مع معالجة الأخطاء وحالة التحميل
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get("/api/quiz_app/quiz/categories", {
                    // إضافة timeout لمنع التعليق
                    timeout: 5000,
                });
                setCategories(data);
            } catch (error) {
                console.error("فشل في جلب الفئات:", error);
                setCategories([]); // fallback لقائمة فارغة
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // استخدام useCallback لتجنب إعادة إنشاء الدالة
    const startQuiz = useCallback(() => {
        router.push(`/quiz/startQuiz?category=${encodeURIComponent(selectedCategory)}`);
    }, [selectedCategory, router]);

    // تحسين SelectDropdown باستخدام memo وتقليل الـ re-renders
    const SelectDropdown = memo(({ onSelectChange, categories, selectedCategory }) => {
        const [isOpen, setIsOpen] = useState(false);

        // تحسين أداء الـ handler
        const handleCategorySelect = useCallback((category) => {
            onSelectChange(category);
            setIsOpen(false);
        }, [onSelectChange]);

        return (
            <div className="relative mb-5 w-full">
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="bg-white dark:bg-gray-800 shadow-sm px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-center"
                    disabled={isLoading}
                >
                    {selectedCategory === "all" ? (
                        <FormattedMessage id="all.category" />
                    ) : (
                        selectedCategory
                    )}
                </button>
                {isOpen && (
                    <ul className="z-10 absolute bg-white dark:bg-gray-800 shadow-lg mt-1 border border-gray-100 dark:border-gray-700 rounded-lg w-full max-h-60 overflow-y-auto">
                        <li
                            className={`px-4 py-2 cursor-pointer ${
                                selectedCategory === "all"
                                    ? "bg-secondary dark:bg-secondary text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-50 hover:bg-primary dark:hover:bg-primary hover:text-white"
                            }`}
                            onClick={() => handleCategorySelect("all")}
                        >
                            <FormattedMessage id="all.category" />
                        </li>
                        {categories.map((cat) => (
                            <li
                                key={cat.id}
                                className={`px-4 py-2 cursor-pointer ${
                                    selectedCategory === cat.name
                                        ? "bg-secondary dark:bg-secondary text-white"
                                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-50 hover:bg-primary dark:hover:bg-primary hover:text-white"
                                }`}
                                onClick={() => handleCategorySelect(cat.name)}
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }, (prevProps, nextProps) => 
        prevProps.selectedCategory === nextProps.selectedCategory &&
        prevProps.categories === nextProps.categories
    );

    // تحسين الـ handler باستخدام useCallback
    const handleSelectChange = useCallback((newSelected) => {
        setSelectedCategory(newSelected);
    }, []);

    if (isLoading) {
        return (
            <MainLayout header={<span className="font-bold text-3xl"><FormattedMessage id="test.your.info" /></span>}>
                <SkeletonQuiz />
            </MainLayout>
        );
    }

    return (
        <MainLayout header={<span className="font-bold text-3xl"><FormattedMessage id="test.your.info" /></span>}>
            <div className="mx-auto mt-10 max-w-xl text-center">
                <label className="block mb-2 font-semibold text-lg">
                    <FormattedMessage id="choise.category" />
                </label>
                <SelectDropdown
                    onSelectChange={handleSelectChange}
                    categories={categories}
                    selectedCategory={selectedCategory}
                />
                <button
                    onClick={startQuiz}
                    className="bg-primary hover:bg-secondary disabled:opacity-50 px-6 py-2 rounded-lg text-white transition"
                    disabled={isLoading}
                >
                    <FormattedMessage id="start.quiz" />
                </button>
            </div>
        </MainLayout>
    );
};

export default memo(QuizStartPage);