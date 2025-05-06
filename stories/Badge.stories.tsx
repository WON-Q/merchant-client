import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@/components/ui/Badge";
import { CheckCheck, Clock, Crown, Shield, Star } from "lucide-react";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "배지 컴포넌트는 상태, 카테고리 또는 태그를 시각적으로 표시하는데 사용됩니다. 콤팩트한 크기로 메인 콘텐츠를 방해하지 않으면서 추가 정보를 제공합니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "배지에 표시될 텍스트 또는 내용입니다",
      type: { name: "string", required: true },
    },
    variant: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "accent",
        "success",
        "warning",
        "error",
        "outline",
        "ghost",
      ],
      description: "배지의 시각적 스타일을 결정합니다",
      defaultValue: "default",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
      description: "배지의 크기를 결정합니다",
      defaultValue: "md",
    },
    shape: {
      control: "select",
      options: ["rounded", "pill", "square"],
      description: "배지의 모서리 스타일을 결정합니다",
      defaultValue: "rounded",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: "Badge",
    variant: "primary",
    size: "md",
    shape: "rounded",
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: "다양한 상황에 맞는 배지 변형을 제공합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "다양한 크기의 배지를 제공합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge size="xs">Extra Small</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const Shapes: Story = {
  parameters: {
    docs: {
      description: {
        story: "다양한 모양의 배지를 제공합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge shape="rounded" variant="primary">
        Rounded
      </Badge>
      <Badge shape="pill" variant="primary">
        Pill
      </Badge>
      <Badge shape="square" variant="primary">
        Square
      </Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "아이콘을 추가하여 배지의 정보를 더 명확하게 전달할 수 있습니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge
        leftIcon={<CheckCheck className="w-3 h-3 mr-1" />}
        variant="success"
      >
        완료
      </Badge>
      <Badge leftIcon={<Clock className="w-3 h-3 mr-1" />} variant="warning">
        대기 중
      </Badge>
      <Badge leftIcon={<Star className="w-3 h-3 mr-1" />} variant="primary">
        추천
      </Badge>
      <Badge
        leftIcon={<Shield className="w-3 h-3 mr-1" />}
        rightIcon={<Crown className="w-3 h-3 ml-1" />}
        variant="accent"
      >
        프리미엄
      </Badge>
    </div>
  ),
};

export const StateIndicators: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "배지로 상태를 표시할 수 있습니다. 색상과 텍스트로 직관적인 상태 정보를 제공합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-8">
        <Badge variant="success">Active</Badge>
        <span className="text-sm">활성 상태</span>
      </div>
      <div className="flex items-center gap-8">
        <Badge variant="warning">Pending</Badge>
        <span className="text-sm">대기 상태</span>
      </div>
      <div className="flex items-center gap-8">
        <Badge variant="error">Failed</Badge>
        <span className="text-sm">실패 상태</span>
      </div>
      <div className="flex items-center gap-8">
        <Badge variant="default">Draft</Badge>
        <span className="text-sm">임시 저장</span>
      </div>
      <div className="flex items-center gap-8">
        <Badge variant="outline">Archived</Badge>
        <span className="text-sm">보관 상태</span>
      </div>
    </div>
  ),
};

const SampleExampleComponent = () => {
  return (
    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-sm border border-neutral-200">
      <h3 className="text-lg font-medium mb-4">제품 상세 정보</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="primary">프리미엄</Badge>
        <Badge variant="secondary">무료 배송</Badge>
        <Badge variant="success">재고 있음</Badge>
        <Badge variant="accent">인기 상품</Badge>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="h-20 w-20 bg-neutral-100 rounded-md"></div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium">울트라 HD 무선 이어폰</h4>
            <Badge size="xs" variant="primary" shape="pill">
              신제품
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 mt-1">고품질 오디오 경험</p>
          <div className="text-[#FF6B35] font-semibold mt-1">79,000원</div>
        </div>
      </div>

      <div className="border-t border-b py-3 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">평점</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= 4 ? "text-yellow-400" : "text-neutral-200"
                  }`}
                  fill={star <= 4 ? "currentColor" : "none"}
                />
              ))}
            </div>
          </div>
          <Badge size="sm" variant="ghost" className="text-neutral-500">
            132 리뷰
          </Badge>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-sm">색상</span>
          <div className="flex gap-1">
            <Badge size="xs" variant="ghost" shape="pill">
              블랙
            </Badge>
            <Badge size="xs" variant="ghost" shape="pill">
              화이트
            </Badge>
            <Badge size="xs" variant="primary" shape="pill">
              블루
            </Badge>
          </div>
        </div>

        <div className="flex justify-between">
          <span className="text-sm">무선 연결</span>
          <Badge size="xs" variant="success" shape="pill">
            블루투스 5.0
          </Badge>
        </div>

        <div className="flex justify-between">
          <span className="text-sm">배터리 수명</span>
          <Badge size="xs" variant="accent" shape="pill">
            최대 8시간
          </Badge>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-[#FF6B35] text-white rounded-md">
          구매하기
        </button>
      </div>
    </div>
  );
};

export const SampleExample: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "실제 제품 상세 페이지에서 다양한 배지를 활용하는 예시입니다. 상태, 특징, 옵션 등을 표시하는데 배지를 사용할 수 있습니다.",
      },
    },
  },
  render: () => <SampleExampleComponent />,
};
