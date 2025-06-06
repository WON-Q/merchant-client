import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/types/api";

/**
 * 개별 메뉴 상태 업데이트 API
 */
export async function PUT(
  req: NextRequest,
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

    // 요청 바디에서 메뉴 ID와 상태 가져오기
    const { orderMenuId, status } = await req.json();

    if (!orderMenuId || !status) {
      return NextResponse.json(
        {
          success: false,
          errorMessage:
            "메뉴ID(orderMenuId)와 상태(status)는 필수 입력 항목입니다.",
        },
        { status: 400 }
      );
    }

    // 유효한 상태인지 검증 (백엔드 OrderMenuStatus enum 기준)
    const validStatuses = ["ORDERED", "SERVED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "유효하지 않은 상태입니다. (ORDERED, SERVED 중 하나)",
        },
        { status: 400 }
      );
    }

    // 백엔드 API 호출 (개별 메뉴 상태 업데이트)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${orderMenuId}/status`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
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
      const validationMessage =
        errorResponse?.validation &&
        Object.keys(errorResponse?.validation).length > 0
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
            fullMessage || `메뉴 상태 업데이트 실패: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(
      {
        success: true,
        data: data.data,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("메뉴 상태 업데이트 중 오류 발생:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        errorMessage: `메뉴 상태 업데이트 중 오류: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
