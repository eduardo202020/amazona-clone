import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

import { StoreProvider } from "@/utils/store";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { ReactElement, ReactPortal } from "react";
import { AppProps } from "next/app";

type Total = AppProps & {
  auth?: string;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: Total) {
  return (
    <SessionProvider session={session}>
      <Toaster />

      <StoreProvider>
        {/* {Component.auth ? (
          <Auth>
            <Component {...pageProps} />{" "}
          </Auth>
        ) : (
          <Component {...pageProps} />
        )} */}

        <Component {...pageProps} />
      </StoreProvider>
    </SessionProvider>
  );
}

// interface AuthProps {
//   children: ReactNode;
// }

type ReactText = string | number;
type ReactChild = ReactElement | ReactText;

interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray;
type ReactNode =
  | ReactChild
  | ReactFragment
  | ReactPortal
  | boolean
  | null
  | undefined;

// eslint-disable-next-line no-unused-vars
const Auth = ({ children }: { children: ReactNode }): ReactNode => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=login required");
    },
  });

  if (status === "loading") {
    return <div>Loading</div>;
  }

  return children;
};
