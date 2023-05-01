import Product from "@/models/Product";
import db from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  await db.connect();
  const categories = await Product.find().distinct("category");
  await db.disconnect();
  res.send(categories);
};

export default handler;
