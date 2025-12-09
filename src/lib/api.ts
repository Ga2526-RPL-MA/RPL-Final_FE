const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9000"

function getAccessToken() {
  if (typeof document === "undefined") return null
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1] || null
}

export function apiUrl(path: string) {
  if (!path.startsWith("/")) return `${base}/${path}`
  return `${base}${path}`
}

export async function fetchJson(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {})
  if (!headers.has("authorization")) {
    const token = getAccessToken()
    if (token) headers.set("Authorization", `Bearer ${token}`)
  }

  const res = await fetch(apiUrl(path), {
    credentials: "include",
    ...init,
    headers,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    const message = text || `HTTP ${res.status}`
    throw new Error(message)
  }
  return res.json()
}

