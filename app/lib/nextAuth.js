import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// تأكد من الاتصال بـ Prisma
async function connectToDatabase() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully!");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

// اتصل بـ Prisma عند تهيئة التطبيق
connectToDatabase();

export const authOptions = {
    debug: true, // عرض الأخطاء في الكونسول
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({ // ✅ إضافة Google OAuth
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHubProvider({  // ✅ إضافة GitHub OAuth
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        // تسجيل الدخول عبر البريد الإلكتروني وكلمة المرور
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "user@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("المستخدم غير موجود أو لم يسجل بكلمة مرور");
                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                if (!isValidPassword) {
                    throw new Error("كلمة المرور غير صحيحة");
                }

                return user;
            },
        }),
    ],
    pages: {
        signIn: "/auth/login", // ← ← هنا نوجه صفحة تسجيل الدخول
        error: "/auth/login",  // ← ← وهنا أيضًا نوجه الأخطاء إلى نفس الصفحة
    },
    session: {
        strategy: "jwt",
        maxAge: 1 * 24 * 60 * 60 // 1 Day
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
                token.role = user.role; // ✅ تأكد من تضمين role
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.image;
                session.user.role = token.role; // ✅ تضمين role في session
            }
            return session;
        },
        async signIn({ user, account }) {
            if (account?.provider === "github") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (existingUser && existingUser.provider !== "github") {
                    throw new Error(
                        "هذا البريد الإلكتروني مسجل بالفعل باستخدام Google. يرجى تسجيل الدخول باستخدام Google."
                    );
                }
            }
            return true;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
