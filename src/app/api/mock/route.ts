import { v4 as uuidv4 } from "uuid";
import { parseAndValidateJSON } from "@/lib/parser";
import { createEndpoint } from "@/lib/db";
import { corsHeaders } from "@/lib/cors";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return Response.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            ...corsHeaders(),
            "Retry-After": String(rateCheck.retryAfter),
          },
        }
      );
    }

    const body = await request.text();
    const result = parseAndValidateJSON(body);

    if (!result.success) {
      return Response.json({ error: result.error }, {
        status: 400,
        headers: corsHeaders(),
      });
    }

    const id = uuidv4();
    const endpoints = Object.keys(result.data);
    createEndpoint(id, JSON.stringify(result.data));

    return Response.json(
      { id, endpoints, url: `/api/mock/${id}` },
      { status: 201, headers: corsHeaders() }
    );
  } catch {
    return Response.json({ error: "Internal server error" }, {
      status: 500,
      headers: corsHeaders(),
    });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
