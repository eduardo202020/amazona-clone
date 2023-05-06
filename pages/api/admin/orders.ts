import { getSession } from "next-auth/react";
import Order from "../../../models/Order";
import db from "../../../utils/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send("signin required");
  }

  if (session.user.isAdmin || session.user.isSeller) {
    if (req.method === "GET") {
      await db.connect();
      let orders;

      if (!session.user.isAdmin && session.user.isSeller) {
        orders = await Order.find({ seller: session.user._id }).populate(
          "user",
          "name"
        );
        await db.disconnect();
        return res.send(orders);
      }

      orders = await Order.find({}).populate("user", "name");
      await db.disconnect();
      return res.send(orders);
    } else {
      return res.status(400).send({ message: "Method not allowed" });
    }
  }

  return res.status(401).send("admin/seller signin required");
};

export default handler;
