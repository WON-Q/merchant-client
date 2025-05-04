import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/Button";
import {
  Mail,
  ArrowRight,
  ShoppingCart,
  Loader,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React from "react";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "다양한 상황에서 사용할 수 있는 버튼 컴포넌트입니다. hover시 자연스러운 스케일 효과가 적용됩니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      description: "버튼에 표시될 텍스트 또는 내용입니다",
      control: "text",
      type: { name: "string", required: true },
      table: {
        type: { summary: "ReactNode" },
      },
    },
    variant: {
      control: "select",
      description: "버튼의 시각적 스타일을 결정합니다",
      options: [
        "primary",
        "secondary",
        "accent",
        "success",
        "warning",
        "error",
        "outline",
        "ghost",
        "link",
      ],
      defaultValue: "primary",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: "select",
      description: "버튼의 크기를 결정합니다",
      options: ["xs", "sm", "md", "lg", "xl"],
      defaultValue: "md",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    shape: {
      control: "select",
      description: "버튼의 모서리 스타일을 결정합니다",
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
    loadingText: {
      control: "text",
      description: "로딩 중일 때 표시할 텍스트입니다",
      defaultValue: "Loading...",
    },
    disabled: {
      control: "boolean",
      description: "버튼의 비활성화 상태를 결정합니다",
      defaultValue: false,
    },
    fullWidth: {
      control: "boolean",
      description: "버튼이 컨테이너의 전체 너비를 차지하도록 합니다",
      defaultValue: false,
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: "Button",
    variant: "primary",
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "OneQ Order의 브랜드 아이덴티티와 사용 목적에 따라 구분된 버튼 변형입니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="accent">Accent</Button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="error">Error</Button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
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
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
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
    <div className="flex flex-wrap gap-4">
      <Button shape="rounded">Rounded</Button>
      <Button shape="pill">Pill</Button>
      <Button shape="square">Square</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "아이콘을 추가하여 버튼의 목적을 더 명확하게 전달할 수 있습니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button leftIcon={<Mail className="w-4 h-4" />}>Send Email</Button>
      <Button rightIcon={<ArrowRight className="w-4 h-4" />}>Next Step</Button>
      <Button
        leftIcon={<Mail className="w-4 h-4" />}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Send and Continue
      </Button>
    </div>
  ),
};

export const LoadingStates: Story = {
  parameters: {
    docs: {
      description: {
        story: "작업 진행 중임을 사용자에게 명확하게 전달합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button isLoading>Loading</Button>
      <Button isLoading loadingText="Sending...">
        Send Email
      </Button>
      <Button variant="outline" isLoading loadingText="Saving...">
        Save Changes
      </Button>
    </div>
  ),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: "버튼의 다양한 상태를 시각적으로 표현합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <Button>Normal</Button>
        <Button disabled>Disabled</Button>
      </div>
      <Button fullWidth>Full Width Button</Button>
    </div>
  ),
};

const SampleExampleComponent = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // 제출 프로세스 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      alert("주문이 성공적으로 완료되었습니다!");
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-sm border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">주문 결제 진행</h3>
        <div className="text-sm text-neutral-500">
          단계 {currentStep} / {totalSteps}
        </div>
      </div>

      {/* 단계별 내용 */}
      {currentStep === 1 && (
        <div className="space-y-4 mb-6">
          <h4 className="font-medium">배송지 정보</h4>
          <p className="text-sm text-neutral-600">
            배송지 정보를 입력하고 다음 단계로 진행해주세요.
          </p>
          <div className="flex mb-4 mt-6 gap-2">
            <Button
              variant="outline"
              leftIcon={<ShoppingCart className="w-4 h-4" />}
              size="sm"
            >
              최근 배송지
            </Button>
            <Button
              variant="ghost"
              leftIcon={<Save className="w-4 h-4" />}
              size="sm"
            >
              배송지 저장
            </Button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4 mb-6">
          <h4 className="font-medium">결제 수단 선택</h4>
          <p className="text-sm text-neutral-600">
            원하시는 결제 수단을 선택해주세요.
          </p>
          <div className="flex gap-2 mb-4 mt-6">
            <Button variant="secondary" size="sm">
              신용카드
            </Button>
            <Button variant="outline" size="sm">
              계좌이체
            </Button>
            <Button variant="outline" size="sm">
              간편결제
            </Button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4 mb-6">
          <h4 className="font-medium">주문 확인</h4>
          <p className="text-sm text-neutral-600">
            주문 내역을 확인하고 결제를 완료해주세요.
          </p>
          <div className="p-4 bg-neutral-50 rounded-md mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>상품 금액</span>
              <span>35,000원</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>배송비</span>
              <span>2,500원</span>
            </div>
            <div className="flex justify-between font-medium mt-2 pt-2 border-t border-neutral-200">
              <span>총 결제 금액</span>
              <span className="text-[#FF6B35]">37,500원</span>
            </div>
          </div>
        </div>
      )}

      {/* 단계 이동 버튼 */}
      <div className="flex justify-between pt-4 mt-4 border-t border-neutral-100">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 1}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          이전
        </Button>

        <div className="flex gap-2">
          <Button variant="ghost" size="md">
            취소
          </Button>

          {currentStep < totalSteps ? (
            <Button
              variant="primary"
              onClick={handleNext}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              다음
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="처리중..."
              leftIcon={!isLoading && <Loader className="w-4 h-4" />}
            >
              결제하기
            </Button>
          )}
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
          "실제 사용 예시를 보여주는 예제입니다. 여러 종류의 버튼을 활용한 UI를 구성합니다.",
      },
    },
  },
  render: () => <SampleExampleComponent />,
};
