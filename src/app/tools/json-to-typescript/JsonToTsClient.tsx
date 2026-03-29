"use client";

import { useState } from "react";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function sanitizeKey(key: string): string {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
}

function inferType(
  value: unknown,
  name: string,
  interfaces: Map<string, string>
): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const elementType = inferType(value[0], name + "Item", interfaces);
    return `${elementType}[]`;
  }
  if (typeof value === "object") {
    buildInterface(value as Record<string, unknown>, name, interfaces);
    return name;
  }
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  return "unknown";
}

function buildInterface(
  obj: Record<string, unknown>,
  name: string,
  interfaces: Map<string, string>
): void {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const childName = capitalize(key);
    const type = inferType(value, childName, interfaces);
    lines.push(`  ${sanitizeKey(key)}: ${type};`);
  }
  interfaces.set(name, `interface ${name} {\n${lines.join("\n")}\n}`);
}

function jsonToTs(json: string): string {
  const parsed = JSON.parse(json);
  const interfaces = new Map<string, string>();

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return "type Root = unknown[];";
    const first = parsed[0];
    if (typeof first === "object" && first !== null) {
      buildInterface(first as Record<string, unknown>, "Root", interfaces);
      const parts = Array.from(interfaces.values()).reverse();
      return parts.join("\n\n") + "\n\ntype RootArray = Root[];";
    }
    const t = inferType(first, "Root", interfaces);
    return `type Root = ${t}[];`;
  }

  if (typeof parsed === "object" && parsed !== null) {
    buildInterface(parsed as Record<string, unknown>, "Root", interfaces);
    return Array.from(interfaces.values()).reverse().join("\n\n");
  }

  return `type Root = ${typeof parsed};`;
}

export default function JsonToTsClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function convert() {
    try {
      const result = jsonToTs(input);
      setOutput(result);
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">
            JSON Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name": "John", "age": 30}'
            className="h-64 w-full rounded-lg border border-gray-700 bg-gray-900 p-4 font-mono text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">
            TypeScript Output
          </label>
          <textarea
            readOnly
            value={output}
            placeholder="TypeScript interfaces will appear here..."
            className="h-64 w-full rounded-lg border border-gray-700 bg-gray-900 p-4 font-mono text-sm text-emerald-300 placeholder-gray-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={convert}
          className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Convert
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
    </div>
  );
}
