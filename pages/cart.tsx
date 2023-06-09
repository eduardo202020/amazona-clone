import Layout from "@/components/Layout";
import { useStore } from "@/utils/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { CartItem } from "@/app";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import axios from "axios";
import { ProductProps } from "@/models/Product";
import { toast } from "react-hot-toast";

const CartScreen = () => {
  const {
    state: { cart },
    dispatch,
  } = useStore();
  const { cartItems } = cart;

  const router = useRouter();

  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  // uso del dispatch
  const updateCartHandler = async (item: CartItem, qty: string) => {
    const quantity = Number(qty);
    const { data } = await axios.get<ProductProps>(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      toast.error("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
    toast.success("Product updated in the cart");
  };

  return (
    <Layout>
      <h1 className="mb-4 text-xl ">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full">
              <thead className=" border-b">
                <tr>
                  <th className="px-5 text-left"> Item</th>
                  <th className="p-5 text-right"> Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={item.slug}
                    className="border-b hover:bg-neutral-300 transition px-5"
                  >
                    <td>
                      <Link
                        href={`/product/${item.slug}`}
                        className=" flex items-center"
                      >
                        <Image
                          src={item.image || ""}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        &nbsp;
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">{item.price}</td>
                    <td className="p-5 text-center">
                      <button>
                        <XCircleIcon
                          onClick={() => removeItemHandler(item)}
                          className="h-5 w-5"
                        ></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Subtotal ({cartItems.reduce((a, b) => a + b.quantity, 0)}) : $
                  {cartItems.reduce((a, b) => a + b.quantity * b.price, 0)}
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push("/login?redirect=/shipping")}
                  className="primary-button w-full"
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
