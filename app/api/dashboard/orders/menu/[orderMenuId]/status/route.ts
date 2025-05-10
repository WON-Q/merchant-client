import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/types/api";

// 주문-메뉴 상태 변경 요청 DTO
export interface ChangeOrderMenuStatusRequest {
  status: string; // 변경할 상태 (ORDERED: 주문됨, SERVED: 서빙됨, CANCELED: 취소됨 등)
}

/**
 * 주문된 메뉴 상태 변경 API
 * <br>
 * 점주 입장에서 주문된 개별 메뉴의 상태를 변경합니다.
 * (예: ORDERED → SERVED 등)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { orderMenuId: string } }
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

    // 주문 메뉴 ID 가져오기
    const { orderMenuId } = params;

    if (!orderMenuId) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "주문 메뉴 ID가 필요합니다.",
        },
        { status: 400 }
      );
    }

    // 요청 본문 가져오기
    const statusData: ChangeOrderMenuStatusRequest = await req.json();

    // 필수 필드 검증 - 상태
    if (!statusData.status) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "변경할 상태는 필수 입력 항목입니다.",
        },
        { status: 400 }
      );
    }

    // 백엔드 API 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${orderMenuId}/status`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusData),
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
          errorMessage: fullMessage || `주문 메뉴 상태 변경 실패: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    // 성공 응답
    return NextResponse.json(
      {
        success: true,
        message: "주문 메뉴 상태가 성공적으로 변경되었습니다.",
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("주문 메뉴 상태 변경 중 오류 발생:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        errorMessage: `주문 메뉴 상태 변경 중 오류: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
