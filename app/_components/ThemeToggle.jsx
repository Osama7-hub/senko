"use client";

import { useTheme } from "@/app/context/themeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      title="تغير الثيم"
      className="bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 dark:bg-gray-700 p-2 rounded-full transition">
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
