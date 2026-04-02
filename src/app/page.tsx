import DropZone from "@/components/DropZone";
import LiveDemo from "@/components/LiveDemo";
import Link from "next/link";

const FEATURES = [
  {
    title: "Instant",
    desc: "Drop JSON, get a URL instantly.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Full CRUD",
    desc: "GET, POST, PUT, DELETE out of the box.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    ),
  },
  {
    title: "Webhook Testing",
    desc: "Capture and inspect incoming webhook requests.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    title: "Auto Generate",
    desc: "Create realistic mock data from a schema.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Simulate Latency",
    desc: "Test slow APIs with configurable delays.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Error Simulation",
    desc: "Trigger random errors to test resilience.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    num: 1,
    title: "Drop your JSON",
    desc: "Paste or drag a JSON file with your mock data.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    num: 2,
    title: "Get your API",
    desc: "Instant REST endpoints with full CRUD support.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    num: 3,
    title: "Use anywhere",
    desc: "CORS-enabled URLs ready for any frontend.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "SnapAPI",
            "url": "https://snapapi.akokoa1221.workers.dev",
            "description": "Create instant mock REST APIs from JSON in 5 seconds",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      <main className="flex min-h-screen flex-col items-center bg-gray-950 text-white">
      {/* Hero */}
      <section className="flex w-full max-w-3xl flex-col items-center px-4 pt-20 pb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          Snap<span className="text-emerald-400">API</span>
        </h1>
        <p className="mt-4 text-lg text-gray-400 sm:text-xl">
          Drop your JSON, get a REST API in 5 seconds.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          No signup. No credit card. Free forever.
        </p>
      </section>

      {/* DropZone */}
      <section className="w-full max-w-3xl px-4 pb-20">
        <DropZone />
      </section>

      {/* Live Demo */}
      <section className="w-full max-w-3xl px-4 pb-16">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Try it live
        </h2>
        <LiveDemo />
      </section>

      {/* How it works */}
      <section className="w-full border-t border-gray-800 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.num} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900/50 text-emerald-400">
                  <span className="text-lg font-bold">{s.num}</span>
                </div>
                <div className="mb-2 text-emerald-400">{s.icon}</div>
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full border-t border-gray-800 bg-gray-900/50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Features
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col items-start">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-900/50 text-emerald-400">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        <div className="mb-2">
          Free Tools:{" "}
          <Link href="/tools/json-formatter" className="text-emerald-400 hover:underline">
            JSON Formatter
          </Link>
          {" | "}
          <Link href="/tools/json-validator" className="text-emerald-400 hover:underline">
            JSON Validator
          </Link>
          {" | "}
          <Link href="/tools/json-to-typescript" className="text-emerald-400 hover:underline">
            JSON to TypeScript
          </Link>
          {" | "}
          <Link href="/tools/fake-data-generator" className="text-emerald-400 hover:underline">
            Fake Data Generator
          </Link>
        </div>
        SnapAPI &middot; {new Date().getFullYear()}
      </footer>
    </main>
    </>
  );
}
