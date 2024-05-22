"use client";

import { SignUpForm } from "@/interfaces/SignUpForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    email: Yup.string()
      .required("Please enter your email")
      .email("You need to enter a valid email address")
      .trim(),
    password: Yup.string().required("Please enter your password"),
  });

  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleLogin(data: SignUpForm) {
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
          setLoading(false);
          toast.error("Invalid credentials.");
          //reset();
        } else {
          reset();
          router.refresh();
          router.push("/dashboard");
        }
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
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Nice to meet you!
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
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    {...register("email")}
                  />
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("password")}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-purple-600 hover:bg-purple-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  {loading ? <>Loading...</> : <>Continue</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
function yupResolver(
  schema: Yup.ObjectSchema<
    { email: string; password: string },
    Yup.AnyObject,
    { email: undefined; password: undefined },
    ""
  >
):
  | import("react-hook-form").Resolver<{ email: string; password: string }, any>
  | undefined {
  throw new Error("Function not implemented.");
}
