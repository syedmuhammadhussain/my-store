"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    reValidateMode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  async function onSubmit(values: RegisterSchema) {
    setLoading(true);
    try {
      const payload = { ...values, roleName: "authenticated" };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        setServerError(err?.error?.message || "Registration failed");
        return;
      }

      const loginRes = await signIn("credentials", {
        redirect: false,
        identifier: values.email,
        password: values.password,
      });

      if (loginRes?.error) {
        setServerError(loginRes.error);
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setServerError("Something wrong in the catch block...");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-200">
      <div className="container flex flex-col mx-auto bg-white rounded-lg pt-0 my-5">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full lg:p-12">
            <div className="animate-in fade-in duration-1000 flex items-center xl:p-10 sm:w-full max-w-md">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
              >
                <h3 className="mb-3 text-4xl font-extrabold text-dark-gray-900">
                  Create an Account
                </h3>
                <p className="mb-4 text-gray-700">
                  Enter your email and password
                </p>

                <button
                  type="button"
                  className="cursor-pointer flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300"
                >
                  <Image
                    src="/logo-google.png"
                    alt="Google"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Sign up with Google
                </button>

                <div className="flex items-center mb-3">
                  <hr className="h-0 border-b border-solid border-gray-500 grow" />
                  <p className="mx-4 text-gray-600">or</p>
                  <hr className="h-0 border-b border-solid border-gray-500 grow" />
                </div>

                {serverError && (
                  <p className="animate-in slide-in-from-bottom bg-red-500 text-white text-sm mb-5 text-left px-2 py-2 pl-4 rounded">
                    {serverError}
                  </p>
                )}

                <label
                  htmlFor="username"
                  className="mb-2 text-sm text-start text-gray-900"
                >
                  Username*
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Write an username address"
                  {...register("username")}
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-gray-200 mb-2 placeholder:text-gray-700 bg-gray-100 text-dark-gray-900 rounded-2xl"
                />
                {errors.username && (
                  <p className="animate-in slide-in-from-bottom text-red-500 text-sm mb-5 text-left">
                    {errors.username.message}
                  </p>
                )}

                <label
                  htmlFor="email"
                  className="mb-2 text-sm text-start text-gray-900"
                >
                  Email*
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Write an email address"
                  {...register("email")}
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-gray-200 mb-2 placeholder:text-gray-700 bg-gray-100 text-dark-gray-900 rounded-2xl"
                />
                {errors.email && (
                  <p className="animate-in slide-in-from-bottom text-red-500 text-sm mb-5 text-left">
                    {errors.email.message}
                  </p>
                )}

                <label
                  htmlFor="password"
                  className="mb-2 text-sm text-start text-gray-900"
                >
                  Password*
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter a password"
                  {...register("password")}
                  className="flex items-center w-full px-5 py-4 mb-2 mr-2 text-sm font-medium outline-none focus:bg-gray-200 placeholder:text-gray-700 bg-gray-100 text-dark-gray-900 rounded-2xl"
                />
                {errors.password && (
                  <p className="animate-in slide-in-from-bottom text-red-500 text-sm mb-5 text-left">
                    {errors.password.message}
                  </p>
                )}

                <Button
                  disabled={loading}
                  variant="default"
                  type="submit"
                  className="cursor-pointer w-full mt-4 mb-5 h-13 text-sm font-bold leading-none text-white transition duration-300 rounded-2xl hover:bg-black-900 focus:ring-4 focus:ring-black bg-black"
                >
                  {loading ? (
                    <Loader2Icon className="animate-spin w-4 h-4" />
                  ) : (
                    "Create an Account"
                  )}
                </Button>

                <p className="text-sm leading-relaxed text-gray-900">
                  Not sign in yet?{" "}
                  <Link
                    href={`/login?callbackUrl=${encodeURIComponent(
                      window.location.pathname + window.location.search
                    )}`}
                    className="font-bold text-gray-700"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
