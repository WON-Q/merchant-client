// 약관 동의 데이터
export interface Step1Data {
  /**
   * 서비스 이용약관 동의 여부 (필수)
   */
  serviceTerms: boolean;

  /**
   * 개인정보 처리방침 동의 여부 (필수)
   */
  privacyTerms: boolean;

  /**
   * 마케팅 정보 수신 동의 여부 (선택)
   */
  marketingTerms?: boolean;

  /**
   * 모든 약관 동의 여부
   */
  allAgreed: boolean;
}

// 사업자 정보 데이터
export interface Step2Data {
  /**
   * 사업자 등록증 파일
   */
  businessLicenseFile: string;

  /**
   * 사업자 등록 번호 (10자리)
   */
  businessRegistrationNo: string;

  /**
   * 상호명
   */
  businessName: string;

  /**
   * 대표자명
   */
  ownerName: string;

  /**
   * 사업장 주소
   */
  address: string;

  /**
   * 연락처
   */
  phoneNumber: string;

  /**
   * 이메일
   */
  email: string;

  /**
   * 사용자 ID
   */
  userId: string;

  /**
   * 비밀번호
   */
  password: string;

  /**
   * 비밀번호 확인
   */
  confirmPassword: string;
}

// 매장 운영 시간 데이터
export interface BusinessDay {
  /**
   * 요일
   */
  day: string;

  /**
   * 해당 요일에 가맹점이 운영되는지 여부
   */
  isOpen: boolean;

    /**
     * 매장 오픈 시간 (HH:mm)
     */
  openTime: string;

    /**
     * 매장 마감 시간 (HH:mm)
     */
  closeTime: string;
}

// 매장 정보 데이터
export interface Step3Data {
  /**
   * 가맹점 이미지 파일명
   */
  storeImage?: string;

  /**
   * 가맹점 이미지 URL
   */
  storeImageUrl?: string;

  /**
   * 가맹점 소개
   */
  storeDescription: string;

  /**
   * 매장 운영 시간
   */
  businessDays: BusinessDay[];
}

// 계좌 정보 데이터
export interface Step4Data {
  /**
   * 대표계좌 은행명
   */
  bankName: string;

  /**
   * 대표계좌번호
   */
  accountNumber: string;

  /**
   * 예금주명
   */
  accountHolderName: string;
}

// 전체 회원가입 폼 데이터
export interface RegisterFormData
  extends Step1Data,
    Step2Data,
    Step3Data,
    Step4Data {}
