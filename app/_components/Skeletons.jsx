import { memo } from "react";

const SkeletonQuestionItem = memo(({ limit }) => {
    return (
        <>
            {/* فئات السؤال الوهمية في الصفحة*/}
            <div className="flex gap-2 mt-2">
                <div className="bg-gray-200 dark:bg-gray-700 w-20 h-6"></div>
                <div className="bg-gray-200 dark:bg-gray-700 w-20 h-6"></div>
                <div className="bg-gray-200 dark:bg-gray-700 w-20 h-6"></div>
            </div>
            <ul className="space-y-1 h-[85vh]">
                {Array.from({ length: limit }).map((_, index) => (
                    <li key={index} className="p-4 border-gray-100 dark:border-gray-800 border-b animate-pulse">
                        <div className="flex justify-between items-center">
                            {/* عنوان السؤال الوهمي */}
                            <div className="bg-gray-200 dark:bg-gray-700 rounded w-2/4 h-4"></div>
                            {/* زر الحفظ الوهمي */}
                            <div className="bg-gray-200 dark:bg-gray-700 rounded w-6 h-6"></div>
                        </div>

                        {/* فئات السؤال الوهمية */}
                        <div className="flex gap-2 mt-2">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-20 h-5"></div>
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-20 h-5"></div>
                        </div>
                    </li>
                ))
                }
            </ul>
        </>
    );
});

const SkeletonQuestionDetails = memo(() => {
    return (
        <div className="p-6 animate-pulse">
            {/* عنوان السؤال */}
            <div className="bg-gray-200 dark:bg-gray-800 mb-4 rounded w-3/4 h-6"></div>
            {/* <div className="flex justify-between items-center gap-2"> */}
            {/* نص السؤال */}
            {/* <div className="flex flex-col gap-2"> */}
            <div className="bg-gray-200 dark:bg-gray-800 mb-2 rounded w-full h-5"></div>
            <div className="bg-gray-200 dark:bg-gray-800 mb-2 rounded w-5/6 h-5"></div>
            {/* </div> */}
            {/* التصنيفات */}
            <div className="flex justify-end gap-2">
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg w-24 h-6"></div>
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg w-24 h-6"></div>
            </div>
        </div>
        // </div>
    );
});

const SkeletonAnswerItem = memo(({ limit }) => {
    return (
        <>
            <div className="bg-gray-200 dark:bg-gray-800 m-4 rounded h-6"></div>
            <div className="bg-gray-200 dark:bg-gray-800 m-4 rounded h-6"></div>
            <div className="bg-gray-200 dark:bg-gray-800 m-4 rounded h-6"></div>
            <div className="bg-gray-200 dark:bg-gray-800 m-4 rounded h-6"></div>
            <ul className="space-y-4">
                {Array.from({ length: limit }).map((_, index) => (
                    //   <SkeletonAnswerItem key={index} />
                    <li key={index} className="bg-gray-50 dark:bg-gray-800 shadow p-4 rounded animate-pulse">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-gray-200 dark:bg-gray-800 rounded-full w-8 h-8"></div>
                            <div className="bg-gray-200 dark:bg-gray-800 rounded w-1/3 h-4"></div>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-800 mb-2 rounded w-full h-4"></div>
                        <div className="bg-gray-200 dark:bg-gray-800 mb-4 rounded w-4/5 h-4"></div>
                        <div className="flex gap-6">
                            <div className="bg-gray-200 dark:bg-gray-800 rounded w-10 h-6"></div>
                            <div className="bg-gray-200 dark:bg-gray-800 rounded w-10 h-6"></div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
});

const SkeletonQuiz = memo(() => {
    return (
        <div className="mx-auto mt-10 max-w-xl text-center">
            {/* Skeleton للعنوان */}
            <div className="block bg-gray-200 dark:bg-gray-700 mx-auto mb-2 rounded w-48 h-6 animate-pulse"></div>

            {/* Skeleton للقائمة المنسدلة */}
            <div className="relative mb-5 w-full">
                <div className="bg-gray-200 dark:bg-gray-800 shadow-sm px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg w-full h-10 animate-pulse"></div>
            </div>

            {/* Skeleton لزر بدء الاختبار */}
            <div className="bg-gray-200 dark:bg-gray-700 mx-auto px-6 py-2 rounded-lg w-32 h-10 animate-pulse"></div>
        </div>
    );
});

const SkeletonStartQuiz = memo(() => {
    return (
        <div className="flex flex-col items-center mx-auto px-4 max-w-5xl h-screen text-center">
            {/* Skeleton لشريط التقدم */}
            <div className="bg-gray-300 dark:bg-gray-700 mt-4 rounded-full w-full h-2 animate-pulse"></div>
            {/* Skeleton للسؤال */}
            <div className="mt-16 p-10 rounded-lg w-full">
                <div className="bg-gray-300 dark:bg-gray-700 mx-auto mb-4 rounded w-3/4 h-6 animate-pulse"></div>
                {/* Skeleton للخيارات */}
                <div className="space-y-4">
                    <div className="gap-4 lg:gap-8 grid grid-cols-1 lg:grid-cols-2">
                        <div className="bg-gray-200 dark:bg-gray-800 rounded w-full h-10 animate-pulse"></div>
                        <div className="bg-gray-200 dark:bg-gray-800 rounded w-full h-10 animate-pulse"></div>
                    </div>
                    <div className="gap-4 lg:gap-8 grid grid-cols-1 lg:grid-cols-2">
                        <div className="bg-gray-200 dark:bg-gray-800 rounded w-full h-10 animate-pulse"></div>
                        <div className="bg-gray-200 dark:bg-gray-800 rounded w-full h-10 animate-pulse"></div>
                    </div>
                </div>
                <div className="bg-gray-300 dark:bg-gray-700 m-auto mt-4 mt-8 rounded-full w-10 h-3 animate-pulse"></div>
            </div>
        </div>
    );
});


export {
    SkeletonQuestionItem,
    SkeletonQuestionDetails,
    SkeletonAnswerItem,
    SkeletonQuiz,
    SkeletonStartQuiz
} 