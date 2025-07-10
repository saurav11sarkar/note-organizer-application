import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.data) return null;

        console.log({ data: data.data.accessToken });

        return {
          ...data.data.data,
          accessToken: data.data.accessToken,
        };
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
      // Social login auto-register
      // console.log({user})
      if (
        (account?.provider === "google" || account?.provider === "github") &&
        user?.email
      ) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/register`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: user.name,
                email: user.email,
                image: user.image,
                method: account.provider,
              }),
            }
          );

          const data = await res.json();
          // console.log({data})

          if (res.ok && data.data?.accessToken) {
            (user as any).accessToken = data.data.accessToken;
            (user as any).role = data.user?.role || "user";
          } else {
            // If already exists — login instead
            const loginRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/user/login`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: user.email,
                  password: "SOCIAL_LOGIN",
                }),
              }
            );
            const loginData = await loginRes.json();
            // console.log({loginData})

            if (loginRes.ok && loginData.data?.accessToken) {
              (user as any).accessToken = loginData.data.accessToken;
              (user as any).role = loginData.user?.role || "user";
            }
          }
        } catch (err) {
          console.error("Social login registration failed:", err);
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // console.log({ user });
      if (user) {
        token.user = {
          name: user.name,
          email: user.email,
          image: user.image,
          role: (user as any).role || "user",
        };

        token.accessToken = (user as any).accessToken || token.accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.user) {
        (session.user as any).role = (token.user as any).role || "user";
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
};
