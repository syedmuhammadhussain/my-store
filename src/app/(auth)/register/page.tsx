"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { registerSchema, RegisterSchema } from "@/lib/validation";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const [serverError, setServerError] = useState("");

  async function onSubmit(values: RegisterSchema) {
    const res = await signIn("credentials", { redirect: false, ...values });
    if (res?.error) {
      setServerError(res.error);
    } else {
      // redirect to dashboard or home
      window.location.href = "/";
    }
  }

  return (
    <div className="bg-gray-200">
      <div className="container flex flex-col mx-auto bg-white rounded-lg pt-0 my-5">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full lg:p-12">
            <div className="flex items-center xl:p-10 sm:w-full max-w-md">
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

                {/* Google Sign-in placeholder */}
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

                <label
                  htmlFor="username"
                  className="mb-2 text-sm text-start text-gray-900"
                >
                  Username*
                </label>
                <input
                  id="username"
                  type="email"
                  placeholder="Write an email address"
                  {...register("username")}
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-gray-200 mb-2 placeholder:text-gray-700 bg-gray-100 text-dark-gray-900 rounded-2xl"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mb-5 text-left">
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
                  <p className="text-red-500 text-sm mb-5 text-left">
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
                  <p className="text-red-500 text-sm mb-5 text-left">
                    {errors.password.message}
                  </p>
                )}

                {serverError && (
                  <p className="text-red-500 text-sm mb-5 text-left">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  className="cursor-pointer w-full mt-5 px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 rounded-2xl hover:bg-black-900 focus:ring-4 focus:ring-black bg-black"
                >
                  Create an Account
                </button>
                <p className="text-sm leading-relaxed text-gray-900">
                  Not sign in yet?{" "}
                  <Link href="/login" className="font-bold text-gray-700">
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
