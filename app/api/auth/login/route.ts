import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, ErrorResponse } from "@/types/api";

// 로그인 요청 DTO
export interface LoginRequestDto {
  accountId: string;
  password: string;
}

// 로그인 응답 DTO
export interface LoginResponseDto {
  accessToken: string;
  tokenType: string;
}

/**
 * 로그인 API
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: LoginRequestDto = await req.json();
    const { accountId, password } = body;

    if (!accountId || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "아이디와 비밀번호를 모두 입력해주세요.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountId, password }),
      }
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

      // errorMessage와 validationMessage를 결합해 로그인 실패 메시지 생성
      const fullMessage = [errorResponse?.errorMessage, validationMessage]
        .filter(Boolean)
        .join(" - ");

      return NextResponse.json(
        {
          success: false,
          message: fullMessage || `로그인 실패: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: ApiResponse<LoginResponseDto> = await response.json();
    return NextResponse.json(
      {
        success: true,
        data: data.data,
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("로그인 처리 중 오류 발생:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message: `로그인 중 오류: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
