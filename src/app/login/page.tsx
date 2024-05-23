"use client";

import { SignUpForm } from "@/interfaces/SignUpForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

type SignInForm = Pick<SignUpForm, "email" | "password">;

export default function Login() {
  const schema = Yup.object().shape({
    email: Yup.string()
      .required("Please enter your email.")
      .email("You need to enter a valid email address")
      .trim(),
    password: Yup.string().required("Please enter your password"),
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function handleLogin(data: SignInForm) {
    setLoading(true);

    signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: "/dashboard",
    })
      //@ts-ignore
      .then(({ error }) => {
        if (error) {
          toast.error("Invalid credentials.");
          //reset();
        } else {
          reset();
          router.refresh();
          router.push("/dashboard");
        }
        setLoading(false);
      });
  }
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <section className="bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-xl xl:p-0 bg-gray-800 border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Nice to see you again!
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(handleLogin)}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Work email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="rounded-md focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="name@company.com"
                    {...register("email")}
                  />
                  <p className="text-xs text-red-400 pt-1">
                    {errors.email?.message}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="rounded-md focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    {...register("password")}
                  />
                  <p className="text-xs text-red-400 pt-4">
                    {errors.password?.message}
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-purple-600 hover:bg-purple-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  {loading ? <>Loading...</> : <>SignIn</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
