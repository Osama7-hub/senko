"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import MainLayout from "@/app/layouts/MainLayout";
import TipTapEditor from "@/app/_components/TipTapEditor";

export default function AddQuestion() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState([]); // الفئات المختارة
    const [categories, setCategories] = useState([]); // الفئات الموجودة
    const [inputValue, setInputValue] = useState(""); // قيمة حقل الإدخال
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // حالة القائمة المنسدلة
    const [answerContent, setAnswerContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef(null); // مرجع لحقل الإدخال

    // جلب الفئات الفريدة عند تحميل الصفحة
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("/api/categories");
                setCategories(response.data || []);
            } catch (error) {
                console.error("خطاء في جلب الفئات:", error);
            }
        };

        fetchCategories();
    }, []);

    // تصفية الفئات بناءً على الإدخال
    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    // إضافة فئة جديدة أو موجودة عند الضغط على Enter
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault();
            const newCategory = inputValue.trim();
            if (!category.includes(newCategory)) {
                setCategory([...category, newCategory]);
                if (!categories.includes(newCategory)) {
                    setCategories([...categories, newCategory]);
                }
            }
            setInputValue(""); // إعادة تعيين حقل الإدخال
            setIsDropdownOpen(false);
        }
    };

    // اختيار فئة من القائمة المنسدلة
    const handleCategorySelect = (selectedCategory) => {
        if (!category.includes(selectedCategory)) {
            setCategory([...category, selectedCategory]);
        }
        setInputValue("");
        setIsDropdownOpen(false);
        inputRef.current.focus();
    };

    // إزالة فئة من القائمة المختارة
    const handleRemoveCategory = (catToRemove) => setCategory(category.filter((cat) => cat !== catToRemove));

    // فتح/إغلاق القائمة المنسدلة
    const handleInputFocus = () => setIsDropdownOpen(true);
    const handleInputBlur = () => setTimeout(() => setIsDropdownOpen(false), 200); // تأخير للسماح بالنقر على القائمة

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("/api/questions/add", {
                title,
                content,
                category,
            });

            if (response.status === 201) {
                const questionId = response.data.id;
                await axios.post("/api/answers", {
                    content: answerContent,
                    questionId,
                    isOfficial: true,
                });

                router.push("/admin/questions");
            }
        } catch (error) {
            setError("حدث خطأ أثناء إضافة السؤال. يرجى المحاولة مرة أخرى.");
            console.error("خطأ في إضافة السؤال:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout header={<span className="mb-4 font-bold text-2xl">إضافة سؤال جديد</span>}>
            <div className="p-6">

                {error && <p className="mb-4 text-red-500">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2">عنوان السؤال</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2">محتوى السؤال</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block mb-2">الفئة</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {category.map((cat) => (
                                <div
                                    key={cat}
                                    className="flex items-center bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                                >
                                    <span className="text-sm">{cat}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCategory(cat)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            placeholder="اكتب فئة أو اختر من القائمة..."
                            className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full"
                        />
                        {isDropdownOpen && (
                            <div className="z-10 absolute bg-white dark:bg-gray-800 shadow-lg mt-1 border dark:border-gray-600 rounded w-full max-h-60 overflow-y-auto">
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((cat, index) => (
                                        <div
                                            key={`${cat.name}-${index}`}
                                            onClick={() => handleCategorySelect(cat.name)}
                                            className="hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 cursor-pointer"
                                        >
                                            {cat.name}
                                        </div>
                                    ))
                                ) : inputValue.trim() ? (
                                    <div
                                        onClick={() => handleCategorySelect(inputValue.trim())}
                                        className="hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 cursor-pointer"
                                    >
                                        إضافة "{inputValue.trim()}"
                                    </div>
                                ) : (
                                    <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                                        لا توجد فئات متاحة
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2">الإجابة الرسمية</label>
                        <TipTapEditor value={answerContent} onChange={(content) => setAnswerContent(content)} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
                    >
                        {loading ? "جاري الإضافة ..." : "إضافة السؤال"}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}