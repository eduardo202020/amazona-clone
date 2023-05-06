import Link from "next/link";
import React from "react";
import { ProductProps } from "@/models/Product";
import Rating from "./Rating";

// eslint-disable-next-line no-unused-vars
type functionProps = (product: ProductProps) => Promise<void>;

type ProductItemProps = {
  product: ProductProps;
  addToCardHandler: functionProps;
};

const ProductItem = ({ product, addToCardHandler }: ProductItemProps) => {
  return (
    <div className=" card ">
      <div className="overflow-hidden  bg-gradient-to-r dark:from-neutral-700 from-neutral-100 via-neutral-400 dark:via-neutral-400 to-neutral-100 dark:to-neutral-700">
        <Link href={`/product/${product.slug}`} className="overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className=" hover:scale-125 transition duration-500 rounded shadow h-64 w-full object-scale-down"
          />
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center p-5 ">
        <Link href={`/product/${product.slug}`}>
          <h2 className=" text-lg">{product.name}</h2>
        </Link>
        <Rating rating={product.rating} />
        <p className="mb-2 ">{product.brand}</p>
        <div className="flex justify-between my-2 items-center w-5/6">
          <p>${product.price}</p>
          {/*//@ts-ignore*/}
          <Link
            //@ts-ignore
            href={`/seller/${product.seller._id}`}
            className="font-semibold text-xl cursor-pointer hover:underline hover:scale-110 transition-all duration-200 drop-shadow-md hover:text-sky-300"
          >
            {/*//@ts-ignore*/}
            {product.seller?.seller?.name}
          </Link>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCardHandler(product)}
        >
          Add to card
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
