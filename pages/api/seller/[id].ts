import User, { UserProps } from "@/models/User";
import db from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const seller: UserProps | null = await User.findById(req.query.id);
  await db.disconnect();
  res.send(seller);
};

export default handler;
