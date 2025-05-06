import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, ErrorResponse } from "@/types/api";

// 가맹점 정보 응답 DTO
export interface MerchantInfoResponse {
  merchantId: number; // 가맹점 ID
  merchantName: string; // 가맹점 이름
  businessRegistrationNo: string; // 사업자 등록 번호
  merchantOwnerName: string; // 가맹점 대표자 이름
  merchantOwnerPhoneNo: string; // 가맹점 대표자 전화번호
  merchantAddress: string; // 가맹점 주소
  description: string; // 가맹점 설명
  merchantAccountBankName: string; // 가맹점 계좌 은행 이름
  merchantAccount: string; // 가맹점 계좌 번호
  merchantAccountHolderName: string; // 가맹점 계좌 예금주 이름
}

/**
 * 가맹점 기본 정보 조회 API
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // 인증 토큰 가져오기
    const authToken = request.cookies.get("auth-token")?.value;

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          message: "인증 정보가 없습니다.",
        },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merchant/info`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
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

      // errorMessage와 validationMessage를 결합해 가맹점 정보 조회 실패 메시지 생성
      const fullMessage = [errorResponse?.errorMessage, validationMessage]
        .filter(Boolean)
        .join(" - ");

      return NextResponse.json(
        {
          success: false,
          message:
            fullMessage || `가맹점 정보 조회 실패: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: ApiResponse<MerchantInfoResponse> = await response.json();
    return NextResponse.json(data);

  } catch (error: unknown) {
    console.error("가맹점 정보 조회 중 오류 발생:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message: `가맹점 정보 조회 중 오류: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
