import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const headers = new Headers(req.headers);
    const url = new URL(req.url);
    const pathname = url.pathname;
    headers.set("x-pathname", pathname);

    return NextResponse.next({
        headers: headers
    });
}
export const config = {
  matcher: "/(.*)"
};
