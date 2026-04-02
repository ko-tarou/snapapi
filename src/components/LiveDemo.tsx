"use client";

import { useState, useCallback } from "react";

type Step =
  | { type: "idle" }
  | { type: "creating" }
  | { type: "fetching"; mockId: string; baseUrl: string }
  | { type: "ready"; mockId: string; baseUrl: string; getResult: unknown[] }
  | { type: "posting"; mockId: string; baseUrl: string; getResult: unknown[] }
  | {
      type: "posted";
      mockId: string;
      baseUrl: string;
      getResult: unknown[];
      postResult: unknown;
    }
  | {
      type: "deleting";
      mockId: string;
      baseUrl: string;
      getResult: unknown[];
      postResult: unknown;
    }
  | {
      type: "done";
      mockId: string;
      baseUrl: string;
      getResult: unknown[];
      postResult: unknown;
      deleteResult: unknown;
    }
  | { type: "error"; message: string };

const SAMPLE_DATA = {
  users: [
    { id: 1, name: "Alice", role: "developer" },
    { id: 2, name: "Bob", role: "designer" },
  ],
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function TerminalDots() {
  return (
    <div className="flex gap-1.5 px-4 py-3">
      <span className="h-3 w-3 rounded-full bg-red-500" />
      <span className="h-3 w-3 rounded-full bg-yellow-500" />
      <span className="h-3 w-3 rounded-full bg-green-500" />
    </div>
  );
}

function CurlLine({ method, url }: { method: string; url: string }) {
  return (
    <div className="flex flex-wrap gap-1">
      <span className="text-emerald-400">$</span>{" "}
      <span className="text-gray-300">curl -X</span>{" "}
      <span className="text-amber-400">{method}</span>{" "}
      <span className="text-sky-400 break-all">{url}</span>
    </div>
  );
}

function JsonBlock({ data }: { data: unknown }) {
  const json = JSON.stringify(data, null, 2);
  // Simple syntax highlighting
  const highlighted = json
    .replace(
      /"([^"]+)":/g,
      '<span class="text-emerald-400">"$1"</span>:'
    )
    .replace(
      /: "([^"]+)"/g,
      ': <span class="text-sky-400">"$1"</span>'
    )
    .replace(
      /: (\d+)/g,
      ': <span class="text-amber-400">$1</span>'
    );
  return (
    <pre
      className="mt-1 text-sm leading-relaxed overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

function Spinner() {
  return (
    <span className="inline-block animate-pulse text-emerald-400">...</span>
  );
}

export default function LiveDemo() {
  const [step, setStep] = useState<Step>({ type: "idle" });

  const run = useCallback(async () => {
    const baseUrl = window.location.origin;

    // Step 1: Create mock
    setStep({ type: "creating" });
    await delay(500);

    let mockId: string;
    try {
      const res = await fetch("/api/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(SAMPLE_DATA),
      });
      if (!res.ok) {
        setStep({ type: "error", message: "Failed to create mock API" });
        return;
      }
      const data = (await res.json()) as { id: string };
      mockId = data.id;
    } catch {
      setStep({ type: "error", message: "Network error" });
      return;
    }

    // Step 2: GET users
    setStep({ type: "fetching", mockId, baseUrl });
    await delay(500);

    let getResult: unknown[];
    try {
      const res = await fetch(`/api/mock/${mockId}/users`);
      getResult = (await res.json()) as unknown[];
    } catch {
      setStep({ type: "error", message: "Failed to fetch users" });
      return;
    }

    setStep({ type: "ready", mockId, baseUrl, getResult });
  }, []);

  const handlePost = useCallback(async () => {
    if (step.type !== "ready") return;
    const { mockId, baseUrl, getResult } = step;

    setStep({ type: "posting", mockId, baseUrl, getResult });
    await delay(500);

    try {
      const res = await fetch(`/api/mock/${mockId}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Charlie", role: "PM" }),
      });
      const postResult = await res.json();
      setStep({ type: "posted", mockId, baseUrl, getResult, postResult });
    } catch {
      setStep({ type: "error", message: "Failed to POST" });
    }
  }, [step]);

  const handleDelete = useCallback(async () => {
    if (step.type !== "posted") return;
    const { mockId, baseUrl, getResult, postResult } = step;
    const itemId = (postResult as { id: number }).id;

    setStep({ type: "deleting", mockId, baseUrl, getResult, postResult });
    await delay(500);

    try {
      const res = await fetch(`/api/mock/${mockId}/users/${itemId}`, {
        method: "DELETE",
      });
      const deleteResult = await res.json();
      setStep({
        type: "done",
        mockId,
        baseUrl,
        getResult,
        postResult,
        deleteResult,
      });
    } catch {
      setStep({ type: "error", message: "Failed to DELETE" });
    }
  }, [step]);

  const mockUrl = (s: { mockId: string; baseUrl: string }) =>
    `${s.baseUrl}/api/mock/${s.mockId}`;

  if (step.type === "idle") {
    return (
      <div className="flex justify-center">
        <button
          onClick={run}
          className="rounded-lg border border-emerald-700 bg-emerald-900/30 px-6 py-3 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-900/60 hover:border-emerald-500"
        >
          See it in action
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-800 overflow-hidden">
      {/* Terminal header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <TerminalDots />
      </div>

      {/* Terminal body */}
      <div className="bg-black p-4 font-mono text-xs sm:text-sm space-y-4">
        {/* Step 1: POST to create */}
        <div>
          <CurlLine method="POST" url="/api/mock" />
          <div className="mt-1 text-gray-500">
            # body: {JSON.stringify(SAMPLE_DATA).slice(0, 60)}...
          </div>
          {step.type === "creating" ? (
            <Spinner />
          ) : (
            "mockId" in step && (
              <div className="mt-1 text-gray-300">
                <span className="text-emerald-400">201 Created</span> — {mockUrl(step as { mockId: string; baseUrl: string })}
              </div>
            )
          )}
        </div>

        {/* Step 2: GET users */}
        {"mockId" in step && (
          <div>
            <CurlLine
              method="GET"
              url={`${mockUrl(step as { mockId: string; baseUrl: string })}/users`}
            />
            {step.type === "fetching" ? (
              <Spinner />
            ) : (
              "getResult" in step && (
                <div>
                  <span className="text-emerald-400">200 OK</span>
                  <JsonBlock data={(step as { getResult: unknown[] }).getResult} />
                </div>
              )
            )}
          </div>
        )}

        {/* Step 3: POST new user */}
        {(step.type === "ready" ||
          step.type === "posting" ||
          step.type === "posted" ||
          step.type === "deleting" ||
          step.type === "done") && (
          <div>
            {step.type === "ready" ? (
              <button
                onClick={handlePost}
                className="rounded border border-emerald-700 bg-emerald-900/30 px-3 py-1.5 text-xs text-emerald-400 transition-all hover:bg-emerald-900/60"
              >
                Add an item
              </button>
            ) : (
              <>
                <CurlLine
                  method="POST"
                  url={`${mockUrl(step)}/users`}
                />
                <div className="mt-1 text-gray-500">
                  {`# body: {"name":"Charlie","role":"PM"}`}
                </div>
                {step.type === "posting" ? (
                  <Spinner />
                ) : (
                  "postResult" in step && (
                    <div>
                      <span className="text-emerald-400">201 Created</span>
                      <JsonBlock data={(step as { postResult: unknown }).postResult} />
                    </div>
                  )
                )}
              </>
            )}
          </div>
        )}

        {/* Step 4: DELETE */}
        {(step.type === "posted" ||
          step.type === "deleting" ||
          step.type === "done") && (
          <div>
            {step.type === "posted" ? (
              <button
                onClick={handleDelete}
                className="rounded border border-red-700 bg-red-900/30 px-3 py-1.5 text-xs text-red-400 transition-all hover:bg-red-900/60"
              >
                Delete it
              </button>
            ) : (
              <>
                <CurlLine
                  method="DELETE"
                  url={`${mockUrl(step)}/users/${(step as { postResult: { id: number } }).postResult.id}`}
                />
                {step.type === "deleting" ? (
                  <Spinner />
                ) : (
                  "deleteResult" in step && (
                    <div>
                      <span className="text-emerald-400">200 OK</span>
                      <JsonBlock data={(step as { deleteResult: unknown }).deleteResult} />
                    </div>
                  )
                )}
              </>
            )}
          </div>
        )}

        {/* Reset */}
        {step.type === "done" && (
          <div className="pt-2 border-t border-gray-800">
            <button
              onClick={() => setStep({ type: "idle" })}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Run again
            </button>
          </div>
        )}

        {/* Error */}
        {step.type === "error" && (
          <div>
            <span className="text-red-400">{step.message}</span>
            <button
              onClick={() => setStep({ type: "idle" })}
              className="ml-3 text-xs text-gray-500 hover:text-gray-300"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
