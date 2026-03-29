// Rule-based dummy data generator — zero external dependencies

const NAMES = [
  "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry",
  "Ivy", "Jack", "Kate", "Leo", "Mia", "Noah", "Olivia", "Paul",
  "Quinn", "Ruby", "Sam", "Tina",
];

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog.",
  "Technology continues to reshape how we interact with the world.",
  "A well-designed API can save developers countless hours.",
  "Open source software powers most of the modern internet.",
  "Simplicity is the ultimate sophistication in software design.",
  "Data-driven decisions lead to better product outcomes.",
  "The best code is the code you never have to write.",
  "Performance optimization should be guided by real measurements.",
  "Good documentation is as important as good code.",
  "Every great product starts with understanding user needs.",
];

const TITLES = [
  "Getting Started with Modern APIs",
  "Ten Tips for Better Code Reviews",
  "Understanding RESTful Design Patterns",
  "How to Build Scalable Systems",
  "The Future of Web Development",
  "A Practical Guide to Testing",
  "Why Simplicity Wins in Software",
  "Lessons Learned from Production Outages",
  "Mastering Asynchronous Programming",
  "Building Developer-Friendly Tools",
];

const WORDS = [
  "alpha", "beta", "gamma", "delta", "epsilon",
  "lambda", "sigma", "omega", "theta", "zeta",
];

const MAX_COUNT = 100;

// --- helpers ---

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function uuid(): string {
  const hex = () => randInt(0, 0xffff).toString(16).padStart(4, "0");
  return `${hex()}${hex()}-${hex()}-4${hex().slice(1)}-${(8 + randInt(0, 3)).toString(16)}${hex().slice(1)}-${hex()}${hex()}${hex()}`;
}

function pastDate(): string {
  const now = Date.now();
  const oneYear = 365 * 24 * 60 * 60 * 1000;
  return new Date(now - randInt(0, oneYear)).toISOString();
}

function futureDate(): string {
  const now = Date.now();
  const oneYear = 365 * 24 * 60 * 60 * 1000;
  return new Date(now + randInt(0, oneYear)).toISOString();
}

function generateEmail(name: string): string {
  const slug = name.toLowerCase().replace(/\s+/g, ".");
  const domains = ["example.com", "test.org", "demo.net"];
  return `${slug}${randInt(1, 999)}@${pick(domains)}`;
}

function paragraph(): string {
  const count = randInt(2, 4);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(pick(SENTENCES));
  }
  return result.join(" ");
}

// --- field resolver ---

function resolveField(type: string, index: number): unknown {
  if (type === "autoincrement") return index + 1;
  if (type === "name") return pick(NAMES);
  if (type === "email") return generateEmail(pick(NAMES));
  if (type === "boolean") return Math.random() < 0.5;
  if (type === "uuid") return uuid();

  if (type.startsWith("number:")) {
    const range = type.slice(7);
    const [minStr, maxStr] = range.split("-");
    const min = parseInt(minStr, 10);
    const max = parseInt(maxStr, 10);
    if (isNaN(min) || isNaN(max)) return randInt(0, 100);
    return randInt(min, max);
  }

  if (type.startsWith("text:")) {
    const sub = type.slice(5);
    if (sub === "sentence") return pick(SENTENCES);
    if (sub === "paragraph") return paragraph();
    if (sub === "title") return pick(TITLES);
    if (sub === "word") return pick(WORDS);
    return pick(SENTENCES);
  }

  if (type === "url:image") {
    return `https://picsum.photos/200/200?random=${randInt(1, 10000)}`;
  }
  if (type === "url") {
    return `https://example.com/${pick(WORDS)}/${randInt(1, 9999)}`;
  }

  if (type === "date:past") return pastDate();
  if (type === "date:future") return futureDate();

  // fallback: treat as literal string
  return type;
}

// --- public types and function ---

export interface SchemaDefinition {
  count: number;
  schema: Record<string, string>;
}

export interface GenerateConfig {
  [resourceName: string]: SchemaDefinition;
}

export function generateFromSchema(
  config: GenerateConfig,
): Record<string, unknown[]> {
  const result: Record<string, unknown[]> = {};

  for (const [resource, def] of Object.entries(config)) {
    if (!def || typeof def !== "object") continue;
    const count = Math.min(Math.max(1, def.count || 1), MAX_COUNT);
    const schema = def.schema;
    if (!schema || typeof schema !== "object") continue;

    const items: unknown[] = [];
    for (let i = 0; i < count; i++) {
      const item: Record<string, unknown> = {};
      for (const [field, type] of Object.entries(schema)) {
        if (typeof type === "string") {
          item[field] = resolveField(type, i);
        }
      }
      items.push(item);
    }
    result[resource] = items;
  }

  return result;
}
