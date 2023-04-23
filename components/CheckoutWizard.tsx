import React from "react";

type CheckoutWizardProps = {
  activeStep: number;
};

const CheckoutWizard: React.FC<CheckoutWizardProps> = ({ activeStep = 0 }) => {
  const steps = [
    "User Login",
    "Shipping Address",
    "Payment Method",
    "Place Order",
  ];
  return (
    <div className="mb-5 flex flex-wrap">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex-1 border-b-2 text-center ${
            index <= activeStep
              ? "border-indigo-500 text-indigo-500"
              : "boder-gra400 text-gray-400"
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default CheckoutWizard;
