// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST() {
  const session = await getServerSession();
  if (session && (session as any).refreshTokenId) {
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshTokenId: (session as any).refreshTokenId }),
    }).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
