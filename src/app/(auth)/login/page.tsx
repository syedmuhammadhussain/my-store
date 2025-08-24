// ** Third Components
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// ** Components
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    // Redirect server-side — no mismatch
    redirect("/");
  }
  return <LoginForm />;
}
