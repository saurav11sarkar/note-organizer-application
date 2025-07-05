import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/dashboard", "/profile"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  // Redirect authenticated users away from auth pages
  if (authRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Protect routes that require authentication
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Add role-based checks here if needed
    // if (pathname.startsWith("/admin") && token.role !== "admin") {
    //   return NextResponse.redirect(new URL("/", req.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};