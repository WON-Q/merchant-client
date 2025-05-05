"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertCircle, FileText, HelpCircle, Shield } from "lucide-react";

/**
 * 개인정보 처리방침 페이지
 */
export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#FF6B35]" />
            개인정보 처리방침
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            고객님의 개인정보를 소중히 다루기 위한 방침입니다
          </p>
        </div>
      </div>

      {/* 업데이트 정보 알림 */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-start">
        <HelpCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-800 font-medium">최신 개인정보 처리방침</p>
          <p className="text-blue-600 text-sm mt-1">
            본 개인정보 처리방침은{" "}
            <span className="font-medium">2025년 5월 4일</span>에 최종
            업데이트되었으며, 언제든지 내용이 변경될 수 있습니다. 변경 시
            웹사이트를 통해 공지합니다.
          </p>
        </div>
      </div>

      <div className="h-[70vh] overflow-y-auto pr-4">
        <div className="space-y-6">
          {/* 섹션 1: 총칙 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
                1
              </span>
              개인정보처리방침 총칙
            </h2>
            <div className="prose prose-slate max-w-none">
              <p>
                본 개인정보 처리방침은 회사가 제공하는 서비스를 이용하는 고객의
                개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할
                수 있도록 하기 위하여 다음과 같은 처리방침을 두고 있습니다.
              </p>
              <p className="mt-4">
                회사는 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호
                등에 관한 법률」을 비롯한 모든 관련 법령을 준수하며,
                개인정보처리방침을 개정하는 경우 웹사이트 공지사항을 통하여
                공지할 것입니다.
              </p>
            </div>
          </div>

          {/* 섹션 2: 수집하는 개인정보 항목 */}
          <div
            id="collection"
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
                2
              </span>
              수집하는 개인정보 항목
            </h2>

            <div className="w-full">
              <div className="bg-slate-50 p-4 rounded-md">
                <h3 className="font-semibold mb-2">기본 회원정보</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-3 w-1/3">항목</th>
                      <th className="text-left py-2 px-3 w-2/3">
                        수집 이용 목적
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3">아이디</td>
                      <td className="py-2 px-3">서비스 이용 및 회원 식별</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3">이메일 주소</td>
                      <td className="py-2 px-3">
                        서비스 이용 관련 안내, 고지사항 전달
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3">휴대폰 번호</td>
                      <td className="py-2 px-3">
                        본인 인증, 서비스 이용 관련 안내
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">비밀번호</td>
                      <td className="py-2 px-3">회원 계정 보호</td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="font-semibold mb-2 mt-6">사업자 정보</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-3 w-1/3">항목</th>
                      <th className="text-left py-2 px-3 w-2/3">
                        수집 이용 목적
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3">사업자등록번호</td>
                      <td className="py-2 px-3">
                        서비스 이용 자격 검증, 정산 및 세금 처리
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3">상호명</td>
                      <td className="py-2 px-3">서비스 제공 및 정산</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">대표자명</td>
                      <td className="py-2 px-3">서비스 제공 및 정산</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-50 p-4 rounded-md mt-4 hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-3 w-1/3">항목</th>
                      <th className="text-left py-2 px-3 w-2/3">
                        수집 이용 목적
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3">프로필 이미지</td>
                      <td className="py-2 px-3">
                        서비스 내 프로필 표시, 맞춤 서비스 제공
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3">매장 사진</td>
                      <td className="py-2 px-3">서비스 내 매장 정보 표시</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">마케팅 수신 동의</td>
                      <td className="py-2 px-3">맞춤형 마케팅 정보 제공</td>
                    </tr>
                  </tbody>
                </table>

                <p className="text-sm text-slate-600 mt-4">
                  <AlertCircle className="inline-block h-4 w-4 mr-1" />
                  선택 항목의 경우 수집에 동의하지 않으셔도 서비스 이용에 제한이
                  없으나, 일부 부가 서비스 이용이 어려울 수 있습니다.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-md mt-4 hidden">
                <p>
                  서비스 이용 과정에서 아래 정보들이 자동으로 생성되어 수집될 수
                  있습니다.
                </p>
                <ul className="list-disc ml-6 mt-3">
                  <li>IP 주소, 쿠키, MAC 주소, 서비스 이용 기록</li>
                  <li>방문 일시, 접속 로그, 불량 이용 기록</li>
                  <li>모바일 기기 정보(기기 모델, OS 버전)</li>
                  <li>결제 기록</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 섹션 3: 개인정보의 이용 목적 */}
          <div
            id="purpose"
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
                3
              </span>
              개인정보의 이용 목적
            </h2>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-md">
                <h3 className="font-semibold mb-2">서비스 제공 및 계약 이행</h3>
                <ul className="list-disc ml-6">
                  <li>가맹점 운영 관리 서비스 제공</li>
                  <li>가입 및 가입상담, 서비스 변경/해지</li>
                  <li>서비스 이용 요금 결제 및 정산</li>
                  <li>콘텐츠 제공 및 맞춤화된 서비스 제공</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-md">
                <h3 className="font-semibold mb-2">회원 관리</h3>
                <ul className="list-disc ml-6">
                  <li>회원 식별 및 가입 의사 확인</li>
                  <li>고지사항 전달 및 불만처리 등 민원처리</li>
                  <li>분쟁 조정을 위한 기록 보존</li>
                  <li>부정 이용 방지 및 비인가 사용 방지</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-md">
                <h3 className="font-semibold mb-2">
                  서비스 개선 및 마케팅·광고
                </h3>
                <ul className="list-disc ml-6">
                  <li>서비스 이용 통계 분석</li>
                  <li>서비스 개발 및 개선</li>
                  <li>
                    이벤트 및 광고성 정보 제공 (마케팅 정보 수신 동의자에 한함)
                  </li>
                  <li>접속 빈도 파악 및 서비스 이용에 대한 통계</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 섹션 4: 개인정보 보유기간 */}
          <div
            id="retention"
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
                4
              </span>
              개인정보의 보유 및 이용기간
            </h2>

            <div className="prose prose-slate max-w-none">
              <p>
                회사는 회원의 개인정보를 원칙적으로 개인정보의 수집 및
                이용목적이 달성되면 지체 없이 파기합니다. 단, 다음의 정보에
                대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
              </p>

              <div className="border-t border-b border-slate-200 my-4 py-4">
                <h3 className="text-lg font-semibold mb-2">
                  관련법령에 의한 정보 보유
                </h3>
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-2 px-3 border-b border-slate-200">
                        보존 항목
                      </th>
                      <th className="text-left py-2 px-3 border-b border-slate-200">
                        보존 기간
                      </th>
                      <th className="text-left py-2 px-3 border-b border-slate-200">
                        보존 근거
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-3 border-b border-slate-200">
                        계약 또는 청약철회 등에 관한 기록
                      </td>
                      <td className="py-2 px-3 border-b border-slate-200">
                        5년
                      </td>
                      <td className="py-2 px-3 border-b border-slate-200">
                        전자상거래 등에서의 소비자보호에 관한 법률
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-b border-slate-200">
                        대금결제 및 재화 등의 공급에 관한 기록
                      </td>
                      <td className="py-2 px-3 border-b border-slate-200">
                        5년
                      </td>
                      <td className="py-2 px-3 border-b border-slate-200">
                        전자상거래 등에서의 소비자보호에 관한 법률
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-b border-slate-200">
                        소비자의 불만 또는 분쟁처리에 관한 기록
                      </td>
                      <td className="py-2 px-3 border-b border-slate-200">
                        3년
                      </td>
                      <td className="py-2 px-3 border-b border-slate-200">
                        전자상거래 등에서의 소비자보호에 관한 법률
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">로그인 기록</td>
                      <td className="py-2 px-3">3개월</td>
                      <td className="py-2 px-3">통신비밀보호법</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold mb-2">
                개인정보 파기 절차 및 방법
              </h3>
              <p>
                회원의 개인정보는 수집 및 이용목적이 달성된 후 별도의 DB로
                옮겨져 내부 방침 및 관련 법령에 따라 일정 기간 보관 후
                파기됩니다. 이때 DB로 옮겨진 정보는 법률에 의한 경우가
                아니고서는 다른 목적으로 이용되지 않습니다.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1 bg-slate-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">전자적 파일 형태의 정보</h4>
                  <p className="text-sm">
                    기술적 방법을 사용하여 복구 및 재생이 불가능하도록 영구
                    삭제합니다.
                  </p>
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">종이에 출력된 개인정보</h4>
                  <p className="text-sm">
                    분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 섹션 5: 정보주체 권리 */}
          <div id="rights" className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm mr-2">
                5
              </span>
              정보주체의 권리와 행사 방법
            </h2>

            <div className="prose prose-slate max-w-none">
              <p>
                회원은 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 my-4">
                <div className="bg-slate-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-1">
                    개인정보 열람 요구
                  </h3>
                  <p className="text-sm">
                    회사가 보유하고 있는 개인정보에 대해 언제든지 열람을 요구할
                    수 있습니다.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-1">
                    개인정보 정정·삭제 요구
                  </h3>
                  <p className="text-sm">
                    개인정보가 틀리거나 처리 목적이 달성되었다면 정정 또는
                    삭제를 요구할 수 있습니다.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-1">
                    개인정보 처리정지 요구
                  </h3>
                  <p className="text-sm">
                    개인정보의 처리를 원하지 않는 경우 그 처리의 정지를 요구할
                    수 있습니다.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-1">
                    개인정보 동의철회 요구
                  </h3>
                  <p className="text-sm">
                    개인정보 수집 및 이용에 대한 동의를 철회할 수 있습니다.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-medium mt-4 mb-2">권리 행사 방법</h3>
              <p>
                위 권리 행사는 회사에 대해 다음과 같은 방법으로 요청하실 수
                있습니다.
              </p>
              <ul className="list-disc ml-6 my-1">
                <li className="my-1">홈페이지 내 마이페이지 개인정보 설정</li>
                <li className="my-1">
                  개인정보 관리책임자에게 서면, 전화 또는 이메일로 연락
                </li>
                <li className="my-1">고객센터를 통한 요청</li>
              </ul>

              <div className="bg-primary/5 p-4 rounded-md mt-4 border border-primary/10">
                <h4 className="text-lg font-semibold flex items-center text-[#FF6B35]">
                  <Shield className="h-5 w-5 mr-2" /> 개인정보 보호책임자
                </h4>
                <table className="w-full mt-2">
                  <tbody>
                    <tr>
                      <td className="py-1 pr-4 font-medium">이름:</td>
                      <td>홍길동</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4 font-medium">직위:</td>
                      <td>개인정보 보호책임자</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4 font-medium">연락처:</td>
                      <td>privacy@example.com / 02-123-4567</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="primary" size="lg">
          <Link href="/register">가입 페이지로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
