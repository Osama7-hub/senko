"use client";
import { useEffect, useRef, useState, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { MessageCircleQuestion } from "lucide-react";
import ThemeToggle from "@/app/_components/ThemeToggle";
import { FormattedMessage } from "react-intl";
import Image from "next/image";
import ThemeSwitcher from "@/app/_components/ThemeColorSwitcher";

const Header = memo(() => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header className="z-20 bg-gray-50 dark:bg-gray-800 shadow-md w-full">
      <div className="flex justify-between items-center mx-auto px-5 min-h-14 container">
        <Link href="/" className="flex items-center gap-1 font-semibold text-lg hover:scale-105 transition cursor-pointer">
          <MessageCircleQuestion size={30} className="text-primary" />
          <span>
            <FormattedMessage id="app.name" />
          </span>
        </Link>

        <ul className="hidden md:flex gap-1">
          <Link href="/home"
            className={`py-4 px-6 ${pathname === "/home" ? "text-primary bg-gray-100 border-t-4 border-x dark:border-x-gray-700 border-t-primary dark:bg-gray-700 font-semibold" : "hover:bg-gray-100 hover:dark:bg-gray-900"}`}>
            <li><FormattedMessage id="header.menu.main" /></li>
          </Link>

          <Link href="/"
            className={`py-4 px-6 ${pathname === "/" || pathname.startsWith("/question") ? "text-primary bg-gray-100 border-t-4 border-x border-t-primary dark:border-x-gray-700 dark:bg-gray-700 font-semibold" : "hover:bg-gray-100 hover:dark:bg-gray-900"}`}>
            <li> <FormattedMessage id="header.menu.questions" /> </li>
          </Link>

          <Link href="/quiz"
            className={`py-4 px-6 ${pathname.startsWith("/quiz") ? "text-primary bg-gray-100 border-t-4 border-x dark:border-x-gray-700 border-t-primary dark:bg-gray-700 font-semibold" : "hover:bg-gray-100 hover:dark:bg-gray-900"}`}>
            <li> <FormattedMessage id="header.menu.quiz" /> </li>
          </Link>
          
          <Link href="/summaries"
            className={`py-4 px-6 ${pathname.startsWith("/summaries") ? "text-primary bg-gray-100 border-t-4 border-x dark:border-x-gray-700 border-t-primary dark:bg-gray-700 font-semibold" : "hover:bg-gray-100 hover:dark:bg-gray-900"}`}>
            <li> <FormattedMessage id="header.menu.summaries" /> </li>
          </Link>
        </ul>

        <ul className="md:hidden right-0 bottom-0 z-30 md:static fixed flex justify-center items-center bg-gray-50 dark:bg-gray-800 w-full text-sm">
          <li className={`p-3 ${pathname === "/home" ? "text-primary bg-gray-100 border-b-4 border-x dark:border-x-gray-700 border-b-primary dark:bg-gray-700 font-semibold" : "hover:bg-gray-100 hover:dark:bg-gray-900"}`}>
            <Link href="/home"><FormattedMessage id="header.menu.main" /></Link>
          </li>
          <li className={`p-3 ${pathname === "/" || pathname.startsWith("/question") ? "text-secondary bg-gray-100 border-b-4 border-x dark:border-x-gray-700 border-b-primary dark:bg-gray-700 font-semibold" : "hover:bg-gray-100 hover:dark:bg-gray-900"}`}>
            <Link href="/"><FormattedMessage id="header.menu.questions" /></Link>
          </li>
          <li className={`p-3 ${pathname.startsWith("/quiz") ? "text-primary bg-gray-100 border-b-4 border-x dark:border-x-gray-700 border-b-primary dark:bg-gray-700 font-semibold" : "hover:bg-gray-100 hover:dark:bg-gray-900"}`}>
            <Link href="/quiz"><FormattedMessage id="header.menu.quiz" /></Link>
          </li>
          <li className={`p-3 ${pathname.startsWith("/summaries") ? "text-primary bg-gray-100 border-b-4 border-x dark:border-x-gray-700 border-b-primary dark:bg-gray-700 font-semibold" : "hover:bg-gray-100 hover:dark:bg-gray-900"}`}>
            <Link href="/summaries"><FormattedMessage id="header.menu.summaries" /></Link>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <ThemeSwitcher />
          {session && session.user?.role === "admin" ? (
            <AdminMenu userSession={session} />
          ) : session && session.user?.role === "user" ? (
            <UserMenu userSession={session} />
          ) : (
            <GuestMenu />
          )}
        </div>

      </div>
    </header>
  );
});

function GuestMenu() {
  return (
    <Link href="/auth/login" className="hover:bg-primary px-2 py-1 border border-primary rounded-lg text-primary hover:text-white transition">
      <FormattedMessage id="header.login" />
    </Link>
  );
}

const UserMenu = memo(({ userSession }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex justify-center items-center bg-primary rounded-full w-9 h-9 text-gray-50"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {userSession?.user.image ? (
          <Image
            src={userSession?.user?.image || "/imgs/avatar.png"}
            alt="User Avatar"
            className="rounded-full w-full h-full"
            width={36}
            height={36}
            loading="lazy"
            quality={75}
          />
        ) : (
          <span>{userSession?.user?.name?.charAt(0)}</span>
        )}
      </button>
      {menuOpen && (
        <div className="left-0 z-10 absolute bg-gray-50 dark:bg-gray-800 shadow-lg mt-2 border border-gray-200 dark:border-gray-700 rounded-md w-40">
          <Link href="/profile" className="block hover:bg-gray-100 dark:hover:bg-gray-900 px-4 py-2">
            <FormattedMessage id="header.profile" />
          </Link>
          <button
            onClick={() => signOut()}
            className="flex justify-start hover:bg-gray-100 dark:hover:bg-gray-900 px-4 py-2 w-full"
          >
            <FormattedMessage id="header.logout" />
          </button>
        </div>
      )}
    </div>
  );
});

const AdminMenu = memo(({ userSession }) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex justify-center items-center bg-primary rounded-full w-9 h-9 text-gray-50"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {userSession?.user?.image ? (
          <Image
            src={user?.user?.image}
            alt="User Avatar"
            className="rounded-full w-full h-full"
            width={36}
            height={36}
            loading="lazy"
            quality={75}
          />
        ) : (
          <span>{userSession?.user?.name?.charAt(0)}</span>
        )}
      </button>
      {menuOpen && (
        <div className="left-0 z-10 absolute bg-gray-50 dark:bg-gray-800 shadow-lg mt-2 border border-gray-200 dark:border-gray-700 rounded-md w-40">
          <Link href="/profile" className="block hover:bg-gray-100 dark:hover:bg-gray-900 px-4 py-2">
            <FormattedMessage id="header.profile" />
          </Link>
          {userSession.user?.role === "admin" && !pathname.startsWith("/admin") ? (
            <Link href="/admin" target="_blank" className="block hover:bg-gray-100 dark:hover:bg-gray-900 px-4 py-2">
              <FormattedMessage id="header.admin" />
            </Link>
          ) : (
            <Link href="/" className="block hover:bg-gray-100 dark:hover:bg-gray-900 px-4 py-2">
              <FormattedMessage id="header.browser" />
            </Link>
          )} 
          <button
            onClick={() => signOut()}
            className="flex justify-start hover:bg-gray-100 dark:hover:bg-gray-900 px-4 py-2 w-full"
          >
            <FormattedMessage id="header.logout" />
          </button>
        </div>
      )}
    </div>
  );
});

export default Header;