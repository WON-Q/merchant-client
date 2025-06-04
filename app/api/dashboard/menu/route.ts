import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, ErrorResponse } from "@/types/api";

// 메뉴 옵션 인터페이스
export interface MenuOption {
  optionId?: number; // 옵션 ID
  optionName: string; // 옵션명
  optionPrice: number; // 옵션 가격
}

// 메뉴 옵션 그룹 인터페이스
export interface MenuOptionGroup {
  groupId?: number; // 그룹 ID
  groupName: string; // 옵션 그룹명
  displaySequence?: number; // 표시 순서
  isDefault?: boolean; // 기본 선택 여부
  options: MenuOption[]; // 옵션 목록
}




// 메뉴 생성 요청 DTO
export interface CreateMenuRequestDto {
  menuImgUrl: string; // 메뉴 이미지 URL
  name: string; // 메뉴명
  category: string; // 메뉴 카테고리
  price: number; // 메뉴 가격
  isAvailable: boolean; // 메뉴 판매 상태
  description: string; // 메뉴 설명
  optionGroups?: MenuOptionGroup[]; // 메뉴 옵션 그룹
}

// 메뉴 생성 응답 DTO
export interface CreateMenuResponseDto {
  menuId: number;
}

// 메뉴 정보 조회 응답 DTO
export interface GetMenuResponseDto {
  menuId: number; // 메뉴 ID
  name: string; // 메뉴명
  description: string; // 메뉴 설명
  category: string; // 메뉴 카테고리
  price: number; // 메뉴 가격
  menuImgUrl: string; // 메뉴 이미지 URL
  isAvailable: boolean; // 메뉴 판매 상태
  optionGroups: MenuOptionGroup[]; // 메뉴 옵션 그룹
}

/**
 * 메뉴를 생성하는 API
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
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
    const menuData: CreateMenuRequestDto = await req.json();

    // 필수 필드 검증 - 메뉴 이미지 URL
    if (!menuData.menuImgUrl) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "메뉴 이미지 URL은 필수 입력 항목입니다.",
        },
        { status: 400 }
      );
    }

    // 필수 필드 검증 - 메뉴명
    if (!menuData.name) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "메뉴명은 필수 입력 항목입니다.",
        },
        { status: 400 }
      );
    }

    // 필수 필드 검증 - 카테고리
    if (!menuData.category) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "카테고리는 필수 입력 항목입니다.",
        },
        { status: 400 }
      );
    }

    // 필수 필드 검증 - 가격
    if (menuData.price === undefined || menuData.price === null) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "가격은 필수 입력 항목입니다.",
        },
        { status: 400 }
      );
    }

    // 필수 필드 검증 - 가격
    if (menuData.price < 0) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "가격은 0 이상이어야 합니다.",
        },
        { status: 400 }
      );
    }

    // 필수 필드 검증 - 판매 상태
    if (menuData.isAvailable === undefined || menuData.isAvailable === null) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "판매 상태는 필수 입력 항목입니다.",
        },
        { status: 400 }
      );
    }

    // 필수 필드 검증 - 메뉴 옵션
    if (menuData.optionGroups && menuData.optionGroups.length > 0) {
      for (let i = 0; i < menuData.optionGroups.length; i++) {
        const group = menuData.optionGroups[i];

        // 필수 필드 검증 - 옵션 그룹명
        if (!group.groupName) {
          return NextResponse.json(
            {
              success: false,
              errorMessage: `옵션 그룹 #${i + 1}의 그룹명은 필수 입력 항목입니다.`,
            },
            { status: 400 }
          );
        }

        // 필수 필드 검증 - 옵션 그룹의 옵션
        if (group.options && group.options.length > 0) {
          for (let j = 0; j < group.options.length; j++) {
            const option = group.options[j];

            // 필수 필드 검증 - 옵션명
            if (!option.optionName) {
              return NextResponse.json(
                {
                  success: false,
                  errorMessage: `옵션 그룹 "${group.groupName}"의 옵션 #${j + 1}의 옵션명은 필수 입력 항목입니다.`,
                },
                { status: 400 }
              );
            }

            // 필수 필드 검증 - 옵션 가격
            if (option.optionPrice === undefined || option.optionPrice === null) {
              return NextResponse.json(
                {
                  success: false,
                  errorMessage: `옵션 그룹 "${group.groupName}"의 옵션 "${option.optionName}"의 가격은 필수 입력 항목입니다.`,
                },
                { status: 400 }
              );
            }

            // 필수 필드 검증 - 옵션 가격
            if (option.optionPrice < 0) {
              return NextResponse.json(
                {
                  success: false,
                  errorMessage: `옵션 그룹 "${group.groupName}"의 옵션 "${option.optionName}"의 가격은 0 이상이어야 합니다.`,
                },
                { status: 400 }
              );
            }
          }
        }
      }
    }

    // 백엔드 API 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merchant/menus/update`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuData),
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
          errorMessage: fullMessage || `메뉴 등록 실패: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: ApiResponse<CreateMenuResponseDto> = await response.json();
    return NextResponse.json(
      {
        success: true,
        data: data.data,
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("메뉴 등록 중 오류 발생:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        errorMessage: `메뉴 등록 중 오류: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}

/**
 * 메뉴 목록을 조회하는 API
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

    // URL에서 merchantId 파라미터를 가져오기
    const url = new URL(req.url);
    const merchantId = url.searchParams.get("merchantId");

    if (!merchantId) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "가맹점 정보가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merchant/menus/${merchantId}/list`,
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

      // errorMessage와 validationMessage를 결합해 메뉴 정보 조회 실패 메시지 생성
      const fullMessage = [errorResponse?.errorMessage, validationMessage]
          .filter(Boolean)
          .join(" - ");

      return NextResponse.json(
        {
          success: false,
          message: fullMessage || `메뉴 목록 조회 실패: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: ApiResponse<GetMenuResponseDto[]> = await response.json();
    return NextResponse.json(
      {
        success: true,
        data: data.data,
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("메뉴 목록 조회 중 오류 발생:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        errorMessage: `메뉴 목록 조회 중 오류: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
