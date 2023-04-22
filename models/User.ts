import mongoose, { Schema } from "mongoose";

// Document interface
interface UserProps {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

// Schema
const userSchema = new Schema<UserProps>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

// si ya esta creado lo enviamos, si no lo creamos
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
