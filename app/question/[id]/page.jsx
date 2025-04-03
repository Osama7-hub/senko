"use client";

import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
const TipTapEditor = dynamic(() => import("@/app/_components/TipTapEditor"), { ssr: false });
import axios from "axios";
import MainLayout from "@/app/layouts/MainLayout";
import { Bookmark, BookmarkCheck, Tags, ThumbsUp, ThumbsDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "dompurify";
import "highlight.js/styles/atom-one-dark.min.css";
import hljs from "highlight.js";
import { SkeletonAnswerItem, SkeletonQuestionDetails } from "@/app/_components/Skeletons";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import { useRouter } from "next/navigation";
import {Alert} from "@/app/_components/Alert";

const CategoryTags = memo(({ categories }) => (
  <div className="flex justify-end text-gray-500 text-sm">
    {categories.map((cat, index) => (
      <Link key={index} href={`/?category=${cat}`}>
        <span className="flex items-center gap-1 bg-greenLight hover:bg-primary dark:bg-gray-950 dark:hover:bg-primary shadow mx-1 px-3 py-1 border dark:border-gray-700 rounded-full hover:text-white dark:text-gray-50 text-sm capitalize">
          <Tags size={15} /> {cat}
        </span>
      </Link>
    ))}
  </div>
));

const OfficialAnswer = memo(({ answers }) => {
  const officialAnswer = answers.find((a) => a.isOfficial);
  const sanitizedContent = useMemo(() => (officialAnswer ? DOMPurify.sanitize(officialAnswer.content) : ""), [officialAnswer]);

  useEffect(() => {
    hljs.highlightAll(); // إعادة تلوين النصوص بعد التحديث
  }, [answers]);

  return officialAnswer ? (
    <div className="bg-greenLight dark:bg-gray-900 mb-2 p-8 rounded">
      <div
        className="dark:prose-invert content prose prose-lg"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  ) : (
    <p className="my-4 p-8"><FormattedMessage id="no.officialAnswer" /></p>
  );
});

const UserAnswer = memo(({ answer, handleVote, session }) => {
  const sanitizedContent = useMemo(() => DOMPurify.sanitize(answer.content), [answer.content]);

  return (
    <li className="bg-gray-50 dark:bg-gray-800 shadow p-4 rounded">
      <div className="flex items-center gap-3 mb-2">
        {answer.user?.image ? (
          <Image
            src={answer.user?.image || "/imgs/avatar.png"}
            alt="User Avatar"
            className="rounded-full w-8 h-8"
            width={32}
            height={32}
            loading="lazy"
            quality={75}
          />
        ) : (
          <div className="flex justify-center items-center bg-primary shadow rounded-full w-8 h-8 text-white leading-8">
            <span>{answer.user?.name.charAt(0)}</span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {answer.user?.name || "مستخدم مجهول"}
          </span>
          <span className="text-gray-400 text-xs">
            {new Date(answer.createdAt).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
      <div
        className="dark:prose-invert mx-4 my-6 content prose prose-lg"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
      <div className="flex gap-6">
        <button
          onClick={() => handleVote(answer.id, 1)}
          className={`flex items-center gap-2 vote-button ${answer.animateUp ? "animate-youtube" : ""} ${answer.userVote === 1 ? "text-secondary" : "text-primary hover:text-secondary"
            }`}
        >
          {answer.userVote === 1 ? <ThumbsUp fill="currentColor" size={20} /> : <ThumbsUp size={20} />}
          {answer.upvotes || 0}
        </button>
        <button
          onClick={() => handleVote(answer.id, -1)}
          className={`flex items-center gap-2 vote-button ${answer.animateDown ? "animate-youtube" : ""} ${answer.userVote === -1 ? "text-red-800" : "text-red-600 hover:text-red-800"
            }`}
        >
          {answer.userVote === -1 ? (
            <ThumbsDown fill="currentColor" size={20} />
          ) : (
            <ThumbsDown size={20} />
          )}
          {answer.downvotes || 0}
        </button>
      </div>
    </li>
  );
});

const SortDropdown = memo(({ onSortChange }) => {
  const options = [
    { value: "default", label: <FormattedMessage id="dropDown.default" /> },
    { value: "highest", label: <FormattedMessage id="dropDown.highest" /> },
    { value: "lowest", label: <FormattedMessage id="dropDown.lowest" /> },
  ];
  const [selected, setSelected] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onSortChange(selected.value);
  }, [selected, onSortChange]);

  return (
    <div className="relative w-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white dark:bg-gray-800 shadow-sm px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-center"
      >
        {selected.label}
      </button>
      {isOpen && (
        <ul className="z-10 absolute bg-white dark:bg-gray-800 shadow-lg mt-1 border border-gray-100 dark:border-gray-700 rounded-lg w-full">
          {options.map((option) => (
            <li
              key={option.value}
              className={`px-4 py-2 cursor-pointer ${selected.value === option.value
                ? "bg-secondary dark:bg-secondary text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-50 hover:bg-primary dark:hover:bg-primary hover:text-white"
                }`}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

const Header = memo(({ question, savedQuestions, toggleSaveQuestion, session }) => (
  <div className="flex justify-between items-center">
    <h2 className="font-bold text-secondary dark:text-primary text-2xl">{question.title}</h2>
    {session && (
      <button
        className="saved-button"
        onClick={() => toggleSaveQuestion(question.id)}
        title="حفظ السؤال"
      >
        {savedQuestions.has(question.id) ? (
          <BookmarkCheck className="text-primary" />
        ) : (
          <Bookmark className="text-gray-400" />
        )}
      </button>
    )}
  </div>
));

export default function QuestionDetails() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [savedQuestions, setSavedQuestions] = useState(new Set());
  const [sortOrder, setSortOrder] = useState("default");
  const answersRef = useRef(null);
  const [alertData, setAlertData] = useState(null);

  const intl = useIntl(); // استخراج كائن الترجمة
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [questionRes, savedRes] = await Promise.all([
        axios.get(`/api/questions/${id}`),
        session ? axios.get("/api/saved-questions") : Promise.resolve({ data: [] }),
      ]);
      setQuestion(questionRes.data);
      setAnswers(questionRes.data.answers);
      if (session) setSavedQuestions(new Set(savedRes.data.map((q) => q.questionId)));
    } catch (error) {
      console.error("خطاء في جلب البيانات:", error);
      router.replace("/404")
    } finally {
      setLoading(false);
    }
  }, [id, session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    try {
      const res = await axios.post("/api/answers", {
        content: newAnswer,
        questionId: id,
      });

      const addedAnswer = res.data;

      // تحديث بيانات الإجابة الجديدة ببيانات المستخدم الحالي
      const updatedAnswer = {
        ...addedAnswer,
        user: {
          name: session.user.name || "مستخدم مجهول",
          image: session.user.image || null,
        },
      };

      setAnswers((prev) => [...prev, updatedAnswer]); // تحديث الإجابات فورًا
      setNewAnswer(""); // إعادة تعيين النص المدخل
    } catch (error) {
      console.error("خطاء في اضافة المشاركة:", error.response?.data || error.message);
    }
  },
    [id, newAnswer, session]
  );

  const handleVote = useCallback(async (answerId, value) => {
    if (!session) {
      setAlertData({
        title: `${intl.formatMessage({ id: "alert" })}`,
        content: `${intl.formatMessage({ id: "mostLoginToVote" })}`,
      });
      return;
    }

    try {
      const res = await axios.post("/api/votes", { answerId, value });
      if (res.status === 200 || res.status === 201) {
        setAnswers((prevAnswers) =>
          prevAnswers.map((answer) =>
            answer.id === answerId
              ? {
                ...answer,
                upvotes:
                  value === 1
                    ? answer.upvotes + (answer.userVote === 1 ? 0 : 1)
                    : answer.upvotes - (answer.userVote === 1 ? 1 : 0),
                downvotes:
                  value === -1
                    ? answer.downvotes + (answer.userVote === -1 ? 0 : 1)
                    : answer.downvotes - (answer.userVote === -1 ? 1 : 0),
                userVote: value,
                animateUp: value === 1,
                animateDown: value === -1,
              }
              : answer
          )
        );
      }
    } catch (error) {
      console.error("خطاء في التصويت:", error.response?.data || error.message);
    }
  }, [session]);

  useEffect(() => {
    if (alertData) {
      const timer = setTimeout(() => setAlertData(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertData]);

  const toggleSaveQuestion = useCallback(async (questionId) => {
    try {
      await axios.post("/api/saved-questions", { questionId });
      setSavedQuestions((prev) => {
        const newSaved = new Set(prev);
        newSaved.has(questionId) ? newSaved.delete(questionId) : newSaved.add(questionId);
        return newSaved;
      });
    } catch (error) {
      console.error("خطاء في عمليات حفظ السؤال:", error);
    }
  }, []);

  const sortedAnswers = useMemo(() => {
    const sorted = [...answers];
    if (sortOrder === "highest") {
      sorted.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    } else if (sortOrder === "lowest") {
      sorted.sort((a, b) => (a.upvotes - a.downvotes) - (b.upvotes - b.downvotes));
    } else {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return sorted;
  }, [answers, sortOrder]);

  const handleSortChange = useCallback((newSortOrder) => {
    setSortOrder(newSortOrder);
  }, []);

  useEffect(() => {
    document.title = "صفحة تفاصيل السؤال  | سينكو";
  }, []);

  if (loading) return (
    <MainLayout>
      <SkeletonQuestionDetails />
      <SkeletonAnswerItem limit={3} />
    </MainLayout>
  );

  if (!question) return <MainLayout><p className="pt-20 text-red-500 text-center"><FormattedMessage id="can'tFoundQuestion" /></p></MainLayout>;

  return (
    <MainLayout
      header={
        <Header
          question={question}
          session={session}
          savedQuestions={savedQuestions}
          toggleSaveQuestion={toggleSaveQuestion}
        />
      }
    >
      {alertData && (
        <Alert
          title={alertData.title}
          content={alertData.content}
        />
      )}
      <div className="md:flex flex-row justify-between items-center px-6 py-8">
        <p className="text-gray-700 dark:text-gray-300" style={{ fontLoading: "eager" }}>
          {question.content}
        </p>
        <CategoryTags categories={question.category} />
      </div>

      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 px-6 py-2 border border-x-gray-50 border-y-gray-100 dark:border-x-gray-800 dark:border-y-gray-900 w-full">
        <h3 className="my-2 font-bold text-secondary text-lg"><FormattedMessage id="official.answer" /></h3>
      </div>
      <OfficialAnswer answers={answers} />

      <hr className="py-2 border-gray-100 dark:border-gray-800" />

      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 px-6 py-2 w-full">
        <h3 className="my-2 font-semibold text-secondary text-lg"><FormattedMessage id="users.answers" /></h3>
        <SortDropdown onSortChange={handleSortChange} />
      </div>

      <div className="mx-auto p-6 max-w-7xl" ref={answersRef}>
        {sortedAnswers.length > 0 ? (
          <ul className="space-y-4">
            {sortedAnswers.filter((a) => !a.isOfficial).map((answer) => (
              <UserAnswer
                key={answer.id}
                answer={answer}
                handleVote={handleVote}
                session={session}
              />
            ))}
          </ul>
        ) : (
          <p className="my-4"><FormattedMessage id="noPosts" /></p>
        )}

        {session && (
          <form onSubmit={handleSubmit} className="mt-6">
            <TipTapEditor value={newAnswer} onChange={setNewAnswer} />
            <button
              type="submit"
              className="bg-primary hover:bg-secondary mt-4 px-4 py-2 rounded text-white"
            >
              <FormattedMessage id="addYourAnswer" />
            </button>
          </form>
        )}
      </div>
    </MainLayout>
  );
}
