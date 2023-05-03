import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { getError } from "../utils/error";
import axios from "axios";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { UserProps } from "@/models/User";

interface fromProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  sellerName: string;
  sellerLogo: string;
  sellerDescription: string;
}

export default function ProfileScreen() {
  const { data: session } = useSession();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<fromProps>();

  useEffect(() => {
    setValue("name", session?.user.name || "");
    setValue("email", session?.user.email || "");
  }, [session?.user, setValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session?.user) {
          return;
        }
        const { data } = await axios.get<UserProps>(
          `/api/seller/${session?.user._id}`
        );

        setValue("sellerName", data.seller.name as string);
        setValue("sellerLogo", data.seller.logo as string);
        setValue("sellerDescription", data.seller.description as string);
      } catch (err) {
        toast.error("Error access seller data");
      }
    };
    fetchData();

    if (!session?.user.email) {
      router.push("/");
    }
  }, [
    router,
    session,
    session?.user._id,
    session?.user.email,
    setValue,
    session?.user,
  ]);

  const submitHandler = async ({
    name,
    email,
    password,
    sellerName,
    sellerLogo,
    sellerDescription,
  }: {
    name: string;
    email: string;
    password: string;
    sellerName: string;
    sellerLogo: string;
    sellerDescription: string;
  }) => {
    try {
      await axios.put("/api/auth/update", {
        name,
        email,
        password,
        sellerName,
        sellerLogo,
        sellerDescription,
      });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      toast.success("Profile updated successfully");
      if (result?.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Profile">
      <form
        className="mx-auto max-w-screen-md"
        // @ts-ignore
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Update Profile</h1>

        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register("name", {
              required: "Please enter name",
            })}
          />

          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="w-full"
            id="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            className="w-full"
            type="password"
            id="password"
            {...register("password", {
              minLength: { value: 6, message: "password is more than 5 chars" },
            })}
          />
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "confirm password is more than 5 chars",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500 ">Password do not match</div>
            )}
        </div>

        {session?.user.isSeller && (
          <>
            <div className="mb-4">
              <h1 className="mb-4 text-xl">Seller Info</h1>
              <label htmlFor="sellerName">Seller Name</label>
              <input
                type="text"
                className="w-full"
                id="sellerName"
                autoFocus
                {...register("sellerName", {
                  required: "Please enter seller Name",
                })}
              />

              {errors.sellerName && (
                <div className="text-red-500">{errors.sellerName.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="sellerLogo">Seller Logo</label>
              <input
                type="text"
                className="w-full"
                id="sellerLogo"
                autoFocus
                {...register("sellerLogo", {
                  required: "Please enter Seller Logo",
                })}
              />

              {errors.sellerLogo && (
                <div className="text-red-500">{errors.sellerLogo.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="sellerDescription">Seller Description</label>
              <input
                type="text"
                className="w-full"
                id="sellerDescription"
                autoFocus
                {...register("sellerDescription", {
                  required: "Please enter Seller Description",
                })}
              />

              {errors.sellerDescription && (
                <div className="text-red-500">
                  {errors.sellerDescription.message}
                </div>
              )}
            </div>
          </>
        )}

        <div className="mb-4">
          <button className="primary-button">Update Profile</button>
        </div>
      </form>
    </Layout>
  );
}

// ProfileScreen.auth = true;
