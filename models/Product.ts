import mongoose, { Schema } from "mongoose";
// import { Types } from "mongoose";

// Document interface
export interface ProductProps {
  _id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  description: string;
  isFeatured: boolean;
  banner: string;
  createdAt: string;
  updatedAt: string;
}

// Schema
const productShema = new Schema<ProductProps>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    banner: String,
  },
  {
    timestamps: true,
  }
);

// si ya esta creado lo enviamos, si no lo creamos
const Product =
  mongoose.models.Product || mongoose.model("Product", productShema);

export default Product;
