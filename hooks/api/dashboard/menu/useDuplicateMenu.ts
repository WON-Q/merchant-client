import { useState } from "react";
import { HookResponse } from "@/types/hook";
import {
  GetMenuResponseDto,
  CreateMenuRequestDto, CreateMenuResponseDto,
} from "@/app/api/dashboard/menu/route";
import { ApiResponse, ErrorResponse } from "@/types/api";

/**
 * 메뉴를 복제하는 커스텀 훅
 *
 * @returns 메뉴 복제 상태와 함수를 포함하는 객체
 */
export function useDuplicateMenu() {
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [duplicateSuccess, setDuplicateSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 메뉴를 복제하는 함수
   *
   * @param menuData 복제할 원본 메뉴 데이터
   * @returns 메뉴 복제 결과를 포함하는 프로미스
   */
  const duplicateMenu = async (
    menuData: GetMenuResponseDto
  ): Promise<HookResponse<CreateMenuResponseDto>> => {
    // 이전 상태 초기화
    setIsDuplicating(true);
    setDuplicateSuccess(false);
    setError(null);

    try {
      // 복제할 메뉴 데이터 준비 (이름에 (복사본) 추가)
      const duplicatedMenuData: CreateMenuRequestDto = {
        name: `${menuData.name} (복사본)`,
        category: menuData.category,
        price: menuData.price,
        menuImgUrl: menuData.menuImgUrl,
        isAvailable: menuData.isAvailable,
        description: menuData.description,
        optionGroups: menuData.optionGroups.map((group) => ({
          groupName: group.groupName,
          isDefault: group.isDefault,
          displaySequence: group.displaySequence,
          options: group.options.map((option) => ({
            optionName: option.optionName,
            optionPrice: option.optionPrice,
          })),
        })),
      };

      // API 호출 (메뉴 생성)
      const response = await fetch("/api/dashboard/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(duplicatedMenuData),
      });

      if (!response.ok) {
        const errorResponse: ErrorResponse = await response.json();
        const errorMessage = errorResponse.errorMessage || "메뉴 복제에 실패했습니다.";

        setError(errorMessage);
        setDuplicateSuccess(false);

        return {
          success: false,
          errorMessage,
        };
      }

      const data: ApiResponse<CreateMenuResponseDto> = await response.json();

      // 메뉴 복제 결과 데이터가 없는 경우
      if (data.data == null) {
        const errorMessage = "메뉴 복제 정보를 받아올 수 없습니다.";

        setError(errorMessage);
        setDuplicateSuccess(false);

        return {
          success: false,
          errorMessage,
        };
      }

      // 성공적으로 데이터를 받아온 경우
      setError(null);
      setDuplicateSuccess(true);

      return {
        success: true,
        data: data.data,
      };

    } catch (error) {
      console.error("메뉴 복제 오류:", error);

      const errorMessage = "메뉴 복제 중 오류가 발생했습니다.";
      setError(errorMessage);
      setDuplicateSuccess(false);

      return {
        success: false,
        errorMessage,
      };

    } finally {
      setIsDuplicating(false);
    }
  };

  /**
   * 메뉴 복제 상태 초기화하는 함수
   */
  const resetState = () => {
    setDuplicateSuccess(false);
    setError(null);
  };

  return {
    isDuplicating,
    duplicateSuccess,
    error,
    duplicateMenu,
    resetState,
  };
}
