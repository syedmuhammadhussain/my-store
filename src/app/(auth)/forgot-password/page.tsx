"use client";
import { useState } from "react";
import { strapiPost } from "@/lib/strapi-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    try {
      await strapiPost("/api/auth/forgot-password", { email });
      setMessage("Password reset link sent to your email");
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 w-full"
      />
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Send reset link
      </button>
    </form>
  );
}
