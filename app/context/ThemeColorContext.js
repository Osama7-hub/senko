"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeColorContext = createContext();

export function ThemeColorProvider({ children }) {  // ✅ تغيير الاسم هنا ليتطابق مع الاستيراد
    const [themeColor, setThemeColor] = useState("primary");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme-color");
        if (savedTheme) {
            setThemeColor(savedTheme);
          document.body.classList.add(savedTheme);
        }
      }, []);

    const changeTheme = (newTheme) => {
        document.body.classList.remove(themeColor); // ✅ إزالة الكلاس القديم
        document.body.classList.add(newTheme); // ✅ إضافة الكلاس الجديد
        setThemeColor(newTheme);
        localStorage.setItem("theme-color", newTheme);
    };

    return (
        <ThemeColorContext.Provider value={{ themeColor, changeTheme }}>
            <div className={`${themeColor} min-h-screen`}>{children}</div>
        </ThemeColorContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeColorContext);
}
