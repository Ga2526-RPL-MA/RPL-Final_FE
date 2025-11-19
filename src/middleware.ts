import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const role = req.cookies.get("role")?.value;

  const path = req.nextUrl.pathname;

  // dosen route protection
  if (path.startsWith("/dosen") && role !== "DOSEN") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // mahasiswa route protection
  if (path.startsWith("/mahasiswa") && role !== "MAHASISWA") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Wajib login untuk semua halaman role
  const protectedRoutes = ["/mahasiswa", "/dosen"];
  const isProtected = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}
