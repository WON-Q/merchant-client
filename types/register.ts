// 약관 동의 데이터
export interface Step1Data {
  // 추후 구현 예정
}

// 사업자 정보 데이터
export interface Step2Data {
  // 추후 구현 예정
}

// 매장 정보 데이터
export interface Step3Data {
  // 추후 구현 예정
}

// 계좌 정보 데이터
export interface Step4Data {
  // 추후 구현 예정
}

// 전체 회원가입 폼 데이터
export interface RegisterFormData
  extends Step1Data,
    Step2Data,
    Step3Data,
    Step4Data {}
