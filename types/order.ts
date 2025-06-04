// 주문 메뉴 옵션 정보
export interface OrderMenuOption {
  orderMenuOptionId: number; // 주문메뉴옵션 ID
  menuOptionId: number; // 메뉴옵션 ID
  optionName: string; // 옵션 이름
  optionPrice: number; // 옵션 가격
}

// 주문 메뉴 정보
export interface OrderMenuItem {
  orderMenuId: number; // 주문메뉴 ID
  menuId: number; // 메뉴 ID
  menuName: string; // 메뉴 이름
  quantity: number; // 수량
  unitPrice: number; // 단가
  totalPrice: number; // 총 가격
  status: OrderMenuStatus; // 주문 메뉴 상태
  options: OrderMenuOption[]; // 선택된 옵션 목록
}

// 주문 정보
export interface Order {
  orderCode: string; // 주문 코드
  tableNumber: number; // 테이블 번호
  totalAmount: number; // 총 결제 금액
  orderStatus: OrderStatus; // 주문 상태
  paymentStatus: PaymentStatus; // 결제 상태
  paymentMethod: PaymentMethod; // 결제 수단
  paidAt: string; // 결제 완료 일시
  createdAt: string; // 주문 생성 일시
  menus: OrderMenuItem[]; // 주문된 메뉴 목록
}

// 주문 상태 열거형
export enum OrderStatus {
  ORDERED = "ORDERED", // 주문됨
  PAID = "PAID", // 결제됨
  COMPLETED = "COMPLETED", // 완료됨
  CANCELED = "CANCELED", // 취소됨
}

// 주문 메뉴 상태 열거형
export enum OrderMenuStatus {
  ORDERED = "ORDERED", // 주문 완료
  IN_PROGRESS = "IN_PROGRESS", // 진행중
  SERVED = "SERVED", // 서빙됨
  CANCELED = "CANCELED", // 취소됨
}

// 결제 상태 열거형
export enum PaymentStatus {
  PENDING = "PENDING", // 대기중
  COMPLETED = "COMPLETED", // 승인됨
  FAILED = "FAILED", // 결제 실패
  CANCELED = "CANCELED", // 취소됨
}

// 결제 수단 열거형
export enum PaymentMethod {
  CARD = "CARD", // 카드
  CASH = "CASH", // 현금
  ACCOUNT_TRANSFER = "ACCOUNT_TRANSFER", // 계좌이체
}

// 주문 필터 인터페이스 (일별)
export interface DailyOrderFilter {
  date: string; // 날짜 (YYYY-MM-DD)
  minAmount?: number; // 최소 금액
  maxAmount?: number; // 최대 금액
  page: number; // 페이지 번호
  size: number; // 페이지 크기
  sort: string; // 정렬 기준
}

// 주문 필터 인터페이스 (월별)
export interface MonthlyOrderFilter {
  year: number; // 연도
  month: number; // 월
  minAmount?: number; // 최소 금액
  maxAmount?: number; // 최대 금액
  page: number; // 페이지 번호
  size: number; // 페이지 크기
  sort: string; // 정렬 기준
}
