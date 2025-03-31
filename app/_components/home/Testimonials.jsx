"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import { Star } from "lucide-react";
import { FormattedMessage } from "react-intl";


const testimonials = [
  { name: "أحمد علي", review: "الموقع مذهل! ساعدني كثيرًا في التحضير لمقابلات العمل.", rating: 5 },
  { name: "سارة محمد", review: "الاختبارات ممتعة وتساعد على قياس مستواي في البرمجة بسهولة!", rating: 4 },
  { name: "محمد خالد", review: "مجموعة الأسئلة رائعة، والتفاعل مع الإجابات مفيد جدًا!", rating: 5 },
  { name: "بتول علي", review: "مجموعة الأسئلة رائعة، والتفاعل مع الإجابات مفيد جدًا!", rating: 5 },
  { name: "محمد خالد", review: "مجموعة الأسئلة رائعة، والتفاعل مع الإجابات مفيد جدًا!", rating: 5 },
];

export default function Testimonials() {
  return (
    <HomeLayout>
      <section className="relative bg-gray-50 dark:bg-gray-900 text-center">
        <h2 className="mb-10 font-bold text-3xl"><FormattedMessage id="home.testimonials" /></h2>

        <div className="flex space-x-6 px-6 md:px-0 overflow-x-auto snap-mandatory snap-x">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex-none bg-transparent p-6 w-full md:w-1/3 text-left snap-center">
              <blockquote className="before:top-0 before:left-4 before:absolute relative bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg before:text-gray-300 dark:before:text-gray-600 before:text-6xl before:content-['“']">
                <p className="text-gray-600 dark:text-gray-300 italic">{testimonial.review}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="ml-3 font-semibold text-gray-700 dark:text-gray-200">{testimonial.name}</span>
                  <div className="flex items-center gap-1 text-yellow-300 text-xl">
                    {testimonial.rating} <Star size={18} />
                  </div>
                </div>
              </blockquote>
            </div>
          ))}
        </div>
      </section>
    </HomeLayout>
  );
}

