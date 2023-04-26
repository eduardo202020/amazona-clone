import Order from "../../../models/Order";
import db from "../../../utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).send({ message: "signin required" });
  }
  await db.connect();
  const orders = await Order.find({ user: session.user._id });
  await db.disconnect();
  res.send(orders);
};

export default handler;
