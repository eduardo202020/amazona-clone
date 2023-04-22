import Layout from "@/components/Layout";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

const LoginScreen = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();

  const submitHandler = handleSubmit((data) => console.log(data));
  return (
    <Layout title="Login">
      <form
        action=""
        className="mx-auto max-w-screen-md"
        onSubmit={submitHandler}
      >
        <h1 className="mb-4 text-xl ">Login</h1>
        <div>
          <label
            htmlFor="email
            "
          >
            Email
          </label>
          <input
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
            type="email"
            className="w-full"
            id="email"
            autoFocus
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            {...register("password", {
              required: "Please enter password",
              minLength: { value: 6, message: "Password is more than 6 chars" },
            })}
            type="password"
            className="w-full "
            id="password"
            autoFocus
          />
          {errors.password && (
            <div className="text-red-500"> {errors.password?.message}</div>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Login</button>
        </div>
        <div className="mb-4"> Don&apos;t have an account? &nbsp;</div>
        <Link href="register">Register</Link>
      </form>
    </Layout>
  );
};

export default LoginScreen;
