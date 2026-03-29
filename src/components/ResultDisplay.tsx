"use client";

import Link from "next/link";
import CopyButton from "./CopyButton";

interface SimConfig {
  delay?: number;
  errorRate?: number;
  errorStatus?: number;
}

interface ResultDisplayProps {
  id: string;
  endpoints: string[];
  baseUrl: string;
  config?: SimConfig;
}

const METHODS = ["GET", "POST", "PUT", "DELETE"] as const;

export default function ResultDisplay({ id, endpoints, baseUrl, config }: ResultDisplayProps) {
  const apiBase = `${baseUrl}/api/mock/${id}`;

  return (
    <div className="mt-6 w-full rounded-lg border border-emerald-800 bg-gray-900 p-4">
      <h3 className="mb-3 text-sm font-semibold text-emerald-400">
        API Created Successfully
      </h3>

      <div className="mb-4 flex items-center rounded bg-gray-800 px-3 py-2">
        <code className="min-w-0 flex-1 truncate text-sm text-gray-200">
          {apiBase}
        </code>
        <CopyButton text={apiBase} label="Copy URL" />
      </div>

      {config && (config.delay || config.errorRate) ? (
        <div className="mb-4 rounded bg-gray-800 px-3 py-2 text-sm text-gray-300">
          <span className="font-medium text-emerald-400">Simulation:</span>{" "}
          {config.delay ? `${config.delay}ms delay` : ""}
          {config.delay && config.errorRate ? ", " : ""}
          {config.errorRate
            ? `${Math.round(config.errorRate * 100)}% error rate (${config.errorStatus ?? 500})`
            : ""}
        </div>
      ) : null}

      <div className="space-y-3">
        {endpoints.map((ep) => {
          const url = `${apiBase}/${ep}`;
          const curl = `curl ${url}`;
          return (
            <div key={ep} className="rounded bg-gray-800 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-sm font-medium text-white">
                  /{ep}
                </span>
                <CopyButton text={curl} label="cURL" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {METHODS.map((m) => (
                  <span
                    key={m}
                    className="rounded bg-gray-700 px-2 py-0.5 text-xs font-mono text-emerald-300"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <Link
          href={`/docs/${id}`}
          className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View API Docs &rarr;
        </Link>
        <a
          href={`/api/mock/${id}/openapi`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          OpenAPI Spec &darr;
        </a>
      </div>
    </div>
  );
}
