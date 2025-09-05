import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;
    const url = req.nextUrl.clone();

    if (!token) {
        if (url.pathname !== "/login" && url.pathname !== "/register") {
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    if (role === "ADMIN") {
        if (
            url.pathname === "/" ||
            url.pathname.startsWith("/blog") ||
            url.pathname.startsWith("/shop") ||
            url.pathname.startsWith("/cart") ||
            url.pathname.startsWith("/wishlist") ||
            url.pathname.startsWith("/orders")
        ) {
            url.pathname = "/admin";
            return NextResponse.redirect(url);
        }
    }

    if (role !== "ADMIN") {
        if (url.pathname.startsWith("/admin")) {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/admin/:path*",
        "/blog/:path*",
        "/shop/:path*",
        "/cart/:path*",
        "/wishlist/:path*",
        "/orders/:path*",
        "/login",
        "/register"
    ],
};
