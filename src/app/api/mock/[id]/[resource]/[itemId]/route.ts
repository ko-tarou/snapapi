import { getEndpoint, updateEndpointData } from "@/lib/db";
import { corsHeaders } from "@/lib/cors";

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

  const data = JSON.parse(endpoint.data) as Record<string, unknown[]>;

  if (!(resource in data)) {
    return Response.json(
      { error: `Resource '${resource}' not found` },
      { status: 404, headers: corsHeaders() }
    );
  }

  const numericId = Number(itemId);
  const item = data[resource].find((i: unknown) => {
    const obj = i as Record<string, unknown>;
    return obj.id === numericId;
  });

  if (!item) {
    return Response.json(
      { error: "Item not found" },
      { status: 404, headers: corsHeaders() }
    );
  }

  return Response.json(item, { headers: corsHeaders() });
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

  const data = JSON.parse(endpoint.data) as Record<string, unknown[]>;

  if (!(resource in data)) {
    return Response.json(
      { error: `Resource '${resource}' not found` },
      { status: 404, headers: corsHeaders() }
    );
  }

  const numericId = Number(itemId);
  const index = data[resource].findIndex((i: unknown) => {
    const obj = i as Record<string, unknown>;
    return obj.id === numericId;
  });

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

  const existing = data[resource][index] as Record<string, unknown>;
  const updated = { ...existing, ...(body as Record<string, unknown>), id: numericId };
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

  const data = JSON.parse(endpoint.data) as Record<string, unknown[]>;

  if (!(resource in data)) {
    return Response.json(
      { error: `Resource '${resource}' not found` },
      { status: 404, headers: corsHeaders() }
    );
  }

  const numericId = Number(itemId);
  const index = data[resource].findIndex((i: unknown) => {
    const obj = i as Record<string, unknown>;
    return obj.id === numericId;
  });

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
