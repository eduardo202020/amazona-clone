import { Schema, models, model } from "mongoose";

// Document interface
export interface UserProps {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isSeller: boolean;
  seller: {
    name: String;
    logo: String;
    description: String;
    rating: { type: Number; default: 0; required: true };
    numReviews: { type: Number; default: 0; required: true };
  };
}

// Schema
const userSchema = new Schema<UserProps>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isSeller: { type: Boolean, required: true, default: false },
    seller: {
      name: String,
      logo: String,
      description: String,
      rating: { type: Number, default: 0, required: true },
      numReviews: { type: Number, default: 0, required: true },
    },
  },
  {
    timestamps: true,
  }
);

// si ya esta creado lo enviamos, si no lo creamos
const User = models.User || model("User", userSchema);

export default User;
