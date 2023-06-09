import bcryptjs from "bcryptjs";
import User from "../../../models/User";
import db from "../../../utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // api solo para el metodo put
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
  // @ts-ignore
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).send({ message: "signin required" });
  }

  const { user } = session;
  const { name, email, password } = req.body;

  // validamos los elementos del body
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    (password && password.trim().length < 5)
  ) {
    res.status(422).json({
      message: "Validation error",
    });
    return;
  }

  await db.connect();
  const toUpdateUser = await User.findById(user._id);
  toUpdateUser.name = name;
  toUpdateUser.email = email;

  if (password) {
    toUpdateUser.password = bcryptjs.hashSync(password);
  }

  await toUpdateUser.save();
  await db.disconnect();
  res.send({
    message: "User updated",
  });
}

export default handler;
