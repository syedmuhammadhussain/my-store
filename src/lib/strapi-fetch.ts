// lib/strapiFetch.ts
export async function strapiFetch(path: string, jwt?: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error?.message || res.statusText);
  }
  return res.json();
}
