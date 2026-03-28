import { getEndpoint, updateEndpointData } from "@/lib/db";
import { corsHeaders } from "@/lib/cors";
import { isPlainObject } from "@/lib/validate";

type Params = { id: string; resource: string };

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id, resource } = await params;
  const endpoint = getEndpoint(id);

  if (!endpoint) {
    return Response.json(
      { error: "Endpoint not found" },
      { status: 404, headers: corsHeaders() }
    );
  }

  let data: Record<string, unknown[]>;
  try {
    data = JSON.parse(endpoint.data) as Record<string, unknown[]>;
  } catch {
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

  return Response.json(data[resource], { headers: corsHeaders() });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id, resource } = await params;
  const endpoint = getEndpoint(id);

  if (!endpoint) {
    return Response.json(
      { error: "Endpoint not found" },
      { status: 404, headers: corsHeaders() }
    );
  }

  let data: Record<string, unknown[]>;
  try {
    data = JSON.parse(endpoint.data) as Record<string, unknown[]>;
  } catch {
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

  const items = data[resource];
  const hasNumericIds = items.some((item: unknown) => {
    const obj = item as Record<string, unknown>;
    return typeof obj.id === "number";
  });

  let newId: number;
  if (hasNumericIds) {
    const maxId = items.reduce((max: number, item: unknown) => {
      const obj = item as Record<string, unknown>;
      return typeof obj.id === "number" ? Math.max(max, obj.id) : max;
    }, 0);
    newId = maxId + 1;
  } else {
    newId = items.length + 1;
  }

  const newItem = { ...body, id: newId };
  items.push(newItem);
  updateEndpointData(id, JSON.stringify(data));

  return Response.json(newItem, { status: 201, headers: corsHeaders() });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
