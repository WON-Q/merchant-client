import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, ErrorResponse } from "@/types/api";

// 아이디 중복 확인 응답 DTO
export interface CheckDuplicateIdResponseDto {
  available: boolean;
}

/**
 * 회원가입 시 아이디의 중복 여부를 확인하는 API
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");

    if (!accountId) {
      return NextResponse.json(
        {
          success: false,
          message: "계정 아이디가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/checkAccountId?accountId=${accountId}`,
      { method: "GET" }
    );

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

      // errorMessage와 validationMessage를 결합해 아이디 중복 확인 실패 메시지 생성
      const fullMessage = [errorResponse?.errorMessage, validationMessage]
        .filter(Boolean)
        .join(" - ");

      return NextResponse.json(
        {
          success: false,
          message: fullMessage || `아이디 확인 실패: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: ApiResponse<CheckDuplicateIdResponseDto> = await response.json();
    return NextResponse.json(data);

  } catch (error: unknown) {
    console.error("아이디 중복 확인 중 오류 발생:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message: `아이디 확인 중 오류: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
