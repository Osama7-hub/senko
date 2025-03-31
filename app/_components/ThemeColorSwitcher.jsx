"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeColorContext";
import { PaintBucket } from "lucide-react";

export default function ThemeColorSwitcher() {
  const { themeColor, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // قائمة الألوان
  const colors = [
    { name: "primary", color: "bg-[#17b8a6]" },
    { name: "themeOrange", color: "bg-[#ff5722]" },
  ];

  return (
    <div className="right-6 bottom-16 z-20 fixed flex flex-col items-center" ref={menuRef}>
      {/* الأزرار التي تظهر عند الفتح */}
      <div
        className={`relative transition-all duration-300 ${
          isOpen ? "h-28" : "h-0"
        } flex flex-col items-center gap-2 overflow-hidden`}
      >
        {colors.map((color) => (
          <button
            key={color.name}
            className={`w-10 h-10 rounded-full border border-gray-200 shadow-md ${color.color} transition-transform duration-300 ${
              isOpen ? "translate-y-0" : "translate-y-10 opacity-0"
            }`}
            onClick={() => changeTheme(color.name)}
          />
        ))}
      </div>

      {/* زر العائم الرئيسي */}
      <button
        className="flex justify-center items-center bg-primary shadow-lg rounded-full w-10 h-10 text-white hover:scale-110 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <PaintBucket size={28} />
      </button>
    </div>
  );
}
