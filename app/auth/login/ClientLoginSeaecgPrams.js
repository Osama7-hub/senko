"use client"; // ⬅️ هذا يضمن أن `useSearchParams()` يعمل فقط في العميل

import { useSearchParams } from "next/navigation";

export default function ClientLoginSeaecgPrams({ setError }) {
    const searchParams = useSearchParams();
    const errorParam = searchParams.get("error"); // قراءة رسالة الخطأ من الـ URL

    setError(error);

    return null; // هذا المكون غير مرئي
}
