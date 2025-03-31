"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import MainLayout from "@/app/layouts/MainLayout";

export default function EditQuestionPage() {
    const router = useRouter();
    const { id } = useParams();

    const [text, setText] = useState("");
    const [type, setType] = useState("MULTIPLE_CHOICE");
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const [options, setOptions] = useState([]);
    const [matchingPairs, setMatchingPairs] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/quiz_app/quiz/${id}`).then((res) => {
            const { text, type, categoryName, options, matchingPairs } = res.data;
            setText(text);
            setType(type);
            setCategoryName(categoryName);
            setOptions(options || []);
            setMatchingPairs(matchingPairs || []);
            setLoading(false);
        });

        axios.get("/api/quiz_app/quiz/categories").then((res) => setCategories(res.data));
    }, [id]);

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        try {
            const res = await axios.post("/api/quiz_app/quiz/categories", { name: newCategory });
            setCategories([...categories, res.data]);
            setCategoryName(res.data.name);
            setNewCategory("");
        } catch (error) {
            console.error("خطأ أثناء إضافة الفئة:", error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const data = { text, type, categoryName };

            if (type === "MULTIPLE_CHOICE") {
                data.options = options;
            } else if (type === "MATCHING") {
                data.matchingPairs = matchingPairs;
            }

            await axios.put(`/api/quiz_app/quiz/${id}`, data);
            router.push("/admin/quiz");
        } catch (error) {
            console.error("خطأ أثناء تحديث السؤال:", error);
        }
    };

    return (
        <MainLayout header={<span className="mb-4 font-bold text-2xl">تعديل السؤال</span>}>
            <div className="p-6">
                {loading ? (
                    <p>جارٍ تحميل البيانات ...</p>
                ) : (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block mb-2 font-semibold">نص السؤال:</label>
                            <input type="text" className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full" value={text} onChange={(e) => setText(e.target.value)} required />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">الفئة:</label>
                            <select className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required>
                                <option value="">اختر الفئة</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                                <option value="new">+ إضافة فئة جديدة</option>
                            </select>

                            {categoryName === "new" && (
                                <div className="flex space-x-2 mt-2">
                                    <input type="text" className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 focus:outline-none w-full" placeholder="اسم الفئة الجديدة" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                                    <button type="button" className="bg-green-500 px-3 py-1 text-white" onClick={handleAddCategory}>إضافة</button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="block w-fit font-semibold">نوع السؤال :</label>
                            <p className="p-2">{type === 'MULTIPLE_CHOICE' ? 'اختيار من متعدد' : 'مطابقة بين قائمتين'}</p>
                            {/* <select className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full" disabled value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="MULTIPLE_CHOICE">اختيار من متعدد</option>
                                <option value="MATCHING">مطابقة بين قائمتين</option>
                            </select> */}
                        </div>

                        {type === "MULTIPLE_CHOICE" && (
                            <div>
                                <label className="block mb-2 font-semibold">الخيارات:</label>
                                {options.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2 mb-2">
                                        <input type="text" className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full" value={option.text} onChange={(e) => {
                                            const newOptions = [...options];
                                            newOptions[index].text = e.target.value;
                                            setOptions(newOptions);
                                        }} />
                                        <input type="checkbox" checked={option.isCorrect} onChange={() => {
                                            const newOptions = [...options];
                                            newOptions[index].isCorrect = !newOptions[index].isCorrect;
                                            setOptions(newOptions);
                                        }} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {type === "MATCHING" && (
                            <div>
                                <label className="block mb-2 font-semibold">أزواج المطابقة :</label>
                                {matchingPairs.map((pair, index) => (
                                    <div key={index} className="flex items-center space-x-2 mb-2">
                                        <input type="text" className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 focus:outline-none w-full" placeholder="العنصر الأول" value={pair.leftItem} onChange={(e) => {
                                            const newPairs = [...matchingPairs];
                                            newPairs[index].leftItem = e.target.value;
                                            setMatchingPairs(newPairs);
                                        }} />
                                        <input type="text" className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 focus:outline-none w-full" placeholder="العنصر الثاني" value={pair.rightItem} onChange={(e) => {
                                            const newPairs = [...matchingPairs];
                                            newPairs[index].rightItem = e.target.value;
                                            setMatchingPairs(newPairs);
                                        }} />
                                        <button type="button" className="bg-red-500 px-2 py-1 text-white" onClick={() => setMatchingPairs(matchingPairs.filter((_, i) => i !== index))}>حذف</button>
                                    </div>
                                ))}
                                <button type="button" className="bg-blue-500 mt-2 px-4 py-2 text-white" onClick={() => setMatchingPairs([...matchingPairs, { leftItem: "", rightItem: "" }])}>
                                    + إضافة زوج جديد
                                </button>
                            </div>
                        )}

                        <button type="submit" className="bg-primary px-4 py-2 rounded text-white">حفظ التعديلات</button>
                    </form>
                )}
            </div>
        </MainLayout>
    );
}
