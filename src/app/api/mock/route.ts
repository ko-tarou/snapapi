import { v4 as uuidv4 } from "uuid";
import { parseAndValidateJSON } from "@/lib/parser";
import { createEndpoint } from "@/lib/db";
import { corsHeaders } from "@/lib/cors";
import { checkRateLimit } from "@/lib/rateLimit";
import { getConfig, type SimConfig } from "@/lib/simulate";

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

    // Extract _config before parsing (parser excludes it)
    let simConfig: SimConfig = {};
    try {
      const raw = JSON.parse(body) as Record<string, unknown>;
      simConfig = getConfig(raw);
    } catch {
      // parseAndValidateJSON will handle the error
    }

    const result = parseAndValidateJSON(body);

    if (!result.success) {
      return Response.json({ error: result.error }, {
        status: 400,
        headers: corsHeaders(),
      });
    }

    const id = uuidv4();
    const endpoints = Object.keys(result.data);

    // Store _config alongside resource data
    const storeData: Record<string, unknown> = { ...result.data };
    const hasConfig = simConfig.delay || simConfig.errorRate;
    if (hasConfig) {
      storeData._config = simConfig;
    }
    await createEndpoint(id, JSON.stringify(storeData));

    const response: Record<string, unknown> = {
      id,
      endpoints,
      url: `/api/mock/${id}`,
    };
    if (hasConfig) {
      response.config = simConfig;
    }

    return Response.json(response, { status: 201, headers: corsHeaders() });
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
