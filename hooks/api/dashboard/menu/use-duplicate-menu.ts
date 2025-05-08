import { useState, useCallback } from "react";
import { HookResponse } from "@/types/hook";
import {
  GetMenuResponseDto,
  CreateMenuRequestDto,
  CreateMenuResponseDto,
} from "@/app/api/dashboard/menu/route";
import { ApiResponse, ErrorResponse } from "@/types/api";

/**
 * 메뉴를 복제하는 커스텀 훅
 * API 요청과 상태 관리를 통합하여 처리합니다.
 *
 * @returns 메뉴 복제 상태와 함수를 포함하는 객체
 */
export function useDuplicateMenu() {
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [duplicateSuccess, setDuplicateSuccess] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [duplicatedMenu, setDuplicatedMenu] = useState<GetMenuResponseDto | null>(null);

  /**
   * 메뉴를 복제하는 함수
   * API 호출부터 상태 관리까지 통합 처리합니다.
   *
   * @param menuId 복제할 메뉴 ID
   * @param menus 현재 메뉴 목록 (메뉴 ID로 원본 메뉴를 찾기 위해 사용)
   * @returns 메뉴 복제 결과를 포함하는 프로미스
   */
  const duplicateMenu = useCallback(
    async (
      menuId: number,
      menus: GetMenuResponseDto[]
    ): Promise<HookResponse<GetMenuResponseDto>> => {
      // 이전 상태 초기화
      setIsDuplicating(true);
      setDuplicateSuccess(false);
      setDuplicateError(null);
      setDuplicatedMenu(null);

      // 메뉴 ID로 원본 메뉴 찾기
      const originalMenu = menus.find((menu) => menu.menuId === menuId);

      if (!originalMenu) {
        setDuplicateError("복제할 메뉴를 찾을 수 없습니다.");
        setIsDuplicating(false);

        return {
          success: false,
          errorMessage: "복제할 메뉴를 찾을 수 없습니다.",
        };
      }

      try {
        // undefined/null 체크를 통해 안전하게 처리
        const optionGroups = originalMenu.optionGroups
          ? originalMenu.optionGroups.map((group) => ({
              groupName: group.groupName,
              isDefault: group.isDefault,
              displaySequence: group.displaySequence,
              options: group.options
                ? group.options.map((option) => ({
                    optionName: option.optionName,
                    optionPrice: option.optionPrice,
                  }))
                : [],
            }))
          : [];

        // 복제할 메뉴 데이터 준비 (이름에 (복사본) 추가)
        const duplicatedMenuData: CreateMenuRequestDto = {
          name: `${originalMenu.name} (복사본)`,
          category: originalMenu.category || "",
          price: originalMenu.price || 0,
          menuImgUrl: originalMenu.menuImgUrl || "",
          isAvailable:
            originalMenu.isAvailable !== undefined
              ? originalMenu.isAvailable
              : true,
          description: originalMenu.description || "",
          optionGroups,
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

          setDuplicateError(errorMessage);
          setDuplicateSuccess(false);

          return {
            success: false,
            errorMessage,
          };
        }

        const data: ApiResponse<CreateMenuResponseDto> = await response.json();

        // 생성된 menuId와 요청 데이터를 결합하여 완전한 메뉴 객체 구성
        const fullMenuData: GetMenuResponseDto = {
          menuId: data.data!.menuId,
          name: duplicatedMenuData.name,
          description: duplicatedMenuData.description,
          category: duplicatedMenuData.category,
          price: duplicatedMenuData.price,
          menuImgUrl: duplicatedMenuData.menuImgUrl,
          isAvailable: duplicatedMenuData.isAvailable,
          optionGroups: duplicatedMenuData.optionGroups || [],
        };

        // 성공적으로 데이터를 구성한 경우
        setDuplicatedMenu(fullMenuData);
        setDuplicateError(null);
        setDuplicateSuccess(true);

        return {
          success: true,
          data: fullMenuData,
        };

      } catch (error) {
        console.error("메뉴 복제 오류:", error);

        const errorMessage = "메뉴 복제 중 오류가 발생했습니다.";
        setDuplicateError(errorMessage);
        setDuplicateSuccess(false);

        return {
          success: false,
          errorMessage,
        };

      } finally {
        setIsDuplicating(false);
      }
    },
    []
  );

  /**
   * 메뉴 복제 상태 초기화하는 함수
   */
  const resetState = useCallback(() => {
    setDuplicateSuccess(false);
    setDuplicateError(null);
    setDuplicatedMenu(null);
  }, []);

  return {
    isDuplicating,
    duplicateSuccess,
    duplicateError,
    duplicatedMenu,
    duplicateMenu,
    resetState,
  };
}
