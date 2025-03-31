"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import MainLayout from "@/app/layouts/MainLayout";
import { useIntl } from "react-intl";
import { ConfirmAlert } from "@/app/_components/Alert";

export default function AddQuestionPage() {
    const [text, setText] = useState("");
    const [type, setType] = useState("MULTIPLE_CHOICE");
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false); // للتحكم في ظهور التنبيه
    const [selectedcategoryName, setSelectedcategoryName] = useState(null); // تخزين ID السؤال المحدد للحذف

    const [options, setOptions] = useState([{ text: "", isCorrect: false }]);
    const [matchingPairs, setMatchingPairs] = useState([{ leftItem: "", rightItem: "" }]);
    const router = useRouter();
    const intl = useIntl(); // استخراج كائن الترجمة

    useEffect(() => {
        axios.get("/api/quiz_app/quiz/categories").then((res) => setCategories(res.data));
    }, []);

    const handleAddOption = () => setOptions([...options, { text: "", isCorrect: false }]);
    const handleRemoveOption = (index) => setOptions(options.filter((_, i) => i !== index));

    const handleAddPair = () => setMatchingPairs([...matchingPairs, { leftItem: "", rightItem: "" }]);
    const handleRemovePair = (index) => setMatchingPairs(matchingPairs.filter((_, i) => i !== index));

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        try {
            const res = await axios.post("/api/quiz_app/quiz/categories", { name: newCategory });
            setCategories([...categories, res.data]);
            setCategoryName(res.data.name);
            setNewCategory("");
            setShowNewCategoryInput(false);
        } catch (error) {
            console.error("خطأ أثناء إضافة الفئة:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const questionData = { text, type, categoryName };
        if (type === "MULTIPLE_CHOICE") {
            questionData.options = options;
        } else {
            questionData.matchingPairs = matchingPairs;
        }

        try {
            await axios.post("/api/quiz_app/quiz", questionData);

            router.push("/admin/quiz");
        } catch (error) {
            console.error("حدث خطأ أثناء الإضافة:", error);
        }
    };

    const handleDeleteCategory = async () => {
        // if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;

        try {
            await axios.delete(`/api/quiz_app/quiz/categories/${selectedcategoryName}`);

            // تحديث القائمة بعد الحذف
            setCategories(categories.filter((cat) => cat.name !== selectedcategoryName));

            // ✅ إذا كانت الفئة المحذوفة هي الفئة المحددة، يتم إلغاء الاختيار
            if (categoryName === selectedcategoryName) {
                setCategoryName("");
            }

            setShowConfirm(false); // إغلاق التنبيه بعد الحذف
        } catch (error) {
            console.error("خطأ أثناء حذف الفئة:", error);
        }
    };

    return (
        <MainLayout header={<span className="mb-4 font-bold text-2xl">إضافة سؤال جديد</span>}>
            {showConfirm && (
                <ConfirmAlert
                    title={`${intl.formatMessage({ id: "confirmDelete" })}`}
                    content={`${intl.formatMessage({ id: "scureToDeleteCategory" })}`}
                    action={handleDeleteCategory}
                    onCancel={() => setShowConfirm(false)} // لإغلاق التنبيه عند الإلغاء
                />
            )}
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 font-semibold">نص السؤال:</label>
                        <input
                            type="text"
                            className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">الفئة:</label>
                        <div className="flex">
                            <select className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 focus:outline-none w-full" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required>
                                <option value="">اختر الفئة</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                                <option value="new">+ إضافة فئة جديدة</option>
                            </select>

                            {/* ✅ زر الحذف يظهر فقط عند اختيار فئة (باستثناء "إضافة فئة جديدة") */}
                            {categoryName && categoryName !== "new" && (
                                <button
                                    type="button"
                                    className="bg-red-500 hover:bg-red-600 px-3 py-1 text-white"
                                    // onClick={() => handleDeleteCategory(categoryName)}
                                    onClick={() => {
                                        setShowConfirm(true); // عرض التنبيه
                                        setSelectedcategoryName(categoryName);
                                    }}
                                >
                                    حذف
                                </button>
                                // <button type="button" className="bg-red-500 px-2 text-white" onClick={() => {
                                //     setShowConfirm(true); // عرض التنبيه
                                //     setSelectedcategoryName(categoryName);
                                // }}>X</button>
                            )}
                        </div>

                        {categoryName === "new" && (
                            <div className="flex space-x-2 mt-2">
                                <input type="text" className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 focus:outline-none w-full" placeholder="اسم الفئة الجديدة" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                                <button type="button" className="bg-green-500 px-3 py-1 text-white" onClick={handleAddCategory}>إضافة</button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block font-semibold">نوع السؤال:</label>
                        <select className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="MULTIPLE_CHOICE">اختيار من متعدد</option>
                            <option value="MATCHING">مطابقة</option>
                        </select>
                    </div>

                    {type === "MULTIPLE_CHOICE" && (
                        <div>
                            <label className="block font-semibold">الخيارات:</label>
                            {options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full"
                                        value={option.text}
                                        onChange={(e) => {
                                            const newOptions = [...options];
                                            newOptions[index].text = e.target.value;
                                            setOptions(newOptions);
                                        }}
                                        required
                                    />
                                    <input
                                        type="checkbox"
                                        checked={option.isCorrect}
                                        onChange={() => {
                                            const newOptions = options.map((opt, i) => ({ ...opt, isCorrect: i === index }));
                                            setOptions(newOptions);
                                        }}
                                    />
                                    <button type="button" className="bg-red-500 px-2 text-white" onClick={() => handleRemoveOption(index)}>X</button>
                                </div>
                            ))}
                            <button type="button" className="bg-green-500 mt-2 px-3 py-1 text-white" onClick={handleAddOption}>
                                + إضافة خيار
                            </button>
                        </div>
                    )}

                    {type === "MATCHING" && (
                        <div>
                            <label className="block font-semibold">أزواج المطابقة:</label>
                            {matchingPairs.map((pair, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        className="flex-1 p-2 border"
                                        placeholder="عنصر 1"
                                        value={pair.leftItem}
                                        onChange={(e) => {
                                            const newPairs = [...matchingPairs];
                                            newPairs[index].leftItem = e.target.value;
                                            setMatchingPairs(newPairs);
                                        }}
                                        required
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 p-2 border"
                                        placeholder="عنصر 2"
                                        value={pair.rightItem}
                                        onChange={(e) => {
                                            const newPairs = [...matchingPairs];
                                            newPairs[index].rightItem = e.target.value;
                                            setMatchingPairs(newPairs);
                                        }}
                                        required
                                    />
                                    <button type="button" className="bg-red-500 px-2 text-white" onClick={() => handleRemovePair(index)}>X</button>
                                </div>
                            ))}
                            <button type="button" className="bg-green-500 mt-2 px-3 py-1 text-white" onClick={handleAddPair}>
                                + إضافة زوج جديد
                            </button>
                        </div>
                    )}

                    <button type="submit" className="bg-blue-500 px-4 py-2 rounded text-white">حفظ</button>
                </form>
            </div>
        </MainLayout>
    );
}
