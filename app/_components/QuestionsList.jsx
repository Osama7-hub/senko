"use client";

import { useState, useEffect, useCallback, memo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import { useIntl } from "react-intl";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Frown,
  Search,
  Tags,
} from "lucide-react";
import Link from "next/link";
import { SkeletonQuestionItem } from "./Skeletons";
import QuestionsMetadata from "./QuestionsMetadata";


// مكون منفصل لعرض الفئات
const CategoryTags = memo(({ categories, onCategorySelect, selectedCategory }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {categories.map((category) => {
      const isCategorySelected = selectedCategory === category;
      return (
        <button
          key={category}
          onClick={() => onCategorySelect(category, isCategorySelected)}
          className={`flex items-center gap-1 px-3 py-1 text-sm hover:bg-primary dark:hover:bg-primary hover:text-white shadow capitalize ${isCategorySelected ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800"
            }`}
        >
          <Tags size={15} /> {category}
        </button>
      );
    })}
  </div>
));

// مكون منفصل لعرض السؤال
const QuestionItem = memo(({ question, savedQuestions, toggleSaveQuestion, onCategorySelect, session }) => (
  <li className="hover:bg-gray-50 dark:hover:bg-gray-800 p-4 border-gray-100 dark:border-gray-800 border-b transition">
    <div className="flex justify-between items-center">
      <Link href={`/question/${question.id}`}>
        <h2 className="font-semibold text-secondary hover:text-primary dark:text-primary text-lg cursor-pointer">
          {question.title}
        </h2>
      </Link>
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
    <div className="flex mt-2 text-gray-500 text-sm">
      {question.category.map((cat, index) => (
        <button
          key={index}
          onClick={() => onCategorySelect(cat, false)}
          className="flex items-center gap-1 bg-greenLight hover:bg-primary dark:bg-gray-950 dark:hover:bg-primary shadow mx-1 px-3 py-1 border dark:border-gray-700 rounded-full hover:text-white dark:text-gray-50 text-sm capitalize"
        >
          <Tags size={15} /> <span>{cat}</span>
        </button>
      ))}
    </div>
  </li>
));

// مكون منفصل للتنقل بين الصفحات
const Pagination = memo(({ page, totalPages, onPageChange }) => (
  <ol className="flex justify-center gap-1 font-medium text-xs">
    <li>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="inline-flex justify-center items-center bg-white hover:bg-greenLight dark:bg-gray-800 dark:hover:bg-primary disabled:opacity-50 border border-gray-100 dark:border-gray-900 rounded-sm size-8 dark:text-gray-50 rtl:rotate-180"
      >
        <span className="sr-only">Prev Page</span>
        <ChevronLeft size={18} className="text-gray-500" />
      </button>
    </li>
    {[...Array(totalPages)].map((_, index) => (
      <li key={index} className="text-center">
        <button
          onClick={() => onPageChange(index + 1)}
          className={`block size-8 rounded-sm border border-gray-100 dark:border-gray-900 text-center hover:bg-greenLight dark:hover:bg-primary leading-8 ${page === index + 1
            ? "bg-primary hover:bg-primary text-white border-primary"
            : "bg-white dark:bg-gray-800"
            }`}
        >
          {index + 1}
        </button>
      </li>
    ))}
    <li>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="inline-flex justify-center items-center bg-white hover:bg-greenLight dark:bg-gray-800 dark:hover:bg-primary disabled:opacity-50 border border-gray-100 dark:border-gray-900 rounded-sm size-8 dark:text-gray-50 rtl:rotate-180"
      >
        <span className="sr-only">Next Page</span>
        <ChevronRight size={18} className="text-gray-500" />
      </button>
    </li>
  </ol>
));

// مكون منفصل لرأس الصفحة
const Header = memo(({ searchQuery, onSearchChange, onSearch, toggleOrder, order, intl }) => (
  <div className="flex md:flex-row flex-col-reverse justify-between items-center gap-4">
    <div className="relative w-full md:w-3/4">
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        onKeyDown={onSearch}
        placeholder={intl.formatMessage({ id: "input.search" })}
        className="dark:bg-gray-700 shadow px-4 py-2 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full text-base"
      />
      <span className="absolute inset-y-0 place-content-center grid w-10 text-gray-500 pointer-events-none end-0">
        <Search size={20} className="text-gray-400" />
      </span>
    </div>
    <div className="flex shadow">
      <button
        onClick={() => toggleOrder("desc")}
        className={`flex gap-1 px-4 py-2 border dark:border-gray-700 text-gray-600 dark:text-gray-200 rounded-s text-sm hover:bg-primary hover:text-white ${order === "desc" ? "bg-primary text-white" : ""
          }`}
      >
        الأحدث <ArrowDownWideNarrow size={20} />
      </button>
      <button
        onClick={() => toggleOrder("asc")}
        className={`flex gap-1 px-4 py-2 border dark:border-gray-700 text-gray-600 dark:text-gray-200 rounded-e text-sm hover:bg-primary hover:text-white ${order === "asc" ? "bg-primary text-white" : ""
          }`}
      >
        الأقدم <ArrowUpNarrowWide size={20} />
      </button>
    </div>
  </div>
));

export default function QuestionsPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const intl = useIntl();

  const page = parseInt(searchParams.get("page")) || 1;
  const selectedCategory = searchParams.get("category") || null;
  const initialSearch = searchParams.get("search") || "";
  const initialOrderBy = searchParams.get("order") || "desc";
  const limit = 5;

  const [questions, setQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState(new Set());
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [noResults, setNoResults] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [order, setOrder] = useState(initialOrderBy);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "صفحة الأسئلة - سينكو";
  }, []);

  // جلب الأسئلة والأسئلة المحفوظة
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const query = `?page=${page}&limit=${limit}&order=${order}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ""}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`;
      const [questionsRes, savedRes] = await Promise.all([
        axios.get(`/api/questions${query}`),
        session ? axios.get("/api/saved-questions") : Promise.resolve({ data: [] }),
      ]);

      const { questions, totalPages } = questionsRes.data;
      setQuestions(questions || []);
      setTotalPages(totalPages || 1);
      setNoResults(questions.length === 0);
      extractCategories(questions || []);

      if (session) {
        setSavedQuestions(new Set(savedRes.data.map((q) => q.questionId)));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setQuestions([]);
      setTotalPages(1);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, searchQuery, order, session, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // استخراج الفئات
  const extractCategories = useCallback((questions) => {
    const uniqueCategories = new Set();
    questions.forEach((q) => q.category.forEach((cat) => uniqueCategories.add(cat)));
    setCategories([...uniqueCategories]);
  }, []);

  // التعامل مع البحث
  const handleSearchChange = useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
  }, []);

  const handleSearch = useCallback(
    (e) => {
      if (e.key === "Enter") {
        router.push(`?search=${encodeURIComponent(searchQuery)}&page=1&order=${order}`);
      }
    },
    [searchQuery, order, router]
  );

  // تغيير الصفحة
  const handlePageChange = useCallback(
    (newPage) => {
      router.push(
        `?page=${newPage}&order=${order}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ""
        }${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`
      );
    },
    [order, selectedCategory, searchQuery, router]
  );

  // تغيير الترتيب
  const toggleOrder = useCallback(
    (newOrder) => {
      setOrder(newOrder);
      router.push(
        `?page=1&order=${newOrder}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ""
        }${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`
      );
    },
    [selectedCategory, searchQuery, router]
  );

  // التعامل مع اختيار الفئة
  const handleCategorySelect = useCallback(
    (category, isCategorySelected) => {
      router.push(
        isCategorySelected
          ? "?page=1"
          : `?category=${encodeURIComponent(category)}&page=1`
      );
    },
    [router]
  );

  // التعامل مع حفظ السؤال
  const toggleSaveQuestion = useCallback(
    async (questionId) => {
      try {
        await axios.post("/api/saved-questions", { questionId });
        setSavedQuestions((prev) => {
          const newSaved = new Set(prev);
          newSaved.has(questionId) ? newSaved.delete(questionId) : newSaved.add(questionId);
          return newSaved;
        });
      } catch (error) {
        console.error("Error toggling save:", error);
      }
    },
    []
  );

  return (
    <MainLayout
      header={
        <Header
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          toggleOrder={toggleOrder}
          order={order}
          intl={intl}
        />
      }
    >
      <Suspense fallback={<SkeletonQuestionItem limit={limit} />}>
        <div className="mx-auto p-6 max-w-7xl">
        <QuestionsMetadata />
          <CategoryTags
            categories={categories}
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
          {
            loading ? (<SkeletonQuestionItem limit={limit} />) : noResults ?
              (
                <p className="flex justify-center gap-2 mt-32 h-[85vh] text-gray-500 dark:text-gray-400 text-center">
                  لم يتم العثور على نتائج تطابق البحث <Frown size={20} className="text-primary" />
                </p>
              ) : (
                <>
                  <ul className="space-y-1 h-[85vh]">
                    {questions.map((question) => (
                      <QuestionItem
                        key={question.id}
                        question={question}
                        savedQuestions={savedQuestions}
                        toggleSaveQuestion={toggleSaveQuestion}
                        onCategorySelect={handleCategorySelect}
                        session={session}
                      />
                    ))}
                  </ul>
                  <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
              )}
        </div>
      </Suspense>
    </MainLayout>
  );
}