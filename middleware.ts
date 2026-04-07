import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminSession } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  // Only protect the /admin routes, but allow access to the /admin/login page and API routes
  if (request.nextUrl.pathname.startsWith("/admin/") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
    
    if (!cookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const isValid = await isValidAdminSession(cookie);
    if (!isValid) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete(ADMIN_COOKIE); // Clear invalid cookie
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
