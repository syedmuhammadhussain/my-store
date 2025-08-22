// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(creds),
          }
        );
        if (!res.ok) return null;
        const { accessToken, refreshTokenId, user } = await res.json();
        return { ...user, accessToken, refreshTokenId };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user, trigger }) {
      debugger;
      // Initial sign-in
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshTokenId = user.refreshTokenId;
        token.user = {
          id: user.id,
          name: user.username,
          phone: user.phone,
          role: user.role?.code,
        };
        token.accessExp = Date.now() + 10 * 60 * 1000; // 10 min
      }
      // Refresh on demand
      if (Date.now() > (token.accessExp as number) - 30_000) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshTokenId: token.refreshTokenId }),
          }
        );
        if (res.ok) {
          const { accessToken, refreshTokenId } = await res.json();
          token.accessToken = accessToken;
          token.refreshTokenId = refreshTokenId; // rotated
          token.accessExp = Date.now() + 10 * 60 * 1000;
        } else {
          // refresh failed -> clear
          token.accessToken = undefined;
          token.refreshTokenId = undefined;
          token.user = undefined;
        }
      }
      return token;
    },
    async session({ session, token }) {
      debugger;
      session.user = token.user as any;
      (session as any).accessToken = token.accessToken; // use only on server
      return session;
    },
  },
  cookies: {
    // Defaults are HttpOnly/SameSite=Lax/Secure in prod; keep defaults unless you have subdomain needs.
  },
});

export { handler as GET, handler as POST };
