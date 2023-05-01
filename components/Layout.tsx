import { useStore } from "@/utils/store";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";

import { Menu } from "@headlessui/react";
import {
  EllipsisVerticalIcon as DotsVerticalIcon,
  XCircleIcon as XCircleIcon,
  Bars3BottomLeftIcon as MenuIcon,
  SunIcon as SunIcon,
  MoonIcon as MoonIcon,
  MagnifyingGlassIcon as SearchIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { getError } from "@/utils/error";
import { toast } from "react-hot-toast";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function Layout({ children, title }: LayoutProps) {
  const { state, dispatch } = useStore();
  const { cart, darkMode } = state;
  // const [cartItemsCount, setCartItemsCount] = useState(0);

  const { data: session, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const hideMenu = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", hideMenu);
    return () => {
      window.removeEventListener("resize", hideMenu);
    };
  }, [isOpen]);

  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  // useEffect(() => {
  //   setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  // }, [cart.cartItems]);

  const logoutClickHandler = () => {
    // user logout and remove cookies cart
    Cookies.remove("cart");
    dispatch({ type: "CART_CLEAR" });
    signOut({ callbackUrl: "/login" });
  };

  useEffect(() => {
    fetchCategories();
    const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
    if (userMedia.matches && !Cookies.get("darkMode")) {
      dispatch({ type: "DARK_MODE_ON" });
      const root = window.document.documentElement;
      root.classList.remove("light");
      root.classList.add("dark");
    }
    if (darkMode) {
      dispatch({ type: "DARK_MODE_ON" });
      const root = window.document.documentElement;
      root.classList.remove("light");
      root.classList.add("dark");
    }
  }, [darkMode, dispatch]);

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const [query, setQuery] = useState("");

  const router = useRouter();
  const submitHandler = (e: any) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  const darkModeChangeHandler = () => {
    const newDarkMode = !darkMode;
    dispatch({ type: newDarkMode ? "DARK_MODE_ON" : "DARK_MODE_OFF" });
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");

    const root = window.document.documentElement;
    root.classList.remove(newDarkMode ? "light" : "dark");
    root.classList.add(newDarkMode ? "dark" : "light");
  };

  const navMenu = () => {
    return (
      <>
        <form
          onSubmit={submitHandler}
          className="mx-auto mr-3 mt-1 flex w-full justify-center md:hidden"
        >
          <input
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            className="rounded-tr-none rounded-br-none p-1 text-sm"
            placeholder="Search products"
          />
          <button
            className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
            type="submit"
            id="button-addon2"
          >
            <SearchIcon className="h-5 w-5"></SearchIcon>
          </button>
        </form>

        {status === "loading" ? (
          "Loading"
        ) : session?.user ? (
          <Menu as="div" className="relative inline-block z-10">
            <Menu.Button className="text-blue-600">
              {session.user.name}
            </Menu.Button>
            <Menu.Items className="absolute right-0 w-56 origin-top-right   bg-white shadow-lg   dark:bg-black dark:shadow-gray-700">
              <Menu.Item>
                <Link className="dropdown-link" href="/profile">
                  Profile
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link className="dropdown-link" href="/order-history">
                  Order History
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link className="dropdown-link" href="/admin/dashboard">
                  Admin Dashboard
                </Link>
              </Menu.Item>

              <Menu.Item>
                <a
                  className="dropdown-link"
                  href="#"
                  onClick={logoutClickHandler}
                >
                  Logout
                </a>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        ) : (
          <Link href="/login" className="p-2">
            Login
          </Link>
        )}

        <div className="mx-auto p-2">
          <Link href="/cart" className="p-2 cursor-pointer">
            Cart
            {cartItemsCount > 0 && (
              <span className="ml-1 rounded-full bg-red-600 py-1 text-xs font-bold text-white px-2">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>
        <div>
          <button className="py-2 pr-2">
            {darkMode ? (
              <SunIcon
                onClick={darkModeChangeHandler}
                className="h-5 w-5 text-blue-500  "
              />
            ) : (
              <MoonIcon
                onClick={darkModeChangeHandler}
                className="h-5 w-5 text-blue-500  "
              />
            )}
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>{title ? title : "Amazona"}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between bg-white text-black transition-all  dark:bg-black dark:text-white">
        <div>
          <nav
            className="relative flex h-12 items-center  justify-between shadow-md dark:shadow-gray-700 "
            role="navigation"
          >
            <div className="flex items-center">
              <div
                className="cursor-pointer px-4  "
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <MenuIcon className="h-5 w-5 text-blue-500"></MenuIcon>
              </div>
              <Link
                href="/"
                className="text-lg font-bold text-black dark:text-white"
              >
                amazona
              </Link>
            </div>
            <form
              onSubmit={submitHandler}
              className="mx-auto   hidden w-full justify-center md:flex "
            >
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                className="rounded-tr-none rounded-br-none p-1 text-sm   focus:ring-0"
                placeholder="Search products"
              />
              <button
                className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
                type="submit"
                id="button-addon2"
              >
                <SearchIcon className="h-5 w-5 " />
              </button>
            </form>
            <div className="cursor-pointer px-4 md:hidden" onClick={toggle}>
              <DotsVerticalIcon className="h-5 w-5 text-blue-500"></DotsVerticalIcon>
            </div>
            <div className="hidden items-center md:flex">{navMenu()}</div>
          </nav>
          <div
            className={
              isOpen ? "grid grid-rows-2 items-center text-center" : "hidden"
            }
            onClick={toggle}
          >
            {navMenu()}
          </div>
          <div
            className={`fixed top-0 left-0 z-40 h-full w-[20rem] bg-gray-300 p-10 duration-300  ease-in-out dark:bg-gray-800 ${
              showSidebar ? "translate-x-0" : "translate-x-[-20rem]"
            }`}
          >
            <div className="mb-2 flex justify-between">
              <h2>Shopping By Categories</h2>
              <button onClick={() => setShowSidebar(!showSidebar)}>
                <XCircleIcon className="h-5 w-5  "></XCircleIcon>
              </button>
            </div>
            <ul>
              {categories.map((category) => (
                <li key={category} onClick={() => setShowSidebar(false)}>
                  <Link href={`/search?category=${category}`}>{category}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container m-auto mt-4 px-4">{children}</div>
        <div className="flex h-10 items-center justify-center shadow-inner dark:shadow-gray-700">
          <p>Copyright © 2022 Amazona</p>
        </div>
      </div>
    </>
  );
}
