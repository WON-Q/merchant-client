import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, ErrorResponse, Page } from "@/types/api";

// 주문-메뉴 옵션 정보 인터페이스 (주문된 메뉴의 옵션 상세 정보)
interface OrderMenuOptionResponse {
  orderMenuOptionId: number; // 주문메뉴옵션 ID (주문메뉴와 옵션의 연결 정보 식별자)
  menuOptionId: number; // 메뉴옵션 ID (원본 메뉴 옵션 식별자)
  optionName: string; // 옵션 이름 (예: "샷 추가", "시럽 추가" 등)
  optionPrice: number; // 옵션 가격 (단위: 원)
}

// 주문-메뉴 정보 인터페이스 (주문된 각 메뉴 항목에 대한 상세 정보)
interface OrderMenuResponse {
  orderMenuId: number; // 주문메뉴 ID (주문과 메뉴의 연결 정보 식별자)
  menuId: number; // 메뉴 ID (원본 메뉴 식별자)
  menuName: string; // 메뉴 이름 (예: "아메리카노", "카페라떼" 등)
  quantity: number; // 주문 수량 (해당 메뉴의 주문 개수)
  unitPrice: number; // 단가 (개당 가격, 단위: 원)
  totalPrice: number; // 총 가격 (수량 × 단가 + 옵션 가격 합계, 단위: 원)
  status: string; // 주문-메뉴 상태 (ORDERED: 주문됨, COMPLETED: 완료됨, CANCELED: 취소됨 등)
  options: OrderMenuOptionResponse[]; // 선택된 옵션 목록
}

// 주문 상세 정보 인터페이스 (개별 주문에 대한 종합 정보)
interface OrderDetailResponse {
  orderCode: string; // 주문 코드 (예: "240405T1017_t3" - 날짜_테이블번호 형식)
  tableNumber: number; // 테이블 번호 (주문이 발생한 테이블 식별 번호)
  totalAmount: number; // 총 결제 금액 (모든 메뉴와 옵션 가격의 합계, 단위: 원)
  orderStatus: string; // 주문 상태 (ORDERED: 주문됨, PAID: 결제됨, COMPLETED: 완료됨, CANCELED: 취소됨 등)
  paymentStatus: string; // 결제 상태 (PENDING: 대기중, COMPLETED: 완료됨, FAILED: 실패함, CANCELED: 취소됨 등)
  paymentMethod: string; // 결제 수단 (CARD: 카드, CASH: 현금, ACCOUNT_TRANSFER: 계좌이체 등)
  paidAt: string; // 결제 완료 일시 (ISO 날짜 문자열 형식: "YYYY-MM-DDTHH:MM:SS")
  createdAt: string; // 주문 생성 일시 (ISO 날짜 문자열 형식: "YYYY-MM-DDTHH:MM:SS")
  menus: OrderMenuResponse[]; // 주문된 메뉴 목록
}

/**
 * 일별 주문 내역 조회 API
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
    const date = searchParams.get("date");
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "20";
    const sort = searchParams.get("sort") || "createdAt,desc";

    // 필수 파라미터 검증
    if (!date) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "날짜(date)는 필수 입력 항목입니다.",
        },
        { status: 400 }
      );
    }

    // 날짜 형식 검증 (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        {
          success: false,
          errorMessage:
            "날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.",
        },
        { status: 400 }
      );
    }

    // 요청 URL 구성
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/daily?date=${date}&page=${page}&size=${size}&sort=${sort}`;

    if (minAmount) {
      url += `&minAmount=${minAmount}`;
    }

    if (maxAmount) {
      url += `&maxAmount=${maxAmount}`;
    }

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
          errorMessage: fullMessage || `일별 주문 내역 조회 실패: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: ApiResponse<Page<OrderDetailResponse>> = await response.json();
    return NextResponse.json(
      {
        success: true,
        data: data.data,
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("일별 주문 내역 조회 중 오류 발생:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        errorMessage: `일별 주문 내역 조회 중 오류: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
