import Product from "../../../../models/Product";
import db from "../../../../utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //@ts-ignore
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    return getHandler(req, res, req.query.userId as string);
  }

  if (session?.user.isAdmin || session?.user.isSeller) {
    // verificamos el metodo
    if (req.method === "POST") {
      return postHandler(req, res, session.user._id);
    } else {
      return res.status(400).send({ message: "Method not allowed" });
    }
  }

  return res.status(401).send("admin/seller signin required");
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) => {
  await db.connect();
  const newProduct = await Product.create({
    name: "sample name",
    slug: "sample-name-" + Math.random(),
    seller: id,
    image: "/images/shirt1.jpg",
    price: 0,
    category: "sample category",
    brand: "sample brand",
    countInStock: 0,
    description: "sample description",
    rating: 0,
    numReviews: 0,
  });

  const product = await newProduct.save();
  await db.disconnect();

  res.send({ message: "Product created successfully", product });
};

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) => {
  await db.connect();
  let products;

  // si viene el id como parametro, agregar al filtro de busqueda
  if (id) {
    products = await Product.find({ seller: id });
    await db.disconnect();
    return res.send(products);
  }

  // si no hay id, devolvemos todos los productos
  products = await Product.find();
  await db.disconnect();
  res.send(products);
};
export default handler;
