import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import { useStore } from "@/utils/store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Payment = () => {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error("Payment method is required");
    }
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );
    router.push("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push("/shipping");
      return;
    }

    setSelectedPaymentMethod(paymentMethod || "");
  }, [router, shippingAddress, paymentMethod]);

  const methotTypes = ["Paypal", "Stripe", "CashOnDelivery"];
  return (
    <Layout title="Payment">
      <CheckoutWizard activeStep={3} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl"> Payment Method</h1>
        {methotTypes.map((payment) => (
          <>
            <div key={payment} className="mb-4">
              <input
                type="radio"
                name="paymentMethod"
                className="p-2 outline-none focus:ring-0"
                id={payment}
                checked={selectedPaymentMethod === payment}
                onChange={() => setSelectedPaymentMethod(payment)}
              />
              <label htmlFor={payment} className="p-2">
                {payment}
              </label>
            </div>
          </>
        ))}
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push("/shipping")}
            type="button"
            className="default-button"
          >
            Back
          </button>
          <button className="primary-button ">Next</button>
        </div>
      </form>
    </Layout>
  );
};

export default Payment;
