import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import db from "@/utils/db";
import Order from "@/models/Order";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).send("signin required");
  }

  await db.connect();

  const order = await Order.findById(req.query.id);

  await db.disconnect();

  res.send(order);
};

export default handler;
