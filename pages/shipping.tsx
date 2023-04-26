import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import { useStore } from "@/utils/store";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

//  usamos el hook
const ShippingScreen = () => {
  const { data: user } = useSession();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const { dispatch, state } = useStore();
  const {
    cart: { shippingAddress },
  } = state;

  // manejamos el submit
  const submitHandler = ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }: FormData) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...state.cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );
    router.push("/payment");
  };

  // si ya se lleno el formulario con valores anteriores entonces mostrarlos en la primera carga
  useEffect(() => {
    setValue("fullName", shippingAddress?.fullName || "");
    setValue("address", shippingAddress?.address || "");
    setValue("city", shippingAddress?.city || "");
    setValue("postalCode", shippingAddress?.postalCode || "");
    setValue("country", shippingAddress?.country || "");
  }, [setValue, shippingAddress]);

  useEffect(() => {
    if (!user?.user.name) {
      router.push("/login");
    }
  }, [router, user?.user]);

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl "> Shipping Address</h1>
        <div className=" mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register("fullName", {
              required: "Please enter full name",
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className=" mb-4">
          <label htmlFor="address">Address</label>
          <input
            className="w-full"
            id="address"
            autoFocus
            {...register("address", {
              required: "Please enter address",
              minLength: { value: 3, message: "Address is more than 2 chars" },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className=" mb-4">
          <label htmlFor="city">City</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register("city", {
              required: "Please enter city",
            })}
          />
          {errors.city && (
            <div className="text-red-500">{errors.city.message}</div>
          )}
        </div>
        <div className=" mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            className="w-full"
            id="postalCode"
            autoFocus
            {...register("postalCode", {
              required: "Please enter postal code",
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500">{errors.postalCode.message}</div>
          )}
        </div>
        <div className=" mb-4">
          <label htmlFor="country">Country</label>
          <input
            className="w-full"
            id="country"
            autoFocus
            {...register("country", {
              required: "Please enter country",
            })}
          />
          {errors.country && (
            <div className="text-red-500">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
};

ShippingScreen.auth = true;

export default ShippingScreen;
