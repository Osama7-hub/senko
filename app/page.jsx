"use client";
import { Suspense } from "react";
import QuestionsList from "./_components/QuestionsList";
import { SkeletonQuestionItem } from "./_components/Skeletons";

export const dynamic = "force-dynamic"; // ⬅️ إجبار الصفحة على أن تكون ديناميكية بالكامل

export default function Home() {
  let limit = 10
  return (
    <Suspense fallback={<SkeletonQuestionItem limit={limit} />}>
      <QuestionsList />
    </Suspense>
  );
}
