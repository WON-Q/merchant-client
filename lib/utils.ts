import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GetMenuResponseDto } from "@/app/api/dashboard/menu/route";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

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

/**
 * 메뉴 아이템의 가격을 포맷팅하는 함수
 *
 * @param price 가격 (정수)
 * @returns 포맷된 가격 문자열
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}

/**
 * 날짜를 포맷팅하는 함수
 *
 * @param dateString 날짜 문자열
 * @param formatString 원하는 포맷 (기본값: "yyyy년 MM월 dd일 HH:mm:ss")
 * @returns 포맷된 날짜 문자열
 */
export function formatKoreanDateTime(
  dateString: string,
  formatString: string = "yyyy년 MM월 dd일 HH:mm:ss"
): string {
  try {
    const date = new Date(dateString);
    return format(date, formatString, { locale: ko });

  } catch {
    return dateString;
  }
}
