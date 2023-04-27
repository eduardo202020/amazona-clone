import Product from "../../../../models/Product";
import db from "../../../../utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //@ts-ignore
  const session = await getServerSession(req, res, authOptions);

  // verficamos que haya usuario y que sea admin
  if (!session || !session.user.isAdmin) {
    return res.status(401).send("admin signin required");
  }

  // verificamos el metodo
  if (req.method === "GET") {
    return getHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
};
export default handler;
