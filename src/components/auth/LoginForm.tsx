"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { loginSchema, LoginSchema } from "@/lib/validation";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

export default function LoginPage() {
  //   const { status } = useSession();
  //   const router = useRouter();

  //   useEffect(() => {
  //     if (status === "authenticated") {
  //       router.replace("/account");
  //     }
  //   }, [status, router]);

  //   if (status === "authenticated") return null;

  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    reValidateMode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  async function onSubmit(values: LoginSchema) {
    setLoading(true);
    try {
      const res = await signIn("credentials", { redirect: false, ...values });
      if (res?.error) {
        setServerError(res.error);
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setServerError("Something wrong in the catch block...");
      console.log(err)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-200">
      <div className="container flex flex-col mx-auto bg-white rounded-lg pt-0 my-5">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full lg:p-12">
            <div className="animate-in fade-in duration-500 flex items-center xl:p-10 sm:w-full max-w-md">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
              >
                <h3 className="mb-3 text-4xl font-extrabold text-dark-gray-900">
                  Sign In
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
                  Sign in with Google
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
                  htmlFor="identifier"
                  className="mb-2 text-sm text-start text-gray-900"
                >
                  Email*
                </label>
                <input
                  id="identifier"
                  type="email"
                  placeholder="Write an email address"
                  {...register("identifier")}
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-gray-200 mb-2 placeholder:text-gray-700 bg-gray-100 text-dark-gray-900 rounded-2xl"
                />
                {errors.identifier && (
                  <p className="animate-in slide-in-from-bottom duration-500 text-red-500 text-sm mb-5 text-left">
                    {errors.identifier.message}
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

                <div className="flex flex-row justify-between mb-8">
                  <label className="relative inline-flex items-center mr-3 cursor-pointer select-none">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-5 h-5 bg-white border-2 rounded-sm border-gray-500 peer-checked:border-0 peer-checked:bg-black flex items-center justify-center">
                      <Image
                        src="/check.png"
                        alt="tick"
                        width={12}
                        height={12}
                      />
                    </div>
                    <span className="ml-3 text-sm font-normal text-gray-900">
                      Keep me logged in
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="mr-4 text-sm font-medium text-black"
                  >
                    Forget password?
                  </Link>
                </div>
                <Button
                  disabled={loading}
                  variant="default"
                  type="submit"
                  className="cursor-pointer w-full mb-5 h-13 text-sm font-bold leading-none text-white transition duration-300 rounded-2xl hover:bg-black-900 focus:ring-4 focus:ring-black bg-black"
                >
                  {loading ? (
                    <Loader2Icon className="animate-spin w-4 h-4" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <p className="text-sm leading-relaxed text-gray-900">
                  Not registered yet?{" "}
                  <Link
                    href={`/register?callbackUrl=${encodeURIComponent(
                      window.location.pathname + window.location.search
                    )}`}
                    className="font-bold text-gray-700"
                  >
                    Create an Account
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
