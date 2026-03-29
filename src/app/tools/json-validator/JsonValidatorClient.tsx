"use client";

import { useState, useEffect } from "react";

interface ValidationResult {
  valid: boolean;
  error?: string;
  info?: string;
}

function validate(input: string): ValidationResult {
  if (!input.trim()) {
    return { valid: false, error: "" };
  }
  try {
    const parsed = JSON.parse(input);
    const info = describeStructure(parsed);
    return { valid: true, info };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid JSON";
    return { valid: false, error: msg };
  }
}

function describeStructure(data: unknown): string {
  if (Array.isArray(data)) {
    return `Array with ${data.length} item${data.length === 1 ? "" : "s"}`;
  }
  if (data !== null && typeof data === "object") {
    const keys = Object.keys(data);
    return `Object with ${keys.length} key${keys.length === 1 ? "" : "s"}`;
  }
  return `${typeof data} value`;
}

export default function JsonValidatorClient() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ValidationResult>({
    valid: false,
    error: "",
  });

  useEffect(() => {
    setResult(validate(input));
  }, [input]);

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your JSON here..."
        className="h-56 w-full rounded-lg border border-gray-700 bg-gray-900 p-4 font-mono text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
      />

      {input.trim() !== "" && (
        <div
          className={`rounded-lg border p-4 text-sm ${
            result.valid
              ? "border-emerald-800 bg-emerald-900/30 text-emerald-400"
              : "border-red-800 bg-red-900/30 text-red-400"
          }`}
        >
          {result.valid ? (
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold">Valid JSON</span>
              {result.info && (
                <span className="text-emerald-500">&mdash; {result.info}</span>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <span>{result.error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
