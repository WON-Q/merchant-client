import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building,
  Calendar,
  Check,
  Clock,
  CreditCard,
  ExternalLink,
  FileCheck,
  FileText,
  Hash,
  ImageIcon,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import StepContainer from "./step-container";
import { Button } from "@/components/ui/button";
import { RegisterFormData } from "@/types/register";
import { getBankNameByCode } from "@/constants/banks";

interface Step5Props {
  formData: RegisterFormData;
}

export default function Step5Complete({ formData }: Step5Props) {
  // 은행 코드에서 은행 이름으로 변환
  const bankName = getBankNameByCode(formData.bankName);

  return (
    <StepContainer>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* 상단 컬러 그라데이션 바 */}
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8F35] h-3"></div>

        {/* 헤더 섹션 */}
        <div className="p-8">
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
            {/* 성공 아이콘 */}
            <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-[#FF6B35] to-[#FF8F35] rounded-full flex items-center justify-center shadow-md">
              <Check className="h-12 w-12 text-white stroke-[2.5]" />
            </div>

          {/* 타이틀과 설명 */}
            <div className="text-left">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                회원가입 신청 완료!
              </h2>
              <p className="text-gray-600 mb-2">
                가맹점 등록이 성공적으로 완료되었습니다.
                <br />
                관리자의 승인 후{" "}
                <span className="font-medium text-[#FF6B35]">로그인</span>
                하여 서비스를 이용하실 수 있습니다.
              </p>
             <p className="text-sm text-gray-500">
  ※ 승인 완료 시 안내 문자가 발송됩니다.
</p>
            </div>

          </div>

          {/* 정보 요약 카드 */}
          <div className="border rounded-xl bg-white shadow-sm p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center border-b pb-4">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              가입 완료 정보
            </h3>

            <div className="space-y-6">
              {/* 사업자 정보 섹션 */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h4 className="text-base font-semibold mb-4 flex items-center text-gray-800 border-b border-gray-200 pb-2 gap-1.5">
                  <Building className="h-5 w-5 text-[#FF6B35]" />
                  사업자 정보
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  <div className="flex items-start gap-2">
                    <Building className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        상호명
                      </p>
                      <p className="font-medium text-gray-900">
                        {formData.businessName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        대표자명
                      </p>
                      <p className="font-medium text-gray-900">
                        {formData.ownerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Hash className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        사업자등록번호
                      </p>
                      <p className="font-medium text-gray-900">
                        {formData.businessRegistrationNo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        개업일
                      </p>
                      <p className="font-medium text-gray-900">
                        {formData.businessLaunchingDate}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        주소
                      </p>
                      <p className="font-medium text-gray-900">
                        {formData.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 계정 정보 및 계좌 정보 2단 그리드 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 계정 정보 섹션 */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h4 className="text-base font-semibold mb-4 flex items-center text-gray-800 border-b border-gray-200 pb-2 gap-1.5">
                    <User className="h-5 w-5 text-[#FF6B35]" />
                    계정 정보
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          아이디
                        </p>
                        <p className="font-medium text-gray-900">
                          {formData.userId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          이메일
                        </p>
                        <p className="font-medium text-gray-900">
                          {formData.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          연락처
                        </p>
                        <p className="font-medium text-gray-900">
                          {formData.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 계좌 정보 섹션 */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h4 className="text-base font-semibold mb-4 flex items-center text-gray-800 border-b border-gray-200 pb-2 gap-1.5">
                    <CreditCard className="h-5 w-5 text-[#FF6B35]" />
                    계좌 정보
                  </h4>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <Building className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            은행명
                          </p>
                          <p className="font-medium text-gray-900">
                            {bankName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            예금주
                          </p>
                          <p className="font-medium text-gray-900">
                            {formData.accountHolderName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          계좌번호
                        </p>
                        <p className="font-medium text-gray-900">
                          {formData.accountNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 매장 정보 섹션 - 이미지 좌측, 정보 우측 배치 */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h4 className="text-base font-semibold mb-4 flex items-center text-gray-800 border-b border-gray-200 pb-2 gap-1.5">
                  <FileCheck className="h-5 w-5 text-[#FF6B35]" />
                  매장 정보
                </h4>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* 매장 이미지 - 좌측 배치 */}
                  {formData.storeImageUrl && (
                    <div className="md:w-1/3 flex-shrink-0">
                      <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                        <ImageIcon className="h-4 w-4 text-gray-400" />
                        매장 이미지
                      </p>
                      <div className="rounded-md overflow-hidden border relative h-40 md:h-48 w-full">
                        <Image
                          src={formData.storeImageUrl}
                          alt="매장 이미지"
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>
                  )}

                  {/* 매장 정보 - 우측 배치 */}
                  <div
                    className={`${
                      formData.storeImageUrl ? "md:w-2/3" : "w-full"
                    } space-y-4`}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          매장 소개
                        </p>
                        <p className="font-medium text-gray-900">
                          {formData.storeDescription}
                        </p>
                      </div>
                    </div>

                    {formData.businessDays &&
                      formData.businessDays.some((day) => day.isOpen) && (
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              영업일
                            </p>
                            <p className="font-medium text-gray-900">
                              {formData.businessDays
                                .filter((day) => day.isOpen)
                                .map((day) => day.day)
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                      )}

                    {formData.businessDays &&
                      formData.businessDays.some((day) => day.isOpen) && (
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              영업시간
                            </p>
                            <div className="grid gap-1">
                              {formData.businessDays
                                .filter((day) => day.isOpen)
                                .map((day) => (
                                  <p
                                    key={day.day}
                                    className="font-medium text-gray-900"
                                  >
                                    {day.day}: {day.openTime} ~ {day.closeTime}
                                  </p>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 버튼 섹션 */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
            <Button
              variant="primary"
              size="lg"
              className="py-6 px-8"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              <Link href="/login">로그인하고 시작하기</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="py-6 px-8"
              rightIcon={<ExternalLink className="h-4 w-4" />}
            >
              <Link href="/">홈페이지로 이동</Link>
            </Button>
          </div>
        </div>
      </div>
    </StepContainer>
  );
}
