import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import db from "@/utils/db";
import Product, { ProductProps } from "@/models/Product";
import { useStore } from "@/utils/store";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Home({
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // importamos el contexto
  const { state, dispatch } = useStore();
  const { cart } = state;

  const addToCardHandler = async (product: ProductProps) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get<ProductProps>(
      `/api/products/${product._id}`
    );

    // comprueba si hay productos en stock
    if (data.countInStock < quantity) {
      toast.error("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });

    toast.success("Product added to the cart");
  };

  return (
    <Layout title="Home Page">
      <div className=" grid grid-col1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product: ProductProps) => (
          <ProductItem
            addToCardHandler={addToCardHandler}
            key={product.name}
            product={product}
          />
        ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  await db.connect();
  const products: ProductProps[] = await Product.find().lean();

  // nuevo objeto que usa la funcion convert para serializar(convertir a string sus propiedades(_id,dates)s)
  const myProducts: ProductProps[] = products.map(db.convertDocToObj);
  await db.disconnect();
  return {
    props: {
      products: myProducts,
    },
  };
};
