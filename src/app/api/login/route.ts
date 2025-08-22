import { NextResponse } from "next/server";

export async function POST(req: Request) {
  debugger;
  try {
    const { email, password } = await req.json();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      }
    );

    const response = await res.json();

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error authenticating with Supabase:", error);

    return NextResponse.json(
      { message: "Authentication failed", error: error.response.msg },
      { status: error.response?.status || 500 }
    );
  }
}
