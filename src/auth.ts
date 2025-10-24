import NextAuth, { Account, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { userListAllowed } from "./constants";

function checkUserExists(email: string) {
  return userListAllowed.has(email);
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    error: "/login",
  },
  callbacks: {
    async signIn({
      user,
      account /*, profile, email, credentials */,
    }: {
      user: User;
      account?: Account | null | undefined;
    }) {
      try {
        if (account?.provider === "google" && user.email)
          return checkUserExists(user.email);
        return false;
      } catch (e) {
        console.error("login error", e);
        return false;
      }
    },
  },
});
