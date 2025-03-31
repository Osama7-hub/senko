"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import { BookOpenText, CircleHelp, ClipboardList } from "lucide-react";
import Link from "next/link";
import { FormattedMessage } from "react-intl";

const sections = [
  { title: <FormattedMessage id="home.overview.sectionTitleQuestion" />, icon: <CircleHelp size={40} />, link: "/", desc: <FormattedMessage id="home.overview.sectionDescQuestion" />},
  { title: <FormattedMessage id="home.overview.sectionTitleQuiz" />, icon: <ClipboardList size={40} />, link: "/quiz", desc: <FormattedMessage id="home.overview.sectionDescQuiz" />},
  { title: <FormattedMessage id="home.overview.sectionTitleSolutions" />, icon: <BookOpenText size={40} />, link: "#", desc: <FormattedMessage id="home.overview.sectionDescSolutions" />}
];

export default function SectionsOverview() {

  return (
      <HomeLayout>
        <h2 className="mb-6 font-bold text-3xl"><FormattedMessage id="home.overview" /></h2>
        <div className="gap-4 lg:gap-8 grid grid-cols-1 lg:grid-cols-3">
          {sections.map((section, index) => (
            <Link key={index} href={section.link} className="group bg-white dark:bg-gray-800 shadow-md hover:shadow-lg p-6 rounded-lg hover:scale-105 transition transform">
              <div className="flex justify-center m-auto mb-4 text-primary group-hover:text-secondary text-5xl text-center">{section.icon}</div>
              <h3 className="font-semibold text-xl">{section.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{section.desc}</p>
            </Link>
          ))}
        </div>
      </HomeLayout>
    
  );
}
