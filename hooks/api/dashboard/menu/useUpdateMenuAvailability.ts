import { useState, useCallback } from "react";
import { HookResponse } from "@/types/hook";
import {
  MenuStatusResponseDto,
  MenuStatusRequestDto,
} from "@/app/api/dashboard/menu/[menuId]/availability/route";
import { ApiResponse, ErrorResponse } from "@/types/api";

/**
 * 메뉴 판매 상태를 변경하는 커스텀 훅
 * API 요청과 상태 관리를 통합하여 처리합니다.
 *
 * @returns 메뉴 상태 변경 관련 상태와 함수를 포함하는 객체
 */
export function useUpdateMenuAvailability() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updatedMenu, setUpdatedMenu] = useState<MenuStatusResponseDto | null>(null);

  /**
   * 메뉴 판매 상태를 변경하는 함수
   * API 호출부터 상태 관리까지 통합 처리합니다.
   *
   * @param menuId 상태를 변경할 메뉴 ID
   * @param isAvailable 변경할 판매 상태 (true: 판매 가능, false: 품절)ㅈ
   * @returns 판매 상태 변경 결과를 포함하는 프로미스
   */
  const toggleAvailability = useCallback(
    async (
      menuId: number,
      isAvailable: boolean
    ): Promise<HookResponse<MenuStatusResponseDto>> => {
      // 이전 상태 초기화
      setIsUpdating(true);
      setUpdateSuccess(false);
      setUpdateError(null);
      setUpdatedMenu(null);

      // menuId 검증
      if (!menuId) {
        const errorMessage = "메뉴 ID가 필요합니다.";

        setUpdateError(errorMessage);
        setIsUpdating(false);

        return {
          success: false,
          errorMessage,
        };
      }

      try {
        // 상태 변경 요청 데이터 준비
        const requestData: MenuStatusRequestDto = {
          isAvailable,
        };

        // API 호출 (메뉴 판매 상태 변경)
        const response = await fetch(
          `/api/dashboard/menu/${menuId}/availability`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );

        if (!response.ok) {
          const errorResponse: ErrorResponse = await response.json();
          const errorMessage = errorResponse.errorMessage || "메뉴 상태 변경에 실패했습니다.";

          setUpdateError(errorMessage);
          setUpdateSuccess(false);

          return {
            success: false,
            errorMessage,
          };
        }

        const data: ApiResponse<MenuStatusResponseDto> = await response.json();

        // 상태 변경 결과 데이터가 없는 경우
        if (!data.data) {
          const errorMessage = "메뉴 상태 변경 정보를 받아올 수 없습니다.";

          setUpdateError(errorMessage);
          setUpdateSuccess(false);

          return {
            success: false,
            errorMessage,
          };
        }

        // 성공적으로 데이터를 받아온 경우
        setUpdatedMenu(data.data);
        setUpdateError(null);
        setUpdateSuccess(true);

        return {
          success: true,
          data: data.data,
        };

      } catch (error) {
        console.error("메뉴 상태 변경 오류:", error);

        const errorMessage = "메뉴 상태 변경 중 오류가 발생했습니다.";
        setUpdateError(errorMessage);
        setUpdateSuccess(false);

        return {
          success: false,
          errorMessage,
        };

      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  /**
   * 상태 변경 상태 초기화하는 함수
   */
  const resetState = useCallback(() => {
    setUpdateSuccess(false);
    setUpdateError(null);
    setUpdatedMenu(null);
  }, []);

  return {
    isUpdating,
    updateSuccess,
    updateError,
    updatedMenu,
    toggleAvailability,
    resetState,
  };
}
