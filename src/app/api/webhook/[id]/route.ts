import { initDb, getEndpoint, addWebhookLog, getWebhookLogs } from "@/lib/db";
import { corsHeaders } from "@/lib/cors";

const ALLOWED_HEADER_PREFIXES = ["content-type", "user-agent", "x-"];

function filterHeaders(reqHeaders: Headers): Record<string, string> {
  const filtered: Record<string, string> = {};
  reqHeaders.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (
      ALLOWED_HEADER_PREFIXES.some((prefix) =>
        lower === prefix || lower.startsWith(prefix)
      )
    ) {
      filtered[key] = value;
    }
  });
  return filtered;
}

async function recordRequest(
  request: Request,
  id: string
): Promise<Response> {
  try {
    await initDb();
    const endpoint = await getEndpoint(id);
    if (!endpoint) {
      return Response.json(
        { error: "Endpoint not found" },
        { status: 404, headers: corsHeaders() }
      );
    }

    const headers = filterHeaders(request.headers);
    const body = await request.text();

    await addWebhookLog(
      id,
      request.method,
      JSON.stringify(headers),
      body
    );

    return Response.json(
      { received: true },
      { status: 200, headers: corsHeaders() }
    );
  } catch {
    return Response.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await initDb();
    const endpoint = await getEndpoint(id);
    if (!endpoint) {
      return Response.json(
        { error: "Endpoint not found" },
        { status: 404, headers: corsHeaders() }
      );
    }

    const logs = await getWebhookLogs(id);
    return Response.json({ logs }, { headers: corsHeaders() });
  } catch {
    return Response.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return recordRequest(request, id);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return recordRequest(request, id);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return recordRequest(request, id);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return recordRequest(request, id);
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
