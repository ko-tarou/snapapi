import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getEndpoint } from "@/lib/db";
import CopyButton from "@/components/CopyButton";

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-900/60 text-emerald-300",
  POST: "bg-blue-900/60 text-blue-300",
  PUT: "bg-amber-900/60 text-amber-300",
  DELETE: "bg-red-900/60 text-red-300",
};

const METHODS = ["GET", "POST", "PUT", "DELETE"] as const;

export default async function DocsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const endpoint = await getEndpoint(id);
  if (!endpoint) notFound();

  const data = JSON.parse(endpoint.data) as Record<string, unknown[]>;
  const resources = Object.keys(data);
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}/api/mock/${id}`;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">
          API <span className="text-emerald-400">Documentation</span>
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Endpoint ID: <code className="text-gray-300">{id}</code>
        </p>

        {/* Base URL */}
        <div className="mt-6 flex items-center rounded-lg bg-gray-900 px-4 py-3 border border-gray-800">
          <code className="min-w-0 flex-1 truncate text-sm text-gray-200">
            {baseUrl}
          </code>
          <CopyButton text={baseUrl} label="Copy URL" />
        </div>

        {/* Resources */}
        <div className="mt-8 space-y-6">
          {resources.map((res) => {
            const items = data[res];
            const url = `${baseUrl}/${res}`;
            const curl = `curl ${url}`;
            const preview = JSON.stringify(items[0] ?? {}, null, 2);

            return (
              <section key={res} className="rounded-lg border border-gray-800 bg-gray-900 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">/{res}</h2>
                  <CopyButton text={curl} label="cURL" />
                </div>

                {/* Methods */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {METHODS.map((m) => (
                    <span key={m} className={`rounded px-2.5 py-0.5 text-xs font-mono font-medium ${METHOD_COLORS[m]}`}>
                      {m}
                    </span>
                  ))}
                </div>

                {/* cURL example */}
                <div className="mt-4">
                  <h3 className="mb-1 text-xs font-semibold uppercase text-gray-500">Example</h3>
                  <pre className="overflow-x-auto rounded bg-gray-800 px-3 py-2 text-xs text-gray-300">
                    {curl}
                  </pre>
                </div>

                {/* Data preview */}
                <div className="mt-4">
                  <h3 className="mb-1 text-xs font-semibold uppercase text-gray-500">
                    Preview ({items.length} item{items.length !== 1 && "s"})
                  </h3>
                  <pre className="overflow-x-auto rounded bg-gray-800 px-3 py-2 text-xs text-gray-300 max-h-40">
                    {preview}
                  </pre>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
