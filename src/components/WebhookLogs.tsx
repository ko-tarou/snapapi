"use client";

import { useState, useCallback } from "react";
import CopyButton from "./CopyButton";

interface WebhookLog {
  id: number;
  method: string;
  headers: string;
  body: string;
  received_at: string;
}

interface WebhookLogsProps {
  endpointId: string;
  webhookUrl: string;
}

export default function WebhookLogs({ endpointId, webhookUrl }: WebhookLogsProps) {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/webhook/${endpointId}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs ?? []);
      }
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }, [endpointId]);

  const clearLogs = async () => {
    const res = await fetch(`/api/webhook/${endpointId}/clear`, {
      method: "DELETE",
    });
    if (res.ok) {
      setLogs([]);
    }
  };

  const curlExample = `curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"event":"test","data":{"id":1}}'`;

  return (
    <section id="webhooks" className="rounded-lg border border-gray-800 bg-gray-900 p-5">
      <h2 className="text-lg font-semibold">Webhooks</h2>
      <p className="mt-1 text-sm text-gray-400">
        Receive and inspect incoming HTTP requests at this URL.
      </p>

      {/* Webhook URL */}
      <div className="mt-3 flex items-center rounded bg-gray-800 px-3 py-2">
        <code className="min-w-0 flex-1 truncate text-sm text-gray-200">
          {webhookUrl}
        </code>
        <CopyButton text={webhookUrl} label="Copy" />
      </div>

      {/* Test curl */}
      <div className="mt-4">
        <h3 className="mb-1 text-xs font-semibold uppercase text-gray-500">
          Test Webhook
        </h3>
        <div className="relative">
          <pre className="overflow-x-auto rounded bg-gray-800 px-3 py-2 text-xs text-gray-300">
            {curlExample}
          </pre>
          <div className="absolute top-1 right-1">
            <CopyButton text={curlExample} label="Copy" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? "Loading..." : loaded ? "Refresh logs" : "Load logs"}
        </button>
        {loaded && logs.length > 0 && (
          <button
            onClick={clearLogs}
            className="rounded-lg border border-red-800 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:border-red-600 hover:text-red-300"
          >
            Clear logs
          </button>
        )}
      </div>

      {/* Logs list */}
      {loaded && (
        <div className="mt-4">
          {logs.length === 0 ? (
            <p className="text-sm text-gray-500">
              No webhook requests received yet.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                {logs.length} request{logs.length !== 1 && "s"} (latest 50)
              </p>
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="rounded border border-gray-700 bg-gray-800"
                >
                  <button
                    onClick={() =>
                      setExpanded(expanded === log.id ? null : log.id)
                    }
                    className="flex w-full items-center justify-between px-3 py-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-emerald-900/60 px-2 py-0.5 text-xs font-mono font-medium text-emerald-300">
                        {log.method}
                      </span>
                      <span className="text-xs text-gray-400">
                        {log.received_at}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {expanded === log.id ? "collapse" : "expand"}
                    </span>
                  </button>
                  {expanded === log.id && (
                    <div className="border-t border-gray-700 px-3 py-2 space-y-2">
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-gray-500">
                          Headers
                        </h4>
                        <pre className="mt-1 overflow-x-auto text-xs text-gray-300">
                          {JSON.stringify(JSON.parse(log.headers), null, 2)}
                        </pre>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-gray-500">
                          Body
                        </h4>
                        <pre className="mt-1 overflow-x-auto text-xs text-gray-300 max-h-40">
                          {formatBody(log.body)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function formatBody(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body || "(empty)";
  }
}
