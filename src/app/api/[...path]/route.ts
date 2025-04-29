import { NextRequest } from "next/server";

const FASTAPI_URL = process.env.FASTAPI_SERVER_URL!;

const methodHandler = async (req: NextRequest, context: { params: { path: string[] } }) => {
  const { path } = await context.params;
  return await proxyRequest(req, path);
};

export const GET = methodHandler;
export const POST = methodHandler;
export const PUT = methodHandler;
export const DELETE = methodHandler;

async function proxyRequest(req: NextRequest, pathSegments: string[]) {
  const targetUrl = `${FASTAPI_URL}/${pathSegments.join("/")}`;

  const fetchResponse = await fetch(targetUrl, {
    method: req.method,
    headers: req.headers, // Forward all headers
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    redirect: "manual",
  });

  // Create a new response and stream it back
  const headers = new Headers(fetchResponse.headers);
  const body = fetchResponse.body;

  return new Response(body, {
    status: fetchResponse.status,
    statusText: fetchResponse.statusText,
    headers,
  });
}
