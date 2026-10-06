/**
 * Presence proxy – forwards GET/POST presence requests to the backend.
 * Moved here so the /api/v1/events namespace is fully owned by route handlers,
 * avoiding any conflict with the Next.js rewrite rule.
 */
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

function backendBase(): string {
  return (process.env.API_BASE_URL || "http://backend:8080").replace(
    /\/+$/,
    ""
  )
}

async function proxy(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl
  const qs = searchParams.toString()
  const url = `${backendBase()}/api/v1/events/presence${qs ? `?${qs}` : ""}`

  const token =
    request.headers.get("Authorization") ??
    (searchParams.get("token") ? `Bearer ${searchParams.get("token")}` : null)

  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = token

  const res = await fetch(url, {
    method: request.method,
    headers,
    signal: request.signal,
  }).catch(() => null)

  if (!res) return new Response("upstream unavailable", { status: 502 })

  const body = await res.text()
  return new Response(body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  })
}

export { proxy as GET, proxy as POST }
