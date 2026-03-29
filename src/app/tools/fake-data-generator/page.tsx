import type { Metadata } from "next";
import Link from "next/link";
import FakeDataClient from "./FakeDataClient";

export const metadata: Metadata = {
  title: "Fake Data Generator - Random JSON Data | SnapAPI",
  description:
    "Generate realistic fake data for testing. Names, emails, dates and more. Free, no signup.",
  alternates: {
    canonical:
      "https://snapapi.akokoa1221.workers.dev/tools/fake-data-generator",
  },
};

export default function FakeDataGeneratorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-950 text-white">
      <section className="w-full max-w-3xl px-4 pt-12 pb-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-emerald-400">
            SnapAPI
          </Link>
          <span className="mx-2">&gt;</span>
          <Link href="/tools" className="hover:text-emerald-400">
            Tools
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-300">Fake Data Generator</span>
        </nav>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Fake Data Generator
        </h1>
        <p className="mt-2 text-gray-400">
          Generate realistic fake data for testing. Names, emails, dates and
          more.
        </p>

        <div className="mt-8">
          <FakeDataClient />
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center">
          <p className="text-gray-400">
            Turn this into a live API
          </p>
          <Link
            href="/"
            className="mt-2 inline-block text-lg font-semibold text-emerald-400 hover:underline"
          >
            Try SnapAPI &rarr;
          </Link>
        </div>
      </section>

      <footer className="mt-auto w-full border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        Powered by{" "}
        <Link href="/" className="text-emerald-400 hover:underline">
          SnapAPI
        </Link>
      </footer>
    </main>
  );
}
