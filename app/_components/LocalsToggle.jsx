import React from 'react'
import { useLocale } from "@/app/context/LocaleContext";

function LocalsToggle() {
    const { locale, changeLocale } = useLocale();
    return (
        <button
            onClick={() => changeLocale(locale === 'ar' ? 'en' : 'ar')}
            className="bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 p-2 rounded-full transition"
        >
            {locale === 'ar' ? 'en' : 'ar'}
        </button>
    )
}

export default LocalsToggle
