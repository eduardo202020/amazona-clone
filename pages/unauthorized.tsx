import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import React from "react";

const Unauthorized = () => {
  const router = useRouter();
  const { message } = router.query;
  return (
    <Layout title="Unauthorized Page">
      <h1 className="text-xl"> Access Denied </h1>
      {message && <div className="mb-4"> {message}</div>}
    </Layout>
  );
};

export default Unauthorized;