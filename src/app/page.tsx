import DropZone from "@/components/DropZone";

const FEATURES = [
  {
    title: "Instant",
    desc: "Drop JSON, get URL. Your mock API is live in seconds.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Full CRUD",
    desc: "GET, POST, PUT, DELETE out of the box for every resource.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    ),
  },
  {
    title: "CORS Ready",
    desc: "Use from any frontend. No proxy needed.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18c1.657 0 3-4.03 3-9s-1.343-9-3-9" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
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
          No signup required. No credit card. Just JSON.
        </p>
      </section>

      {/* DropZone */}
      <section className="w-full max-w-3xl px-4 pb-20">
        <DropZone />
      </section>

      {/* Features */}
      <section className="w-full border-t border-gray-800 bg-gray-900/50 py-16">
        <div className="mx-auto grid max-w-3xl gap-8 px-4 sm:grid-cols-3">
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
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        SnapAPI &middot; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
