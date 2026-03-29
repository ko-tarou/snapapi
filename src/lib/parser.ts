export type ParseResult =
  | { success: true; data: Record<string, unknown[]> }
  | { success: false; error: string };

const MAX_SIZE_BYTES = 100 * 1024; // 100KB

export function parseAndValidateJSON(input: string): ParseResult {
  if (new TextEncoder().encode(input).length > MAX_SIZE_BYTES) {
    return { success: false, error: "JSON exceeds 100KB size limit" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    return { success: false, error: "Invalid JSON syntax" };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      success: false,
      error: "Top-level value must be an object",
    };
  }

  const record = parsed as Record<string, unknown>;
  const dangerousKeys = new Set(["__proto__", "constructor", "prototype"]);
  const reservedKeys = new Set(["_config"]);
  const result: Record<string, unknown[]> = {};

  for (const key of Object.keys(record)) {
    if (dangerousKeys.has(key)) continue;
    if (reservedKeys.has(key)) continue;
    const value = record[key];
    result[key] = Array.isArray(value) ? value : [value];
  }

  if (Object.keys(result).length === 0) {
    return { success: false, error: "No valid keys after filtering" };
  }

  return { success: true, data: result };
}
