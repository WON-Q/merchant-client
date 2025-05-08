import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, ErrorResponse } from "@/types/api";

// 메뉴 판매 상태 변경 요청 DTO
export interface MenuStatusRequestDto {
  isAvailable: boolean;
}

// 메뉴 판매 상태 변경 응답 DTO
export interface MenuStatusResponseDto {
  menuId: number;
  isAvailable: boolean;
}

/**
 * 메뉴 판매 상태 변경 API
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { menuId: string } }
): Promise<NextResponse> {
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

    // 요청 본문 가져오기
    const menuStatusData: MenuStatusRequestDto = await req.json();

    // 필수 필드 검증 - 판매 상태
    if (menuStatusData.isAvailable === undefined || menuStatusData.isAvailable === null) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "판매 상태는 필수 입력 항목입니다.",
        },
        { status: 400 }
      );
    }

    // 메뉴 ID 가져오기
    const menuId = params.menuId;

    // 백엔드 API 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merchant/menus/${menuId}/availability`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuStatusData),
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

      // errorMessage와 validationMessage를 결합해 에러 메시지 생성
      const fullMessage = [errorResponse?.errorMessage, validationMessage]
        .filter(Boolean)
        .join(" - ");

      return NextResponse.json(
        {
          success: false,
          errorMessage: fullMessage || `메뉴 상태 변경 실패: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: ApiResponse<MenuStatusResponseDto> = await response.json();
    return NextResponse.json(
      {
        success: true,
        data: data.data,
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("메뉴 상태 변경 중 오류 발생:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        errorMessage: `메뉴 상태 변경 중 오류: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
