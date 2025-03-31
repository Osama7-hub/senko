"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import { ClipboardCheck, FileQuestion, Users } from "lucide-react";
import { FormattedMessage } from "react-intl";

const stats = [
  { title: <FormattedMessage id="home.statsQuestions" />, value: "250+", icon: <FileQuestion size={40} /> },
  { title: <FormattedMessage id="home.statsUsers" />, value: "1,500+", icon: <Users size={40} /> },
  { title: <FormattedMessage id="home.statsQuiz" />, value: "500+", icon: <ClipboardCheck size={40} /> }
];

export default function StatsSection() {
  return (
    <HomeLayout>
        <h2 className="mb-6 font-bold text-3xl"><FormattedMessage id="home.stats" /></h2>
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg">
              <div className="text-primary text-4xl">{stat.icon}</div>
              <h3 className="mt-4 font-semibold text-2xl">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-300">{stat.title}</p>
            </div>
          ))}
        </div>
    </HomeLayout>
  );
}
