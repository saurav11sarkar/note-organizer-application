import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );

        const data = await res.json();
        console.log({ data });
        return res.ok ? data.data : null;
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/error",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      if (
        (account?.provider === "google" || account?.provider === "github") &&
        user.email
      ) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: user.name,
                email: user.email,
                image: user?.image,
                method: account.provider,
              }),
            }
          );
          const data = await res.json();

          (user as any).role =
            user.email === "sauravsarkar.developer@gmail.com"
              ? "admin"
              : data.user?.role || "user";
        } catch (err) {
          console.error("Social login registration failed:", err);
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.user) {
        (session.user as any).role = (token.user as any).role;
      }
      return session;
    },
  },
};
