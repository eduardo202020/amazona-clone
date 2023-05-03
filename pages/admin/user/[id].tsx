import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { getError } from "../../../utils/error";
import Layout from "../../../components/Layout";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Link from "next/link";

//@ts-ignore
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}

interface formProps {
  name: string;
  isAdmin: boolean;
  isSeller: boolean;
}

function AdminUserEdit() {
  const { query } = useRouter();
  const userId = query.id;
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<formProps>();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/users/${userId}`);

        dispatch({ type: "FETCH_SUCCESS" });
        setValue("name", data.name);
        setValue("isAdmin", data.isAdmin);
        setValue("isSeller", data.isSeller);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (userId === undefined) {
      return;
    }
    fetchData();
  }, [userId, setValue]);

  const submitHandler = async ({
    name,
    isAdmin,
    isSeller,
  }: {
    name: string;
    isAdmin: boolean;
    isSeller: boolean;
  }) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(`/api/admin/users/${userId}`, {
        name,
        isAdmin,
        isSeller,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("User updated successfully");
      router.push("/admin/users");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      toast.error(getError(err));
    }
  };
  return (
    <Layout title={`Edit User ${userId}`}>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/users">Products</Link>
            </li>
            <li>
              <Link href="/admin/users" className="font-bold">
                Users
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              //@ts-ignore
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit User ${userId}`}</h1>
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
              <div className="mb-4 flex flex-col">
                <label htmlFor="isAdmin">Is Admin</label>
                <input
                  type="checkbox"
                  className="w-5 m-3  ring-offset-0 ring-0"
                  id="isAdmin"
                  {...register("isAdmin")}
                />

                {errors.isAdmin && (
                  <div className="text-red-500">{errors.isAdmin.message}</div>
                )}
              </div>
              <div className="mb-4 flex flex-col">
                <label htmlFor="isSeller">Is seller</label>
                <input
                  type="checkbox"
                  className="w-5 m-3  ring-offset-0 ring-0"
                  id="isSeller"
                  {...register("isSeller")}
                />

                {errors.isSeller && (
                  <div className="text-red-500">{errors.isSeller.message}</div>
                )}
              </div>
              <div className="mb-4 flex justify-around">
                <button disabled={loadingUpdate} className="primary-button">
                  {loadingUpdate ? "Loading" : "Update"}
                </button>
                <div className="default-button">
                  <Link href={`/admin/users`}>Back</Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

// AdminUserEdit.auth = { adminOnly: true };
export default AdminUserEdit;
