import axios from "axios";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

// @ts-ignore

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
function AdminDashboardScreen() {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: "",
  });

  const { data: user } = useSession();
  const router = useRouter();

  useEffect(() => {
    // if (!user) {
    //   return;
    // }
    if (!user?.user.isAdmin) {
      router.push("/");
    }
  }, [router, user?.user.isAdmin, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/summary`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, []);

  const data = {
    // @ts-ignore

    labels: summary.salesData.map((x) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgba(162, 222, 208, 1)",
        // @ts-ignore

        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  };

  return (
    <Layout title="Admin Dashboard">
      {error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid  md:grid-cols-4 md:gap-5">
          <div>
            <ul>
              <li>
                <Link href="/admin/dashboard" className="font-bold">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/orders">Orders</Link>
              </li>
              <li>
                <Link href="/admin/products">Products</Link>
              </li>
              <li>
                <Link href="/admin/users">Users</Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h1 className="mb-4 text-xl">Admin Dashboard</h1>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 ">
                {loading ? (
                  <Skeleton height={100} width={150} className="mx-5 my-5 " />
                ) : (
                  <div className="card m-5 p-5">
                    <p className="text-3xl">${summary.ordersPrice} </p>
                    <p>Sales</p>
                    <Link href="/admin/orders">View sales</Link>
                  </div>
                )}
                {loading ? (
                  <Skeleton height={100} width={150} className="mx-5 my-5" />
                ) : (
                  <div className="card m-5 p-5">
                    <p className="text-3xl">{summary.ordersCount} </p>
                    <p>Orders</p>
                    <Link href="/admin/orders">View orders</Link>
                  </div>
                )}
                {loading ? (
                  <Skeleton height={100} width={150} className="mx-5 my-5" />
                ) : (
                  <div className="card m-5 p-5">
                    <p className="text-3xl">{summary.productsCount} </p>
                    <p>Products</p>
                    <Link href="/admin/products">View products</Link>
                  </div>
                )}
                {loading ? (
                  <Skeleton height={100} width={150} className="mx-5 my-5" />
                ) : (
                  <div className="card m-5 p-5">
                    <p className="text-3xl">{summary.usersCount} </p>
                    <p>Users</p>
                    <Link href="/admin/users">View users</Link>
                  </div>
                )}
              </div>
              <h2 className="text-xl">Sales Report</h2>

              {loading ? (
                <>
                  <Skeleton height={500} />
                </>
              ) : (
                <Bar
                  options={{
                    // @ts-ignore

                    legend: { display: true, position: "right" },
                  }}
                  data={data}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

// AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen;
