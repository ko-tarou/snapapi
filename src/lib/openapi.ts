type JsonSchema = {
  type: string;
  properties?: Record<string, { type: string }>;
};

function inferType(value: unknown): string {
  if (value === null) return "string";
  if (Array.isArray(value)) return "array";
  switch (typeof value) {
    case "number":
      return Number.isInteger(value) ? "integer" : "number";
    case "boolean":
      return "boolean";
    case "string":
      return "string";
    default:
      return "object";
  }
}

function inferSchema(item: unknown): JsonSchema {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return { type: "object" };
  }
  const obj = item as Record<string, unknown>;
  const properties: Record<string, { type: string }> = {};
  for (const [key, value] of Object.entries(obj)) {
    properties[key] = { type: inferType(value) };
  }
  return { type: "object", properties };
}

export function generateOpenApiSpec(
  id: string,
  data: Record<string, unknown[]>,
  baseUrl: string
): object {
  const resources = Object.keys(data).filter((k) => k !== "_config");
  const paths: Record<string, object> = {};
  const schemas: Record<string, JsonSchema> = {};

  for (const resource of resources) {
    const items = data[resource];
    const schema = inferSchema(items?.[0]);
    const schemaName =
      resource.charAt(0).toUpperCase() + resource.slice(1);
    schemas[schemaName] = schema;
    const ref = `#/components/schemas/${schemaName}`;

    const collectionPath = `/api/mock/${id}/${resource}`;
    const itemPath = `/api/mock/${id}/${resource}/{itemId}`;

    paths[collectionPath] = {
      get: {
        summary: `List all ${resource}`,
        operationId: `list${schemaName}`,
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: ref } },
              },
            },
          },
        },
      },
      post: {
        summary: `Create a ${resource} item`,
        operationId: `create${schemaName}`,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: ref } },
          },
        },
        responses: {
          "201": {
            description: "Created",
            content: {
              "application/json": { schema: { $ref: ref } },
            },
          },
        },
      },
    };

    paths[itemPath] = {
      get: {
        summary: `Get a ${resource} item by ID`,
        operationId: `get${schemaName}`,
        parameters: [
          {
            name: "itemId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": { schema: { $ref: ref } },
            },
          },
          "404": { description: "Not found" },
        },
      },
      put: {
        summary: `Update a ${resource} item`,
        operationId: `update${schemaName}`,
        parameters: [
          {
            name: "itemId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: ref } },
          },
        },
        responses: {
          "200": {
            description: "Updated",
            content: {
              "application/json": { schema: { $ref: ref } },
            },
          },
          "404": { description: "Not found" },
        },
      },
      delete: {
        summary: `Delete a ${resource} item`,
        operationId: `delete${schemaName}`,
        parameters: [
          {
            name: "itemId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "Deleted" },
          "404": { description: "Not found" },
        },
      },
    };
  }

  return {
    openapi: "3.0.3",
    info: {
      title: `SnapAPI Mock - ${id}`,
      version: "1.0.0",
      description: `Auto-generated OpenAPI spec for mock endpoint ${id}`,
    },
    servers: [{ url: baseUrl }],
    paths,
    components: { schemas },
  };
}
