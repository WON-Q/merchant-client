import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 현재 URL 경로 가져오기
  const { pathname } = request.nextUrl;

  // 토큰 확인 (localStorage는 서버에서 접근할 수 없으므로 쿠키를 사용)
  const token = request.cookies.get("auth-token")?.value;

  // 인증 필요한 경로 체크 (dashboard로 시작하는 모든 경로)
  const isAuthRoute = pathname.startsWith("/dashboard");

  // 로그인 페이지 여부
  const isLoginPage = pathname === "/login";

  // 대시보드 접근 시 토큰이 없으면 로그인 페이지로 리디렉션
  if (isAuthRoute && !token) {
    const redirectUrl = new URL("/login", request.url);
    // 현재 경로를 쿼리 파라미터로 저장하여 로그인 후 리디렉션 가능하도록 설정
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 이미 인증된 사용자가 로그인 페이지 접근 시 대시보드로 리디렉션
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// 미들웨어가 적용될 경로 패턴 지정
export const config = {
  matcher: [
    // 대시보드 관련 모든 경로
    "/dashboard/:path*",
    // 로그인 페이지
    "/login",
  ],
};
