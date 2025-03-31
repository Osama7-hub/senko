"use client";
import Image from "next/image";
import Link from "next/link";
import { FormattedMessage } from "react-intl";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
            <Image src='/imgs/undraw_page-not-found.png' alt="404" className="w-auto h-auto" priority width='800' height='800' />
            <p className="text-xl mt-4"><FormattedMessage id="not.found" /></p>
            <Link href="/" className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-secondary">
                <FormattedMessage id="back.mainPage" />
            </Link>
        </div>
    );
}
