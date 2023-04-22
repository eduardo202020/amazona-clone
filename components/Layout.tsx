import { useStore } from "@/utils/store";
import Head from "next/head";
import Link from "next/link";
import React from "react";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function Layout({ children, title }: LayoutProps) {
  const { state } = useStore();
  const { cart } = state;

  return (
    <>
      <Head>
        <title>{title ? title + " - Amazona" : "Amazona"}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          {/* <div className=" "> */}
          <nav className="flex h-12 items-center px-4 justify-between shadow-md ">
            <Link href="/" className="text-lg font-bold">
              Amazona
            </Link>
            <div>
              <Link href="/cart" className="p-2 cursor-pointer">
                Cart
                {cart.cartItems.length > 0 && (
                  <span className="ml-1 rounded-full bg-red-600 py-1 text-xs font-bold text-white px-2">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </span>
                )}
              </Link>
              <Link href="/login" className="p-2 cursor-pointer">
                Login
              </Link>
            </div>
          </nav>
          {/* </div> */}
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2022 Amazona</p>
        </footer>
      </div>
    </>
  );
}
