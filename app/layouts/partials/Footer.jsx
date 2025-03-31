"use client";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { memo } from "react";

const Footer = memo(() => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 mt-auto py-5 border-gray-300 dark:border-gray-800 border-t">
      <div className="mx-auto max-w-md text-lightText dark:text-darkText text-sm text-center">
        <FormattedMessage id="copyright" />
        <Link href="/" className="mx-1 font-semibold text-primary hover:text-secondary hover:underline">
          <FormattedMessage id="app.name" />
        </Link>
      </div>
    </footer>
  );
});

export default Footer;