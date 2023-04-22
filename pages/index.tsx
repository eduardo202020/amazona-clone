import Layout from "@/components/Layout";
import data from "@/utils/data";
import ProductItem from "@/components/ProductItem";

export default function Home() {
  return (
    <Layout title="Home Page">
      <div className=" grid grid-col1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data.products.map((product) => (
          <ProductItem key={product.name} product={product} />
        ))}
      </div>
    </Layout>
  );
}
