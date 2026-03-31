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

const GENERATE_JSON = JSON.stringify({
  _generate: {
    users: {
      count: 5,
      schema: {
        id: "autoincrement",
        name: "name",
        email: "email",
        age: "number:18-65",
        active: "boolean",
      },
    },
    posts: {
      count: 10,
      schema: {
        id: "autoincrement",
        title: "text:title",
        body: "text:paragraph",
        userId: "number:1-5",
        createdAt: "date:past",
      },
    },
  },
}, null, 2);

interface SimConfig {
  delay?: number;
  errorRate?: number;
  errorStatus?: number;
}

interface ApiResult {
  id: string;
  endpoints: string[];
  url: string;
  webhookUrl?: string;
  config?: SimConfig;
}

export default function DropZone() {
  const [json, setJson] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [delay, setDelay] = useState(0);
  const [errorRate, setErrorRate] = useState(0);
  const [errorStatus, setErrorStatus] = useState(500);

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
      let bodyToSend = json;
      if (delay > 0 || errorRate > 0) {
        try {
          const parsed = JSON.parse(json);
          parsed._config = {
            delay,
            errorRate: errorRate / 100,
            errorStatus,
          };
          bodyToSend = JSON.stringify(parsed);
        } catch {
          // Let the server handle parse errors
        }
      }
      const res = await fetch("/api/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyToSend,
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
        <button
          onClick={() => {
            setJson(GENERATE_JSON);
            setError("");
            setResult(null);
          }}
          className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
        >
          Generate sample data
        </button>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          {showAdvanced ? "Hide" : "Show"} Advanced Settings
        </button>
        {showAdvanced && (
          <div className="mt-3 rounded-lg border border-gray-700 bg-gray-900 p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Delay (ms)
              </label>
              <input
                type="number"
                min={0}
                max={5000}
                step={100}
                value={delay}
                onChange={(e) => setDelay(Math.min(5000, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Error Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={errorRate}
                onChange={(e) => setErrorRate(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Error Status Code
              </label>
              <select
                value={errorStatus}
                onChange={(e) => setErrorStatus(Number(e.target.value))}
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-emerald-600"
              >
                <option value={500}>500 Internal Server Error</option>
                <option value={503}>503 Service Unavailable</option>
                <option value={429}>429 Too Many Requests</option>
                <option value={400}>400 Bad Request</option>
                <option value={404}>404 Not Found</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}

      {result && (
        <ResultDisplay
          id={result.id}
          endpoints={result.endpoints}
          baseUrl={typeof window !== "undefined" ? window.location.origin : ""}
          webhookUrl={result.webhookUrl}
          config={result.config}
        />
      )}
    </div>
  );
}
