"use client";

import { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";

export default function MatchingQuestion({ question, onAnswer }) {
    const [leftItems, setLeftItems] = useState([]);
    const [rightItems, setRightItems] = useState([]);
    const [selectedPairs, setSelectedPairs] = useState({});
    const [leftSelected, setLeftSelected] = useState(null);
    const [feedback, setFeedback] = useState({});
    const [showCheckButton, setShowCheckButton] = useState(false);
    const [disableButtons, setDisableButtons] = useState(false);

    useEffect(() => {
        // خلط القائمتين عشوائيًا عند تحميل السؤال
        const shuffledLeft = [...question.matchingPairs].sort(() => Math.random() - 0.5);
        const shuffledRight = [...question.matchingPairs].map(pair => pair.rightItem).sort(() => Math.random() - 0.5);

        setLeftItems(shuffledLeft);
        setRightItems(shuffledRight);
    }, [question]);

    // عند اختيار عنصر من القائمة الأولى
    const handleSelectLeft = (item) => {
        if (disableButtons) return;
        setLeftSelected(item);
    };

    // عند اختيار عنصر من القائمة الثانية
    const handleSelectRight = (rightItem) => {
        if (!leftSelected || disableButtons) return;

        setSelectedPairs(prev => ({
            ...prev,
            [leftSelected]: rightItem
        }));

        setLeftSelected(null);

        // تحقق مما إذا كان المستخدم قد اختار جميع الأزواج
        if (Object.keys(selectedPairs).length + 1 === leftItems.length) {
            setShowCheckButton(true);
        }
    };

    // التحقق من الإجابة
    const checkAnswer = () => {
        setDisableButtons(true); // تعطيل الأزرار بعد الضغط على زر التحقق

        const newFeedback = {};
        leftItems.forEach(pair => {
            if (selectedPairs[pair.leftItem] === pair.rightItem) {
                newFeedback[pair.leftItem] = "correct";
            } else {
                newFeedback[pair.leftItem] = "wrong";
            }
        });

        setFeedback(newFeedback);

        setTimeout(() => {
            onAnswer(Object.values(newFeedback).every(status => status === "correct"));
        }, 2000); // الانتقال للسؤال التالي بعد ثانيتين
    };

    return (
        <div className="mt-4">
            <div className="gap-4 grid grid-cols-2">
                {/* القائمة الأولى */}
                <div>
                    <h3 className="mb-2 font-semibold"><FormattedMessage id="choise.from.menu1" /></h3>
                    {leftItems.map((pair, index) => (
                        <button
                            key={index}
                            className={`block w-full p-2 my-2 border rounded 
                                ${leftSelected === pair.leftItem ? "bg-greenLight dark:bg-gray-700" : ""} 
                                ${selectedPairs[pair.leftItem] ? "opacity-50" : ""}
                                ${feedback[pair.leftItem] === "correct" ? "bg-primary text-white" : ""}
                                ${feedback[pair.leftItem] === "wrong" ? "bg-red-500 text-white" : ""}
                            `}
                            onClick={() => handleSelectLeft(pair.leftItem)}
                            disabled={disableButtons}
                        >
                            {pair.leftItem}
                        </button>
                    ))}
                </div>

                {/* القائمة الثانية */}
                <div>
                    <h3 className="mb-2 font-semibold"><FormattedMessage id="choise.from.menu2" /></h3>
                    {rightItems.map((item, index) => (
                        <button
                            key={index}
                            className={`block w-full p-2 my-2 border rounded 
                                ${Object.values(selectedPairs).includes(item) ? "opacity-50" : ""}
                                ${feedback[item] === "correct" ? "bg-primary text-white" : ""}
                                ${feedback[item] === "wrong" ? "bg-red-500 text-white" : ""}
                            `}
                            onClick={() => handleSelectRight(item)}
                            disabled={disableButtons}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {showCheckButton && (
                <button
                    className="bg-primary mt-4 px-4 py-2 rounded-lg text-white"
                    onClick={checkAnswer}
                >
                    <FormattedMessage id="check.answer" />
                </button>
            )}
        </div>
    );
}
