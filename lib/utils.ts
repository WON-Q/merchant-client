import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GetMenuResponseDto } from "@/app/api/dashboard/menu/route";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 메뉴 아이템 목록에서 고유한 카테고리 목록을 추출하는 함수
 *
 * @param menuItems 메뉴 아이템 배열
 * @returns 중복 없는 카테고리 문자열 배열
 */
export function extractMenuCategories(menuItems: GetMenuResponseDto[]): string[] {
  try {
    const categories = [
      ...new Set(menuItems.map((item) => item.category).filter(Boolean)),
    ];

    return ["전체", ...categories];

  } catch (error) {
    console.error("카테고리 목록 처리 중 오류 발생:", error);
    return ["전체"];
  }
}
