"use client";

import { useState, useCallback, type DragEvent } from "react";
import ResultDisplay from "./ResultDisplay";

const SAMPLE_JSON = `{
  "users": [
    { "id": 1, "name": "Alice", "email": "alice@example.com" },
    { "id": 2, "name": "Bob", "email": "bob@example.com" }
  ],
  "posts": [
    { "id": 1, "title": "Hello World", "userId": 1 },
    { "id": 2, "title": "Getting Started", "userId": 2 }
  ]
}`;

interface ApiResult {
  id: string;
  endpoints: string[];
  url: string;
}

export default function DropZone() {
  const [json, setJson] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ApiResult | null>(null);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragging(false), []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setJson(ev.target?.result as string);
    reader.readAsText(file);
  }, []);

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    if (!json.trim()) {
      setError("Please enter or drop a JSON file.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create API.");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-1 transition-colors ${
          dragging
            ? "border-emerald-400 bg-emerald-950/30"
            : "border-gray-700 bg-gray-900"
        }`}
      >
        <textarea
          value={json}
          onChange={(e) => {
            setJson(e.target.value);
            setError("");
          }}
          placeholder="Paste your JSON here or drag & drop a .json file..."
          rows={10}
          className="w-full resize-none rounded bg-transparent p-3 font-mono text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
        />
      </div>

      <div className="mt-3 flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create API"}
        </button>
        <button
          onClick={() => {
            setJson(SAMPLE_JSON);
            setError("");
            setResult(null);
          }}
          className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
        >
          Try with example
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}

      {result && (
        <ResultDisplay
          id={result.id}
          endpoints={result.endpoints}
          baseUrl={typeof window !== "undefined" ? window.location.origin : ""}
        />
      )}
    </div>
  );
}
