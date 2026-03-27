"use client";

import { useState } from "react";

interface ResultDisplayProps {
  id: string;
  endpoints: string[];
  baseUrl: string;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 shrink-0 rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 hover:bg-gray-600 transition-colors"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

const METHODS = ["GET", "POST", "PUT", "DELETE"] as const;

export default function ResultDisplay({ id, endpoints, baseUrl }: ResultDisplayProps) {
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
    </div>
  );
}
