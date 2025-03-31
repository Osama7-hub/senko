"use client";
import { Lock } from "lucide-react";
import { FormattedMessage } from "react-intl";
import ThemeToggle from "@/app/_components/ThemeToggle";

export default function AuthLayout({ titleId, children }) {
  return (
    <>
      <header className="z-20 fixed flex justify-end items-center mx-auto px-5 w-full min-h-20 container">
        <ThemeToggle />
      </header>

      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg w-full max-w-md">
          <h2 className="mb-5 font-semibold text-gray-900 dark:text-gray-50 text-2xl text-center">
            <span className="flex justify-center items-center bg-light mx-auto mb-4 rounded-full w-12 h-12">
              <Lock size={30} className="flex justify-center items-center text-secondary text-center" />
            </span>
            <FormattedMessage id={titleId} />
          </h2>

          {children} {/* 👈 هنا سيتم تمرير الفورم الخاص بكل صفحة */}
        </div>
      </div>
    </>
  );
}
