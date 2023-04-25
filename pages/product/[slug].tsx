import Layout from "@/components/Layout";
import { useStore } from "@/utils/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Product, { ProductProps } from "@/models/Product";
import db from "@/utils/db";
import { GetServerSideProps } from "next";
import axios from "axios";
import { toast } from "react-hot-toast";

function ProductScreen({ product }: { product: ProductProps }) {
  const { dispatch, state } = useStore();

  if (!product) {
    return (
      <Layout title="Product Not Found">
        <div>Product not Found</div>
      </Layout>
    );
  }

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

  // nuevo objeto que usa la funcion convert para serializar(convertir a string sus propiedades(_id,dates))
  const myProduct: ProductProps = product ? db.convertDocToObj(product) : null;
  await db.disconnect();
  return {
    props: {
      product: myProduct,
    },
  };
};
