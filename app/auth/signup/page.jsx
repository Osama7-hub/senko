"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader, Mail, RectangleEllipsis, User } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import Link from "next/link";
import AuthLayout from "@/app/layouts/AuthLayout";

export default function SignUpPage() {
    const intl = useIntl(); // استخراج كائن الترجمة

    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true)

        try {
            const res = await axios.post("/api/auth/signup", {
                name,
                email,
                password,
            });

            
            if (res.status === 201) {
                setSuccess("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول");
                setLoading(false)
                setTimeout(() => router.push("/auth/login"), 2000); // الانتقال لصفحة تسجيل الدخول
            }
            if (res?.error) {
                setError("حدث خطأ أثناء انشاء الحساب");
                setLoading(false)
              }
        } catch (err) {
            setLoading(false)
            setError(err?.response?.data?.error || "حدث خطأ أثناء التسجيل");
        }
    };

    return (
        <AuthLayout titleId="title.register">
            <>
                {error && <p className="text-red-500 text-center mb-2 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-center">{success}</p>}

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="relative">
                        <label htmlFor="UserName" className="sr-only"> <FormattedMessage id="input.name" /> </label>
                        <input
                            type="text"
                            placeholder={intl.formatMessage({ id: "input.name" })}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:border-primary dark:border-gray-600 dark:bg-gray-700 focus:outline-none"
                            required
                        />

                        <span className="pointer-events-none absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500">
                            <User size={20} className="text-gray-400" />
                        </span>
                    </div>

                    <div className="relative">
                        <label htmlFor="UserEmail" className="sr-only"> <FormattedMessage id="input.email" /> </label>
                        <input
                            type="email"
                            placeholder={intl.formatMessage({ id: "input.email" })}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:border-primary dark:border-gray-600 dark:bg-gray-700 focus:outline-none"
                            required
                        />

                        <span className="pointer-events-none absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500">
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
                            className="w-full px-4 py-2 border rounded focus:border-primary dark:border-gray-600 dark:bg-gray-700 focus:outline-none"
                            required
                        />

                        <span className="pointer-events-none absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500">
                            <RectangleEllipsis size={20} className="text-gray-400" />
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded"
                    >
                        {
                            loading ?
                                <div className="flex justify-center items-center gap-2">
                                    <FormattedMessage id="btn.register" />
                                    <Loader size={20} className="text-white animate-spin" />
                                </div>
                                : <FormattedMessage id="btn.register" />
                        }
                    </button>
                </form>

                <p className="mt-4 text-center">
                    <FormattedMessage id="haveAccount" /> {" "}
                    <Link href="/auth/login" className="text-secondary hover:text-primary dark:text-primary hover:underline hover:font-bold">
                        <FormattedMessage id="title.login" />
                    </Link>
                </p>
            </>
        </AuthLayout>
    );
}
