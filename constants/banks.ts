/**
 * 은행 정보 인터페이스
 */
export interface BankInfo {
  /**
   * 은행 코드
   */
  value: string;

  /**
   * 은행 이름
   */
  label: string;
}

/**
 * 한국 은행 목록
 */
export const KOREAN_BANKS: BankInfo[] = [
  { value: "004", label: "국민은행" },
  { value: "011", label: "농협은행" },
  { value: "088", label: "신한은행" },
  { value: "020", label: "우리은행" },
  { value: "003", label: "기업은행" },
  { value: "023", label: "SC제일은행" },
  { value: "032", label: "부산은행" },
  { value: "039", label: "경남은행" },
  { value: "034", label: "광주은행" },
  { value: "031", label: "대구은행" },
  { value: "045", label: "새마을금고" },
  { value: "048", label: "신협" },
  { value: "071", label: "우체국" },
  { value: "005", label: "하나은행" },
  { value: "007", label: "수협" },
  { value: "027", label: "한국씨티은행" },
  { value: "081", label: "KEB하나은행" },
  { value: "089", label: "케이뱅크" },
  { value: "090", label: "카카오뱅크" },
  { value: "092", label: "토스뱅크" },
];

/**
 * 은행 코드로 은행명 조회
 */
export function getBankNameByCode(code: string): string {
  const bank = KOREAN_BANKS.find((bank) => bank.value === code);
  return bank ? bank.label : "";
}
