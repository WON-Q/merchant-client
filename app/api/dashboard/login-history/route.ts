import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, ErrorResponse, Page } from "@/types/api";

// 로그인 이력 응답 DTO
export interface LoginHistoryResponse {
  loginAt: string; // 로그인 일시
  ipAddress: string; // IP 주소
  userAgent: string; // User-Agent
}

/**
 * 로그인 이력 조회 API
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // 인증 토큰 가져오기
    const authToken = req.cookies.get("auth-token")?.value;

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "인증 정보가 없습니다.",
        },
        { status: 401 }
      );
    }

    // URL에서 쿼리 파라미터 가져오기
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "20";
    const sort = searchParams.get("sort") || "loginAt,desc";

    // 요청 URL 구성
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login/history?page=${page}&size=${size}&sort=${sort}`;

    // 백엔드 API 호출
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorResponse: ErrorResponse | null = null;

      try {
        const json = await response.json();
        errorResponse = json as ErrorResponse;

      } catch (e) {
        console.error("에러 응답 파싱 실패:", e);
      }

      // 에러 응답에서 validation 메시지 추출
      const validationMessage = errorResponse?.validation && Object.keys(errorResponse?.validation).length > 0
        ? Object.values(errorResponse?.validation).join(", ")
        : "";

      // errorMessage와 validationMessage를 결합해 에러 메시지 생성
      const fullMessage = [errorResponse?.errorMessage, validationMessage]
        .filter(Boolean)
        .join(" - ");

      return NextResponse.json(
        {
          success: false,
          errorMessage:
            fullMessage || `로그인 이력 조회 실패: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: ApiResponse<Page<LoginHistoryResponse>> = await response.json();
    return NextResponse.json(
      {
        success: true,
        data: data.data,
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("로그인 이력 조회 중 오류 발생:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        errorMessage: `로그인 이력 조회 중 오류: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
