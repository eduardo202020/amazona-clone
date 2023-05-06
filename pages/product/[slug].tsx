import Layout from "@/components/Layout";
import { useStore } from "@/utils/store";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Product, { ProductProps } from "@/models/Product";
import db from "@/utils/db";
import { GetServerSideProps } from "next";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getError } from "@/utils/error";

import Rating from "../../components/Rating";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

interface PropsForm {
  rating: number;
  comment: string;
}

function ProductScreen({ product }: { product: ProductProps }) {
  const { dispatch, state } = useStore();

  const [reviews, setReviews] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  console.log({ productInPage: product });

  const fetchReviews = useCallback(async () => {
    try {
      if (!product) {
        return;
      }
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);
      setReviews(data);
    } catch (err) {
      toast.error(getError(err));
    }
  }, [product]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PropsForm>();

  if (!product) {
    return (
      <Layout title="Product Not Found">
        <div>Product not Found</div>
      </Layout>
    );
  }

  //@ts-ignore
  const submitHandler = async ({ rating, comment }) => {
    setLoading(true);
    try {
      await axios.post(`/api/products/${product._id}/reviews`, {
        rating,
        comment,
      });
      setLoading(false);
      toast.success("Review submitted successfully");
      fetchReviews();
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  const addToCardHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    // obtenemos el producto desde la api para obtener su stock
    const { data } = await axios.get<ProductProps>(
      `/api/products/${product._id}`
    );

    // comprueba si hay productos en stock
    if (data.countInStock < quantity) {
      toast.error("Sorry, Product is out of stock");

      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    toast.success("Product added to the cart");
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">
          <ArrowLeftIcon className="h-5 w-5 hover:-translate-x-2 transition duration-700 hover:font-bold" />
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? "In stock" : "Unavailable"}</div>
            </div>
            <button
              onClick={addToCardHandler}
              className="primary-button w-full"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
      <div id="reviews" className="max-w-screen-md">
        <h2 className="mt-3 text-lg">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <div>
            <div>No review found</div>
          </div>
        ) : (
          <ul>
            {reviews.map((review: any) => (
              <li key={review._id}>
                <div className="mt-3 p-3 shadow-inner dark:shadow-gray-700">
                  <div>
                    <strong>{review.name}</strong> on{" "}
                    {review.createdAt.substring(0, 10)}
                  </div>
                  <Rating rating={review.rating} numReviews={review.rating} />
                  <div>{review.comment}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="card mt-5  p-5">
          {session ? (
            <form onSubmit={handleSubmit(submitHandler)}>
              <h2 className="mb-4 text-lg">Leave your review</h2>
              <div className="mb-4">
                <label htmlFor="comment">Comment</label>
                <textarea
                  className="w-full"
                  id="comment"
                  {...register("comment", {
                    required: "Please enter comment",
                  })}
                />
                {errors.comment && (
                  <div className="text-red-500">{errors.comment.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="rating">Rating</label>
                <select
                  id="rating"
                  className="w-full"
                  {...register("rating", {
                    required: "Please enter rating",
                  })}
                >
                  <option value=""></option>
                  {["1 star", "2 stars", "3 stars", "4 stars", "5 stars"].map(
                    (x, index) => (
                      <option key={index + 1} value={index + 1}>
                        {x}
                      </option>
                    )
                  )}
                </select>
                {errors.rating && (
                  <div className="text-red-500 ">{errors.rating.message}</div>
                )}
              </div>
              <div className="mb-4 ">
                <button disabled={loading} className="primary-button">
                  {loading ? "Loading" : "Submit"}
                </button>
              </div>
            </form>
          ) : (
            <div>
              Please{" "}
              <Link href={`/login?redirect=/product/${product.slug}`}>
                login
              </Link>{" "}
              to write a review
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
export default ProductScreen;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const { slug } = params as Record<string, string>;

  await db.connect();
  const product: ProductProps | null = await Product.findOne({
    slug,
  }).lean();
  console.log({ productInServer: product });

  // nuevo objeto que usa la funcion convert para serializar(convertir a string sus propiedades(_id,dates))
  const myProduct: ProductProps = product ? db.convertDocToObj(product) : null;
  await db.disconnect();
  return {
    props: {
      product: myProduct,
    },
  };
};
