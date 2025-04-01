"use client";
import QuestionsList from "./_components/QuestionsList";

export const dynamic = "force-dynamic"; // ⬅️ إجبار الصفحة على أن تكون ديناميكية بالكامل

export default function Home() {
  return (
      <QuestionsList />
  );
}
