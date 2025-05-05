import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, ErrorResponse } from "@/types/api";

// (회원가입 시) 매장 대표 이미지 업로드 응답 DTO
export interface MerchantImageUploadResponseDto {
  imageUrl: string;
}

/**
 * 회원가입 시 가맹점의 대표 이미지를 업로드하는 API
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "파일이 필요합니다.",
        },
        { status: 400 }
      );
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merchant/image`,
      {
        method: "POST",
        body: uploadFormData,
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

      // errorMessage와 validationMessage를 결합해 이미지 업로드 실패 메시지 생성
      const fullMessage = [errorResponse?.errorMessage, validationMessage]
        .filter(Boolean)
        .join(" - ");

      return NextResponse.json(
        {
          success: false,
          message: fullMessage || `이미지 업로드 실패: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: ApiResponse<MerchantImageUploadResponseDto> = await response.json();
    return NextResponse.json(data);

  } catch (error: unknown) {
    console.error("이미지 업로드 중 오류 발생:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message: `이미지 업로드 중 오류: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
