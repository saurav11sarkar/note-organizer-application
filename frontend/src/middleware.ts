import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/dashboard"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If user is already logged in, redirect them away from auth pages
  if (authRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Protect routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
