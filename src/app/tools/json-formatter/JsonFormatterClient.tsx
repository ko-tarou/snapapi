"use client";

import { useState } from "react";

export default function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function format() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }

  function minify() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }

  async function copy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Paste your JSON here...'
        className="h-48 w-full rounded-lg border border-gray-700 bg-gray-900 p-4 font-mono text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
      />

      <div className="flex gap-3">
        <button
          onClick={format}
          className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Format
        </button>
        <button
          onClick={minify}
          className="rounded-lg border border-gray-700 px-5 py-2 text-sm font-semibold text-gray-300 transition hover:border-gray-500 hover:text-white"
        >
          Minify
        </button>
        <button
          onClick={copy}
          disabled={!output}
          className="rounded-lg border border-gray-700 px-5 py-2 text-sm font-semibold text-gray-300 transition hover:border-gray-500 hover:text-white disabled:opacity-40 disabled:hover:border-gray-700 disabled:hover:text-gray-300"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {output && (
        <textarea
          readOnly
          value={output}
          className="h-48 w-full rounded-lg border border-gray-700 bg-gray-900 p-4 font-mono text-sm text-emerald-300 focus:outline-none"
        />
      )}
    </div>
  );
}
