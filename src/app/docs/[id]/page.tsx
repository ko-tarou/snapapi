import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getEndpoint } from "@/lib/db";
import CopyButton from "@/components/CopyButton";
import DownloadButton from "@/components/DownloadButton";
import WebhookLogs from "@/components/WebhookLogs";

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

  const data = JSON.parse(endpoint.data) as Record<string, unknown>;
  const rawConfig = data._config as Record<string, unknown> | undefined;
  const simConfig = rawConfig
    ? {
        delay: Number(rawConfig.delay) || 0,
        errorRate: Number(rawConfig.errorRate) || 0,
        errorStatus: Number(rawConfig.errorStatus) || 500,
      }
    : null;
  const resources = Object.keys(data).filter((k) => k !== "_config");
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}/api/mock/${id}`;
  const webhookUrl = `${proto}://${host}/api/webhook/${id}`;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">
          API <span className="text-emerald-400">Documentation</span>
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Endpoint ID: <code className="text-gray-300">{id}</code>
        </p>

        {/* Base URL & OpenAPI Download */}
        <div className="mt-6 flex items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 border border-gray-800">
          <code className="min-w-0 flex-1 truncate text-sm text-gray-200">
            {baseUrl}
          </code>
          <DownloadButton
            url={`${baseUrl}/openapi`}
            filename={`openapi-${id}.json`}
          />
          <CopyButton text={baseUrl} label="Copy URL" />
        </div>

        {/* Simulation Config */}
        {simConfig && (simConfig.delay > 0 || simConfig.errorRate > 0) && (
          <section className="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-5">
            <h2 className="text-lg font-semibold mb-3">Simulation Settings</h2>
            <div className="space-y-2 text-sm text-gray-300">
              {simConfig.delay > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Delay</span>
                  <span>{simConfig.delay}ms</span>
                </div>
              )}
              {simConfig.errorRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Error Rate</span>
                  <span>{Math.round(simConfig.errorRate * 100)}%</span>
                </div>
              )}
              {simConfig.errorRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Error Status</span>
                  <span>{simConfig.errorStatus}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Resources */}
        <div className="mt-8 space-y-6">
          {resources.map((res) => {
            const items = data[res] as unknown[];
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

        {/* Webhooks */}
        <div className="mt-8">
          <WebhookLogs endpointId={id} webhookUrl={webhookUrl} />
        </div>
      </div>
    </main>
  );
}
