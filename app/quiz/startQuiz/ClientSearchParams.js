"use client"; // ⬅️ هذا يضمن أن `useSearchParams()` يعمل فقط في العميل

import { useSearchParams } from "next/navigation";

export default function ClientSearchParams({ setCategory }) {
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || "all";

    // تمرير `category` إلى `QuizPage`
    setCategory(category);

    return null; // هذا المكون غير مرئي
}
