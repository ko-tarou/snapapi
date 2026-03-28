import { getEndpoint, updateEndpointData } from "@/lib/db";
import { corsHeaders } from "@/lib/cors";
import { isPlainObject } from "@/lib/validate";

function findItemIndex(items: unknown[], itemId: string): number {
  const numericId = Number(itemId);
  return items.findIndex((i: unknown) => {
    const obj = i as Record<string, unknown>;
    return obj.id === numericId || String(obj.id) === itemId;
  });
}

function parseEndpointData(raw: string): Record<string, unknown[]> | null {
  try {
    return JSON.parse(raw) as Record<string, unknown[]>;
  } catch {
    return null;
  }
}

type Params = { id: string; resource: string; itemId: string };

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id, resource, itemId } = await params;
  const endpoint = getEndpoint(id);

  if (!endpoint) {
    return Response.json(
      { error: "Endpoint not found" },
      { status: 404, headers: corsHeaders() }
    );
  }

  const data = parseEndpointData(endpoint.data);
  if (!data) {
    return Response.json(
      { error: "Corrupted endpoint data" },
      { status: 500, headers: corsHeaders() }
    );
  }

  if (!(resource in data)) {
    return Response.json(
      { error: `Resource '${resource}' not found` },
      { status: 404, headers: corsHeaders() }
    );
  }

  const index = findItemIndex(data[resource], itemId);
  if (index === -1) {
    return Response.json(
      { error: "Item not found" },
      { status: 404, headers: corsHeaders() }
    );
  }

  return Response.json(data[resource][index], { headers: corsHeaders() });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id, resource, itemId } = await params;
  const endpoint = getEndpoint(id);

  if (!endpoint) {
    return Response.json(
      { error: "Endpoint not found" },
      { status: 404, headers: corsHeaders() }
    );
  }

  const data = parseEndpointData(endpoint.data);
  if (!data) {
    return Response.json(
      { error: "Corrupted endpoint data" },
      { status: 500, headers: corsHeaders() }
    );
  }

  if (!(resource in data)) {
    return Response.json(
      { error: `Resource '${resource}' not found` },
      { status: 404, headers: corsHeaders() }
    );
  }

  const index = findItemIndex(data[resource], itemId);
  if (index === -1) {
    return Response.json(
      { error: "Item not found" },
      { status: 404, headers: corsHeaders() }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: corsHeaders() }
    );
  }

  if (!isPlainObject(body)) {
    return Response.json(
      { error: "Request body must be a JSON object" },
      { status: 400, headers: corsHeaders() }
    );
  }

  const existing = data[resource][index] as Record<string, unknown>;
  const updated = { ...existing, ...body, id: existing.id };
  data[resource][index] = updated;
  updateEndpointData(id, JSON.stringify(data));

  return Response.json(updated, { headers: corsHeaders() });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id, resource, itemId } = await params;
  const endpoint = getEndpoint(id);

  if (!endpoint) {
    return Response.json(
      { error: "Endpoint not found" },
      { status: 404, headers: corsHeaders() }
    );
  }

  const data = parseEndpointData(endpoint.data);
  if (!data) {
    return Response.json(
      { error: "Corrupted endpoint data" },
      { status: 500, headers: corsHeaders() }
    );
  }

  if (!(resource in data)) {
    return Response.json(
      { error: `Resource '${resource}' not found` },
      { status: 404, headers: corsHeaders() }
    );
  }

  const index = findItemIndex(data[resource], itemId);
  if (index === -1) {
    return Response.json(
      { error: "Item not found" },
      { status: 404, headers: corsHeaders() }
    );
  }

  data[resource].splice(index, 1);
  updateEndpointData(id, JSON.stringify(data));

  return Response.json(
    { message: "Item deleted" },
    { headers: corsHeaders() }
  );
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
