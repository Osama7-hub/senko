"use client";

import { useState } from "react";

export default function MultipleChoiceQuestion({ question, onAnswer }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const handleAnswer = (index) => {
        const isCorrect = question.options[index].isCorrect;
        setSelectedOption(index);
        setFeedback(isCorrect ? "correct" : "wrong");

        // بعد ثانية، عرض الإجابة الصحيحة إذا كانت الإجابة خاطئة
        setTimeout(() => {
            onAnswer(isCorrect);
            setSelectedOption(null);
            setFeedback(null);
        }, 1000);
    };

    return (
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mx-1 mt-8">
            {question.options.map((option, index) => (
                <button
                    key={index}
                    className={`block w-full p-3 border rounded-lg shadow dark:border-gray-600 dark:shadow-gray-700
                        ${selectedOption === index ? (feedback === "correct" ? "bg-primary text-white shadow-none" : "bg-red-500 text-white") : ""}
                        ${feedback === "wrong" && option.isCorrect ? "bg-primary text-white" : ""}
                    `}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedOption !== null}
                >
                    {option.text}
                </button>
            ))}
        </div>
    );
}
