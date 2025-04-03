"use client";
import Link from "next/link";
import { FormattedMessage } from "react-intl";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col justify-center items-center bg-gradient-to-r dark:bg-gradient-to-r from-gray-100 dark:from-gray-900 to-gray-200 dark:to-gray-800 px-6 py-20 h-[50vh] text-gray-900 dark:text-gray-100 text-center">
      <h1 className="mb-4 font-bold text-4xl md:text-5xl">
        <FormattedMessage id="hero.descTitle" />
      </h1>
      <p className="max-w-2xl text-lg md:text-xl">
        <FormattedMessage id="hero.descContent" />
      </p>
      <div className="flex gap-4 mt-6">
        <Link href="/" className="bg-primary hover:bg-secondary shadow-md px-6 py-3 rounded-lg font-semibold text-white transition">
          <FormattedMessage id="hero.btn.tryQuestions" />
        </Link>
        <Link href="/quiz" className="hover:bg-primary px-6 py-3 border border-primary rounded-lg font-semibold text-primary hover:text-white transition">
          <FormattedMessage id="hero.btn.tryQuizzes" />
        </Link>
      </div>
    </section>
  );
}
