import { BusinessDay } from "@/types/register";

export const BUSINESS_DAYS = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

export const getDefaultBusinessDays = (): BusinessDay[] =>
  BUSINESS_DAYS.map((day, index) => ({
    day,
    isOpen: index < 6, // 월-토 영업
    openTime: index < 6 ? "09:00" : "10:00",
    closeTime: index < 5 ? "22:00" : "23:00",
  }));
