import mongoose from "mongoose";
import db from "../../../../utils/db";
import Product from "../../../../models/Product";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  db.connect();
  const product = await Product.findById(req.query.id);
  db.disconnect();
  if (product) {
    res.send(product.reviews);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: any
) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    const existReview = product.reviews.find((x: any) => x.user == user._id);
    if (existReview) {
      await Product.updateOne(
        { _id: req.query.id, "reviews._id": existReview._id },
        {
          $set: {
            "reviews.$.comment": req.body.comment,
            "reviews.$.rating": Number(req.body.rating),
          },
        }
      );

      const updatedProduct = await Product.findById(req.query.id);
      updatedProduct.numReviews = updatedProduct.reviews.length;
      updatedProduct.rating =
        updatedProduct.reviews.reduce((a, c) => c.rating + a, 0) /
        updatedProduct.reviews.length;
      await updatedProduct.save();

      await db.disconnect();
      return res.send({ message: "Review updated" });
    } else {
      const review = {
        user: mongoose.Types.ObjectId(user._id),
        name: user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      await product.save();
      await db.disconnect();
      res.status(201).send({
        message: "Review submitted",
      });
    }
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product Not Found" });
  }
};
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).send("signin required");
    }
    const { user } = session;
    return postHandler(req, res, user);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

export default handler;
