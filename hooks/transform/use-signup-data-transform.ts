import { RegisterFormData } from "@/types/register";
import { SignupRequestDto } from "@/app/api/auth/signup/route";
import { getBankNameByCode } from "@/constants/banks";

/**
 * 회원가입 폼 데이터를 회원가입 요청 API DTO로 변환하는 커스텀 훅
 *
 * @returns 회원가입 폼 데이터를 회원가입 요청 API DTO로 변환하는 함수
 */
export function useSignupDataTransform() {
  /**
   * 회원가입 폼 데이터를 백엔드 API DTO 형식으로 변환하는 함수
   *
   * @param {RegisterFormData} formData - 회원가입 폼 데이터
   * @returns {SignupRequestDto} 백엔드 API 형식의 DTO 객체
   */
  const transformToSignupDTO = (
    formData: RegisterFormData
  ): SignupRequestDto => {
    // 은행 코드에서 실제 은행 이름으로 변환
    const bankName = getBankNameByCode(formData.bankName);

    // 영업 시간 (현재는 월요일 기준으로 설정)
    // TODO: 백엔드 API가 요일별 영업시간을 지원하도록 수정 필요
    const mondayBusinessDay = formData.businessDays.find(
      (day) => day.day === "월요일"
    );
    const openTime = mondayBusinessDay?.openTime || "09:00";
    const closeTime = mondayBusinessDay?.closeTime || "18:00";

    return {
      // 사업자 정보
      accountId: formData.userId,
      password: formData.password,
      email: formData.email,
      phoneNo: formData.phoneNumber,

      // 가맹점 정보
      businessRegistrationNo: formData.businessRegistrationNo,
      merchantName: formData.businessName,
      description: formData.storeDescription,
      merchantImg: formData.storeImageUrl || "",
      merchantOwnerName: formData.ownerName,
      merchantOwnerPhoneNo: formData.phoneNumber,
      merchantEmail: formData.email,
      businessLaunchingDate: formData.businessLaunchingDate,
      merchantAddress: formData.address,
      openTime,
      closeTime,

      // 계좌 정보
      merchantAccountBankName: bankName,
      merchantAccount: formData.accountNumber,
      merchantAccountHolderName: formData.accountHolderName,
    };
  };

  return { transformToSignupDTO };
}
