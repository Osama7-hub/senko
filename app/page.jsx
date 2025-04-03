"use client";
import { Suspense } from "react";
import QuestionsList from "./_components/QuestionsList";
import { SkeletonQuestionItem } from "./_components/Skeletons";
import QuestionsMetadata from "./_components/QuestionsMetadata";

export const dynamic = "force-dynamic"; // ⬅️ إجبار الصفحة على أن تكون ديناميكية بالكامل

export default function Home() {
  let limit = 10
  return (
    <Suspense fallback={<SkeletonQuestionItem limit={limit} />}>
      <QuestionsMetadata />
      <QuestionsList />
    </Suspense>
  );
}
