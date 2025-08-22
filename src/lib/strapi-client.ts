// lib/strapi-client.ts
export async function strapiPost<T>(path: string, data: unknown) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Request failed');
  }
  return res.json() as Promise<T>;
}
