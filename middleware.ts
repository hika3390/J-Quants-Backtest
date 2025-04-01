import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// 認証が不要なパス
const publicPaths = ["/auth/signin", "/auth/signup", "/api/auth/signup"]

export async function middleware(req: NextRequest) {
  const headers = new Headers(req.headers)
  const pathname = req.nextUrl.pathname
  const protocol = headers.get('x-forwarded-proto') || 'http';
  const isSecure = protocol === 'https';

  // パスがpublicPathsに含まれる場合は認証をスキップ
  if (publicPaths.some(path => pathname.startsWith(path))) {
    headers.set("x-pathname", pathname)
    return NextResponse.next({
      headers: headers
    })
  }

  // APIルートの場合は認証をスキップ
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const token = await getToken({ 
    req,
    secureCookie: isSecure, // HTTPSの場合はtrue、HTTPの場合はfalse
    cookieName: process.env.NEXTAUTH_COOKIE_NAME || 'next-auth.session-token'
  })

  // 未認証の場合はログインページにリダイレクト
  if (!token) {
    const url = new URL("/auth/signin", req.url)
    url.searchParams.set("callbackUrl", encodeURI(req.url))
    return NextResponse.redirect(url)
  }

  headers.set("x-pathname", pathname)
  return NextResponse.next({
    headers: headers
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)"
  ]
}
