"use client"; // تأكد أن هذا الملف يعمل في الـ Client Side

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ClientLoginSeaecgPrams({ setError }) {
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorParam = searchParams.get("error");
        if (errorParam) {
            setError(decodeURIComponent(errorParam)); // تحديث الخطأ بعد تحميل الصفحة
        }
    }, [searchParams, setError]);

    return null; // هذا المكون لا يحتاج إلى عرض أي شيء
}
