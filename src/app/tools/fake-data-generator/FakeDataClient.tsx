"use client";

import { useState } from "react";

type FieldType =
  | "name"
  | "email"
  | "number"
  | "boolean"
  | "text"
  | "date"
  | "uuid"
  | "url";

interface FieldDef {
  id: number;
  name: string;
  type: FieldType;
}

const FIELD_TYPES: FieldType[] = [
  "name",
  "email",
  "number",
  "boolean",
  "text",
  "date",
  "uuid",
  "url",
];

const FIRST_NAMES = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Eve",
  "Frank",
  "Grace",
  "Hank",
  "Ivy",
  "Jack",
  "Karen",
  "Leo",
  "Mia",
  "Noah",
  "Olivia",
  "Paul",
  "Quinn",
  "Ruby",
  "Sam",
  "Tina",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Wilson",
  "Taylor",
  "Anderson",
  "Thomas",
  "Moore",
  "Martin",
  "Lee",
];

const DOMAINS = [
  "example.com",
  "test.org",
  "demo.net",
  "sample.io",
  "mock.dev",
];

const WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateValue(type: FieldType): string | number | boolean {
  switch (type) {
    case "name":
      return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    case "email": {
      const first = pick(FIRST_NAMES).toLowerCase();
      const last = pick(LAST_NAMES).toLowerCase();
      return `${first}.${last}@${pick(DOMAINS)}`;
    }
    case "number":
      return randomInt(1, 10000);
    case "boolean":
      return Math.random() > 0.5;
    case "text": {
      const len = randomInt(5, 12);
      const sentence = Array.from({ length: len }, () => pick(WORDS)).join(" ");
      return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
    }
    case "date": {
      const start = new Date(2020, 0, 1).getTime();
      const end = new Date(2026, 0, 1).getTime();
      return new Date(randomInt(start, end)).toISOString().split("T")[0];
    }
    case "uuid":
      return generateUUID();
    case "url":
      return `https://${pick(DOMAINS)}/${pick(WORDS)}/${randomInt(1, 999)}`;
  }
}

let nextId = 1;

export default function FakeDataClient() {
  const [fields, setFields] = useState<FieldDef[]>([
    { id: nextId++, name: "id", type: "number" },
    { id: nextId++, name: "name", type: "name" },
    { id: nextId++, name: "email", type: "email" },
  ]);
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function addField() {
    setFields((prev) => [
      ...prev,
      { id: nextId++, name: "", type: "text" },
    ]);
  }

  function removeField(id: number) {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }

  function updateField(id: number, key: "name" | "type", value: string) {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  }

  function generate() {
    const validFields = fields.filter((f) => f.name.trim());
    if (validFields.length === 0) return;

    const data = Array.from({ length: count }, () => {
      const row: Record<string, string | number | boolean> = {};
      for (const field of validFields) {
        row[field.name] = generateValue(field.type);
      }
      return row;
    });

    setOutput(JSON.stringify(data, null, 2));
  }

  async function copy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Field definitions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-400">Fields</label>
          <button
            onClick={addField}
            className="rounded-lg border border-gray-700 px-3 py-1 text-sm font-semibold text-gray-300 transition hover:border-gray-500 hover:text-white"
          >
            + Add Field
          </button>
        </div>

        {fields.map((field) => (
          <div key={field.id} className="flex gap-3">
            <input
              value={field.name}
              onChange={(e) => updateField(field.id, "name", e.target.value)}
              placeholder="Field name"
              className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <select
              value={field.type}
              onChange={(e) => updateField(field.id, "type", e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              {FIELD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              onClick={() => removeField(field.id)}
              className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-400 transition hover:border-red-700 hover:text-red-400"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Count + Generate */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-400">Count:</label>
        <input
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (v >= 1 && v <= 100) setCount(v);
          }}
          className="w-20 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
        <button
          onClick={generate}
          className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Generate
        </button>
        <button
          onClick={copy}
          disabled={!output}
          className="rounded-lg border border-gray-700 px-5 py-2 text-sm font-semibold text-gray-300 transition hover:border-gray-500 hover:text-white disabled:opacity-40 disabled:hover:border-gray-700 disabled:hover:text-gray-300"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Output */}
      {output && (
        <textarea
          readOnly
          value={output}
          className="h-64 w-full rounded-lg border border-gray-700 bg-gray-900 p-4 font-mono text-sm text-emerald-300 focus:outline-none"
        />
      )}
    </div>
  );
}
