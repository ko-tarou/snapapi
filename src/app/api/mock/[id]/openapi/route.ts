import { getEndpoint } from "@/lib/db";
import { corsHeaders } from "@/lib/cors";
import { generateOpenApiSpec } from "@/lib/openapi";

type Params = { id: string };

export async function GET(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const endpoint = await getEndpoint(id);

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

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const spec = generateOpenApiSpec(id, data, baseUrl);

  return Response.json(spec, {
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
