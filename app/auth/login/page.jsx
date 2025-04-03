"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Github, Loader, Mail, RectangleEllipsis } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import Link from "next/link";
import AuthLayout from "@/app/layouts/AuthLayout";

export const dynamic = "force-dynamic"; // ⬅️ هذا السطر يمنع Next.js من معالجة الصفحة أثناء الـ build

export default function LoginPage() {
  const intl = useIntl(); // استخراج كائن الترجمة
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // استخراج الخطأ من الـ URL بعد تحميل الصفحة
    useEffect(() => {
      const errorParam = searchParams.get("error");
      if (errorParam) {
          setError(decodeURIComponent(errorParam));
      }
  }, [searchParams]); // تحديث الخطأ عند تغيير الـ searchParams

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/"); // إعادة التوجيه إذا كان المستخدم مسجلاً
    }
  }, [status, router]);


  // تسجيل الدخول عبر البريد الإلكتروني وكلمة المرور
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true)
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("خطأ في تسجيل الدخول، تأكد من البريد الإلكتروني وكلمة المرور");
      setLoading(false)
    } else {
      setLoading(false)
      router.push("/"); // بعد تسجيل الدخول، انتقل الصفحة الرئيسية
    }
  };

  return (
    <AuthLayout titleId="title.login">
      <Suspense fallback={<div>Loading ...</div>}>
        {error && <p className="mb-2 text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <label htmlFor="UserEmail" className="sr-only"> <FormattedMessage id="input.email" /> </label>
            <input
              type="email"
              placeholder={intl.formatMessage({ id: "input.email" })}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full"
              required
            />

            <span className="absolute inset-y-0 place-content-center grid w-10 text-gray-500 pointer-events-none end-0">
              <Mail size={20} className="text-gray-400" />
            </span>
          </div>

          <div className="relative">
            <label htmlFor="UserPassword" className="sr-only"> <FormattedMessage id="input.password" /> </label>
            <input
              type="password"
              placeholder={intl.formatMessage({ id: "input.password" })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="dark:bg-gray-700 px-4 py-2 border focus:border-primary dark:border-gray-600 rounded focus:outline-none w-full"
              required
            />

            <span className="absolute inset-y-0 place-content-center grid w-10 text-gray-500 pointer-events-none end-0">
              <RectangleEllipsis size={20} className="text-gray-400" />
            </span>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-secondary px-4 py-2 rounded w-full font-bold text-white"
          >
            {
              loading ?
                <div className="flex justify-center items-center gap-2">
                  <FormattedMessage id="btn.login" />
                  <Loader size={20} className="text-white animate-spin" />
                </div>
                : <FormattedMessage id="btn.login" />
            }
          </button>
        </form>

        <span className="relative flex justify-center py-5">
          <div
            className="top-1/2 absolute inset-x-0 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75 h-px -translate-y-1/2"
          ></div>

          <span className="z-10 relative bg-white dark:bg-gray-800 px-6"><FormattedMessage id="continueWith" /></span>
        </span>

        <div className="flex justify-center items-center gap-5">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex justify-center items-center gap-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-900 mb-4 px-4 py-2 border dark:border-gray-600 rounded w-full font-bold"
          >
            <FormattedMessage id="google" /> <Image src="/imgs/google.png" alt="login-google" width="20" height="20" priority />
          </button>

          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="flex justify-center items-center gap-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-900 mb-4 px-4 py-2 border dark:border-gray-600 rounded w-full font-bold"
          >
            <FormattedMessage id="github" /> <Github size={20} />

          </button>
        </div>

        <p className="mt-4 text-center">
          <FormattedMessage id="dontHaveAccount" /> {" "}
          <Link href="/auth/signup" className="hover:font-bold text-secondary hover:text-primary dark:text-primary hover:underline">
            <FormattedMessage id="signup.now" />
          </Link>
        </p>
      </Suspense>
    </AuthLayout>
  );
}
