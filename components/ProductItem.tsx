import Link from "next/link";
import React from "react";
import { Product } from "@/app";

type ProductItemProps = {
  product: Product;
};

const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <div className=" card ">
      <div className="overflow-hidden">
        <Link href={`/product/${product.slug}`} className="overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="hover:scale-150 transition duration-500"
          />
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center p-5 ">
        <Link href={`/product/${product.slug}`}>
          <h2 className=" text-lg">{product.name}</h2>
        </Link>
        <p className="mb-2 ">{product.brand}</p>
        <p>${product.price}</p>
        <button className="primary-button" type="button">
          Add to card
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
