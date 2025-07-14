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

        try {
          const res = await fetch(
            `${process.env.NEXTAUTH_URL}/api/user/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            }
          );

          const data = await res.json();
          if (!res.ok || !data.data) return null;

          const userData = data.data.data;

          return {
            id: userData._id,
            name: userData.name,
            email: userData.email,
            image: userData.image,
            role: userData.role,
            accessToken: data.data.accessToken,
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
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
      if ((account?.provider === "google" || account?.provider === "github") && user?.email) {
        try {
          // Try login first
          const loginRes = await fetch(
            `${process.env.NEXTAUTH_URL}/api/user/login`,
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

          if (loginRes.ok && loginData.data?.accessToken) {
            const u = loginData.data.data;
            user.id = u._id;
            user.name = u.name;
            user.email = u.email;
            user.image = u.image;
            user.role = u.role || "user";
            (user as any).accessToken = loginData.data.accessToken;
            return true;
          }

          // Register fallback
          const registerRes = await fetch(
            `${process.env.NEXTAUTH_URL}/api/user/register`,
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

          const registerData = await registerRes.json();
          if (registerRes.ok && registerData.data?.accessToken) {
            const u = registerData.data.data;
            user.id = u._id;
            user.name = u.name;
            user.email = u.email;
            user.image = u.image;
            user.role = u.role || "user";
            (user as any).accessToken = registerData.data.accessToken;
            return true;
          }

          console.error("Social login failed:", registerData.message);
          return false;
        } catch (err) {
          console.error("SignIn callback error:", err);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = {
          id: (user as any).id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: (user as any).role || "user",
        };
        token.accessToken = (user as any).accessToken;
      }

      if (trigger === "update" && session?.user) {
        token.user = {
          ...token.user,
          name: session.user.name,
          image: session.user.image,
        };
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.user) {
        session.user = {
          id: (token.user as any).id,
          name: token.user.name,
          email: token.user.email,
          image: token.user.image,
          role: (token.user as any).role || "user",
        };
        session.accessToken = token.accessToken as string;
      }

      return session;
    },
  },
};

