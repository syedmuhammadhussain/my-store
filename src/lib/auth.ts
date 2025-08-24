import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT as NextAuthJWT } from "next-auth/jwt";
// Raw shape returned by Strapi (nullable fields allowed)
export interface StrapiUser {
  id: number;
  documentId?: string | null;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  profile_image?: number | { id: number; url?: string } | null;
  createdAt?: string;
  updatedAt?: string;
  [k: string]: unknown;
}

export interface SignInResponse {
  jwt: string;
  user: StrapiUser;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthUser extends User {
  // NextAuth's User has name?: string | null, email?: string | null, image?: string | null.
  // We'll normalize to string | undefined for name/email/image to keep types compatible.
  id: number;
  jwt?: string;
  refreshToken?: string;
  expiresIn?: number;
  documentId?: string;
  phone?: string;
  profile_image?: number | { id: number; url?: string };
  username?: string; // avoid null — always string | undefined
}

export interface Token extends NextAuthJWT {
  jwt?: string;
  refreshToken?: string;
  id?: number;
  jwtExpires?: number;
  documentId?: string;
  username?: string;
  email?: string;
  phone?: string;
  profile_image?: number | { id: number; url?: string };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                identifier: creds?.identifier,
                password: creds?.password,
              }),
            }
          );

          const data = await res.json();

          if (!res.ok) {
            // Strapi error shape (v5) — adjust path if your plugin wraps errors differently
            const strapiMessage =
              data?.error?.message || data?.message || "Authentication failed";

            throw new Error(strapiMessage);
          }

          const su = data.user;
          const safeUsername = su.username ?? undefined;
          const safeEmail = su.email ?? undefined;
          const safePhone = su.phone ?? undefined;
          const safeDocumentId = su.documentId ?? undefined;
          const safeProfileImage =
            su.profile_image === null ? undefined : (su.profile_image as any);

          const userToReturn: AuthUser = {
            // NextAuth expects `id` often as string — keep it a string to be safe
            id: su.id,
            name: safeUsername ?? safeEmail ?? undefined,
            email: safeEmail,
            image:
              typeof safeProfileImage === "object"
                ? (safeProfileImage.url as string | undefined)
                : undefined,
            // extra fields
            username: safeUsername,
            documentId: safeDocumentId,
            phone: safePhone,
            profile_image: safeProfileImage,
            jwt: data.jwt,
            refreshToken: data.refreshToken,
            expiresIn: data.expiresIn ?? 24 * 60 * 60,
          };

          return userToReturn;
        } catch (err) {
          // If it's not already an Error, wrap it
          throw new Error(
            err instanceof Error ? err.message : "Unknown authentication error"
          );
        }
      },
    }),
  ],

  callbacks: {
    // Store tokens in JWT
    async jwt({ token, user }) {
      const nextToken = token as Token;

      if (user) {
        // `user` is our AuthUser (sanitized)
        const u = user as AuthUser;
        nextToken.jwt = u.jwt;
        nextToken.refreshToken = u.refreshToken;
        nextToken.id = u.id ? Number(u.id) : undefined;
        nextToken.jwtExpires = Date.now() + ((u.expiresIn ?? 24 * 60 * 60) * 1000);

        // profile fields (all non-nullable in token)
        nextToken.documentId = u.documentId;
        nextToken.username = u.username;
        nextToken.email = u.email;
        nextToken.phone = u.phone;
        nextToken.profile_image = u.profile_image;
      }

      const isExpired =
        typeof nextToken.jwtExpires === "number" ? Date.now() > nextToken.jwtExpires : false;

      if (isExpired && nextToken.refreshToken) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/token/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: nextToken.refreshToken }),
          });

          if (!res.ok) throw new Error("Refresh failed");
          const refreshed = await res.json();

          nextToken.jwt = refreshed.jwt;
          nextToken.jwtExpires = Date.now() + ((refreshed.expiresIn ?? 24 * 60 * 60) * 1000);
          nextToken.refreshToken = refreshed.refreshToken ?? nextToken.refreshToken;
        } catch (err) {
          console.error("JWT refresh failed", err);
          return {} as Token; // sign out
        }
      }

      return nextToken;
    },

    // Add JWT & ID to session object
    async session({ session, token }): Promise<typeof session> {
      const t = token as Token;

      // Attach token-level JWT for use in fetches
      (session as any).jwt = t.jwt;

      // Ensure user object exists
      if (!session.user) {
        (session as any).user = {};
      }

      session.user.id = t.id;
      session.user.email = t.email ?? session.user.email ?? null;
      // typed optional fields
      (session.user as any).username = t.username ?? null;
      (session.user as any).documentId = t.documentId ?? null;
      (session.user as any).phone = t.phone ?? null;
      (session.user as any).profile_image = t.profile_image ?? null;

      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    // signIn: "/auth/signin",
    signIn: "/login",
  },
};
