import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import Rating from "@/components/Rating";
import { ProductProps } from "@/models/Product";
import { UserProps } from "@/models/User";
import { getError } from "@/utils/error";
import { useStore } from "@/utils/store";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";
import { toast } from "react-hot-toast";

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

const Seller = () => {
  const router = useRouter();
  const userId = router.query.id;
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState<UserProps>();

  const { state, dispatch: dispatch2 } = useStore();
  const { cart } = state;

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/users/${userId}`);
        setUser(data);
        const { data: fetchedProducts } = await axios.get(
          `/api/admin/products?userId=${userId}`
        );
        setProducts(fetchedProducts);

        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (userId === undefined) {
      return;
    }
    fetchData();
  }, [userId]);

  const addToCardHandler = async (product: ProductProps) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get<ProductProps>(
      `/api/products/${product._id}`
    );

    // comprueba si hay productos en stock
    if (data.countInStock < quantity) {
      toast.error("Sorry. Product is out of stock");
      return;
    }
    dispatch2({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });

    toast.success("Product added to the cart");
  };

  console.log({ user });

  return (
    <Layout title="Admin Dashboard">
      {error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid  md:grid-cols-4 md:gap-5">
          <div>
            <div className="card p-5 ">
              <img
                className="mx-auto rounded-md shadow-lg mb-2"
                //@ts-ignore
                src={user?.seller.logo}
                //@ts-ignore
                alt={user?.seller.name}
              ></img>
              <ul>
                <li>
                  <div className="pb-3 text-3xl font-semibold mt-2">
                    {user?.seller.name}
                  </div>
                </li>
                <li className="mt-2">{user?.seller.description}</li>
                <li className="">
                  <Rating
                    //@ts-ignore
                    rating={user?.seller.rating || 0}
                    //@ts-ignore
                    numReviews={user?.seller.numReviews || 0}
                  />
                </li>
              </ul>
            </div>
            {/* products */}
          </div>
          <div className="md:col-span-3">
            {loading ? (
              <div>loading...</div>
            ) : (
              <div className=" grid grid-col-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product: ProductProps) => (
                  <ProductItem
                    addToCardHandler={addToCardHandler}
                    key={product.name}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};
export default Seller;
