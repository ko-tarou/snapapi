import { initDb, getEndpoint, clearWebhookLogs } from "@/lib/db";
import { corsHeaders } from "@/lib/cors";

export async function DELETE(
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

    await clearWebhookLogs(id);
    return Response.json(
      { cleared: true },
      { headers: corsHeaders() }
    );
  } catch {
    return Response.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
