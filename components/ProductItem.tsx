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
      <div className="overflow-hidden">
        <Link href={`/product/${product.slug}`} className="overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="hover:scale-150 transition duration-500 rounded shadow object-cover h-64 w-full"
          />
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center p-5 ">
        <Link href={`/product/${product.slug}`}>
          <h2 className=" text-lg">{product.name}</h2>
        </Link>
        <Rating rating={product.rating} />
        <p className="mb-2 ">{product.brand}</p>
        <p>${product.price}</p>
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
