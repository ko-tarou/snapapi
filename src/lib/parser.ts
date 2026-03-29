import {
  generateFromSchema,
  type GenerateConfig,
} from "./generate";

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
  const reservedKeys = new Set(["_config", "_generate"]);
  const result: Record<string, unknown[]> = {};

  // Handle _generate: produce data from schema definitions
  if (record._generate && typeof record._generate === "object" && !Array.isArray(record._generate)) {
    const generated = generateFromSchema(record._generate as GenerateConfig);
    for (const [key, items] of Object.entries(generated)) {
      if (dangerousKeys.has(key)) continue;
      result[key] = items;
    }
  }

  for (const key of Object.keys(record)) {
    if (dangerousKeys.has(key)) continue;
    if (reservedKeys.has(key)) continue;
    const value = record[key];
    // If _generate already created this resource, skip the manual entry
    if (result[key]) continue;
    result[key] = Array.isArray(value) ? value : [value];
  }

  if (Object.keys(result).length === 0) {
    return { success: false, error: "No valid keys after filtering" };
  }

  return { success: true, data: result };
}
