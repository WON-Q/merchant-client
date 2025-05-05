"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FileText, HelpCircle } from "lucide-react";

/**
 * 서비스 이용약관 페이지
 */
export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#FF6B35]" />
            이용약관
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            서비스 이용을 위한 약관 전문입니다
          </p>
        </div>
      </div>

      {/* 업데이트 정보 알림 */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-start">
        <HelpCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-800 font-medium">최신 서비스 이용약관</p>
          <p className="text-blue-600 text-sm mt-1">
            본 서비스 이용약관은{" "}
            <span className="font-medium">2025년 5월 4일</span>에 최종
            업데이트되었으며, 언제든지 내용이 변경될 수 있습니다. 변경 시
            웹사이트를 통해 공지합니다.
          </p>
        </div>
      </div>

      <div className="space-y-6 h-[70vh] overflow-y-auto pr-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
              1
            </span>
            제1조 (목적)
          </h2>
          <div className="prose prose-slate max-w-none">
            <p>
              이 약관은 식당 운영 서비스(이하 &quot;서비스&quot;)를 제공하는
              회사(이하 &quot;회사&quot;)와 이를 이용하는 회원(이하
              &quot;회원&quot;) 간에 서비스 이용에 관한 권리·의무 및 책임사항,
              기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
              2
            </span>
            제2조 (약관의 효력 및 변경)
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="my-1">
              1. 본 약관은 서비스를 이용하고자 하는 모든 회원에게 그 효력이
              발생합니다.
            </p>
            <p className="my-1">
              2. 회사는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은
              서비스 내 공지사항에 게시하여 효력이 발생합니다.
            </p>
            <p className="my-1">
              3. 회원은 정기적으로 서비스에 방문하여 약관의 변경사항을 확인해야
              하며, 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단해야
              합니다.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
              3
            </span>
            제3조 (용어의 정의)
          </h2>

          <div className="prose prose-slate max-w-none">
            <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
            <ul className="list-disc ml-6 my-1">
              <li className="my-1">
                &quot;회원&quot;이란 본 약관을 수락하고 회사와 서비스 이용계약을
                체결한 사업자를 말합니다.
              </li>
              <li className="my-1">
                &quot;서비스&quot;란 회원이 PC, 모바일 기기 등 각종 디바이스를
                통하여 이용할 수 있는 회사가 제공하는 모든 서비스를 말합니다.
              </li>
              <li className="my-1">
                &quot;콘텐츠&quot;란 회사 또는 회원이 서비스에 게시한 모든
                내용물을 말합니다.
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
              4
            </span>
            제4조 (서비스의 제공 및 변경)
          </h2>
          <div className="prose prose-slate max-w-none">
            <p>1. 회사는 다음과 같은 서비스를 제공합니다:</p>
            <ul className="list-disc ml-6 my-1">
              <li className="my-1">매장 운영 관리 서비스</li>
              <li className="my-1">주문 접수 및 처리 서비스</li>
              <li className="my-1">매출 정산 및 분석 서비스</li>
              <li className="my-1">고객 관리 서비스</li>
              <li className="my-1">마케팅 지원 서비스</li>
            </ul>
            <p>
              2. 회사는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를
              변경할 수 있습니다.
            </p>
            <p>
              3. 회사는 서비스의 변경 및 중지로 인하여 회원에게 발생한 손해에
              대해서는 책임을 지지 않습니다. 단, 회사의 고의 또는 중과실로 인한
              손해의 경우는 예외로 합니다.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
              5
            </span>
            제5조 (회원가입 및 이용계약의 성립)
          </h2>
          <div className="prose prose-slate max-w-none">
            <p>
              1. 이용계약은 회원이 되고자 하는 자(이하 &quot;가입신청자&quot;)가
              약관의 내용에 동의하고 회사가 정한 양식에 따라 회원정보를 기입하여
              회원가입을 신청하고, 회사가 이를 승낙함으로써 체결됩니다.
            </p>
            <p>
              2. 회사는 다음 각 호의 어느 하나에 해당하는 경우에는 회원가입을
              승낙하지 않을 수 있습니다:
            </p>
            <ul className="list-disc ml-6 my-1">
              <li className="my-1">
                가입신청자가 이전에 본 약관을 위반하여 회원자격이 상실된 적이
                있는 경우
              </li>
              <li className="my-1">
                가입신청자가 제공한 정보에 허위, 기재누락, 오기가 있는 경우
              </li>
              <li className="my-1">
                기타 회원으로 등록하는 것이 기술적으로 불가능하거나 서비스
                운영에 지장이 있는 경우
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="primary" size="lg" data-cy="back-button">
          <Link href="/register">가입 페이지로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
