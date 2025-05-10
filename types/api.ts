export interface ApiResponse<T> {
  code: string;
  message: string;
  data?: T | null;
}

export interface ErrorResponse {
  errorCode: string;
  errorMessage: string;
  validation?: Record<string, string>;
}

// 정렬 정보 인터페이스
export interface Sort {
  sorted: boolean; // 정렬 여부 (정렬되었는지)
  unsorted: boolean; // 비정렬 여부 (정렬되지 않았는지)
  empty: boolean; // 정렬 정보 비어있는지 여부
}

// 페이지 요청 정보 인터페이스
export interface Pageable {
  pageNumber: number; // 현재 페이지 번호 (0부터 시작)
  pageSize: number; // 페이지당 항목 수
  sort: Sort; // 정렬 정보
  offset: number; // 오프셋 (건너뛴 항목 수)
  paged: boolean; // 페이지 처리 여부 (페이징이 적용되었는지)
  unpaged: boolean; // 비페이지 처리 여부 (페이징이 적용되지 않았는지)
}

// 페이지네이션 결과 인터페이스 (제네릭)
export interface Page<T> {
  content: T[]; // 현재 페이지의 데이터
  pageable: Pageable; // 페이지 요청 정보
  last: boolean; // 마지막 페이지 여부 (현재 페이지가 마지막인지)
  totalElements: number; // 전체 항목 수
  totalPages: number; // 전체 페이지 수
  size: number; // 페이지 크기 (페이지당 항목 수)
  number: number; // 현재 페이지 번호 (0부터 시작)
  sort: Sort; // 정렬 정보
  first: boolean; // 첫 페이지 여부 (현재 페이지가 첫 페이지인지)
  numberOfElements: number; // 현재 페이지의 항목 수
  empty: boolean; // 비어있음 여부 (현재 페이지에 항목이 없는지)
}
