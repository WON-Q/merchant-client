import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, ErrorResponse } from "@/types/api";

// 회원가입 요청 DTO
export interface SignupRequestDto {
  accountId: string; // 로그인용 아이디
  password: string; // 비밀번호
  email: string; // 이메일
  phoneNo: string; // 전화번호
  businessRegistrationNo: string; // 사업자 등록번호
  merchantName: string; // 가맹점 이름
  description: string; // 가맹점 소개 문구
  merchantImg: string; // 가맹점 대표 이미지
  merchantOwnerName: string; // 가맹점 대표자 이름
  merchantOwnerPhoneNo: string; // 가맹점 대표자 전화번호
  merchantEmail: string; // 가맹점 연락용 이메일
  businessLaunchingDate: string; // 사업자 개업일 (YYYY-MM-DD)
  merchantAddress: string; // 가맹점 주소
  merchantAccountBankName: string; // 가맹점 대표 계좌 은행명
  merchantAccount: string; // 가맹점 대표 계좌번호
  merchantAccountHolderName: string; // 가맹점 대표 계좌 예금주 이름
  openTime: string; // 가맹점 영업 시작 시간 (HH:MM)
  closeTime: string; // 가맹점 영업 종료 시간 (HH:MM)
}

// 회원가입 응답 DTO
export interface SignupResponseDto {
  memberId: number; // 회원 ID
  accountId: string; // 로그인용 아이디
  merchantId: number; // 가맹점 ID
}

/**
 * 회원가입 API
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: SignupRequestDto = await req.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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

      // errorMessage와 validationMessage를 결합해 회원가입 실패 메시지 생성
      const fullMessage = [errorResponse?.errorMessage, validationMessage]
        .filter(Boolean)
        .join(" - ");

      return NextResponse.json(
        {
          success: false,
          message: fullMessage || `회원가입 실패: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: ApiResponse<SignupResponseDto> = await response.json();
    return NextResponse.json(
      {
        success: true,
        data: data.data,
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("회원가입 처리 중 오류:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message: `회원가입 중 오류: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
