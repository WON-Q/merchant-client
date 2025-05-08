import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BarChart,
  ChartNoAxesColumnIncreasing,
  Home,
  House,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Storybook 메타 정의
const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "탭 컴포넌트는 관련된 콘텐츠 그룹을 동일한 공간에서 전환하면서 표시할 수 있게 해줍니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "현재 활성화된 탭의 값",
    },
    onValueChange: {
      action: "valueChanged",
      description: "탭이 변경될 때 호출되는 함수",
    },
    className: {
      control: "text",
      description: "추가 클래스명",
    },
    defaultValue: {
      control: "text",
      description: "디폴트 선택 값 (uncontrolled mode)",
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// BasicExample 스토리
export const BasicExample: Story = {
  args: {
    value: "account",
    className: "w-96",
    onValueChange: () => {}, // 필수 prop 추가
  },
  parameters: {
    docs: {
      description: {
        story:
          "기본적인 탭 사용 예시입니다. 여러 탭 간에 콘텐츠를 전환할 수 있습니다.",
      },
    },
  },
  render: function RenderBasicExample(args) {
    const [tabValue, setTabValue] = useState(args.value);

    return (
      <Tabs
        value={tabValue}
        onValueChange={(value) => {
          setTabValue(value);
          args.onValueChange?.(value);
        }}
        className={args.className}
      >
        <TabsList>
          <TabsTrigger value="account">계정</TabsTrigger>
          <TabsTrigger value="password">비밀번호</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <div className="p-4 border rounded-lg mt-4">
            <h3 className="font-medium mb-2">계정 설정</h3>
            <p className="text-sm text-neutral-600">
              계정 정보를 관리할 수 있습니다. 개인 정보 및 이메일 주소를
              변경하세요.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="password">
          <div className="p-4 border rounded-lg mt-4">
            <h3 className="font-medium mb-2">비밀번호 변경</h3>
            <p className="text-sm text-neutral-600">
              비밀번호를 주기적으로 변경하여 계정 보안을 강화하세요.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="p-4 border rounded-lg mt-4">
            <h3 className="font-medium mb-2">알림 설정</h3>
            <p className="text-sm text-neutral-600">
              이메일, 푸시 알림 등 다양한 알림 설정을 관리할 수 있습니다.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    );
  },
};

// WithIcons 스토리
export const WithIcons: Story = {
  args: {
    value: "dashboard",
    className: "w-96",
    onValueChange: () => {}, // 필수 prop 추가
  },
  parameters: {
    docs: {
      description: {
        story: "아이콘을 추가하여 탭의 직관성을 높일 수 있습니다.",
      },
    },
  },
  render: function RenderWithIcons(args) {
    const [tabValue, setTabValue] = useState(args.value);

    return (
      <Tabs
        value={tabValue}
        onValueChange={(value) => {
          setTabValue(value);
          args.onValueChange?.(value);
        }}
        className={args.className}
      >
        <TabsList className="grid grid-cols-3">
          <TabsTrigger
            value="dashboard"
            className="flex gap-2 items-center justify-center"
          >
            <Home className="h-4 w-4" />
            <span>홈</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex gap-2 items-center justify-center"
          >
            <BarChart className="h-4 w-4" />
            <span>분석</span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex gap-2 items-center justify-center"
          >
            <Settings className="h-4 w-4" />
            <span>설정</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="p-4 border rounded-lg mt-4">
            <h3 className="font-medium mb-2">대시보드</h3>
            <p className="text-sm text-neutral-600">
              주요 정보와 최근 활동 요약을 확인하세요.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="p-4 border rounded-lg mt-4">
            <h3 className="font-medium mb-2">분석</h3>
            <p className="text-sm text-neutral-600">
              데이터 분석 및 인사이트를 확인하세요.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="p-4 border rounded-lg mt-4">
            <h3 className="font-medium mb-2">설정</h3>
            <p className="text-sm text-neutral-600">
              앱 설정을 관리하고 사용자 환경을 최적화하세요.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    );
  },
};

// SampleExample 스토리
export const SampleExample: Story = {
  args: {
    value: "details",
    onValueChange: () => {}, // 필수 prop 추가
  },
  parameters: {
    docs: {
      description: {
        story:
          "실제 주문 상세 페이지에서의 탭 활용 예시입니다. 주문 정보, 배송 현황, 결제 정보 등을 탭으로 구분하여 효율적으로 정보를 표시합니다.",
      },
    },
  },
  render: function RenderSampleExample() {
    const [tabValue, setTabValue] = useState("details");

    return (
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-sm border">
        <h3 className="text-xl font-medium text-neutral-900 mb-6">
          주문 #12345 상세정보
        </h3>

        <Tabs value={tabValue} onValueChange={setTabValue}>
          <TabsList className="grid grid-cols-4 gap-1 bg-neutral-100 p-1 rounded-lg">
            <TabsTrigger
              value="details"
              className="flex gap-2 items-center justify-center py-2.5 px-4 text-sm font-medium flex-shrink-0 transition-colors"
            >
              <House className="h-4 w-4" />
              <span>주문 정보</span>
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="flex gap-2 items-center justify-center py-2.5 px-4 text-sm font-medium flex-shrink-0 transition-colors"
            >
              <ChartNoAxesColumnIncreasing className="h-4 w-4" />
              <span>배송 현황</span>
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="flex gap-2 items-center justify-center py-2.5 px-4 text-sm font-medium flex-shrink-0 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>결제 정보</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex gap-2 items-center justify-center py-2.5 px-4 text-sm font-medium flex-shrink-0 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>주문 이력</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span className="text-neutral-500">주문 번호</span>
                <span className="font-medium">#12345</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-neutral-500">주문 날짜</span>
                <span className="font-medium">2023년 12월 15일 14:23</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-neutral-500">주문 상태</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                  배송 완료
                </span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-neutral-500">고객명</span>
                <span className="font-medium">홍길동</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">연락처</span>
                <span className="font-medium">010-1234-5678</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">배송지 정보</h4>
                <p className="text-neutral-600">
                  서울특별시 강남구 테헤란로 123, 456호
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">배송 상태</h4>
                <ol className="relative border-l border-gray-300">
                  <li className="ml-6 mb-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                      ✓
                    </span>
                    <h5 className="font-medium">배송 완료</h5>
                    <p className="text-sm text-neutral-500">
                      2023년 12월 17일 13:25
                    </p>
                  </li>
                  <li className="ml-6 mb-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                      ✓
                    </span>
                    <h5 className="font-medium">배송 중</h5>
                    <p className="text-sm text-neutral-500">
                      2023년 12월 16일 09:15
                    </p>
                  </li>
                  <li className="ml-6 mb-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                      ✓
                    </span>
                    <h5 className="font-medium">발송 준비</h5>
                    <p className="text-sm text-neutral-500">
                      2023년 12월 15일 18:40
                    </p>
                  </li>
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                      ✓
                    </span>
                    <h5 className="font-medium">주문 확인</h5>
                    <p className="text-sm text-neutral-500">
                      2023년 12월 15일 14:23
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span className="text-neutral-500">결제 방법</span>
                <span className="font-medium">신용카드</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-neutral-500">카드 정보</span>
                <span className="font-medium">삼성카드 (1234)</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-neutral-500">결제 상태</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                  결제 완료
                </span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-neutral-500">상품 금액</span>
                <span className="font-medium">35,000원</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-neutral-500">배송비</span>
                <span className="font-medium">2,500원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">총 결제액</span>
                <span className="font-bold text-lg text-[#FF6B35]">
                  37,500원
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              <h4 className="font-medium mb-2">주문 처리 내역</h4>
              <table className="w-full text-sm">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="text-left py-2 px-3">날짜</th>
                    <th className="text-left py-2 px-3">상태</th>
                    <th className="text-left py-2 px-3">내용</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-3">2023-12-17 13:25</td>
                    <td className="py-2 px-3">배송 완료</td>
                    <td className="py-2 px-3">배송이 완료되었습니다.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3">2023-12-16 09:15</td>
                    <td className="py-2 px-3">배송 중</td>
                    <td className="py-2 px-3">상품이 발송되었습니다.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3">2023-12-15 18:40</td>
                    <td className="py-2 px-3">발송 준비</td>
                    <td className="py-2 px-3">상품이 포장 완료되었습니다.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3">2023-12-15 14:23</td>
                    <td className="py-2 px-3">주문 확인</td>
                    <td className="py-2 px-3">주문이 확인되었습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-4 border-t flex justify-end">
          <Button variant="outline" size="sm" className="mr-2">
            이전 페이지
          </Button>
          <Button variant="primary" size="sm">
            주문 수정
          </Button>
        </div>
      </div>
    );
  },
};
