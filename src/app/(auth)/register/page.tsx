// ** Third Components
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// ** Components
import RegisterPage from "@/components/auth/RegisterForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    // Redirect server-side — no mismatch
    redirect("/");
  }
  return <RegisterPage />;
}
