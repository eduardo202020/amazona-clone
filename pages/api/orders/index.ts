import Order from "../../../models/Order";
import db from "../../../utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getServerSession(req, res, authOptions);

  if (!user) {
    return res.status(401).send("signin required");
  }

  await db.connect();
  const newOrder = new Order({
    ...req.body,
    user: user.user._id,
  });

  const order = await newOrder.save();
  res.status(201).send(order);
};
export default handler;
