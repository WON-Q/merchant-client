import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/Input";
import {
  Search,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Calendar,
  AlertCircle,
} from "lucide-react";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "다양한 입력 필드를 생성할 수 있는 컴포넌트입니다. 여러 가지 크기, 스타일, 상태를 지원합니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "ghost"],
      description: "입력 필드의 변형 스타일",
      defaultValue: "default",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "입력 필드의 크기",
      defaultValue: "md",
    },
    shape: {
      control: "select",
      options: ["rounded", "pill", "square"],
      description: "입력 필드의 모서리 모양",
      defaultValue: "rounded",
    },
    placeholder: {
      control: "text",
      description: "입력 필드의 플레이스홀더 텍스트",
    },
    disabled: {
      control: "boolean",
      description: "입력 필드의 비활성화 상태",
      defaultValue: false,
    },
    isError: {
      control: "boolean",
      description: "입력 필드의 오류 상태",
      defaultValue: false,
    },
    errorMessage: {
      control: "text",
      description: "오류 발생 시 표시할 메시지",
    },
    isLoading: {
      control: "boolean",
      description: "입력 필드의 로딩 상태",
      defaultValue: false,
    },
    fullWidth: {
      control: "boolean",
      description: "입력 필드가 컨테이너의 전체 너비를 차지할지 여부",
      defaultValue: true,
    },
    label: {
      control: "text",
      description: "입력 필드에 대한 레이블",
    },
    isRequired: {
      control: "boolean",
      description: "필수 입력 필드 여부",
      defaultValue: false,
    },
    type: {
      control: "select",
      options: [
        "text",
        "password",
        "email",
        "number",
        "tel",
        "url",
        "search",
        "date",
      ],
      description: "입력 필드의 타입",
      defaultValue: "text",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    placeholder: "텍스트를 입력하세요",
    variant: "default",
    size: "md",
    shape: "rounded",
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "입력 필드의 사용 목적과 컨텍스트에 따라 적절한 변형을 선택할 수 있습니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input variant="default" placeholder="기본 스타일" />
      <Input variant="outline" placeholder="외곽선 스타일" />
      <Input variant="ghost" placeholder="고스트 스타일" />
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "다양한 UI 컨텍스트에 맞춰 사용할 수 있는 5가지 크기를 제공합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input size="xs" placeholder="Extra Small" />
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
      <Input size="xl" placeholder="Extra Large" />
    </div>
  ),
};

export const Shapes: Story = {
  parameters: {
    docs: {
      description: {
        story: "입력 필드의 모서리 스타일을 상황에 맞게 선택할 수 있습니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input shape="rounded" placeholder="둥근 모서리" />
      <Input shape="pill" placeholder="알약형" />
      <Input shape="square" placeholder="직각 모서리" />
    </div>
  ),
};

export const WithLabels: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "레이블을 추가하여 사용자에게 입력 필드의 목적을 명확하게 전달할 수 있습니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input label="이름" placeholder="이름을 입력하세요" />
      <Input label="이메일" placeholder="이메일을 입력하세요" type="email" />
      <Input label="핸드폰 번호" placeholder="연락처를 입력하세요" type="tel" />
      <Input
        label="배송 메모"
        placeholder="필요한 배송 요청사항을 입력하세요"
        isRequired
      />
    </div>
  ),
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "아이콘을 추가하여 입력 필드의 목적이나 기능을 직관적으로 전달할 수 있습니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input leftIcon={<Search className="w-4 h-4" />} placeholder="검색..." />
      <Input
        leftIcon={<User className="w-4 h-4" />}
        placeholder="사용자 이름"
      />
      <Input
        leftIcon={<Mail className="w-4 h-4" />}
        placeholder="이메일 주소"
        type="email"
      />
      <Input
        leftIcon={<Calendar className="w-4 h-4" />}
        type="date"
        placeholder="날짜 선택"
      />
    </div>
  ),
};

// 비밀번호 예시를 위한 별도 컴포넌트
const PasswordInputExample = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Input
      type={showPassword ? "text" : "password"}
      leftIcon={<Lock className="w-4 h-4" />}
      rightIcon={
        showPassword ? (
          <EyeOff
            className="w-4 h-4 cursor-pointer"
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <Eye
            className="w-4 h-4 cursor-pointer"
            onClick={() => setShowPassword(true)}
          />
        )
      }
      placeholder="비밀번호 입력"
      label="비밀번호"
    />
  );
};

export const PasswordInput: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "비밀번호 필드에 표시/숨김 기능을 아이콘과 함께 구현한 예시입니다.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <PasswordInputExample />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: "입력 필드의 다양한 상태를 시각적으로 표현합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input placeholder="기본 상태" />
      <Input placeholder="비활성화 상태" disabled />
      <Input placeholder="로딩 상태" isLoading />
      <Input
        placeholder="오류 상태"
        isError
        errorMessage="유효하지 않은 입력입니다."
      />
      <Input
        leftIcon={<AlertCircle className="w-4 h-4 text-[#EF4444]" />}
        placeholder="이메일 주소가 올바르지 않습니다"
        isError
        errorMessage="올바른 이메일 형식을 입력하세요."
      />
    </div>
  ),
};

// FormExample 컴포넌트로 분리하여 훅 사용
const SampleExampleComponent = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 입력 중 오류 메시지 지우기
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = () => {
    const errors = {
      name: !formData.name ? "이름을 입력하세요" : "",
      email: !formData.email
        ? "이메일을 입력하세요"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ? "유효한 이메일 형식이 아닙니다"
        : "",
      phone: !formData.phone ? "연락처를 입력하세요" : "",
      address: !formData.address ? "주소를 입력하세요" : "",
    };

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (!hasErrors) {
      setIsLoading(true);
      // 성공적인 폼 제출 시뮬레이션
      setTimeout(() => {
        setIsLoading(false);
        alert("회원 정보가 성공적으로 저장되었습니다!");
        // 폼 초기화
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
        });
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm border border-neutral-100">
      <h3 className="text-lg font-medium text-neutral-900 mb-4">
        회원 정보 입력
      </h3>

      <div className="flex flex-col gap-4">
        <Input
          label="이름"
          placeholder="이름을 입력하세요"
          leftIcon={<User className="w-4 h-4" />}
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          isError={!!formErrors.name}
          errorMessage={formErrors.name}
          isRequired
        />

        <Input
          label="이메일"
          type="email"
          placeholder="이메일을 입력하세요"
          leftIcon={<Mail className="w-4 h-4" />}
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          isError={!!formErrors.email}
          errorMessage={formErrors.email}
          isRequired
        />

        <Input
          label="연락처"
          type="tel"
          placeholder="연락처를 입력하세요"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          isError={!!formErrors.phone}
          errorMessage={formErrors.phone}
          isRequired
        />

        <Input
          label="주소"
          placeholder="주소를 입력하세요"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          isError={!!formErrors.address}
          errorMessage={formErrors.address}
          isRequired
        />

        <div className="mt-4">
          <button
            className={`w-full py-2.5 px-4 bg-[#FF6B35] text-white rounded-lg font-medium ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#E55A24]"
            }`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                저장 중...
              </span>
            ) : (
              "정보 저장하기"
            )}
          </button>
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
          "실제 폼에서 입력 필드를 사용하는 예시입니다. 유효성 검사, 오류 메시지 표시 등의 기능을 보여줍니다.",
      },
    },
  },
  render: () => <SampleExampleComponent />,
};
