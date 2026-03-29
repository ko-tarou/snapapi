import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Developer Tools - JSON Formatter, Validator | SnapAPI",
  description:
    "Free online developer tools: JSON Formatter, JSON Validator. No signup required.",
  alternates: {
    canonical: "https://snapapi.akokoa1221.workers.dev/tools",
  },
};

const TOOLS = [
  {
    title: "JSON Formatter",
    desc: "Format and beautify JSON",
    href: "/tools/json-formatter",
  },
  {
    title: "JSON Validator",
    desc: "Validate JSON syntax",
    href: "/tools/json-validator",
  },
];

export default function ToolsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-950 text-white">
      <section className="w-full max-w-3xl px-4 pt-20 pb-12 text-center">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight"
        >
          Snap<span className="text-emerald-400">API</span>
        </Link>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Free Developer Tools
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Useful tools for working with JSON and APIs
        </p>
      </section>

      <section className="w-full max-w-3xl px-4 pb-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-xl border border-gray-800 bg-gray-900/50 p-6 transition hover:border-emerald-700 hover:bg-gray-900"
            >
              <h2 className="text-xl font-bold group-hover:text-emerald-400">
                {tool.title}
              </h2>
              <p className="mt-2 text-sm text-gray-400">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="w-full border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        Powered by{" "}
        <Link href="/" className="text-emerald-400 hover:underline">
          SnapAPI
        </Link>
      </footer>
    </main>
  );
}
