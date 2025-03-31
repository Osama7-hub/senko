import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const url = req.nextUrl;

    // ✅ منع المستخدم غير المسجل من الوصول إلى /profile
    if (!token && url.pathname.startsWith("/profile")) {
      console.log("🔸 Unauthorized! Redirecting to /auth/login...");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // ✅ منع المستخدم المسجل دخول من الوصول إلى /auth
    if (token && url.pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ منع المستخدم غير المسجل من الوصول إلى /admin
    if (!token && url.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // ✅ منع المستخدمين غير الإداريين من الوصول إلى /admin
    if (token && token.role !== "admin" && url.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("❌ Middleware Error:", error);
    return NextResponse.next();
  }
}

// ✅ تأكد من أن matcher يغطي جميع المسارات المطلوبة
export const config = {
  matcher: ["/profile/:path*", "/admin/:path*", "/auth/:path*"],
};
