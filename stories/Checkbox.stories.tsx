import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@/components/ui/Checkbox";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "선택/미선택 상태를 시각적으로 표현하는 체크박스 컴포넌트입니다. 단일/다중 옵션을 선택하는데 사용합니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "체크박스의 선택 상태 또는 기본 선택 상태",
      defaultValue: false,
    },
    disabled: {
      control: "boolean",
      description: "체크박스의 비활성화 상태",
      defaultValue: false,
    },
    size: {
      control: "select",
      description: "체크박스의 크기",
      options: ["xs", "sm", "md", "lg", "xl"],
      defaultValue: "md",
    },
    variant: {
      control: "select",
      description: "체크박스의 색상 변형",
      options: [
        "primary",
        "secondary",
        "accent",
        "success",
        "warning",
        "error",
      ],
      defaultValue: "primary",
    },
    label: {
      control: "text",
      description: "체크박스에 표시할 레이블",
    },
    labelPosition: {
      control: "radio",
      options: ["left", "right"],
      description: "레이블 위치",
      defaultValue: "right",
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: "이용약관에 동의합니다",
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "다양한 크기의 체크박스를 제공합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox size="xs" label="Extra Small" checked={true} />
      <Checkbox size="sm" label="Small" checked={true} />
      <Checkbox size="md" label="Medium" checked={true} />
      <Checkbox size="lg" label="Large" checked={true} />
      <Checkbox size="xl" label="Extra Large" checked={true} />
    </div>
  ),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: "다양한 색상의 체크박스를 제공합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-8">
        <Checkbox variant="primary" label="Primary" checked={true} />
        <Checkbox variant="secondary" label="Secondary" checked={true} />
        <Checkbox variant="accent" label="Accent" checked={true} />
      </div>
      <div className="flex flex-wrap gap-8">
        <Checkbox variant="success" label="Success" checked={true} />
        <Checkbox variant="warning" label="Warning" checked={true} />
        <Checkbox variant="error" label="Error" checked={true} />
      </div>
    </div>
  ),
};

export const LabelPositions: Story = {
  parameters: {
    docs: {
      description: {
        story: "레이블을 체크박스의 왼쪽이나 오른쪽에 배치할 수 있습니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="오른쪽 레이블" labelPosition="right" checked={true} />
      <Checkbox label="왼쪽 레이블" labelPosition="left" checked={true} />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: "체크박스의 다양한 상태를 시각적으로 표현합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-8">
        <Checkbox label="미선택 상태" />
        <Checkbox label="선택 상태" checked={true} />
      </div>
      <div className="flex flex-wrap gap-8">
        <Checkbox label="비활성화 (미선택)" disabled />
        <Checkbox label="비활성화 (선택)" disabled checked={true} />
      </div>
    </div>
  ),
};

const SampleExampleComponent = () => {
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [marketingConsent, setMarketingConsent] = React.useState(false);
  const [saveAddress, setSaveAddress] = React.useState(true);
  const [giftWrap, setGiftWrap] = React.useState(false);
  const [expressShipping, setExpressShipping] = React.useState(false);
  const [notifyDelivery, setNotifyDelivery] = React.useState(true);

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm border border-neutral-100">
      <h3 className="text-lg font-medium text-neutral-900 mb-4">주문 설정</h3>

      <div className="flex flex-col gap-5">
        <div className="pb-4 border-b border-neutral-100">
          <h4 className="text-sm font-medium text-neutral-700 mb-3">
            배송 옵션
          </h4>
          <div className="space-y-3">
            <Checkbox
              checked={saveAddress}
              onCheckedChange={setSaveAddress}
              label="배송지 정보 저장"
              variant="primary"
            />
            <Checkbox
              checked={expressShipping}
              onCheckedChange={setExpressShipping}
              label="빠른 배송 (추가 비용 5,000원)"
              variant="accent"
            />
            <Checkbox
              checked={giftWrap}
              onCheckedChange={setGiftWrap}
              label="선물 포장 (추가 비용 3,000원)"
              variant="secondary"
            />
            <Checkbox
              checked={notifyDelivery}
              onCheckedChange={setNotifyDelivery}
              label="배송 알림 받기"
            />
          </div>
        </div>

        <div className="pb-4">
          <h4 className="text-sm font-medium text-neutral-700 mb-3">
            필수 동의
          </h4>
          <div className="space-y-3">
            <Checkbox
              checked={acceptTerms}
              onCheckedChange={setAcceptTerms}
              label="이용약관에 동의합니다 (필수)"
              variant={acceptTerms ? "primary" : "error"}
            />
            <div className="ml-6">
              <p className="text-xs text-neutral-500 mb-2">
                · 개인정보 수집 및 이용에 관한 동의
              </p>
              <p className="text-xs text-neutral-500">
                · 전자상거래 이용약관 동의
              </p>
            </div>

            <Checkbox
              checked={marketingConsent}
              onCheckedChange={setMarketingConsent}
              label="마케팅 정보 수신에 동의합니다 (선택)"
              variant="primary"
            />
          </div>
        </div>

        <div className="pt-4 mt-2">
          <p className="text-sm text-neutral-500 mb-4">
            선택한 옵션:{" "}
            {[
              saveAddress && "배송지 저장",
              expressShipping && "빠른 배송",
              giftWrap && "선물 포장",
              notifyDelivery && "배송 알림",
            ]
              .filter(Boolean)
              .join(", ")}
          </p>

          <div
            className={`p-3 rounded-md text-sm mb-3 ${
              acceptTerms
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {acceptTerms
              ? "필수 약관에 동의하셨습니다."
              : "필수 약관에 동의해주세요."}
          </div>
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
          "실제 배송 설정 폼에서 체크박스 사용 예시입니다. 다양한 옵션과 상태의 체크박스를 활용하는 방법을 보여줍니다.",
      },
    },
  },
  render: () => <SampleExampleComponent />,
};
