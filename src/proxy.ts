import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const { role } = jwtDecode<{ role: "teacher" | "student" }>(token);
  if (req.nextUrl.pathname.startsWith("/teacher") && role !== "teacher") {
    return NextResponse.redirect(new URL("/student/tasks", req.url));
  }
  if (req.nextUrl.pathname.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL("/teacher/tasks", req.url));
  }
  return NextResponse.next();
}
