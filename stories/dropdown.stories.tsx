import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown, DropdownProps } from "@/components/ui/dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu-item";
import {
  Bell,
  Calendar,
  CreditCard,
  MapPin,
  ShieldCheck,
  ShoppingCart,
  Tag,
  TruckIcon,
  Users,
} from "lucide-react";

const meta = {
  title: "UI/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "사용자가 미리 정의된 옵션 중에서 선택할 수 있는 드롭다운 컴포넌트입니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      description: "선택 필드 위에 표시되는 레이블",
      control: "text",
    },
    placeholder: {
      description: "선택하기 전에 표시되는 안내 텍스트",
      control: "text",
    },
    variant: {
      control: "select",
      description: "선택 필드의 시각적 스타일을 결정합니다",
      options: ["default", "outline", "ghost"],
      defaultValue: "default",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      description: "선택 필드의 크기를 결정합니다",
      options: ["xs", "sm", "md", "lg", "xl"],
      defaultValue: "md",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    shape: {
      control: "select",
      description: "선택 필드의 모서리 스타일을 결정합니다",
      options: ["rounded", "pill", "square"],
      defaultValue: "rounded",
      table: {
        defaultValue: { summary: "rounded" },
      },
    },
    isLoading: {
      control: "boolean",
      description: "로딩 상태를 표시합니다",
      defaultValue: false,
    },
    isError: {
      control: "boolean",
      description: "오류 상태를 시각적으로 표시합니다",
      defaultValue: false,
    },
    errorMessage: {
      control: "text",
      description: "오류 발생 시 표시되는 메시지",
    },
    disabled: {
      control: "boolean",
      description: "선택 필드의 비활성화 상태를 결정합니다",
      defaultValue: false,
    },
    fullWidth: {
      control: "boolean",
      description: "선택 필드가 컨테이너의 전체 너비를 차지하도록 합니다",
      defaultValue: true,
    },
    isRequired: {
      control: "boolean",
      description: "필수 입력 필드 여부를 표시합니다",
      defaultValue: false,
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const PlaygroundStory = (args: Partial<DropdownProps>) => {
  const [value, setValue] = React.useState("");
  return (
    <Dropdown {...args} value={value} onChange={(val) => setValue(val)}>
      <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
      <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
      <DropdownMenuItem value="option3">옵션 3</DropdownMenuItem>
      <DropdownMenuItem value="option4">옵션 4</DropdownMenuItem>
      <DropdownMenuItem value="option5" disabled>
        옵션 5 (비활성화)
      </DropdownMenuItem>
    </Dropdown>
  );
};

export const Playground: Story = {
  args: {
    placeholder: "선택하세요",
  },
  render: (args) => <PlaygroundStory {...args} />,
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "선택 필드의 사용 목적과 컨텍스트에 따라 적절한 변형을 선택할 수 있습니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Dropdown variant="default" placeholder="기본 스타일">
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
        <DropdownMenuItem value="option3">옵션 3</DropdownMenuItem>
      </Dropdown>
      <Dropdown variant="outline" placeholder="외곽선 스타일">
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
        <DropdownMenuItem value="option3">옵션 3</DropdownMenuItem>
      </Dropdown>
      <Dropdown variant="ghost" placeholder="고스트 스타일">
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
        <DropdownMenuItem value="option3">옵션 3</DropdownMenuItem>
      </Dropdown>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "다양한 컨텍스트에 맞춰 사용할 수 있는 5가지 크기를 제공합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Dropdown size="xs" placeholder="Extra Small">
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
      </Dropdown>
      <Dropdown size="sm" placeholder="Small">
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
      </Dropdown>
      <Dropdown size="md" placeholder="Medium">
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
      </Dropdown>
      <Dropdown size="lg" placeholder="Large">
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
      </Dropdown>
      <Dropdown size="xl" placeholder="Extra Large">
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
      </Dropdown>
    </div>
  ),
};

export const Shapes: Story = {
  parameters: {
    docs: {
      description: {
        story: "상황에 맞는 모서리 스타일을 선택할 수 있습니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Dropdown shape="rounded" placeholder="둥근 모서리">
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
        <DropdownMenuItem value="option3">옵션 3</DropdownMenuItem>
      </Dropdown>
      <Dropdown shape="pill" placeholder="알약형">
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
        <DropdownMenuItem value="option3">옵션 3</DropdownMenuItem>
      </Dropdown>
      <Dropdown shape="square" placeholder="직각 모서리">
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
        <DropdownMenuItem value="option3">옵션 3</DropdownMenuItem>
      </Dropdown>
    </div>
  ),
};

export const WithLabels: Story = {
  parameters: {
    docs: {
      description: {
        story: "레이블을 통해 선택 필드에 대한 정보를 제공합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Dropdown label="이름" placeholder="선택하세요">
        <DropdownMenuItem value="john">John Doe</DropdownMenuItem>
        <DropdownMenuItem value="jane">Jane Smith</DropdownMenuItem>
        <DropdownMenuItem value="bob">Bob Johnson</DropdownMenuItem>
      </Dropdown>
      <Dropdown label="나이" placeholder="나이를 선택하세요" isRequired>
        <DropdownMenuItem value="10">10대</DropdownMenuItem>
        <DropdownMenuItem value="20">20대</DropdownMenuItem>
        <DropdownMenuItem value="30">30대</DropdownMenuItem>
        <DropdownMenuItem value="40">40대</DropdownMenuItem>
        <DropdownMenuItem value="50">50대 이상</DropdownMenuItem>
      </Dropdown>
      <Dropdown label="직업" placeholder="직업을 선택하세요" isRequired>
        <DropdownMenuItem value="student">학생</DropdownMenuItem>
        <DropdownMenuItem value="employee">회사원</DropdownMenuItem>
        <DropdownMenuItem value="self-employed">자영업</DropdownMenuItem>
        <DropdownMenuItem value="other">기타</DropdownMenuItem>
      </Dropdown>
    </div>
  ),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: "선택 필드의 다양한 상태를 시각적으로 표현합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Dropdown placeholder="기본 상태">
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
        <DropdownMenuItem value="option3">옵션 3</DropdownMenuItem>
      </Dropdown>
      <Dropdown placeholder="비활성화 상태" disabled>
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
        <DropdownMenuItem value="option3">옵션 3</DropdownMenuItem>
      </Dropdown>
      <Dropdown placeholder="로딩 상태" isLoading>
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
        <DropdownMenuItem value="option3">옵션 3</DropdownMenuItem>
      </Dropdown>
      <Dropdown
        placeholder="오류 상태"
        isError
        errorMessage="필수 항목을 선택해주세요"
      >
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
        <DropdownMenuItem value="option3">옵션 3</DropdownMenuItem>
      </Dropdown>
    </div>
  ),
};

const WithIconsStory = () => {
  const [value, setValue] = React.useState("");

  return (
    <div className="flex flex-col gap-4 w-80">
      <Dropdown
        value={value}
        onChange={(val) => setValue(val)}
        label="카테고리 선택"
        placeholder="선택하세요"
      >
        <DropdownMenuItem
          value="users"
          startContent={<Users size={16} className="text-[#FF6B35]" />}
        >
          사용자 관리
        </DropdownMenuItem>
        <DropdownMenuItem
          value="location"
          startContent={<MapPin size={16} className="text-[#2EC4B6]" />}
        >
          위치 설정
        </DropdownMenuItem>
        <DropdownMenuItem
          value="schedule"
          startContent={<Calendar size={16} className="text-[#FFBF69]" />}
        >
          일정 관리
        </DropdownMenuItem>
        <DropdownMenuItem
          value="notifications"
          startContent={<Bell size={16} className="text-[#F59E0B]" />}
          disabled
        >
          알림 설정 (준비중)
        </DropdownMenuItem>
      </Dropdown>
    </div>
  );
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: "MenuItem에 아이콘을 추가하여 시각적으로 구분할 수 있습니다.",
      },
    },
  },
  render: () => <WithIconsStory />,
};

export const Required: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "필수 입력 필드로 표시하면 레이블 옆에 붉은색 별표(*)가 표시됩니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Dropdown label="일반 드롭다운" placeholder="선택 사항입니다">
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
      </Dropdown>
      <Dropdown label="필수 드롭다운" placeholder="필수 사항입니다" isRequired>
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
      </Dropdown>
      <Dropdown
        label="필수 드롭다운 (오류)"
        placeholder="필수 사항입니다"
        isRequired
        isError
        errorMessage="필수 항목을 선택해주세요"
      >
        <DropdownMenuItem value="option1">옵션 1</DropdownMenuItem>
        <DropdownMenuItem value="option2">옵션 2</DropdownMenuItem>
      </Dropdown>
    </div>
  ),
};

const SampleExampleComponent = () => {
  const [paymentMethod, setPaymentMethod] = React.useState("");
  const [shippingMethod, setShippingMethod] = React.useState("");
  const [coupon, setCoupon] = React.useState("");

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm border border-neutral-100">
      <h3 className="text-lg font-medium text-neutral-900 mb-4">
        주문 결제 정보
      </h3>

      <div className="flex flex-col gap-5">
        <Dropdown
          label="결제 수단"
          placeholder="결제 수단을 선택하세요"
          isRequired
          value={paymentMethod}
          onChange={setPaymentMethod}
        >
          <DropdownMenuItem
            value="card"
            startContent={<CreditCard size={16} className="text-[#FF6B35]" />}
          >
            신용/체크카드
          </DropdownMenuItem>
          <DropdownMenuItem
            value="bank"
            startContent={<ShieldCheck size={16} className="text-[#2EC4B6]" />}
          >
            계좌이체
          </DropdownMenuItem>
          <DropdownMenuItem
            value="mobile"
            startContent={<Bell size={16} className="text-[#FFBF69]" />}
          >
            휴대폰 결제
          </DropdownMenuItem>
          <DropdownMenuItem
            value="point"
            startContent={<Tag size={16} className="text-[#F59E0B]" />}
          >
            포인트 결제
          </DropdownMenuItem>
        </Dropdown>

        <Dropdown
          label="배송 방법"
          placeholder="배송 방법을 선택하세요"
          value={shippingMethod}
          onChange={setShippingMethod}
        >
          <DropdownMenuItem
            value="standard"
            startContent={<TruckIcon size={16} />}
            endContent={
              <span className="text-xs text-neutral-500">2,500원</span>
            }
          >
            일반 배송 (2-3일)
          </DropdownMenuItem>
          <DropdownMenuItem
            value="express"
            startContent={<TruckIcon size={16} />}
            endContent={
              <span className="text-xs text-neutral-500">5,000원</span>
            }
          >
            특급 배송 (1일)
          </DropdownMenuItem>
          <DropdownMenuItem
            value="pickup"
            startContent={<ShoppingCart size={16} />}
            endContent={<span className="text-xs text-neutral-500">무료</span>}
          >
            매장 픽업
          </DropdownMenuItem>
        </Dropdown>

        <Dropdown
          label="쿠폰 적용"
          placeholder="사용 가능한 쿠폰을 선택하세요"
          value={coupon}
          onChange={setCoupon}
          variant="outline"
        >
          <DropdownMenuItem
            value="newuser"
            endContent={
              <span className="text-xs font-medium text-[#FF6B35]">
                10% 할인
              </span>
            }
          >
            신규 가입 특별 쿠폰
          </DropdownMenuItem>
          <DropdownMenuItem
            value="welcome"
            endContent={
              <span className="text-xs font-medium text-[#FF6B35]">
                5,000원 할인
              </span>
            }
          >
            첫 구매 웰컴 쿠폰
          </DropdownMenuItem>
          <DropdownMenuItem
            value="summer"
            endContent={
              <span className="text-xs font-medium text-[#FF6B35]">
                2,000원 할인
              </span>
            }
          >
            여름 시즌 프로모션
          </DropdownMenuItem>
          <DropdownMenuItem
            value="none"
            endContent={
              <span className="text-xs text-neutral-400">할인 없음</span>
            }
          >
            쿠폰 사용 안함
          </DropdownMenuItem>
        </Dropdown>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-100">
        <div className="flex justify-between mb-2">
          <span className="text-neutral-600">상품 금액</span>
          <span className="font-medium">38,000원</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-neutral-600">배송비</span>
          <span className="font-medium">
            {shippingMethod === "express"
              ? "5,000원"
              : shippingMethod === "standard"
              ? "2,500원"
              : shippingMethod === "pickup"
              ? "무료"
              : "0원"}
          </span>
        </div>
        {coupon && coupon !== "none" && (
          <div className="flex justify-between mb-2 text-[#FF6B35]">
            <span>쿠폰 할인</span>
            <span className="font-medium">
              {coupon === "newuser"
                ? "-3,800원"
                : coupon === "welcome"
                ? "-5,000원"
                : coupon === "summer"
                ? "-2,000원"
                : "0원"}
            </span>
          </div>
        )}
        <div className="flex justify-between mt-3 pt-2 border-t border-neutral-100">
          <span className="font-medium">최종 결제 금액</span>
          <span className="font-bold text-lg">
            {(() => {
              let total = 38000;
              // 배송비 계산
              if (shippingMethod === "express") total += 5000;
              else if (shippingMethod === "standard") total += 2500;

              // 쿠폰 할인 계산
              if (coupon === "newuser") total -= 3800;
              else if (coupon === "welcome") total -= 5000;
              else if (coupon === "summer") total -= 2000;

              return `${total.toLocaleString()}원`;
            })()}
          </span>
        </div>
      </div>
    </div>
  );
};

export const SampleExample: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "실제 주문 결제 페이지에서의 사용 예시입니다. 다양한 드롭다운을 활용한 예제를 보여줍니다.",
      },
    },
  },
  render: () => <SampleExampleComponent />,
};
