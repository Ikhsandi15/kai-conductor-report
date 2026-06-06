import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Jika belum login, redirect ke login (sudah dihandle oleh next-auth otomatis karena authorized callback)

    // ADMIN ONLY: /trains dan /reports (Dashboard Rekap)
    if (path.startsWith("/trains") || path === "/reports") {
      if (token?.role !== "ADMIN") {
        // Jika Kondektur mencoba akses halaman Admin, kembalikan ke form laporan
        return NextResponse.redirect(new URL("/reports/new", req.url));
      }
    }

    // CONDUCTOR ONLY: /reports/new
    if (path.startsWith("/reports/new")) {
      if (token?.role !== "CONDUCTOR") {
        // Jika Admin mencoba akses form laporan Kondektur, kembalikan ke dashboard
        return NextResponse.redirect(new URL("/reports", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Pastikan route dilindungi, hanya kembalikan true jika punya token (sudah login)
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Tentukan halaman mana saja yang butuh auth
export const config = {
  matcher: ["/reports/:path*", "/trains/:path*"],
};
