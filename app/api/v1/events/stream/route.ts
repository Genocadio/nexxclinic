/**
 * SSE proxy – streams the backend event-stream directly to the browser.
 *
 * Next.js rewrites buffer the response body before forwarding it, which breaks
 * server-sent events: events accumulate in the proxy buffer and are only flushed
 * when another request triggers a flush. This route handler owns the Response
 * body as a ReadableStream so every frame written by Spring's SseEmitter is
 * forwarded to the browser immediately, with no buffering.
 */
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function backendBase(): string {
  return (process.env.API_BASE_URL || "http://backend:8080").replace(
    /\/+$/,
    ""
  )
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")

  const headers: Record<string, string> = {
    Accept: "text/event-stream",
    "Cache-Control": "no-cache",
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  let backendRes: Response
  try {
    backendRes = await fetch(`${backendBase()}/api/v1/events/stream`, {
      headers,
      // Keep the connection open for the lifetime of the SSE stream
      signal: request.signal,
    })
  } catch {
    return new Response("upstream unavailable", { status: 502 })
  }

  if (!backendRes.ok || !backendRes.body) {
    const body = await backendRes.text().catch(() => backendRes.statusText)
    return new Response(body, {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Pipe the upstream ReadableStream straight to the client.  No buffering.
  return new Response(backendRes.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store, no-transform",
      "X-Accel-Buffering": "no",   // tells nginx / any intermediate proxy not to buffer
      Connection: "keep-alive",
    },
  })
}
