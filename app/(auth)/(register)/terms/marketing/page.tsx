"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, HelpCircle } from "lucide-react";

/**
 * 마케팅 정보 수신 동의 약관 페이지
 */
export default function MarketingTermsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#FF6B35]" />
            마케팅 정보 수신 동의
            <span className="bg-[#FF6B35]/10 text-[#FF6B35] text-xs rounded-full px-3 py-1 font-medium border-none">
              선택
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            마케팅 정보 수신에 대한 약관 전문입니다
          </p>
        </div>
      </div>

      {/* 업데이트 정보 알림 */}
      <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-8 flex items-start">
        <HelpCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-orange-800 font-medium">
            최신 마케팅 정보 수신 동의
          </p>
          <p className="text-orange-600 text-sm mt-1">
            본 마케팅 정보 수신 동의는{" "}
            <span className="font-medium">2025년 5월 4일</span>에 최종
            업데이트되었으며, 언제든지 내용이 변경될 수 있습니다. 변경 시
            웹사이트를 통해 공지합니다.
          </p>
        </div>
      </div>

      <div className="h-[70vh] overflow-y-auto pr-4">
        <div className="space-y-6">
          {/* 섹션 1: 마케팅 정보 활용 동의 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
                1
              </span>
              마케팅 정보 활용 동의
            </h2>
            <div className="prose prose-slate max-w-none">
              <p>
                회사는 회원에게 더 나은 서비스와 혜택을 제공하기 위해 마케팅
                정보를 활용하고자 합니다. 이에 동의하시면 신규 서비스 및 이벤트
                정보 안내, 맞춤형 서비스 제공, 고객 만족도 조사 등의 목적으로
                고객님의 개인정보를 활용할 수 있습니다.
              </p>
            </div>
          </div>

          {/* 섹션 2: 마케팅 정보 수집 항목 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
                2
              </span>
              마케팅 정보 수집 항목
            </h2>
            <div className="bg-slate-50 p-4 rounded-md">
              <p>회사가 마케팅 목적으로 수집하는 정보는 다음과 같습니다.</p>
              <div className="mt-3">
                <h3 className="font-semibold mb-2">필수정보</h3>
                <ul className="list-disc ml-6 mb-4">
                  <li>이름</li>
                  <li>휴대폰번호</li>
                  <li>이메일주소</li>
                </ul>

                <h3 className="font-semibold mb-2">선택정보</h3>
                <ul className="list-disc ml-6">
                  <li>생년월일</li>
                  <li>성별</li>
                  <li>직업</li>
                  <li>관심분야</li>
                  <li>서비스 이용기록</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 섹션 3: 마케팅 정보 활용 목적 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
                3
              </span>
              마케팅 정보 활용 목적
            </h2>
            <div className="prose prose-slate max-w-none">
              <p>수집된 마케팅 정보는 다음의 목적으로 활용됩니다.</p>
              <div className="bg-slate-50 p-4 rounded-md mt-3">
                <ul className="list-disc ml-6">
                  <li>신규 서비스 및 이벤트 정보 안내</li>
                  <li>맞춤형 서비스 제공 및 추천</li>
                  <li>고객 만족도 조사 및 서비스 품질 향상</li>
                  <li>경품 및 사은품 제공</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 섹션 4: 마케팅 정보 이용 및 제공 방법 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
                4
              </span>
              마케팅 정보 이용 및 제공 방법
            </h2>
            <div className="prose prose-slate max-w-none">
              <p>
                회사는 다음과 같은 방법으로 마케팅 정보를 이용하거나 제공합니다.
              </p>
              <div className="bg-slate-50 p-4 rounded-md mt-3">
                <ul className="list-disc ml-6">
                  <li>이메일, SMS, 푸시 알림 등을 통한 정보 안내</li>
                  <li>전화를 통한 서비스 안내 및 상담</li>
                  <li>우편 및 택배를 통한 경품 및 홍보물 발송</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 섹션 5: 마케팅 정보 활용 동의 철회 방법 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
                5
              </span>
              마케팅 정보 활용 동의 철회 방법
            </h2>
            <div className="prose prose-slate max-w-none">
              <p>
                마케팅 정보 활용 동의는 언제든지 철회하실 수 있으며, 철회 방법은
                다음과 같습니다.
              </p>
              <div className="bg-slate-50 p-4 rounded-md mt-3">
                <ul className="list-disc ml-6">
                  <li>
                    회사 웹사이트 또는 모바일 앱의 마이페이지 내 설정 메뉴
                  </li>
                  <li>고객센터를 통한 전화 요청</li>
                  <li>이메일 수신 시 제공되는 수신거부 링크 클릭</li>
                  <li>SMS 수신 시 안내되는 수신거부 방법에 따라 요청</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 섹션 6: 마케팅 정보 보유 및 이용기간 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
                6
              </span>
              마케팅 정보 보유 및 이용기간
            </h2>
            <div className="prose prose-slate max-w-none">
              <p>
                마케팅 정보는 회원탈퇴 시 또는 마케팅 정보 활용 동의 철회 시까지
                보유 및 이용됩니다. 단, 관계법령에 따라 보존할 필요가 있는
                경우에는 해당 법령에서 정한 기간 동안 보관됩니다.
              </p>
            </div>
          </div>

          {/* 섹션 7: 혜택 및 정보 제공 내용 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
                7
              </span>
              혜택 및 정보 제공 내용
            </h2>
            <div className="bg-slate-50 p-4 rounded-md">
              <p>
                마케팅 정보 수신에 동의하시면 다음과 같은 혜택을 받으실 수
                있습니다.
              </p>
              <ul className="list-disc ml-6 mt-3">
                <li>신규 기능 업데이트 및 사용 팁 안내</li>
                <li>가맹점 전용 프로모션 및 할인 혜택</li>
                <li>식당 운영에 도움이 되는 트렌드 정보</li>
                <li>시즌별 마케팅 캠페인 제안</li>
                <li>회원 전용 세미나 및 교육 프로그램 초대</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-md mt-6 border border-blue-100">
        <p className="text-blue-800 font-medium">안내사항:</p>
        <p className="text-blue-700 text-sm mt-1">
          마케팅 정보 활용 동의를 거부하시더라도 기본적인 서비스 이용에는 제한이
          없습니다. 다만, 마케팅 활동을 통해 제공되는 각종 혜택 및 이벤트 정보를
          받아보실 수 없습니다. 동의 후에도 언제든지 고객센터 또는 마이페이지를
          통해 수신 동의를 철회할 수 있습니다.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="primary" size="lg">
          <Link href="/register">가입 페이지로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
