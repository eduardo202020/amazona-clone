import Product, { ProductProps } from "@/models/Product";
import db from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const product: ProductProps | null = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
};

export default handler;
