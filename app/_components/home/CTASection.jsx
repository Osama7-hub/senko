"use client";
import Link from "next/link";
import { FormattedMessage } from "react-intl";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-primary to-secondary py-16 text-white text-center">
      <h2 className="mb-4 font-bold text-3xl"><FormattedMessage id="home.CTAs" /></h2>
      <p className="mx-auto mb-6 max-w-2xl text-lg">
        <FormattedMessage id="home.CTAsContent" />
      </p>
      <Link href="/signup" className="bg-white hover:bg-gray-100 shadow-md px-6 py-3 rounded-lg font-semibold text-primary transition">
        <FormattedMessage id="home.btn.CTA" />
      </Link>
    </section>
  );
}
