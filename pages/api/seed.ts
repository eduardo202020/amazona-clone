import User from "@/models/User";
import db from "@/utils/db";
import data from "@/utils/data";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await db.disconnect()
  res.send({message: 'seeded successfully'})
};

export default handler
