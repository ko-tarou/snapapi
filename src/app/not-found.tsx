import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-center text-white">
      <p className="text-8xl font-extrabold tracking-tight text-emerald-400">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Page not found</h1>
      <p className="mt-2 text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          Go to SnapAPI &rarr;
        </Link>
        <Link
          href="/tools"
          className="inline-flex items-center justify-center rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
        >
          Try our tools &rarr;
        </Link>
      </div>
    </main>
  );
}
