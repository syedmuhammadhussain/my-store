import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    jwt?: string;
    user?: {
      id: number;
      username?: string;
      email?: string;
    } & DefaultSession["user"];
  }

  interface User {
    jwt?: string;
    id: number;
    username?: string;
    email?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    jwt?: string;
    id?: number;
  }
}
