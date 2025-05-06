import { useState } from "react";
import { HookResponse } from "@/types/hook";
import { GetMenuResponseDto } from "@/app/api/dashboard/menu/route";
import { ApiResponse, ErrorResponse } from "@/types/api";

/**
 * 메뉴 목록을 조회하는 커스텀 훅
 *
 * @returns 메뉴 목록 조회 상태와 함수를 포함하는 객체
 */
export function useGetMenuList() {
  const [menus, setMenus] = useState<GetMenuResponseDto[]>([]);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);
  const [loadMenusSuccess, setLoadMenusSuccess] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);

  /**
   * 메뉴 목록을 조회하는 함수
   *
   * @param merchantId 메뉴를 조회할 가맹점 ID
   * @returns 메뉴 목록 조회 결과를 포함하는 프로미스
   */
  const fetchMenuList = async (
    merchantId: number
  ): Promise<HookResponse<GetMenuResponseDto[]>> => {
    // 이전 상태 초기화
    setIsLoadingMenus(true);
    setLoadMenusSuccess(false);
    setMenuError(null);

    // merchantId 검증
    if (!merchantId) {
      const errorMessage = "가맹점 정보를 찾을 수 없습니다.";

      setMenuError(errorMessage);
      setIsLoadingMenus(false);

      return {
        success: false,
        errorMessage,
      };
    }

    try {
      // API 호출 (메뉴 목록 조회)
      const response = await fetch(
        `/api/dashboard/menu?merchantId=${merchantId}`
      );

      if (!response.ok) {
        const errorResponse: ErrorResponse = await response.json();
        const errorMessage = errorResponse.errorMessage || "메뉴 목록 조회에 실패했습니다.";

        setMenuError(errorMessage);
        setIsLoadingMenus(false);

        return {
          success: false,
          errorMessage,
        };
      }

      const data: ApiResponse<GetMenuResponseDto[]> = await response.json();

      // 메뉴 목록이 없는 경우 빈 배열 반환
      if (!data.data) {
        setMenus([]);
        setLoadMenusSuccess(true);
        setMenuError(null);
        setIsLoadingMenus(false);

        return {
          success: true,
          data: [],
        };
      }

      // 성공적으로 데이터를 받아온 경우
      setMenus(data.data);
      setLoadMenusSuccess(true);
      setMenuError(null);
      setIsLoadingMenus(false);

      return {
        success: true,
        data: data.data,
      };

    } catch (error) {
      console.error("메뉴 목록 조회 오류:", error);

      const errorMessage = "메뉴 목록 조회 중 오류가 발생했습니다.";
      setMenuError(errorMessage);
      setIsLoadingMenus(false);

      return {
        success: false,
        errorMessage,
      };
    }
  };

  /**
   * 메뉴 목록 상태를 초기화하는 함수
   */
  const resetMenuList = () => {
    setLoadMenusSuccess(false);
    setMenuError(null);
  };

  return {
    menus,
    isLoadingMenus,
    loadMenusSuccess,
    menuError,
    fetchMenuList,
    resetMenuList,
  };
}
