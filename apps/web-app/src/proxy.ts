import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("sid");
  const isAuthenticated = !!sessionCookie?.value;

  if (pathname.startsWith("/auth/")) {
    if (isAuthenticated && pathname !== "/auth/consent") {
      return NextResponse.redirect(new URL("/developer", request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",

    "/developer/:path*",
    "/profile/:path*",

    "/api/developer/:path*",
    "/api/profile/:path*",
  ],
};
