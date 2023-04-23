import { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      _id: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    _id: string;
    name: string;
    email: string;
    image: string;
    isAdmin: boolean;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    _id?: string;
    isAdmin: boolean;
  }
}
