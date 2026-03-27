import { getEndpoint, updateEndpointData } from "@/lib/db";
import { corsHeaders } from "@/lib/cors";

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

  const data = JSON.parse(endpoint.data) as Record<string, unknown[]>;

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

  const data = JSON.parse(endpoint.data) as Record<string, unknown[]>;

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

  const items = data[resource];
  const maxId = items.reduce((max: number, item: unknown) => {
    const itemObj = item as Record<string, unknown>;
    const itemId = typeof itemObj.id === "number" ? itemObj.id : 0;
    return Math.max(max, itemId);
  }, 0);

  const newItem = { ...(body as Record<string, unknown>), id: maxId + 1 };
  items.push(newItem);
  updateEndpointData(id, JSON.stringify(data));

  return Response.json(newItem, { status: 201, headers: corsHeaders() });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
