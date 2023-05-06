import Product from "../../../../../models/Product";
import db from "../../../../../utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //@ts-ignore
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send("session required");
  }
  if (session.user.isAdmin || session.user.isSeller) {
    if (req.method === "GET") {
      return getHandler(req, res);
    } else if (req.method === "PUT") {
      return putHandler(req, res, session.user._id);
    } else if (req.method === "DELETE") {
      return deleteHandler(req, res);
    } else {
      return res.status(400).send({ message: "Method not allowed" });
    }
  }

  return res.status(401).send("admin/seller signin required");
};
const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
};
const putHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) => {
  await db.connect();
  console.log({ body: req.body });

  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.seller = req.body.seller ? req.body.seller : id;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    await product.save();
    await db.disconnect();
    res.send({ message: "Product updated successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product not found" });
  }
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await Product.findOneAndDelete(product._id);
    await db.disconnect();
    res.send({ message: "Product deleted successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product not found" });
  }
};

export default handler;
